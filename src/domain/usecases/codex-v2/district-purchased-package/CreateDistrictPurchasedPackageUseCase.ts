import { DistrictPurchasedPackage } from '../../../entities/codex-v2/DistrictPurchasedPackage'
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

  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>

  create(
    districtPurchasedPackage: DistrictPurchasedPackage,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateDistrictPurchasedPackageUseCase {
  constructor(
    private readonly districtPurchasedPackageRepository: DistrictPurchasedPackageRepository,
    private readonly datetimeRepository: DatetimeRepository,
    private readonly districtRepository: DistrictRepository,
    private readonly curriculumPackageRepository: CurriculumPackageRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      districtId: string
      curriculumPackageId: string
    },
  ): Promise<
    Errorable<
      DistrictPurchasedPackage,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'DistrictNotFound'>
      | E<'CurriculumPackageNotFound'>
      | E<'DuplicatedCurriculumPackage'>
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

    const { district, curriculumPackage, districtCurriculumPackages } =
      correctedEntitiesToCheckErrorRes.value

    if (!district) {
      return failureErrorable(
        'DistrictNotFound',
        `district not found. districtId: ${input.districtId}`,
      )
    }

    if (!curriculumPackage) {
      return failureErrorable(
        'CurriculumPackageNotFound',
        `curriculumPackage not found. curriculumPackageId: ${input.curriculumPackageId}`,
      )
    }

    const checkDuplicatedCurriculumPackageErrorRes =
      await this.checkDuplicatedCurriculumPackageError(
        curriculumPackage,
        districtCurriculumPackages,
      )

    if (checkDuplicatedCurriculumPackageErrorRes.hasError) {
      return checkDuplicatedCurriculumPackageErrorRes
    }

    return this.create(authenticatedUser, input)
  }

  private correctEntitiesToCheckError = async (input: {
    districtId: string
    curriculumPackageId: string
  }): Promise<
    Errorable<
      {
        district: District | null
        curriculumPackage: CurriculumPackage | null
        districtCurriculumPackages: CurriculumPackage[]
      },
      E<'UnknownRuntimeError'>
    >
  > => {
    const districtRes = await this.districtRepository.findById(input.districtId)

    if (districtRes.hasError) {
      return districtRes
    }

    const curriculumPackageRes =
      await this.curriculumPackageRepository.findById(input.curriculumPackageId)

    if (curriculumPackageRes.hasError) {
      return curriculumPackageRes
    }

    const districtPurchasedPackagesRes =
      await this.districtPurchasedPackageRepository.findByDistrictId(
        input.districtId,
      )

    if (districtPurchasedPackagesRes.hasError) {
      return districtPurchasedPackagesRes
    }

    const curriculumPackageIds = districtPurchasedPackagesRes.value.map(
      (e) => e.curriculumPackageId,
    )
    const districtCurriculumPackagesRes =
      await this.curriculumPackageRepository.findByIds(curriculumPackageIds)

    if (districtCurriculumPackagesRes.hasError) {
      return districtCurriculumPackagesRes
    }

    return successErrorable({
      district: districtRes.value,
      curriculumPackage: curriculumPackageRes.value,
      districtCurriculumPackages: districtCurriculumPackagesRes.value,
    })
  }

  private checkDuplicatedCurriculumPackageError = async (
    curriculumPackage: CurriculumPackage,
    districtsPackages: CurriculumPackage[],
  ): Promise<Errorable<void, E<'DuplicatedCurriculumPackage'>>> => {
    const duplicated = districtsPackages.find(
      (e) => e.id === curriculumPackage.id,
    )

    if (duplicated) {
      return failureErrorable(
        'DuplicatedCurriculumPackage',
        `curriculumPackageId is already related to districtId. curriculumPackageId: ${curriculumPackage.id}`,
      )
    }

    return successErrorable(undefined)
  }

  private create = async (
    authenticatedUser: User,
    input: {
      districtId: string
      curriculumPackageId: string
    },
  ): Promise<Errorable<DistrictPurchasedPackage, E<'UnknownRuntimeError'>>> => {
    const idRes = await this.districtPurchasedPackageRepository.issueId()

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
    const districtPurchasedPackage: DistrictPurchasedPackage = {
      districtId: input.districtId,
      curriculumPackageId: input.curriculumPackageId,
      id: id,
      createdUserId: authenticatedUser.id,
      createdAt: now,
    }
    const creationRes = await this.districtPurchasedPackageRepository.create(
      districtPurchasedPackage,
    )

    if (creationRes.hasError) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create districtPurchasedPackage. values: ${JSON.stringify(
          districtPurchasedPackage,
        )}`,
        creationRes.error,
      )
    }

    return successErrorable(districtPurchasedPackage)
  }
}
