import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Sale } from "./Sale";
import { Product } from "./Product";

@Entity("sale_items")
export class SaleItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Sale, (sale) => sale.saleItems)
  sale: Sale;

  @ManyToOne(() => Product)
  product: Product;

  @Column("int")
  quantity: number;

  @Column("decimal", { precision: 5, scale: 2 })
  sellingPrice: number;
}
