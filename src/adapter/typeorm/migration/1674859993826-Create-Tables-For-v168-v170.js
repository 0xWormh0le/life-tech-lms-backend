const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateTablesForv168v1701674859993826 {
  name = 'CreateTablesForMappingWithChurnZero1674859993826'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_lesson_step_statuses" RENAME COLUMN "codex_step_id" TO "user_lesson_status_id"`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_lesson_hint_statuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "lesson_hint_id" character varying NOT NULL, "user_lesson_status_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "unique__lesson_hint_id__user_lesson_status_id" UNIQUE ("lesson_hint_id", "user_lesson_status_id"), CONSTRAINT "PK_1cb6bccdff31587d64e0293ed85" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "lesson_hints" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lesson_step_id" character varying NOT NULL, "label" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_c87e5547e593179e8b76fde0956" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "lesson_steps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lesson_id" character varying NOT NULL, "order_index" integer NOT NULL, "lesson_player_step_id" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_f966f3e23aad73b7c871daae24b" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_0ba38b90a77e484ac3f682ccb6" ON "lesson_steps" ("lesson_id") `,
    )
    await queryRunner.query(
      `CREATE TABLE "lesson_quizzes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lesson_step_id" character varying NOT NULL, "label" character varying NOT NULL, "description" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_f13aeab8172a574cfcd2dfb84db" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2ba07620bd8d379a057a1e43ce" ON "lesson_quizzes" ("lesson_step_id") `,
    )
    await queryRunner.query(
      `CREATE TABLE "user_lesson_quiz_statuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "lesson_quiz_id" character varying NOT NULL, "user_lesson_status_id" character varying NOT NULL, "is_correct" boolean NOT NULL, "selected_choice" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "user_lesson_quiz_statuses_user_id_lesson_id" UNIQUE ("lesson_quiz_id", "user_lesson_status_id"), CONSTRAINT "PK_848a516c0fd75a0473a8d2d7989" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_48b1b0f5d7f2ee5f5ca23d5763" ON "user_lesson_quiz_statuses" ("lesson_quiz_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_712eddbe02f3f798f114c57912" ON "user_lesson_quiz_statuses" ("user_lesson_status_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f878736a781941b90aa561ac0a" ON "user_lesson_quiz_statuses" ("is_correct") `,
    )
    await queryRunner.query(
      `CREATE TABLE "user_external_churn_zero_contact_mapping" ("user_id" uuid NOT NULL, "external_churn_zero_external_id" character varying NOT NULL, CONSTRAINT "PK_fe9333d866311c3112707526351" PRIMARY KEY ("user_id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "district_external_churn_zero_account_mapping" ("district_id" uuid NOT NULL, "external_churn_zero_external_id" character varying NOT NULL, CONSTRAINT "PK_0d93d6d7e12d7d14f8b8d0f5aa4" PRIMARY KEY ("district_id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "organization_external_churn_zero_account_mapping" ("organization_id" uuid NOT NULL, "external_churn_zero_external_id" character varying NOT NULL, CONSTRAINT "PK_05163171a279df6c61313888c69" PRIMARY KEY ("organization_id"))`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP TABLE "organization_external_churn_zero_account_mapping"`,
    )
    await queryRunner.query(
      `DROP TABLE "district_external_churn_zero_account_mapping"`,
    )
    await queryRunner.query(
      `DROP TABLE "user_external_churn_zero_contact_mapping"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f878736a781941b90aa561ac0a"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_712eddbe02f3f798f114c57912"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_48b1b0f5d7f2ee5f5ca23d5763"`,
    )
    await queryRunner.query(`DROP TABLE "user_lesson_quiz_statuses"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2ba07620bd8d379a057a1e43ce"`,
    )
    await queryRunner.query(`DROP TABLE "lesson_quizzes"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ba38b90a77e484ac3f682ccb6"`,
    )
    await queryRunner.query(`DROP TABLE "lesson_steps"`)
    await queryRunner.query(`DROP TABLE "lesson_hints"`)
    await queryRunner.query(`DROP TABLE "user_lesson_hint_statuses"`)
    await queryRunner.query(
      `ALTER TABLE "user_lesson_step_statuses" RENAME COLUMN "user_lesson_status_id" TO "codex_step_id"`,
    )
  }
}
