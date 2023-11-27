const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateStudentGroupTable1653393423535 {
  name = 'CreateStudentGroupTable1653393423535'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "student_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "packageId" character varying NOT NULL, "grade" character varying, "student_group_lms_id" character varying, "created_user_id" character varying, "updated_user_id" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "organization_id" uuid, CONSTRAINT "unique_student_groups" UNIQUE ("name", "organization_id", "grade"), CONSTRAINT "PK_6c41d71f2919cb42d67fb795557" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups" ADD CONSTRAINT "FK_6dc5818b082cae5299841d19310" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups" DROP CONSTRAINT "FK_6dc5818b082cae5299841d19310"`,
    )
    await queryRunner.query(`DROP TABLE "student_groups"`)
  }
}
