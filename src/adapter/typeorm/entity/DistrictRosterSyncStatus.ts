import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity({ name: 'district_roster_sync_statuses' })
export class DistrictRosterSyncStatusTypeormEntity {
  constructor(
    id: string,
    district_id: string,
    started_at: Date,
    finished_at: Date,
    error_message: string,
    created_user_id: string,
  ) {
    this.id = id
    this.district_id = district_id
    this.started_at = started_at
    this.finished_at = finished_at
    this.error_message = error_message
    this.created_user_id = created_user_id
  }
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ nullable: false })
  district_id: string

  @Column({ nullable: true })
  started_at: Date

  @Column({ nullable: true })
  finished_at: Date

  @Column({ nullable: true })
  error_message: string

  @Column({ nullable: true })
  created_user_id: string
}
