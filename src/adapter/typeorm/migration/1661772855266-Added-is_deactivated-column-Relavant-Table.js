const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class AddedIsDeactivatedColumnRelavantTable1661772855266 {
  name = 'AddedIsDeactivatedColumnRelavantTable1661772855266'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "is_deactivated" boolean NOT NULL DEFAULT false`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators" ADD "is_deactivated" boolean NOT NULL DEFAULT false`,
    )
    await queryRunner.query(
      `ALTER TABLE "teachers" ADD "is_deactivated" boolean NOT NULL DEFAULT false`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" ADD "is_deactivated" boolean NOT NULL DEFAULT false`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "students" DROP COLUMN "is_deactivated"`,
    )
    await queryRunner.query(
      `ALTER TABLE "teachers" DROP COLUMN "is_deactivated"`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators" DROP COLUMN "is_deactivated"`,
    )
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_deactivated"`)
  }
}
