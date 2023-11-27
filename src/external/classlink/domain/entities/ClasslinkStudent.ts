export type ClasslinkStudent = {
  sourcedId: string
  status: 'active' | 'tobedeleted' | undefined
  givenName: string
  familyName: string
  email: string
}
