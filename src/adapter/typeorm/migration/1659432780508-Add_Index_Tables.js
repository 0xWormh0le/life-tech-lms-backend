const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class AddIndexTables1659432780508 {
  name = 'AddIndexTables1659432780508'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE INDEX "IDX_13afdf38a475747c8878903490" ON "user_lesson_statuses" ("user_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3f00c012a2baa5e7532f0d7270" ON "user_lesson_statuses" ("lesson_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e8cdc427b45d3713910ab55780" ON "districts" ("district_lms_id") `,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fc23800cd060320637aa05f21f" ON "administrators" ("user_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ff27e90b0ddb988d513b9b803e" ON "administrators" ("administrator_lms_id") `,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_21ee0bd46ef9cfbc54c6071737" ON "administrators_districts" ("administrator_id", "district_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6dc5818b082cae5299841d1931" ON "student_groups" ("organization_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8d148ff899586407214e20f711" ON "student_groups" ("student_group_lms_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_af3f35065c8fe88522e7882510" ON "organizations" ("district_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a11b446c50b4e690066dbc0a8c" ON "organizations" ("organization_lms_id") `,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4668d4752e6766682d1be0b346" ON "teachers" ("user_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_da11f3c0b77f5b48d4da3daea2" ON "teachers" ("teacher_lms_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7bdb2bbd280524255a25fcbca9" ON "teacher_organization" ("organization_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4c7fb3eeb602d521bdad39d739" ON "teacher_organization" ("teacher_id") `,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fb3eff90b11bddf7285f9b4e28" ON "students" ("user_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a767fb2edb3beab53c9b7bdd19" ON "students" ("student_lms_id") `,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_063df1738e7ffff2cc2f93e50d" ON "student_groups_students" ("student_id", "student_group_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e2d3f651c215abeb253552cb29" ON "unaccessible_lesson" ("student_group_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_54b1e1d03a7563fd046d212d79" ON "unaccessible_lesson" ("lesson_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f0c0d1d9c2a9d27ee0265e6a1f" ON "user_lesson_status_history" ("user_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a219dceb7492d95dd862835727" ON "user_lesson_status_history" ("lesson_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8f05e7d090390b22b334206dd2" ON "roster_sync_event_logs" ("event_id") `,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8f05e7d090390b22b334206dd2"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a219dceb7492d95dd862835727"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0c0d1d9c2a9d27ee0265e6a1f"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_54b1e1d03a7563fd046d212d79"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e2d3f651c215abeb253552cb29"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_063df1738e7ffff2cc2f93e50d"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a767fb2edb3beab53c9b7bdd19"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fb3eff90b11bddf7285f9b4e28"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4c7fb3eeb602d521bdad39d739"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7bdb2bbd280524255a25fcbca9"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_da11f3c0b77f5b48d4da3daea2"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4668d4752e6766682d1be0b346"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a11b446c50b4e690066dbc0a8c"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_af3f35065c8fe88522e7882510"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8d148ff899586407214e20f711"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6dc5818b082cae5299841d1931"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_21ee0bd46ef9cfbc54c6071737"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ff27e90b0ddb988d513b9b803e"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fc23800cd060320637aa05f21f"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e8cdc427b45d3713910ab55780"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3f00c012a2baa5e7532f0d7270"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_13afdf38a475747c8878903490"`,
    )
  }
}
