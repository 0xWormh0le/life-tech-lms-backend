import { AddStudentInStudentGroupUseCase, IStudentGroupRepository, IStudentRepository, ITeacherRepository } from './AddStudentInStudentGroupUseCase'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex/User'
import { IAdministratorRepository } from './AddStudentInStudentGroupUseCase'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { StudentGroup } from '../../../entities/codex/StudentGroup'
import { UserRoles } from '../../shared/Constants'

const VALID_STUDENT_GROUP_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const VALID_STUDENT_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59c'
const INVALID_STUDENT_GROUP_ID = 'student-id-00001'
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

const DISTRICT_ADMINISTRATOR: DistrictAdministrator = {
  userId: 'user-id-1',
  administratorId: 'administrator-id-1',
  email: 'administrator@gmail.com',
  createdDate: '',
  firstName: 'parth',
  lastName: 'parekh',
  administratorLMSId: 'lms-id-1',
  createdUserId: 'user-id-1',
  districtId: 'district-id-1',
}

describe('test addStudentInStudentGroup', () => {
  test('test addStudentInStudentGroup - success', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const addStudentInStudentGroupSpy = studentRepository.addStudentInStudentGroup as jest.Mock

    expect(addStudentInStudentGroupSpy.mock.calls).toEqual([[VALID_USER_DATA.id, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID]])

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(undefined)
  })

  test('when studentGroupId student group not found', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'StudentGroupNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'StudentGroupNotFound',
            message: 'student group not found',
          },
          value: null,
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentGroupNotFound')
    expect(result.value).toEqual(null)
  })

  test('when user provided invalid studentGroupId', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, INVALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidStudentGroupId')
    expect(result.value).toEqual(null)
  })

  test('when user provided invalid studentId', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, INVALID_STUDENT_GROUP_ID)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidStudentId')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator or administrator or teacher - permission denied', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(INVALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('District administrator can only add student to his district only', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-5',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ id: 'requested-user-id', loginId: 'login-id', role: 'administrator' }, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)
    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when administrator repository returns run time', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error occured',
          },
          value: null,
        }
      }),
    }

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ id: 'requested-user-id', loginId: 'login-id', role: 'administrator' }, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when administrator not found of user id', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ id: 'requested-user-id', loginId: 'login-id', role: 'administrator' }, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.value).toEqual(null)
  })

  test('when getDistrictIdByStudentGroupId method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error occured',
          },
          value: null,
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when getStudentGroupById method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error occured',
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('Teacher can only add student to his organizations only', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            teacherOrganizations: [{ name: 'Rcb', id: 'organization-1' }],
          } as TeacherOrganization,
        }
      }),
    }

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: { organizationId: 'organization-3' } as StudentGroup,
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns teacher not found error', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error occured',
          },
          value: null,
        }
      }),
    }

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when student repository addStudentInStudentGroup method returns StudentNotFoundError', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'StudentNotFoundError'>>> {
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

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const addStudentInStudentGroupSpy = studentRepository.addStudentInStudentGroup as jest.Mock

    expect(addStudentInStudentGroupSpy.mock.calls).toEqual([[VALID_USER_DATA.id, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentNotFoundError')
    expect(result.value).toEqual(null)
  })

  test('when student repository addStudentInStudentGroup method returns StudentAlreadyExists error', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'StudentAlreadyExists'>>> {
        return {
          hasError: true,
          error: {
            type: 'StudentAlreadyExists',
            message: 'student not found',
          },
          value: null,
        }
      }),
    }

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const addStudentInStudentGroupSpy = studentRepository.addStudentInStudentGroup as jest.Mock

    expect(addStudentInStudentGroupSpy.mock.calls).toEqual([[VALID_USER_DATA.id, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentAlreadyExists')
    expect(result.value).toEqual(null)
  })

  test('when student repository addStudentInStudentGroup method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      addStudentInStudentGroup: jest.fn(async function (
        createdUserId: string,
        studentGroupId: string,
        studentId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error occured',
          },
          value: null,
        }
      }),
    }

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
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

    const usecase = new AddStudentInStudentGroupUseCase(studentRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const addStudentInStudentGroupSpy = studentRepository.addStudentInStudentGroup as jest.Mock

    expect(addStudentInStudentGroupSpy.mock.calls).toEqual([[VALID_USER_DATA.id, VALID_STUDENT_GROUP_ID, VALID_STUDENT_ID]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
