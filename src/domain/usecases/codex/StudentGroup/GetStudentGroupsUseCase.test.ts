import { StudentGroup } from '../../../entities/codex/StudentGroup'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { Errorable, E } from '../../shared/Errors'
import { GetStudentGroupsUseCase, IStudentGroupRepository, ITeacherRepository } from './GetStudentGroupsUseCase'

describe('test GetStudentGroupsUseCase', () => {
  test('test GetStudentGroupsUseCase - success', async () => {
    const getStudentGroupsRepository: IStudentGroupRepository = {
      getStudentGroups: jest.fn(async function (organizationId: string): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'student-group-1',
              organizationId: 'organization-id-1',
              name: 'FL Group',
              grade: 'grade1',
              studentGroupLmsId: 'student-group-lms-id-1',
              createdUserId: 'user-id-1',
              updatedUserId: 'user-id-1',
              createdDate: '2022-05-17T11:54:02.141Z',
              updatedDate: '2022-05-17T11:54:02.141Z',
            },
            {
              id: 'student-group-2',
              organizationId: 'organization-id-2',
              name: 'HL Group',
              grade: 'grade1',
              studentGroupLmsId: 'student-group-lms-id-1',
              createdUserId: 'user-id-1',
              updatedUserId: 'user-id-1',
              createdDate: '2022-05-17T11:54:02.141Z',
              updatedDate: '2022-05-17T11:54:02.141Z',
            },
          ] as StudentGroup[],
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
    const usecase = new GetStudentGroupsUseCase(getStudentGroupsRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    const getStudentGroupsByOrganizationIdSpy = getStudentGroupsRepository.getStudentGroups as jest.Mock

    expect(getStudentGroupsByOrganizationIdSpy.mock.calls).toEqual([['b9484b02-2d71-4b3f-afb0-57057843a59d']])
    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual([
      {
        id: 'student-group-1',
        organizationId: 'organization-id-1',
        name: 'FL Group',
        grade: 'grade1',
        studentGroupLmsId: 'student-group-lms-id-1',
        createdUserId: 'user-id-1',
        updatedUserId: 'user-id-1',
        createdDate: '2022-05-17T11:54:02.141Z',
        updatedDate: '2022-05-17T11:54:02.141Z',
      },
      {
        id: 'student-group-2',
        organizationId: 'organization-id-2',
        name: 'HL Group',
        grade: 'grade1',
        studentGroupLmsId: 'student-group-lms-id-1',
        createdUserId: 'user-id-1',
        updatedUserId: 'user-id-1',
        createdDate: '2022-05-17T11:54:02.141Z',
        updatedDate: '2022-05-17T11:54:02.141Z',
      },
    ] as StudentGroup[])
  })

  test('invalid organizationId', async () => {
    const getStudentGroupsRepository: IStudentGroupRepository = {
      getStudentGroups: jest.fn(async function (organizationId: string): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
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
    const usecase = new GetStudentGroupsUseCase(getStudentGroupsRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      'organization-id-1',
    )

    expect(result.hasError).toEqual(true)

    const getStudentGroupsByOrganizationIdSpy = getStudentGroupsRepository.getStudentGroups as jest.Mock

    expect(getStudentGroupsByOrganizationIdSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidOrganizationId')
    expect(result.error?.message).toEqual('Invalid organizationId')
    expect(result.value).toEqual(null)
  })

  test('when student groups repository returns runtime error', async () => {
    const getStudentGroupsRepository: IStudentGroupRepository = {
      getStudentGroups: jest.fn(async function (organizationId: string): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
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

    const usecase = new GetStudentGroupsUseCase(getStudentGroupsRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator or administrator or teacher - permission denied', async () => {
    const getStudentGroupsRepository: IStudentGroupRepository = {
      getStudentGroups: jest.fn(async function (organizationId: string): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
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
    const usecase = new GetStudentGroupsUseCase(getStudentGroupsRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('there is no organization information found to the requested organization id', async () => {
    const getStudentGroupsRepository: IStudentGroupRepository = {
      getStudentGroups: jest.fn(async function (organizationId: string): Promise<Errorable<StudentGroup[], E<'OrganizationNotFoundError'>>> {
        return {
          hasError: true,
          error: {
            type: 'OrganizationNotFoundError',
            message: 'something wrong happened',
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
    const usecase = new GetStudentGroupsUseCase(getStudentGroupsRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('OrganizationNotFoundError')
    expect(result.value).toEqual(null)
  })

  test('Teacher can only view student-groups information to his organizations only', async () => {
    const getStudentGroupsRepository: IStudentGroupRepository = {
      getStudentGroups: jest.fn(async function (organizationId: string): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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

    const usecase = new GetStudentGroupsUseCase(getStudentGroupsRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns teacher not found error', async () => {
    const getStudentGroupsRepository: IStudentGroupRepository = {
      getStudentGroups: jest.fn(async function (organizationId: string): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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

    const usecase = new GetStudentGroupsUseCase(getStudentGroupsRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns runtime error', async () => {
    const getStudentGroupsRepository: IStudentGroupRepository = {
      getStudentGroups: jest.fn(async function (organizationId: string): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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

    const usecase = new GetStudentGroupsUseCase(getStudentGroupsRepository, teacherRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
