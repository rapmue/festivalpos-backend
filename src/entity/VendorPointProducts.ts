import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from "typeorm";
import { VendorPoints } from "./VendorPoint";
import { Product } from "./Product";

@Entity("vendor_point_products")
export class VendorPointProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => VendorPoints,
    (vendorPoint) => vendorPoint.vendorPointProducts,
    { eager: true, onDelete: "CASCADE" },
  )
  vendorPoint: VendorPoints;

  @ManyToOne(() => Product, (product) => product.vendorPointProducts, {
    eager: true,
    onDelete: "CASCADE",
  })
  product: Product;

  @Column()
  order: number;

  @DeleteDateColumn()
  deletedAt?: Date;
}
