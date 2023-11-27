import { DeleteStudentUseCase, IStudentRepository, IAdministratorRepository, ITeacherRepository } from './DeleteStudentUseCase'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex/User'

import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { OrgnaizationsList, TeacherOrganization } from '../../../entities/codex/Teacher'
import { UserRoles } from '../../shared/Constants'

const VALID_STUDENT_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_STUDENT_ID = 'student-id-00001'
const VALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: 'internalOperator',
}
const INVALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: 'student',
}

describe('test DeleteStudentUseCase', () => {
  test('test DeleteStudentUseCase - success', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),

      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID)

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const deleteStudentSpy = studentRepository.deleteStudent as jest.Mock

    expect(deleteStudentSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(undefined)
  })

  test('when requested student id not found', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),

      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'StudentNotFoundError'>>> {
        return {
          hasError: true,
          error: {
            type: 'StudentNotFoundError',
            message: 'student not found',
          },
          value: null,
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_ID)

    const getDistrictIdByStudentIdSpy = studentRepository.getDistrictIdByStudentId as jest.Mock

    expect(getDistrictIdByStudentIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const deleteStudentSpy = studentRepository.deleteStudent as jest.Mock

    expect(deleteStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentNotFoundError')
    expect(result.value).toEqual(null)
  })

  test('when user provided invalid studentId', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, INVALID_STUDENT_ID)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidStudentId')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator or administrator or teacher- permission denied', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(INVALID_USER_DATA, VALID_STUDENT_ID)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('District administrator can only delete student information to his district student only', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-2',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            userId: 'user-id-1',
            administratorId: 'administrator-id-1',
            email: 'administrator@gmail.com',
            createdDate: '',
            firstName: 'parth',
            lastName: 'parekh',
            administratorLMSId: 'lms-id-1',
            createdUserId: 'user-id-1',
            districtId: 'district-id-1',
          } as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_ID)

    const getDistrictIdByStudentIdSpy = studentRepository.getDistrictIdByStudentId as jest.Mock

    expect(getDistrictIdByStudentIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([[VALID_USER_DATA.id]])

    const deleteStudentSpy = studentRepository.deleteStudent as jest.Mock

    expect(deleteStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when administrator not found of user id', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_ID)

    const getDistrictIdByStudentIdSpy = studentRepository.getDistrictIdByStudentId as jest.Mock

    expect(getDistrictIdByStudentIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([[VALID_USER_DATA.id]])

    const deleteStudentSpy = studentRepository.deleteStudent as jest.Mock

    expect(deleteStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when administrator not found of user id', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_ID)

    const getDistrictIdByStudentIdSpy = studentRepository.getDistrictIdByStudentId as jest.Mock

    expect(getDistrictIdByStudentIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([[VALID_USER_DATA.id]])

    const deleteStudentSpy = studentRepository.deleteStudent as jest.Mock

    expect(deleteStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.value).toEqual(null)
  })

  test('when getDistrictIdByStudentId returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_ID)

    const getDistrictIdByStudentIdSpy = studentRepository.getDistrictIdByStudentId as jest.Mock

    expect(getDistrictIdByStudentIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const deleteStudentSpy = studentRepository.deleteStudent as jest.Mock

    expect(deleteStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when student repository deleteStudent method returns student not found error', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'StudentNotFoundError'>>> {
        return {
          hasError: true,
          error: {
            type: 'StudentNotFoundError',
            message: 'student not found',
          },
          value: null,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID)

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const deleteStudentSpy = studentRepository.deleteStudent as jest.Mock

    expect(deleteStudentSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentNotFoundError')
    expect(result.value).toEqual(null)
  })

  test('when getStudentOrganizationsById method returns student not found error', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_ID)

    const getStudentOrganizationsByIdSpy = studentRepository.getStudentOrganizationsById as jest.Mock

    expect(getStudentOrganizationsByIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentNotFoundError')
    expect(result.value).toEqual(null)
  })

  test('when getStudentOrganizationsById method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_ID)

    const getStudentOrganizationsByIdSpy = studentRepository.getStudentOrganizationsById as jest.Mock

    expect(getStudentOrganizationsByIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('Teacher can only delete student of his organizations', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ name: 'RCB', id: 'organization-1' }],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            teacherOrganizations: [{ name: 'Rcb', id: 'organization-2' }],
          } as TeacherOrganization,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_ID)

    const getStudentOrganizationsByIdSpy = studentRepository.getStudentOrganizationsById as jest.Mock

    expect(getStudentOrganizationsByIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns teacher not found error', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ name: 'RCB', id: 'organization-1' }],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_ID)

    const getStudentOrganizationsByIdSpy = studentRepository.getStudentOrganizationsById as jest.Mock

    expect(getStudentOrganizationsByIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ name: 'RCB', id: 'organization-1' }],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_ID)

    const getStudentOrganizationsByIdSpy = studentRepository.getStudentOrganizationsById as jest.Mock

    expect(getStudentOrganizationsByIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when student repository deleteStudent method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      deleteStudent: jest.fn(async function (studentId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new DeleteStudentUseCase(studentRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID)

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const deleteStudentSpy = studentRepository.deleteStudent as jest.Mock

    expect(deleteStudentSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
