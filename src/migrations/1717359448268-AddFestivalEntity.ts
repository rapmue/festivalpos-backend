import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFestivalEntity1717359448268 implements MigrationInterface {
  name = "AddFestivalEntity1717359448268";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "festivals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "save_sales" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6d4d298db683d281bcaed953a46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "product" ADD "festivalId" uuid`);
    await queryRunner.query(`ALTER TABLE "sales_stands" ADD "festivalId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_f24339776406a21bceedc068af6" FOREIGN KEY ("festivalId") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_stands" ADD CONSTRAINT "FK_85d56d7cf5ed0692377cd22d547" FOREIGN KEY ("festivalId") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sales_stands" DROP CONSTRAINT "FK_85d56d7cf5ed0692377cd22d547"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_f24339776406a21bceedc068af6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales_stands" DROP COLUMN "festivalId"`,
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "festivalId"`);
    await queryRunner.query(`DROP TABLE "festivals"`);
  }
}
