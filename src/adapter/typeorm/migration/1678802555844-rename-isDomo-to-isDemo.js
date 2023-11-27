const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class renameIsDomoToIsDemo1678802555844 {
  name = 'renameIsDomoToIsDemo1678802555844'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "is_domo" TO "is_demo"`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "is_demo" TO "is_domo"`,
    )
  }
}
