import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm'

@Entity({ name: 'user_sound_settings' })
export class UserSoundSettingsTypeormEntity {
  constructor(
    user_id: string,
    se_volume: number,
    bgm_volume: number,
    hint_narration_volume: number,
    serif_narration_volume: number,
    narration_language: string,
    created_at: Date,
    updated_at: Date,
  ) {
    this.user_id = user_id
    this.se_volume = se_volume
    this.bgm_volume = bgm_volume
    this.hint_narration_volume = hint_narration_volume
    this.serif_narration_volume = serif_narration_volume
    this.narration_language = narration_language
    this.created_at = created_at
    this.updated_at = updated_at
  }

  @PrimaryColumn('uuid')
  user_id: string

  @Column()
  se_volume: number

  @Column()
  bgm_volume: number

  @Column()
  hint_narration_volume: number

  @Column()
  serif_narration_volume: number

  @Column({
    default: 'en',
  })
  narration_language: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date
}
