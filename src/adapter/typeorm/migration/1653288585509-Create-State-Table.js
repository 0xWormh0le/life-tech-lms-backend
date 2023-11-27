const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateStateTable1653288585509 {
  name = 'CreateStateTable1653288585509'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "states" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "abbr" character varying NOT NULL, CONSTRAINT "PK_09ab30ca0975c02656483265f4f" PRIMARY KEY ("id"))`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "states"`)
  }
}
