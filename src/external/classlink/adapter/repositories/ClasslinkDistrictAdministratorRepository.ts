import * as https from 'https'
import { classlinkApiRequest } from './_shared/classlink-api-request'

import {
  Errorable,
  E,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { ClasslinkDistrictAdministrator } from '../../domain/entities/ClasslinkDistrictAdministrator'
import { IClasslinkDistrictAdministratorRepository } from '../../domain/usecases/ClasslinkRosterSyncUseCase'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class ClasslinkDistrictAdministratorRepository
  implements IClasslinkDistrictAdministratorRepository
{
  constructor() {}

  async getAllByDistrictSourcedId(
    appId: string,
    accessToken: string,
    districtSourcedId: string,
  ): Promise<
    Errorable<
      ClasslinkDistrictAdministrator[],
      E<'UnknownRuntimeError', string>
    >
  > {
    try {
      const districtAdministratorApiData = await classlinkApiRequest({
        appId,
        url: '/ims/oneroster/v1p1/users',
        method: 'get',
        queryParams: {
          filter: `orgs.sourcedId~'${districtSourcedId}' AND role='administrator'`,
          limit: 99999,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        httpsAgent: agent,
      })

      if (districtAdministratorApiData.hasError) {
        if (districtAdministratorApiData.error.type === 'ErrorStatusResponse') {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get district administrators data from classlink users API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }
      }

      if (!districtAdministratorApiData.value?.users) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: `Classlink district administrator data is undefined.`,
              statusCode: 500,
            }),
          },
          value: null,
        }
      }

      const res: ClasslinkDistrictAdministrator[] = []

      for (const data of districtAdministratorApiData.value.users) {
        if (data) {
          res.push({
            sourcedId: data.sourcedId ?? data.username ?? '',
            status: data.status,
            givenName: data.givenName ?? '',
            familyName: data.familyName ?? '',
            email: data.email ?? '',
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
        `Failed to get district administrators data from classlink. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
