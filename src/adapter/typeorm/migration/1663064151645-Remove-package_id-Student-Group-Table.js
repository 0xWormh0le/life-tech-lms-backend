const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class RemovePackageIdStudentGroupTable1663064151645 {
  name = 'RemovePackageIdStudentGroupTable1663064151645'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups" DROP COLUMN "package_id"`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups" ADD "package_id" character varying`,
    )
  }
}
