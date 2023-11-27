const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class MadeLmsIdNullable1658113250634 {
  name = 'MadeLmsIdNullable1658113250634'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "districts" ALTER COLUMN "lms_id" DROP NOT NULL`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "districts" ALTER COLUMN "lms_id" SET NOT NULL`,
    )
  }
}
