const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateRosterSyncEventLogTable1658319422947 {
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ADD "error" TEXT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ALTER COLUMN "created_date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" DROP COLUMN "error"`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ALTER COLUMN "created_date" DROP DEFAULT`,
    )
  }
}
