import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'user_external_churn_zero_mapping' })
export class UserExternalChurnZeroMappingTypeormEntity {
  constructor(
    user_id: string,
    external_churn_zero_contact_external_id: string,
    external_churn_zero_account_external_id: string,
  ) {
    this.user_id = user_id
    this.external_churn_zero_contact_external_id =
      external_churn_zero_contact_external_id
    this.external_churn_zero_account_external_id =
      external_churn_zero_account_external_id
  }

  @PrimaryColumn('uuid')
  user_id: string

  @Column()
  external_churn_zero_contact_external_id: string

  @Column()
  external_churn_zero_account_external_id: string
}
