const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class addIsDomoToUsers1678214285458 {
  name = 'addIsDomoToUsers1678214285458'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "is_domo" boolean NOT NULL DEFAULT false`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_domo"`)
  }
}
