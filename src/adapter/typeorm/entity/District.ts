import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  Unique,
} from 'typeorm'

@Entity({ name: 'districts' })
@Unique('unique__classlink_tenant_id__district_lms_id__index', [
  'classlink_tenant_id',
  'district_lms_id',
])
export class DistrictTypeormEntity {
  constructor(
    id: string,
    name: string,
    state_id: string,
    lms_id: string | null,
    district_lms_id: string | null,
    created_user_id: string,
    created_at: Date,
    enable_roster_sync: boolean,
    last_roster_sync_event_id: string,
    last_roster_sync_event_date: Date,
    sync_started_date: Date,
    sync_ended_date: Date,
    roster_sync_error: string,
    classlink_app_id: string,
    classlink_access_token: string,
    classlink_tenant_id: string,
  ) {
    this.id = id
    this.name = name
    this.state_id = state_id
    this.lms_id = lms_id
    this.district_lms_id = district_lms_id
    this.created_user_id = created_user_id
    this.created_at = created_at
    this.enable_roster_sync = enable_roster_sync
    this.last_roster_sync_event_id = last_roster_sync_event_id
    this.last_roster_sync_event_date = last_roster_sync_event_date
    this.classlink_app_id = classlink_app_id
    this.classlink_access_token = classlink_access_token
    this.classlink_tenant_id = classlink_tenant_id
    this.sync_started_date = sync_started_date
    this.sync_ended_date = sync_ended_date
    this.roster_sync_error = roster_sync_error
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', width: 128, unique: true })
  name: string

  @Column({ nullable: true })
  state_id: string

  @Column({ nullable: true, type: 'text' })
  lms_id: string | null

  @Index()
  @Column({ nullable: true, type: 'text' })
  district_lms_id: string | null

  @Column({ nullable: true })
  created_user_id: string

  @Column('boolean', { default: false })
  enable_roster_sync: boolean = false

  @Column({ nullable: true })
  last_roster_sync_event_id: string

  @Column({ nullable: true })
  last_roster_sync_event_date: Date

  @Column({ nullable: true })
  sync_started_date: Date

  @Column({ nullable: true })
  sync_ended_date: Date

  @Column({ nullable: true })
  roster_sync_error: string

  @Column({ nullable: true })
  classlink_app_id: string

  @Column({ nullable: true })
  classlink_access_token: string

  @Index('districts__classlink_tenant_id__index')
  @Column({ nullable: true })
  classlink_tenant_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date
}
