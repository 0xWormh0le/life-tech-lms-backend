const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class RemoveNonNullContraintFromAchievedStartCount1657508928373 {
  name = 'RemoveNonNullContraintFromAchievedStartCount1657508928373'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_lesson_statuses" ALTER COLUMN "achieved_star_count" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_lesson_status_history" ALTER COLUMN "achieved_star_count" DROP NOT NULL`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_lesson_status_history" ALTER COLUMN "achieved_star_count" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_lesson_statuses" ALTER COLUMN "achieved_star_count" SET NOT NULL`,
    )
  }
}
