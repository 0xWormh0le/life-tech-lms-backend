import * as https from 'https'

import {
  Errorable,
  E,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { ClasslinkSchoolAdministrator } from '../../domain/entities/ClasslinkSchoolAdministrator'
import { IClasslinkSchoolAdministratorRepository } from '../../domain/usecases/ClasslinkRosterSyncUseCase'
import { classlinkApiRequest } from './_shared/classlink-api-request'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class ClasslinkSchoolAdministratorRepository
  implements IClasslinkSchoolAdministratorRepository
{
  constructor() {}

  async getAllBySchoolSourcedId(
    appId: string,
    accessToken: string,
    schoolSourcedId: string,
  ): Promise<
    Errorable<ClasslinkSchoolAdministrator[], E<'UnknownRuntimeError', string>>
  > {
    try {
      const schoolAdminApiData = await classlinkApiRequest({
        url: '/ims/oneroster/v1p1/users',
        method: 'get',
        appId,
        queryParams: {
          filter: `role='administrator' AND orgs.sourcedId~'${schoolSourcedId}'`,
          limit: 99999,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        httpsAgent: agent,
      })

      const res: ClasslinkSchoolAdministrator[] = []

      if (schoolAdminApiData.hasError) {
        if (schoolAdminApiData.error.type === 'ErrorStatusResponse') {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get schools-administrator data from classlink users API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }
      }

      if (!schoolAdminApiData.value?.users) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: `Classlink schools-administrator data is undefined.`,
              statusCode: 500,
            }),
          },
          value: null,
        }
      }
      for (const data of schoolAdminApiData?.value?.users) {
        if (data) {
          res.push({
            sourcedId: data.sourcedId ?? data.username ?? '',
            status: data.status,
            givenName: data.givenName ?? '',
            familyName: data.familyName ?? '',
            email: data?.email ?? '',
          })
        }
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e) {
      return unknownRuntimeError(
        `Failed to get schools-administrator data from classlink. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async getAdministratorBelongsToMultipleSchoolSourcedId(
    appId: string,
    accessToken: string,
  ): Promise<
    Errorable<ClasslinkSchoolAdministrator[], E<'UnknownRuntimeError', string>>
  > {
    try {
      const administratorApiData = await classlinkApiRequest({
        url: '/ims/oneroster/v1p1/users',
        method: 'get',
        appId,
        queryParams: {
          filter: `role='administrator'`,
          limit: 99999,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        httpsAgent: agent,
      })

      const res: ClasslinkSchoolAdministrator[] = []

      if (administratorApiData.hasError) {
        if (administratorApiData.error.type === 'ErrorStatusResponse') {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get schools-administrator data from classlink users API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }
      }

      if (!administratorApiData.value?.users) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: `Classlink schools-administrator data is undefined.`,
              statusCode: 500,
            }),
          },
          value: null,
        }
      }
      for (const data of administratorApiData?.value?.users) {
        if (data?.orgs && data.orgs?.length > 1) {
          res.push({
            sourcedId: data.sourcedId ?? data.username ?? '',
            status: data.status,
            givenName: data.givenName ?? '',
            familyName: data.familyName ?? '',
            email: data?.email ?? '',
            orgsSourcedId: data.orgs.map((item) => item.sourcedId),
          })
        }
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e) {
      return unknownRuntimeError(
        `Failed to get schools-administrator data from classlink. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
