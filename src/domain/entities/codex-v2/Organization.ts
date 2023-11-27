export type Organization = {
  id: string
  name: string
  districtId: string
  externalLmsOrganizationId: string | null
  classlinkTenantId: string | null
  createdAt: Date
  updatedAt: Date
}
