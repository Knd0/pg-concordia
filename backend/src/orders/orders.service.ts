import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, customerName, customerContact, description, type } = createOrderDto;

    const orderItems: any[] = [];
    for (const item of items) {
      const product = await this.productsRepository.findOneBy({ id: item.productId });
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }
      
      const price = product.isOffer && product.offerPrice ? product.offerPrice : product.price;

      orderItems.push({
        product,
        quantity: item.quantity,
        price
      });
    }

    const order = this.ordersRepository.create({
      customerName,
      customerContact,
      description,
      type: type || 'CART',
      items: orderItems,
    });

    return this.ordersRepository.save(order);
  }

  findAll() {
    return this.ordersRepository.find({
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
  }

  async finalizeOrder(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, { 
        where: { id },
        relations: ['items', 'items.product']
      });
      
      if (!order) throw new NotFoundException('Order not found');
      if (order.status === 'COMPLETED') throw new BadRequestException('Order already completed');

      for (const item of order.items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.product.id } });
        
        if (!product) throw new NotFoundException(`Product ${item.product.name} not found`);
        
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }

      order.status = 'COMPLETED';
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateDescription(id: number, description: string) {
    await this.ordersRepository.update(id, { description });
    return this.findOne(id);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.ordersRepository.update(id, updateOrderDto);
  }

  remove(id: number) {
    return this.ordersRepository.delete(id);
  }
}
