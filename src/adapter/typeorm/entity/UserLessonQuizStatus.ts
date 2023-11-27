import {
  Entity,
  Column,
  Index,
  CreateDateColumn,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'user_lesson_quiz_statuses' })
@Unique('user_lesson_quiz_statuses_user_id_lesson_id', [
  'lesson_quiz_id',
  'user_lesson_status_id',
])
export class UserLessonQuizStatusTypeormEntity {
  constructor(
    id: string,
    user_id: string,
    lesson_quiz_id: string,
    user_lesson_status_id: string,
    is_correct: boolean,
    selected_choice: string,
    created_at: Date,
  ) {
    this.id = id
    this.user_id = user_id
    this.lesson_quiz_id = lesson_quiz_id
    this.user_lesson_status_id = user_lesson_status_id
    this.is_correct = is_correct
    this.selected_choice = selected_choice
    this.created_at = created_at
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  user_id: string

  @Index()
  @Column()
  lesson_quiz_id: string

  @Index()
  @Column()
  user_lesson_status_id: string

  @Index()
  @Column()
  is_correct: boolean

  @Column()
  selected_choice: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date
}
