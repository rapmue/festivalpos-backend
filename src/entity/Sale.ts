import { Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm';
import { VendorPoints } from './VendorPoint';
import { SaleItem } from './SaleItem';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => VendorPoints)
  vendorPoint: VendorPoints;

  @OneToMany(() => SaleItem, saleItem => saleItem.sale, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  saleItems: SaleItem[];

  @CreateDateColumn()
  saleDate: Date;
}
