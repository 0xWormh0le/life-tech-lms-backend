const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class AddedClassLINKRelavantTable1660134198654 {
  name = 'AddedClassLINKRelavantTable1660134198654'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "administrators" ADD "classlink_tenant_id" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups" ADD "classlink_tenant_id" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "classlink_tenant_id" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "teachers" ADD "classlink_tenant_id" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" ADD "classlink_tenant_id" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ADD CONSTRAINT "PK_06fa59050494d04fabb44d0c9ea" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ALTER COLUMN "created_date" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" DROP COLUMN "error"`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ADD "error" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" DROP COLUMN "event_data_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ADD "event_data_id" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" DROP COLUMN "event_data_role"`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ADD "event_data_role" character varying NOT NULL`,
    )
    await queryRunner.query(
      `CREATE INDEX "districts__classlink_tenant_id__index" ON "districts" ("classlink_tenant_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "administrators__classlink_tenant_id__index" ON "administrators" ("classlink_tenant_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "student_groups__classlink_tenant_id__index" ON "student_groups" ("classlink_tenant_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "organizations__classlink_tenant_id__index" ON "organizations" ("classlink_tenant_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "teachers__classlink_tenant_id__index" ON "teachers" ("classlink_tenant_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "students__classlink_tenant_id__index" ON "students" ("classlink_tenant_id") `,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ADD CONSTRAINT "unique__classlink_tenant_id__district_lms_id__index" UNIQUE ("classlink_tenant_id", "district_lms_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators" ADD CONSTRAINT "unique__classlink_tenant_id__administrator_lms_id__index" UNIQUE ("classlink_tenant_id", "administrator_lms_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups" ADD CONSTRAINT "unique__classlink_tenant_id__student_group_lms_id__index" UNIQUE ("classlink_tenant_id", "student_group_lms_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "unique__classlink_tenant_id__organization_lms_id__index" UNIQUE ("classlink_tenant_id", "organization_lms_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "teachers" ADD CONSTRAINT "unique__classlink_tenant_id__teacher_lms_id__index" UNIQUE ("classlink_tenant_id", "teacher_lms_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "unique__classlink_tenant_id__student_lms_id__index" UNIQUE ("classlink_tenant_id", "student_lms_id")`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "unique__classlink_tenant_id__student_lms_id__index"`,
    )
    await queryRunner.query(
      `ALTER TABLE "teachers" DROP CONSTRAINT "unique__classlink_tenant_id__teacher_lms_id__index"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "unique__classlink_tenant_id__organization_lms_id__index"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups" DROP CONSTRAINT "unique__classlink_tenant_id__student_group_lms_id__index"`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators" DROP CONSTRAINT "unique__classlink_tenant_id__administrator_lms_id__index"`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" DROP CONSTRAINT "unique__classlink_tenant_id__district_lms_id__index"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."students__classlink_tenant_id__index"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."teachers__classlink_tenant_id__index"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."organizations__classlink_tenant_id__index"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."student_groups__classlink_tenant_id__index"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."administrators__classlink_tenant_id__index"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."districts__classlink_tenant_id__index"`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" DROP COLUMN "event_data_role"`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ADD "event_data_role" text`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" DROP COLUMN "event_data_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ADD "event_data_id" text`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" DROP COLUMN "error"`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ADD "error" text`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" ALTER COLUMN "created_date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    )
    await queryRunner.query(
      `ALTER TABLE "roster_sync_event_logs" DROP CONSTRAINT "PK_06fa59050494d04fabb44d0c9ea"`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" DROP COLUMN "classlink_tenant_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "teachers" DROP COLUMN "classlink_tenant_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "classlink_tenant_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups" DROP COLUMN "classlink_tenant_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators" DROP COLUMN "classlink_tenant_id"`,
    )
  }
}
