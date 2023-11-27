import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { User } from '../../../entities/codex/User'
import { Errorable, E } from '../../shared/Errors'
import { CreateStudentGroupUseCase, StudentGroupInfo, IStudentGroupRepository, ITeacherRepository } from './CreateStudentGroupUseCase'

describe('test CreateStudentGroupUseCase', () => {
  test('success', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      createStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        organizationId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
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
    const usecase = new CreateStudentGroupUseCase(studentGroupRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      {
        name: 'Fl Group',
        packageId: 'package-id-1',
        grade: 'grade1',
        studentGroupLmsId: '1',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    expect(result.hasError).toEqual(false)

    const createStudentGroupSpy = studentGroupRepository.createStudentGroup as jest.Mock

    expect(createStudentGroupSpy.mock.calls).toEqual([
      [
        {
          id: 'requested-user-id',
          loginId: 'login-id',
          role: 'internalOperator',
        },
        {
          name: 'Fl Group',
          packageId: 'package-id-1',
          grade: 'grade1',
          studentGroupLmsId: '1',
        },
        'b9484b02-2d71-4b3f-afb0-57057843a59d',
      ],
    ])
    expect(result.value).toEqual(undefined)
  })

  test('given student group already exists', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      createStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        organizationId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistError',
            message: 'student group already exists',
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
    const usecase = new CreateStudentGroupUseCase(studentGroupRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      {
        name: 'Fl Group',
        packageId: 'package-id-1',
        grade: 'grade1',
        studentGroupLmsId: '1',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    const createStudentGroupSpy = studentGroupRepository.createStudentGroup as jest.Mock

    expect(createStudentGroupSpy.mock.calls).toEqual([
      [
        {
          id: 'requested-user-id',
          loginId: 'login-id',
          role: 'internalOperator',
        },
        {
          name: 'Fl Group',
          packageId: 'package-id-1',
          grade: 'grade1',
          studentGroupLmsId: '1',
        },
        'b9484b02-2d71-4b3f-afb0-57057843a59d',
      ],
    ])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AlreadyExistError')
    expect(result.value).toEqual(null)
  })

  test('the repository returns unknown runtime error', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      createStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        organizationId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error occurred',
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
    const usecase = new CreateStudentGroupUseCase(studentGroupRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      {
        name: 'Fl Group',
        packageId: 'package-id-1',
        grade: 'grade1',
        studentGroupLmsId: '1',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )
    const createStudentGroupSpy = studentGroupRepository.createStudentGroup as jest.Mock

    expect(createStudentGroupSpy.mock.calls).toEqual([
      [
        {
          id: 'requested-user-id',
          loginId: 'login-id',
          role: 'internalOperator',
        },
        {
          name: 'Fl Group',
          packageId: 'package-id-1',
          grade: 'grade1',
          studentGroupLmsId: '1',
        },
        'b9484b02-2d71-4b3f-afb0-57057843a59d',
      ],
    ])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid organizationId returns invalid error', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      createStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        organizationId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error occurred',
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
    const usecase = new CreateStudentGroupUseCase(studentGroupRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      {
        name: 'Fl Group',
        packageId: 'package-id-1',
        grade: 'grade1',
        studentGroupLmsId: '1',
      },
      'organization-id-1',
    )

    expect(result.hasError).toEqual(true)

    const createStudentGroupSpy = studentGroupRepository.createStudentGroup as jest.Mock

    expect(createStudentGroupSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidOrganizationId')
    expect(result.error?.message).toEqual('Invalid organizationId')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator or administrator or teacher - permission denied', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      createStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        organizationId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error occurred',
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
    const usecase = new CreateStudentGroupUseCase(studentGroupRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      {
        name: 'Fl Group',
        packageId: 'package-id-1',
        grade: 'grade1',
        studentGroupLmsId: '1',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('Administrator can not add student group of other district - permission denied', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      createStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        organizationId: string,
      ): Promise<Errorable<void, E<'PermissionDenied'>>> {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message: 'Access Denied',
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
    const usecase = new CreateStudentGroupUseCase(studentGroupRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      {
        name: 'Fl Group',
        packageId: 'package-id-1',
        grade: 'grade1',
        studentGroupLmsId: '1',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('there is no organization information found to the requested organization id', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      createStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        organizationId: string,
      ): Promise<Errorable<void, E<'OrganizationInfoNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'OrganizationInfoNotFound',
            message: 'Organization info not found of requested organizationId',
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
    const usecase = new CreateStudentGroupUseCase(studentGroupRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      {
        name: 'Fl Group',
        packageId: 'package-id-1',
        grade: 'grade1',
        studentGroupLmsId: '1',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('OrganizationInfoNotFound')
    expect(result.value).toEqual(null)
  })

  test('there is no district administrator information found to the requested user id', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      createStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        organizationId: string,
      ): Promise<Errorable<void, E<'AdministratorNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'AdministratorNotFound',
            message: 'District administrator information info not found of requested user id',
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
    const usecase = new CreateStudentGroupUseCase(studentGroupRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      {
        name: 'Fl Group',
        packageId: 'package-id-1',
        grade: 'grade1',
        studentGroupLmsId: '1',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.value).toEqual(null)
  })

  test('Teacher can only add student-group to his organizations only', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      createStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        organizationId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
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
    const usecase = new CreateStudentGroupUseCase(studentGroupRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      {
        name: 'Fl Group',
        packageId: 'package-id-1',
        grade: 'grade1',
        studentGroupLmsId: '1',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])

    const createStudentGroupSpy = studentGroupRepository.createStudentGroup as jest.Mock

    expect(createStudentGroupSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns teacher not found error', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      createStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        organizationId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
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
    const usecase = new CreateStudentGroupUseCase(studentGroupRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      {
        name: 'Fl Group',
        packageId: 'package-id-1',
        grade: 'grade1',
        studentGroupLmsId: '1',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])

    const createStudentGroupSpy = studentGroupRepository.createStudentGroup as jest.Mock

    expect(createStudentGroupSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns runtime error', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      createStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        organizationId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
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
            message: 'unknown error occurred',
          },
          value: null,
        }
      }),
    }
    const usecase = new CreateStudentGroupUseCase(studentGroupRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      {
        name: 'Fl Group',
        packageId: 'package-id-1',
        grade: 'grade1',
        studentGroupLmsId: '1',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])

    const createStudentGroupSpy = studentGroupRepository.createStudentGroup as jest.Mock

    expect(createStudentGroupSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
