export type StudentGroup = {
  id: string
  name: string
  grade: string | null
  externalLmsStudentGroupId: string | null
  createdUserId: string | null
  updatedUserId: string | null
  createdAt: Date
  updatedAt: Date
  organizationId: string
  classlinkTenantId: string | null
}
