import * as https from 'https'
import {
  E,
  Errorable,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'

import { CleverTeacher } from '../../domain/entities/CleverTeacher'
import { ICleverTeacherRepository } from '../../domain/usecases/CleverRosterSyncUseCase'
import { cleverApiRequest } from './_shared/clever-api-request'
import { CLEVER } from './_shared/constants'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class CleverTeachersRepository implements ICleverTeacherRepository {
  constructor() {}

  async getCleverTeachers(
    cleverAuthToken: string,
    cleverSchools: string[],
  ): Promise<Errorable<CleverTeacher[], E<'UnknownRuntimeError'>>> {
    try {
      const res: CleverTeacher[] = []

      for (const schoolId of cleverSchools) {
        const teachersApiData = await cleverApiRequest({
          url: `/schools/{id}/users`,
          method: 'get',
          headers: {
            Authorization: `${CLEVER.BEARER} ${cleverAuthToken}`,
          },
          pathParams: { id: schoolId },
          queryParams: { role: 'teacher', limit: CLEVER.LIMIT },
          httpsAgent: agent,
        })

        if (teachersApiData.hasError) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get teachers data from clever users API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }

        if (!teachersApiData.value?.data) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Clever teachers data is undefined.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }

        const staffApiData = await cleverApiRequest({
          url: `/schools/{id}/users`,
          method: 'get',
          headers: {
            Authorization: `${CLEVER.BEARER} ${cleverAuthToken}`,
          },
          pathParams: { id: schoolId },
          queryParams: { role: 'staff', limit: CLEVER.LIMIT },
          httpsAgent: agent,
        })

        if (staffApiData.hasError) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get staff data from clever users API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }

        if (!staffApiData.value?.data) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Clever staff data is undefined.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }

        const teacherAndStaffApiData = [
          ...teachersApiData.value?.data,
          ...staffApiData.value?.data,
        ]

        for (const data of teacherAndStaffApiData) {
          if (!data?.data) {
            continue
          }
          res.push({
            firstName: data.data.name?.first ?? '',
            lastName: data.data.name?.last ?? '',
            email: data.data.email ?? '',
            teacherLMSId: data.data.id ?? '',
            organizationLMSId: schoolId,
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
        `Failed to get teachers or staffs data from clever. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
