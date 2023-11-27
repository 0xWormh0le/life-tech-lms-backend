const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateUserPackageAssignmentTable1663593665246 {
  name = 'CreateUserPackageAssignmentTable1663593665246'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "user_package_assignments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "package_category_id" character varying NOT NULL, "package_id" character varying NOT NULL, "user_id" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "package_category_id_package_id_user_id" UNIQUE ("package_category_id", "package_id", "user_id"), CONSTRAINT "PK_a9943838a95a00ff5d31dafe7ab" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a4c032bbb5f055e2a3f96a7870" ON "user_package_assignments" ("package_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5363bb6f0e0691502de801e1bc" ON "user_package_assignments" ("user_id") `,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5363bb6f0e0691502de801e1bc"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a4c032bbb5f055e2a3f96a7870"`,
    )
    await queryRunner.query(`DROP TABLE "user_package_assignments"`)
  }
}
