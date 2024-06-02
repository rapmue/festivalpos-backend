import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { VendorPoints } from "./VendorPoint";
import { Product } from "./Product";

@Entity("vendor_point_products")
export class VendorPointProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => VendorPoints,
    (vendorPoint) => vendorPoint.vendorPointProducts,
    { eager: true },
  )
  vendorPoint: VendorPoints;

  @ManyToOne(() => Product, (product) => product.vendorPointProducts, {
    eager: true,
  })
  product: Product;

  @Column()
  order: number;
}
