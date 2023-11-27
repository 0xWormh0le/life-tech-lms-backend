export type HumanUser = {
  userId: string
  loginId: string | null
  email: string | null
  hashedPassword: string | null
  createdAt: Date
  updatedAt: Date
}
