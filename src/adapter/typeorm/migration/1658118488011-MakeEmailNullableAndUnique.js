const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class MakeEmailNullableAndUnique1658118488011 {
  name = 'MakeEmailNullableAndUnique1658118488011'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" DROP DEFAULT`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" SET DEFAULT ''`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`,
    )
  }
}
