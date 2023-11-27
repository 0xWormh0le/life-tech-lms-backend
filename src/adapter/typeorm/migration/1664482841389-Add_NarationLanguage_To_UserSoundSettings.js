const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class AddNarationLanguageToUserSoundSettings1664482841389 {
  name = 'AddNarationLanguageToUserSoundSettings1664482841389'

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_sound_settings" ADD "narration_language" character varying NOT NULL DEFAULT 'en'`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_sound_settings" DROP COLUMN "narration_language"`,
    )
  }
}
