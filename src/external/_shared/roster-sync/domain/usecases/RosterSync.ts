import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import { Administrator } from '../entities/Administrator'
import { Teacher } from '../entities/Teacher'
import { Student } from '../entities/Student'
import { District } from '../entities/District'
import { Organization } from '../entities/Organization'
import { StudentGroup } from '../entities/StudentGroup'
import { AdministratorDistrict } from '../entities/AdministratorDistrict'
import { TeacherOrganization } from '../entities/TeacherOrganization'
import { StudentGroupStudent } from '../entities/StudentGroupStudent'
import { User } from '../entities/User'
import { DistrictRosterSyncStatus } from '../../../../../domain/entities/codex/DistrictRosterSyncStatus'
import {
  compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities,
  compareSourceLmsEntitiesAndCodexEntities,
  compareSourceLmsEntitiesAndCodexEntitiesWithParents,
  takeDiffs,
} from './CompareSourceLmsEntitiesAndCodexEntities'
import { LoadAllCodexEntities } from './LoadAllCodexEntities'
import { StoreAllCodexEntities } from './StoreAllCodexEntities'
import { StoreDistrictRosterSyncStatus } from './UpdateDistrictRosterSyncStatus'
import { MakeNonNullable } from '../../../../../domain/usecases/shared/Types'
import { uniqueUsersByEmail } from './UniqueUsersByEmail'

export interface IDistrictRosterSyncStatusRepository {
  createDistrictRosterSyncStatus(
    data: Pick<DistrictRosterSyncStatus, 'districtId' | 'createdUserId'> & {
      startedAt: Date
    },
  ): Promise<
    Errorable<DistrictRosterSyncStatus | null, E<'UnknownRuntimeError'>>
  >
  updateDistrictRosterSyncStatus(
    data: Pick<DistrictRosterSyncStatus, 'id'> & {
      errorMessage?: string
      finishedAt: Date
    },
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface IDistrictRepository {
  getById(
    id: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>>
  createDistricts(
    districts: Omit<District, 'id'>[],
  ): Promise<Errorable<District[], E<'UnknownRuntimeError'>>>
  updateDistricts(
    districts: District[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError' | 'NotFoundError'>>>
  deleteDistricts(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface IOrganizationRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  getAllByDistrictId(
    districtId: string,
  ): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>>
  createOrganizations(
    organizations: Omit<Organization, 'id'>[],
  ): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>>
  updateOrganizations(
    organizations: Organization[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  deleteOrganizations(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface IStudentGroupRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  getAllByOrganizationId(
    organizationId: string,
  ): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>>
  createStudentGroups(
    studentGroups: Omit<StudentGroup, 'id'>[],
  ): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>>
  updateStudentGroups(
    studentGroups: StudentGroup[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  deleteStudentGroups(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface IUserRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  getByIds(ids: string[]): Promise<Errorable<User[], E<'UnknownRuntimeError'>>>
  getByEmails(
    emails: string[],
  ): Promise<Errorable<User[], E<'UnknownRuntimeError'>>>
  createUsers(
    users: Omit<User, 'id'>[],
  ): Promise<
    Errorable<User[], E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>
  >
  updateUsers(
    users: User[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'NotFoundError'>>>
  deleteUsers(ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface IAdministratorRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  getAllByDistrictId(
    districtId: string,
  ): Promise<Errorable<Administrator[], E<'UnknownRuntimeError'>>>
  getAllByLmsId(
    lmsId: string[],
    tenantId: string | null,
  ): Promise<Errorable<Administrator[], E<'UnknownRuntimeError'>>>
  createAdministrators(
    administrators: Omit<Administrator, 'id'>[],
  ): Promise<
    Errorable<
      Administrator[],
      E<'UnknownRuntimeError'> | E<'AlreadyExistError'>
    >
  >
  updateAdministrators(
    administrators: Administrator[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  deleteAdministrators(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface ITeacherRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  getAllByOrganizationId(
    organizationId: string,
  ): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>>
  getAllByLmsId(
    lmsId: string[],
    tenantId: string | null,
  ): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>>
  createTeachers(
    teachers: Omit<Teacher, 'id'>[],
  ): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>>
  updateTeachers(
    teachers: Teacher[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  deleteTeachers(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface IStudentRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  getAllByStudentGroupId(
    studentGroupId: string,
  ): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>>
  getAllByLmsId(
    lmsId: string[],
    tenantId: string | null,
  ): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>>
  createStudents(
    students: Omit<Student, 'id'>[],
  ): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>>
  updateStudents(
    students: Student[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  deleteStudents(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface IAdministratorDistrictRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  getAllByDistrictId(
    districtId: string,
  ): Promise<Errorable<AdministratorDistrict[], E<'UnknownRuntimeError'>>>
  createAdministratorDistricts(
    administratorDistricts: AdministratorDistrict[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  deleteAdministratorDistricts(
    administratorDistricts: AdministratorDistrict[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface ITeacherOrganizationRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  getAllByOrganizationId(
    organizationId: string,
  ): Promise<Errorable<TeacherOrganization[], E<'UnknownRuntimeError'>>>
  createTeacherOrganizations(
    teacherOrganizations: TeacherOrganization[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  deleteTeacherOrganizations(
    teacherOrganizations: TeacherOrganization[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface IStudentGroupStudentRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  getAllByStudentGroupId(
    studentGroupId: string,
  ): Promise<Errorable<StudentGroupStudent[], E<'UnknownRuntimeError'>>>
  createStudentGroupStudents(
    studentGroupStudents: StudentGroupStudent[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  deleteStudentGroupStudents(
    studentGroupStudents: StudentGroupStudent[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export type SourceLmsOrganization = MakeNonNullable<
  Omit<Organization, 'id'>,
  'organizationLMSId'
>

export type SourceLmsStudentGroup = MakeNonNullable<
  Omit<StudentGroup, 'id' | 'organizationId'>,
  'studentGroupLmsId'
> & {
  organizationLMSId: string
}

export type SourceLmsAdministrator = MakeNonNullable<
  Omit<Administrator, 'id' | 'userId'>,
  'administratorLMSId'
> & {
  role: 'administrator'
  email: string
}

export type SourceLmsTeacher = MakeNonNullable<
  Omit<Teacher, 'id' | 'userId'>,
  'teacherLMSId'
> & {
  role: 'teacher'
  email: string
}

export type SourceLmsStudent = MakeNonNullable<
  Omit<Student, 'id' | 'userId'>,
  'studentLMSId'
> & {
  role: 'student'
  email: string
}

export type SourceLmsAdministratorDistrict = {
  districtLMSId: string
  administratorLMSId: string
}

export type SourceLmsTeacherOrganization = {
  organizationLMSId: string
  teacherLMSId: string
}

export type SourceLmsStudentGroupStudent = {
  studentGroupLmsId: string
  studentLMSId: string
}

export class RosterSync {
  constructor(
    private districtRepository: IDistrictRepository,
    private districtRosterSyncStatusRepository: IDistrictRosterSyncStatusRepository,
    private organizationRepository: IOrganizationRepository,
    private studentGroupRepository: IStudentGroupRepository,
    private userRepository: IUserRepository,
    private administratorRepository: IAdministratorRepository,
    private teacherRepository: ITeacherRepository,
    private studentRepository: IStudentRepository,
    private administratorDistrictRepository: IAdministratorDistrictRepository,
    private teacherOrganizationRepository: ITeacherOrganizationRepository,
    private studentGroupStudentRepository: IStudentGroupStudentRepository,
    private requestLmsApisAndMapToSourceLmsEntites: (
      district: District,
    ) => Promise<
      Errorable<
        {
          allSourceLmsOrganizations: SourceLmsOrganization[]
          allSourceLmsStudentGroups: SourceLmsStudentGroup[]
          allSourceLmsAdministrators: SourceLmsAdministrator[]
          allSourceLmsTeachers: SourceLmsTeacher[]
          allSourceLmsStudents: SourceLmsStudent[]
          allSourceLmsAdministratorDistricts: SourceLmsAdministratorDistrict[]
          allSourceLmsTeacherOrganizations: SourceLmsTeacherOrganization[]
          allSourceLmsStudentGroupStudents: SourceLmsStudentGroupStudent[]
        },
        E<'UnknownRuntimeError'>
      >
    >,
  ) {}

  public run = async (
    requestedUser: User,
    districtId: string,
    lmsId: NonNullable<District['lmsId']>,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'UnauthorizedError'>>
  > => {
    const storeDistrictRosterSyncStatus = new StoreDistrictRosterSyncStatus(
      this.districtRosterSyncStatusRepository,
    )
    const withErrorReporting = async (
      errorMessage: string,
      statusCode: 400 | 500,
    ) => {
      const errorReportingResult =
        await storeDistrictRosterSyncStatus.updateAsError(
          districtRosterSyncStatusId,
          districtId,
          {
            message: errorMessage,
            statusCode,
          },
        )

      if (errorReportingResult.hasError) {
        return unknownRuntimeError(
          `updateDistrictRosterSyncStatusAsError failed with error message ${errorMessage}`,
        )
      }

      console.log(`Report Error: ${JSON.stringify(errorMessage)}`)

      return unknownRuntimeError(errorMessage)
    }

    if (requestedUser.role !== 'internalOperator') {
      const errorMessage = JSON.stringify({
        message: `Only internal operator can perform roster sync operation.`,
        statusCode: 400,
      })

      return {
        hasError: true,
        error: {
          type: 'UnauthorizedError',
          message: JSON.stringify({
            message: errorMessage,
            statusCode: 400,
          }),
        },
        value: null,
      }
    }

    //
    // Create DistrictRosterSyncStatus
    //
    const createDistrictRosterSyncStatusResult =
      await storeDistrictRosterSyncStatus.create(districtId, requestedUser.id)

    if (createDistrictRosterSyncStatusResult.hasError) {
      return withErrorReporting(
        createDistrictRosterSyncStatusResult.error.message,
        500,
      )
    }

    const districtRosterSyncStatusId =
      createDistrictRosterSyncStatusResult.value.districtRosterSyncStatusId

    //
    // Get appId and accessToken from the District which is created in advance of running this process
    //
    const getDistrictResult = await this.districtRepository.getById(districtId)

    if (getDistrictResult.hasError || !getDistrictResult.value) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: JSON.stringify({
            message: `District does not exist in Life Is Tech portal for district id: ${districtId}`,
            statusCode: 400,
          }),
        },
        value: null,
      }
    }

    if (!getDistrictResult.value.enableRosterSync) {
      return withErrorReporting(
        `District roster sync process is disable for district: ${getDistrictResult.value.name}. Please enable the District's roster sync process for this district using Customer Setup UI`,
        400,
      )
    }

    if (getDistrictResult.value.lmsId !== lmsId) {
      return withErrorReporting(
        `District's LMS configration is not "${lmsId}" (${
          getDistrictResult.value.lmsId ?? 'undefined'
        }): ${
          getDistrictResult.value.name
        }. Please update the District's LMS as "${lmsId}" for this district using Customer Setup UI.`,
        400,
      )
    }

    const districtLMSId = getDistrictResult.value.districtLMSId
    const classlinkTenantId = getDistrictResult.value.classlinkTenantId
    const appId = getDistrictResult.value.classlinkAppId
    const accessToken = getDistrictResult.value.classlinkAccessToken

    if (!districtLMSId) {
      return withErrorReporting(
        `District doesn't have LMS ID. Please set it before running Roster Sync. id ${districtId}`,
        400,
      )
    }

    console.log(
      JSON.stringify({
        districtId,
        tenantId: classlinkTenantId,
        appId,
        accessToken,
      }),
    )

    //
    // Collect LMS Entity
    //
    console.log('Collect LMS Entity')

    const requestLmsApisAndMapToSourceLmsEntitesResult =
      await this.requestLmsApisAndMapToSourceLmsEntites(getDistrictResult.value)

    if (requestLmsApisAndMapToSourceLmsEntitesResult.hasError) {
      return withErrorReporting(
        requestLmsApisAndMapToSourceLmsEntitesResult.error.message,
        500,
      )
    }

    const {
      allSourceLmsOrganizations,
      allSourceLmsStudentGroups,
      allSourceLmsAdministrators,
      allSourceLmsTeachers,
      allSourceLmsStudents,
      allSourceLmsAdministratorDistricts,
      allSourceLmsTeacherOrganizations,
      allSourceLmsStudentGroupStudents,
    } = requestLmsApisAndMapToSourceLmsEntitesResult.value

    console.log(
      JSON.stringify({
        districtId,
        tenantId: classlinkTenantId,
        appId,
        accessToken,
        allSourceLmsOrganizations,
        allSourceLmsStudentGroups,
        allSourceLmsAdministrators,
        allSourceLmsTeachers,
        allSourceLmsStudents,
        allSourceLmsAdministratorDistricts,
        allSourceLmsTeacherOrganizations,
        allSourceLmsStudentGroupStudents,
      }),
    )
    console.log(
      JSON.stringify(
        {
          allSourceLmsOrganizations: allSourceLmsOrganizations.length,
          allSourceLmsStudentGroups: allSourceLmsStudentGroups.length,
          allSourceLmsAdministrators: allSourceLmsAdministrators.length,
          allSourceLmsTeachers: allSourceLmsTeachers.length,
          allSourceLmsStudents: allSourceLmsStudents.length,
          allSourceLmsAdministratorDistricts:
            allSourceLmsAdministratorDistricts.length,
          allSourceLmsTeacherOrganizations:
            allSourceLmsTeacherOrganizations.length,
          allSourceLmsStudentGroupStudents:
            allSourceLmsStudentGroupStudents.length,
        },
        null,
        2,
      ),
    )

    const loadAllCodexEntitiesResult = await new LoadAllCodexEntities(
      this.organizationRepository,
      this.studentGroupRepository,
      this.userRepository,
      this.administratorRepository,
      this.teacherRepository,
      this.studentRepository,
      this.administratorDistrictRepository,
      this.teacherOrganizationRepository,
      this.studentGroupStudentRepository,
    ).run(
      districtId,
      classlinkTenantId,
      allSourceLmsAdministrators.map((e) => e.administratorLMSId),
      allSourceLmsTeachers.map((e) => e.teacherLMSId),
      allSourceLmsStudents.map((e) => e.studentLMSId),
    )

    if (loadAllCodexEntitiesResult.hasError) {
      return withErrorReporting(loadAllCodexEntitiesResult.error.message, 500)
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
    } = loadAllCodexEntitiesResult.value
    const codexDistrict = { ...getDistrictResult.value, districtLMSId }

    // console.log(
    //   JSON.stringify({
    //     codexDistrict,
    //     allCodexOrganizations,
    //     allCodexStudentGroups,
    //     allCodexUsers,
    //     allCodexAdministrators,
    //     allCodexTeachers,
    //     allCodexStudents,
    //     allCodexAdministratorDistricts,
    //     allCodexTeacherOrganizations,
    //     allCodexStudentGroupStudents,
    //   }),
    // )
    console.log(
      JSON.stringify(
        {
          allCodexOrganizations: allCodexOrganizations.length,
          allCodexStudentGroups: allCodexStudentGroups.length,
          allCodexUsers: allCodexUsers.length,
          allCodexAdministrators: allCodexAdministrators.length,
          allCodexTeachers: allCodexTeachers.length,
          allCodexStudents: allCodexStudents.length,
          allCodexAdministratorDistricts: allCodexAdministratorDistricts.length,
          allCodexTeacherOrganizations: allCodexTeacherOrganizations.length,
          allCodexStudentGroupStudents: allCodexStudentGroupStudents.length,
        },
        null,
        2,
      ),
    )

    //
    // Take unique codex users by email
    //
    console.log(`Take unique codex users by email`)

    const uniqueUsersByEmailResult = await uniqueUsersByEmail(
      allSourceLmsAdministrators,
      allSourceLmsTeachers,
      allSourceLmsStudents,
    )

    if (uniqueUsersByEmailResult.hasError) {
      return withErrorReporting(uniqueUsersByEmailResult.error.message, 500)
    }

    const {
      allSourceUsersUniquebyEmail,
      allSourceAdministratorsUniquebyEmail,
      allSourceTeachersUniquebyEmail,
      allSourceStudentsUniquebyEmail,
    } = uniqueUsersByEmailResult.value

    console.log(
      JSON.stringify(
        {
          allSourceUsersUniquebyEmail: allSourceUsersUniquebyEmail.length,
          allSourceAdministratorsUniquebyEmail:
            allSourceAdministratorsUniquebyEmail.length,
          allSourceTeachersUniquebyEmail: allSourceTeachersUniquebyEmail.length,
          allSourceStudentsUniquebyEmail: allSourceStudentsUniquebyEmail.length,
        },
        null,
        2,
      ),
    )

    //
    // Check entities will be created, updated or deleted
    //
    console.log('Check entities will be created, updated or deleted')

    console.log(
      `  - compare allCodexOrganizations (${allCodexOrganizations.length}) and allSourceLmsOrganizations (${allSourceLmsOrganizations.length})`,
    )

    const organizations = await compareSourceLmsEntitiesAndCodexEntities(
      allCodexOrganizations,
      allSourceLmsOrganizations,
      (codex, sourceLms) =>
        codex.organizationLMSId === sourceLms.organizationLMSId,
      (id, sourceLms) => ({
        ...sourceLms,
        id,
      }),
      () => this.organizationRepository.issueId(),
    )

    if (organizations.hasError) {
      return withErrorReporting(organizations.error.message, 500)
    }

    console.log(
      `  - compare allCodexStudentGroups (${allCodexStudentGroups.length}) and allSourceLmsStudentGroups (${allSourceLmsStudentGroups.length})`,
    )

    const studentGroups =
      await compareSourceLmsEntitiesAndCodexEntitiesWithParents(
        allCodexStudentGroups,
        allSourceLmsStudentGroups,
        (codex, sourceLms) =>
          codex.studentGroupLmsId === sourceLms.studentGroupLmsId,
        (sourceLms) => {
          return (
            [
              ...allCodexOrganizations,
              ...organizations.value.entitiesToCreate,
            ].find(
              (e) => e.organizationLMSId === sourceLms.organizationLMSId,
            ) ?? null
          )
        },
        (id, parentCodexId, sourceLms) => ({
          ...sourceLms,
          id,
          organizationId: parentCodexId,
        }),
        () => this.studentGroupRepository.issueId(),
      )

    if (studentGroups.hasError) {
      return withErrorReporting(studentGroups.error.message, 500)
    }

    console.log('  - takeDiffs allCodexUsers and allSourceUsersUniquebyEmail')

    const users = await takeDiffs<
      User,
      SourceLmsAdministrator | SourceLmsTeacher | SourceLmsStudent,
      E<'UnknownRuntimeError'>
    >(
      allCodexUsers,
      allSourceUsersUniquebyEmail,
      async (codexUser, souceLmsUser) => {
        if (!souceLmsUser.email || souceLmsUser.email === '') {
          return failureErrorable(
            'UnknownRuntimeError',
            `source user from LMS doesn't have email lmsId: ${JSON.stringify(
              souceLmsUser,
            )}`,
          )
        }

        return successErrorable(codexUser.email === souceLmsUser.email)
      },
      async (sourceLms) => {
        const issueIdResult = await this.userRepository.issueId()

        if (issueIdResult.hasError) {
          return issueIdResult
        }

        return successErrorable({
          id: issueIdResult.value,
          role: sourceLms.role,
          email: sourceLms.email,
          isDeactivated: false,
        })
      },
      async (codex, sourceLms) =>
        successErrorable({
          id: codex.id,
          role: sourceLms.role,
          email: sourceLms.email,
          isDeactivated: false,
        }),
    )

    if (users.hasError) {
      return withErrorReporting(users.error.message, 500)
    }

    console.log(
      `  - compare allCodexAdministrators (${allCodexAdministrators.length}) and allSourceAdministratorsUniquebyEmail (${allSourceAdministratorsUniquebyEmail.length})`,
    )

    const administrators =
      await compareSourceLmsEntitiesAndCodexEntitiesWithParents(
        allCodexAdministrators,
        allSourceAdministratorsUniquebyEmail,
        (codex, sourceLms) =>
          codex.administratorLMSId === sourceLms.administratorLMSId,
        (sourceLms) =>
          [...allCodexUsers, ...users.value.toCreate].find(
            (e) => e.email === sourceLms.email,
          ) ?? null,
        (id, parentCodexId, sourceLms) => ({
          ...sourceLms,
          id,
          userId: parentCodexId,
        }),
        () => this.administratorRepository.issueId(),
      )

    if (administrators.hasError) {
      return withErrorReporting(administrators.error.message, 500)
    }

    console.log(
      `  - compare allCodexTeachers (${allCodexTeachers.length}) and allSourceTeachersUniquebyEmail (${allSourceTeachersUniquebyEmail.length})`,
    )

    const teachers = await compareSourceLmsEntitiesAndCodexEntitiesWithParents(
      allCodexTeachers,
      allSourceTeachersUniquebyEmail,
      (codex, sourceLms) => codex.teacherLMSId === sourceLms.teacherLMSId,
      (sourceLms) =>
        [...allCodexUsers, ...users.value.toCreate].find(
          (e) => e.email === sourceLms.email,
        ) ?? null,
      (id, parentCodexId, sourceLms) => ({
        ...sourceLms,
        id,
        userId: parentCodexId,
      }),
      () => this.teacherRepository.issueId(),
    )

    if (teachers.hasError) {
      return withErrorReporting(teachers.error.message, 500)
    }

    console.log(
      `  - compare allCodexStudents (${allCodexStudents.length}) and allSourceStudentsUniquebyEmail (${allSourceStudentsUniquebyEmail.length})`,
    )

    const students = await compareSourceLmsEntitiesAndCodexEntitiesWithParents(
      allCodexStudents,
      allSourceStudentsUniquebyEmail,
      (codex, sourceLms) => codex.studentLMSId === sourceLms.studentLMSId,
      (sourceLms) =>
        [...allCodexUsers, ...users.value.toCreate].find(
          (e) => e.email === sourceLms.email,
        ) ?? null,
      (id, parentCodexId, sourceLms) => ({
        ...sourceLms,
        id,
        userId: parentCodexId,
      }),
      () => this.studentRepository.issueId(),
    )

    if (students.hasError) {
      return withErrorReporting(students.error.message, 500)
    }

    console.log(
      `  - compare allCodexAdministratorDistricts (${allCodexAdministratorDistricts.length}) and allSourceLmsAdministratorDistricts (${allSourceLmsAdministratorDistricts.length})`,
    )

    // const allAdministratorsLmsIdMap = [
    //   ...administrators.value.entitiesToCreate,
    //   ...administrators.value.entitiesToUpdate,
    // ].reduce((prev, administrator) => {
    //   return {
    //     ...prev,
    //   }
    // }, [])

    const administratorDistricts = await compareAdministratorDistricts(
      allSourceUsersUniquebyEmail,
      allCodexAdministratorDistricts,
      allSourceLmsAdministratorDistricts,
      codexDistrict,
      administrators.value,
    )

    if (administratorDistricts.hasError) {
      return withErrorReporting(administratorDistricts.error.message, 500)
    }

    console.log(
      `  - compare allCodexTeacherOrganizations (${allCodexTeacherOrganizations.length}) and allSourceLmsTeacherOrganizations (${allSourceLmsTeacherOrganizations.length})`,
    )

    const teacherOrganizations = await compareTeacherOrganizations(
      allSourceUsersUniquebyEmail,
      allCodexTeacherOrganizations,
      allSourceLmsTeacherOrganizations,
      organizations.value,
      teachers.value,
    )

    if (teacherOrganizations.hasError) {
      return withErrorReporting(teacherOrganizations.error.message, 500)
    }

    console.log(
      `  - compare allCodexStudentGroupStudents (${allCodexStudentGroupStudents.length}) and allSourceLmsStudentGroupStudents (${allSourceLmsStudentGroupStudents.length})`,
    )

    const studentStudentGroups = await compareStudentStudentGroups(
      allSourceUsersUniquebyEmail,
      allCodexStudentGroupStudents,
      allSourceLmsStudentGroupStudents,
      studentGroups.value,
      students.value,
    )

    if (studentStudentGroups.hasError) {
      return withErrorReporting(studentStudentGroups.error.message, 500)
    }

    console.log('Start to Store data in database')

    console.log(
      JSON.stringify({
        organizations: {
          toCreate: organizations.value.entitiesToCreate.length,
          toUpdate: organizations.value.entitiesToUpdate.length,
          toDelete: organizations.value.entitiesToDelete.length,
        },
        studentGroups: {
          toCreate: studentGroups.value.entitiesToCreate.length,
          toUpdate: studentGroups.value.entitiesToUpdate.length,
          toDelete: studentGroups.value.entitiesToDelete.length,
        },
        administrators: {
          toCreate: administrators.value.entitiesToCreate.length,
          toUpdate: administrators.value.entitiesToUpdate.length,
          toDelete: administrators.value.entitiesToDelete.length,
        },
        teachers: {
          toCreate: teachers.value.entitiesToCreate.length,
          toUpdate: teachers.value.entitiesToUpdate.length,
          toDelete: teachers.value.entitiesToDelete.length,
        },
        students: {
          toCreate: students.value.entitiesToCreate.length,
          toUpdate: students.value.entitiesToUpdate.length,
          toDelete: students.value.entitiesToDelete.length,
        },
        administratorDistricts: {
          toCreate: administratorDistricts.value.entitiesToCreate.length,
          toDelete: administratorDistricts.value.entitiesToDelete.length,
        },
        teacherOrganizations: {
          toCreate: teacherOrganizations.value.entitiesToCreate.length,
          toDelete: teacherOrganizations.value.entitiesToDelete.length,
        },
        studentStudentGroups: {
          toCreate: studentStudentGroups.value.entitiesToCreate.length,
          toDelete: studentStudentGroups.value.entitiesToDelete.length,
        },
      }),
    )

    const storeAllCodexEntitiesResult = await new StoreAllCodexEntities(
      this.organizationRepository,
      this.studentGroupRepository,
      this.userRepository,
      this.administratorRepository,
      this.teacherRepository,
      this.studentRepository,
      this.administratorDistrictRepository,
      this.teacherOrganizationRepository,
      this.studentGroupStudentRepository,
    ).run(
      users.value.toCreate,
      users.value.toUpdate,
      users.value.toDelete,
      administrators.value.entitiesToCreate,
      administrators.value.entitiesToUpdate,
      administrators.value.entitiesToDelete,
      teachers.value.entitiesToCreate,
      teachers.value.entitiesToUpdate,
      teachers.value.entitiesToDelete,
      students.value.entitiesToCreate,
      students.value.entitiesToUpdate,
      students.value.entitiesToDelete,
      organizations.value.entitiesToCreate,
      organizations.value.entitiesToUpdate,
      organizations.value.entitiesToDelete,
      studentGroups.value.entitiesToCreate,
      studentGroups.value.entitiesToUpdate,
      studentGroups.value.entitiesToDelete,
      administratorDistricts.value.entitiesToCreate,
      administratorDistricts.value.entitiesToDelete,
      teacherOrganizations.value.entitiesToCreate,
      teacherOrganizations.value.entitiesToDelete,
      studentStudentGroups.value.entitiesToCreate,
      studentStudentGroups.value.entitiesToDelete,
    )

    if (storeAllCodexEntitiesResult.hasError) {
      switch (storeAllCodexEntitiesResult.error.type) {
        case 'AlreadyExistError':
        case 'NotFoundError':
          return withErrorReporting(
            storeAllCodexEntitiesResult.error.message,
            400,
          )
        default:
          return withErrorReporting(
            storeAllCodexEntitiesResult.error.message,
            500,
          )
      }
    }

    console.log('Finished stroring data in database')

    //
    // Update District Roster Sync Status as a Success
    //
    console.log('Update District Roster Sync Status as a Success')

    const updateDistrictRosterSyncStatusResult =
      await storeDistrictRosterSyncStatus.updateAsSuccess(
        districtRosterSyncStatusId,
        districtId,
      )

    if (updateDistrictRosterSyncStatusResult.hasError) {
      return withErrorReporting(
        updateDistrictRosterSyncStatusResult.error.message,
        500,
      )
    }

    //
    // If we have the users who do NOT have email, report it
    //
    if (uniqueUsersByEmailResult.value.usersWithNoEmail) {
      console.log('Report the users who do NOT have email')

      // Report Error but do not stop the Process
      await withErrorReporting(
        `
The following users don't have email. Please ask the customer to register the email for them in LMS or create the user manually with the custom Login Id / Password.
${uniqueUsersByEmailResult.value.usersWithNoEmail
  .map((user) => {
    switch (user.role) {
      case 'administrator':
        return `${user.role} - ${user.firstName} ${user.lastName} LMS ID: ${user.administratorLMSId}`
      case 'teacher':
        return `${user.role} - ${user.firstName} ${user.lastName} LMS ID: ${user.teacherLMSId}`
      case 'student':
        return `${user.role}: ${user.nickName} LMS ID: ${user.studentLMSId}`
    }
  })
  .join('\n')}
`,
        400,
      )
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}

export const compareAdministratorDistricts = async (
  allSourceUsersUniquebyEmail: (
    | SourceLmsAdministrator
    | SourceLmsTeacher
    | SourceLmsStudent
  )[],
  allCodexAdministratorDistricts: AdministratorDistrict[],
  allSourceLmsAdministratorDistricts: SourceLmsAdministratorDistrict[],
  codexDistrict: District,
  administrators: {
    entitiesToCreate: MakeNonNullable<Administrator, 'administratorLMSId'>[]
    entitiesToUpdate: MakeNonNullable<Administrator, 'administratorLMSId'>[]
  },
) => {
  return await compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities(
    'districtId',
    'administratorId',
    allCodexAdministratorDistricts,
    allSourceLmsAdministratorDistricts.filter(
      (e) =>
        !!allSourceUsersUniquebyEmail.find((u) => {
          if (u.role !== 'administrator') {
            return false
          }

          return u.administratorLMSId === e.administratorLMSId
        }),
    ),
    () => codexDistrict,
    (sourceLms) =>
      [
        ...administrators.entitiesToCreate,
        ...administrators.entitiesToUpdate,
      ].find((e) => e.administratorLMSId === sourceLms.administratorLMSId) ??
      null,
    (parentId, humanId, sourceLms) => ({
      ...sourceLms,
      districtId: parentId,
      administratorId: humanId,
    }),
  )
}

export const compareTeacherOrganizations = async (
  allSourceUsersUniquebyEmail: (
    | SourceLmsAdministrator
    | SourceLmsTeacher
    | SourceLmsStudent
  )[],
  allCodexTeacherOrganizations: TeacherOrganization[],
  allSourceLmsTeacherOrganizations: SourceLmsTeacherOrganization[],
  organizations: {
    entitiesToCreate: MakeNonNullable<Organization, 'organizationLMSId'>[]
    entitiesToUpdate: MakeNonNullable<Organization, 'organizationLMSId'>[]
  },
  teachers: {
    entitiesToCreate: MakeNonNullable<Teacher, 'teacherLMSId'>[]
    entitiesToUpdate: MakeNonNullable<Teacher, 'teacherLMSId'>[]
  },
) => {
  return await compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities(
    'organizationId',
    'teacherId',
    allCodexTeacherOrganizations,
    allSourceLmsTeacherOrganizations.filter(
      (e) =>
        !!allSourceUsersUniquebyEmail.find((u) => {
          if (u.role !== 'teacher') {
            return false
          }

          return u.teacherLMSId === e.teacherLMSId
        }),
    ),
    (sourceLms) =>
      [
        ...organizations.entitiesToCreate,
        ...organizations.entitiesToUpdate,
      ].find((e) => e.organizationLMSId === sourceLms.organizationLMSId) ??
      null,
    (sourceLms) =>
      [...teachers.entitiesToCreate, ...teachers.entitiesToUpdate].find(
        (e) => e.teacherLMSId === sourceLms.teacherLMSId,
      ) ?? null,
    (parentId, humanId, sourceLms) => ({
      ...sourceLms,
      organizationId: parentId,
      teacherId: humanId,
    }),
  )
}

export const compareStudentStudentGroups = async (
  allSourceUsersUniquebyEmail: (
    | SourceLmsAdministrator
    | SourceLmsTeacher
    | SourceLmsStudent
  )[],
  allCodexStudentGroupStudents: StudentGroupStudent[],
  allSourceLmsStudentGroupStudents: SourceLmsStudentGroupStudent[],
  studentGroups: {
    entitiesToCreate: MakeNonNullable<StudentGroup, 'studentGroupLmsId'>[]
    entitiesToUpdate: MakeNonNullable<StudentGroup, 'studentGroupLmsId'>[]
  },
  students: {
    entitiesToCreate: MakeNonNullable<Student, 'studentLMSId'>[]
    entitiesToUpdate: MakeNonNullable<Student, 'studentLMSId'>[]
  },
) => {
  return await compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities(
    'studentGroupId',
    'studentId',
    allCodexStudentGroupStudents,
    allSourceLmsStudentGroupStudents.filter(
      (e) =>
        !!allSourceUsersUniquebyEmail.find((u) => {
          if (u.role !== 'student') {
            return false
          }

          return u.studentLMSId === e.studentLMSId
        }),
    ),
    (sourceLms) =>
      [
        ...studentGroups.entitiesToCreate,
        ...studentGroups.entitiesToUpdate,
      ].find((e) => e.studentGroupLmsId === sourceLms.studentGroupLmsId) ??
      null,
    (sourceLms) =>
      [...students.entitiesToCreate, ...students.entitiesToUpdate].find(
        (e) => e.studentLMSId === sourceLms.studentLMSId,
      ) ?? null,
    (parentId, humanId, sourceLms) => ({
      ...sourceLms,
      studentGroupId: parentId,
      studentId: humanId,
    }),
  )
}
