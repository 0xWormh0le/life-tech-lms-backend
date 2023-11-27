import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
} from 'typeorm'

@Entity({ name: 'user_reset_password_request' })
export class UserResetPasswordRequestTypeormEntity {
  constructor(
    id: string,
    user_id: string,
    token: string,
    expiry: Date,
    created_at: Date,
  ) {
    this.id = id
    this.user_id = user_id
    this.token = token
    this.expiry = expiry
    this.created_at = created_at
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  user_id: string

  @Index()
  @Column()
  token: string

  @Column()
  expiry: Date

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date
}
