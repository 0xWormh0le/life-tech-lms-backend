import 'jest-extended'

import { E, Errorable } from '../../../../../domain/usecases/shared/Errors'
import { StoreAllCodexEntities } from './StoreAllCodexEntities'
import { Administrator } from '../entities/Administrator'
import { Teacher } from '../entities/Teacher'
import { Student } from '../entities/Student'
import { Organization } from '../entities/Organization'
import { StudentGroup } from '../entities/StudentGroup'
import { AdministratorDistrict } from '../entities/AdministratorDistrict'
import { TeacherOrganization } from '../entities/TeacherOrganization'
import { StudentStudentGroup } from '../entities/StudentGroupStudent'
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

describe('StoreAllCodexEntities', () => {
  test('success', async () => {
    const organizationRepository = createSuccessMockOrganizationRepository()
    const studentGroupRepository = createSuccessMockStudentGroupRepository()
    const userRepository = createSuccessMockUserRepository()
    const administratorRepository = createSuccessMockAdministratorRepository()
    const teacherRepository = createSuccessMockTeacherRepository()
    const studentRepository = createSuccessMockStudentRepository()
    const administratorDistrictRepository = createSuccessMockAdministratorDistrictRepository()
    const teacherOrganizationRepository = createSuccessMockTeacherOrganizationRepository()
    const studentStudentGroupRepository = createSuccessMockStudentStudentGroupRepository()
    const useCase = new StoreAllCodexEntities(
      organizationRepository,
      studentGroupRepository,
      userRepository,
      administratorRepository,
      teacherRepository,
      studentRepository,
      administratorDistrictRepository,
      teacherOrganizationRepository,
      studentStudentGroupRepository,
    )
    const usersToCreate: User[] = [
      {
        id: 'userId1',
        role: 'teacher',
        loginId: 'loginId1',
        email: 'email1',
        isDeactivated: false,
      },
      {
        id: 'userId2',
        role: 'teacher',
        loginId: 'loginId2',
        email: 'email2',
        isDeactivated: false,
      },
    ]
    const usersToUpdate: User[] = [
      {
        id: 'userId3',
        role: 'teacher',
        loginId: 'loginId3',
        email: 'email3',
        isDeactivated: false,
      },
      {
        id: 'userId4',
        role: 'teacher',
        loginId: 'loginId4',
        email: 'email4',
        isDeactivated: false,
      },
    ]

    const usersToDelete: { id: string }[] = [{ id: 'userId5' }, { id: 'userId6' }]
    const administratorsToCreate: Administrator[] = [
      {
        id: 'administratorId1',
        userId: 'userId1',
        firstName: 'firstName1',
        lastName: 'lastName1',
        administratorLMSId: 'administratorLMSId1',
        classlinkTenantId: 'classlinkTenantId1',
        isDeactivated: false,
      },
      {
        id: 'administratorId2',
        userId: 'userId2',
        firstName: 'firstName2',
        lastName: 'lastName2',
        administratorLMSId: 'administratorLMSId2',
        classlinkTenantId: 'classlinkTenantId2',
        isDeactivated: false,
      },
    ]
    const administratorsToUpdate: Administrator[] = [
      {
        id: 'administratorId3',
        userId: 'userId3',
        firstName: 'firstName3',
        lastName: 'lastName3',
        administratorLMSId: 'administratorLMSId3',
        classlinkTenantId: 'classlinkTenantId3',
        isDeactivated: false,
      },
      {
        id: 'administratorId4',
        userId: 'userId4',
        firstName: 'firstName4',
        lastName: 'lastName4',
        administratorLMSId: 'administratorLMSId4',
        classlinkTenantId: 'classlinkTenantId4',
        isDeactivated: false,
      },
    ]

    const administratorsToDelete: { id: string }[] = [{ id: 'administratorId5' }, { id: 'administratorId6' }]
    const teachersToCreate: Teacher[] = [
      {
        id: 'teacherId1',
        userId: 'userId1',
        firstName: 'firstName1',
        lastName: 'lastName1',
        teacherLMSId: 'teacherLMSId1',
        classlinkTenantId: 'classlinkTenantId1',
        schoolAdministratorsName: 'schoolAdministratorsName1',
        isDeactivated: false,
      },
      {
        id: 'teacherId2',
        userId: 'userId2',
        firstName: 'firstName2',
        lastName: 'lastName2',
        teacherLMSId: 'teacherLMSId2',
        classlinkTenantId: 'classlinkTenantId2',
        schoolAdministratorsName: 'schoolAdministratorsName2',
        isDeactivated: false,
      },
    ]
    const teachersToUpdate: Teacher[] = [
      {
        id: 'teacherId3',
        userId: 'userId3',
        firstName: 'firstName3',
        lastName: 'lastName3',
        teacherLMSId: 'teacherLMSId3',
        classlinkTenantId: 'classlinkTenantId3',
        schoolAdministratorsName: 'schoolAdministratorsName3',
        isDeactivated: false,
      },
      {
        id: 'teacherId4',
        userId: 'userId4',
        firstName: 'firstName4',
        lastName: 'lastName4',
        teacherLMSId: 'teacherLMSId4',
        classlinkTenantId: 'classlinkTenantId4',
        schoolAdministratorsName: 'schoolAdministratorsName4',
        isDeactivated: false,
      },
    ]
    const teachersToDelete: { id: string }[] = [{ id: 'teacherId5' }, { id: 'teacherId6' }]
    const studentsToCreate: Student[] = [
      {
        id: 'studentId1',
        nickName: 'nickName1',
        userId: 'userId1',
        studentLMSId: 'studentLMSId1',
        classlinkTenantId: 'classlinkTenantId1',
        isDeactivated: false,
      },
      {
        id: 'studentId2',
        nickName: 'nickName2',
        userId: 'userId2',
        studentLMSId: 'studentLMSId2',
        classlinkTenantId: 'classlinkTenantId2',
        isDeactivated: false,
      },
    ]
    const studentsToUpdate: Student[] = [
      {
        id: 'studentId3',
        nickName: 'nickName3',
        userId: 'userId3',
        studentLMSId: 'studentLMSId3',
        classlinkTenantId: 'classlinkTenantId3',
        isDeactivated: false,
      },
      {
        id: 'studentId4',
        nickName: 'nickName4',
        userId: 'userId4',
        studentLMSId: 'studentLMSId4',
        classlinkTenantId: 'classlinkTenantId4',
        isDeactivated: false,
      },
    ]
    const studentsToDelete: { id: string }[] = [{ id: 'studentId5' }, { id: 'studentId6' }]
    const organizationsToCreate: Organization[] = [
      {
        id: 'organizationId1',
        name: 'name1',
        districtId: 'districtId',
        organizationLMSId: 'organizationLMSId1',
        classlinkTenantId: 'classlinkTenantId1',
      },
      {
        id: 'organizationId2',
        name: 'name2',
        districtId: 'districtId',
        organizationLMSId: 'organizationLMSId2',
        classlinkTenantId: 'classlinkTenantId2',
      },
    ]
    const organizationsToUpdate: Organization[] = [
      {
        id: 'organizationId3',
        name: 'name3',
        districtId: 'districtId',
        organizationLMSId: 'organizationLMSId3',
        classlinkTenantId: 'classlinkTenantId3',
      },
      {
        id: 'organizationId4',
        name: 'name4',
        districtId: 'districtId',
        organizationLMSId: 'organizationLMSId4',
        classlinkTenantId: 'classlinkTenantId4',
      },
    ]
    const organizationsToDelete: { id: string }[] = [{ id: 'organizationId5' }, { id: 'organizationId6' }]
    const studentGroupsToCreate: StudentGroup[] = [
      {
        id: 'studentGroupId1',
        organizationId: 'organizationId1',
        name: 'name1',
        grade: 'basic1',
        studentGroupLmsId: 'studentGroupLmsId1',
        classlinkTenantId: 'classlinkTenantId1',
      },
      {
        id: 'studentGroupId2',
        organizationId: 'organizationId2',
        name: 'name2',
        grade: 'basic2',
        studentGroupLmsId: 'studentGroupLmsId2',
        classlinkTenantId: 'classlinkTenantId2',
      },
    ]
    const studentGroupsToUpdate: StudentGroup[] = [
      {
        id: 'studentGroupId3',
        organizationId: 'organizationId3',
        name: 'name3',
        grade: 'basic3',
        studentGroupLmsId: 'studentGroupLmsId3',
        classlinkTenantId: 'classlinkTenantId3',
      },
      {
        id: 'studentGroupId4',
        organizationId: 'organizationId4',
        name: 'name4',
        grade: 'basic4',
        studentGroupLmsId: 'studentGroupLmsId4',
        classlinkTenantId: 'classlinkTenantId4',
      },
    ]
    const studentGroupsToDelete: { id: string }[] = [{ id: 'studentGroupId5' }, { id: 'studentGroupId6' }]
    const administratorDistrictsToCreate: AdministratorDistrict[] = [
      {
        administratorId: 'administratorId1',
        districtId: 'districtId1',
      },
      {
        administratorId: 'administratorId2',
        districtId: 'districtId2',
      },
    ]
    const administratorDistrictsToDelete: AdministratorDistrict[] = [
      {
        administratorId: 'administratorId3',
        districtId: 'districtId3',
      },
      {
        administratorId: 'administratorId4',
        districtId: 'districtId4',
      },
    ]
    const teacherOrganizationsToCreate: TeacherOrganization[] = [
      {
        teacherId: 'teacherId1',
        organizationId: 'organizationId1',
      },
      {
        teacherId: 'teacherId2',
        organizationId: 'organizationId2',
      },
    ]
    const teacherOrganizationsToDelete: TeacherOrganization[] = [
      {
        teacherId: 'teacherId3',
        organizationId: 'organizationId3',
      },
      {
        teacherId: 'teacherId4',
        organizationId: 'organizationId4',
      },
    ]
    const studentStudentGroupsToCreate: StudentStudentGroup[] = [
      {
        studentId: 'studentId1',
        studentGroupId: 'studentGroupId1',
      },
      {
        studentId: 'studentId2',
        studentGroupId: 'studentGroupId2',
      },
    ]
    const studentStudentGroupsToDelete: StudentStudentGroup[] = [
      {
        studentId: 'studentId3',
        studentGroupId: 'studentGroupId3',
      },
      {
        studentId: 'studentId4',
        studentGroupId: 'studentGroupId4',
      },
    ]

    const res = await useCase.run(
      usersToCreate,
      usersToUpdate,
      usersToDelete,
      administratorsToCreate,
      administratorsToUpdate,
      administratorsToDelete,
      teachersToCreate,
      teachersToUpdate,
      teachersToDelete,
      studentsToCreate,
      studentsToUpdate,
      studentsToDelete,
      organizationsToCreate,
      organizationsToUpdate,
      organizationsToDelete,
      studentGroupsToCreate,
      studentGroupsToUpdate,
      studentGroupsToDelete,
      administratorDistrictsToCreate,
      administratorDistrictsToDelete,
      teacherOrganizationsToCreate,
      teacherOrganizationsToDelete,
      studentStudentGroupsToCreate,
      studentStudentGroupsToDelete,
    )

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toBeUndefined()

    expect(organizationRepository.createOrganizations.mock.calls).toEqual([[organizationsToCreate]])
    expect(organizationRepository.updateOrganizations.mock.calls).toEqual([[organizationsToUpdate]])
    expect(organizationRepository.deleteOrganizations.mock.calls).toEqual([[organizationsToDelete.map((e) => e.id)]])
    expect(studentGroupRepository.createStudentGroups.mock.calls).toEqual([[studentGroupsToCreate]])
    expect(studentGroupRepository.updateStudentGroups.mock.calls).toEqual([[studentGroupsToUpdate]])
    expect(studentGroupRepository.deleteStudentGroups.mock.calls).toEqual([[studentGroupsToDelete.map((e) => e.id)]])
    expect(userRepository.createUsers.mock.calls).toEqual([[usersToCreate]])
    expect(userRepository.updateUsers.mock.calls).toEqual([[usersToUpdate]])
    expect(userRepository.deleteUsers.mock.calls).toEqual([[usersToDelete.map((e) => e.id)]])
    expect(administratorRepository.createAdministrators.mock.calls).toEqual([[administratorsToCreate]])
    expect(administratorRepository.updateAdministrators.mock.calls).toEqual([[administratorsToUpdate]])
    expect(administratorRepository.deleteAdministrators.mock.calls).toEqual([[administratorsToDelete.map((e) => e.id)]])
    expect(teacherRepository.createTeachers.mock.calls).toEqual([[teachersToCreate]])
    expect(teacherRepository.updateTeachers.mock.calls).toEqual([[teachersToUpdate]])
    expect(teacherRepository.deleteTeachers.mock.calls).toEqual([[teachersToDelete.map((e) => e.id)]])
    expect(studentRepository.createStudents.mock.calls).toEqual([[studentsToCreate]])
    expect(studentRepository.updateStudents.mock.calls).toEqual([[studentsToUpdate]])
    expect(studentRepository.deleteStudents.mock.calls).toEqual([[studentsToDelete.map((e) => e.id)]])
    expect(administratorDistrictRepository.createAdministratorDistricts.mock.calls).toEqual([[administratorDistrictsToCreate]])
    expect(administratorDistrictRepository.deleteAdministratorDistricts.mock.calls).toEqual([[administratorDistrictsToDelete]])
    expect(teacherOrganizationRepository.createTeacherOrganizations.mock.calls).toEqual([[teacherOrganizationsToCreate]])
    expect(teacherOrganizationRepository.deleteTeacherOrganizations.mock.calls).toEqual([[teacherOrganizationsToDelete]])
    expect(studentStudentGroupRepository.createStudentGroupStudents.mock.calls).toEqual([[studentStudentGroupsToCreate]])
    expect(studentStudentGroupRepository.deleteStudentGroupStudents.mock.calls).toEqual([[studentStudentGroupsToDelete]])

    //
    // Check Invocation Order
    //
    // Dependent entities must be deleted first
    expect(organizationRepository.deleteOrganizations).toHaveBeenCalledAfter(studentGroupRepository.deleteStudentGroups as jest.Mock)
    expect(organizationRepository.deleteOrganizations).toHaveBeenCalledAfter(teacherOrganizationRepository.deleteTeacherOrganizations as jest.Mock)
    expect(studentGroupRepository.deleteStudentGroups).toHaveBeenCalledAfter(studentStudentGroupRepository.deleteStudentGroupStudents as jest.Mock)
    expect(userRepository.deleteUsers).toHaveBeenCalledAfter(administratorRepository.deleteAdministrators as jest.Mock)
    expect(userRepository.deleteUsers).toHaveBeenCalledAfter(teacherRepository.deleteTeachers as jest.Mock)
    expect(userRepository.deleteUsers).toHaveBeenCalledAfter(studentRepository.deleteStudents as jest.Mock)
    expect(administratorRepository.deleteAdministrators).toHaveBeenCalledAfter(administratorDistrictRepository.deleteAdministratorDistricts as jest.Mock)
    expect(teacherRepository.deleteTeachers).toHaveBeenCalledAfter(teacherOrganizationRepository.deleteTeacherOrganizations as jest.Mock)
    expect(studentRepository.deleteStudents).toHaveBeenCalledAfter(studentStudentGroupRepository.deleteStudentGroupStudents as jest.Mock)

    // The deletion must be prior to the creation
    expect(organizationRepository.deleteOrganizations).toHaveBeenCalledBefore(organizationRepository.createOrganizations as jest.Mock)
    expect(organizationRepository.deleteOrganizations).toHaveBeenCalledBefore(organizationRepository.createOrganizations as jest.Mock)
    expect(studentGroupRepository.deleteStudentGroups).toHaveBeenCalledBefore(studentGroupRepository.createStudentGroups as jest.Mock)
    expect(userRepository.deleteUsers).toHaveBeenCalledBefore(userRepository.createUsers as jest.Mock)
    expect(userRepository.deleteUsers).toHaveBeenCalledBefore(userRepository.createUsers as jest.Mock)
    expect(userRepository.deleteUsers).toHaveBeenCalledBefore(userRepository.createUsers as jest.Mock)
    expect(administratorRepository.deleteAdministrators).toHaveBeenCalledBefore(administratorRepository.createAdministrators as jest.Mock)
    expect(teacherRepository.deleteTeachers).toHaveBeenCalledBefore(teacherRepository.createTeachers as jest.Mock)
    expect(studentRepository.deleteStudents).toHaveBeenCalledBefore(studentRepository.createStudents as jest.Mock)

    // Dependent entities must be created after
    expect(organizationRepository.createOrganizations).toHaveBeenCalledBefore(studentGroupRepository.createStudentGroups as jest.Mock)
    expect(organizationRepository.createOrganizations).toHaveBeenCalledBefore(teacherOrganizationRepository.createTeacherOrganizations as jest.Mock)
    expect(studentGroupRepository.createStudentGroups).toHaveBeenCalledBefore(studentStudentGroupRepository.createStudentGroupStudents as jest.Mock)
    expect(userRepository.createUsers).toHaveBeenCalledBefore(administratorRepository.createAdministrators as jest.Mock)
    expect(userRepository.createUsers).toHaveBeenCalledBefore(teacherRepository.createTeachers as jest.Mock)
    expect(userRepository.createUsers).toHaveBeenCalledBefore(studentRepository.createStudents as jest.Mock)
    expect(administratorRepository.createAdministrators).toHaveBeenCalledBefore(administratorDistrictRepository.createAdministratorDistricts as jest.Mock)
    expect(teacherRepository.createTeachers).toHaveBeenCalledBefore(teacherOrganizationRepository.createTeacherOrganizations as jest.Mock)
    expect(studentRepository.createStudents).toHaveBeenCalledBefore(studentStudentGroupRepository.createStudentGroupStudents as jest.Mock)

    expect(organizationRepository.updateOrganizations).toHaveBeenCalledBefore(studentGroupRepository.updateStudentGroups as jest.Mock)
    expect(userRepository.updateUsers).toHaveBeenCalledBefore(administratorRepository.updateAdministrators as jest.Mock)
    expect(userRepository.updateUsers).toHaveBeenCalledBefore(teacherRepository.updateTeachers as jest.Mock)
    expect(userRepository.updateUsers).toHaveBeenCalledBefore(studentRepository.updateStudents as jest.Mock)
  })

  const createSuccessMockOrganizationRepository = () => {
    const repository: Pick<IOrganizationRepository, 'createOrganizations' | 'updateOrganizations' | 'deleteOrganizations'> = {
      createOrganizations: async (_organizations: Organization[]): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
      updateOrganizations: async (_organizations: Organization[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
      deleteOrganizations: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      createOrganizations: jest.fn((organizations: Organization[]) => repository.createOrganizations(organizations)),
      updateOrganizations: jest.fn((organizations: Organization[]) => repository.updateOrganizations(organizations)),
      deleteOrganizations: jest.fn((ids: string[]) => repository.deleteOrganizations(ids)),
    }
  }
  const createSuccessMockStudentGroupRepository = () => {
    const repository: Pick<IStudentGroupRepository, 'createStudentGroups' | 'updateStudentGroups' | 'deleteStudentGroups'> = {
      createStudentGroups: async (_studentGroups: StudentGroup[]): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: [] }
      },
      updateStudentGroups: async (_studentGroups: StudentGroup[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteStudentGroups: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
    }

    return {
      createStudentGroups: jest.fn((studentGroups: StudentGroup[]) => repository.createStudentGroups(studentGroups)),
      updateStudentGroups: jest.fn((studentGroups: StudentGroup[]) => repository.updateStudentGroups(studentGroups)),
      deleteStudentGroups: jest.fn((ids: string[]) => repository.deleteStudentGroups(ids)),
    }
  }
  const createSuccessMockUserRepository = () => {
    const repository: Pick<IUserRepository, 'createUsers' | 'updateUsers' | 'deleteUsers'> = {
      createUsers: async (_users: User[]): Promise<Errorable<User[], E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: [] }
      },
      updateUsers: async (_users: User[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteUsers: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
    }

    return {
      createUsers: jest.fn((users: User[]) => repository.createUsers(users)),
      updateUsers: jest.fn((users: User[]) => repository.updateUsers(users)),
      deleteUsers: jest.fn((ids: string[]) => repository.deleteUsers(ids)),
    }
  }
  const createSuccessMockAdministratorRepository = () => {
    const repository: Pick<IAdministratorRepository, 'createAdministrators' | 'updateAdministrators' | 'deleteAdministrators'> = {
      createAdministrators: async (_administrators: Administrator[]): Promise<Errorable<Administrator[], E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: [] }
      },
      updateAdministrators: async (_administrators: Administrator[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteAdministrators: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
    }

    return {
      createAdministrators: jest.fn((administrators: Administrator[]) => repository.createAdministrators(administrators)),
      updateAdministrators: jest.fn((administrators: Administrator[]) => repository.updateAdministrators(administrators)),
      deleteAdministrators: jest.fn((ids: string[]) => repository.deleteAdministrators(ids)),
    }
  }
  const createSuccessMockTeacherRepository = () => {
    const repository: Pick<ITeacherRepository, 'createTeachers' | 'updateTeachers' | 'deleteTeachers'> = {
      createTeachers: async (_teachers: Teacher[]): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: [] }
      },
      updateTeachers: async (_teachers: Teacher[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteTeachers: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
    }

    return {
      createTeachers: jest.fn((teachers: Teacher[]) => repository.createTeachers(teachers)),
      updateTeachers: jest.fn((teachers: Teacher[]) => repository.updateTeachers(teachers)),
      deleteTeachers: jest.fn((ids: string[]) => repository.deleteTeachers(ids)),
    }
  }
  const createSuccessMockStudentRepository = () => {
    const repository: Pick<IStudentRepository, 'createStudents' | 'updateStudents' | 'deleteStudents'> = {
      createStudents: async (_students: Student[]): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: [] }
      },
      updateStudents: async (_students: Student[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteStudents: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
    }

    return {
      createStudents: jest.fn((students: Student[]) => repository.createStudents(students)),
      updateStudents: jest.fn((students: Student[]) => repository.updateStudents(students)),
      deleteStudents: jest.fn((ids: string[]) => repository.deleteStudents(ids)),
    }
  }
  const createSuccessMockAdministratorDistrictRepository = () => {
    const repository: Pick<IAdministratorDistrictRepository, 'createAdministratorDistricts' | 'deleteAdministratorDistricts'> = {
      createAdministratorDistricts: async (_administratorDistricts: AdministratorDistrict[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteAdministratorDistricts: async (_administratorDistricts: AdministratorDistrict[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
    }

    return {
      createAdministratorDistricts: jest.fn((administratorDistricts: AdministratorDistrict[]) =>
        repository.createAdministratorDistricts(administratorDistricts),
      ),
      deleteAdministratorDistricts: jest.fn((administratorDistricts: AdministratorDistrict[]) =>
        repository.deleteAdministratorDistricts(administratorDistricts),
      ),
    }
  }
  const createSuccessMockTeacherOrganizationRepository = () => {
    const repository: Pick<ITeacherOrganizationRepository, 'createTeacherOrganizations' | 'deleteTeacherOrganizations'> = {
      createTeacherOrganizations: async (_teacherOrganizations: TeacherOrganization[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteTeacherOrganizations: async (_teacherOrganizations: TeacherOrganization[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
    }

    return {
      createTeacherOrganizations: jest.fn((teacherOrganizations: TeacherOrganization[]) => repository.createTeacherOrganizations(teacherOrganizations)),
      deleteTeacherOrganizations: jest.fn((teacherOrganizations: TeacherOrganization[]) => repository.deleteTeacherOrganizations(teacherOrganizations)),
    }
  }
  const createSuccessMockStudentStudentGroupRepository = () => {
    const repository: Pick<IStudentGroupStudentRepository, 'createStudentGroupStudents' | 'deleteStudentGroupStudents'> = {
      createStudentGroupStudents: async (_studentStudentGroups: StudentStudentGroup[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteStudentGroupStudents: async (_studentStudentGroups: StudentStudentGroup[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
    }

    return {
      createStudentGroupStudents: jest.fn((studentStudentGroups: StudentStudentGroup[]) => repository.createStudentGroupStudents(studentStudentGroups)),
      deleteStudentGroupStudents: jest.fn((studentStudentGroups: StudentStudentGroup[]) => repository.deleteStudentGroupStudents(studentStudentGroups)),
    }
  }
})
