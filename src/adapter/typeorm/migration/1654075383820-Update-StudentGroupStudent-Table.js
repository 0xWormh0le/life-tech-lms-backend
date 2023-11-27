const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateStudentGroupStudentTable1654075383820 {
  name = 'UpdateStudentGroupStudentTable1654075383820'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" DROP CONSTRAINT "FK_d066c01420bdfb77099ff037020"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" DROP CONSTRAINT "FK_38881816fddb77dddca5786c8b1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" DROP CONSTRAINT "REL_d066c01420bdfb77099ff03702"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" DROP CONSTRAINT "REL_38881816fddb77dddca5786c8b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" ADD CONSTRAINT "FK_d066c01420bdfb77099ff037020" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" ADD CONSTRAINT "FK_38881816fddb77dddca5786c8b1" FOREIGN KEY ("student_group_id") REFERENCES "student_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" DROP CONSTRAINT "FK_38881816fddb77dddca5786c8b1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" DROP CONSTRAINT "FK_d066c01420bdfb77099ff037020"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" ADD CONSTRAINT "REL_38881816fddb77dddca5786c8b" UNIQUE ("student_group_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" ADD CONSTRAINT "REL_d066c01420bdfb77099ff03702" UNIQUE ("student_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" ADD CONSTRAINT "FK_38881816fddb77dddca5786c8b1" FOREIGN KEY ("student_group_id") REFERENCES "student_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups_students" ADD CONSTRAINT "FK_d066c01420bdfb77099ff037020" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
