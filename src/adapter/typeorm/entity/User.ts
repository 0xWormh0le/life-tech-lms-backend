import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm'

export enum UserRoleTypeormEnum {
  administrator = 'administrator',
  internal_operator = 'internal_operator',
  teacher = 'teacher',
  student = 'student',
  anonymous = 'anonymous',
}

@Entity({ name: 'users' })
export class UserTypeormEntity {
  constructor(
    id: string,
    login_id: string,
    password: string,
    role: string,
    email: string,
    is_deactivated: boolean,
    is_demo: boolean,
    created_at: Date,
    updated_at: Date,
    human_user_created_at: Date,
    human_user_updated_at: Date,
  ) {
    this.id = id
    this.login_id = login_id
    this.password = password
    this.role = role
    this.email = email
    this.is_deactivated = is_deactivated
    this.is_demo = is_demo
    this.created_at = created_at
    this.updated_at = updated_at
    this.human_user_created_at = human_user_created_at
    this.human_user_updated_at = human_user_updated_at
  }
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, type: 'varchar', width: 256, nullable: true })
  login_id: string | null

  @Column({ nullable: true, type: 'varchar', width: 256 })
  password: string | null

  @Column({
    type: 'enum',
    enum: UserRoleTypeormEnum,
    default: UserRoleTypeormEnum.student,
  })
  role: string

  @Column({ unique: true, type: 'varchar', width: 256, nullable: true })
  email: string | null

  @Column({ default: false })
  is_deactivated: boolean

  @Column({ default: false })
  is_demo: boolean

  @Column({ default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at: Date

  @Column({ default: () => 'CURRENT_TIMESTAMP(6)' })
  public updated_at: Date

  @Column({ nullable: true })
  public human_user_created_at: Date

  @Column({ nullable: true })
  public human_user_updated_at: Date
}
