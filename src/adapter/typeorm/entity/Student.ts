import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  Unique,
} from 'typeorm'

@Entity({ name: 'students' })
@Unique('unique__classlink_tenant_id__student_lms_id__index', [
  'classlink_tenant_id',
  'student_lms_id',
])
export class StudentTypeormEntity {
  constructor(
    id: string,
    user_id: string,
    nick_name: string,
    student_lms_id: string | null,
    emails_to_notify: string,
    classlink_tenant_id: string | null,
    is_deactivated: boolean,
    created_user_id: string,
    created_date: Date,
  ) {
    this.id = id
    this.user_id = user_id
    this.nick_name = nick_name
    this.emails_to_notify = emails_to_notify
    this.student_lms_id = student_lms_id
    this.classlink_tenant_id = classlink_tenant_id
    this.is_deactivated = is_deactivated
    this.created_user_id = created_user_id
    this.created_date = created_date
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column()
  user_id: string

  @Column()
  nick_name: string

  @Index()
  @Column({ nullable: true, type: 'text' })
  student_lms_id: string | null

  @Index('students__classlink_tenant_id__index')
  @Column({ nullable: true, type: 'text' })
  classlink_tenant_id: string | null

  @Column({ default: false })
  is_deactivated: boolean

  @Column({ nullable: true })
  emails_to_notify: string

  @Column({ nullable: true })
  created_user_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_date: Date
}
