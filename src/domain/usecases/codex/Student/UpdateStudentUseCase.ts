import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { User } from '../../../entities/codex/User'
import { isValidEmail, isValidUUID } from '../../shared/Ensure'
import { Errorable, E, wrapError } from '../../shared/Errors'
import {
  findDuplicatesInArrayOfString,
  StudentInfo as StudentObj,
} from './CreateStudentsUseCase'
import { userRoles } from '../../shared/Constants'
import {
  OrgnaizationsList,
  TeacherOrganization,
} from '../../../entities/codex/Teacher'
import { UserInfo } from '../Teacher/CreateTeachersUseCase'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export type StudentInfo = Omit<
  StudentObj,
  'nickName' | 'loginId' | 'password'
> & {
  nickName?: string
  loginId?: string
  password?: string
  studentLMSId?: string
  email?: string
  emailsToNotify?: string[]
}

export interface IStudentRepository {
  updateStudent(
    studentId: string,
    student: StudentInfo,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'StudentNotFoundError'>>
  >
  getDistrictIdByStudentId(
    studentId: string,
  ): Promise<
    Errorable<string, E<'UnknownRuntimeError'> | E<'StudentNotFoundError'>>
  >
  findAlreadyExistsStudentLMSId(
    studentLMSIds: string[],
    studentId?: string,
  ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>>
  getStudentOrganizationsById(
    studentId: string,
  ): Promise<
    Errorable<
      OrgnaizationsList[],
      E<'UnknownRuntimeError'> | E<'StudentNotFoundError'>
    >
  >
}

export interface IAdministratorRepository {
  getDistrictAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>
  >
}

export interface IUserRepository {
  findAlreadyExistsLoginId(
    loginIds: string[],
    studentId?: string,
  ): Promise<Errorable<(string | null)[], E<'UnknownRuntimeError'>>>

  getUsersByEmails(
    emails: string[],
    studentId?: string,
  ): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>>
}

export interface ITeacherRepository {
  getTeacherByUserId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  >
}

export class UpdateStudentUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private administratorRepository: IAdministratorRepository,
    private userRepository: IUserRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  async run(
    user: User,
    studentId: string,
    student: StudentInfo,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'AlreadyExistsError'>
      | E<'StudentNotFoundError'>
      | E<'InvalidStudentId'>
      | E<'InvalidStudentAttributes'>
      | E<'AdministratorNotFound'>
      | E<'TeacherNotFound'>
    >
  > {
    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to edit the specified student information.',
        },
        value: null,
      }
    }

    //validate with provided studentId
    if (!isValidUUID(studentId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidStudentId',
          message: 'Invalid studentId.',
        },
        value: null,
      }
    }

    let errorMessage = ''

    if (student.loginId) {
      const alreadyExistsLoginIdResult =
        await this.userRepository.findAlreadyExistsLoginId(
          [student.loginId],
          studentId,
        )

      if (alreadyExistsLoginIdResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            alreadyExistsLoginIdResult.error,
            `failed to find already exists loginId`,
          ),
          value: null,
        }
      }

      if (
        alreadyExistsLoginIdResult.value !== null &&
        alreadyExistsLoginIdResult.value.length > 0
      ) {
        errorMessage = errorMessage.concat('loginIdAlreadyExists')
      }
    }

    if (student.studentLMSId) {
      const alreadyExistsStudentLMSIdResult =
        await this.studentRepository.findAlreadyExistsStudentLMSId(
          [student.studentLMSId],
          studentId,
        )

      if (alreadyExistsStudentLMSIdResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            alreadyExistsStudentLMSIdResult.error,
            `failed to find already exists studentLMSId`,
          ),
          value: null,
        }
      }

      if (
        alreadyExistsStudentLMSIdResult.value !== null &&
        alreadyExistsStudentLMSIdResult.value.length > 0
      ) {
        errorMessage =
          errorMessage.length > 0
            ? errorMessage.concat(',studentLMSIdAlreadyExists')
            : errorMessage.concat('studentLMSIdAlreadyExists')
      }
    }

    if (student.email) {
      const emailsArr: string[] = [student.email]
      const userDataByEmails = await this.userRepository.getUsersByEmails(
        emailsArr,
        studentId,
      )

      if (userDataByEmails.hasError) {
        return {
          hasError: true,
          error: wrapError(
            userDataByEmails.error,
            `failed to getUsersByEmails for emails: '${emailsArr.join(', ')}'`,
          ),
          value: null,
        }
      }

      if (userDataByEmails.value.length > 0) {
        errorMessage =
          errorMessage.length > 0
            ? errorMessage.concat(',userAlreadyExistWithEmail')
            : errorMessage.concat('userAlreadyExistWithEmail')
      }
    }

    if (errorMessage.length > 0) {
      return {
        hasError: true,
        error: {
          type: 'AlreadyExistsError',
          message: errorMessage,
        },
        value: null,
      }
    }

    let errorMessage400 = ''

    if (student.nickName) {
      if (student.nickName.trim().length === 0) {
        errorMessage400 = errorMessage400.concat('nickNameNotProvided')
      }
    }

    if (student.emailsToNotify) {
      const emails = student.emailsToNotify.map((i) => i.toLocaleLowerCase())
      const checkValidEmails = emails.map((email) => {
        return isValidEmail(email)
      })

      //check for invalidEmail
      if (checkValidEmails.includes(false))
        errorMessage400 = errorMessage400.concat(',invalidEmail')

      //check for duplicate email
      const findDuplicateEmails = findDuplicatesInArrayOfString(emails)

      if (findDuplicateEmails.length > 0) {
        errorMessage400 =
          errorMessage400.length > 0
            ? errorMessage400.concat(',duplicateEmail')
            : errorMessage400.concat('duplicateEmail')
      }
    }

    if (!student.loginId && !student.email && !student.studentLMSId) {
      errorMessage400 =
        errorMessage400.length > 0
          ? errorMessage400.concat(',atLeastOneFieldIsMandatory')
          : errorMessage400.concat('atLeastOneFieldIsMandatory')
    }

    if (student.studentLMSId) {
      if (student.studentLMSId.trim().length === 0) {
        errorMessage400 = errorMessage400.concat(',studentLmsIdNotProvided')
      }
    }

    if (errorMessage400.length > 0) {
      return {
        hasError: true,
        error: {
          type: 'InvalidStudentAttributes',
          message: errorMessage400,
        },
        value: null,
      }
    }

    if (user.role === userRoles.administrator) {
      const getDistrictIdOfStudent =
        await this.studentRepository.getDistrictIdByStudentId(studentId)

      if (getDistrictIdOfStudent.hasError) {
        switch (getDistrictIdOfStudent.error.type) {
          case 'StudentNotFoundError': {
            return {
              hasError: true,
              error: wrapError(
                getDistrictIdOfStudent.error,
                `The specified student not found for studentId: ${studentId}.`,
              ),
              value: null,
            }
          }
          default: {
            return {
              hasError: true,
              error: wrapError(
                getDistrictIdOfStudent.error,
                `failed to get district id of student`,
              ),
              value: null,
            }
          }
        }
      }

      const districtAdministratorResult =
        await this.administratorRepository.getDistrictAdministratorByUserId(
          user.id,
        )

      if (districtAdministratorResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            districtAdministratorResult.error,
            `failed to get  district AdministratorResult`,
          ),
          value: null,
        }
      }

      if (!districtAdministratorResult.value) {
        return {
          hasError: true,
          error: {
            type: 'AdministratorNotFound',
            message: `administrator not found for userId: ${user.id}`,
          },
          value: null,
        }
      }

      if (
        districtAdministratorResult.value.districtId !==
        getDistrictIdOfStudent.value
      ) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              'The user does not have permission to edit the specified student information.',
          },
          value: null,
        }
      }
    }

    if (user.role === userRoles.teacher) {
      const getStudentOrganizations =
        await this.studentRepository.getStudentOrganizationsById(studentId)

      if (getStudentOrganizations.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getStudentOrganizations.error,
            `failed to get student organizations list from db`,
          ),
          value: null,
        }
      }

      if (getStudentOrganizations.value.length === 0) {
        return {
          hasError: true,
          error: {
            type: 'StudentNotFoundError',
            message: 'requested student not found in any organization.',
          },
          value: null,
        }
      }

      const getTeacherInfo = await this.teacherRepository.getTeacherByUserId(
        user.id,
      )

      if (getTeacherInfo.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getTeacherInfo.error,
            `failed to fetch teachers from db for teacher id ${user.id}`,
          ),
          value: null,
        }
      }

      if (!getTeacherInfo.value) {
        return {
          hasError: true,
          error: {
            type: 'TeacherNotFound',
            message: `The specified teacher not found for ${user.id}`,
          },
          value: null,
        }
      }

      if (getTeacherInfo.value.teacherOrganizations) {
        const updatePermission =
          getTeacherInfo.value.teacherOrganizations.filter((c) =>
            getStudentOrganizations.value.some((s) => s.id === c.id),
          )

        if (updatePermission.length === 0) {
          return {
            hasError: true,
            error: {
              type: 'PermissionDenied',
              message:
                'The user does not have permission to edit the specified student information.',
            },
            value: null,
          }
        }
      }
    }

    const studentResult = await this.studentRepository.updateStudent(
      studentId,
      student,
    )

    if (studentResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          studentResult.error,
          `failed to update student ${JSON.stringify(student)}`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
