const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class AddStudentGroupPackaeAssignmentTable1661864319356 {
  name = 'AddStudentGroupPackaeAssignmentTable1661864319356'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "student_group_package_assignment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "package_category_id" character varying NOT NULL, "package_id" character varying NOT NULL, "student_group_id" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "package_category_id_package_id_student_group_id" UNIQUE ("package_category_id", "package_id", "student_group_id"), CONSTRAINT "PK_763e0f913ad873ac3732f0685e8" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_fe982186f4ab5f0c2e613f645f" ON "student_group_package_assignment" ("package_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ef237ea3c743708665fbaea109" ON "student_group_package_assignment" ("student_group_id") `,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ef237ea3c743708665fbaea109"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fe982186f4ab5f0c2e613f645f"`,
    )
    await queryRunner.query(`DROP TABLE "student_group_package_assignment"`)
  }
}
