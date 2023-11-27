import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'lms' })
export class LmsTypeormEntity {
  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }

  @PrimaryColumn()
  id: number

  @Column({ type: 'varchar', width: 128, unique: true })
  name: string
}
