const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class UpdateAdministratorDistrictTable1653047455120 {
  name = 'UpdateAdministratorDistrictTable1653047455120'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "administrators_districts" DROP CONSTRAINT "FK_478a2ae420db201710887e53393"`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators_districts" ADD CONSTRAINT "FK_478a2ae420db201710887e53393" FOREIGN KEY ("administrator_id") REFERENCES "administrators"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "administrators_districts" DROP CONSTRAINT "FK_478a2ae420db201710887e53393"`,
    )
    await queryRunner.query(
      `ALTER TABLE "administrators_districts" ADD CONSTRAINT "FK_478a2ae420db201710887e53393" FOREIGN KEY ("administrator_id") REFERENCES "administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
