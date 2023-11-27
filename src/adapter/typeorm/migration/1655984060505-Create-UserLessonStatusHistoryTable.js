const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateUserLessonStatusHistoryTable1655984060505 {
  name = 'CreateUserLessonStatusHistoryTable1655984060505'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TYPE "public"."user_lesson_status_history_status_enum" AS ENUM('not_cleared', 'cleared')`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_lesson_status_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "lesson_id" character varying NOT NULL, "status" "public"."user_lesson_status_history_status_enum" NOT NULL DEFAULT 'not_cleared', "used_hint_count" integer, "correct_answered_quiz_count" integer, "achieved_star_count" integer NOT NULL, "step_id_skipping_detected" boolean NOT NULL DEFAULT false, "started_at" TIMESTAMP, "finished_at" TIMESTAMP, CONSTRAINT "PK_67cc49e4f72ca1f7cf5809692d2" PRIMARY KEY ("id"))`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "user_lesson_status_history"`)
    await queryRunner.query(
      `DROP TYPE "public"."user_lesson_status_history_status_enum"`,
    )
  }
}
