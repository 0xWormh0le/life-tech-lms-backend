const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class RemoveNotNullConstraintFromEventDataRole1662529401696 {
  name = 'RemoveNotNullConstraintFromEventDataRole1662529401696'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ALTER COLUMN "event_data_role" DROP NOT NULL`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ALTER COLUMN "event_data_role" SET NOT NULL`,
    )
  }
}
