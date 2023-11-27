import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm'

@Entity({ name: 'lesson_steps' })
export class LessonStepTypeormEntity {
  constructor(
    id: string,
    lesson_id: string,
    order_index: number,
    lesson_player_step_id: string,
    created_date: Date,
  ) {
    this.id = id
    this.lesson_id = lesson_id
    this.order_index = order_index
    this.lesson_player_step_id = lesson_player_step_id
    this.created_date = created_date
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column()
  lesson_id: string

  @Column()
  order_index: number

  @Column()
  lesson_player_step_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_date: Date
}
