import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  Unique,
} from 'typeorm'
@Entity({ name: 'administrators' })
@Unique('unique__classlink_tenant_id__administrator_lms_id__index', [
  'classlink_tenant_id',
  'administrator_lms_id',
])
export class AdministratorTypeormEntity {
  constructor(
    id: string,
    user_id: string,
    first_name: string,
    last_name: string,
    administrator_lms_id: string | null,
    classlink_tenant_id: string | null,
    is_deactivated: boolean,
    created_user_id: string,
    created_date: Date,
  ) {
    this.id = id
    this.user_id = user_id
    this.first_name = first_name
    this.last_name = last_name
    this.administrator_lms_id = administrator_lms_id
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

  @Column({ nullable: true })
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Index()
  @Column({ nullable: true, type: 'text' })
  administrator_lms_id: string | null

  @Index('administrators__classlink_tenant_id__index')
  @Column({ nullable: true, type: 'text' })
  classlink_tenant_id: string | null

  @Column({ default: false })
  is_deactivated: boolean

  @Column({ nullable: true })
  created_user_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_date: Date
}
