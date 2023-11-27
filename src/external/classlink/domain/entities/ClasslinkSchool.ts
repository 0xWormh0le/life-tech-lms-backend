export type ClasslinkSchool = {
  sourcedId: string
  status: 'active' | 'tobedeleted' | undefined
  name: string
  parentSourcedId: string
}
