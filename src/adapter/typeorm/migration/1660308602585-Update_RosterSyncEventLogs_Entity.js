const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateRosterSyncEventLogsEntity1660308602585 {
  name = 'UpdateRosterSyncEventLogsEntity1660308602585'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ALTER COLUMN "created_date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ALTER COLUMN "created_date" DROP DEFAULT`,
    )
  }
}
