import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm'

import { AdministratorTypeormEntity } from './Administrator'
import { DistrictTypeormEntity } from './District'

@Entity({ name: 'administrators_districts' })
@Unique('unique__administrator_id__district_id__index', [
  'administrator',
  'district',
])
@Index(['administrator', 'district'], { unique: true })
export class AdministratorDistrictTypeormEntity {
  constructor(
    id: string,
    administrator: AdministratorTypeormEntity,
    district: DistrictTypeormEntity,
    created_user_id: string,
    created_date: Date,
  ) {
    this.id = id
    this.administrator = administrator
    this.district = district
    this.created_user_id = created_user_id
    this.created_date = created_date
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => AdministratorTypeormEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'administrator_id' })
  administrator: AdministratorTypeormEntity

  @ManyToOne(() => DistrictTypeormEntity)
  @JoinColumn({ name: 'district_id' })
  district: DistrictTypeormEntity

  @Column({ nullable: true })
  created_user_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_date: Date
}
