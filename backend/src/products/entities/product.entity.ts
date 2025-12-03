import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // 'cpu', 'gpu', 'ram', etc.

  @Column()
  price: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: false })
  isOffer: boolean;

  @Column({ nullable: true })
  offerPrice: number;
}
