import * as https from 'https'
import { classlinkApiRequest } from './_shared/classlink-api-request'

import {
  Errorable,
  E,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { ClasslinkClass } from '../../domain/entities/ClasslinkClass'
import { IClasslinkClassRepository } from '../../domain/usecases/ClasslinkRosterSyncUseCase'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class ClasslinkClassRepository implements IClasslinkClassRepository {
  constructor() {}

  async getAllBySchoolSourcedId(
    appId: string,
    accessToken: string,
    schoolSourcedId: string,
  ): Promise<Errorable<ClasslinkClass[], E<'UnknownRuntimeError', string>>> {
    try {
      const classesApiData = await classlinkApiRequest({
        appId,
        url: '/ims/oneroster/v1p1/schools/{id}/classes',
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        pathParams: { id: schoolSourcedId },
        queryParams: {
          limit: 99999,
        },
        httpsAgent: agent,
      })

      if (classesApiData.hasError) {
        if (classesApiData.error.type === 'ErrorStatusResponse') {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get classes data from classlink class API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }
      }

      if (!classesApiData.value?.classes) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: `Classlink class data is undefined.`,
              statusCode: 500,
            }),
          },
          value: null,
        }
      }

      const res: ClasslinkClass[] = []

      for (const data of classesApiData.value.classes) {
        if (data) {
          res.push({
            sourcedId: data.sourcedId ?? '',
            status: data.status,
            title: data.title ?? '',
            grade: data.grades?.join(','),
            schoolSourcedId,
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
        `Failed to get classes data from classlink. ${JSON.stringify(e)}`,
      )
    }
  }
}
