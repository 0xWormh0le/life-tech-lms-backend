export type Student = {
  id: string
  nickName: string
  userId: string
  loginId: string
  password?: string
  studentLMSId: string | null
  emailsToNotify: string[] | undefined
  createdUserName: string | null
  createdDate: string
  lastLessionName?: string
  lastLessonStartedAt?: string | null
  email?: string
  studentGroupCount?: number
  studentGroup?: string
}

export type StudentPackage = {
  stundentGroupId: string
  packageId: string
}
