import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToOne,
  DeleteDateColumn,
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

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(
    () => VendorPointProduct,
    (vendorPointProduct) => vendorPointProduct.vendorPoint,
    {
      cascade: true,
    },
  )
  vendorPointProducts: VendorPointProduct[];

  @OneToMany(() => Sale, (sale) => sale.vendorPoint, {
    cascade: true,
  })
  sales: Sale[];

  @ManyToOne(() => Festival, (festival) => festival.vendorPoints, {
    onDelete: "CASCADE",
  })
  festival: Festival;
}
