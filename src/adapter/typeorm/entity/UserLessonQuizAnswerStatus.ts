import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity({ name: 'user_lesson_quiz_answer_status' })
export class UserLessonQuizAnswerStatusTypeormEntity {
  constructor(
    id: string,
    user_id: string,
    lesson_id: string,
    user_lesson_status_history_id: string,
    is_correct: boolean,
    step_id: string,
    selected_choice: string,
    created_at: Date,
  ) {
    this.id = id
    this.user_id = user_id
    this.lesson_id = lesson_id
    this.user_lesson_status_history_id = user_lesson_status_history_id
    this.is_correct = is_correct
    this.step_id = step_id
    this.selected_choice = selected_choice
    this.created_at = created_at
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  user_lesson_status_history_id: string

  @Column('uuid')
  user_id: string

  @Column()
  lesson_id: string

  @Column()
  step_id: string

  @Column()
  selected_choice: string

  @Column({ default: false })
  is_correct: boolean

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date
}
