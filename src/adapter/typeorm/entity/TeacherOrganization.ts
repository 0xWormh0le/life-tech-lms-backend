import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Index,
  Unique,
} from 'typeorm'

import { TeacherTypeormEntity } from './Teacher'
import { OrganizationTypeormEntity } from './Organization'

@Entity({ name: 'teacher_organization' })
@Unique(['teacher', 'organization'])
export class TeacherOrganizationTypeormEntity {
  constructor(
    id: string,
    teacher: TeacherTypeormEntity,
    organization: OrganizationTypeormEntity,
    is_primary: boolean,
    created_user_id: string,
    created_date: Date,
  ) {
    this.id = id
    this.teacher = teacher
    this.organization = organization
    this.is_primary = is_primary
    this.created_user_id = created_user_id
    this.created_date = created_date
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => OrganizationTypeormEntity, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @Index(['organization'])
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationTypeormEntity

  @ManyToOne(() => TeacherTypeormEntity, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @Index(['teacher'])
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherTypeormEntity

  @Column({ nullable: true })
  created_user_id: string

  @Column({ default: false })
  is_primary: boolean

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_date: Date
}
