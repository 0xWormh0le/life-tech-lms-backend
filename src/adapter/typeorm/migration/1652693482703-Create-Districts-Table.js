const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateDistrictsTable1652693482703 {
  name = 'CreateDistrictsTable1652693482703'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "districts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "lms_id" character varying NOT NULL, "district_lms_id" character varying, "created_user_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_6a6fd6d258022e5576afbad90b4" UNIQUE ("name"), CONSTRAINT "PK_972a72ff4e3bea5c7f43a2b98af" PRIMARY KEY ("id"))`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "districts"`)
  }
}
