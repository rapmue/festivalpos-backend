import { MigrationInterface, QueryRunner } from "typeorm";

export class VendorPointsAndProducts1716643666906 implements MigrationInterface {
    name = 'VendorPointsAndProducts1716643666906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric(5,2) NOT NULL, "tilecolor" character varying, "iconUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "salesStandId" uuid, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sales_stands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d48be3a8aeb230c9d800d7c2c5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_e8d0423a0edfac0e7eced106a7f" FOREIGN KEY ("salesStandId") REFERENCES "sales_stands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_e8d0423a0edfac0e7eced106a7f"`);
        await queryRunner.query(`DROP TABLE "sales_stands"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
