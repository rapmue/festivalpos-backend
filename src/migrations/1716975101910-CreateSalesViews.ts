import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSalesViews1716975101910 implements MigrationInterface {
  name = "CreateSalesViews1716975101910";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE VIEW "view_vender_point_sales_summary" AS SELECT "vp"."name" AS "vendor_point_name", COUNT(DISTINCT "s"."id") AS "total_sales_transactions", SUM("si"."quantity") AS "total_quantity", SUM("si"."sellingPrice" * "si"."quantity") AS "total_revenue" FROM "sales" "s" LEFT JOIN "sale_items" "si" ON "si"."saleId" = "s"."id"  LEFT JOIN "sales_stands" "vp" ON "s"."vendorPointId" = "vp"."id" GROUP BY "vp"."name"`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        "public",
        "VIEW",
        "view_vender_point_sales_summary",
        'SELECT "vp"."name" AS "vendor_point_name", COUNT(DISTINCT "s"."id") AS "total_sales_transactions", SUM("si"."quantity") AS "total_quantity", SUM("si"."sellingPrice" * "si"."quantity") AS "total_revenue" FROM "sales" "s" LEFT JOIN "sale_items" "si" ON "si"."saleId" = "s"."id"  LEFT JOIN "sales_stands" "vp" ON "s"."vendorPointId" = "vp"."id" GROUP BY "vp"."name"',
      ],
    );
    await queryRunner.query(
      `CREATE VIEW "view_product_sales_summary" AS SELECT "p"."name" AS "product_name", "vp"."name" AS "vendor_point_name", SUM("si"."quantity") AS "total_quantity", SUM("si"."sellingPrice" * "si"."quantity") AS "total_revenue" FROM "sale_items" "si" LEFT JOIN "product" "p" ON "si"."productId" = "p"."id"  LEFT JOIN "sales" "s" ON "si"."saleId" = "s"."id"  LEFT JOIN "sales_stands" "vp" ON "s"."vendorPointId" = "vp"."id" GROUP BY "p"."name", "vp"."name"`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        "public",
        "VIEW",
        "view_product_sales_summary",
        'SELECT "p"."name" AS "product_name", "vp"."name" AS "vendor_point_name", SUM("si"."quantity") AS "total_quantity", SUM("si"."sellingPrice" * "si"."quantity") AS "total_revenue" FROM "sale_items" "si" LEFT JOIN "product" "p" ON "si"."productId" = "p"."id"  LEFT JOIN "sales" "s" ON "si"."saleId" = "s"."id"  LEFT JOIN "sales_stands" "vp" ON "s"."vendorPointId" = "vp"."id" GROUP BY "p"."name", "vp"."name"',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ["VIEW", "view_product_sales_summary", "public"],
    );
    await queryRunner.query(`DROP VIEW "view_product_sales_summary"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ["VIEW", "view_vender_point_sales_summary", "public"],
    );
    await queryRunner.query(`DROP VIEW "view_vender_point_sales_summary"`);
  }
}
