const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class AddAnonymousRoleToUserTable1663470858467 {
  name = 'AddAnonymousRoleToUserTable1663470858467'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('administrator', 'internal_operator', 'teacher', 'student', 'anonymous')`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'student'`,
    )
    await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`)
  }

  async down(queryRunner) {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum_old" AS ENUM('administrator', 'internal_operator', 'teacher', 'student')`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'student'`,
    )
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`,
    )
  }
}
