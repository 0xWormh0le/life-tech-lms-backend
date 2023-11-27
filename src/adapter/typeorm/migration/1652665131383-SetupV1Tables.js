const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class SetupV1Tables1652665131383 {
  name = 'SetupV1Tables1652665131383'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('administrator', 'internal_operator', 'teacher', 'student')`,
    )
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login_id" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'student', "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_e564194a9a22f8c623354284f75" UNIQUE ("login_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_sound_settings" ("user_id" uuid NOT NULL, "se_volume" integer NOT NULL, "bgm_volume" integer NOT NULL, "hint_narration_volume" integer NOT NULL, "serif_narration_volume" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_14612def08951acb33fc78f1c82" PRIMARY KEY ("user_id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."user_lesson_step_statuses_status_enum" AS ENUM('0', '1')`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_lesson_step_statuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "lesson_id" character varying NOT NULL, "step_id" character varying NOT NULL, "status" "public"."user_lesson_step_statuses_status_enum" NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "user_lesson_step_statuses_user_id_lesson_id_step_id" UNIQUE ("user_id", "lesson_id", "step_id"), CONSTRAINT "PK_febaa678ec73b63ee8c8145d08c" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "user_lesson_step_statuses_user_id_lesson_id" ON "user_lesson_step_statuses" ("user_id", "lesson_id") `,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."user_lesson_statuses_status_enum" AS ENUM('not_cleared', 'cleared')`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_lesson_statuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "lesson_id" character varying NOT NULL, "status" "public"."user_lesson_statuses_status_enum" NOT NULL DEFAULT 'not_cleared', "used_hint_count" integer, "correct_answered_quiz_count" integer, "achieved_star_count" integer NOT NULL, "step_id_skipping_detected" boolean NOT NULL DEFAULT false, "started_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "finished_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "user_lesson_statuses_user_id_lesson_id" UNIQUE ("user_id", "lesson_id"), CONSTRAINT "PK_852c9e8c4a5b23e7bb32134cc54" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."lessons_course_enum" AS ENUM('basic', 'webDesign', 'mediaArt', 'gameDevelopment')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."lessons_lesson_environment_enum" AS ENUM('litLessonPlayer')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."lessons_level_enum" AS ENUM('basic', 'advanced')`,
    )
    await queryRunner.query(
      `CREATE TABLE "lessons" ("id" character varying NOT NULL, "url" character varying NOT NULL, "project_name" character varying NOT NULL, "scenario_path" character varying NOT NULL, "name" character varying NOT NULL, "course" "public"."lessons_course_enum" NOT NULL DEFAULT 'basic', "lesson_environment" "public"."lessons_lesson_environment_enum" NOT NULL DEFAULT 'litLessonPlayer', "description" text NOT NULL, "lesson_duration" character varying NOT NULL, "thumbnail_image_url" character varying NOT NULL, "max_star_count" integer NOT NULL, "quiz_count" integer, "hint_count" integer, "level" "public"."lessons_level_enum" NOT NULL DEFAULT 'basic', "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "project_name_scenario_path" UNIQUE ("project_name", "scenario_path"), CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_access_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "access_token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_f07c49baf74e5d699c83e2ec2bd" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_cf3a958cb932fa1a0fc4e24116" ON "user_access_tokens" ("access_token") `,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cf3a958cb932fa1a0fc4e24116"`,
    )
    await queryRunner.query(`DROP TABLE "user_access_tokens"`)
    await queryRunner.query(`DROP TABLE "lessons"`)
    await queryRunner.query(`DROP TYPE "public"."lessons_level_enum"`)
    await queryRunner.query(
      `DROP TYPE "public"."lessons_lesson_environment_enum"`,
    )
    await queryRunner.query(`DROP TYPE "public"."lessons_course_enum"`)
    await queryRunner.query(`DROP TABLE "user_lesson_statuses"`)
    await queryRunner.query(
      `DROP TYPE "public"."user_lesson_statuses_status_enum"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."user_lesson_step_statuses_user_id_lesson_id"`,
    )
    await queryRunner.query(`DROP TABLE "user_lesson_step_statuses"`)
    await queryRunner.query(
      `DROP TYPE "public"."user_lesson_step_statuses_status_enum"`,
    )
    await queryRunner.query(`DROP TABLE "user_sound_settings"`)
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`)
  }
}
