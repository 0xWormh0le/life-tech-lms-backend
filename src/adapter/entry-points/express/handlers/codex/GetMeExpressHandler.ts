import { DataSource } from 'typeorm'
import { GetMeUseCase } from '../../../../../domain/usecases/codex/GetMeUseCase'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'
import { StudentRepository } from '../../../../repositories/StudentRepository'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { AdministratorDistrictRepository } from '../../../../repositories/AdministratorDistrictRepository'
import { OrganizationsRepository } from '../../../../repositories/OrganizationRepository'
import { TeacherOrganizationRepository } from '../../../../repositories/TeacherOrganizationRepository'
import { StudentGroupRepository } from '../../../../repositories/StudentGroupRepository'
import { StudentStudentGroupRepository } from '../../../../repositories/StudentStudentGroupRepository'

type Response =
  | Paths.GetLoggedInUser.Responses.$200
  | Paths.GetLoggedInUser.Responses.$401
  | Paths.GetLoggedInUser.Responses.$404
  | Paths.GetLoggedInUser.Responses.$500

export class GetMeExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<undefined, undefined, undefined, Response> = async (
    params,
    token,
  ) => {
    const userRepository = new UserRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const administratorDistrictRepository = new AdministratorDistrictRepository(
      this.appDataSource,
    )
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const organizationRepository = new OrganizationsRepository(
      this.appDataSource,
    )
    const teacherOrganizationRepository = new TeacherOrganizationRepository(
      this.appDataSource,
    )
    const studentRepository = new StudentRepository(this.appDataSource)
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
      administratorRepository,
    )
    const studentStudentGroupRepository = new StudentStudentGroupRepository(
      this.appDataSource,
    )
    const getMeUseCase = new GetMeUseCase(
      administratorRepository,
      administratorDistrictRepository,
      teacherRepository,
      organizationRepository,
      teacherOrganizationRepository,
      studentRepository,
      studentGroupRepository,
      studentStudentGroupRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetLoggedInUser.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetLoggedInUser.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const GetMe = await getMeUseCase.run(getUserResult.value)

    if (GetMe.hasError) {
      switch (GetMe.error.type) {
        case 'UserNotFound': {
          const response404: Paths.GetLoggedInUser.Responses.$404 = {
            error: GetMe?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.GetLoggedInUser.Responses.$500 = {
            error: JSON.stringify(GetMe.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetLoggedInUser.Responses.$200 = {
      user: GetMe.value?.user === null ? undefined : GetMe.value?.user,
      administrator: GetMe.value?.administrator
        ? {
            ...GetMe.value.administrator,
            districtId: GetMe.value.administrator.districtId ?? undefined,
          }
        : undefined,
      teacher: GetMe.value?.teacher
        ? {
            ...GetMe.value.teacher,
            districtId: GetMe.value.teacher.districtId ?? undefined,
          }
        : undefined,
      student: GetMe.value?.student
        ? {
            ...GetMe.value.student,
            districtId: GetMe.value.student.districtId ?? undefined,
          }
        : undefined,
    }

    return { statusCode: 200, response: response200 }
  }
}
