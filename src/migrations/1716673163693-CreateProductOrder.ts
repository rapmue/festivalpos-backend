import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductOrder1716673163693 implements MigrationInterface {
    name = 'CreateProductOrder1716673163693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_e8d0423a0edfac0e7eced106a7f"`);
        await queryRunner.query(`CREATE TABLE "vendor_point_products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "vendorPointId" uuid, "productId" uuid, CONSTRAINT "PK_cfc8b0d05033e71e557b351756b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "salesStandId"`);
        await queryRunner.query(`ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_031a321845efdda638ea235cf93" FOREIGN KEY ("vendorPointId") REFERENCES "sales_stands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_76b53fb52382d42064cb56a101a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_76b53fb52382d42064cb56a101a"`);
        await queryRunner.query(`ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_031a321845efdda638ea235cf93"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "salesStandId" uuid`);
        await queryRunner.query(`DROP TABLE "vendor_point_products"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_e8d0423a0edfac0e7eced106a7f" FOREIGN KEY ("salesStandId") REFERENCES "sales_stands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
