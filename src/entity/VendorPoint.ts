import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { Product } from "./Product";
import { VendorPointProduct } from "./VendorPointProducts";
import { Sale } from "./Sale";
import { Festival } from "./Festival";

@Entity("sales_stands")
export class VendorPoints {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => VendorPointProduct,
    (vendorPointProduct) => vendorPointProduct.vendorPoint,
    {
      cascade: true,
      onDelete: "CASCADE",
    },
  )
  vendorPointProducts: VendorPointProduct[];

  @OneToMany(() => Sale, (sale) => sale.vendorPoint) // Add this line
  sales: Sale[];

  @ManyToOne(() => Festival, (festival) => festival.vendorPoints, {
    cascade: true,
    onDelete: "CASCADE",
  })
  festival: Festival;
}
