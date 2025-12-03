import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    const count = await this.productsRepository.count();
    if (count === 0) {
      const products = [
        { name: 'Intel Core i9-14900K', type: 'cpu', price: 600, imageUrl: 'https://example.com/cpu.jpg', stock: 10 },
        { name: 'AMD Ryzen 9 7950X', type: 'cpu', price: 550, imageUrl: 'https://example.com/cpu_amd.jpg', stock: 10 },
        { name: 'NVIDIA RTX 4090', type: 'gpu', price: 1600, imageUrl: 'https://example.com/gpu.jpg', stock: 5 },
        { name: 'Corsair Vengeance 32GB', type: 'ram', price: 150, imageUrl: 'https://example.com/ram.jpg', stock: 20 },
      ];
      await this.productsRepository.save(products);
      console.log('Seeded initial products');
    }
  }

  create(createProductDto: CreateProductDto) {
    return this.productsRepository.save(createProductDto);
  }

  findAll(filterDto: GetProductsFilterDto) {
    const { search, type, minPrice, maxPrice } = filterDto;
    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (type) {
      where.type = type;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice);
    }

    return this.productsRepository.find({ where });
  }

  findOne(id: number) {
    return this.productsRepository.findOneBy({ id });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productsRepository.delete(id);
  }
}
