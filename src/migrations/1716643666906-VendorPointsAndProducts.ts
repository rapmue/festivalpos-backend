import { MigrationInterface, QueryRunner } from "typeorm";

export class VendorPointsAndProducts1716643666906
  implements MigrationInterface
{
  name = "VendorPointsAndProducts1716643666906";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric(5,2) NOT NULL, "tilecolor" character varying, "iconUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sales_stands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d48be3a8aeb230c9d800d7c2c5d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vendor_point_products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "vendorPointId" uuid, "productId" uuid, CONSTRAINT "PK_cfc8b0d05033e71e557b351756b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_031a321845efdda638ea235cf93" FOREIGN KEY ("vendorPointId") REFERENCES "sales_stands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_76b53fb52382d42064cb56a101a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_76b53fb52382d42064cb56a101a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_031a321845efdda638ea235cf93"`,
    );
    await queryRunner.query(`DROP TABLE "vendor_point_products"`);
    await queryRunner.query(`DROP TABLE "sales_stands"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
