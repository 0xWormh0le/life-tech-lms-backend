import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm'

@Entity({ name: 'lesson_quizzes' })
export class LessonQuizTypeormEntity {
  constructor(
    id: string,
    lesson_step_id: string,
    label: string,
    description: string,
    created_date: Date,
    updated_date: Date,
  ) {
    this.id = id
    this.lesson_step_id = lesson_step_id
    this.label = label
    this.description = description
    this.created_date = created_date
    this.updated_date = updated_date
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column()
  lesson_step_id: string

  @Column()
  label: string

  @Column()
  description: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_date: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_date: Date
}
