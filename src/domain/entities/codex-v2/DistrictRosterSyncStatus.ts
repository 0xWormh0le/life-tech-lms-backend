export type DistrictRosterSyncStatus = {
  id: string
  districtId: string
  startedAt: Date
  finishedAt: Date | null
  errorMessage: string | null
}
