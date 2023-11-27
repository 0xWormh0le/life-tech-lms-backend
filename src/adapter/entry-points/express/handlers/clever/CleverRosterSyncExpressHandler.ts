import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { DataSource } from 'typeorm'
import { DistrictRosterSyncStatusRepository } from '../../../../repositories/DistrictRosterSyncStatusRepository'
import { CleverRosterSyncUseCase } from '../../../../../external/clever/domain/usecases/CleverRosterSyncUseCase'
import { CleverAuthTokenRepository } from '../../../../../external/clever/adapter/repositories/CleverAuthTokenRepository'
import { CleverDistrictAdministratorRepository } from '../../../../../external/clever/adapter/repositories/CleverDistrictAdministratorRepository'
import { CleverDistrictRepository } from '../../../../../external/clever/adapter/repositories/CleverDistrictRepository'
import { CleverSchoolRepository } from '../../../../../external/clever/adapter/repositories/CleverSchoolRepository'
import { CleverSectionRepository } from '../../../../../external/clever/adapter/repositories/CleverSectionRepository'
import { CleverStudentRepository } from '../../../../../external/clever/adapter/repositories/CleverStudentRepository'
import { CleverTeachersRepository } from '../../../../../external/clever/adapter/repositories/CleverTeachersRepository'
import { DistrictRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/DistrictRepository'
import { OrganizationRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/OrganizationRepository'
import { StudentGroupStudentRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/StudentGroupStudentRepository'
import { AdministratorDistrictRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/AdministratorDistrictRepository'
import { AdministratorRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/AdministratorRepository'
import { StudentGroupRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/StudentGroupRepository'
import { StudentRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/StudentRepository'
import { TeacherOrganizationRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/TeacherOrganizationRepository'
import { TeacherRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/TeacherRepository'
import { UserRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/UserRepository'
import { UserRepository as CodexUserRepository } from '../../../../../adapter/repositories/UserRepository'

type Response =
  | Paths.GetCleverRosterSync.Responses.$200
  | Paths.GetCleverRosterSync.Responses.$500
export class CleverRosterSyncExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    Paths.GetCleverRosterSync.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    console.log('Clever roster sync express hanler')
    console.log('Params: ', JSON.stringify(params))

    const cleverAuthTokenRepository = new CleverAuthTokenRepository()
    const cleverDistrictRepository = new CleverDistrictRepository()
    const cleverDistrictAdministratorRepository =
      new CleverDistrictAdministratorRepository()
    const cleverSchoolRepository = new CleverSchoolRepository()
    const cleverSectionRepository = new CleverSectionRepository()
    const cleverTeacherRepository = new CleverTeachersRepository()
    const cleverStudentRepository = new CleverStudentRepository()
    const districtRepository = new DistrictRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const organizationRepository = new OrganizationRepository(
      this.appDataSource,
    )
    const userRepository = new UserRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
    )
    const administratorDistrictRepository = new AdministratorDistrictRepository(
      this.appDataSource,
    )
    const teacherOrganizationRepository = new TeacherOrganizationRepository(
      this.appDataSource,
    )
    const studentGroupStudentRepository = new StudentGroupStudentRepository(
      this.appDataSource,
    )
    const studentRepository = new StudentRepository(this.appDataSource)
    const districtRosterSyncStatusRepository =
      new DistrictRosterSyncStatusRepository(this.appDataSource)

    const cleverRosterSyncUseCase = new CleverRosterSyncUseCase(
      cleverAuthTokenRepository,
      cleverDistrictRepository,
      cleverSchoolRepository,
      cleverSectionRepository,
      cleverDistrictAdministratorRepository,
      cleverTeacherRepository,
      cleverStudentRepository,
      districtRepository,
      districtRosterSyncStatusRepository,
      organizationRepository,
      studentGroupRepository,
      userRepository,
      administratorRepository,
      teacherRepository,
      studentRepository,
      administratorDistrictRepository,
      teacherOrganizationRepository,
      studentGroupStudentRepository,
    )

    const codexUserRepository = new CodexUserRepository(this.appDataSource)
    const getUserResult = await codexUserRepository.getUserByAccessToken(token)

    console.log('Logged in user details: ', JSON.stringify(getUserResult))

    if (getUserResult.hasError) {
      const response500: Paths.GetDistricts.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetDistricts.Responses.$401 = {
        error: `Token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    console.log(
      `Start the clever roster sync process for district id: ${params.query.districtId}`,
    )

    const cleverRosterSyncResult = await cleverRosterSyncUseCase.run(
      { ...getUserResult.value, isDeactivated: false },
      params.query.districtId,
    )

    if (cleverRosterSyncResult.hasError) {
      const response500: Paths.GetClasslinkRosterSync.Responses.$500 = {
        error: `Roster Sync with Clever failed. ${JSON.stringify(
          cleverRosterSyncResult.error,
        )}`,
      }

      return { statusCode: 500, response: response500 }
    }
    console.log(
      `Roster sync process for Clever succeeded districtId: ${params.query.districtId}`,
    )

    const response200: Paths.GetCleverRosterSync.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
