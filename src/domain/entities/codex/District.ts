export type District = {
  id: string
  name: string
  districtLMSId: string | null
  lastRosterSyncEventId: string
  lastRosterSyncEventDate: string
  enableRosterSync: boolean
  lmsId: string | null
  stateId?: string
  administrators?: string
}

export type RosterSyncDistrict = {
  id: string
  eventId: string
}

export type UpdateLastRosterSyncEventInfo = {
  districtId: string
  eventId?: string | undefined
  lastRosterSyncEventDate?: string | undefined
  rosterSyncError?: string | undefined
  syncStartedDate?: Date
  syncEndedDate?: Date
}
