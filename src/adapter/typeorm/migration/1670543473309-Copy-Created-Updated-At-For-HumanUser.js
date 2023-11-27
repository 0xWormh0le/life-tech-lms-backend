const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CopyCreatedUpdatedAtForHumanUser1670543473309 {
  async up(queryRunner) {
    await queryRunner.query(
      `UPDATE users SET human_user_created_at = created_at, human_user_updated_at = updated_at where human_user_created_at is null;`,
    )
  }

  async down(queryRunner) {}
}
