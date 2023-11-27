import * as https from 'https'
import {
  E,
  Errorable,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { CleverStudent } from '../../domain/entities/CleverStudent'
import { ICleverStudentRepository } from '../../domain/usecases/CleverRosterSyncUseCase'
import { cleverApiRequest } from './_shared/clever-api-request'
import { CLEVER } from './_shared/constants'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class CleverStudentRepository implements ICleverStudentRepository {
  constructor() {}

  async getCleverStudents(
    cleverAuthToken: string,
    cleverSchools: string[],
  ): Promise<Errorable<CleverStudent[], E<'UnknownRuntimeError', string>>> {
    try {
      const mapStudentGroupsByStudentId: Record<string, string[]> = {}

      for (const schoolId of cleverSchools) {
        const studentGroupApiData = await cleverApiRequest({
          url: `/schools/{id}/sections`,
          method: 'get',
          headers: {
            Authorization: `${CLEVER.BEARER} ${cleverAuthToken}`,
          },
          queryParams: { limit: CLEVER.LIMIT },
          pathParams: { id: schoolId },
          httpsAgent: agent,
        })

        if (studentGroupApiData.hasError) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Failed to get sections data from clever sections API.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }

        if (!studentGroupApiData.value?.data) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `clever sections data is undefined.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }

        for (const i of studentGroupApiData.value.data) {
          if (i.data && i.data.id && i.data.students) {
            for (const stu of i.data.students) {
              if (!mapStudentGroupsByStudentId[stu]) {
                mapStudentGroupsByStudentId[stu] = []
              }
              mapStudentGroupsByStudentId[stu].push(i.data.id)
            }
          }
        }
      }

      const cleverStudentsData = await cleverApiRequest({
        url: `/users`,
        method: 'get',
        headers: {
          Authorization: `${CLEVER.BEARER} ${cleverAuthToken}`,
        },
        queryParams: { role: 'student', limit: CLEVER.LIMIT }, //The maximum limit is 10000 records per page in Clever.
        httpsAgent: agent,
      })

      if (cleverStudentsData.hasError) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: `Failed to get students data from clever users API.`,
              statusCode: 500,
            }),
          },
          value: null,
        }
      }

      if (!cleverStudentsData.value?.data) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: JSON.stringify({
              message: `Clever students data is undefined.`,
              statusCode: 500,
            }),
          },
          value: null,
        }
      }

      const mapCleverStudentsDataByStudentLmsId: Record<
        string,
        NonNullable<typeof cleverStudentsData.value.data>[0]['data']
      > = {}

      for (const cleverStudent of cleverStudentsData.value.data) {
        if (
          cleverStudent.data?.id &&
          !mapCleverStudentsDataByStudentLmsId[cleverStudent.data?.id]
        ) {
          mapCleverStudentsDataByStudentLmsId[cleverStudent.data.id] =
            cleverStudent.data
        }
      }

      // Create student data
      const cleverStudentAndStudentGroupStudentData: CleverStudent[] = []

      for (const cleverStudentLmsId of Object.keys(
        mapCleverStudentsDataByStudentLmsId,
      )) {
        const studentApiData =
          mapCleverStudentsDataByStudentLmsId[cleverStudentLmsId]

        if (studentApiData && studentApiData.id && studentApiData.name) {
          cleverStudentAndStudentGroupStudentData.push({
            nickName: `${studentApiData.name.first} ${studentApiData.name.last}`,
            studentLMSId: studentApiData.id,
            email: studentApiData.email ?? undefined,
            studentGroupsLMSId:
              mapStudentGroupsByStudentId[studentApiData.id] || [],
          })
        }
      }

      return {
        hasError: false,
        error: null,
        value: cleverStudentAndStudentGroupStudentData,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get students data from clever. ${JSON.stringify(e)}`,
      )
    }
  }
}
