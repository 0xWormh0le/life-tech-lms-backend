import * as https from 'https'
import {
  Errorable,
  E,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { CleverDistrictAdministrator } from '../../domain/entities/CleverDistrictAdministrator'
import { ICleverDistrictAdministratorRepository } from '../../domain/usecases/CleverRosterSyncUseCase'
import { cleverApiRequest } from './_shared/clever-api-request'
import { CLEVER } from './_shared/constants'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export class CleverDistrictAdministratorRepository
  implements ICleverDistrictAdministratorRepository
{
  constructor() {}

  async getDistrictAdministrator(
    cleverAuthToken: string,
  ): Promise<
    Errorable<CleverDistrictAdministrator[], E<'UnknownRuntimeError'>>
  > {
    try {
      const districtAdministratorApiData = await cleverApiRequest({
        url: '/users',
        method: 'get',
        headers: {
          Authorization: `${CLEVER.BEARER} ${cleverAuthToken}`,
        },
        queryParams: { role: 'district_admin', limit: CLEVER.LIMIT },
        httpsAgent: agent,
      })

      if (districtAdministratorApiData.hasError) {
        return unknownRuntimeError(
          `Failed to get district administrator data from clever users API. ${JSON.stringify(
            districtAdministratorApiData.error,
          )}`,
        )
      }

      if (!districtAdministratorApiData.value?.data) {
        return unknownRuntimeError(
          `Clever district administrator data is undefined. ${JSON.stringify(
            districtAdministratorApiData.error,
          )}`,
        )
      }

      const res: CleverDistrictAdministrator[] = []

      for (const data of districtAdministratorApiData.value.data) {
        if (!data?.data) {
          continue
        }
        res.push({
          email: data.data.email ?? '',
          firstName: data.data.name?.first ?? '',
          lastName: data.data.name?.last ?? '',
          administratorLMSId: data.data.id ?? '',
        })
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get administrators data from clever. ${JSON.stringify(e)}`,
      )
    }
  }
}
