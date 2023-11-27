import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { DataSource } from 'typeorm'
import { DistrictRosterSyncStatusRepository } from '../../../../repositories/DistrictRosterSyncStatusRepository'
import { ClasslinkDistrictRepository } from '../../../../../external/classlink/adapter/repositories/ClasslinkDistrictRepository'
import { ClasslinkSchoolRepository } from '../../../../../external/classlink/adapter/repositories/ClasslinkSchoolRepository'
import { ClasslinkClassRepository } from '../../../../../external/classlink/adapter/repositories/ClasslinkClassRepository'
import { ClasslinkDistrictAdministratorRepository } from '../../../../../external/classlink/adapter/repositories/ClasslinkDistrictAdministratorRepository'
import { ClasslinkSchoolAdministratorRepository } from '../../../../../external/classlink/adapter/repositories/ClasslinkSchoolAdministratorRepository'
import { ClasslinkTeacherRepository } from '../../../../../external/classlink/adapter/repositories/ClasslinkTeacherRepository'
import { ClasslinkStudentRepository } from '../../../../../external/classlink/adapter/repositories/ClasslinkStudentRepository'
import { DistrictRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/DistrictRepository'
import { OrganizationRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/OrganizationRepository'
import { StudentGroupRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/StudentGroupRepository'
import { UserRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/UserRepository'
import { AdministratorRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/AdministratorRepository'
import { TeacherRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/TeacherRepository'
import { StudentRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/StudentRepository'
import { AdministratorDistrictRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/AdministratorDistrictRepository'
import { TeacherOrganizationRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/TeacherOrganizationRepository'
import { StudentGroupStudentRepository } from '../../../../../external/_shared/roster-sync/adapter/repositories/StudentGroupStudentRepository'
import { ClasslinkRosterSyncUseCase } from '../../../../../external/classlink/domain/usecases/ClasslinkRosterSyncUseCase'
import { UserRepository as CodexUserRepository } from '../../../../../adapter/repositories/UserRepository'

type Response =
  | Paths.GetClasslinkRosterSync.Responses.$200
  | Paths.GetClasslinkRosterSync.Responses.$500
export class ClasslinkRosterSyncExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    Paths.GetClasslinkRosterSync.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    console.log('Classlink roster sync express hanler')
    console.log('Params: ', JSON.stringify(params))

    const classlinkDistrictRepository = new ClasslinkDistrictRepository()
    const classlinkSchoolRepository = new ClasslinkSchoolRepository()
    const classlinkClassRepository = new ClasslinkClassRepository()
    const classlinkDistrictAdministratorRepository =
      new ClasslinkDistrictAdministratorRepository()
    const classlinkSchoolAdministratorRepository =
      new ClasslinkSchoolAdministratorRepository()
    const classlinkTeacherRepository = new ClasslinkTeacherRepository()
    const classlinkStudentRepository = new ClasslinkStudentRepository()
    const districtRepository = new DistrictRepository(this.appDataSource)
    const organizationRepository = new OrganizationRepository(
      this.appDataSource,
    )
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
    )
    const userRepository = new UserRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const studentRepository = new StudentRepository(this.appDataSource)
    const administratorDistrictRepository = new AdministratorDistrictRepository(
      this.appDataSource,
    )
    const teacherOrganizationRepository = new TeacherOrganizationRepository(
      this.appDataSource,
    )
    const studentGroupStudentRepository = new StudentGroupStudentRepository(
      this.appDataSource,
    )
    const districtRosterSyncStatusRepository =
      new DistrictRosterSyncStatusRepository(this.appDataSource)
    const classlinkRosterSyncUseCase = new ClasslinkRosterSyncUseCase(
      classlinkDistrictRepository,
      classlinkSchoolRepository,
      classlinkClassRepository,
      classlinkDistrictAdministratorRepository,
      classlinkSchoolAdministratorRepository,
      classlinkTeacherRepository,
      classlinkStudentRepository,
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
      `Start the classlink roster syn process for district id: ${params.query.districtId}`,
    )

    const classlinkRosterSyncResult = await classlinkRosterSyncUseCase.run(
      { ...getUserResult.value, isDeactivated: false },
      params.query.districtId,
    )

    if (classlinkRosterSyncResult.hasError) {
      const response500: Paths.GetClasslinkRosterSync.Responses.$500 = {
        error: `Roster Sync with Classlink failed. ${JSON.stringify(
          classlinkRosterSyncResult.error,
        )}`,
      }

      return { statusCode: 500, response: response500 }
    }
    console.log(
      `Roster Sync Process for Classlink succeeded districtId: ${params.query.districtId}`,
    )

    const response200: Paths.GetClasslinkRosterSync.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
