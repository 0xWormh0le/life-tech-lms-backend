import { Administrator } from '../entities/Administrator'
import { Teacher } from '../entities/Teacher'
import { Student } from '../entities/Student'
import { Organization } from '../entities/Organization'
import { StudentGroup } from '../entities/StudentGroup'
import { AdministratorDistrict } from '../entities/AdministratorDistrict'
import { TeacherOrganization } from '../entities/TeacherOrganization'
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
import { User } from '../entities/User'
import { StudentStudentGroup } from '../entities/StudentGroupStudent'
import { E, Errorable } from '../../../../../domain/usecases/shared/Errors'

export class StoreAllCodexEntities {
  constructor(
    private organizationRepository: Pick<
      IOrganizationRepository,
      'createOrganizations' | 'updateOrganizations' | 'deleteOrganizations'
    >,
    private studentGroupRepository: Pick<
      IStudentGroupRepository,
      'createStudentGroups' | 'updateStudentGroups' | 'deleteStudentGroups'
    >,
    private userRepository: Pick<
      IUserRepository,
      'createUsers' | 'updateUsers' | 'deleteUsers'
    >,
    private administratorRepository: Pick<
      IAdministratorRepository,
      'createAdministrators' | 'updateAdministrators' | 'deleteAdministrators'
    >,
    private teacherRepository: Pick<
      ITeacherRepository,
      'createTeachers' | 'updateTeachers' | 'deleteTeachers'
    >,
    private studentRepository: Pick<
      IStudentRepository,
      'createStudents' | 'updateStudents' | 'deleteStudents'
    >,
    private administratorDistrictRepository: Pick<
      IAdministratorDistrictRepository,
      'createAdministratorDistricts' | 'deleteAdministratorDistricts'
    >,
    private teacherOrganizationRepository: Pick<
      ITeacherOrganizationRepository,
      'createTeacherOrganizations' | 'deleteTeacherOrganizations'
    >,
    private studentStudentGroupRepository: Pick<
      IStudentGroupStudentRepository,
      'createStudentGroupStudents' | 'deleteStudentGroupStudents'
    >,
  ) {}

  public run = async (
    usersToCreate: User[],
    usersToUpdate: User[],
    usersToDelete: { id: string }[],
    administratorsToCreate: Administrator[],
    administratorsToUpdate: Administrator[],
    administratorsToDelete: { id: string }[],
    teachersToCreate: Teacher[],
    teachersToUpdate: Teacher[],
    teachersToDelete: { id: string }[],
    studentsToCreate: Student[],
    studentsToUpdate: Student[],
    studentsToDelete: { id: string }[],
    organizationsToCreate: Organization[],
    organizationsToUpdate: Organization[],
    organizationsToDelete: { id: string }[],
    studentGroupsToCreate: StudentGroup[],
    studentGroupsToUpdate: StudentGroup[],
    studentGroupsToDelete: { id: string }[],
    administratorDistrictsToCreate: AdministratorDistrict[],
    administratorDistrictsToDelete: AdministratorDistrict[],
    teacherOrganizationsToCreate: TeacherOrganization[],
    teacherOrganizationsToDelete: TeacherOrganization[],
    studentStudentGroupsToCreate: StudentStudentGroup[],
    studentStudentGroupsToDelete: StudentStudentGroup[],
  ): Promise<
    Errorable<
      void,
      E<'UnknownRuntimeError'> | E<'AlreadyExistError'> | E<'NotFoundError'>
    >
  > => {
    // Delete
    const resDeleteAdministratorDistrict =
      await this.administratorDistrictRepository.deleteAdministratorDistricts(
        administratorDistrictsToDelete,
      )

    if (resDeleteAdministratorDistrict.hasError) {
      return resDeleteAdministratorDistrict
    }

    const resDeleteTeacherOrganization =
      await this.teacherOrganizationRepository.deleteTeacherOrganizations(
        teacherOrganizationsToDelete,
      )

    if (resDeleteTeacherOrganization.hasError) {
      return resDeleteTeacherOrganization
    }

    const resDeleteStudentStudentGroup =
      await this.studentStudentGroupRepository.deleteStudentGroupStudents(
        studentStudentGroupsToDelete,
      )

    if (resDeleteStudentStudentGroup.hasError) {
      return resDeleteStudentStudentGroup
    }

    const resDeleteStudentGroup =
      await this.studentGroupRepository.deleteStudentGroups(
        studentGroupsToDelete.map((e) => e.id),
      )

    if (resDeleteStudentGroup.hasError) {
      return resDeleteStudentGroup
    }

    const resDeleteOrganization =
      await this.organizationRepository.deleteOrganizations(
        organizationsToDelete.map((e) => e.id),
      )

    if (resDeleteOrganization.hasError) {
      return resDeleteOrganization
    }

    const resDeleteAdministrator =
      await this.administratorRepository.deleteAdministrators(
        administratorsToDelete.map((e) => e.id),
      )

    if (resDeleteAdministrator.hasError) {
      return resDeleteAdministrator
    }

    const resDeleteTeacher = await this.teacherRepository.deleteTeachers(
      teachersToDelete.map((e) => e.id),
    )

    if (resDeleteTeacher.hasError) {
      return resDeleteTeacher
    }

    const resDeleteStudent = await this.studentRepository.deleteStudents(
      studentsToDelete.map((e) => e.id),
    )

    if (resDeleteStudent.hasError) {
      return resDeleteStudent
    }

    const resDeleteUser = await this.userRepository.deleteUsers(
      usersToDelete.map((e) => e.id),
    )

    if (resDeleteUser.hasError) {
      return resDeleteUser
    }

    // Update
    const resUpdateOrganization =
      await this.organizationRepository.updateOrganizations(
        organizationsToUpdate,
      )

    if (resUpdateOrganization.hasError) {
      return resUpdateOrganization
    }

    const resUpdateStudentGroup =
      await this.studentGroupRepository.updateStudentGroups(
        studentGroupsToUpdate,
      )

    if (resUpdateStudentGroup.hasError) {
      return resUpdateStudentGroup
    }

    const resUpdateUser = await this.userRepository.updateUsers(usersToUpdate)

    if (resUpdateUser.hasError) {
      return resUpdateUser
    }

    const resUpdateAdministrator =
      await this.administratorRepository.updateAdministrators(
        administratorsToUpdate,
      )

    if (resUpdateAdministrator.hasError) {
      return resUpdateAdministrator
    }

    const resUpdateTeacher = await this.teacherRepository.updateTeachers(
      teachersToUpdate,
    )

    if (resUpdateTeacher.hasError) {
      return resUpdateTeacher
    }

    const resUpdateStudent = await this.studentRepository.updateStudents(
      studentsToUpdate,
    )

    if (resUpdateStudent.hasError) {
      return resUpdateStudent
    }

    // Create

    const resCreateOrganization =
      await this.organizationRepository.createOrganizations(
        organizationsToCreate,
      )

    if (resCreateOrganization.hasError) {
      return resCreateOrganization
    }

    const resCreateStudentGroup =
      await this.studentGroupRepository.createStudentGroups(
        studentGroupsToCreate,
      )

    if (resCreateStudentGroup.hasError) {
      return resCreateStudentGroup
    }

    const resCreateUser = await this.userRepository.createUsers(usersToCreate)

    if (resCreateUser.hasError) {
      return resCreateUser
    }

    const resCreateAdministrator =
      await this.administratorRepository.createAdministrators(
        administratorsToCreate,
      )

    if (resCreateAdministrator.hasError) {
      return resCreateAdministrator
    }

    const resCreateTeacher = await this.teacherRepository.createTeachers(
      teachersToCreate,
    )

    if (resCreateTeacher.hasError) {
      return resCreateTeacher
    }

    const resCreateStudent = await this.studentRepository.createStudents(
      studentsToCreate,
    )

    if (resCreateStudent.hasError) {
      return resCreateStudent
    }

    const resCreateAdministratorDistrict =
      await this.administratorDistrictRepository.createAdministratorDistricts(
        administratorDistrictsToCreate,
      )

    if (resCreateAdministratorDistrict.hasError) {
      return resCreateAdministratorDistrict
    }

    const resCreateTeacherOrganization =
      await this.teacherOrganizationRepository.createTeacherOrganizations(
        teacherOrganizationsToCreate,
      )

    if (resCreateTeacherOrganization.hasError) {
      return resCreateTeacherOrganization
    }

    const resCreateStudentStudentGroup =
      await this.studentStudentGroupRepository.createStudentGroupStudents(
        studentStudentGroupsToCreate,
      )

    if (resCreateStudentStudentGroup.hasError) {
      return resCreateStudentStudentGroup
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
