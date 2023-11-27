import axios from 'axios'
import hmacSHA512 from 'crypto-js/hmac-sha256'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { Handler } from '../shared/types'

type Response =
  | Paths.GetChurnZeroAuthentication.Responses.$302
  | Paths.GetChurnZeroAuthentication.Responses.$500

export class GetChurnZeroAuthenticationExpressHandler {
  handler: Handler<
    undefined,
    Paths.GetChurnZeroAuthentication.QueryParameters,
    undefined,
    Response
  > = async (params) => {
    if (!process.env.CHURN_ZERO_VANITY_URL) {
      const response500: Paths.GetChurnZeroAuthentication.Responses.$500 = {
        error: 'process.env.CHURN_ZERO_VANITY_URL is not defined',
      }

      return { statusCode: 500, response: response500 }
    }

    if (!process.env.CHURN_ZERO_HASH_SECRET) {
      const response500: Paths.GetChurnZeroAuthentication.Responses.$500 = {
        error: 'process.env.CHURN_ZERO_HASH_SECRET is not defined',
      }

      return { statusCode: 500, response: response500 }
    }

    if (!process.env.CHURN_ZERO_APP_KEY) {
      const response500: Paths.GetChurnZeroAuthentication.Responses.$500 = {
        error: 'process.env.CHURN_ZERO_APP_KEY is not defined',
      }

      return { statusCode: 500, response: response500 }
    }

    const requestBody = {
      appKey: process.env.CHURN_ZERO_APP_KEY,
      accountExternalId: params.query['account-external-id'],
      contactExternalId: params.query['contact-external-id'],
    }
    const hashedBodyContent = hmacSHA512(
      JSON.stringify(requestBody),
      process.env.CHURN_ZERO_HASH_SECRET,
    ).toString()

    const data =
      await axios.post<Paths.GetChurnZeroAuthentication.Responses.$302>(
        `${process.env.CHURN_ZERO_VANITY_URL}/SuccessCenterContactLookup`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': hashedBodyContent,
          },
        },
      )

    if (data.status !== 200 || !('authToken' in data.data)) {
      console.log(data)

      const response500: Paths.GetChurnZeroAuthentication.Responses.$500 = {
        error: JSON.stringify({
          headers: data.headers,
          status: data.status,
          data: data.data,
        }),
      }

      return { statusCode: 500, response: response500 }
    }

    return {
      statusCode: 302,
      response: {
        authToken: data.data.authToken,
      },
      headers: {
        location: `${
          process.env.CHURN_ZERO_VANITY_URL
        }/SuccessCenterCallback?token=${encodeURIComponent(
          data.data.authToken,
        )}&next=${params.query.next}`,
      },
    }
  }
}
