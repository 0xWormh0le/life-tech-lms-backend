const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateStudentGroupTable1656590452650 {
  name = 'UpdateStudentGroupTable1656590452650'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups" ALTER COLUMN "package_id" DROP NOT NULL`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups" ALTER COLUMN "package_id" SET NOT NULL`,
    )
  }
}
