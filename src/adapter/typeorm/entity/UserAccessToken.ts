import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'

@Entity({ name: 'user_access_tokens' })
export class UserAccessTokenTypeormEntity {
  constructor(
    id: string,
    user_id: string,
    access_token: string,
    created_at: Date,
  ) {
    this.id = id
    this.user_id = user_id
    this.access_token = access_token
    this.created_at = created_at
  }
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  user_id: string

  @Index()
  @Column()
  access_token: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date
}
