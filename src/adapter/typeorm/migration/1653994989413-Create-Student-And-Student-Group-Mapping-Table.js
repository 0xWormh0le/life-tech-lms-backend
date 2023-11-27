const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateStudentAndStudentGroupMappingTable1653994989413 {
  name = 'CreateStudentAndStudentGroupMappingTable1653994989413'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "nick_name" character varying NOT NULL, "student_lms_id" character varying, "emails_to_notify" character varying, "created_user_id" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "student_groups_students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_user_id" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "student_id" uuid, "student_group_id" uuid, CONSTRAINT "REL_d066c01420bdfb77099ff03702" UNIQUE ("student_id"), CONSTRAINT "REL_38881816fddb77dddca5786c8b" UNIQUE ("student_group_id"), CONSTRAINT "PK_69f79d0f73ea8d510c927a150b6" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" ADD CONSTRAINT "FK_d066c01420bdfb77099ff037020" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" ADD CONSTRAINT "FK_38881816fddb77dddca5786c8b1" FOREIGN KEY ("student_group_id") REFERENCES "student_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" DROP CONSTRAINT "FK_38881816fddb77dddca5786c8b1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" DROP CONSTRAINT "FK_d066c01420bdfb77099ff037020"`,
    )
    await queryRunner.query(`DROP TABLE "student_groups_students"`)
    await queryRunner.query(`DROP TABLE "students"`)
  }
}
