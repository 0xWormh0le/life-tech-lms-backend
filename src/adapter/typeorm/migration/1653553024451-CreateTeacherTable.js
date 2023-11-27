const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateTeacherTable1653553024451 {
  name = 'CreateTeacherTable1653553024451'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "teachers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "teacher_lms_id" character varying, "created_user_id" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "teacher_organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_user_id" character varying NOT NULL, "is_primary" boolean NOT NULL DEFAULT false, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "organization_id" uuid, "teacher_id" uuid, CONSTRAINT "PK_407eb93f957067347bdd8925026" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "teacher_organization" ADD CONSTRAINT "FK_7bdb2bbd280524255a25fcbca9c" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "teacher_organization" ADD CONSTRAINT "FK_4c7fb3eeb602d521bdad39d7391" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "teacher_organization" DROP CONSTRAINT "FK_4c7fb3eeb602d521bdad39d7391"`,
    )
    await queryRunner.query(
      `ALTER TABLE "teacher_organization" DROP CONSTRAINT "FK_7bdb2bbd280524255a25fcbca9c"`,
    )
    await queryRunner.query(`DROP TABLE "teacher_organization"`)
    await queryRunner.query(`DROP TABLE "teachers"`)
  }
}
