const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class RevertStudentGroupTable1662615750896 {
  name = 'RevertStudentGroupTable1662615750896'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups" DROP CONSTRAINT "FK_6dc5818b082cae5299841d19310"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups" ALTER COLUMN "organization_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups" ADD CONSTRAINT "FK_6dc5818b082cae5299841d19310" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "student_groups" DROP CONSTRAINT "FK_6dc5818b082cae5299841d19310"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups" ALTER COLUMN "organization_id" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_groups" ADD CONSTRAINT "FK_6dc5818b082cae5299841d19310" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }
}
