import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSales1716961796110 implements MigrationInterface {
    name = 'CreateSales1716961796110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "saleDate" TIMESTAMP NOT NULL DEFAULT now(), "vendorPointId" uuid, CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "sellingPrice" numeric(5,2) NOT NULL, "saleId" uuid, "productId" uuid, CONSTRAINT "PK_439a57a4a0d130329d3d2e671b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_f1af918699fb0b28ae0c5c19c31" FOREIGN KEY ("vendorPointId") REFERENCES "sales_stands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_item" ADD CONSTRAINT "FK_59208ed392dd61056abbcf1482e" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_item" ADD CONSTRAINT "FK_d4361a12f11a57a6cf2a2ee6ac9" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_item" DROP CONSTRAINT "FK_d4361a12f11a57a6cf2a2ee6ac9"`);
        await queryRunner.query(`ALTER TABLE "sale_item" DROP CONSTRAINT "FK_59208ed392dd61056abbcf1482e"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_f1af918699fb0b28ae0c5c19c31"`);
        await queryRunner.query(`DROP TABLE "sale_item"`);
        await queryRunner.query(`DROP TABLE "sales"`);
    }

}
