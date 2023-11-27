export type ClasslinkSchoolAdministrator = {
  sourcedId: string
  status: 'active' | 'tobedeleted' | undefined
  givenName: string
  familyName: string
  email: string
  orgsSourcedId?: string[]
}
