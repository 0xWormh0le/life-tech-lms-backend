const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateDistrictsTable1657718845935 {
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "districts" RENAME COLUMN "event_id" TO "last_roster_sync_event_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "last_roster_sync_event_date" timestamp NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "sync_started_date" timestamp NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "sync_ended_date" timestamp NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "roster_sync_error" character varying NULL`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "districts" RENAME COLUMN "event_id" TO "last_roster_sync_event_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" DROP COLUMN "last_roster_sync_event_date"`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" DROP COLUMN "sync_started_date"`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" DROP COLUMN "sync_ended_date"`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" DROP COLUMN "roster_sync_error"`,
    )
  }
}
