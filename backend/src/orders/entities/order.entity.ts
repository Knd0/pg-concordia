import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column()
  customerName: string;

  @Column()
  customerContact: string;

  @Column({ default: 'PENDING' }) // PENDING, COMPLETED, CANCELLED
  status: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'CART' }) // CART, BUILDER
  type: string;

  @CreateDateColumn()
  createdAt: Date;
}
