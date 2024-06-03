import { MigrationInterface, QueryRunner } from "typeorm";

export class SoftDeletion1717444733406 implements MigrationInterface {
  name = "SoftDeletion1717444733406";

  public async up(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(
      `ALTER TABLE "sale_items" DROP CONSTRAINT "FK_c642be08de5235317d4cf3deb40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" DROP CONSTRAINT "FK_f1af918699fb0b28ae0c5c19c31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_031a321845efdda638ea235cf93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_76b53fb52382d42064cb56a101a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "festivals" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "product" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "sale_items" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "sales" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "sales_stands" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_items" ADD CONSTRAINT "FK_c642be08de5235317d4cf3deb40" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" ADD CONSTRAINT "FK_f1af918699fb0b28ae0c5c19c31" FOREIGN KEY ("vendorPointId") REFERENCES "sales_stands"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_031a321845efdda638ea235cf93" FOREIGN KEY ("vendorPointId") REFERENCES "sales_stands"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_76b53fb52382d42064cb56a101a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE VIEW "view_vender_point_sales_summary" AS SELECT "vp"."name" AS "vendor_point_name", COUNT(DISTINCT "s"."id") AS "total_sales_transactions", SUM("si"."quantity") AS "total_quantity", SUM("si"."sellingPrice" * "si"."quantity") AS "total_revenue" FROM "sales" "s" LEFT JOIN "sale_items" "si" ON  "si"."saleId" = "s"."id" AND "si"."deletedAt" IS NULL  LEFT JOIN "sales_stands" "vp" ON  "s"."vendorPointId" = "vp"."id" AND "vp"."deletedAt" IS NULL WHERE "s"."deletedAt" IS NULL GROUP BY "vp"."name"`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        "public",
        "VIEW",
        "view_vender_point_sales_summary",
        'SELECT "vp"."name" AS "vendor_point_name", COUNT(DISTINCT "s"."id") AS "total_sales_transactions", SUM("si"."quantity") AS "total_quantity", SUM("si"."sellingPrice" * "si"."quantity") AS "total_revenue" FROM "sales" "s" LEFT JOIN "sale_items" "si" ON  "si"."saleId" = "s"."id" AND "si"."deletedAt" IS NULL  LEFT JOIN "sales_stands" "vp" ON  "s"."vendorPointId" = "vp"."id" AND "vp"."deletedAt" IS NULL WHERE "s"."deletedAt" IS NULL GROUP BY "vp"."name"',
      ],
    );
    await queryRunner.query(
      `CREATE VIEW "view_product_sales_summary" AS SELECT "p"."name" AS "product_name", "vp"."name" AS "vendor_point_name", SUM("si"."quantity") AS "total_quantity", SUM("si"."sellingPrice" * "si"."quantity") AS "total_revenue" FROM "sale_items" "si" LEFT JOIN "product" "p" ON  "si"."productId" = "p"."id" AND "p"."deletedAt" IS NULL  LEFT JOIN "sales" "s" ON  "si"."saleId" = "s"."id" AND "s"."deletedAt" IS NULL  LEFT JOIN "sales_stands" "vp" ON  "s"."vendorPointId" = "vp"."id" AND "vp"."deletedAt" IS NULL WHERE "si"."deletedAt" IS NULL GROUP BY "p"."name", "vp"."name"`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        "public",
        "VIEW",
        "view_product_sales_summary",
        'SELECT "p"."name" AS "product_name", "vp"."name" AS "vendor_point_name", SUM("si"."quantity") AS "total_quantity", SUM("si"."sellingPrice" * "si"."quantity") AS "total_revenue" FROM "sale_items" "si" LEFT JOIN "product" "p" ON  "si"."productId" = "p"."id" AND "p"."deletedAt" IS NULL  LEFT JOIN "sales" "s" ON  "si"."saleId" = "s"."id" AND "s"."deletedAt" IS NULL  LEFT JOIN "sales_stands" "vp" ON  "s"."vendorPointId" = "vp"."id" AND "vp"."deletedAt" IS NULL WHERE "si"."deletedAt" IS NULL GROUP BY "p"."name", "vp"."name"',
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
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_76b53fb52382d42064cb56a101a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_031a321845efdda638ea235cf93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" DROP CONSTRAINT "FK_f1af918699fb0b28ae0c5c19c31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_items" DROP CONSTRAINT "FK_c642be08de5235317d4cf3deb40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_stands" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "sale_items" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "festivals" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_76b53fb52382d42064cb56a101a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_031a321845efdda638ea235cf93" FOREIGN KEY ("vendorPointId") REFERENCES "sales_stands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" ADD CONSTRAINT "FK_f1af918699fb0b28ae0c5c19c31" FOREIGN KEY ("vendorPointId") REFERENCES "sales_stands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_items" ADD CONSTRAINT "FK_c642be08de5235317d4cf3deb40" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
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
}
