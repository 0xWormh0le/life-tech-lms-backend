import { User } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidEmail, isValidUUID } from '../../shared/Ensure'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { userRoles } from '../../shared/Constants'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { StudentGroup } from '../../../entities/codex/StudentGroup'
import { UserInfo } from '../Teacher/CreateTeachersUseCase'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export type StudentInfo = {
  nickName: string
  loginId: string
  password: string
  studentLMSId?: string
  emailsToNotify?: string[]
  email?: string
  classLinkTenantId?: string
}

export type BadRequestError = {
  index: number
  message: BadRequestEnum[]
}

export enum BadRequestEnum {
  duplicateEmail = 'duplicateEmail',
  invalidEmail = 'invalidEmail',
  loginIdAlreadyExists = 'loginIdAlreadyExists',
  nickNameNotProvided = 'nickNameNotProvided',
  studentLmsIdNotProvided = 'studentLmsIdNotProvided',
  emptyPassword = 'emptyPassword',
  studentLMSIdAlreadyExists = 'studentLMSIdAlreadyExists',
  duplicateRecordsWithSameLoginId = 'duplicateRecordsWithSameLoginId',
  duplicateRecordsWithStudentLMSId = 'duplicateRecordsWithStudentLMSId',
  loginIdSholdNotContainedWhiteSpace = 'loginIdSholdNotContainedWhiteSpace',
  userAlreadyExistWithEmail = 'userAlreadyExistWithEmail',
  duplicateRecordsWithSameEmail = 'duplicateRecordsWithSameEmail',
  atLeastOneFieldIsMandatory = 'atLeastOneFieldIsMandatory',
}

export interface IStudentRepository {
  createStudents(
    data: StudentInfo[],
    createdUserId: string,
    studentGroupId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>

  findAlreadyExistsStudentLMSId(
    studentLMSIds: string[],
  ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>>
}

export interface IUserRepository {
  findAlreadyExistsLoginId(
    loginIds: string[],
  ): Promise<Errorable<(string | null)[], E<'UnknownRuntimeError'>>>
  getUsersByEmails(
    emails: string[],
  ): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>>
}

export interface IStudentGroupRepository {
  getDistrictIdByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>
  >
  getStudentGroupById(
    studentGroupId: string,
  ): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>>
}

export interface IAdministratorRepository {
  getDistrictAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>
  >
}

export interface ITeacherRepository {
  getTeacherByUserId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  >
}

export const findDuplicatesInArrayOfString = (value: string[]): string[] => {
  const findDuplicates = (value: string[]) =>
    value.filter((item, index) => value.indexOf(item) != index)

  return [...new Set(findDuplicates(value))] //return unique duplicate values
}

const getValidationMessagesForStudent = (
  student: StudentInfo,
): BadRequestEnum[] => {
  const errors: BadRequestEnum[] = []
  const assert = (expr: boolean, msg: BadRequestEnum): boolean => {
    if (!expr) {
      errors.push(msg)

      return false
    }

    return true
  }

  assert(student.nickName ? true : false, BadRequestEnum.nickNameNotProvided)

  if (student.nickName) {
    assert(
      student.nickName.trim().length === 0 ? false : true,
      BadRequestEnum.nickNameNotProvided,
    )
  }

  if (!student.studentLMSId && !student.email && !student.loginId) {
    assert(
      student.loginId ? true : false,
      BadRequestEnum.atLeastOneFieldIsMandatory,
    )
  }

  if (student.loginId) {
    assert(student.password ? true : false, BadRequestEnum.emptyPassword)
  }

  if (student.email) {
    assert(isValidEmail(student.email), BadRequestEnum.invalidEmail)
  }

  if (student.studentLMSId) {
    assert(
      student.studentLMSId.trim().length !== 0 ? true : false,
      BadRequestEnum.studentLmsIdNotProvided,
    )
  }

  return errors
}

export class CreateStudentsUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private userRepository: IUserRepository,
    private studentGroupRepository: IStudentGroupRepository,
    private administratorRepository: IAdministratorRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  async run(
    user: User,
    studentGroupId: string,
    data: StudentInfo[],
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidStudentGroupId'>
      | E<'StudentGroupNotFound'>
      | E<'InvalidStudentAttributes', BadRequestError[]>
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
          message: 'The user does not have permission to add the students.',
        },
        value: null,
      }
    }

    //validate with provided studentGroupId
    if (!isValidUUID(studentGroupId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidStudentGroupId',
          message: 'Invalid studentGroupId.',
        },
        value: null,
      }
    }

    //find district id from studentGroupId
    const studentGroupResult =
      await this.studentGroupRepository.getDistrictIdByStudentGroupId(
        studentGroupId,
      )

    if (studentGroupResult.hasError) {
      switch (studentGroupResult.error.type) {
        case 'StudentGroupNotFound': {
          return {
            hasError: true,
            error: wrapError(
              studentGroupResult.error,
              `The specified student group not found for studentGroupId: ${studentGroupId}.`,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              studentGroupResult.error,
              `failed to get district id of studentGroupId`,
            ),
            value: null,
          }
        }
      }
    }

    if (user.role === userRoles.administrator) {
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
        studentGroupResult.value
      ) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message: 'The user does not have permission to add the students.',
          },
          value: null,
        }
      }
    }

    if (user.role === userRoles.teacher) {
      const getStudentGroupInfo =
        await this.studentGroupRepository.getStudentGroupById(studentGroupId)

      if (getStudentGroupInfo.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getStudentGroupInfo.error,
            `failed to get student group for ${studentGroupId}`,
          ),
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
        const teacherOrganizations =
          getTeacherInfo.value.teacherOrganizations.find(
            (i) => i.id === getStudentGroupInfo?.value?.organizationId,
          )

        if (!teacherOrganizations) {
          return {
            hasError: true,
            error: {
              type: 'PermissionDenied',
              message: 'The user does not have permission to add the students.',
            },
            value: null,
          }
        }
      }
    }

    //find already exists login id
    const loginIdArray: string[] = []

    data.map((i) => {
      if (i.loginId) {
        loginIdArray.push(i.loginId)
      }
    })

    const alreadyExistsLoginIdResult =
      await this.userRepository.findAlreadyExistsLoginId(loginIdArray)

    if (alreadyExistsLoginIdResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          alreadyExistsLoginIdResult.error,
          `failed to find already exists login id`,
        ),
        value: null,
      }
    }

    //find already exists student lms id
    const studentLMSIdArray: string[] = []

    data.map((i) => {
      if (i.studentLMSId) {
        studentLMSIdArray.push(i.studentLMSId)
      }
    })

    const alreadyExistsStudentLMSIdResult =
      await this.studentRepository.findAlreadyExistsStudentLMSId(
        studentLMSIdArray,
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

    const emailsArr: string[] = []

    data.forEach((item) => {
      if (item.email) {
        emailsArr.push(item.email)
      }
    })

    const userDataByEmails = await this.userRepository.getUsersByEmails(
      emailsArr,
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

    const alreadyExistsEmailsInUserTable: (string | null)[] = []

    userDataByEmails.value.forEach((item) => {
      alreadyExistsEmailsInUserTable.push(item.email)
    })

    const allErrors: { index: number; message: BadRequestEnum[] }[] = []

    data.map((student, index) => {
      const errors: BadRequestEnum[] = getValidationMessagesForStudent(student)

      if (student.loginId) {
        const duplicateLoginId = loginIdArray.filter(
          (item) => item === student.loginId,
        )

        if (duplicateLoginId.length > 1) {
          errors.push(BadRequestEnum.duplicateRecordsWithSameLoginId)
        }
      }

      if (/\s/.test(student.loginId)) {
        errors.push(BadRequestEnum.loginIdSholdNotContainedWhiteSpace)
      }

      if (student.studentLMSId) {
        const duplicateLMSId = studentLMSIdArray.filter(
          (item) => item === student.studentLMSId,
        )

        if (duplicateLMSId.length > 1) {
          errors.push(BadRequestEnum.duplicateRecordsWithStudentLMSId)
        }
      }

      if (student.email) {
        if (!errors.includes(BadRequestEnum.invalidEmail)) {
          const duplicateEmails = emailsArr.filter(
            (item) => item === student.email,
          )

          if (duplicateEmails.length > 1) {
            errors.push(BadRequestEnum.duplicateRecordsWithSameEmail)
          }
        }
      }

      if (student.emailsToNotify) {
        const emails = student.emailsToNotify.map((i) => i.toLocaleLowerCase())
        const checkValidEmails = emails.map((email) => {
          return isValidEmail(email)
        })

        //check for invalidEmail
        if (checkValidEmails.includes(false))
          errors.push(BadRequestEnum.invalidEmail)

        //check for duplicate email
        const findDuplicateEmails = findDuplicatesInArrayOfString(emails)

        if (findDuplicateEmails.length > 0) {
          errors.push(BadRequestEnum.duplicateEmail)
        }
      }

      if (
        !!student.loginId &&
        alreadyExistsLoginIdResult.value.includes(student.loginId)
      ) {
        errors.push(BadRequestEnum.loginIdAlreadyExists)
      }

      if (
        !!student.studentLMSId &&
        alreadyExistsStudentLMSIdResult.value.includes(student.studentLMSId)
      ) {
        errors.push(BadRequestEnum.studentLMSIdAlreadyExists)
      }

      if (
        !!student.email &&
        alreadyExistsEmailsInUserTable.includes(student.email)
      ) {
        errors.push(BadRequestEnum.userAlreadyExistWithEmail)
      }

      if (errors.length) {
        allErrors.push({ index: index, message: errors })
      }
    })

    if (allErrors.length > 0) {
      return {
        hasError: true,
        error: {
          type: 'InvalidStudentAttributes',
          message: allErrors as BadRequestError[],
        },
        value: null,
      }
    }

    const studentRepositoryResult = await this.studentRepository.createStudents(
      data,
      user.id,
      studentGroupId,
    )

    if (studentRepositoryResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          studentRepositoryResult.error,
          `Failed to add students`,
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
