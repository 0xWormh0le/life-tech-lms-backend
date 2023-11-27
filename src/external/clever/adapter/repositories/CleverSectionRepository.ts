import * as https from 'https'
import {
  E,
  Errorable,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { CleverSection } from '../../domain/entities/CleverSection'
import { ICleverSectionRepository } from '../../domain/usecases/CleverRosterSyncUseCase'
import { cleverApiRequest } from './_shared/clever-api-request'
import { CLEVER } from './_shared/constants'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class CleverSectionRepository implements ICleverSectionRepository {
  constructor() {}

  async getCleverSections(
    cleverAuthToken: string,
    cleverSchools: string[],
  ): Promise<Errorable<CleverSection[], E<'UnknownRuntimeError'>>> {
    try {
      const res: CleverSection[] = []

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
          if (studentGroupApiData.error.type === 'ErrorStatusResponse') {
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
        }

        if (!studentGroupApiData.value?.data) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: JSON.stringify({
                message: `Clever sections data is undefined.`,
                statusCode: 500,
              }),
            },
            value: null,
          }
        }
        for (const data of studentGroupApiData.value.data) {
          if (!data?.data) {
            continue
          }
          res.push({
            name: data.data.name ?? '',
            grade: data.data.grade ?? '',
            studentGroupLMSId: data.data.id ?? '',
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
        `Failed to get sections data from clever. ${JSON.stringify(e)}`,
      )
    }
  }
}
