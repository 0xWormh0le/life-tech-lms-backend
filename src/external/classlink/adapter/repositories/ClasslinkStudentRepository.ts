import * as https from 'https'
import { classlinkApiRequest } from './_shared/classlink-api-request'

import {
  Errorable,
  E,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { ClasslinkStudent } from '../../domain/entities/ClasslinkStudent'
import { IClasslinkStudentRepository } from '../../domain/usecases/ClasslinkRosterSyncUseCase'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class ClasslinkStudentRepository implements IClasslinkStudentRepository {
  constructor() {}

  async getAllByClassSourcedId(
    appId: string,
    accessToken: string,
    classSourcedId: string,
  ): Promise<Errorable<ClasslinkStudent[], E<'UnknownRuntimeError', string>>> {
    try {
      const studentApiData = await classlinkApiRequest({
        appId,
        url: '/ims/oneroster/v1p1/classes/{id}/students',
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        httpsAgent: agent,
        pathParams: { id: classSourcedId },
        queryParams: { limit: 99999 },
      })

      if (studentApiData.hasError) {
        if (studentApiData.error.type === 'ErrorStatusResponse') {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get students data from classlink students API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }
      }

      if (!studentApiData.value?.users) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: `Classlink students data is undefined.`,
              statusCode: 500,
            }),
          },
          value: null,
        }
      }

      const res: ClasslinkStudent[] = []

      for (const data of studentApiData.value.users) {
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
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get students data from classlink. ${JSON.stringify(e)}`,
      )
    }
  }
}
