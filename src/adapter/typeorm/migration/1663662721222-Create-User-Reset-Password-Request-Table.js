const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateUserResetPasswordRequestTable1663662721222 {
  name = 'CreateUserResetPasswordRequestTable1663662721222'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "user_reset_password_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "token" character varying NOT NULL, "expiry" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_07a90998b09f0c6391130a8e482" UNIQUE ("user_id"), CONSTRAINT "PK_6bfb4ed26f141a6b8a0594c74d9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_af63b23fa37f50fd0716eb485f" ON "user_reset_password_request" ("token") `,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_af63b23fa37f50fd0716eb485f"`,
    )
    await queryRunner.query(`DROP TABLE "user_reset_password_request"`)
  }
}
