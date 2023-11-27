import { StudentGroup } from '../../../entities/codex/StudentGroup'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { User } from '../../../entities/codex/User'
import { Errorable, E } from '../../shared/Errors'
import { UpdateStudentGroupUseCase, StudentGroupInfo, IStudentGroupRepository, ITeacherRepository } from './UpdateStudentGroupUseCase'

describe('test UpdateStudentGroupUseCase', () => {
  test('success', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
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
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)
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

    const updateStudentGroupSpy = studentGroupRepository.updateStudentGroup as jest.Mock

    expect(updateStudentGroupSpy.mock.calls).toEqual([
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

  test('user is not internal operator or administrator or teacher - permission denied', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
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
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)

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

  test('the repository returns unknown runtime error', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
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
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)

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
    const updateStudentGroupSpy = studentGroupRepository.updateStudentGroup as jest.Mock

    expect(updateStudentGroupSpy.mock.calls).toEqual([
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

  test('When provided invalid studentGroupId returns invalid error', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
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
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)

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
      'student-group-id-1',
    )

    expect(result.hasError).toEqual(true)

    const updateStudentGroupSpy = studentGroupRepository.updateStudentGroup as jest.Mock

    expect(updateStudentGroupSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidStudentGroupId')
    expect(result.error?.message).toEqual('Invalid studentGroupId')
    expect(result.value).toEqual(null)
  })

  test('there is no student group information found to the requested studentGroupId', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'StudentGroupInfoNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'StudentGroupInfoNotFound',
            message: 'Student group info not found of requested studentGroupId',
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
    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)
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
    const updateStudentGroupSpy = studentGroupRepository.updateStudentGroup as jest.Mock

    expect(updateStudentGroupSpy.mock.calls).toEqual([
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
    expect(result.error?.type).toEqual('StudentGroupInfoNotFound')
  })

  test('there is no organization information found to the requested organization id', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'OrganizationInfoNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'OrganizationInfoNotFound',
            message: 'Organization info not found of requested studentGroupId',
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
    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)
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
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
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
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)
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

  test('Administrator can not update student group of other district - permission denied', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
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
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)
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

  test('given student group name already exists', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistError',
            message: 'student group name already exists',
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
    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)

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

    const updateStudentGroupSpy = studentGroupRepository.updateStudentGroup as jest.Mock

    expect(updateStudentGroupSpy.mock.calls).toEqual([
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

  test('when getStudentGroupById method returns student group not found error', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)

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
    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([['b9484b02-2d71-4b3f-afb0-57057843a59d']])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([])

    const updateStudentGroupSpy = studentGroupRepository.updateStudentGroup as jest.Mock

    expect(updateStudentGroupSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentGroupInfoNotFound')
    expect(result.value).toEqual(null)
  })

  test('when getStudentGroupById method returns run time error', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)

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
    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([['b9484b02-2d71-4b3f-afb0-57057843a59d']])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([])

    const updateStudentGroupSpy = studentGroupRepository.updateStudentGroup as jest.Mock

    expect(updateStudentGroupSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('Teacher can only edit student-group information to his organizations only', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
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
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)

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
    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([['b9484b02-2d71-4b3f-afb0-57057843a59d']])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])

    const updateStudentGroupSpy = studentGroupRepository.updateStudentGroup as jest.Mock

    expect(updateStudentGroupSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns teacher not found error', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
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
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)

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
    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([['b9484b02-2d71-4b3f-afb0-57057843a59d']])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])

    const updateStudentGroupSpy = studentGroupRepository.updateStudentGroup as jest.Mock

    expect(updateStudentGroupSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns run time error', async () => {
    const studentGroupRepository: IStudentGroupRepository = {
      updateStudentGroup: jest.fn(async function (
        user: User,
        studentGroup: StudentGroupInfo,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
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
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error occurred',
          },
          value: null,
        }
      }),
    }
    const usecase = new UpdateStudentGroupUseCase(studentGroupRepository, teacherRepository)

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
    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([['b9484b02-2d71-4b3f-afb0-57057843a59d']])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])

    const updateStudentGroupSpy = studentGroupRepository.updateStudentGroup as jest.Mock

    expect(updateStudentGroupSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
