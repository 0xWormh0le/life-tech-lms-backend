const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class RemoveRelationDistrictRosterSyncStatusTable1668666507109 {
  name = 'RemoveRelationDistrictRosterSyncStatusTable1668666507109'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "district_roster_sync_statuses" DROP CONSTRAINT "FK_4dcff6636744ed0d2bc301c98d9"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4dcff6636744ed0d2bc301c98d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "district_roster_sync_statuses" DROP COLUMN "district_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "district_roster_sync_statuses" ADD "district_id" character varying NOT NULL`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4dcff6636744ed0d2bc301c98d" ON "district_roster_sync_statuses" ("district_id") `,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4dcff6636744ed0d2bc301c98d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "district_roster_sync_statuses" DROP COLUMN "district_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "district_roster_sync_statuses" ADD "district_id" uuid NOT NULL`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4dcff6636744ed0d2bc301c98d" ON "district_roster_sync_statuses" ("district_id") `,
    )
    await queryRunner.query(
      `ALTER TABLE "district_roster_sync_statuses" ADD CONSTRAINT "FK_4dcff6636744ed0d2bc301c98d9" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }
}
