const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateDistrictPurchasedPackageTable1659935742773 {
  name = 'CreateDistrictPurchasedPackageTable1659935742773'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "district_purchased_packages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "package_id" character varying NOT NULL, "created_user_id" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "district_id" uuid, CONSTRAINT "district_id_package_id" UNIQUE ("district_id", "package_id"), CONSTRAINT "PK_e054ba750e53a56806a7fa67994" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a31237a8ad4c47c9e7acc750e9" ON "district_purchased_packages" ("district_id") `,
    )
    await queryRunner.query(
      `ALTER TABLE "district_purchased_packages" ADD CONSTRAINT "FK_a31237a8ad4c47c9e7acc750e9f" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "district_purchased_packages" DROP CONSTRAINT "FK_a31237a8ad4c47c9e7acc750e9f"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a31237a8ad4c47c9e7acc750e9"`,
    )
    await queryRunner.query(`DROP TABLE "district_purchased_packages"`)
  }
}
