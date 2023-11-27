import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Index,
  Unique,
} from 'typeorm'
import { DistrictTypeormEntity } from './District'

@Entity({ name: 'district_purchased_packages' })
@Unique('district_id_package_id', ['district_id', 'package_id'])
export class DistrictPurchasedPackageTypeormEntity {
  constructor(
    id: string,
    district_id: DistrictTypeormEntity,
    package_id: string,
    created_user_id: string,
    created_date: Date,
  ) {
    this.id = id
    this.district_id = district_id
    this.package_id = package_id
    this.created_user_id = created_user_id
    this.created_date = created_date
  }
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @ManyToOne(() => DistrictTypeormEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'district_id' })
  district_id: DistrictTypeormEntity

  @Column()
  package_id: string

  @Column({ nullable: true })
  created_user_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_date: Date
}
