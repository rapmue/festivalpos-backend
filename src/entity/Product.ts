import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { VendorPoints } from "./VendorPoint";
import { VendorPointProduct } from "./VendorPointProducts";
import { Festival } from "./Festival";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("decimal", { precision: 5, scale: 2 })
  price: number;

  @Column({ nullable: true })
  tilecolor?: string;

  @Column({ nullable: true })
  iconUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(
    () => VendorPointProduct,
    (vendorPointProduct) => vendorPointProduct.product,
    {
      cascade: true,
    },
  )
  vendorPointProducts: VendorPointProduct[];

  @ManyToOne(() => Festival, (festival) => festival.products, {
    onDelete: "CASCADE",
  })
  festival: Festival;
}
