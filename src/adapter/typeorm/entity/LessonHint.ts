import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { UserLessonStatusTypeormEntity } from './UserLessonStatus'

@Entity({ name: 'lesson_hints' })
export class LessonHintTypeormEntity {
  constructor(
    id: string,
    lesson_step_id: string,
    label: string,
    description: string,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id
    this.lesson_step_id = lesson_step_id
    this.label = label
    this.description = description
    this.created_at = created_at
    this.updated_at = updated_at
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

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
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date
}
