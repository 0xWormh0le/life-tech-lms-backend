export type District = {
  id: string
  name: string
  stateId: string
  lmsId: string | null
  externalLmsDistrictId: string | null
  enableRosterSync: boolean
  createdAt: Date
  createdUserId: string | null
}
