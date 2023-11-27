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

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export interface OrganizationRepository {
  findById(
    id: string,
  ): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>>
}

export interface StudentGroupRepository {
  findById(
    id: string,
  ): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>>
  update(
    studentGroup: StudentGroup,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export default class UpdateStudentGroupUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly studentGroupRepository: StudentGroupRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      id: string
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
      | E<'StudentGroupNotFound'>
      | E<'OrganizationNotFound'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    const savedStudentGroupRes = await this.studentGroupRepository.findById(
      input.id,
    )

    if (savedStudentGroupRes.hasError) {
      return savedStudentGroupRes
    }

    if (!savedStudentGroupRes.value) {
      return failureErrorable(
        'StudentGroupNotFound',
        `studentGroup not found. studentGroupId: ${input.id}`,
      )
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

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const studentGroup: StudentGroup = {
      ...input,

      id: savedStudentGroupRes.value.id,
      createdUserId: savedStudentGroupRes.value.createdUserId,
      updatedUserId: authenticatedUser.id,
      createdAt: savedStudentGroupRes.value.createdAt,
      updatedAt: nowRes.value,
    }
    const res = await this.studentGroupRepository.update(studentGroup)

    if (res.hasError) {
      return res
    }

    return successErrorable(studentGroup)
  }
}
