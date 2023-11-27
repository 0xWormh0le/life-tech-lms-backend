import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Unique,
  Index,
} from 'typeorm'
import { StudentGroupTypeormEntity } from './StudentGroup'

@Entity({ name: 'unaccessible_lesson' })
@Unique('unique__student_group_id_package_id_lesson_id__index', [
  'student_group_id',
  'package_id',
  'lesson_id',
])
export class UnaccessibleLessonTypeormEntity {
  constructor(
    id: string,
    student_group_id: string,
    package_id: string,
    lesson_id: string,
    created_user_id: string,
    created_date: Date,
  ) {
    this.id = id
    this.student_group_id = student_group_id
    this.package_id = package_id
    this.lesson_id = lesson_id
    this.created_user_id = created_user_id
    this.created_date = created_date
  }
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @ManyToOne(() => StudentGroupTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_group_id' })
  student_group_id: string

  @Column()
  package_id: string

  @Index()
  @Column()
  lesson_id: string

  @Column({ nullable: true })
  created_user_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_date: Date
}
