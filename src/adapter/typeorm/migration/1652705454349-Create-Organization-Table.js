const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateOrganizationTable1652705454349 {
  name = 'CreateOrganizationTable1652705454349'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "district_id" character varying NOT NULL, "state_id" character varying NOT NULL, "organization_lms_id" character varying, "created_user_id" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "name_district_id" UNIQUE ("name", "district_id"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "organizations"`)
  }
}
