import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Product } from "./Product";
import { Sale } from "./Sale";
import { VendorPoints } from "./VendorPoint";

@Entity("festivals")
export class Festival {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  save_sales: boolean = true;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Product, (product) => product.festival, {
    cascade: true,
  })
  products: Product[];

  @OneToMany(() => VendorPoints, (vendorPoint) => vendorPoint.festival, {
    cascade: true,
  })
  vendorPoints: VendorPoints[];
}
