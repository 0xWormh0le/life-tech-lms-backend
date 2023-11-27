import { StudentGroupPackageAssignment } from '../../../entities/codex-v2/StudentGroupPackageAssignment'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { District } from '../../../entities/codex-v2/District'
import { CurriculumPackage } from '../../../entities/codex-v2/CurriculumPackage'
import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { Organization } from '../../../entities/codex-v2/Organization'
import { DistrictPurchasedPackage } from '../../../entities/codex-v2/DistrictPurchasedPackage'

export interface DistrictRepository {
  findById(
    id: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>>
}

export interface CurriculumPackageRepository {
  findById(
    id: string,
  ): Promise<Errorable<CurriculumPackage | null, E<'UnknownRuntimeError'>>>

  findByIds(
    ids: string[],
  ): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>>
}

export interface DistrictPurchasedPackageRepository {
  findByDistrictId(
    districtId: string,
  ): Promise<Errorable<DistrictPurchasedPackage[], E<'UnknownRuntimeError'>>>
}

export interface StudentGroupPackageAssignmentRepository {
  findByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>
  >

  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>

  create(
    studentGroupPackageAssignment: StudentGroupPackageAssignment,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface StudentGroupRepository {
  findById(
    id: string,
  ): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>>
}

export interface OrganizationRepository {
  findById(
    id: string,
  ): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateStudentGroupPackageAssignmentUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly districtRepository: DistrictRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly studentGroupRepository: StudentGroupRepository,
    private readonly curriculumPackageRepository: CurriculumPackageRepository,
    private readonly districtPurchasedPackageRepository: DistrictPurchasedPackageRepository,
    private readonly studentGroupPackageAssignmentRepository: StudentGroupPackageAssignmentRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      studentGroupId: string
      curriculumPackageId: string
    },
  ): Promise<
    Errorable<
      StudentGroupPackageAssignment,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'StudentGroupNotFound'>
      | E<'OrganizationNotFound'>
      | E<'DistrictNotFound'>
      | E<'CurriculumPackageNotFound'>
      | E<'DistrictPurchasedPackageNotFound'>
      | E<'DuplicatedCurriculumPackage'>
      | E<'DuplicatedCurriculumBrand'>
    >
  > => {
    const correctedEntitiesToCheckErrorRes =
      await this.correctEntitiesToCheckError(input)

    if (correctedEntitiesToCheckErrorRes.hasError) {
      return correctedEntitiesToCheckErrorRes
    }

    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const {
      curriculumPackage,
      studentGroup,
      organization,
      district,
      districtCurriculumPackages,
      studentGroupPackages,
    } = correctedEntitiesToCheckErrorRes.value

    if (!curriculumPackage) {
      return failureErrorable(
        'CurriculumPackageNotFound',
        `curriculumPackage not found. curriculumPackageId: ${input.curriculumPackageId}`,
      )
    }

    if (!studentGroup) {
      return failureErrorable(
        'StudentGroupNotFound',
        `studentGroup not found. studentGroupId: ${input.studentGroupId}`,
      )
    }

    if (!organization) {
      return failureErrorable(
        'OrganizationNotFound',
        `organization not found. studentGroupId: ${input.studentGroupId}, organizationId: ${studentGroup.organizationId}`,
      )
    }

    if (!district) {
      return failureErrorable(
        'DistrictNotFound',
        `district not found. studentGroupId: ${input.studentGroupId}, organizationId: ${studentGroup.organizationId}, districtId: ${organization.districtId}`,
      )
    }

    const checkDistrictPurchasedPackageNotFoundRes =
      await this.checkDistrictPurchasedPackageNotFound(
        curriculumPackage,
        districtCurriculumPackages,
      )

    if (checkDistrictPurchasedPackageNotFoundRes.hasError) {
      return checkDistrictPurchasedPackageNotFoundRes
    }

    const checkDuplicatedCurriculumPackageErrorRes =
      await this.checkDuplicatedCurriculumPackageError(
        curriculumPackage,
        studentGroupPackages,
      )

    if (checkDuplicatedCurriculumPackageErrorRes.hasError) {
      return checkDuplicatedCurriculumPackageErrorRes
    }

    const checkDuplicatedCurriculumBrandErrorRes =
      await this.checkDuplicatedCurriculumBrandError(
        curriculumPackage,
        studentGroupPackages,
      )

    if (checkDuplicatedCurriculumBrandErrorRes.hasError) {
      return checkDuplicatedCurriculumBrandErrorRes
    }

    return this.create(authenticatedUser, input, curriculumPackage)
  }

  private correctEntitiesToCheckError = async (input: {
    studentGroupId: string
    curriculumPackageId: string
  }): Promise<
    Errorable<
      {
        curriculumPackage: CurriculumPackage | null
        studentGroup: StudentGroup | null
        organization: Organization | null
        district: District | null
        districtCurriculumPackages: CurriculumPackage[]
        studentGroupPackages: CurriculumPackage[]
      },
      E<'UnknownRuntimeError'>
    >
  > => {
    const curriculumPackageRes =
      await this.curriculumPackageRepository.findById(input.curriculumPackageId)

    if (curriculumPackageRes.hasError) {
      return curriculumPackageRes
    }

    if (!curriculumPackageRes.value) {
      return successErrorable({
        curriculumPackage: null,
        studentGroup: null,
        organization: null,
        district: null,
        districtCurriculumPackages: [],
        studentGroupPackages: [],
      })
    }

    const studentGroupRes = await this.studentGroupRepository.findById(
      input.studentGroupId,
    )

    if (studentGroupRes.hasError) {
      return studentGroupRes
    }

    if (!studentGroupRes.value) {
      return successErrorable({
        curriculumPackage: curriculumPackageRes.value,
        studentGroup: null,
        organization: null,
        district: null,
        districtCurriculumPackages: [],
        studentGroupPackages: [],
      })
    }

    const organizationRes = await this.organizationRepository.findById(
      studentGroupRes.value.organizationId,
    )

    if (organizationRes.hasError) {
      return organizationRes
    }

    if (!organizationRes.value) {
      return successErrorable({
        studentGroup: studentGroupRes.value,
        organization: null,
        district: null,
        curriculumPackage: curriculumPackageRes.value,
        districtCurriculumPackages: [],
        studentGroupPackages: [],
      })
    }

    const districtRes = await this.districtRepository.findById(
      organizationRes.value.districtId,
    )

    if (districtRes.hasError) {
      return districtRes
    }

    if (!districtRes.value) {
      return successErrorable({
        studentGroup: studentGroupRes.value,
        organization: organizationRes.value,
        district: null,
        curriculumPackage: curriculumPackageRes.value,
        districtCurriculumPackages: [],
        studentGroupPackages: [],
      })
    }

    const studentGroupPackageAssignmentsRes =
      await this.studentGroupPackageAssignmentRepository.findByStudentGroupId(
        input.studentGroupId,
      )

    if (studentGroupPackageAssignmentsRes.hasError) {
      return studentGroupPackageAssignmentsRes
    }

    const studentGroupCurriculumPackageIds =
      studentGroupPackageAssignmentsRes.value.map((e) => e.curriculumPackageId)
    const studentGroupPackagesRes =
      await this.curriculumPackageRepository.findByIds(
        studentGroupCurriculumPackageIds,
      )

    if (studentGroupPackagesRes.hasError) {
      return studentGroupPackagesRes
    }

    const districtPurchasedPackagesRes =
      await this.districtPurchasedPackageRepository.findByDistrictId(
        districtRes.value.id,
      )

    if (districtPurchasedPackagesRes.hasError) {
      return districtPurchasedPackagesRes
    }

    const districtPurchasedPackageIds = districtPurchasedPackagesRes.value.map(
      (e) => e.curriculumPackageId,
    )
    const districtCurriculumPackagesRes =
      await this.curriculumPackageRepository.findByIds(
        districtPurchasedPackageIds,
      )

    if (districtCurriculumPackagesRes.hasError) {
      return districtCurriculumPackagesRes
    }

    return successErrorable({
      studentGroup: studentGroupRes.value,
      organization: organizationRes.value,
      district: districtRes.value,
      curriculumPackage: curriculumPackageRes.value,
      districtCurriculumPackages: districtCurriculumPackagesRes.value,
      studentGroupPackages: studentGroupPackagesRes.value,
    })
  }

  private checkDistrictPurchasedPackageNotFound = async (
    curriculumPackage: CurriculumPackage,
    districtsPackages: CurriculumPackage[],
  ): Promise<Errorable<void, E<'DistrictPurchasedPackageNotFound'>>> => {
    const purchased = districtsPackages.find(
      (e) => e.id === curriculumPackage.id,
    )

    if (!purchased) {
      return failureErrorable(
        'DistrictPurchasedPackageNotFound',
        `districtPurchasedPackage not found. packageId: ${curriculumPackage.id}`,
      )
    }

    return successErrorable(undefined)
  }

  private checkDuplicatedCurriculumPackageError = async (
    curriculumPackage: CurriculumPackage,
    studentGroupPackages: CurriculumPackage[],
  ): Promise<Errorable<void, E<'DuplicatedCurriculumPackage'>>> => {
    const duplicated = studentGroupPackages.find(
      (e) => e.id === curriculumPackage.id,
    )

    if (duplicated) {
      return failureErrorable(
        'DuplicatedCurriculumPackage',
        `curriculumPackageId is already related to studentGroup. curriculumPackageId: ${curriculumPackage.id}`,
      )
    }

    return successErrorable(undefined)
  }

  private checkDuplicatedCurriculumBrandError = async (
    curriculumPackage: CurriculumPackage,
    studentGroupPackages: CurriculumPackage[],
  ): Promise<Errorable<void, E<'DuplicatedCurriculumBrand'>>> => {
    const duplicated = studentGroupPackages.find(
      (e) => e.curriculumBrandId === curriculumPackage.curriculumBrandId,
    )

    if (duplicated) {
      return failureErrorable(
        'DuplicatedCurriculumBrand',
        `curriculumBrandId is duplicated. curriculumPackageId: ${curriculumPackage.id}, curriculumBrandId: ${curriculumPackage.curriculumBrandId}, duplicated curriculumPackageId: ${duplicated.id}`,
      )
    }

    return successErrorable(undefined)
  }

  private create = async (
    authenticatedUser: User,
    input: {
      studentGroupId: string
      curriculumPackageId: string
    },
    curriculumPackage: CurriculumPackage,
  ): Promise<
    Errorable<StudentGroupPackageAssignment, E<'UnknownRuntimeError'>>
  > => {
    const idRes = await this.studentGroupPackageAssignmentRepository.issueId()

    if (idRes.hasError) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to issue id.',
        idRes.error,
      )
    }

    const id = idRes.value
    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get `now`',
        nowRes.error,
      )
    }

    const now = nowRes.value
    const studentGroupPackageAssignment: StudentGroupPackageAssignment = {
      id: id,
      studentGroupId: input.studentGroupId,
      curriculumPackageId: input.curriculumPackageId,
      curriculumBrandId: curriculumPackage.curriculumBrandId,
      createdAt: now,
    }
    const creationRes =
      await this.studentGroupPackageAssignmentRepository.create(
        studentGroupPackageAssignment,
      )

    if (creationRes.hasError) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create studentGroupPackageAssignment. values: ${JSON.stringify(
          studentGroupPackageAssignment,
        )}`,
        creationRes.error,
      )
    }

    return successErrorable(studentGroupPackageAssignment)
  }
}
