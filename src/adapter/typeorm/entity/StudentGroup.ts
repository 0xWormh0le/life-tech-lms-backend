import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Index,
  Unique,
} from 'typeorm'
import { OrganizationTypeormEntity } from './Organization'

@Entity({ name: 'student_groups' })
@Unique('unique__classlink_tenant_id__student_group_lms_id__index', [
  'classlink_tenant_id',
  'student_group_lms_id',
])
export class StudentGroupTypeormEntity {
  constructor(
    id: string,
    organization_id: OrganizationTypeormEntity,
    name: string,
    grade: string,
    student_group_lms_id: string | null,
    classlink_tenant_id: string | null,
    created_user_id: string,
    updated_user_id: string,
    created_date: Date,
    updated_date: Date,
  ) {
    this.id = id
    this.name = name
    this.grade = grade
    this.organization_id = organization_id
    this.student_group_lms_id = student_group_lms_id
    this.classlink_tenant_id = classlink_tenant_id
    this.created_user_id = created_user_id
    this.updated_user_id = updated_user_id
    this.created_date = created_date
    this.updated_date = updated_date
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index(['organization_id'])
  @ManyToOne(() => OrganizationTypeormEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'organization_id' })
  organization_id: OrganizationTypeormEntity

  @Column()
  name: string

  @Column({ nullable: true })
  grade: string

  @Index()
  @Column({ nullable: true, type: 'text' })
  student_group_lms_id: string | null

  @Index('student_groups__classlink_tenant_id__index')
  @Column({ nullable: true, type: 'text' })
  classlink_tenant_id: string | null

  @Column({ nullable: true })
  created_user_id: string

  @Column({ nullable: true })
  updated_user_id: string

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
