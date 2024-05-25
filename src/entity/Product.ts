import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VendorPoints } from './VendorPoint';
import { VendorPointProduct } from './VendorPointProducts';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number

  @Column({ nullable: true })
  tilecolor?: string;

  @Column({ nullable: true })
  iconUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => VendorPointProduct, vendorPointProduct => vendorPointProduct.product)
  vendorPointProducts: VendorPointProduct[];
}
