import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { Organization } from '../../../entities/codex-v2/Organization'

export interface OrganizationRepository {
  findById(
    id: string,
  ): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>>
}

export interface StudentGroupRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    studentGroup: StudentGroup,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateStudentGroupUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly studentGroupRepository: StudentGroupRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      name: string
      grade: string | null
      externalLmsStudentGroupId: string | null
      organizationId: string
      classlinkTenantId: string | null
    },
  ): Promise<
    Errorable<
      StudentGroup,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'OrganizationNotFound'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const organizationRes = await this.organizationRepository.findById(
      input.organizationId,
    )

    if (organizationRes.hasError) {
      return organizationRes
    }

    if (!organizationRes.value) {
      return failureErrorable(
        'OrganizationNotFound',
        `organization not found. organizationId: ${input.organizationId}`,
      )
    }

    const issueIdRes = await this.studentGroupRepository.issueId()

    if (issueIdRes.hasError) {
      return issueIdRes
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const studentGroup: StudentGroup = {
      ...input,
      id: issueIdRes.value,
      createdAt: nowRes.value,
      updatedAt: nowRes.value,
      createdUserId: authenticatedUser.id,
      updatedUserId: authenticatedUser.id,
    }
    const createRes = await this.studentGroupRepository.create(studentGroup)

    if (createRes.hasError) {
      return createRes
    }

    return successErrorable(studentGroup)
  }
}
