import { MigrationInterface, QueryRunner } from "typeorm";
import { encrypt } from "../helpers/encypt.helper";

export class CreateUsers1716645261733 implements MigrationInterface {
  name = "CreateUsers1716645261733";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );

    const { INITIAL_ADMIN_PASSWORD = "SetPassword" } = process.env;
    const { INITIAL_ADMIN_EMAIL = "yourmail@example.com" } = process.env;
    const { INITIAL_ADMIN_NAME = "admin" } = process.env;

    // Create an admin user
    const hashedPassword = await encrypt.encryptpass(INITIAL_ADMIN_PASSWORD);
    await queryRunner.query(
      `INSERT INTO "users" ("name", "email", "password", "role") VALUES ($1, $2, $3, 'admin')`,
      [
        INITIAL_ADMIN_NAME,
        INITIAL_ADMIN_EMAIL,
        hashedPassword
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
