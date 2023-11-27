import * as https from 'https'

import { classlinkApiRequest } from './_shared/classlink-api-request'
import {
  Errorable,
  E,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { ClasslinkSchool } from '../../domain/entities/ClasslinkSchool'
import { IClasslinkSchoolRepository } from '../../domain/usecases/ClasslinkRosterSyncUseCase'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class ClasslinkSchoolRepository implements IClasslinkSchoolRepository {
  constructor() {}

  async getAllSchools(
    appId: string,
    accessToken: string,
  ): Promise<Errorable<ClasslinkSchool[], E<'UnknownRuntimeError', string>>> {
    try {
      const schoolsApiData = await classlinkApiRequest({
        appId,
        url: '/ims/oneroster/v1p1/schools',
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        queryParams: { filter: "type='school'", limit: 99999 },
        httpsAgent: agent,
      })

      if (schoolsApiData.hasError) {
        if (schoolsApiData.error.type === 'ErrorStatusResponse') {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get schools data from classlink school API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }
      }

      if (!schoolsApiData.value?.orgs) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: `Classlink school data is undefined.`,
              statusCode: 500,
            }),
          },
          value: null,
        }
      }

      const res: ClasslinkSchool[] = []

      for (const data of schoolsApiData.value.orgs) {
        if (data) {
          res.push({
            name: data.name ?? '',
            sourcedId: data.sourcedId ?? '',
            status: data.status,
            parentSourcedId: (data?.parent?.sourcedId as string) ?? '',
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
        `Failed to get schools data from classlink. ${JSON.stringify(e)}`,
      )
    }
  }
}
