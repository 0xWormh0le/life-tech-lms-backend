const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateDistrictsTable1657688980304 {
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "event_id" character varying NULL`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "districts" DROP COLUMN "event_id"`)
  }
}
