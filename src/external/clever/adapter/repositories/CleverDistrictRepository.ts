import * as https from 'https'
import {
  Errorable,
  E,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { CleverDistrict } from '../../domain/entities/CleverDistrict'
import { ICleverDistrictRepository } from '../../domain/usecases/CleverRosterSyncUseCase'
import { cleverApiRequest } from './_shared/clever-api-request'
import { CLEVER } from './_shared/constants'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class CleverDistrictRepository implements ICleverDistrictRepository {
  constructor() {}

  async getDistrict(
    cleverAuthToken: string,
  ): Promise<Errorable<CleverDistrict | null, E<'UnknownRuntimeError'>>> {
    try {
      const districtsApiData = await cleverApiRequest({
        url: '/districts',
        method: 'get',
        headers: {
          Authorization: `${CLEVER.BEARER} ${cleverAuthToken}`,
        },
        httpsAgent: agent,
      })

      if (districtsApiData.hasError) {
        if (districtsApiData.error.type === 'ErrorStatusResponse') {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get districts data from clever districts API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }
      }

      if (!districtsApiData.value?.data) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: `Clever district data is undefined.`,
              statusCode: 500,
            }),
          },
          value: null,
        }
      }

      const res: CleverDistrict[] = []

      for (const data of districtsApiData.value.data) {
        if (!data?.data) {
          continue
        }
        res.push({
          name: data.data.name ?? '',
          districtLMSId: data.data.id ?? '',
        })
      }

      return {
        hasError: false,
        error: null,
        value: res[0],
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get districts data from clever. ${JSON.stringify(e)}`,
      )
    }
  }
}
