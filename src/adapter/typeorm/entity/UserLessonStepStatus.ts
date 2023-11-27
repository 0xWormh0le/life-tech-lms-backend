import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  Index,
} from 'typeorm'

export enum UserLessonStepStatusTypeormEnum {
  not_cleared,
  cleared,
}

@Entity({ name: 'user_lesson_step_statuses' })
@Unique('user_lesson_step_statuses_user_id_lesson_id_step_id', [
  'user_id',
  'lesson_id',
  'step_id',
])
@Index('user_lesson_step_statuses_user_id_lesson_id', ['user_id', 'lesson_id'])
export class UserLessonStepStatusTypeormEntity {
  constructor(
    id: string,
    user_id: string,
    lesson_id: string,
    step_id: string,
    user_lesson_status_id: string,
    external_user_lesson_step_id: string,
    status: UserLessonStepStatusTypeormEnum,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id
    this.user_id = user_id
    this.lesson_id = lesson_id
    this.step_id = step_id
    this.user_lesson_status_id = user_lesson_status_id
    this.external_user_lesson_step_id = external_user_lesson_step_id
    this.status = status
    this.created_at = created_at
    this.updated_at = updated_at
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  user_id: string

  @Column()
  lesson_id: string

  @Column({ type: 'varchar', width: 32 })
  step_id: string

  @Column({ nullable: true })
  user_lesson_status_id: string

  @Column({ nullable: true })
  external_user_lesson_step_id: string

  @Column({
    type: 'enum',
    enum: UserLessonStepStatusTypeormEnum,
    default: UserLessonStepStatusTypeormEnum.not_cleared,
  })
  status: UserLessonStepStatusTypeormEnum

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
