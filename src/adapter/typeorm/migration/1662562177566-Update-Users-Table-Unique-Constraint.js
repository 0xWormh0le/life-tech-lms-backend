const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateUsersTableUniqueConstraint1662562177566 {
  name = 'UpdateUsersTableUniqueConstraint1662562177566'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique__email_index" ON "users" ("email") WHERE is_deactivated = false`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX "public"."unique__email_index"`)
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    )
  }
}
