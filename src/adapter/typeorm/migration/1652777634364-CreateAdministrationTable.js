const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateAdministrationTable1652777634364 {
  name = 'CreateAdministrationTable1652777634364'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "administrators" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "administrator_lms_id" character varying NOT NULL, "created_user_id" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_aaa48522d99c3b6b33fdea7dc2f" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "administrators_districts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_user_id" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "administrator_id" uuid, "district_id" uuid, CONSTRAINT "unique__administrator_id__district_id__index" UNIQUE ("administrator_id", "district_id"), CONSTRAINT "REL_478a2ae420db201710887e5339" UNIQUE ("administrator_id"), CONSTRAINT "PK_584550796e6cec7052eb6ecaeb8" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD "email" character varying NOT NULL DEFAULT ''`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators_districts" ADD CONSTRAINT "FK_478a2ae420db201710887e53393" FOREIGN KEY ("administrator_id") REFERENCES "administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators_districts" ADD CONSTRAINT "FK_789c696ae045bb83a6ce7536f2d" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "administrators_districts" DROP CONSTRAINT "FK_789c696ae045bb83a6ce7536f2d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators_districts" DROP CONSTRAINT "FK_478a2ae420db201710887e53393"`,
    )
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`)
    await queryRunner.query(`DROP TABLE "administrators_districts"`)
    await queryRunner.query(`DROP TABLE "administrators"`)
  }
}
