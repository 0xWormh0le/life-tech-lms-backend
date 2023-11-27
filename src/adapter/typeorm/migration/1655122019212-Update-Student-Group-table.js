const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateStudentGroupTable1655122019212 {
  name = 'UpdateStudentGroupTable1655122019212'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups" RENAME COLUMN "packageId" TO "package_id"`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups" RENAME COLUMN "package_id" TO "packageId"`,
    )
  }
}
