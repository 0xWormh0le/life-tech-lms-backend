import {
  E,
  Errorable,
  successErrorable,
  unknownRuntimeError,
} from '../../../../domain/usecases/shared/Errors'
import { ClasslinkDistrict } from '../entities/ClasslinkDistrict'
import { ClasslinkSchool } from '../entities/ClasslinkSchool'
import { ClasslinkClass } from '../entities/ClasslinkClass'
import { ClasslinkDistrictAdministrator } from '../entities/ClasslinkDistrictAdministrator'
import { ClasslinkSchoolAdministrator } from '../entities/ClasslinkSchoolAdministrator'
import { ClasslinkTeacher } from '../entities/ClasslinkTeacher'
import { ClasslinkStudent } from '../entities/ClasslinkStudent'
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
import { District } from '../../../_shared/roster-sync/domain/entities/District'

export interface IClasslinkDistrictRepository {
  getDistrict(
    appId: string,
    accessToken: string,
  ): Promise<Errorable<ClasslinkDistrict | null, E<'UnknownRuntimeError'>>>
}

export interface IClasslinkSchoolRepository {
  getAllSchools(
    appId: string,
    accessToken: string,
  ): Promise<Errorable<ClasslinkSchool[], E<'UnknownRuntimeError'>>>
}

export interface IClasslinkClassRepository {
  getAllBySchoolSourcedId(
    appId: string,
    accessToken: string,
    schoolSourcedId: string,
  ): Promise<Errorable<ClasslinkClass[], E<'UnknownRuntimeError'>>>
}

export interface IClasslinkDistrictAdministratorRepository {
  getAllByDistrictSourcedId(
    appId: string,
    accessToken: string,
    districtSourcedId: string,
  ): Promise<
    Errorable<ClasslinkDistrictAdministrator[], E<'UnknownRuntimeError'>>
  >
}

export interface IClasslinkSchoolAdministratorRepository {
  getAllBySchoolSourcedId(
    appId: string,
    accessToken: string,
    schoolSourcedId: string,
  ): Promise<
    Errorable<ClasslinkSchoolAdministrator[], E<'UnknownRuntimeError'>>
  >
}

export interface IClasslinkTeacherRepository {
  getAllBySchoolSourcedId(
    appId: string,
    accessToken: string,
    schoolSourcedId: string,
  ): Promise<Errorable<ClasslinkTeacher[], E<'UnknownRuntimeError'>>>
}

export interface IClasslinkStudentRepository {
  getAllByClassSourcedId(
    appId: string,
    accessToken: string,
    classSourcedId: string,
  ): Promise<Errorable<ClasslinkStudent[], E<'UnknownRuntimeError'>>>
}

export class RequestClasslinkApisAndMapToSourceLmsEntites {
  constructor(
    private classlinkDistrictRepository: IClasslinkDistrictRepository,
    private classlinkSchoolRepository: IClasslinkSchoolRepository,
    private classlinkClassRepository: IClasslinkClassRepository,
    private classlinkDistrictAdministratorRepository: IClasslinkDistrictAdministratorRepository,
    private classlinkSchoolAdministratorRepository: IClasslinkSchoolAdministratorRepository,
    private classlinkTeacherRepository: IClasslinkTeacherRepository,
    private classlinkStudentRepository: IClasslinkStudentRepository,
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
    // We will store all Classlink Administrator as Teacher in Codex
    const allSourceLmsAdministrators: SourceLmsAdministrator[] = []
    const allSourceLmsTeachers: SourceLmsTeacher[] = []
    const allSourceLmsStudents: SourceLmsStudent[] = []
    const allSourceLmsAdministratorDistricts: SourceLmsAdministratorDistrict[] =
      []
    const allSourceLmsTeacherOrganizations: SourceLmsTeacherOrganization[] = []
    const allSourceLmsStudentGroupStudents: SourceLmsStudentGroupStudent[] = []

    if (!district.classlinkAppId) {
      return unknownRuntimeError(`district doesn't have classlink App ID`)
    }
    if (!district.classlinkAccessToken) {
      return unknownRuntimeError(`district doesn't have classlink Access Token`)
    }
    if (!district.classlinkTenantId) {
      return unknownRuntimeError(`district doesn't have classlink Tenant Id`)
    }
    const appId = district.classlinkAppId
    const accessToken = district.classlinkAccessToken
    const classlinkTenantId = district.classlinkTenantId

    const getClasslinkDistrictResult =
      await this.classlinkDistrictRepository.getDistrict(appId, accessToken)
    if (getClasslinkDistrictResult.hasError) {
      return unknownRuntimeError(
        `Claslink District API returns Error: ${getClasslinkDistrictResult.error} appId: ${appId}, accessToken: ${accessToken}}`,
      )
    }
    if (
      !getClasslinkDistrictResult.value ||
      getClasslinkDistrictResult.value.status === 'tobedeleted'
    ) {
      return unknownRuntimeError(
        `Classlink District API returns empty data for district: ${district.name} districtId : ${district.id}`,
      )
    }

    const getClasslinkDistrictAdministratorsResult =
      await this.classlinkDistrictAdministratorRepository.getAllByDistrictSourcedId(
        appId,
        accessToken,
        getClasslinkDistrictResult.value.sourcedId,
      )
    if (getClasslinkDistrictAdministratorsResult.hasError) {
      return unknownRuntimeError(
        `Claslink District Administrator API returns Error: ${getClasslinkDistrictAdministratorsResult.error} appId: ${appId}, accessToken: ${accessToken}}`,
      )
    }
    const getClasslinkSchoolsResult =
      await this.classlinkSchoolRepository.getAllSchools(appId, accessToken)
    if (getClasslinkSchoolsResult.hasError) {
      return unknownRuntimeError(
        `Claslink School API returns Error: ${getClasslinkSchoolsResult.error} appId: ${appId}, accessToken: ${accessToken}}`,
      )
    }
    console.log(
      JSON.stringify({
        'Classlink API Result': 'District',
        districtId: district.id,
        classlinkTenantId,
        appId,
        accessToken,
        getClasslinkDistrictAdministratorsResult:
          getClasslinkDistrictAdministratorsResult.value,
        getClasslinkSchoolsResult: getClasslinkSchoolsResult.value,
      }),
    )
    for (const classlinkSchool of getClasslinkSchoolsResult.value) {
      if (classlinkSchool.status !== 'active') {
        continue
      }
      const getClasslinkSchoolAdministratorsResult =
        await this.classlinkSchoolAdministratorRepository.getAllBySchoolSourcedId(
          appId,
          accessToken,
          classlinkSchool.sourcedId,
        )
      if (getClasslinkSchoolAdministratorsResult.hasError) {
        return unknownRuntimeError(
          `Claslink School Administrator API returns Error: ${getClasslinkSchoolAdministratorsResult.error} appId: ${appId}, accessToken: ${accessToken}}`,
        )
      }

      const getClasslinkTeachersResult =
        await this.classlinkTeacherRepository.getAllBySchoolSourcedId(
          appId,
          accessToken,
          classlinkSchool.sourcedId,
        )
      if (getClasslinkTeachersResult.hasError) {
        return unknownRuntimeError(
          `Claslink Teacher API returns Error: ${getClasslinkTeachersResult.error} appId: ${appId}, accessToken: ${accessToken}}`,
        )
      }

      const getClasslinkClassesResult =
        await this.classlinkClassRepository.getAllBySchoolSourcedId(
          appId,
          accessToken,
          classlinkSchool.sourcedId,
        )
      if (getClasslinkClassesResult.hasError) {
        return unknownRuntimeError(
          `Claslink Class API returns Error: ${getClasslinkClassesResult.error} appId: ${appId}, accessToken: ${accessToken}}`,
        )
      }
      console.log(
        JSON.stringify({
          'Classlink API Result': 'School',
          classlinkSchoolSourcedId: classlinkSchool.sourcedId,
          districtId: district.id,
          tenantId: classlinkTenantId,
          appId,
          accessToken,
          getClasslinkSchoolAdministratorsResult:
            getClasslinkSchoolAdministratorsResult.value,
          getClasslinkTeachersResult: getClasslinkTeachersResult.value,
          getClasslinkClassesResult: getClasslinkClassesResult.value,
        }),
      )

      for (const classlinkClass of getClasslinkClassesResult.value) {
        if (classlinkClass.status !== 'active') {
          continue
        }
        const getClasslinkStudentsResult =
          await this.classlinkStudentRepository.getAllByClassSourcedId(
            appId,
            accessToken,
            classlinkClass.sourcedId,
          )
        if (getClasslinkStudentsResult.hasError) {
          return unknownRuntimeError(
            `Claslink Studnet API returns Error: ${getClasslinkStudentsResult.error} appId: ${appId}, accessToken: ${accessToken}}`,
          )
        }
        console.log(
          JSON.stringify({
            'Classlink API Result': 'Class',
            classlinkClassSourcedId: classlinkClass.sourcedId,
            classlinkSchoolSourcedId: classlinkSchool.sourcedId,
            districtId: district.id,
            tenantId: classlinkTenantId,
            appId,
            accessToken,
            getClasslinkStudentsResult: getClasslinkStudentsResult.value,
          }),
        )

        for (const classlinkStudent of getClasslinkStudentsResult.value) {
          if (classlinkStudent.status !== 'active') {
            continue
          }
          if (
            !allSourceLmsStudents.find(
              (e) => classlinkStudent.sourcedId === e.studentLMSId,
            )
          ) {
            // Take Unique by sourced Id
            allSourceLmsStudents.push({
              role: 'student',
              studentLMSId: classlinkStudent.sourcedId,
              nickName: `${classlinkStudent.givenName} ${classlinkStudent.familyName}`,
              email: classlinkStudent.email,
              isDeactivated: false,
              classlinkTenantId,
            })
          }
          allSourceLmsStudentGroupStudents.push({
            studentLMSId: classlinkStudent.sourcedId,
            studentGroupLmsId: classlinkClass.sourcedId,
          })
        }
        if (classlinkClass.status === 'active') {
          allSourceLmsStudentGroups.push({
            studentGroupLmsId: classlinkClass.sourcedId,
            organizationLMSId: classlinkClass.schoolSourcedId,
            grade: classlinkClass.grade,
            name: classlinkClass.title,
            classlinkTenantId,
          })
        }
      }

      for (const classLinkTeacherOrSchoolAdministrator of [
        ...getClasslinkTeachersResult.value,
        ...getClasslinkSchoolAdministratorsResult.value,
      ]) {
        if (classLinkTeacherOrSchoolAdministrator.status !== 'active') {
          continue
        }
        if (
          !allSourceLmsTeachers.find(
            (e) =>
              classLinkTeacherOrSchoolAdministrator.sourcedId ===
              e.teacherLMSId,
          )
        ) {
          // Take Unique by sourced Id
          allSourceLmsTeachers.push({
            role: 'teacher',
            teacherLMSId: classLinkTeacherOrSchoolAdministrator.sourcedId,
            firstName: classLinkTeacherOrSchoolAdministrator.givenName,
            lastName: classLinkTeacherOrSchoolAdministrator.familyName,
            email: classLinkTeacherOrSchoolAdministrator.email,
            isDeactivated: false,
            classlinkTenantId,
          })
        }
        allSourceLmsTeacherOrganizations.push({
          teacherLMSId: classLinkTeacherOrSchoolAdministrator.sourcedId,
          organizationLMSId: classlinkSchool.sourcedId,
        })
      }
      if (classlinkSchool.status === 'active') {
        allSourceLmsOrganizations.push({
          districtId: district.id,
          organizationLMSId: classlinkSchool.sourcedId,
          name: classlinkSchool.name,
          classlinkTenantId,
        })
      }
    }
    // Map Distrct Administrators as Teachers
    for (const classlinkDistrictAdministrator of getClasslinkDistrictAdministratorsResult.value) {
      if (classlinkDistrictAdministrator.status !== 'active') {
        continue
      }
      if (
        !allSourceLmsTeachers.find(
          (e) => classlinkDistrictAdministrator.sourcedId === e.teacherLMSId,
        )
      ) {
        // Take Unique by sourced Id
        allSourceLmsTeachers.push({
          role: 'teacher',
          teacherLMSId: classlinkDistrictAdministrator.sourcedId,
          firstName: classlinkDistrictAdministrator.givenName,
          lastName: classlinkDistrictAdministrator.familyName,
          email: classlinkDistrictAdministrator.email,
          isDeactivated: false,
          classlinkTenantId,
        })
      }
      for (const sourceLmsOrganization of allSourceLmsOrganizations) {
        allSourceLmsTeacherOrganizations.push({
          teacherLMSId: classlinkDistrictAdministrator.sourcedId,
          organizationLMSId: sourceLmsOrganization.organizationLMSId,
        })
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

export class ClasslinkRosterSyncUseCase {
  constructor(
    private classlinkDistrictRepository: IClasslinkDistrictRepository,
    private classlinkSchoolRepository: IClasslinkSchoolRepository,
    private classlinkClassRepository: IClasslinkClassRepository,
    private classlinkDistrictAdministratorRepository: IClasslinkDistrictAdministratorRepository,
    private classlinkSchoolAdministratorRepository: IClasslinkSchoolAdministratorRepository,
    private classlinkTeacherRepository: IClasslinkTeacherRepository,
    private classlinkStudentRepository: IClasslinkStudentRepository,
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

  async run(
    requestedUser: User,
    districtId: string,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'UnauthorizedError'>>
  > {
    console.log('ClasslinkRosterSyncUseCase start')

    const requestClasslinkApisAndMapToSourceLmsEntites =
      new RequestClasslinkApisAndMapToSourceLmsEntites(
        this.classlinkDistrictRepository,
        this.classlinkSchoolRepository,
        this.classlinkClassRepository,
        this.classlinkDistrictAdministratorRepository,
        this.classlinkSchoolAdministratorRepository,
        this.classlinkTeacherRepository,
        this.classlinkStudentRepository,
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
      requestClasslinkApisAndMapToSourceLmsEntites.run,
    ).run(requestedUser, districtId, 'classlink')

    if (rosterSyncResult.hasError) {
      return rosterSyncResult
    }

    console.log(`Finished ClasslinkRosterSyncUseCase`)

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
