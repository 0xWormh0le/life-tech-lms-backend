import dayjs from 'dayjs'

import { E, Errorable } from '../../shared/Errors'
import {
  ConstructFreeTrialAccountsForSalesUsecase,
  DistrictRepository,
  OrganizationRepository,
  StudentGroupRepository,
  DistrictPurchasedPackageRepository,
  StudentGroupPackageAssignmentRepository,
  UserRepository,
  HumanUserRepository,
  TeacherRepository,
  StudentRepository,
  TeacherOrganizationAffiliationRepository,
  StudentStudentGroupAffiliationRepository,
  UserLessonStatusRepository,
} from './ConstructFreeTrialAccountsForSalesUsecase'
import { District } from '../../../entities/codex-v2/District'
import { Organization } from '../../../entities/codex-v2/Organization'
import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { Teacher } from '../../../entities/codex-v2/Teacher'
import { Student } from '../../../entities/codex-v2/Student'
import { User } from '../../../entities/codex-v2/User'
import { HumanUser } from '../../../entities/codex-v2/HumanUser'
import { TeacherOrganizationAffiliation } from '../../../entities/codex-v2/TeacherOrganizationAffiliation'
import { StudentStudentGroupAffiliation } from '../../../entities/codex-v2/StudentStudentGroupAffiliation'
import { UserLessonStatus } from '../../../entities/codex-v2/UserLessonStatus'
import { DistrictPurchasedPackage } from '../../../entities/codex-v2/DistrictPurchasedPackage'
import { StudentGroupPackageAssignment } from '../../../entities/codex-v2/StudentGroupPackageAssignment'

class NumberingIdIssuer {
  constructor(private entityName: string) {}

  private callCount = 1

  issueId: () => Promise<Errorable<string, E<'UnknownRuntimeError', string>>> = async () => {
    const id = `${this.entityName}-id-${this.callCount}`

    this.callCount += 1

    return {
      hasError: false,
      error: null,
      value: id,
    }
  }
}

describe('test ConstructFreeTrialAccountsForSalesUsecase', () => {
  const now = new Date()
  const successDistrictRepository: DistrictRepository = {
    findByName: async function (name: string): Promise<Errorable<District | null, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: null,
      }
    },
    issueId: new NumberingIdIssuer('district').issueId,
    create: jest.fn(async function (district: District): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const successOrganizationRepository: OrganizationRepository = {
    issueId: new NumberingIdIssuer('organization').issueId,
    create: jest.fn(async function (organization: Organization): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const successStudentGroupRepository: StudentGroupRepository = {
    issueId: new NumberingIdIssuer('studentGroup').issueId,
    create: jest.fn(async function (studentGroup: StudentGroup): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const successDistrictPurchasedPackageRepository: DistrictPurchasedPackageRepository = {
    issueId: new NumberingIdIssuer('districtPurchasedPackage').issueId,
    create: jest.fn(async function (districtPurchasedPackage: DistrictPurchasedPackage): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const successStudentGroupPackageAssignmentRepository: StudentGroupPackageAssignmentRepository = {
    issueId: new NumberingIdIssuer('studentGroupPackageAssignment').issueId,
    create: jest.fn(async function (studentGroupPackageAssignment: StudentGroupPackageAssignment): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const successUserRepository: UserRepository = {
    issueId: new NumberingIdIssuer('user').issueId,
    create: jest.fn(async function (user: User): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const successHumanUserRepository: HumanUserRepository = {
    hashPassword: async function (plainPassword: string): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: `hashed-${plainPassword}`,
      }
    },
    create: jest.fn(async function (humanUser: HumanUser): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const successTeacherRepository: TeacherRepository = {
    issueId: new NumberingIdIssuer('teacher').issueId,
    create: jest.fn(async function (teacher: Teacher): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const successStudentRepository: StudentRepository = {
    issueId: new NumberingIdIssuer('student').issueId,
    create: jest.fn(async function (student: Student): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const successTeacherOrganizationAffiliationRepository: TeacherOrganizationAffiliationRepository = {
    issueId: new NumberingIdIssuer('teacherOrganizationAffiliation').issueId,
    create: jest.fn(async function (
      teacherOrganizationAffiliation: TeacherOrganizationAffiliation,
    ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const successStudentStudentGroupAffiliationRepository: StudentStudentGroupAffiliationRepository = {
    issueId: new NumberingIdIssuer('studentStudentGroupAffiliation').issueId,
    create: jest.fn(async function (
      studentStudentGroupAffiliation: StudentStudentGroupAffiliation,
    ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const successUserLessonStatusRepository: UserLessonStatusRepository = {
    issueId: new NumberingIdIssuer('userLessonStatus').issueId,
    create: jest.fn(async function (userLessonStatus: UserLessonStatus): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }

  test('success', async () => {
    const usecase = new ConstructFreeTrialAccountsForSalesUsecase(
      successDistrictRepository,
      successOrganizationRepository,
      successStudentGroupRepository,
      successDistrictPurchasedPackageRepository,
      successStudentGroupPackageAssignmentRepository,
      successUserRepository,
      successHumanUserRepository,
      successTeacherRepository,
      successStudentRepository,
      successTeacherOrganizationAffiliationRepository,
      successStudentStudentGroupAffiliationRepository,
      successUserLessonStatusRepository,
      {
        now: async () => ({ hasError: false, error: null, value: now }),
      },
    )
    const result = await usecase.run({
      district: {
        name: 'district-name',
        stateId: 'district-stateId',
      },
      organization: {
        name: 'organization-name',
      },
      teachers: [
        {
          firstName: 'teacher-firstName-1',
          lastName: 'teacher-lastName-1',
          loginId: 'teacher-loginId-1',
          password: 'teacher-password-1',
        },
        {
          firstName: 'teacher-firstName-2',
          lastName: 'teacher-lastName-2',
          loginId: 'teacher-loginId-2',
          password: 'teacher-password-2',
        },
        {
          firstName: 'teacher-firstName-3',
          lastName: 'teacher-lastName-3',
          loginId: 'teacher-loginId-3',
          password: 'teacher-password-3',
        },
      ],
      studentGroups: [
        {
          name: 'studentGroup-name-1',
          grade: 'studentGroup-grade-1',
          assignedPackages: [
            { curriculumBrandId: 'studentGroup-curriculumBrandId-1-1', curriculumPackageId: 'studentGroup-assignedPackageId-1-1' },
            { curriculumBrandId: 'studentGroup-curriculumBrandId-1-2', curriculumPackageId: 'studentGroup-assignedPackageId-1-2' },
          ],
          students: [
            {
              nickName: 'student-nickName-1-1',
              loginId: 'student-loginId-1-1',
              password: 'student-password-1-1',
              userLessonStatuses: [
                {
                  lessonId: 'userLessonStatus-lessonId-1-1-1',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 1,
                  correctAnsweredQuizCount: 2,
                  usedHintCount: 3,
                  stepIdSkippingDetected: true,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-1-1-2',
                  status: 'not_cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 4,
                  correctAnsweredQuizCount: 5,
                  usedHintCount: 6,
                  stepIdSkippingDetected: false,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-1-1-3',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: dayjs(now).add(10, 'minutes').toDate(),
                  achievedStarCount: 7,
                  correctAnsweredQuizCount: 8,
                  usedHintCount: 9,
                  stepIdSkippingDetected: true,
                },
              ],
            },
            {
              nickName: 'student-nickName-1-2',
              loginId: 'student-loginId-1-2',
              password: 'student-password-1-2',
              userLessonStatuses: [
                {
                  lessonId: 'userLessonStatus-lessonId-1-2-1',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 1,
                  correctAnsweredQuizCount: 2,
                  usedHintCount: 3,
                  stepIdSkippingDetected: true,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-1-2-2',
                  status: 'not_cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 4,
                  correctAnsweredQuizCount: 5,
                  usedHintCount: 6,
                  stepIdSkippingDetected: false,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-1-2-3',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: dayjs(now).add(20, 'minutes').toDate(),
                  achievedStarCount: 7,
                  correctAnsweredQuizCount: 8,
                  usedHintCount: 9,
                  stepIdSkippingDetected: true,
                },
              ],
            },
          ],
        },
        {
          name: 'studentGroup-name-2',
          grade: 'studentGroup-grade-2',
          assignedPackages: [
            { curriculumBrandId: 'studentGroup-curriculumBrandId-2-1', curriculumPackageId: 'studentGroup-assignedPackageId-2-1' },
            { curriculumBrandId: 'studentGroup-curriculumBrandId-2-2', curriculumPackageId: 'studentGroup-assignedPackageId-2-2' },
            { curriculumBrandId: 'studentGroup-curriculumBrandId-1-1', curriculumPackageId: 'studentGroup-assignedPackageId-1-1' },
          ],
          students: [
            {
              nickName: 'student-nickName-2-1',
              loginId: 'student-loginId-2-1',
              password: 'student-password-2-1',
              userLessonStatuses: [
                {
                  lessonId: 'userLessonStatus-lessonId-2-1-1',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 1,
                  correctAnsweredQuizCount: 2,
                  usedHintCount: 3,
                  stepIdSkippingDetected: true,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-2-1-2',
                  status: 'not_cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 4,
                  correctAnsweredQuizCount: 5,
                  usedHintCount: 6,
                  stepIdSkippingDetected: false,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-2-1-3',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: dayjs(now).add(10, 'minutes').toDate(),
                  achievedStarCount: 7,
                  correctAnsweredQuizCount: 8,
                  usedHintCount: 9,
                  stepIdSkippingDetected: true,
                },
              ],
            },
            {
              nickName: 'student-nickName-2-2',
              loginId: 'student-loginId-2-2',
              password: 'student-password-2-2',
              userLessonStatuses: [
                {
                  lessonId: 'userLessonStatus-lessonId-2-2-1',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 1,
                  correctAnsweredQuizCount: 2,
                  usedHintCount: 3,
                  stepIdSkippingDetected: true,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-2-2-2',
                  status: 'not_cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 4,
                  correctAnsweredQuizCount: 5,
                  usedHintCount: 6,
                  stepIdSkippingDetected: false,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-2-2-3',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: dayjs(now).add(20, 'minutes').toDate(),
                  achievedStarCount: 7,
                  correctAnsweredQuizCount: 8,
                  usedHintCount: 9,
                  stepIdSkippingDetected: true,
                },
              ],
            },
          ],
        },
      ],
    })

    expect(result.hasError).toEqual(false)

    const districtRepositoryCreateSpy = successDistrictRepository.create as jest.Mock

    expect(districtRepositoryCreateSpy.mock.calls).toEqual<Parameters<typeof successDistrictRepository.create>[]>([
      [
        {
          id: 'district-id-1',
          name: 'district-name',
          stateId: 'district-stateId',
          enableRosterSync: false,
          externalLmsDistrictId: null,
          lmsId: null,
          createdAt: now,
          createdUserId: null,
        },
      ],
    ])

    const organizationRepositoryCreateSpy = successOrganizationRepository.create as jest.Mock

    expect(organizationRepositoryCreateSpy.mock.calls).toEqual<Parameters<typeof successOrganizationRepository.create>[]>([
      [
        {
          id: 'organization-id-1',
          name: 'organization-name',
          districtId: 'district-id-1',
          externalLmsOrganizationId: null,
          classlinkTenantId: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
    ])

    const studentGroupRepositoryCreateSpy = successStudentGroupRepository.create as jest.Mock

    expect(studentGroupRepositoryCreateSpy.mock.calls).toEqual<Parameters<typeof successStudentGroupRepository.create>[]>([
      [
        {
          id: 'studentGroup-id-1',
          name: 'studentGroup-name-1',
          grade: 'studentGroup-grade-1',
          organizationId: 'organization-id-1',
          externalLmsStudentGroupId: null,
          classlinkTenantId: null,
          createdUserId: null,
          updatedUserId: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          id: 'studentGroup-id-2',
          name: 'studentGroup-name-2',
          grade: 'studentGroup-grade-2',
          organizationId: 'organization-id-1',
          externalLmsStudentGroupId: null,
          classlinkTenantId: null,
          createdUserId: null,
          updatedUserId: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
    ])

    const createDistrictPurchasedPackageRepositorySpy = successDistrictPurchasedPackageRepository.create as jest.Mock

    expect(createDistrictPurchasedPackageRepositorySpy.mock.calls.length).toEqual(4)
    expect(createDistrictPurchasedPackageRepositorySpy.mock.calls).toEqual<Parameters<typeof successDistrictPurchasedPackageRepository.create>[]>([
      [
        {
          id: 'districtPurchasedPackage-id-1',
          districtId: 'district-id-1',
          curriculumPackageId: 'studentGroup-assignedPackageId-1-1',
          createdAt: now,
          createdUserId: null,
        },
      ],
      [
        {
          id: 'districtPurchasedPackage-id-2',
          districtId: 'district-id-1',
          curriculumPackageId: 'studentGroup-assignedPackageId-1-2',
          createdAt: now,
          createdUserId: null,
        },
      ],
      [
        {
          id: 'districtPurchasedPackage-id-3',
          districtId: 'district-id-1',
          curriculumPackageId: 'studentGroup-assignedPackageId-2-1',
          createdAt: now,
          createdUserId: null,
        },
      ],
      [
        {
          id: 'districtPurchasedPackage-id-4',
          districtId: 'district-id-1',
          curriculumPackageId: 'studentGroup-assignedPackageId-2-2',
          createdAt: now,
          createdUserId: null,
        },
      ],
    ])

    const createStudentGroupPackageAssignmentRepositorySpy = successStudentGroupPackageAssignmentRepository.create as jest.Mock

    expect(createStudentGroupPackageAssignmentRepositorySpy.mock.calls.length).toEqual(5)
    expect(createStudentGroupPackageAssignmentRepositorySpy.mock.calls).toEqual<Parameters<typeof successStudentGroupPackageAssignmentRepository.create>[]>([
      [
        {
          id: 'studentGroupPackageAssignment-id-1',
          studentGroupId: 'studentGroup-id-1',
          curriculumBrandId: 'studentGroup-curriculumBrandId-1-1',
          curriculumPackageId: 'studentGroup-assignedPackageId-1-1',
          createdAt: now,
        },
      ],
      [
        {
          id: 'studentGroupPackageAssignment-id-2',
          studentGroupId: 'studentGroup-id-1',
          curriculumBrandId: 'studentGroup-curriculumBrandId-1-2',
          curriculumPackageId: 'studentGroup-assignedPackageId-1-2',
          createdAt: now,
        },
      ],
      [
        {
          id: 'studentGroupPackageAssignment-id-3',
          studentGroupId: 'studentGroup-id-2',
          curriculumBrandId: 'studentGroup-curriculumBrandId-2-1',
          curriculumPackageId: 'studentGroup-assignedPackageId-2-1',
          createdAt: now,
        },
      ],
      [
        {
          id: 'studentGroupPackageAssignment-id-4',
          studentGroupId: 'studentGroup-id-2',
          curriculumBrandId: 'studentGroup-curriculumBrandId-2-2',
          curriculumPackageId: 'studentGroup-assignedPackageId-2-2',
          createdAt: now,
        },
      ],
      [
        {
          id: 'studentGroupPackageAssignment-id-5',
          studentGroupId: 'studentGroup-id-2',
          curriculumBrandId: 'studentGroup-curriculumBrandId-1-1',
          curriculumPackageId: 'studentGroup-assignedPackageId-1-1',
          createdAt: now,
        },
      ],
    ])

    const userRepositoryCreateSpy = successUserRepository.create as jest.Mock

    expect(userRepositoryCreateSpy.mock.calls.length).toEqual(7)
    expect(userRepositoryCreateSpy.mock.calls).toEqual<Parameters<typeof successUserRepository.create>[]>([
      [
        {
          id: 'user-id-1',
          role: 'teacher',
          isDemo: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          id: 'user-id-2',
          role: 'teacher',
          isDemo: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          id: 'user-id-3',
          role: 'teacher',
          isDemo: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          id: 'user-id-4',
          role: 'student',
          isDemo: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          id: 'user-id-5',
          role: 'student',
          isDemo: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          id: 'user-id-6',
          role: 'student',
          isDemo: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          id: 'user-id-7',
          role: 'student',
          isDemo: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
    ])

    const humanUserRepositoryCreateSpy = successHumanUserRepository.create as jest.Mock

    expect(humanUserRepositoryCreateSpy.mock.calls.length).toEqual(7)
    expect(humanUserRepositoryCreateSpy.mock.calls).toEqual<Parameters<typeof successHumanUserRepository.create>[]>([
      [
        {
          userId: 'user-id-1',
          loginId: 'teacher-loginId-1',
          hashedPassword: 'hashed-teacher-password-1',
          email: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          userId: 'user-id-2',
          loginId: 'teacher-loginId-2',
          hashedPassword: 'hashed-teacher-password-2',
          email: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          userId: 'user-id-3',
          loginId: 'teacher-loginId-3',
          hashedPassword: 'hashed-teacher-password-3',
          email: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          userId: 'user-id-4',
          loginId: 'student-loginId-1-1',
          hashedPassword: 'hashed-student-password-1-1',
          email: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          userId: 'user-id-5',
          loginId: 'student-loginId-1-2',
          hashedPassword: 'hashed-student-password-1-2',
          email: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          userId: 'user-id-6',
          loginId: 'student-loginId-2-1',
          hashedPassword: 'hashed-student-password-2-1',
          email: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
      [
        {
          userId: 'user-id-7',
          loginId: 'student-loginId-2-2',
          hashedPassword: 'hashed-student-password-2-2',
          email: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
    ])

    const teacherRepositoryCreateSpy = successTeacherRepository.create as jest.Mock

    expect(teacherRepositoryCreateSpy.mock.calls.length).toEqual(3)
    expect(teacherRepositoryCreateSpy.mock.calls).toEqual<Parameters<typeof successTeacherRepository.create>[]>([
      [
        {
          id: 'teacher-id-1',
          userId: 'user-id-1',
          role: 'teacher',
          firstName: 'teacher-firstName-1',
          lastName: 'teacher-lastName-1',
          externalLmsTeacherId: null,
          isDeactivated: false,
          createdAt: now,
          createdUserId: null,
        },
      ],
      [
        {
          id: 'teacher-id-2',
          userId: 'user-id-2',
          role: 'teacher',
          firstName: 'teacher-firstName-2',
          lastName: 'teacher-lastName-2',
          externalLmsTeacherId: null,
          isDeactivated: false,
          createdAt: now,
          createdUserId: null,
        },
      ],
      [
        {
          id: 'teacher-id-3',
          userId: 'user-id-3',
          role: 'teacher',
          firstName: 'teacher-firstName-3',
          lastName: 'teacher-lastName-3',
          externalLmsTeacherId: null,
          isDeactivated: false,
          createdAt: now,
          createdUserId: null,
        },
      ],
    ])

    const studentRepositoryCreateSpy = successStudentRepository.create as jest.Mock

    expect(studentRepositoryCreateSpy.mock.calls.length).toEqual(4)
    expect(studentRepositoryCreateSpy.mock.calls).toEqual<Parameters<typeof successStudentRepository.create>[]>([
      [
        {
          id: 'student-id-1',
          userId: 'user-id-4',
          role: 'student',
          nickName: 'student-nickName-1-1',
          externalLmsStudentId: null,
          classlinkTenantId: null,
          isDeactivated: false,
          createdAt: now,
          createdUserId: '',
        },
      ],
      [
        {
          id: 'student-id-2',
          userId: 'user-id-5',
          role: 'student',
          nickName: 'student-nickName-1-2',
          externalLmsStudentId: null,
          classlinkTenantId: null,
          isDeactivated: false,
          createdAt: now,
          createdUserId: '',
        },
      ],
      [
        {
          id: 'student-id-3',
          userId: 'user-id-6',
          role: 'student',
          nickName: 'student-nickName-2-1',
          externalLmsStudentId: null,
          classlinkTenantId: null,
          isDeactivated: false,
          createdAt: now,
          createdUserId: '',
        },
      ],
      [
        {
          id: 'student-id-4',
          userId: 'user-id-7',
          role: 'student',
          nickName: 'student-nickName-2-2',
          externalLmsStudentId: null,
          classlinkTenantId: null,
          isDeactivated: false,
          createdAt: now,
          createdUserId: '',
        },
      ],
    ])

    const teacherOrganizationAffiliationRepositoryCreateSpy = successTeacherOrganizationAffiliationRepository.create as jest.Mock

    expect(teacherOrganizationAffiliationRepositoryCreateSpy.mock.calls.length).toEqual(3)
    expect(teacherOrganizationAffiliationRepositoryCreateSpy.mock.calls).toEqual<Parameters<typeof successTeacherOrganizationAffiliationRepository.create>[]>([
      [
        {
          id: 'teacherOrganizationAffiliation-id-1',
          organizationId: 'organization-id-1',
          teacherId: 'teacher-id-1',
          createdAt: now,
          createdUserId: '',
        },
      ],
      [
        {
          id: 'teacherOrganizationAffiliation-id-2',
          organizationId: 'organization-id-1',
          teacherId: 'teacher-id-2',
          createdAt: now,
          createdUserId: '',
        },
      ],
      [
        {
          id: 'teacherOrganizationAffiliation-id-3',
          organizationId: 'organization-id-1',
          teacherId: 'teacher-id-3',
          createdAt: now,
          createdUserId: '',
        },
      ],
    ])

    const studentStudentGroupAffiliationRepositoryCreateSpy = successStudentStudentGroupAffiliationRepository.create as jest.Mock

    expect(studentStudentGroupAffiliationRepositoryCreateSpy.mock.calls.length).toEqual(4)
    expect(studentStudentGroupAffiliationRepositoryCreateSpy.mock.calls).toEqual<Parameters<typeof successStudentStudentGroupAffiliationRepository.create>[]>([
      [
        {
          id: 'studentStudentGroupAffiliation-id-1',
          studentGroupId: 'studentGroup-id-1',
          studentId: 'student-id-1',
          createdAt: now,
          createdUserId: '',
        },
      ],
      [
        {
          id: 'studentStudentGroupAffiliation-id-2',
          studentGroupId: 'studentGroup-id-1',
          studentId: 'student-id-2',
          createdAt: now,
          createdUserId: '',
        },
      ],
      [
        {
          id: 'studentStudentGroupAffiliation-id-3',
          studentGroupId: 'studentGroup-id-2',
          studentId: 'student-id-3',
          createdAt: now,
          createdUserId: '',
        },
      ],
      [
        {
          id: 'studentStudentGroupAffiliation-id-4',
          studentGroupId: 'studentGroup-id-2',
          studentId: 'student-id-4',
          createdAt: now,
          createdUserId: '',
        },
      ],
    ])

    const userLessonStatusRepositoryCreateSpy = successUserLessonStatusRepository.create as jest.Mock

    expect(userLessonStatusRepositoryCreateSpy.mock.calls.length).toEqual(12)
  })

  test('when specified district name already exists', async () => {
    const usecase = new ConstructFreeTrialAccountsForSalesUsecase(
      {
        findByName: async function (name: string): Promise<Errorable<District | null, E<'UnknownRuntimeError', string>>> {
          return {
            hasError: false,
            error: null,
            value: {
              id: 'district-id',
              name,
              stateId: 'district-stateId',
              lmsId: 'district-lmsId',
              externalLmsDistrictId: 'district-externalLmsDistrictId',
              enableRosterSync: false,
              createdAt: now,
              createdUserId: null,
            },
          }
        },
        issueId: new NumberingIdIssuer('district').issueId,
        create: jest.fn(async function (district: District): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
          return {
            hasError: false,
            error: null,
            value: undefined,
          }
        }),
      },
      successOrganizationRepository,
      successStudentGroupRepository,
      successDistrictPurchasedPackageRepository,
      successStudentGroupPackageAssignmentRepository,
      successUserRepository,
      successHumanUserRepository,
      successTeacherRepository,
      successStudentRepository,
      successTeacherOrganizationAffiliationRepository,
      successStudentStudentGroupAffiliationRepository,
      successUserLessonStatusRepository,
      {
        now: async () => ({ hasError: false, error: null, value: now }),
      },
    )
    const result = await usecase.run({
      district: {
        name: 'district-name',
        stateId: 'district-stateId',
      },
      organization: {
        name: 'organization-name',
      },
      teachers: [
        {
          firstName: 'teacher-firstName-1',
          lastName: 'teacher-lastName-1',
          loginId: 'teacher-loginId-1',
          password: 'teacher-password-1',
        },
        {
          firstName: 'teacher-firstName-2',
          lastName: 'teacher-lastName-2',
          loginId: 'teacher-loginId-2',
          password: 'teacher-password-2',
        },
        {
          firstName: 'teacher-firstName-3',
          lastName: 'teacher-lastName-3',
          loginId: 'teacher-loginId-3',
          password: 'teacher-password-3',
        },
      ],
      studentGroups: [
        {
          name: 'studentGroup-name-1',
          grade: 'studentGroup-grade-1',
          assignedPackages: [
            { curriculumBrandId: 'studentGroup-curriculumBrandId-1-1', curriculumPackageId: 'studentGroup-assignedPackageId-1-1' },
            { curriculumBrandId: 'studentGroup-curriculumBrandId-1-2', curriculumPackageId: 'studentGroup-assignedPackageId-1-2' },
          ],
          students: [
            {
              nickName: 'student-nickName-1-1',
              loginId: 'student-loginId-1-1',
              password: 'student-password-1-1',
              userLessonStatuses: [
                {
                  lessonId: 'userLessonStatus-lessonId-1-1-1',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 1,
                  correctAnsweredQuizCount: 2,
                  usedHintCount: 3,
                  stepIdSkippingDetected: true,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-1-1-2',
                  status: 'not_cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 4,
                  correctAnsweredQuizCount: 5,
                  usedHintCount: 6,
                  stepIdSkippingDetected: false,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-1-1-3',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: dayjs(now).add(10, 'minutes').toDate(),
                  achievedStarCount: 7,
                  correctAnsweredQuizCount: 8,
                  usedHintCount: 9,
                  stepIdSkippingDetected: true,
                },
              ],
            },
            {
              nickName: 'student-nickName-1-2',
              loginId: 'student-loginId-1-2',
              password: 'student-password-1-2',
              userLessonStatuses: [
                {
                  lessonId: 'userLessonStatus-lessonId-1-2-1',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 1,
                  correctAnsweredQuizCount: 2,
                  usedHintCount: 3,
                  stepIdSkippingDetected: true,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-1-2-2',
                  status: 'not_cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 4,
                  correctAnsweredQuizCount: 5,
                  usedHintCount: 6,
                  stepIdSkippingDetected: false,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-1-2-3',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: dayjs(now).add(20, 'minutes').toDate(),
                  achievedStarCount: 7,
                  correctAnsweredQuizCount: 8,
                  usedHintCount: 9,
                  stepIdSkippingDetected: true,
                },
              ],
            },
          ],
        },
        {
          name: 'studentGroup-name-2',
          grade: 'studentGroup-grade-2',
          assignedPackages: [
            { curriculumBrandId: 'studentGroup-curriculumBrandId-2-1', curriculumPackageId: 'studentGroup-assignedPackageId-2-1' },
            { curriculumBrandId: 'studentGroup-curriculumBrandId-2-2', curriculumPackageId: 'studentGroup-assignedPackageId-2-2' },
            { curriculumBrandId: 'studentGroup-curriculumBrandId-2-3', curriculumPackageId: 'studentGroup-assignedPackageId-2-3' },
          ],
          students: [
            {
              nickName: 'student-nickName-2-1',
              loginId: 'student-loginId-2-1',
              password: 'student-password-2-1',
              userLessonStatuses: [
                {
                  lessonId: 'userLessonStatus-lessonId-2-1-1',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 1,
                  correctAnsweredQuizCount: 2,
                  usedHintCount: 3,
                  stepIdSkippingDetected: true,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-2-1-2',
                  status: 'not_cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 4,
                  correctAnsweredQuizCount: 5,
                  usedHintCount: 6,
                  stepIdSkippingDetected: false,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-2-1-3',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: dayjs(now).add(10, 'minutes').toDate(),
                  achievedStarCount: 7,
                  correctAnsweredQuizCount: 8,
                  usedHintCount: 9,
                  stepIdSkippingDetected: true,
                },
              ],
            },
            {
              nickName: 'student-nickName-2-2',
              loginId: 'student-loginId-2-2',
              password: 'student-password-2-2',
              userLessonStatuses: [
                {
                  lessonId: 'userLessonStatus-lessonId-2-2-1',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 1,
                  correctAnsweredQuizCount: 2,
                  usedHintCount: 3,
                  stepIdSkippingDetected: true,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-2-2-2',
                  status: 'not_cleared',
                  startedAt: now,
                  finishedAt: null,
                  achievedStarCount: 4,
                  correctAnsweredQuizCount: 5,
                  usedHintCount: 6,
                  stepIdSkippingDetected: false,
                },
                {
                  lessonId: 'userLessonStatus-lessonId-2-2-3',
                  status: 'cleared',
                  startedAt: now,
                  finishedAt: dayjs(now).add(20, 'minutes').toDate(),
                  achievedStarCount: 7,
                  correctAnsweredQuizCount: 8,
                  usedHintCount: 9,
                  stepIdSkippingDetected: true,
                },
              ],
            },
          ],
        },
      ],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AlreadyExistsError')
  })
})
