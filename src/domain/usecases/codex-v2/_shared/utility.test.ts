import { E, Errorable } from '../../shared/Errors'
import { Administrator } from '../../../entities/codex-v2/Administrator'
import { nowStr } from '../_testShaerd/UseCaseTestUtility.test'
import {
  findDistrictIdByAdministratorsUserId,
  findDistrictIdByStudentGroupId,
  findDistrictIdsByAuthenticatedUser,
  findDistrictIdsByOrganizationIds,
  findDistrictIdsByStudentsUserId,
  findDistrictIdsByTeachersUserId,
} from './utility'
import { AdministratorRepository } from './repositories/AdministratorRepository'
import { TeacherRepository } from './repositories/TeacherRepository'
import { TeacherOrganizationAffiliationRepository } from './repositories/TeacherOrganizationAffiliatioRepository'
import { OrganizationRepository } from './repositories/OrganizationRepository'
import { Teacher } from '../../../entities/codex-v2/Teacher'
import { TeacherOrganizationAffiliation } from '../../../entities/codex-v2/TeacherOrganizationAffiliation'
import { Organization } from '../../../entities/codex-v2/Organization'
import { StudentRepository } from './repositories/StudentRepository'
import { StudentGroupRepository } from './repositories/StudentGroupRepository'
import { StudentStudentGroupAffiliationRepository } from './repositories/StudentStudentGroupAffiliationRepository'
import { Student } from '../../../entities/codex-v2/Student'
import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { StudentStudentGroupAffiliation } from '../../../entities/codex-v2/StudentStudentGroupAffiliation'
import { User } from '../../../entities/codex-v2/User'

describe('utility', () => {
  describe('findDistrictIdByAdministratorsUserId', () => {
    test('success', async () => {
      const administratorRepository = createUtilitySuccessMockAdministratorRepository()
      const res = await findDistrictIdByAdministratorsUserId('testUserId', administratorRepository)

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toEqual('testDistrictId1')
    })

    test('error on administratorRepository.findByUserId', async () => {
      const administratorRepository = createUtilitySuccessMockAdministratorRepository()

      administratorRepository.findByUserId = jest.fn(async (_userId: string): Promise<Errorable<Administrator | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const res = await findDistrictIdByAdministratorsUserId('testUserId', administratorRepository)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'error message',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })

    test('administratorRepository.findByUserId returns null', async () => {
      const administratorRepository = createUtilitySuccessMockAdministratorRepository()

      administratorRepository.findByUserId = jest.fn(async (_userId: string): Promise<Errorable<Administrator | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const res = await findDistrictIdByAdministratorsUserId('testUserId', administratorRepository)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'administrator is not found. userId: testUserId',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })
  })

  describe('findDistrictIdsByTeachersUserId', () => {
    test('success', async () => {
      const teacherRepository = createUtilitySuccessMockTeacherRepository()
      const teacherOrganizationAffiliationRepository = createUtilitySuccessMockTeacherOrganizationAffiliationRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()
      const res = await findDistrictIdsByTeachersUserId('testUserId', teacherRepository, teacherOrganizationAffiliationRepository, organizationRepository)

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toEqual(['testDistrictId1', 'testDistrictId2'])
    })

    test('error on teacherRepository.findByUserId', async () => {
      const teacherRepository = createUtilitySuccessMockTeacherRepository()
      const teacherOrganizationAffiliationRepository = createUtilitySuccessMockTeacherOrganizationAffiliationRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      teacherRepository.findByUserId = jest.fn(async (_userId: string): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const res = await findDistrictIdsByTeachersUserId('testUserId', teacherRepository, teacherOrganizationAffiliationRepository, organizationRepository)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'error message',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })

    test('teacherRepository.findByUserId returns null', async () => {
      const teacherRepository = createUtilitySuccessMockTeacherRepository()
      const teacherOrganizationAffiliationRepository = createUtilitySuccessMockTeacherOrganizationAffiliationRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      teacherRepository.findByUserId = jest.fn(async (_userId: string): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const res = await findDistrictIdsByTeachersUserId('testUserId', teacherRepository, teacherOrganizationAffiliationRepository, organizationRepository)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'teacher is not found. userId: testUserId',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })

    test('error on teacherOrganizationAffiliationRepository.findByUserId', async () => {
      const teacherRepository = createUtilitySuccessMockTeacherRepository()
      const teacherOrganizationAffiliationRepository = createUtilitySuccessMockTeacherOrganizationAffiliationRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      teacherOrganizationAffiliationRepository.findByTeacherId = jest.fn(
        async (_teacherId: string): Promise<Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>> => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'error message',
            },
            value: null,
          }
        },
      )

      const res = await findDistrictIdsByTeachersUserId('testUserId', teacherRepository, teacherOrganizationAffiliationRepository, organizationRepository)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'error message',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })
  })

  describe('findDistrictIdsByOrganizationIds', () => {
    test('success', async () => {
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()
      const res = await findDistrictIdsByOrganizationIds(['organizationId1', 'organizationId2'], organizationRepository)

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toEqual(['testDistrictId1', 'testDistrictId2'])
    })

    test('error on organizationRepository.findByIds', async () => {
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      organizationRepository.findByIds = jest.fn(async (_organizationIds: string[]): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const res = await findDistrictIdsByOrganizationIds(['organizationId1', 'organizationId2'], organizationRepository)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'error message',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })
  })

  describe('findDistrictIdsByStudentId', () => {
    test('success', async () => {
      const studentRepository = createUtilitySuccessMockStudentRepository()
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const studentStudentGroupAffiliationRepository = createUtilitySuccessMockStudentStudentGroupAffiliationRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()
      const res = await findDistrictIdsByStudentsUserId(
        'testStudentId',
        studentRepository,
        studentGroupRepository,
        studentStudentGroupAffiliationRepository,
        organizationRepository,
      )

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toEqual(['testDistrictId1', 'testDistrictId2'])
    })

    test('error on studentRepository.findByUserId', async () => {
      const studentRepository = createUtilitySuccessMockStudentRepository()
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const studentStudentGroupAffiliationRepository = createUtilitySuccessMockStudentStudentGroupAffiliationRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      studentRepository.findByUserId = jest.fn(async (_userId: string): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const res = await findDistrictIdsByStudentsUserId(
        'testStudentId',
        studentRepository,
        studentGroupRepository,
        studentStudentGroupAffiliationRepository,
        organizationRepository,
      )

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'error message',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })

    test('studentRepository.findByUserId returns null', async () => {
      const studentRepository = createUtilitySuccessMockStudentRepository()
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const studentStudentGroupAffiliationRepository = createUtilitySuccessMockStudentStudentGroupAffiliationRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      studentRepository.findByUserId = jest.fn(async (_studentId: string): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const res = await findDistrictIdsByStudentsUserId(
        'testStudentUserId',
        studentRepository,
        studentGroupRepository,
        studentStudentGroupAffiliationRepository,
        organizationRepository,
      )

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'student is not found. userId: testStudentUserId',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })

    test('error on studentGroupRepository.findByIds', async () => {
      const studentRepository = createUtilitySuccessMockStudentRepository()
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const studentStudentGroupAffiliationRepository = createUtilitySuccessMockStudentStudentGroupAffiliationRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      studentGroupRepository.findByIds = jest.fn(async (_studentGroupIds: string[]): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const res = await findDistrictIdsByStudentsUserId(
        'testStudentId',
        studentRepository,
        studentGroupRepository,
        studentStudentGroupAffiliationRepository,
        organizationRepository,
      )

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'error message',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })

    test('error on studentStudentGroupAffiliationRepository.findByStudentId', async () => {
      const studentRepository = createUtilitySuccessMockStudentRepository()
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const studentStudentGroupAffiliationRepository = createUtilitySuccessMockStudentStudentGroupAffiliationRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      studentStudentGroupAffiliationRepository.findByStudentId = jest.fn(
        async (_studentId: string): Promise<Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>> => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'error message',
            },
            value: null,
          }
        },
      )

      const res = await findDistrictIdsByStudentsUserId(
        'testStudentId',
        studentRepository,
        studentGroupRepository,
        studentStudentGroupAffiliationRepository,
        organizationRepository,
      )

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'error message',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })
  })

  describe('findDistrictIdByStudentGroupId', () => {
    test('success', async () => {
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()
      const res = await findDistrictIdByStudentGroupId('testStudentGroupId', organizationRepository, studentGroupRepository)

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toEqual('testDistrictId1')
    })

    test('error on studentGroupRepository.findById', async () => {
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      studentGroupRepository.findById = jest.fn(async (_studentGroupId: string): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const res = await findDistrictIdByStudentGroupId('testStudentGroupId', organizationRepository, studentGroupRepository)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'error message',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })

    test('studentGroupRepository.findById returns null', async () => {
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      studentGroupRepository.findById = jest.fn(async (_studentGroupId: string): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const res = await findDistrictIdByStudentGroupId('testStudentGroupId', organizationRepository, studentGroupRepository)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'studentGroup is not found. studentGroupId: testStudentGroupId',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })

    test('error on organizationRepository.findById', async () => {
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      organizationRepository.findById = jest.fn(async (_organizationId: string): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const res = await findDistrictIdByStudentGroupId('testStudentGroupId', organizationRepository, studentGroupRepository)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'error message',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })

    test('organizationRepository.findById returns null', async () => {
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()

      organizationRepository.findById = jest.fn(async (_organizationId: string): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const res = await findDistrictIdByStudentGroupId('testStudentGroupId', organizationRepository, studentGroupRepository)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'organization is not found. organizationId: testOrganizationId1, studentGroupId: testStudentGroupId',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })
  })

  describe('findDistrictIdsByAuthenticatedUser', () => {
    describe(`
        userRole              | expectedDistrictIds
    `, () => {
      test.each`
        userRole              | expectedDistrictIds
        ${'internalOperator'} | ${[]}
        ${'administrator'}    | ${['testDistrictId1']}
        ${'teacher'}          | ${['testDistrictId1', 'testDistrictId2']}
        ${'student'}          | ${['testDistrictId1', 'testDistrictId2']}
      `(
        `
        $userRole              $expectedDistrictIds
    `,
        async ({ userRole, expectedDistrictIds }: { userRole: User['role']; expectedDistrictIds: string[] }) => {
          const authenticatedUser: User = {
            id: 'testUserId',
            role: userRole,
            isDemo: false,
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          }
          const administratorRepository = createUtilitySuccessMockAdministratorRepository()
          const organizationRepository = createUtilitySuccessMockOrganizationRepository()
          const teacherRepository = createUtilitySuccessMockTeacherRepository()
          const teacherOrganizationAffiliationRepository = createUtilitySuccessMockTeacherOrganizationAffiliationRepository()
          const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
          const studentRepository = createUtilitySuccessMockStudentRepository()
          const studentStudentGroupAffiliationRepository = createUtilitySuccessMockStudentStudentGroupAffiliationRepository()
          const res = await findDistrictIdsByAuthenticatedUser(
            authenticatedUser,
            administratorRepository,
            organizationRepository,
            teacherRepository,
            teacherOrganizationAffiliationRepository,
            studentGroupRepository,
            studentRepository,
            studentStudentGroupAffiliationRepository,
          )

          expect(res.hasError).toEqual(false)
          expect(res.error).toBeNull()
          expect(res.value).toEqual(expectedDistrictIds)
        },
      )
    })

    test('error on findDistrictIdByAdministratorsUserId', async () => {
      const authenticatedUser: User = {
        id: 'testUserId',
        role: 'administrator',
        isDemo: false,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }
      const administratorRepository = createUtilitySuccessMockAdministratorRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()
      const teacherRepository = createUtilitySuccessMockTeacherRepository()
      const teacherOrganizationAffiliationRepository = createUtilitySuccessMockTeacherOrganizationAffiliationRepository()
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const studentRepository = createUtilitySuccessMockStudentRepository()
      const studentStudentGroupAffiliationRepository = createUtilitySuccessMockStudentStudentGroupAffiliationRepository()

      administratorRepository.findByUserId = jest.fn(async (_userId: string): Promise<Errorable<Administrator | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const res = await findDistrictIdsByAuthenticatedUser(
        authenticatedUser,
        administratorRepository,
        organizationRepository,
        teacherRepository,
        teacherOrganizationAffiliationRepository,
        studentGroupRepository,
        studentRepository,
        studentStudentGroupAffiliationRepository,
      )

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'error message',
        type: 'UnknownRuntimeError',
      })

      expect(res.value).toBeNull()
    })

    test('authenticatedUser.role is invalid', async () => {
      const authenticatedUser: User = {
        id: 'testUserId',
        role: 'invalidRole' as User['role'],
        isDemo: false,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }
      const administratorRepository = createUtilitySuccessMockAdministratorRepository()
      const organizationRepository = createUtilitySuccessMockOrganizationRepository()
      const teacherRepository = createUtilitySuccessMockTeacherRepository()
      const teacherOrganizationAffiliationRepository = createUtilitySuccessMockTeacherOrganizationAffiliationRepository()
      const studentGroupRepository = createUtilitySuccessMockStudentGroupRepository()
      const studentRepository = createUtilitySuccessMockStudentRepository()
      const studentStudentGroupAffiliationRepository = createUtilitySuccessMockStudentStudentGroupAffiliationRepository()
      const res = await findDistrictIdsByAuthenticatedUser(
        authenticatedUser,
        administratorRepository,
        organizationRepository,
        teacherRepository,
        teacherOrganizationAffiliationRepository,
        studentGroupRepository,
        studentRepository,
        studentStudentGroupAffiliationRepository,
      )

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'value should be never. value: "invalidRole"',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })
  })
})

export const createUtilitySuccessMockAdministratorRepository = () => {
  const repo: Pick<AdministratorRepository, 'findByUserId'> = {
    findByUserId: async (_userId: string): Promise<Errorable<Administrator | null, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: false,
        error: null,
        value: {
          id: 'testAdministratorId1',
          userId: 'testUserId1',
          role: 'administrator',
          districtId: 'testDistrictId1',
          firstName: 'testFirstName1',
          lastName: 'testLastName1',
          externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
          isDeactivated: false,
          createdUserId: 'testCreatedUserId1',
          createdAt: new Date(nowStr),
        },
      }
    },
  }

  return {
    findByUserId: jest.fn((userId: string) => repo.findByUserId(userId)),
  }
}

export const createUtilitySuccessMockTeacherRepository = () => {
  const repo: Pick<TeacherRepository, 'findByUserId'> = {
    findByUserId: async (_userId: string): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: false,
        error: null,
        value: {
          id: 'testTeacherId1',
          userId: 'testUserId1',
          role: 'teacher',
          firstName: 'testFirstName1',
          lastName: 'testLastName1',
          externalLmsTeacherId: 'testExternalLmsTeacherId1',
          isDeactivated: true,
          createdUserId: 'testCreatedUserId1',
          createdAt: new Date(nowStr),
        },
      }
    },
  }

  return {
    findByUserId: jest.fn((userid: string) => repo.findByUserId(userid)),
  }
}

export const createUtilitySuccessMockTeacherOrganizationAffiliationRepository = () => {
  const repo: Pick<TeacherOrganizationAffiliationRepository, 'findByTeacherId'> = {
    findByTeacherId: async (_teacherId: string): Promise<Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>> => {
      return {
        hasError: false,
        error: null,
        value: [
          {
            id: 'testTeacherOrganizationAffiliationId1',
            teacherId: 'testTeacherId1',
            organizationId: 'testOrganizationId1',
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          },
          {
            id: 'testTeacherOrganizationAffiliationId2',
            teacherId: 'testTeacherId2',
            organizationId: 'testOrganizationId2',
            createdUserId: 'testCreatedUserId2',
            createdAt: new Date(nowStr),
          },
        ],
      }
    },
  }

  return {
    findByTeacherId: jest.fn((teacherId: string) => repo.findByTeacherId(teacherId)),
  }
}

export const createUtilitySuccessMockOrganizationRepository = () => {
  const repo: Pick<OrganizationRepository, 'findById' | 'findByIds'> = {
    findById: async (_organizationIds: string): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: false,
        error: null,
        value: {
          id: 'testOrganizationId1',
          name: 'testOrganization1',
          districtId: 'testDistrictId1',
          externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
          classlinkTenantId: 'testClasslinkTenantId1',
          createdAt: new Date(nowStr),
          updatedAt: new Date(nowStr),
        },
      }
    },
    findByIds: async (_organizationIds: string[]): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>> => {
      return {
        hasError: false,
        error: null,
        value: [
          {
            id: 'testOrganizationId1',
            name: 'testOrganization1',
            districtId: 'testDistrictId1',
            externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
            classlinkTenantId: 'testClasslinkTenantId1',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
          {
            id: 'testOrganizationId2',
            name: 'testOrganization2',
            districtId: 'testDistrictId2',
            externalLmsOrganizationId: 'testExternalLmsOrganizationId2',
            classlinkTenantId: 'testClasslinkTenantId2',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        ],
      }
    },
  }

  return {
    findById: jest.fn((organizationId: string) => repo.findById(organizationId)),
    findByIds: jest.fn((organizationIds: string[]) => repo.findByIds(organizationIds)),
  }
}

export const createUtilitySuccessMockStudentRepository = () => {
  const repo: Pick<StudentRepository, 'findByUserId' | 'findById'> = {
    findByUserId: async (_userId: string): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: false,
        error: null,
        value: {
          id: 'testStudentId1',
          userId: 'testUserId1',
          role: 'student',
          nickName: 'testNickname1',
          externalLmsStudentId: 'externalLmsStudentId1',
          classlinkTenantId: 'classlinkTenantId1',
          isDeactivated: false,
          createdUserId: 'testCreatedUserId1',
          createdAt: new Date(nowStr),
        },
      }
    },
    findById: async (_studentId: string): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: false,
        error: null,
        value: {
          id: 'testStudentId1',
          userId: 'testUserId1',
          role: 'student',
          nickName: 'testNickname1',
          externalLmsStudentId: 'externalLmsStudentId1',
          classlinkTenantId: 'classlinkTenantId1',
          isDeactivated: false,
          createdUserId: 'testCreatedUserId1',
          createdAt: new Date(nowStr),
        },
      }
    },
  }

  return {
    findByUserId: jest.fn((userId: string) => repo.findByUserId(userId)),
    findById: jest.fn((studentId: string) => repo.findById(studentId)),
  }
}

export const createUtilitySuccessMockStudentGroupRepository = () => {
  const repo: Pick<StudentGroupRepository, 'findById' | 'findByIds'> = {
    findById: async (_studentGroupId: string): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: false,
        error: null,
        value: {
          id: 'testStudentGroupId1',
          name: 'testName1',
          grade: 'testGrade1',
          externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
          createdUserId: 'testCreatedUserId1',
          updatedUserId: 'testUpdatedUserId1',
          createdAt: new Date(nowStr),
          updatedAt: new Date(nowStr),
          organizationId: 'testOrganizationId1',
          classlinkTenantId: 'testClasslinkTenantId1',
        },
      }
    },
    findByIds: async (_studentGroupIds: string[]): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> => {
      return {
        hasError: false,
        error: null,
        value: [
          {
            id: 'testStudentGroupId1',
            name: 'testName1',
            grade: 'testGrade1',
            externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
            createdUserId: 'testCreatedUserId1',
            updatedUserId: 'testUpdatedUserId1',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
            organizationId: 'testOrganizationId1',
            classlinkTenantId: 'testClasslinkTenantId1',
          },
          {
            id: 'testStudentGroupId2',
            name: 'testName2',
            grade: 'testGrade2',
            externalLmsStudentGroupId: 'testExternalLmsStudentGroupId2',
            createdUserId: 'testCreatedUserId2',
            updatedUserId: 'testUpdatedUserId2',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
            organizationId: 'testOrganizationId2',
            classlinkTenantId: 'testClasslinkTenantId2',
          },
        ],
      }
    },
  }

  return {
    findById: jest.fn((studentGroupId: string) => repo.findById(studentGroupId)),
    findByIds: jest.fn((studentGroupIds: string[]) => repo.findByIds(studentGroupIds)),
  }
}

export const createUtilitySuccessMockStudentStudentGroupAffiliationRepository = () => {
  const repo: Pick<StudentStudentGroupAffiliationRepository, 'findByStudentId'> = {
    findByStudentId: async (_studentId: string): Promise<Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>> => {
      return {
        hasError: false,
        error: null,
        value: [
          {
            id: 'testStudentStudentGroupAffiliationId1',
            studentId: 'testStudentId1',
            studentGroupId: 'testStudentGroupId1',
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          },
          {
            id: 'testStudentStudentGroupAffiliationId2',
            studentId: 'testStudentId2',
            studentGroupId: 'testStudentGroupId2',
            createdUserId: 'testCreatedUserId2',
            createdAt: new Date(nowStr),
          },
        ],
      }
    },
  }

  return {
    findByStudentId: jest.fn((studentId: string) => repo.findByStudentId(studentId)),
  }
}
