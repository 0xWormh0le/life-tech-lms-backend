import * as https from 'https'
import {
  Errorable,
  E,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { CleverSchool } from '../../domain/entities/CleverSchool'
import { ICleverSchoolRepository } from '../../domain/usecases/CleverRosterSyncUseCase'
import { cleverApiRequest } from './_shared/clever-api-request'
import { CLEVER } from './_shared/constants'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class CleverSchoolRepository implements ICleverSchoolRepository {
  constructor() {}

  async getCleverSchools(
    cleverAuthToken: string,
  ): Promise<Errorable<CleverSchool[], E<'UnknownRuntimeError'>>> {
    try {
      const organizationsApiData = await cleverApiRequest({
        url: '/schools',
        method: 'get',
        headers: {
          Authorization: `${CLEVER.BEARER} ${cleverAuthToken}`,
        },
        queryParams: { limit: CLEVER.LIMIT },
        httpsAgent: agent,
      })

      if (organizationsApiData.hasError) {
        if (organizationsApiData.error.type === 'ErrorStatusResponse') {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get schools data from clever schools API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }
      }

      if (!organizationsApiData.value?.data) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: `Clever schools data is undefined.`,
              statusCode: 500,
            }),
          },
          value: null,
        }
      }

      const res: CleverSchool[] = []

      for (const data of organizationsApiData.value.data) {
        if (
          data &&
          data?.data &&
          data.data.location &&
          data.data.location.state !== ' '
        ) {
          res.push({
            name: data.data.name ?? '',
            districtLMSId: data.data.district ?? '',
            organizationLMSId: data.data.id ?? '',
          })
        }
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get schools data from clever. ${JSON.stringify(e)}`,
      )
    }
  }
}
