import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'roster_sync_event_logs' })
export class RosterSyncEventLogsTypeormEntity {
  constructor(
    id: string,
    district_id: string,
    event_id: string,
    event_type: string,
    event_created_date: string,
    created_user_id: string,
    created_date: Date,
    error: string,
    event_data_id: string,
    event_data_role: string,
  ) {
    this.id = id
    this.district_id = district_id
    this.event_id = event_id
    this.event_type = event_type
    this.event_created_date = event_created_date
    this.created_user_id = created_user_id
    this.created_date = created_date
    this.error = error
    this.event_data_id = event_data_id
    this.event_data_role = event_data_role
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  district_id: string

  @Index()
  @Column({ nullable: false })
  event_id: string

  @Column({ nullable: false })
  event_type: string

  @Column({ nullable: false })
  event_created_date: string

  @Column({ nullable: true })
  created_user_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_date: Date

  @Column({ nullable: true })
  error: string

  @Column({ nullable: false })
  event_data_id: string

  @Column({ nullable: true })
  event_data_role: string
}
