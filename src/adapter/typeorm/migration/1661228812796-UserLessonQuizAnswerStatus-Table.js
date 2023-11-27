const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UserLessonQuizAnswerStatusTable1661228812796 {
  name = 'UserLessonQuizAnswerStatusTable1661228812796'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "user_lesson_quiz_answer_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_lesson_status_history_id" uuid NOT NULL, "user_id" uuid NOT NULL, "lesson_id" character varying NOT NULL, "step_id" character varying NOT NULL, "selected_choice" character varying NOT NULL, "is_correct" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_babc32c64d258b190d7269ecdea" PRIMARY KEY ("id"))`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "user_lesson_quiz_answer_status"`)
  }
}
