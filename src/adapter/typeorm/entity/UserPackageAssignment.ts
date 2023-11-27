import {
  Entity,
  Column,
  CreateDateColumn,
  Index,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'user_package_assignments' })
@Unique('package_category_id_package_id_user_id', [
  'package_category_id',
  'package_id',
  'user_id',
])
export class UserPackageAssignmentTypeormEntity {
  constructor(
    id: string,
    package_category_id: string,
    package_id: string,
    user_id: string,
    created_date: Date,
  ) {
    this.id = id
    this.package_category_id = package_category_id
    this.package_id = package_id
    this.user_id = user_id
    this.created_date = created_date
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  package_category_id: string

  @Column()
  @Index()
  package_id: string

  @Column()
  @Index()
  user_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_date: Date
}
