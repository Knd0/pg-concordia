import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShopSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  mercadoPagoAccessToken: string;

  @Column({ nullable: true })
  mercadoPagoRefreshToken: string;

  @Column({ nullable: true })
  mercadoPagoPublicKey: string;

  @Column({ nullable: true })
  mercadoPagoUserId: string;

  @Column({ nullable: true })
  mercadoPagoExpiresIn: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
