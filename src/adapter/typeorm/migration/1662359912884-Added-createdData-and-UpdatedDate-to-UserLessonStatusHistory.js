const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class AddedCreatedDataAndUpdatedDateToUserLessonStatusHistory1662359912884 {
  name = 'AddedCreatedDataAndUpdatedDateToUserLessonStatusHistory1662359912884'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_lesson_status_history" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_lesson_status_history" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_lesson_status_history" DROP COLUMN "updated_at"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_lesson_status_history" DROP COLUMN "created_at"`,
    )
  }
}
