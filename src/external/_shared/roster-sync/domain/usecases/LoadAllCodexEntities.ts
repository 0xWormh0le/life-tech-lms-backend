import {
  E,
  Errorable,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import { MakeNonNullable } from '../../../../../domain/usecases/shared/Types'
import { Administrator } from '../entities/Administrator'
import { AdministratorDistrict } from '../entities/AdministratorDistrict'
import { Organization } from '../entities/Organization'
import { Student } from '../entities/Student'
import { StudentGroup } from '../entities/StudentGroup'
import { StudentGroupStudent } from '../entities/StudentGroupStudent'
import { Teacher } from '../entities/Teacher'
import { TeacherOrganization } from '../entities/TeacherOrganization'
import { User } from '../entities/User'
import {
  IAdministratorDistrictRepository,
  IAdministratorRepository,
  IOrganizationRepository,
  IStudentGroupRepository,
  IStudentGroupStudentRepository,
  IStudentRepository,
  ITeacherOrganizationRepository,
  ITeacherRepository,
  IUserRepository,
} from './RosterSync'

export class LoadAllCodexEntities {
  constructor(
    private organizationRepository: Pick<
      IOrganizationRepository,
      'getAllByDistrictId'
    >,
    private studentGroupRepository: Pick<
      IStudentGroupRepository,
      'getAllByOrganizationId'
    >,
    private userRepository: Pick<IUserRepository, 'getByIds'>,
    private administratorRepository: Pick<
      IAdministratorRepository,
      'getAllByLmsId'
    >,
    private teacherRepository: Pick<ITeacherRepository, 'getAllByLmsId'>,
    private studentRepository: Pick<IStudentRepository, 'getAllByLmsId'>,
    private administratorDistrictRepository: Pick<
      IAdministratorDistrictRepository,
      'getAllByDistrictId'
    >,
    private teacherOrganizationRepository: Pick<
      ITeacherOrganizationRepository,
      'getAllByOrganizationId'
    >,
    private studentGroupStudentRepository: Pick<
      IStudentGroupStudentRepository,
      'getAllByStudentGroupId'
    >,
  ) {}

  public run = async (
    districtId: string,
    tenantId: string | null,
    administratorLmsIds: string[],
    teacherLmsIds: string[],
    studentLmsIds: string[],
  ): Promise<
    Errorable<
      {
        allCodexOrganizations: MakeNonNullable<
          Organization,
          'organizationLMSId'
        >[]
        allCodexStudentGroups: MakeNonNullable<
          StudentGroup,
          'studentGroupLmsId'
        >[]
        allCodexUsers: User[]
        allCodexAdministrators: MakeNonNullable<
          Administrator,
          'administratorLMSId'
        >[]
        allCodexTeachers: MakeNonNullable<Teacher, 'teacherLMSId'>[]
        allCodexStudents: MakeNonNullable<Student, 'studentLMSId'>[]
        allCodexAdministratorDistricts: AdministratorDistrict[]
        allCodexTeacherOrganizations: TeacherOrganization[]
        allCodexStudentGroupStudents: StudentGroupStudent[]
      },
      | E<'UnknownRuntimeError'>
      | E<'UnauthorizedError'>
      | E<'AlreadyExistError'>
      | E<'NotFoundError'>
    >
  > => {
    //
    // Collect Codex Entities
    //
    const allCodexOrganizations: MakeNonNullable<
      Organization,
      'organizationLMSId'
    >[] = []
    const allCodexStudentGroups: MakeNonNullable<
      StudentGroup,
      'studentGroupLmsId'
    >[] = []
    const allCodexUsers: User[] = []
    const allCodexAdministrators: MakeNonNullable<
      Administrator,
      'administratorLMSId'
    >[] = []
    const allCodexTeachers: MakeNonNullable<Teacher, 'teacherLMSId'>[] = []
    const allCodexStudents: MakeNonNullable<Student, 'studentLMSId'>[] = []
    const allCodexAdministratorDistricts: AdministratorDistrict[] = []
    const allCodexTeacherOrganizations: TeacherOrganization[] = []
    const allCodexStudentGroupStudents: StudentGroupStudent[] = []

    const allUserLmsIds = [
      ...administratorLmsIds,
      ...teacherLmsIds,
      ...studentLmsIds,
    ]
    const getAdministratorsResult =
      await this.administratorRepository.getAllByLmsId(allUserLmsIds, tenantId)

    if (getAdministratorsResult.hasError) {
      return unknownRuntimeError(
        `Codex Administrator Repository returns Error ${JSON.stringify(
          getAdministratorsResult.error,
        )}`,
      )
    }

    const getUsersForAdministratorResult = await this.userRepository.getByIds(
      getAdministratorsResult.value.map((e) => e.userId),
    )

    if (getUsersForAdministratorResult.hasError) {
      return unknownRuntimeError(
        `Codex UsersForAdministrator Repository returns Error ${JSON.stringify(
          getUsersForAdministratorResult.error,
        )}`,
      )
    }
    for (const administrator of getAdministratorsResult.value) {
      if (!administrator.administratorLMSId) {
        // If LMS ID is empty, consider it out of scope for Roster Sync.
        continue
      }

      const correspondingUser = getUsersForAdministratorResult.value.find(
        (e) => e.id === administrator.userId,
      )

      if (!correspondingUser) {
        continue
      }
      allCodexUsers.push(correspondingUser)
      allCodexAdministrators.push({
        ...administrator,
        administratorLMSId: administrator.administratorLMSId,
      })
    }

    const getTeachersResult = await this.teacherRepository.getAllByLmsId(
      allUserLmsIds,
      tenantId,
    )

    if (getTeachersResult.hasError) {
      return unknownRuntimeError(
        `Codex Teachers Repository returns Error ${JSON.stringify(
          getTeachersResult.error,
        )}`,
      )
    }

    const getUsersForTeacherResult = await this.userRepository.getByIds(
      getTeachersResult.value.map((e) => e.userId),
    )

    if (getUsersForTeacherResult.hasError) {
      return unknownRuntimeError(
        `Codex UsersForTeacher Repository returns Error ${JSON.stringify(
          getUsersForTeacherResult.error,
        )}`,
      )
    }
    for (const teacher of getTeachersResult.value) {
      if (!teacher.teacherLMSId) {
        // If LMS ID is empty, consider it out of scope for Roster Sync.
        continue
      }

      const correspondingUser = getUsersForTeacherResult.value.find(
        (e) => e.id === teacher.userId,
      )

      if (!correspondingUser) {
        continue
      }
      allCodexUsers.push(correspondingUser)
      allCodexTeachers.push({
        ...teacher,
        teacherLMSId: teacher.teacherLMSId,
      })
    }

    const getStudentsResult = await this.studentRepository.getAllByLmsId(
      allUserLmsIds,
      tenantId,
    )

    if (getStudentsResult.hasError) {
      return unknownRuntimeError(
        `Codex Students Repository returns Error ${JSON.stringify(
          getStudentsResult.error,
        )}`,
      )
    }

    const getUsersForStudentResult = await this.userRepository.getByIds(
      getStudentsResult.value.map((e) => e.userId),
    )

    if (getUsersForStudentResult.hasError) {
      return unknownRuntimeError(
        `Codex UsersForStudent Repository returns Error ${JSON.stringify(
          getUsersForStudentResult.error,
        )}`,
      )
    }
    for (const student of getStudentsResult.value) {
      if (!student.studentLMSId) {
        // If LMS ID is empty, consider it out of scope for Roster Sync.
        continue
      }

      const correspondingUser = getUsersForStudentResult.value.find(
        (e) => e.id === student.userId,
      )

      if (!correspondingUser) {
        continue
      }
      allCodexUsers.push(correspondingUser)
      allCodexStudents.push({
        ...student,
        studentLMSId: student.studentLMSId,
      })
    }

    const getAdministratorDistrictsResult =
      await this.administratorDistrictRepository.getAllByDistrictId(districtId)

    if (getAdministratorDistrictsResult.hasError) {
      return unknownRuntimeError(
        `Codex AdministratorDistricts Repository returns Error ${JSON.stringify(
          getAdministratorDistrictsResult.error,
        )}`,
      )
    }
    allCodexAdministratorDistricts.push(
      ...getAdministratorDistrictsResult.value.filter(
        (e) => !!allCodexAdministrators.find((a) => a.id === e.administratorId),
      ),
    )

    const getOrganizationResult =
      await this.organizationRepository.getAllByDistrictId(districtId)

    if (getOrganizationResult.hasError) {
      return unknownRuntimeError(
        `Codex Organization Repository returns Error ${JSON.stringify(
          getOrganizationResult.error,
        )}`,
      )
    }
    for (const organization of getOrganizationResult.value) {
      if (!organization.organizationLMSId) {
        // If LMS ID is empty, consider it out of scope for Roster Sync.
        continue
      }
      allCodexOrganizations.push({
        ...organization,
        organizationLMSId: organization.organizationLMSId,
      })

      const getTeacherOrganizationsResult =
        await this.teacherOrganizationRepository.getAllByOrganizationId(
          organization.id,
        )

      if (getTeacherOrganizationsResult.hasError) {
        return unknownRuntimeError(
          `Codex TeacherOrganizations Repository returns Error ${JSON.stringify(
            getTeacherOrganizationsResult.error,
          )}`,
        )
      }
      allCodexTeacherOrganizations.push(
        ...getTeacherOrganizationsResult.value.filter(
          (e) => !!allCodexTeachers.find((t) => t.id === e.teacherId),
        ),
      )

      const getStudentGroupsResult =
        await this.studentGroupRepository.getAllByOrganizationId(
          organization.id,
        )

      if (getStudentGroupsResult.hasError) {
        return unknownRuntimeError(
          `Codex StudentGroups Repository returns Error ${JSON.stringify(
            getStudentGroupsResult.error,
          )}`,
        )
      }
      for (const studentGroup of getStudentGroupsResult.value) {
        if (!studentGroup.studentGroupLmsId) {
          // If LMS ID is empty, consider it out of scope for Roster Sync.
          continue
        }
        allCodexStudentGroups.push({
          ...studentGroup,
          studentGroupLmsId: studentGroup.studentGroupLmsId,
        })

        const getStudentGroupStudentsResult =
          await this.studentGroupStudentRepository.getAllByStudentGroupId(
            studentGroup.id,
          )

        if (getStudentGroupStudentsResult.hasError) {
          return unknownRuntimeError(
            `Codex StudentGroupStudents Repository returns Error ${JSON.stringify(
              getStudentGroupStudentsResult.error,
            )}`,
          )
        }
        allCodexStudentGroupStudents.push(
          ...getStudentGroupStudentsResult.value.filter(
            (e) => !!allCodexStudents.find((s) => s.id === e.studentId),
          ),
        )
      }
    }

    return successErrorable({
      allCodexOrganizations,
      allCodexStudentGroups,
      allCodexUsers,
      allCodexAdministrators,
      allCodexTeachers,
      allCodexStudents,
      allCodexAdministratorDistricts,
      allCodexTeacherOrganizations,
      allCodexStudentGroupStudents,
    })
  }
}
