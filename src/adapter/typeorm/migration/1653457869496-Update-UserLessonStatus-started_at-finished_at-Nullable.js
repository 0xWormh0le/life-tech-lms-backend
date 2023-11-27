const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateUserLessonStatusStartedAtFinishedAtNullable1653457869496 {
  name = 'UpdateUserLessonStatusStartedAtFinishedAtNullable1653457869496'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_lesson_statuses" ALTER COLUMN "started_at" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_lesson_statuses" ALTER COLUMN "started_at" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_lesson_statuses" ALTER COLUMN "finished_at" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_lesson_statuses" ALTER COLUMN "finished_at" DROP DEFAULT`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_lesson_statuses" ALTER COLUMN "finished_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_lesson_statuses" ALTER COLUMN "finished_at" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_lesson_statuses" ALTER COLUMN "started_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_lesson_statuses" ALTER COLUMN "started_at" SET NOT NULL`,
    )
  }
}
