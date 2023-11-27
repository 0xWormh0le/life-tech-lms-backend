const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateDistrictTable1655886924222 {
  name = 'UpdateDistrictTable1655886924222'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "districts" DROP COLUMN  IF EXISTS api_token`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" DROP COLUMN  IF EXISTS enable_roster_sync`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "api_token" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "enable_roster_sync" boolean NOT NULL DEFAULT false`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "districts" ADD COLUMN  IF NOT EXISTS api_token character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ADD COLUMN  IF NOT EXISTS enable_roster_sync BOOLEAN`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" DROP COLUMN "enable_roster_sync"`,
    )
    await queryRunner.query(`ALTER TABLE "districts" DROP COLUMN "api_token"`)
  }
}
