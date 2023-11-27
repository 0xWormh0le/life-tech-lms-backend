import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'user_lesson_hint_statuses' })
@Unique('unique__lesson_hint_id__user_lesson_status_id', [
  'lesson_hint_id',
  'user_lesson_status_id',
])
export class UserLessonHintStatusTypeormEntity {
  constructor(
    id: string,
    user_id: string,
    lesson_hint_id: string,
    user_lesson_status_id: string,
    created_at: Date,
  ) {
    this.id = id
    this.user_id = user_id
    this.lesson_hint_id = lesson_hint_id
    this.user_lesson_status_id = user_lesson_status_id
    this.created_at = created_at
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  user_id: string

  @Column()
  lesson_hint_id: string

  @Column()
  user_lesson_status_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date
}
