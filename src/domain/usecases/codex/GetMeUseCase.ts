import { User, MeInfo } from '../../entities/codex/User'
import { Errorable, E, wrapError } from '../shared/Errors'
import { userRoles } from '../shared/Constants'
import { District } from '../../entities/codex/District'
import { Organizations } from '../../entities/codex/Organization'
import { StudentGroup } from '../../entities/codex/StudentGroup'
import { StudentStudentGroup } from '../../entities/codex/StudentStudentGroup'
import { TeacherOrganization } from '../../entities/codex/TeacherOrganization'
import { AdministratorDistrict } from '../../entities/codex/AdministratorDistrict'

export interface IAdministratorRepository {
  getAdministratorDetailByUserId(
    userId: string,
  ): Promise<
    Errorable<
      Omit<NonNullable<MeInfo['administrator']>, 'districtId'> | null,
      E<'UnknownRuntimeError'>
    >
  >
}

export interface IAdministratorDistrictRepository {
  getAllByAdministratorId(
    administaratorId: string,
  ): Promise<
    Errorable<AdministratorDistrict[], E<'UnknownRuntimeError', string>>
  >
}

export interface ITeacherRepository {
  getTeacherDetailByUserId(
    userId: string,
  ): Promise<
    Errorable<
      Omit<
        NonNullable<MeInfo['teacher']>,
        'districtId' | 'organizationIds'
      > | null,
      E<'UnknownRuntimeError'>
    >
  >
}

export interface IOrganizationRepository {
  getOrganizationById(
    organizationId: string,
  ): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>>
}

export interface ITeacherOrganizationRepository {
  getAllByTeacherId(
    teacherid: string,
  ): Promise<Errorable<TeacherOrganization[], E<'UnknownRuntimeError', string>>>
}

export interface IStudentRepository {
  getStudentDetailByUserId(
    userId: string,
  ): Promise<
    Errorable<
      Omit<
        NonNullable<MeInfo['student']>,
        'districtId' | 'organizationIds' | 'studentGroupIds'
      > | null,
      E<'UnknownRuntimeError'>
    >
  >
}

export interface IStudentGroupRepository {
  getById(
    id: string,
  ): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError', string>>>
}

export interface IStudentStudentGroupRepository {
  getAllByStudentId(
    studentId: string,
  ): Promise<Errorable<StudentStudentGroup[], E<'UnknownRuntimeError', string>>>
}

export class GetMeUseCase {
  constructor(
    private administratorRepository: IAdministratorRepository,
    private administratorDistrictRepository: IAdministratorDistrictRepository,
    private teacherRepository: ITeacherRepository,
    private organizationRepository: IOrganizationRepository,
    private teacherOrganizationRepository: ITeacherOrganizationRepository,
    private studentRepository: IStudentRepository,
    private studentGroupRepository: IStudentGroupRepository,
    private studentStudentGroupRepository: IStudentStudentGroupRepository,
  ) {}

  async run(
    user: User,
  ): Promise<
    Errorable<MeInfo | undefined, E<'UnknownRuntimeError'> | E<'UserNotFound'>>
  > {
    let loggedInUserInfo
    let administrator: MeInfo['administrator']
    let teacher: MeInfo['teacher']
    let student: MeInfo['student']

    if (user.role === userRoles.internalOperator) {
      loggedInUserInfo = {
        user: {
          id: user.id,
          loginId: user.loginId ? user.loginId : null,
          role: user.role,
          email: user.email,
        },
      }
    } else if (user.role === userRoles.administrator) {
      const getAdminisratorResult =
        await this.administratorRepository.getAdministratorDetailByUserId(
          user.id,
        )

      if (getAdminisratorResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getAdminisratorResult.error,
            `Failed to getAdministratorDetailByUserId ${user.id}`,
          ),
          value: null,
        }
      }

      if (!getAdminisratorResult.value) {
        return {
          hasError: true,
          error: {
            type: 'UserNotFound',
            message: `The specified user not found for ${user.id}`,
          },
          value: null,
        }
      }

      const getAdministratorDistrictResult =
        await this.administratorDistrictRepository.getAllByAdministratorId(
          getAdminisratorResult.value.id,
        )

      if (getAdministratorDistrictResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getAdministratorDistrictResult.error,
            `Failed to administratorDistrictRepository.getAllByAdministratorId ${getAdminisratorResult.value.id}`,
          ),
          value: null,
        }
      }

      administrator = {
        ...getAdminisratorResult.value,
        districtId:
          getAdministratorDistrictResult.value.length > 0
            ? getAdministratorDistrictResult.value[0].districtId
            : null,
      }
    } else if (user.role === userRoles.teacher) {
      const getTeacherResult =
        await this.teacherRepository.getTeacherDetailByUserId(user.id)

      if (getTeacherResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getTeacherResult.error,
            `Failed to getTeacherDetailByUserId ${user.id}`,
          ),
          value: null,
        }
      }

      if (!getTeacherResult.value) {
        return {
          hasError: true,
          error: {
            type: 'UserNotFound',
            message: `The specified user not found for ${user.id}`,
          },
          value: null,
        }
      }

      const getTeacherOrganizationResult =
        await this.teacherOrganizationRepository.getAllByTeacherId(
          getTeacherResult.value.id,
        )

      if (getTeacherOrganizationResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getTeacherOrganizationResult.error,
            `Failed to teacherOrganizationRepository.getAllByTeacherId ${getTeacherResult.value.id}`,
          ),
          value: null,
        }
      }

      const organizationIds: string[] = []

      for (const teacherOrganization of getTeacherOrganizationResult.value) {
        // Take unique
        if (
          !organizationIds.find((e) => e === teacherOrganization.organizationId)
        ) {
          organizationIds.push(teacherOrganization.organizationId)
        }
      }

      let districtId: string | null = null

      if (organizationIds.length > 0) {
        const getOrganizationResult =
          await this.organizationRepository.getOrganizationById(
            organizationIds[0],
          )

        if (getOrganizationResult.hasError) {
          return {
            hasError: true,
            error: wrapError(
              getOrganizationResult.error,
              `Failed to organizationRepository.getOrganizationById ${organizationIds[0]}`,
            ),
            value: null,
          }
        }
        districtId = getOrganizationResult.value?.districtId ?? null
      }

      teacher = {
        ...getTeacherResult.value,
        districtId,
        organizationIds,
      }
    } else if (user.role === userRoles.student) {
      const getStudentResult =
        await this.studentRepository.getStudentDetailByUserId(user.id)

      if (getStudentResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getStudentResult.error,
            `Failed to getStudentDetailByUserId ${user.id}`,
          ),
          value: null,
        }
      }

      if (!getStudentResult.value) {
        return {
          hasError: true,
          error: {
            type: 'UserNotFound',
            message: `The specified user not found for ${user.id}`,
          },
          value: null,
        }
      }

      const getStudentStudentGroupResult =
        await this.studentStudentGroupRepository.getAllByStudentId(
          getStudentResult.value.id,
        )

      if (getStudentStudentGroupResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getStudentStudentGroupResult.error,
            `Failed to studentStudentGroupRepository.getAllByStudentId ${getStudentResult.value.id}`,
          ),
          value: null,
        }
      }

      const studentGroupIds: string[] = []
      const organizationIds: string[] = []

      for (const studentStudentGroup of getStudentStudentGroupResult.value) {
        // Take unique
        if (
          !studentGroupIds.find((e) => e === studentStudentGroup.studentGroupId)
        ) {
          studentGroupIds.push(studentStudentGroup.studentGroupId)
        }

        const getStudentGroupResult = await this.studentGroupRepository.getById(
          studentStudentGroup.studentGroupId,
        )

        if (getStudentGroupResult.hasError) {
          return {
            hasError: true,
            error: wrapError(
              getStudentGroupResult.error,
              `Failed to studentGroupRepository.getStudentGroupById ${studentGroupIds[0]}`,
            ),
            value: null,
          }
        }

        if (getStudentGroupResult.value) {
          // Take unique
          const organizationId = getStudentGroupResult.value.organizationId

          if (!organizationIds.find((e) => e === organizationId)) {
            organizationIds.push(organizationId)
          }
        }
      }

      let districtId: string | null = null

      if (organizationIds.length > 0) {
        const getOrganizationResult =
          await this.organizationRepository.getOrganizationById(
            organizationIds[0],
          )

        if (getOrganizationResult.hasError) {
          return {
            hasError: true,
            error: wrapError(
              getOrganizationResult.error,
              `Failed to organizationRepository.getOrganizationById ${organizationIds[0]}`,
            ),
            value: null,
          }
        }
        districtId = getOrganizationResult.value?.districtId ?? null
      }

      student = {
        ...getStudentResult.value,
        districtId,
        organizationIds,
        studentGroupIds,
      }
    }

    return {
      hasError: false,
      error: null,
      value: {
        user,
        administrator,
        teacher,
        student,
      },
    }
  }
}
