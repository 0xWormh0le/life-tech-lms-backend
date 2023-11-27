const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class ChangeExternalChurnZeroDomainModering1675123580084 {
  name = 'ChangeExternalChurnZeroDomainModering1675123580084'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "user_external_churn_zero_mapping" ("user_id" uuid NOT NULL, "external_churn_zero_contact_external_id" character varying NOT NULL, "external_churn_zero_account_external_id" character varying NOT NULL, CONSTRAINT "PK_7c31278b977bd7ef9f69a2de2cc" PRIMARY KEY ("user_id"))`,
    )
    await queryRunner.query(
      `DROP TABLE "organization_external_churn_zero_account_mapping"`,
    )
    await queryRunner.query(
      `DROP TABLE "district_external_churn_zero_account_mapping"`,
    )
    await queryRunner.query(
      `DROP TABLE "user_external_churn_zero_contact_mapping"`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "user_external_churn_zero_contact_mapping" ("user_id" uuid NOT NULL, "external_churn_zero_external_id" character varying NOT NULL, CONSTRAINT "PK_fe9333d866311c3112707526351" PRIMARY KEY ("user_id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "district_external_churn_zero_account_mapping" ("district_id" uuid NOT NULL, "external_churn_zero_external_id" character varying NOT NULL, CONSTRAINT "PK_0d93d6d7e12d7d14f8b8d0f5aa4" PRIMARY KEY ("district_id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "organization_external_churn_zero_account_mapping" ("organization_id" uuid NOT NULL, "external_churn_zero_external_id" character varying NOT NULL, CONSTRAINT "PK_05163171a279df6c61313888c69" PRIMARY KEY ("organization_id"))`,
    )
    await queryRunner.query(`DROP TABLE "user_external_churn_zero_mapping"`)
  }
}
