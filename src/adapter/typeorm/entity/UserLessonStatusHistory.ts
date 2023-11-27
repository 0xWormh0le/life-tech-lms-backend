import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserLessonStatusTypeormEnum } from './UserLessonStatus'

export enum UserLessonStatusHistoryTypeormEnum {
  not_cleared = 'not_cleared',
  cleared = 'cleared',
}

@Entity({ name: 'user_lesson_status_history' })
export class UserLessonStatusHistoryTypeormEntity {
  constructor(
    id: string,
    user_id: string,
    lesson_id: string,
    status: UserLessonStatusTypeormEnum,
    used_hint_count: number,
    correct_answered_quiz_count: number,
    achieved_star_count: number,
    step_id_skipping_detected: boolean,
    started_at: Date,
    finished_at: Date,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id
    this.user_id = user_id
    this.lesson_id = lesson_id
    this.status = status
    this.used_hint_count = used_hint_count
    this.correct_answered_quiz_count = correct_answered_quiz_count
    this.achieved_star_count = achieved_star_count
    this.step_id_skipping_detected = step_id_skipping_detected
    this.started_at = started_at
    this.finished_at = finished_at
    this.created_at = created_at
    this.updated_at = updated_at
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column('uuid')
  user_id: string

  @Index()
  @Column()
  lesson_id: string

  @Column({
    type: 'enum',
    enum: UserLessonStatusTypeormEnum,
    default: UserLessonStatusTypeormEnum.not_cleared,
  })
  status: UserLessonStatusTypeormEnum

  @Column({ nullable: true })
  used_hint_count: number

  @Column({ nullable: true })
  correct_answered_quiz_count: number

  @Column({ nullable: true })
  achieved_star_count: number

  @Column({ default: false })
  step_id_skipping_detected: boolean

  @Column({ nullable: true })
  started_at: Date

  @Column({ nullable: true })
  finished_at: Date

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
