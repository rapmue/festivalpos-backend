import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from "typeorm";
import { VendorPoints } from "./VendorPoint";
import { SaleItem } from "./SaleItem";

@Entity("sales")
export class Sale {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => VendorPoints, (vendorPoint) => vendorPoint.sales, {
    onDelete: "CASCADE",
  })
  vendorPoint: VendorPoints;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.sale, {
    cascade: true,
  })
  saleItems: SaleItem[];

  @CreateDateColumn()
  saleDate: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
