import { User } from '../codex/User'
import { AccessToken } from './AccessToken'

export type UserWithToken = User & {
  accessToken: AccessToken
}
