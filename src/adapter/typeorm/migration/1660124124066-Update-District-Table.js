const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateDistrictTable1660124124066 {
  name = 'UpdateDistrictTable1660124124066'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "classlink_app_id" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "classlink_access_token" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "classlink_tenant_id" character varying`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "districts" DROP COLUMN "classlink_tenant_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" DROP COLUMN "classlink_access_token"`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" DROP COLUMN "classlink_app_id"`,
    )
  }
}
