const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateLmsTable1652701584531 {
  name = 'CreateLmsTable1652701584531'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "lms" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_34d247cf1950486cb719d182427" UNIQUE ("name"), CONSTRAINT "PK_1b9ab3a48a8e91f11a872329b13" PRIMARY KEY ("id"))`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "lms"`)
  }
}
