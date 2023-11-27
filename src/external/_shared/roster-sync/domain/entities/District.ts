export type District = {
  id: string
  name: string
  districtLMSId: string | null
  classlinkTenantId: string | null
  classlinkAppId: string | null
  classlinkAccessToken: string | null
  lmsId?: string | null
  enableRosterSync?: boolean
}
