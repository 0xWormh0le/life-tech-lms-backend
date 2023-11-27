import { MakeNonNullable } from '../../../../../domain/usecases/shared/Types'
import { Administrator } from '../entities/Administrator'
import { Organization } from '../entities/Organization'
import { Student } from '../entities/Student'
import { StudentGroup } from '../entities/StudentGroup'
import { Teacher } from '../entities/Teacher'
import {
  compareAdministratorDistricts,
  compareStudentStudentGroups,
  compareTeacherOrganizations,
  SourceLmsAdministrator,
  SourceLmsStudent,
  SourceLmsTeacher,
} from './RosterSync'

const sourceLmsAdministrator = (i: number): SourceLmsAdministrator => ({
  role: 'administrator',
  administratorLMSId: `administrator-administratorLMSId-${i}`,
  email: `administrator-email-${i}`,
  firstName: `administrator-firstName-${i}`,
  lastName: `administrator-lastName-${i}`,
  classlinkTenantId: `administrator-classlinkTenantId-${i}`,
  isDeactivated: false,
})

const sourceLmsTeacher = (i: number): SourceLmsTeacher => ({
  role: 'teacher',
  teacherLMSId: `teacher-teacherLMSId-${i}`,
  email: `teacher-email-${i}`,
  firstName: `teacher-firstName-${i}`,
  lastName: `teacher-lastName-${i}`,
  classlinkTenantId: `teacher-classlinkTenantId-${i}`,
  isDeactivated: false,
})

const sourceLmsStudent = (i: number): SourceLmsStudent => ({
  role: 'student',
  studentLMSId: `student-studentLMSId-${i}`,
  email: `student-email-${i}`,
  nickName: `student-nickName-${i}`,
  classlinkTenantId: `student-classlinkTenantId-${i}`,
  isDeactivated: false,
})

const codexAdministrator = (i: number): MakeNonNullable<Administrator, 'administratorLMSId'> => ({
  id: `administrator-id-${i}`,
  userId: `administrator-userId-${i}`,
  firstName: `administrator-firstName-${i}`,
  lastName: `administrator-lastName-${i}`,
  administratorLMSId: `administrator-administratorLMSId-${i}`,
  classlinkTenantId: `administrator-classlinkTenantId-${i}`,
  isDeactivated: false,
})

const codexTeacher = (i: number): MakeNonNullable<Teacher, 'teacherLMSId'> => ({
  id: `teacher-id-${i}`,
  userId: `teacher-userId-${i}`,
  firstName: `teacher-firstName-${i}`,
  lastName: `teacher-lastName-${i}`,
  teacherLMSId: `teacher-teacherLMSId-${i}`,
  classlinkTenantId: `teacher-classlinkTenantId-${i}`,
  isDeactivated: false,
})

const codexStudent = (i: number): MakeNonNullable<Student, 'studentLMSId'> => ({
  id: `student-id-${i}`,
  userId: `student-userId-${i}`,
  nickName: `student-nickName-${i}`,
  studentLMSId: `student-studentLMSId-${i}`,
  classlinkTenantId: `student-classlinkTenantId-${i}`,
  isDeactivated: false,
})

const codexOrganization = (i: number): MakeNonNullable<Organization, 'organizationLMSId'> => ({
  id: `organization-id-${i}`,
  name: `organization-name-${i}`,
  districtId: `organization-districtId-${i}`,
  organizationLMSId: `organization-organizationLMSId-${i}`,
  classlinkTenantId: `organization-classlinkTenantId-${i}`,
})

const codexStudentGroup = (i: number): MakeNonNullable<StudentGroup, 'studentGroupLmsId'> => ({
  id: `studentGroup-id-${i}`,
  name: `studentGroup-name-${i}`,
  organizationId: `studentGroup-organizationId-${i}`,
  grade: `studentGroup-grade-${i}`,
  studentGroupLmsId: `studentGroup-studentGroupLmsId-${i}`,
  classlinkTenantId: `studentGroup-classlinkTenantId-${i}`,
})

describe('RosterSync', () => {
  const allSourceUsersUniquebyEmail: (SourceLmsAdministrator | SourceLmsTeacher | SourceLmsStudent)[] = [
    sourceLmsAdministrator(1),
    // sourceLmsAdministrator(2),
    sourceLmsAdministrator(3),
    sourceLmsAdministrator(4),
    sourceLmsTeacher(1),
    sourceLmsTeacher(2),
    // sourceLmsTeacher(3),
    sourceLmsStudent(1),
    sourceLmsStudent(2),
    // sourceLmsStudent(3),
  ]

  describe('compareAdministratorDistricts', () => {
    test('success', async () => {
      const result = await compareAdministratorDistricts(
        allSourceUsersUniquebyEmail,
        [
          // { will create
          //   administratorId: 'administrator-id-1',
          //   districtId: 'district-id',
          // },
          // { will create
          //   administratorId: 'administrator-id-2',
          //   districtId: 'district-id',
          // },
          // { will NOT create because doesn't exist in allSourceUsersUniquebyEmail
          //   administratorId: 'administrator-id-3',
          //   districtId: 'district-id',
          // },
          {
            // stay
            administratorId: 'administrator-id-4',
            districtId: 'district-id',
          },
          {
            // will delete
            administratorId: 'administrator-id-5',
            districtId: 'district-id',
          },
          {
            // will delete because doesn't exist in allSourceUsersUniquebyEmail
            administratorId: 'administrator-id-6',
            districtId: 'district-id',
          },
        ],
        [
          {
            administratorLMSId: 'administrator-administratorLMSId-1',
            districtLMSId: 'district-districtLMSId',
          },
          {
            administratorLMSId: 'administrator-administratorLMSId-2',
            districtLMSId: 'district-districtLMSId',
          },
          {
            administratorLMSId: 'administrator-administratorLMSId-3',
            districtLMSId: 'district-districtLMSId',
          },
          {
            administratorLMSId: 'administrator-administratorLMSId-4',
            districtLMSId: 'district-districtLMSId',
          },
          // { will delete
          //   administratorLMSId: 'administrator-administratorLMSId-5',
          //   districtLMSId: 'district-districtLMSId',
          // },
        ],
        {
          id: 'district-id',
          name: 'district-name',
          districtLMSId: 'district-districtLMSId',
          classlinkTenantId: 'district-classlinkTenantId',
          classlinkAppId: 'district-classlinkAppId',
          classlinkAccessToken: 'district-classlinkAccessToken',
        },
        {
          entitiesToCreate: [codexAdministrator(1), codexAdministrator(3), codexAdministrator(5)],
          entitiesToUpdate: [codexAdministrator(2), codexAdministrator(4), codexAdministrator(6)],
        },
      )

      if (result.hasError) {
        throw new Error(JSON.stringify(result))
      }

      expect(result.value).toEqual<typeof result.value>({
        entitiesToCreate: [
          {
            districtId: 'district-id',
            administratorId: 'administrator-id-1',
          },
          {
            districtId: 'district-id',
            administratorId: 'administrator-id-3',
          },
        ],
        entitiesToDelete: [
          {
            administratorId: 'administrator-id-5',
            districtId: 'district-id',
          },
          {
            administratorId: 'administrator-id-6',
            districtId: 'district-id',
          },
        ],
      })
    })
  })

  describe('compareTeacherOrganizations', () => {
    test('success', async () => {
      const result = await compareTeacherOrganizations(
        allSourceUsersUniquebyEmail,
        [
          {
            teacherId: 'teacher-id-1',
            organizationId: 'organization-id-1',
          },
          {
            teacherId: 'teacher-id-1',
            organizationId: 'organization-id-2',
          },
          {
            teacherId: 'teacher-id-2',
            organizationId: 'organization-id-1',
          },
          // { will create
          //   teacherId: 'teacher-id-2',
          //   organizationId: 'organization-id-2',
          // },
          // { will create
          //   teacherId: 'teacher-id-2',
          //   organizationId: 'organization-id-3',
          // },
          // { will NOT create because doesn't exist in allSourceUsersUniquebyEmail
          //   teacherId: 'teacher-id-3',
          //   organizationId: 'organization-id-1',
          // },
          {
            // will delete because doesn't exist in allSourceUsersUniquebyEmail
            teacherId: 'teacher-id-3',
            organizationId: 'organization-id-2',
          },
        ],
        [
          // { will remove
          //   teacherLMSId: 'teacher-teacherLMSId-1',
          //   organizationLMSId: 'organization-organizationLMSI-1',
          // },
          // { will remove
          //   teacherLMSId: 'teacher-teacherLMSId-1',
          //   organizationLMSId: 'organization-organizationLMSId-2',
          // },
          {
            teacherLMSId: 'teacher-teacherLMSId-2',
            organizationLMSId: 'organization-organizationLMSId-1',
          },
          {
            teacherLMSId: 'teacher-teacherLMSId-2',
            organizationLMSId: 'organization-organizationLMSId-2',
          },
          {
            teacherLMSId: 'teacher-teacherLMSId-2',
            organizationLMSId: 'organization-organizationLMSId-3',
          },
          {
            teacherLMSId: 'teacher-teacherLMSId-3',
            organizationLMSId: 'organization-organizationLMSId-1',
          },
          {
            teacherLMSId: 'teacher-teacherLMSId-3',
            organizationLMSId: 'organization-organizationLMSId-2',
          },
        ],
        {
          entitiesToCreate: [codexOrganization(1), codexOrganization(3), codexOrganization(5)],
          entitiesToUpdate: [codexOrganization(2), codexOrganization(4), codexOrganization(6)],
        },
        {
          entitiesToCreate: [codexTeacher(1), codexTeacher(3), codexTeacher(5)],
          entitiesToUpdate: [codexTeacher(2), codexTeacher(4), codexTeacher(6)],
        },
      )

      if (result.hasError) {
        throw new Error(JSON.stringify(result))
      }

      expect(result.value).toEqual<typeof result.value>({
        entitiesToCreate: [
          { organizationId: 'organization-id-2', teacherId: 'teacher-id-2' },
          { organizationId: 'organization-id-3', teacherId: 'teacher-id-2' },
        ],
        entitiesToDelete: [
          { teacherId: 'teacher-id-1', organizationId: 'organization-id-1' },
          { teacherId: 'teacher-id-1', organizationId: 'organization-id-2' },
          { teacherId: 'teacher-id-3', organizationId: 'organization-id-2' },
        ],
      })
    })
  })

  describe('compareStudentStudentGroups', () => {
    test('success', async () => {
      const result = await compareStudentStudentGroups(
        allSourceUsersUniquebyEmail,
        [
          {
            studentId: 'student-id-1',
            studentGroupId: 'studentGroup-id-1',
          },
          {
            studentId: 'student-id-1',
            studentGroupId: 'studentGroup-id-2',
          },
          {
            studentId: 'student-id-2',
            studentGroupId: 'studentGroup-id-1',
          },
          // { will create
          //   studentId: 'student-id-2',
          //   studentGroupId: 'studentGroup-id-2',
          // },
          // { will create
          //   studentId: 'student-id-2',
          //   studentGroupId: 'studentGroup-id-3',
          // },
          // { will NOT create because doesn't exist in allSourceUsersUniquebyEmail
          //   studentId: 'student-id-3',
          //   studentGroupId: 'studentGroup-id-1',
          // },
          {
            // will delete because doesn't exist in allSourceUsersUniquebyEmail
            studentId: 'student-id-3',
            studentGroupId: 'studentGroup-id-2',
          },
        ],
        [
          // { will remove
          //   studentLMSId: 'student-studentLMSId-1',
          //   studentGroupLmsId: 'studentGroup-studentGroupLmsId-1',
          // },
          // { will remove
          //   studentLMSId: 'student-studentLMSId-1',
          //   studentGroupLmsId: 'studentGroup-studentGroupLmsId-2',
          // },
          {
            studentLMSId: 'student-studentLMSId-2',
            studentGroupLmsId: 'studentGroup-studentGroupLmsId-1',
          },
          {
            studentLMSId: 'student-studentLMSId-2',
            studentGroupLmsId: 'studentGroup-studentGroupLmsId-2',
          },
          {
            studentLMSId: 'student-studentLMSId-2',
            studentGroupLmsId: 'studentGroup-studentGroupLmsId-3',
          },
          {
            studentLMSId: 'student-studentLMSId-3',
            studentGroupLmsId: 'studentGroup-studentGroupLmsId-1',
          },
          {
            studentLMSId: 'student-studentLMSId-3',
            studentGroupLmsId: 'studentGroup-studentGroupLmsId-2',
          },
        ],
        { entitiesToCreate: [codexStudentGroup(1)], entitiesToUpdate: [codexStudentGroup(2), codexStudentGroup(3)] },
        { entitiesToCreate: [codexStudent(1)], entitiesToUpdate: [codexStudent(2), codexStudent(3)] },
      )

      if (result.hasError) {
        throw new Error(JSON.stringify(result))
      }

      expect(result.value).toEqual<typeof result.value>({
        entitiesToCreate: [
          { studentGroupId: 'studentGroup-id-2', studentId: 'student-id-2' },
          { studentGroupId: 'studentGroup-id-3', studentId: 'student-id-2' },
        ],
        entitiesToDelete: [
          { studentId: 'student-id-1', studentGroupId: 'studentGroup-id-1' },
          { studentId: 'student-id-1', studentGroupId: 'studentGroup-id-2' },
          { studentId: 'student-id-3', studentGroupId: 'studentGroup-id-2' },
        ],
      })
    })
  })
})
