import { HumanUser } from '../../../../entities/codex-v2/HumanUser'

export const transformHumanUserMaskedPassword = (
  humanUser: HumanUser,
): HumanUser => {
  return {
    userId: humanUser.userId,
    loginId: humanUser.loginId,
    email: humanUser.email,
    hashedPassword: humanUser.hashedPassword ? '******' : null,
    createdAt: humanUser.createdAt,
    updatedAt: humanUser.updatedAt,
  }
}
