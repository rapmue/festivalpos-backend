import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCascades1716965494927 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add CASCADE on delete for vendor_point_products linked to sales_stands
        await queryRunner.query(`ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_031a321845efdda638ea235cf93"`);
        await queryRunner.query(`ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_031a321845efdda638ea235cf93" FOREIGN KEY ("vendorPointId") REFERENCES "sales_stands"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        // Add CASCADE on delete for vendor_point_products linked to product
        await queryRunner.query(`ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_76b53fb52382d42064cb56a101a"`);
        await queryRunner.query(`ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_76b53fb52382d42064cb56a101a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        // Add CASCADE on delete for sale_item linked to sales
        await queryRunner.query(`ALTER TABLE "sale_item" DROP CONSTRAINT "FK_59208ed392dd61056abbcf1482e"`);
        await queryRunner.query(`ALTER TABLE "sale_item" ADD CONSTRAINT "FK_59208ed392dd61056abbcf1482e" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        // Add CASCADE on delete for sale_item linked to product
        await queryRunner.query(`ALTER TABLE "sale_item" DROP CONSTRAINT "FK_d4361a12f11a57a6cf2a2ee6ac9"`);
        await queryRunner.query(`ALTER TABLE "sale_item" ADD CONSTRAINT "FK_d4361a12f11a57a6cf2a2ee6ac9" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert cascading deletions setup by adding back the original constraints without cascade
        await queryRunner.query(`ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_031a321845efdda638ea235cf93"`);
        await queryRunner.query(`ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_031a321845efdda638ea235cf93" FOREIGN KEY ("vendorPointId") REFERENCES "sales_stands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "vendor_point_products" DROP CONSTRAINT "FK_76b53fb52382d42064cb56a101a"`);
        await queryRunner.query(`ALTER TABLE "vendor_point_products" ADD CONSTRAINT "FK_76b53fb52382d42064cb56a101a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "sale_item" DROP CONSTRAINT "FK_59208ed392dd61056abbcf1482e"`);
        await queryRunner.query(`ALTER TABLE "sale_item" ADD CONSTRAINT "FK_59208ed392dd61056abbcf1482e" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "sale_item" DROP CONSTRAINT "FK_d4361a12f11a57a6cf2a2ee6ac9"`);
        await queryRunner.query(`ALTER TABLE "sale_item" ADD CONSTRAINT "FK_d4361a12f11a57a6cf2a2ee6ac9" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
