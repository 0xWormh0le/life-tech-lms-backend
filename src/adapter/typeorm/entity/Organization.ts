import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm'
import { StudentGroupTypeormEntity } from './StudentGroup'

@Entity({ name: 'organizations' })
@Unique('name_district_id', ['name', 'district_id'])
@Unique('unique__classlink_tenant_id__organization_lms_id__index', [
  'classlink_tenant_id',
  'organization_lms_id',
])
export class OrganizationTypeormEntity {
  constructor(
    id: string,
    name: string,
    district_id: string,
    state_id: string,
    student_groups: StudentGroupTypeormEntity[],
    organization_lms_id: string,
    classlink_tenant_id: string | null,
    created_user_id: string,
    created_date: Date,
    updated_date: Date,
  ) {
    this.id = id
    this.name = name
    this.district_id = district_id
    this.student_groups = student_groups
    this.state_id = state_id
    this.organization_lms_id = organization_lms_id
    this.classlink_tenant_id = classlink_tenant_id
    this.created_user_id = created_user_id
    this.created_date = created_date
    this.updated_date = updated_date
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Index()
  @Column()
  district_id: string

  @OneToMany(() => StudentGroupTypeormEntity, (org) => org.organization_id)
  student_groups: StudentGroupTypeormEntity[]

  @Column({ nullable: true })
  state_id: string

  @Index()
  @Column({ nullable: true, type: 'text' })
  organization_lms_id: string | null

  @Index('organizations__classlink_tenant_id__index')
  @Column({ nullable: true, type: 'text' })
  classlink_tenant_id: string | null

  @Column({ nullable: true })
  created_user_id: string

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
