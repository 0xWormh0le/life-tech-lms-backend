import * as https from 'https'

import {
  Errorable,
  E,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { ClasslinkTeacher } from '../../domain/entities/ClasslinkTeacher'
import { IClasslinkTeacherRepository } from '../../domain/usecases/ClasslinkRosterSyncUseCase'
import { classlinkApiRequest } from './_shared/classlink-api-request'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class ClasslinkTeacherRepository implements IClasslinkTeacherRepository {
  constructor() {}

  async getAllBySchoolSourcedId(
    appId: string,
    accessToken: string,
    schoolSourcedId: string,
  ): Promise<Errorable<ClasslinkTeacher[], E<'UnknownRuntimeError', string>>> {
    try {
      const teacherApiData = await classlinkApiRequest({
        appId,
        url: '/ims/oneroster/v1p1/schools/{id}/teachers',
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        pathParams: { id: schoolSourcedId },
        queryParams: { limit: 99999 },
        httpsAgent: agent,
      })

      if (teacherApiData.hasError) {
        if (teacherApiData.error.type === 'ErrorStatusResponse') {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get teachers data from classlink teachers API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }
      }

      if (!teacherApiData.value?.users) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: `Classlink teachers data is undefined.`,
              statusCode: 500,
            }),
          },
          value: null,
        }
      }

      const res: ClasslinkTeacher[] = []

      for (const data of teacherApiData.value.users) {
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
        `Failed to get teachers data from classlink. ${JSON.stringify(e)}`,
      )
    }
  }
}
