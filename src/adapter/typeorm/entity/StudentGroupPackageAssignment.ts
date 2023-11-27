import {
  Entity,
  Column,
  CreateDateColumn,
  Index,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'student_group_package_assignment' })
@Unique('package_category_id_package_id_student_group_id', [
  'package_category_id',
  'package_id',
  'student_group_id',
])
export class StudentGroupPackageAssignmentTypeormEntity {
  constructor(
    id: string,
    package_category_id: string,
    package_id: string,
    student_group_id: string,
    created_date: Date,
  ) {
    this.id = id
    this.package_category_id = package_category_id
    this.package_id = package_id
    this.student_group_id = student_group_id
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
  student_group_id: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_date: Date
}
