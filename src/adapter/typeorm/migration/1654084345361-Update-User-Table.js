const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateUserTable1654084345361 {
  name = 'UpdateUserTable1654084345361'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "login_id" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "login_id" SET NOT NULL`,
    )
  }
}
