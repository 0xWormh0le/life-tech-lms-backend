const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class RemoveStateTableAndChangeStateIdToString1658109490178 {
  name = 'RemoveStateTableAndChangeStateIdToString1658109490178'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_e1a306c70085ef93720d015f9c3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "state_id" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "state_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "state_id" character varying`,
    )
    await queryRunner.query(`DROP TABLE "states"`)
  }

  async down(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "states" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "abbr" character varying NOT NULL, CONSTRAINT "PK_09ab30ca0975c02656483265f4f" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "state_id"`,
    )
    await queryRunner.query(`ALTER TABLE "organizations" ADD "state_id" uuid`)
    await queryRunner.query(`ALTER TABLE "districts" DROP COLUMN "state_id"`)
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_e1a306c70085ef93720d015f9c3" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
