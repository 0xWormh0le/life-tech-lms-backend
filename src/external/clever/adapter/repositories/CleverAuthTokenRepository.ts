import axios from 'axios'
import * as https from 'https'
import {
  Errorable,
  E,
  fromNativeError,
  failureErrorable,
} from '../../../../domain/usecases/shared/Errors'
import { CLEVER } from './_shared/constants'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class CleverAuthTokenRepository {
  async getCleverAuthToken(
    districtLmsId: string,
  ): Promise<Errorable<string | null, E<'UnknownRuntimeError'>>> {
    try {
      if (!process.env.CLEVER_BASIC_AUTH_HEADER) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: 'Clever Auth header is not defined',
              statusCode: 500,
            }),
          },
          value: null,
        }
      }

      // Call clever oauth/tokens API and get Token
      // Response will be like below
      // {
      //   "data": [
      //     {
      //       "id": "63627ceb54b2a60008114c94",
      //       "created": "2022-11-02T14:21:31.083Z",
      //       "owner": {
      //         "type": "district",
      //         "id": "5b689125d970c3000121c47e"
      //       },
      //       "access_token": "138ca5e3e389e52a84f93a0002ffefb20ba7bdd2",
      //       "scopes": [
      //         "read:district_admins",
      //         "read:districts",
      //         "read:resources",
      //         "read:school_admins",
      //         "read:schools",
      //         "read:sections",
      //         "read:student_contacts",
      //         "read:students",
      //         "read:teachers",
      //         "read:user_id"
      //       ]
      //     }
      //   ],
      //   "links": [
      //     {
      //       "rel": "self",
      //       "uri": "/oauth/tokens?district=5b689125d970c3000121c47e"
      //     }
      //   ]
      // }
      const data = await axios.get<{
        data?: {
          access_token: string
        }[]
      }>(CLEVER.OATH_TOKEN_URL, {
        headers: {
          Authorization: process.env.CLEVER_BASIC_AUTH_HEADER,
        },
        params: { district: districtLmsId },
        httpsAgent: agent,
      })

      if (!data || !data.data) {
        return failureErrorable(
          'UnknownRuntimeError',
          'axios returns empty data',
        )
      }

      if (!data.data.data) {
        return failureErrorable(
          'UnknownRuntimeError',
          `clever API ${
            CLEVER.OATH_TOKEN_URL
          } returns unexpected data structure. ${JSON.stringify(data)}`,
        )
      }

      return {
        hasError: false,
        error: null,
        value:
          data.data.data.length > 0 ? data.data.data[0].access_token : null,
      }
    } catch (e: any) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `Failed to get clever auth token`,
        ),
        value: null,
      }
    }
  }
}
