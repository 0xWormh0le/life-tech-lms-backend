import {
  E,
  Errorable,
  successErrorable,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { District } from '../../../_shared/roster-sync/domain/entities/District'
import { User } from '../../../_shared/roster-sync/domain/entities/User'
import {
  IAdministratorDistrictRepository,
  IAdministratorRepository,
  IDistrictRepository,
  IDistrictRosterSyncStatusRepository,
  IOrganizationRepository,
  IStudentGroupRepository,
  IStudentGroupStudentRepository,
  IStudentRepository,
  ITeacherOrganizationRepository,
  ITeacherRepository,
  IUserRepository,
  RosterSync,
  SourceLmsAdministrator,
  SourceLmsAdministratorDistrict,
  SourceLmsOrganization,
  SourceLmsStudent,
  SourceLmsStudentGroup,
  SourceLmsStudentGroupStudent,
  SourceLmsTeacher,
  SourceLmsTeacherOrganization,
} from '../../../_shared/roster-sync/domain/usecases/RosterSync'
import { CleverDistrict } from '../entities/CleverDistrict'
import { CleverDistrictAdministrator } from '../entities/CleverDistrictAdministrator'
import { CleverSchool } from '../entities/CleverSchool'
import { CleverSection } from '../entities/CleverSection'
import { CleverStudent } from '../entities/CleverStudent'
import { CleverTeacher } from '../entities/CleverTeacher'

export interface ICleverRosterSyncRepository {
  getCleverAuthToken(
    districtLmsId: string,
  ): Promise<Errorable<string | null, E<'UnknownRuntimeError'>>>
}

export interface ICleverDistrictRepository {
  getDistrict(
    cleverAuthToken: string,
  ): Promise<Errorable<CleverDistrict | null, E<'UnknownRuntimeError'>>>
}

export interface ICleverDistrictAdministratorRepository {
  getDistrictAdministrator(
    cleverAuthToken: string,
  ): Promise<Errorable<CleverDistrictAdministrator[], E<'UnknownRuntimeError'>>>
}

export interface ICleverSchoolRepository {
  getCleverSchools(
    cleverAuthToken: string,
  ): Promise<Errorable<CleverSchool[], E<'UnknownRuntimeError'>>>
}

export interface ICleverTeacherRepository {
  getCleverTeachers(
    cleverAuthToken: string,
    cleverSchools: string[],
  ): Promise<Errorable<CleverTeacher[], E<'UnknownRuntimeError'>>>
}

export interface ICleverStudentRepository {
  getCleverStudents(
    cleverAuthToken: string,
    cleverSchools: string[],
  ): Promise<Errorable<CleverStudent[], E<'UnknownRuntimeError'>>>
}

export interface ICleverSectionRepository {
  getCleverSections(
    cleverAuthToken: string,
    cleverSchools: string[],
  ): Promise<Errorable<CleverSection[], E<'UnknownRuntimeError'>>>
}

export class RequestCleverApisAndMapToSourceLmsEntites {
  constructor(
    private cleverRosterSyncRepository: ICleverRosterSyncRepository,
    private cleverDistrictRepository: ICleverDistrictRepository,
    private cleverSchoolRepository: ICleverSchoolRepository,
    private cleverSectionRepository: ICleverSectionRepository,
    private cleverDistrictAdministratorRepository: ICleverDistrictAdministratorRepository,
    private cleverTeacherRepository: ICleverTeacherRepository,
    private cleverStudentRepository: ICleverStudentRepository,
  ) {}

  public run = async (
    district: District,
  ): Promise<
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
  > => {
    const allSourceLmsOrganizations: SourceLmsOrganization[] = []
    const allSourceLmsStudentGroups: SourceLmsStudentGroup[] = []
    // We will store all Clever Administrator as Teacher in Codex
    const allSourceLmsAdministrators: SourceLmsAdministrator[] = []
    const allSourceLmsTeachers: SourceLmsTeacher[] = []
    const allSourceLmsStudents: SourceLmsStudent[] = []
    const allSourceLmsAdministratorDistricts: SourceLmsAdministratorDistrict[] =
      []
    const allSourceLmsTeacherOrganizations: SourceLmsTeacherOrganization[] = []
    const allSourceLmsStudentGroupStudents: SourceLmsStudentGroupStudent[] = []

    if (!district.districtLMSId) {
      return unknownRuntimeError(`district doesn't have LMS Id`)
    }
    const getCleverAuthTokenResult =
      await this.cleverRosterSyncRepository.getCleverAuthToken(
        district.districtLMSId,
      )
    if (getCleverAuthTokenResult.hasError) {
      return getCleverAuthTokenResult
    }
    if (!getCleverAuthTokenResult.value) {
      return unknownRuntimeError(
        `failed to get Auth Token from Clever API for lmsID ${district.districtLMSId} districtId: ${district.id}`,
      )
    }
    const authToken = getCleverAuthTokenResult.value

    const getCleverDistrictResult =
      await this.cleverDistrictRepository.getDistrict(authToken)
    if (getCleverDistrictResult.hasError) {
      return unknownRuntimeError(
        `Claslink District API returns Error: ${getCleverDistrictResult.error} lmsID ${district.districtLMSId}`,
      )
    }
    const getCleverSchoolsResult =
      await this.cleverSchoolRepository.getCleverSchools(authToken)
    if (getCleverSchoolsResult.hasError) {
      return unknownRuntimeError(
        `Claslink School API returns Error: ${getCleverSchoolsResult.error} lmsID ${district.districtLMSId}`,
      )
    }
    const schoolIds = getCleverSchoolsResult.value.map(
      (e) => e.organizationLMSId,
    )
    const getCleverSectionsResult =
      await this.cleverSectionRepository.getCleverSections(authToken, schoolIds)
    if (getCleverSectionsResult.hasError) {
      return unknownRuntimeError(
        `Claslink Class API returns Error: ${getCleverSectionsResult.error} lmsID ${district.districtLMSId}`,
      )
    }
    const getCleverDistrictAdministratorsResult =
      await this.cleverDistrictAdministratorRepository.getDistrictAdministrator(
        authToken,
      )
    if (getCleverDistrictAdministratorsResult.hasError) {
      return unknownRuntimeError(
        `Claslink District Administrator API returns Error: ${getCleverDistrictAdministratorsResult.error} lmsID ${district.districtLMSId}`,
      )
    }
    const getCleverTeachersResult =
      await this.cleverTeacherRepository.getCleverTeachers(authToken, schoolIds)
    if (getCleverTeachersResult.hasError) {
      return unknownRuntimeError(
        `Claslink Teacher API returns Error: ${getCleverTeachersResult.error} lmsID ${district.districtLMSId}`,
      )
    }
    const getCleverStudentsResult =
      await this.cleverStudentRepository.getCleverStudents(authToken, schoolIds)
    if (getCleverStudentsResult.hasError) {
      return unknownRuntimeError(
        `Claslink Studnet API returns Error: ${getCleverStudentsResult.error} lmsID ${district.districtLMSId}`,
      )
    }
    console.log(
      JSON.stringify({
        'Clever API Result': 'District',
        districtId: district.id,
        getCleverDistrictResult: getCleverDistrictResult.value,
        getCleverSchoolsResult: getCleverSchoolsResult.value,
        getCleverSectionsResult: getCleverSectionsResult.value,
        getCleverDistrictAdministratorsResult:
          getCleverDistrictAdministratorsResult.value,
        getCleverTeachersResult: getCleverTeachersResult.value,
        getCleverStudentsResult: getCleverStudentsResult.value,
      }),
    )

    for (const cleverSchool of getCleverSchoolsResult.value) {
      if (
        allSourceLmsOrganizations.find(
          (e) => e.organizationLMSId === cleverSchool.organizationLMSId,
        )
      ) {
        // Take unique by lmsId
        continue
      }
      allSourceLmsOrganizations.push({
        districtId: district.id,
        name: cleverSchool.name,
        organizationLMSId: cleverSchool.organizationLMSId,
        classlinkTenantId: district.classlinkTenantId,
      })
    }

    for (const cleverSection of getCleverSectionsResult.value) {
      if (
        allSourceLmsStudentGroups.find(
          (e) => e.studentGroupLmsId === cleverSection.studentGroupLMSId,
        )
      ) {
        // Take unique by lmsId
        continue
      }
      allSourceLmsStudentGroups.push({
        grade: cleverSection.grade,
        name: cleverSection.name,
        organizationLMSId: cleverSection.organizationLMSId,
        studentGroupLmsId: cleverSection.studentGroupLMSId,
        classlinkTenantId: district.classlinkTenantId,
      })
    }

    for (const cleverDistrictAdministrator of getCleverDistrictAdministratorsResult.value) {
      // We will store all Administrators in Clever as Teachers
      if (
        !allSourceLmsTeachers.find(
          (e) =>
            e.teacherLMSId === cleverDistrictAdministrator.administratorLMSId,
        )
      ) {
        // Take unique by lmsId
        allSourceLmsTeachers.push({
          role: 'teacher',
          email: cleverDistrictAdministrator.email,
          firstName: cleverDistrictAdministrator.firstName,
          lastName: cleverDistrictAdministrator.lastName,
          teacherLMSId: cleverDistrictAdministrator.administratorLMSId,
          classlinkTenantId: district.classlinkTenantId,
          isDeactivated: false,
        })
        for (const schoolId of schoolIds) {
          allSourceLmsTeacherOrganizations.push({
            organizationLMSId: schoolId,
            teacherLMSId: cleverDistrictAdministrator.administratorLMSId,
          })
        }
      }
    }

    for (const cleverTeacher of getCleverTeachersResult.value) {
      if (
        !allSourceLmsTeachers.find(
          (e) => e.teacherLMSId === cleverTeacher.teacherLMSId,
        )
      ) {
        // Take unique by lmsId
        allSourceLmsTeachers.push({
          role: 'teacher',
          email: cleverTeacher.email,
          firstName: cleverTeacher.firstName,
          lastName: cleverTeacher.lastName,
          teacherLMSId: cleverTeacher.teacherLMSId,
          classlinkTenantId: district.classlinkTenantId,
          isDeactivated: false,
        })
      }
      allSourceLmsTeacherOrganizations.push({
        organizationLMSId: cleverTeacher.organizationLMSId,
        teacherLMSId: cleverTeacher.teacherLMSId,
      })
    }

    for (const cleverStudent of getCleverStudentsResult.value) {
      if (
        !allSourceLmsStudents.find(
          (e) => e.studentLMSId === cleverStudent.studentLMSId,
        )
      ) {
        // Take unique by lmsId
        allSourceLmsStudents.push({
          role: 'student',
          email: cleverStudent.email ?? '',
          nickName: cleverStudent.nickName,
          studentLMSId: cleverStudent.studentLMSId,
          classlinkTenantId: district.classlinkTenantId,
          isDeactivated: false,
        })
        for (const studentGroupsLMSId of cleverStudent.studentGroupsLMSId) {
          allSourceLmsStudentGroupStudents.push({
            studentGroupLmsId: studentGroupsLMSId,
            studentLMSId: cleverStudent.studentLMSId,
          })
        }
      }
    }

    return successErrorable({
      allSourceLmsOrganizations,
      allSourceLmsStudentGroups,
      allSourceLmsAdministrators,
      allSourceLmsTeachers,
      allSourceLmsStudents,
      allSourceLmsAdministratorDistricts,
      allSourceLmsTeacherOrganizations,
      allSourceLmsStudentGroupStudents,
    })
  }
}

export class CleverRosterSyncUseCase {
  constructor(
    private cleverRosterSyncRepository: ICleverRosterSyncRepository,
    private cleverDistrictRepository: ICleverDistrictRepository,
    private cleverSchoolRepository: ICleverSchoolRepository,
    private cleverSectionRepository: ICleverSectionRepository,
    private cleverDistrictAdministratorRepository: ICleverDistrictAdministratorRepository,
    private cleverTeacherRepository: ICleverTeacherRepository,
    private cleverStudentRepository: ICleverStudentRepository,
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
  ) {}

  private async withErrorReporting(
    id: string,
    districtId: string,
    errorable: Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'UnauthorizedError'>
      | E<'AlreadyExistError'>
      | E<'NotFoundError'>
    >,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'UnauthorizedError'>
      | E<'AlreadyExistError'>
      | E<'NotFoundError'>
    >
  > {
    try {
      const updateDistrictRosterSyncStatusResult =
        await this.districtRosterSyncStatusRepository.updateDistrictRosterSyncStatus(
          {
            id: id,
            errorMessage: errorable.error?.message,
            finishedAt: new Date(),
          },
        )

      if (updateDistrictRosterSyncStatusResult.hasError) {
        const errorMessage = JSON.stringify({
          message: `Failed to add logs for clevar roster sync process of this district: ${districtId} in Life Is Tech portal  with error ${JSON.stringify(
            updateDistrictRosterSyncStatusResult.error,
          )}`,
          statusCode: 500,
        })

        return unknownRuntimeError(errorMessage)
      }
    } catch (e) {
      return unknownRuntimeError(
        `failed withErrorReporting: ${JSON.stringify(e)}`,
      )
    }

    return errorable
  }

  async run(
    requestedUser: User,
    districtId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'UnauthorizedError'>
      | E<'AlreadyExistError'>
      | E<'NotFoundError'>
    >
  > {
    console.log('CleverRosterSyncUseCase start')

    const requestCleverApisAndMapToSourceLmsEntites =
      new RequestCleverApisAndMapToSourceLmsEntites(
        this.cleverRosterSyncRepository,
        this.cleverDistrictRepository,
        this.cleverSchoolRepository,
        this.cleverSectionRepository,
        this.cleverDistrictAdministratorRepository,
        this.cleverTeacherRepository,
        this.cleverStudentRepository,
      )
    const rosterSyncResult = await new RosterSync(
      this.districtRepository,
      this.districtRosterSyncStatusRepository,
      this.organizationRepository,
      this.studentGroupRepository,
      this.userRepository,
      this.administratorRepository,
      this.teacherRepository,
      this.studentRepository,
      this.administratorDistrictRepository,
      this.teacherOrganizationRepository,
      this.studentGroupStudentRepository,
      requestCleverApisAndMapToSourceLmsEntites.run,
    ).run(requestedUser, districtId, 'clever')

    if (rosterSyncResult.hasError) {
      return rosterSyncResult
    }

    console.log(`Finished CleverRosterSyncUseCase`)

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
