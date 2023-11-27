const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class CreateUnaccessibleLessonTable1655203755663 {
  name = 'CreateUnaccessibleLessonTable1655203755663'

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "unaccessible_lesson" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "package_id" character varying NOT NULL, "lesson_id" character varying NOT NULL, "created_user_id" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "student_group_id" uuid, CONSTRAINT "unique__student_group_id_package_id_lesson_id__index" UNIQUE ("student_group_id", "package_id", "lesson_id"), CONSTRAINT "PK_2e83b99eb09184c0619aa0df10c" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "unaccessible_lesson" ADD CONSTRAINT "FK_e2d3f651c215abeb253552cb290" FOREIGN KEY ("student_group_id") REFERENCES "student_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "unaccessible_lesson" DROP CONSTRAINT "FK_e2d3f651c215abeb253552cb290"`,
    )
    await queryRunner.query(`DROP TABLE "unaccessible_lesson"`)
  }
}
