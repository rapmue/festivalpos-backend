import { ViewEntity, ViewColumn, DataSource } from 'typeorm';

@ViewEntity({
    name: "view_product_sales_summary",
    expression: (dataSource: DataSource) => dataSource.createQueryBuilder()
        .select("p.name", "product_name")
        .addSelect("vp.name", "vendor_point_name")
        .addSelect("SUM(si.quantity)", "total_quantity")
        .addSelect("SUM(si.sellingPrice * si.quantity)", "total_revenue")
        .from("sale_item", "si")
        .leftJoin("product", "p", "si.productId = p.id")
        .leftJoin("sales", "s", "si.saleId = s.id")
        .leftJoin("sales_stands", "vp", "s.vendorPointId = vp.id")
        .groupBy("p.name")
        .addGroupBy("vp.name")
})
export class ProductSalesSummary {
    @ViewColumn()
    product_name: string;

    @ViewColumn()
    vendor_point_name: string;

    @ViewColumn()
    total_quantity: number;

    @ViewColumn()
    total_revenue: number;
}
