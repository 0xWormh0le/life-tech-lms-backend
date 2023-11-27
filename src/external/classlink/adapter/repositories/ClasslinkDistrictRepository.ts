import * as https from 'https'
import { classlinkApiRequest } from './_shared/classlink-api-request'

import {
  Errorable,
  E,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { ClasslinkDistrict } from '../../domain/entities/ClasslinkDistrict'
import { IClasslinkDistrictRepository } from '../../domain/usecases/ClasslinkRosterSyncUseCase'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class ClasslinkDistrictRepository
  implements IClasslinkDistrictRepository
{
  constructor() {}

  async getDistrict(
    appId: string,
    accessToken: string,
  ): Promise<
    Errorable<ClasslinkDistrict | null, E<'UnknownRuntimeError', string>>
  > {
    try {
      const districtsApiData = await classlinkApiRequest({
        appId,
        url: '/ims/oneroster/v1p1/orgs',
        method: 'get',
        queryParams: {
          filter: "type='district'",
          limit: 99999,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        httpsAgent: agent,
      })

      let res: ClasslinkDistrict | null = null

      if (districtsApiData.hasError) {
        if (districtsApiData.error.type === 'ErrorStatusResponse') {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get districts data from classlink district API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }
      }

      if (districtsApiData.value?.orgs) {
        res = {
          name: districtsApiData.value?.orgs?.[0]?.name ?? '',
          sourcedId: districtsApiData.value?.orgs?.[0]?.sourcedId ?? '',
          status: districtsApiData.value?.orgs?.[0]?.status,
        }
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get districts data from classlink. ${JSON.stringify(e)}`,
      )
    }
  }
}
