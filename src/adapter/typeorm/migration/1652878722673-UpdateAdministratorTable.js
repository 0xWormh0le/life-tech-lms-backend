const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateAdministratorTable1652878722673 {
  name = 'UpdateAdministratorTable1652878722673'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "administrators" ALTER COLUMN "first_name" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators" ALTER COLUMN "last_name" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators" ALTER COLUMN "administrator_lms_id" DROP NOT NULL`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "administrators" ALTER COLUMN "administrator_lms_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators" ALTER COLUMN "last_name" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators" ALTER COLUMN "first_name" SET NOT NULL`,
    )
  }
}
