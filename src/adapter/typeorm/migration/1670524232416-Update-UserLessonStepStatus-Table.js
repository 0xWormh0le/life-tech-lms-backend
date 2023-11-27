const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateUserLessonStepStatusTable1670524232416 {
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_lesson_step_statuses"
        ADD COLUMN "external_user_lesson_step_id" varchar,
        ADD COLUMN "codex_step_id" varchar`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_lesson_step_statuses"
        DROP COLUMN "external_user_lesson_step_id",
        DROP COLUMN "codex_step_id"`,
    )
  }
}
