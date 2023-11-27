const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateTableSchema1657022353804 {
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "administrators" ALTER COLUMN "created_user_id" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators_districts" ALTER COLUMN "created_user_id" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "teachers" ALTER COLUMN "created_user_id" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "teacher_organization" ALTER COLUMN "created_user_id" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ALTER COLUMN "created_user_id" DROP NOT NULL`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "administrators" ALTER COLUMN "created_user_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators_districts" ALTER COLUMN "created_user_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "teachers" ALTER COLUMN "created_user_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "teacher_organization" ALTER COLUMN "created_user_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ALTER COLUMN "created_user_id" SET NOT NULL`,
    )
  }
}
