const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateRosterSyncEventLogTable1658900411208 {
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ADD "event_data_id" TEXT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ADD "event_data_role" TEXT NULL`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" DROP COLUMN "event_data_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" DROP COLUMN "event_data_role"`,
    )
  }
}
