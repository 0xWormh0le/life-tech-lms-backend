const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateTableRosterSyncEventLogs1657781024878 {
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "roster_sync_event_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "district_id" character varying NOT NULL, "event_id" character varying NOT NULL, "event_type" character varying NOT NULL, "event_created_date" character varying NOT NULL, "created_user_id" character varying NULL, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone)`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "roster_sync_event_logs"`)
  }
}
