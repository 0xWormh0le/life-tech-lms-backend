const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class RemoveUniqueConstraintStudentGroupTable1654001264429 {
  name = 'RemoveUniqueConstraintStudentGroupTable1654001264429'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups" DROP CONSTRAINT "unique_student_groups"`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups" ADD CONSTRAINT "unique_student_groups" UNIQUE ("name", "grade", "organization_id")`,
    )
  }
}
