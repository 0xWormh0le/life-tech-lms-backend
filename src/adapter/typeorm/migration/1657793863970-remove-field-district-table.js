const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class removeFieldDistrictTable1657793863970 {
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "districts" DROP COLUMN  IF EXISTS api_token`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "districts" ADD COLUMN  IF NOT EXISTS api_token character varying`,
    )
  }
}
