export type StudentGroup = {
  id: string
  organizationId: string
  name: string
  grade: string
  studentGroupLmsId: string | null
  createdUserId: string
  updatedUserId: string
  createdDate: string
  updatedDate: string
}

export type StudentGroups = {
  studentGroupLMSId: string
  studentGroupId: string
}
