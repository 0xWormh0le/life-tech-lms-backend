const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateOrganizationTable1653288699595 {
  name = 'UpdateOrganizationTable1653288699595'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "state_id"`,
    )
    await queryRunner.query(`ALTER TABLE "organizations" ADD "state_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_e1a306c70085ef93720d015f9c3" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_e1a306c70085ef93720d015f9c3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "state_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "state_id" character varying NOT NULL`,
    )
  }
}
