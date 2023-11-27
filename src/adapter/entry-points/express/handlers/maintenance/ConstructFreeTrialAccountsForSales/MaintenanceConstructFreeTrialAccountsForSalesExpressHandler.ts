import { DataSource } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import { ConstructFreeTrialAccountsForSalesUsecase } from '../../../../../../domain/usecases/maintenance/FreeTrialAccounts/ConstructFreeTrialAccountsForSalesUsecase'
import {
  createStudentGroups,
  createTeachers,
} from '../../../../../../domain/usecases/maintenance/FreeTrialAccounts/_shared/FreeTrialAccountDataPatterns'
import { RdbDistrictRepository } from '../../../../../repositories/codex-v2/RdbDistrictRepository'
import { RdbOrganizationRepository } from '../../../../../repositories/codex-v2/RdbOrganizationRepository'
import { RdbStudentGroupRepository } from '../../../../../repositories/codex-v2/RdbStudentGroupRepository'
import { RdbDistrictPurchasedPackageRepository } from '../../../../../repositories/codex-v2/RdbDistrictPurchasedPackageRepository'
import { RdbStudentGroupPackageAssignmentRepository } from '../../../../../repositories/codex-v2/RdbStudentGroupPackageAssignmentRepository'
import { RdbUserRepository } from '../../../../../repositories/codex-v2/RdbUserRepository'
import { RdbHumanUserRepository } from '../../../../../repositories/codex-v2/RdbHumanUserRepository'
import { RdbTeacherRepository } from '../../../../../repositories/codex-v2/RdbTeacherRepository'
import { RdbStudentRepository } from '../../../../../repositories/codex-v2/RdbStudentRepository'
import { RdbTeacherOrganizationAffiliationRepository } from '../../../../../repositories/codex-v2/RdbTeacherOrganizationAffiliationRepository'
import { RdbStudentGroupStudentAffiliationRepository } from '../../../../../repositories/codex-v2/RdbStudentGroupStudentAffiliationRepository'
import { RdbUserLessonStatusRepository } from '../../../../../repositories/codex-v2/RdbUserLessonStatusRepository'
import SystemDateTimeRepository from '../../../../../repositories/codex-v2/SystemDateTimeRepository'

type Response =
  | Paths.MaintenanceGetConstructFreeTrialAccountsForSales.Responses.$200
  | Paths.MaintenanceGetConstructFreeTrialAccountsForSales.Responses.$400
  | Paths.MaintenanceGetConstructFreeTrialAccountsForSales.Responses.$409
  | Paths.MaintenanceGetConstructFreeTrialAccountsForSales.Responses.$500

export class MaintenanceGetConstructFreeTrialAccountsForSalesExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    Paths.MaintenanceGetConstructFreeTrialAccountsForSales.QueryParameters,
    undefined,
    Response
  > = async (params) => {
    const useCase = new ConstructFreeTrialAccountsForSalesUsecase(
      new RdbDistrictRepository(this.appDataSource),
      new RdbOrganizationRepository(this.appDataSource),
      new RdbStudentGroupRepository(this.appDataSource),
      new RdbDistrictPurchasedPackageRepository(this.appDataSource),
      new RdbStudentGroupPackageAssignmentRepository(this.appDataSource),
      new RdbUserRepository(this.appDataSource),
      new RdbHumanUserRepository(this.appDataSource),
      new RdbTeacherRepository(this.appDataSource),
      new RdbStudentRepository(this.appDataSource),
      new RdbTeacherOrganizationAffiliationRepository(this.appDataSource),
      new RdbStudentGroupStudentAffiliationRepository(this.appDataSource),
      new RdbUserLessonStatusRepository(this.appDataSource),
      new SystemDateTimeRepository(),
    )
    const res = await useCase.run({
      district: {
        name: params.query.districtName,
        stateId: params.query.stateId,
      },
      organization: { name: params.query.districtName },
      teachers: createTeachers(params.query.prefix),
      studentGroups: createStudentGroups(params.query.prefix),
    })

    if (res.hasError) {
      switch (res.error.type) {
        case 'AlreadyExistsError':
          return {
            statusCode: 409,
            response: {
              message: `districtName is already exists. districtName: ${params.query.districtName}`,
            },
          }
      }

      const response500: Paths.MaintenanceGetConstructFreeTrialAccountsForSales.Responses.$500 =
        {
          error: JSON.stringify(res.error),
        }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenanceGetConstructFreeTrialAccountsForSales.Responses.$200 =
      {
        message: `${params.query.districtName} has been created correctly! loginId: ${params.query.prefix}FT0001`,
      }

    return { statusCode: 200, response: response200 }
  }
}
