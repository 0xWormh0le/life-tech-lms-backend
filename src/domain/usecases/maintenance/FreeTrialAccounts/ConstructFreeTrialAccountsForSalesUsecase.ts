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
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { StudentGroupPackageAssignment } from '../../../entities/codex-v2/StudentGroupPackageAssignment'
import { DistrictPurchasedPackage } from '../../../entities/codex-v2/DistrictPurchasedPackage'

export interface DistrictRepository {
  findByName(
    name: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>>
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(district: District): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface OrganizationRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    organization: Organization,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface StudentGroupRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    studentGroup: StudentGroup,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface StudentGroupRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    studentGroup: StudentGroup,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface StudentGroupPackageAssignmentRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    studentGroupPackageAssignment: StudentGroupPackageAssignment,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DistrictPurchasedPackageRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    districtPurchasedPackage: DistrictPurchasedPackage,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface StudentGroupPackageAssignmentRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    studentGroupPackageAssignment: StudentGroupPackageAssignment,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface UserRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(user: User): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface HumanUserRepository {
  hashPassword(
    plainPassword: string,
  ): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    humanUser: HumanUser,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface TeacherRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(teacher: Teacher): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface StudentRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(student: Student): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface TeacherOrganizationAffiliationRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    teacherOrganizationAffiliation: TeacherOrganizationAffiliation,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface StudentStudentGroupAffiliationRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    studentStudentGroupAffiliation: StudentStudentGroupAffiliation,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface UserLessonStatusRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    userLessonStatus: UserLessonStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export class ConstructFreeTrialAccountsForSalesUsecase {
  constructor(
    private readonly districtRepository: DistrictRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly studentGroupRepository: StudentGroupRepository,
    private readonly districtPurchasedPackageRepository: DistrictPurchasedPackageRepository,
    private readonly studentGroupPackageAssignmentRepository: StudentGroupPackageAssignmentRepository,
    private readonly userRepository: UserRepository,
    private readonly humanUserRepository: HumanUserRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly studentRepository: StudentRepository,
    private readonly teacherOrganizationAffiliationRepository: TeacherOrganizationAffiliationRepository,
    private readonly studentStudentGroupAffiliationRepository: StudentStudentGroupAffiliationRepository,
    private readonly userLessonStatusRepository: UserLessonStatusRepository,
    private readonly datetimeRepository: DatetimeRepository,
  ) {}

  async run(input: {
    district: Pick<District, 'name' | 'stateId'>
    organization: Pick<Organization, 'name'>
    teachers: (Pick<Teacher, 'firstName' | 'lastName'> & {
      loginId: string
      password: string
    })[]
    studentGroups: (Pick<StudentGroup, 'name' | 'grade'> & {
      assignedPackages: Pick<
        StudentGroupPackageAssignment,
        'curriculumBrandId' | 'curriculumPackageId'
      >[]
    } & {
      students: (Pick<Student, 'nickName'> & {
        userLessonStatuses: Omit<UserLessonStatus, 'id' | 'userId'>[]
        loginId: string
        password: string
      })[]
    })[]
  }): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistsError'>>
  > {
    //
    // Check Input Errors
    //
    const duplicatedNameDistrictRes = await this.districtRepository.findByName(
      input.district.name,
    )

    if (duplicatedNameDistrictRes.hasError) {
      return duplicatedNameDistrictRes
    }

    if (duplicatedNameDistrictRes.value) {
      return failureErrorable(
        'AlreadyExistsError',
        `Specified name ${input.district.name} is already used.`,
      )
    }

    //
    // Create District
    //
    const issueIdForDistrictRes = await this.districtRepository.issueId()

    if (issueIdForDistrictRes.hasError) {
      return issueIdForDistrictRes
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const createDistrictRes = await this.districtRepository.create({
      id: issueIdForDistrictRes.value,
      name: input.district.name,
      stateId: input.district.stateId,
      lmsId: null,
      externalLmsDistrictId: null,
      enableRosterSync: false,
      createdAt: nowRes.value,
      createdUserId: null,
    })

    if (createDistrictRes.hasError) {
      return createDistrictRes
    }

    //
    // Create Organization
    //
    const issueIdForOrtganizationRes =
      await this.organizationRepository.issueId()

    if (issueIdForOrtganizationRes.hasError) {
      return issueIdForOrtganizationRes
    }

    const createOrganizationRes = await this.organizationRepository.create({
      id: issueIdForOrtganizationRes.value,
      districtId: issueIdForDistrictRes.value,
      name: input.organization.name,
      classlinkTenantId: null,
      externalLmsOrganizationId: null,
      createdAt: nowRes.value,
      updatedAt: nowRes.value,
    })

    if (createOrganizationRes.hasError) {
      return createOrganizationRes
    }
    //
    // Create Teachers
    //
    for (const teacher of input.teachers) {
      const issueIdForUserRes = await this.userRepository.issueId()

      if (issueIdForUserRes.hasError) {
        return issueIdForUserRes
      }

      const createUserRes = await this.userRepository.create({
        id: issueIdForUserRes.value,
        role: 'teacher',
        isDemo: false,
        createdAt: nowRes.value,
        updatedAt: nowRes.value,
      })

      if (createUserRes.hasError) {
        return createUserRes
      }

      const hashedPasswordResult = await this.humanUserRepository.hashPassword(
        teacher.password,
      )

      if (hashedPasswordResult.hasError) {
        return hashedPasswordResult
      }

      const createHumanUserRes = await this.humanUserRepository.create({
        userId: issueIdForUserRes.value,
        email: null,
        loginId: teacher.loginId,
        hashedPassword: hashedPasswordResult.value,
        createdAt: nowRes.value,
        updatedAt: nowRes.value,
      })

      if (createHumanUserRes.hasError) {
        return createHumanUserRes
      }

      const issueIdForTeacherRes = await this.teacherRepository.issueId()

      if (issueIdForTeacherRes.hasError) {
        return issueIdForTeacherRes
      }

      const createTeacherRes = await this.teacherRepository.create({
        id: issueIdForTeacherRes.value,
        userId: issueIdForUserRes.value,
        role: 'teacher',
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        isDeactivated: false,
        externalLmsTeacherId: null,
        createdAt: nowRes.value,
        createdUserId: null,
      })

      if (createTeacherRes.hasError) {
        return createTeacherRes
      }

      //
      // Create Teacher Organization Affiliation
      //
      const issueIdForTeacherOrganizationAffiliationRes =
        await this.teacherOrganizationAffiliationRepository.issueId()

      if (issueIdForTeacherOrganizationAffiliationRes.hasError) {
        return issueIdForTeacherOrganizationAffiliationRes
      }

      const createTeacherOrganizationAffiliationRes =
        await this.teacherOrganizationAffiliationRepository.create({
          id: issueIdForTeacherOrganizationAffiliationRes.value,
          teacherId: issueIdForTeacherRes.value,
          organizationId: issueIdForOrtganizationRes.value,
          createdAt: nowRes.value,
          createdUserId: '',
        })

      if (createTeacherOrganizationAffiliationRes.hasError) {
        return createTeacherOrganizationAffiliationRes
      }
    }

    //
    // Create Student Groups
    //
    const allAssignedPackages: (typeof input)['studentGroups'][0]['assignedPackages'] =
      []

    for (const studentGroup of input.studentGroups) {
      const issueIdForStudentGroupRes =
        await this.studentGroupRepository.issueId()

      if (issueIdForStudentGroupRes.hasError) {
        return issueIdForStudentGroupRes
      }

      const createStudentGroupRes = await this.studentGroupRepository.create({
        id: issueIdForStudentGroupRes.value,
        organizationId: issueIdForOrtganizationRes.value,
        name: studentGroup.name,
        grade: studentGroup.grade,
        externalLmsStudentGroupId: null,
        classlinkTenantId: null,
        createdAt: nowRes.value,
        updatedAt: nowRes.value,
        createdUserId: null,
        updatedUserId: null,
      })

      if (createStudentGroupRes.hasError) {
        return createStudentGroupRes
      }
      //
      // Create StudentGroup Package Assignment
      //
      for (const assignedPackage of studentGroup.assignedPackages) {
        const issueIdForstudentGroupPackageAssignmentRes =
          await this.studentGroupPackageAssignmentRepository.issueId()

        if (issueIdForstudentGroupPackageAssignmentRes.hasError) {
          return issueIdForstudentGroupPackageAssignmentRes
        }

        const createStudentGroupPackageAssignmentResult =
          await this.studentGroupPackageAssignmentRepository.create({
            id: issueIdForstudentGroupPackageAssignmentRes.value,
            studentGroupId: issueIdForStudentGroupRes.value,
            curriculumPackageId: assignedPackage.curriculumPackageId,
            curriculumBrandId: assignedPackage.curriculumBrandId,
            createdAt: nowRes.value,
          })

        if (createStudentGroupPackageAssignmentResult.hasError) {
          return createStudentGroupPackageAssignmentResult
        }

        if (
          !allAssignedPackages.find(
            (e) =>
              e.curriculumPackageId === assignedPackage.curriculumPackageId,
          )
        ) {
          allAssignedPackages.push(assignedPackage)
        }
      }
      //
      // Create Students
      //
      for (const student of studentGroup.students) {
        const issueIdForUserRes = await this.userRepository.issueId()

        if (issueIdForUserRes.hasError) {
          return issueIdForUserRes
        }

        const createUserRes = await this.userRepository.create({
          id: issueIdForUserRes.value,
          role: 'student',
          isDemo: false,
          createdAt: nowRes.value,
          updatedAt: nowRes.value,
        })

        if (createUserRes.hasError) {
          return createUserRes
        }

        const hashedPasswordResult =
          await this.humanUserRepository.hashPassword(student.password)

        if (hashedPasswordResult.hasError) {
          return hashedPasswordResult
        }

        const createHumanUserRes = await this.humanUserRepository.create({
          userId: issueIdForUserRes.value,
          email: null,
          loginId: student.loginId,
          hashedPassword: hashedPasswordResult.value,
          createdAt: nowRes.value,
          updatedAt: nowRes.value,
        })

        if (createHumanUserRes.hasError) {
          return createHumanUserRes
        }

        const issueIdForStudentRes = await this.studentRepository.issueId()

        if (issueIdForStudentRes.hasError) {
          return issueIdForStudentRes
        }

        const createStudentRes = await this.studentRepository.create({
          id: issueIdForStudentRes.value,
          userId: issueIdForUserRes.value,
          role: 'student',
          nickName: student.nickName,
          isDeactivated: false,
          externalLmsStudentId: null,
          classlinkTenantId: null,
          createdAt: nowRes.value,
          createdUserId: '',
        })

        if (createStudentRes.hasError) {
          return createStudentRes
        }

        //
        // Create Student Student Group Affiliation
        //
        const issueIdForStudentStudentGroupAffiliationRes =
          await this.studentStudentGroupAffiliationRepository.issueId()

        if (issueIdForStudentStudentGroupAffiliationRes.hasError) {
          return issueIdForStudentStudentGroupAffiliationRes
        }

        const createStudentStudentGroupAffiliationRes =
          await this.studentStudentGroupAffiliationRepository.create({
            id: issueIdForStudentStudentGroupAffiliationRes.value,
            studentId: issueIdForStudentRes.value,
            studentGroupId: issueIdForStudentGroupRes.value,
            createdAt: nowRes.value,
            createdUserId: '',
          })

        if (createStudentStudentGroupAffiliationRes.hasError) {
          return createStudentStudentGroupAffiliationRes
        }
        //
        // Create User Lesson Statuses
        //
        for (const userLessonStatus of student.userLessonStatuses) {
          const issueIdForUserLessonStatusResult =
            await this.userLessonStatusRepository.issueId()

          if (issueIdForUserLessonStatusResult.hasError) {
            return issueIdForUserLessonStatusResult
          }
          this.userLessonStatusRepository.create({
            id: issueIdForUserLessonStatusResult.value,
            userId: issueIdForUserRes.value,
            ...userLessonStatus,
          })
        }
      }
    }
    //
    // Create District Purchased Packages
    //
    for (const assignedPackage of allAssignedPackages) {
      const issueIdFordistrictPurchasedPackageRes =
        await this.districtPurchasedPackageRepository.issueId()

      if (issueIdFordistrictPurchasedPackageRes.hasError) {
        return issueIdFordistrictPurchasedPackageRes
      }

      const createDistrictPurchasedPackageResult =
        await this.districtPurchasedPackageRepository.create({
          id: issueIdFordistrictPurchasedPackageRes.value,
          districtId: issueIdForDistrictRes.value,
          curriculumPackageId: assignedPackage.curriculumPackageId,
          createdAt: nowRes.value,
          createdUserId: null,
        })

      if (createDistrictPurchasedPackageResult.hasError) {
        return createDistrictPurchasedPackageResult
      }
    }

    return successErrorable(undefined)
  }
}
