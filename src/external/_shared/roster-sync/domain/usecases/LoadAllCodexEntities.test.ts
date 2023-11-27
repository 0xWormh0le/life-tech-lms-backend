import { E, Errorable, successErrorable } from '../../../../../domain/usecases/shared/Errors'
import { LoadAllCodexEntities } from './LoadAllCodexEntities'
import { Administrator } from '../entities/Administrator'
import { Teacher } from '../entities/Teacher'
import { Student } from '../entities/Student'
import { Organization } from '../entities/Organization'
import { StudentGroup } from '../entities/StudentGroup'
import { AdministratorDistrict } from '../entities/AdministratorDistrict'
import { TeacherOrganization } from '../entities/TeacherOrganization'
import { StudentGroupStudent } from '../entities/StudentGroupStudent'
import { User } from '../entities/User'

describe('LoadAllCodexEntities', () => {
  test('success', async () => {
    const organizationRepository: ConstructorParameters<typeof LoadAllCodexEntities>[0] = {
      getAllByDistrictId: async function (districtId: string): Promise<Errorable<Organization[], E<'UnknownRuntimeError', string>>> {
        return successErrorable([
          {
            id: 'organization-id-1',
            name: 'organization-name-1',
            districtId,
            organizationLMSId: 'organization-organizationLMSId-1',
            classlinkTenantId: 'organization-classlinkTenantId-1',
          },
          {
            id: 'organization-id-2',
            name: 'organization-name-2',
            districtId,
            organizationLMSId: 'organization-organizationLMSId-2',
            classlinkTenantId: 'organization-classlinkTenantId-2',
          },
          {
            id: 'organization-id-3',
            name: 'organization-name-3',
            districtId,
            organizationLMSId: null,
            classlinkTenantId: null,
          },
        ])
      },
    }
    const studentGroupRepository: ConstructorParameters<typeof LoadAllCodexEntities>[1] = {
      getAllByOrganizationId: async function (organizationId: string): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError', string>>> {
        return successErrorable([
          {
            id: `studentGroup-id-1-${organizationId}`,
            organizationId,
            name: `studentGroup-name-1-${organizationId}`,
            grade: `studentGroup-grade-1-${organizationId}`,
            studentGroupLmsId: `studentGroup-studentGroupLmsId-1-${organizationId}`,
            classlinkTenantId: `studentGroup-classlinkTenantId-1-${organizationId}`,
          },
          {
            id: `studentGroup-id-2-${organizationId}`,
            organizationId,
            name: `studentGroup-name-2-${organizationId}`,
            grade: `studentGroup-grade-2-${organizationId}`,
            studentGroupLmsId: `studentGroup-studentGroupLmsId-2-${organizationId}`,
            classlinkTenantId: `studentGroup-classlinkTenantId-2-${organizationId}`,
          },
          {
            id: `studentGroup-id-3-${organizationId}`,
            organizationId,
            name: `studentGroup-name-3-${organizationId}`,
            grade: `studentGroup-grade-3-${organizationId}`,
            studentGroupLmsId: null,
            classlinkTenantId: null,
          },
        ])
      },
    }
    const userRepository: ConstructorParameters<typeof LoadAllCodexEntities>[2] = {
      getByIds: async function (ids: string[]): Promise<Errorable<User[], E<'UnknownRuntimeError', string>>> {
        return successErrorable(
          ids.map((id) => ({
            id,
            role: 'student',
            isDeactivated: false,
          })),
        )
      },
    }
    const administratorRepository: ConstructorParameters<typeof LoadAllCodexEntities>[3] = {
      getAllByLmsId: async function (lmsIds: string[]): Promise<Errorable<Administrator[], E<'UnknownRuntimeError', string>>> {
        return successErrorable(
          lmsIds.map((lmsId) => ({
            id: `administrator-id-${lmsId}`,
            userId: `administrator-userId-${lmsId}`,
            firstName: `administrator-firstName-${lmsId}`,
            lastName: `administrator-lastName-${lmsId}`,
            administratorLMSId: `administrator-administratorLMSId-${lmsId}`,
            classlinkTenantId: `administrator-classlinkTenantId-${lmsId}`,
            isDeactivated: false,
          })),
        )
      },
    }
    const teacherRepository: ConstructorParameters<typeof LoadAllCodexEntities>[4] = {
      getAllByLmsId: async function (lmsIds: string[]): Promise<Errorable<Teacher[], E<'UnknownRuntimeError', string>>> {
        return successErrorable(
          lmsIds.map((lmsId) => ({
            id: `teacher-id-${lmsId}`,
            userId: `teacher-userId-${lmsId}`,
            firstName: `teacher-firstName-${lmsId}`,
            lastName: `teacher-lastName-${lmsId}`,
            teacherLMSId: `teacher-teacherLMSId-${lmsId}`,
            classlinkTenantId: `teacher-classlinkTenantId-${lmsId}`,
            isDeactivated: false,
          })),
        )
      },
    }
    const studentRepository: ConstructorParameters<typeof LoadAllCodexEntities>[5] = {
      getAllByLmsId: async function (lmsIds: string[]): Promise<Errorable<Student[], E<'UnknownRuntimeError', string>>> {
        return successErrorable(
          lmsIds.map((lmsId) => ({
            id: `student-id-${lmsId}`,
            nickName: `student-nickName-${lmsId}`,
            userId: `student-userId-${lmsId}`,
            studentLMSId: `student-studentLMSId-${lmsId}`,
            classlinkTenantId: `student-classlinkTenantId-${lmsId}`,
            isDeactivated: false,
          })),
        )
      },
    }
    const administratorDistrictRepository: ConstructorParameters<typeof LoadAllCodexEntities>[6] = {
      getAllByDistrictId: async function (districtId: string): Promise<Errorable<AdministratorDistrict[], E<'UnknownRuntimeError', string>>> {
        return successErrorable([
          {
            districtId,
            administratorId: 'administrator-id-lmsId-1',
          },
          {
            districtId,
            administratorId: 'administrator-id-lmsId-2',
          },
          {
            districtId,
            administratorId: 'administrator-id-no-lmsId',
          },
        ])
      },
    }
    const teacherOrganizationRepository: ConstructorParameters<typeof LoadAllCodexEntities>[7] = {
      getAllByOrganizationId: async function (organizationId: string): Promise<Errorable<TeacherOrganization[], E<'UnknownRuntimeError', string>>> {
        return successErrorable([
          {
            organizationId,
            teacherId: `teacher-id-lmsId-1`,
          },
          {
            organizationId,
            teacherId: `teacher-id-lmsId-2`,
          },
          {
            organizationId,
            teacherId: `teacher-id-no-lmsId`,
          },
        ])
      },
    }
    const studentGroupStudentRepository: ConstructorParameters<typeof LoadAllCodexEntities>[8] = {
      getAllByStudentGroupId: async function (studentGroupId: string): Promise<Errorable<StudentGroupStudent[], E<'UnknownRuntimeError', string>>> {
        return successErrorable([
          {
            studentGroupId,
            studentId: `student-id-lmsId-1`,
          },
          {
            studentGroupId,
            studentId: `student-id-lmsId-2`,
          },
          {
            studentGroupId,
            studentId: `student-id-no-lmsId`,
          },
        ])
      },
    }
    const loadAllCodexEntities = new LoadAllCodexEntities(
      organizationRepository,
      studentGroupRepository,
      userRepository,
      administratorRepository,
      teacherRepository,
      studentRepository,
      administratorDistrictRepository,
      teacherOrganizationRepository,
      studentGroupStudentRepository,
    )

    const result = await loadAllCodexEntities.run('districtId', 'tenandId', ['lmsId-1', 'lmsId-2'], ['lmsId-3', 'lmsId-4'], ['lmsId-5', 'lmsId-6'])

    if (result.hasError) {
      throw result.error
    }

    const {
      allCodexOrganizations,
      allCodexStudentGroups,
      allCodexUsers,
      allCodexAdministrators,
      allCodexTeachers,
      allCodexStudents,
      allCodexAdministratorDistricts,
      allCodexTeacherOrganizations,
      allCodexStudentGroupStudents,
    } = result.value

    expect(allCodexOrganizations).toEqual<typeof allCodexOrganizations>([
      {
        id: 'organization-id-1',
        name: 'organization-name-1',
        districtId: 'districtId',
        organizationLMSId: 'organization-organizationLMSId-1',
        classlinkTenantId: 'organization-classlinkTenantId-1',
      },
      {
        id: 'organization-id-2',
        name: 'organization-name-2',
        districtId: 'districtId',
        organizationLMSId: 'organization-organizationLMSId-2',
        classlinkTenantId: 'organization-classlinkTenantId-2',
      },
    ])
    expect(allCodexStudentGroups).toEqual<typeof allCodexStudentGroups>([
      {
        id: `studentGroup-id-1-organization-id-1`,
        organizationId: 'organization-id-1',
        name: `studentGroup-name-1-organization-id-1`,
        grade: `studentGroup-grade-1-organization-id-1`,
        studentGroupLmsId: `studentGroup-studentGroupLmsId-1-organization-id-1`,
        classlinkTenantId: `studentGroup-classlinkTenantId-1-organization-id-1`,
      },
      {
        id: `studentGroup-id-2-organization-id-1`,
        organizationId: 'organization-id-1',
        name: `studentGroup-name-2-organization-id-1`,
        grade: `studentGroup-grade-2-organization-id-1`,
        studentGroupLmsId: `studentGroup-studentGroupLmsId-2-organization-id-1`,
        classlinkTenantId: `studentGroup-classlinkTenantId-2-organization-id-1`,
      },
      {
        id: `studentGroup-id-1-organization-id-2`,
        organizationId: 'organization-id-2',
        name: `studentGroup-name-1-organization-id-2`,
        grade: `studentGroup-grade-1-organization-id-2`,
        studentGroupLmsId: `studentGroup-studentGroupLmsId-1-organization-id-2`,
        classlinkTenantId: `studentGroup-classlinkTenantId-1-organization-id-2`,
      },
      {
        id: `studentGroup-id-2-organization-id-2`,
        organizationId: 'organization-id-2',
        name: `studentGroup-name-2-organization-id-2`,
        grade: `studentGroup-grade-2-organization-id-2`,
        studentGroupLmsId: `studentGroup-studentGroupLmsId-2-organization-id-2`,
        classlinkTenantId: `studentGroup-classlinkTenantId-2-organization-id-2`,
      },
    ])
    expect(allCodexUsers).toEqual<typeof allCodexUsers>([
      { id: 'administrator-userId-lmsId-1', role: 'student', isDeactivated: false },
      { id: 'administrator-userId-lmsId-2', role: 'student', isDeactivated: false },
      { id: 'administrator-userId-lmsId-3', role: 'student', isDeactivated: false },
      { id: 'administrator-userId-lmsId-4', role: 'student', isDeactivated: false },
      { id: 'administrator-userId-lmsId-5', role: 'student', isDeactivated: false },
      { id: 'administrator-userId-lmsId-6', role: 'student', isDeactivated: false },
      { id: 'teacher-userId-lmsId-1', role: 'student', isDeactivated: false },
      { id: 'teacher-userId-lmsId-2', role: 'student', isDeactivated: false },
      { id: 'teacher-userId-lmsId-3', role: 'student', isDeactivated: false },
      { id: 'teacher-userId-lmsId-4', role: 'student', isDeactivated: false },
      { id: 'teacher-userId-lmsId-5', role: 'student', isDeactivated: false },
      { id: 'teacher-userId-lmsId-6', role: 'student', isDeactivated: false },
      { id: 'student-userId-lmsId-1', role: 'student', isDeactivated: false },
      { id: 'student-userId-lmsId-2', role: 'student', isDeactivated: false },
      { id: 'student-userId-lmsId-3', role: 'student', isDeactivated: false },
      { id: 'student-userId-lmsId-4', role: 'student', isDeactivated: false },
      { id: 'student-userId-lmsId-5', role: 'student', isDeactivated: false },
      { id: 'student-userId-lmsId-6', role: 'student', isDeactivated: false },
    ])
    expect(allCodexAdministrators).toEqual<typeof allCodexAdministrators>([
      {
        id: 'administrator-id-lmsId-1',
        userId: 'administrator-userId-lmsId-1',
        firstName: 'administrator-firstName-lmsId-1',
        lastName: 'administrator-lastName-lmsId-1',
        administratorLMSId: 'administrator-administratorLMSId-lmsId-1',
        classlinkTenantId: 'administrator-classlinkTenantId-lmsId-1',
        isDeactivated: false,
      },
      {
        id: 'administrator-id-lmsId-2',
        userId: 'administrator-userId-lmsId-2',
        firstName: 'administrator-firstName-lmsId-2',
        lastName: 'administrator-lastName-lmsId-2',
        administratorLMSId: 'administrator-administratorLMSId-lmsId-2',
        classlinkTenantId: 'administrator-classlinkTenantId-lmsId-2',
        isDeactivated: false,
      },
      {
        id: 'administrator-id-lmsId-3',
        userId: 'administrator-userId-lmsId-3',
        firstName: 'administrator-firstName-lmsId-3',
        lastName: 'administrator-lastName-lmsId-3',
        administratorLMSId: 'administrator-administratorLMSId-lmsId-3',
        classlinkTenantId: 'administrator-classlinkTenantId-lmsId-3',
        isDeactivated: false,
      },
      {
        id: 'administrator-id-lmsId-4',
        userId: 'administrator-userId-lmsId-4',
        firstName: 'administrator-firstName-lmsId-4',
        lastName: 'administrator-lastName-lmsId-4',
        administratorLMSId: 'administrator-administratorLMSId-lmsId-4',
        classlinkTenantId: 'administrator-classlinkTenantId-lmsId-4',
        isDeactivated: false,
      },
      {
        id: 'administrator-id-lmsId-5',
        userId: 'administrator-userId-lmsId-5',
        firstName: 'administrator-firstName-lmsId-5',
        lastName: 'administrator-lastName-lmsId-5',
        administratorLMSId: 'administrator-administratorLMSId-lmsId-5',
        classlinkTenantId: 'administrator-classlinkTenantId-lmsId-5',
        isDeactivated: false,
      },
      {
        id: 'administrator-id-lmsId-6',
        userId: 'administrator-userId-lmsId-6',
        firstName: 'administrator-firstName-lmsId-6',
        lastName: 'administrator-lastName-lmsId-6',
        administratorLMSId: 'administrator-administratorLMSId-lmsId-6',
        classlinkTenantId: 'administrator-classlinkTenantId-lmsId-6',
        isDeactivated: false,
      },
    ])
    expect(allCodexTeachers).toEqual<typeof allCodexTeachers>([
      {
        id: `teacher-id-lmsId-1`,
        userId: `teacher-userId-lmsId-1`,
        firstName: `teacher-firstName-lmsId-1`,
        lastName: `teacher-lastName-lmsId-1`,
        teacherLMSId: `teacher-teacherLMSId-lmsId-1`,
        classlinkTenantId: `teacher-classlinkTenantId-lmsId-1`,
        isDeactivated: false,
      },
      {
        id: `teacher-id-lmsId-2`,
        userId: `teacher-userId-lmsId-2`,
        firstName: `teacher-firstName-lmsId-2`,
        lastName: `teacher-lastName-lmsId-2`,
        teacherLMSId: `teacher-teacherLMSId-lmsId-2`,
        classlinkTenantId: `teacher-classlinkTenantId-lmsId-2`,
        isDeactivated: false,
      },
      {
        id: `teacher-id-lmsId-3`,
        userId: `teacher-userId-lmsId-3`,
        firstName: `teacher-firstName-lmsId-3`,
        lastName: `teacher-lastName-lmsId-3`,
        teacherLMSId: `teacher-teacherLMSId-lmsId-3`,
        classlinkTenantId: `teacher-classlinkTenantId-lmsId-3`,
        isDeactivated: false,
      },
      {
        id: `teacher-id-lmsId-4`,
        userId: `teacher-userId-lmsId-4`,
        firstName: `teacher-firstName-lmsId-4`,
        lastName: `teacher-lastName-lmsId-4`,
        teacherLMSId: `teacher-teacherLMSId-lmsId-4`,
        classlinkTenantId: `teacher-classlinkTenantId-lmsId-4`,
        isDeactivated: false,
      },
      {
        id: `teacher-id-lmsId-5`,
        userId: `teacher-userId-lmsId-5`,
        firstName: `teacher-firstName-lmsId-5`,
        lastName: `teacher-lastName-lmsId-5`,
        teacherLMSId: `teacher-teacherLMSId-lmsId-5`,
        classlinkTenantId: `teacher-classlinkTenantId-lmsId-5`,
        isDeactivated: false,
      },
      {
        id: `teacher-id-lmsId-6`,
        userId: `teacher-userId-lmsId-6`,
        firstName: `teacher-firstName-lmsId-6`,
        lastName: `teacher-lastName-lmsId-6`,
        teacherLMSId: `teacher-teacherLMSId-lmsId-6`,
        classlinkTenantId: `teacher-classlinkTenantId-lmsId-6`,
        isDeactivated: false,
      },
    ])
    expect(allCodexStudents).toEqual<typeof allCodexStudents>([
      {
        id: `student-id-lmsId-1`,
        nickName: `student-nickName-lmsId-1`,
        userId: `student-userId-lmsId-1`,
        studentLMSId: `student-studentLMSId-lmsId-1`,
        classlinkTenantId: `student-classlinkTenantId-lmsId-1`,
        isDeactivated: false,
      },
      {
        id: `student-id-lmsId-2`,
        nickName: `student-nickName-lmsId-2`,
        userId: `student-userId-lmsId-2`,
        studentLMSId: `student-studentLMSId-lmsId-2`,
        classlinkTenantId: `student-classlinkTenantId-lmsId-2`,
        isDeactivated: false,
      },
      {
        id: `student-id-lmsId-3`,
        nickName: `student-nickName-lmsId-3`,
        userId: `student-userId-lmsId-3`,
        studentLMSId: `student-studentLMSId-lmsId-3`,
        classlinkTenantId: `student-classlinkTenantId-lmsId-3`,
        isDeactivated: false,
      },
      {
        id: `student-id-lmsId-4`,
        nickName: `student-nickName-lmsId-4`,
        userId: `student-userId-lmsId-4`,
        studentLMSId: `student-studentLMSId-lmsId-4`,
        classlinkTenantId: `student-classlinkTenantId-lmsId-4`,
        isDeactivated: false,
      },
      {
        id: `student-id-lmsId-5`,
        nickName: `student-nickName-lmsId-5`,
        userId: `student-userId-lmsId-5`,
        studentLMSId: `student-studentLMSId-lmsId-5`,
        classlinkTenantId: `student-classlinkTenantId-lmsId-5`,
        isDeactivated: false,
      },
      {
        id: `student-id-lmsId-6`,
        nickName: `student-nickName-lmsId-6`,
        userId: `student-userId-lmsId-6`,
        studentLMSId: `student-studentLMSId-lmsId-6`,
        classlinkTenantId: `student-classlinkTenantId-lmsId-6`,
        isDeactivated: false,
      },
    ])
    expect(allCodexAdministratorDistricts).toEqual<typeof allCodexAdministratorDistricts>([
      {
        districtId: 'districtId',
        administratorId: 'administrator-id-lmsId-1',
      },
      {
        districtId: 'districtId',
        administratorId: 'administrator-id-lmsId-2',
      },
    ])
    expect(allCodexTeacherOrganizations).toEqual<typeof allCodexTeacherOrganizations>([
      // organization-id-1
      {
        organizationId: 'organization-id-1',
        teacherId: `teacher-id-lmsId-1`,
      },
      {
        organizationId: 'organization-id-1',
        teacherId: `teacher-id-lmsId-2`,
      },
      // organization-id-2
      {
        organizationId: 'organization-id-2',
        teacherId: `teacher-id-lmsId-1`,
      },
      {
        organizationId: 'organization-id-2',
        teacherId: `teacher-id-lmsId-2`,
      },
    ])
    expect(allCodexStudentGroupStudents).toEqual<typeof allCodexStudentGroupStudents>([
      // studentGroup-id-1-organization-id-1
      {
        studentGroupId: 'studentGroup-id-1-organization-id-1',
        studentId: `student-id-lmsId-1`,
      },
      {
        studentGroupId: 'studentGroup-id-1-organization-id-1',
        studentId: `student-id-lmsId-2`,
      },
      // studentGroup-id-2-organization-id-1
      {
        studentGroupId: 'studentGroup-id-2-organization-id-1',
        studentId: `student-id-lmsId-1`,
      },
      {
        studentGroupId: 'studentGroup-id-2-organization-id-1',
        studentId: `student-id-lmsId-2`,
      },
      // studentGroup-id-1-organization-id-2
      {
        studentGroupId: 'studentGroup-id-1-organization-id-2',
        studentId: `student-id-lmsId-1`,
      },
      {
        studentGroupId: 'studentGroup-id-1-organization-id-2',
        studentId: `student-id-lmsId-2`,
      },
      // studentGroup-id-2-organization-id-2
      {
        studentGroupId: 'studentGroup-id-2-organization-id-2',
        studentId: `student-id-lmsId-1`,
      },
      {
        studentGroupId: 'studentGroup-id-2-organization-id-2',
        studentId: `student-id-lmsId-2`,
      },
    ])
  })
})
