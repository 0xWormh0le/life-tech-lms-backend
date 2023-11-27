const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class AddedHumanUserCreatedAtUpdatedAtToUserTable1667697434309 {
  name = 'AddedHumanUserCreatedAtUpdatedAtToUserTable1667697434309'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "human_user_created_at" TIMESTAMP`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD "human_user_updated_at" TIMESTAMP`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "human_user_updated_at"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "human_user_created_at"`,
    )
  }
}
