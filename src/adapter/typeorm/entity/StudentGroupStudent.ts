import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm'
import { StudentTypeormEntity } from './Student'
import { StudentGroupTypeormEntity } from './StudentGroup'

@Entity({ name: 'student_groups_students' })
@Index(['student_id', 'student_group_id'], { unique: true })
export class StudentGroupStudentTypeormEntity {
  constructor(
    id: string,
    student_id: StudentTypeormEntity,
    student_group_id: StudentGroupTypeormEntity,
    created_user_id: string,
    created_date: Date,
  ) {
    this.id = id
    this.student_id = student_id
    this.student_group_id = student_group_id
    this.created_user_id = created_user_id
    this.created_date = created_date
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => StudentTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student_id: StudentTypeormEntity

  @ManyToOne(() => StudentGroupTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_group_id' })
  student_group_id: StudentGroupTypeormEntity

  @Column({ nullable: true })
  created_user_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_date: Date
}
