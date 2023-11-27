const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateDistrictRosterSyncStatusTable1668516726981 {
  name = 'CreateDistrictRosterSyncStatusTable1668516726981'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "district_roster_sync_statuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "district_id" uuid NOT NULL,"started_at" TIMESTAMP, "finished_at" TIMESTAMP, "error_message" character varying, "created_user_id" character varying,  CONSTRAINT "PK_e3cae9100036813e6a5bde87f51" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4dcff6636744ed0d2bc301c98d" ON "district_roster_sync_statuses" ("district_id") `,
    )

    await queryRunner.query(
      `ALTER TABLE "district_roster_sync_statuses" ADD CONSTRAINT "FK_4dcff6636744ed0d2bc301c98d9" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "district_roster_sync_statuses" DROP CONSTRAINT "FK_4dcff6636744ed0d2bc301c98d9"`,
    )

    await queryRunner.query(
      `DROP INDEX "public"."IDX_4dcff6636744ed0d2bc301c98d"`,
    )
    await queryRunner.query(`DROP TABLE "district_roster_sync_statuses"`)
  }
}
