import { TeacherOrganizationAffiliation } from '../../../entities/codex-v2/TeacherOrganizationAffiliation'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { Organization } from '../../../entities/codex-v2/Organization'
import { Teacher } from '../../../entities/codex-v2/Teacher'

export interface OrganizationRepository {
  findById(
    id: string,
  ): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>>
}

export interface TeacherRepository {
  findById(
    id: string,
  ): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>>
}

export interface TeacherOrganizationAffiliationRepository {
  findByOrganizationId(
    organizationId: string,
  ): Promise<
    Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>
  >

  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>

  create(
    teacherOrganizationAffiliation: TeacherOrganizationAffiliation,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateTeacherOrganizationAffiliationUseCase {
  constructor(
    private readonly teacherOrganizationAffiliationRepository: TeacherOrganizationAffiliationRepository,
    private readonly datetimeRepository: DatetimeRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly teacherRepository: TeacherRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      organizationId: string
      teacherId: string
    },
  ): Promise<
    Errorable<
      TeacherOrganizationAffiliation,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'OrganizationNotFound'>
      | E<'TeacherNotFound'>
      | E<'DuplicatedTeacher'>
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

    const { organization, teacher, teacherOrganizationAffiliations } =
      correctedEntitiesToCheckErrorRes.value

    if (!organization) {
      return failureErrorable(
        'OrganizationNotFound',
        `organization not found. organizationId: ${input.organizationId}`,
      )
    }

    if (!teacher) {
      return failureErrorable(
        'TeacherNotFound',
        `teacher not found. teacherId: ${input.teacherId}`,
      )
    }

    const checkDuplicatedTeacherErrorRes =
      await this.checkDuplicatedTeacherError(
        teacher,
        teacherOrganizationAffiliations,
      )

    if (checkDuplicatedTeacherErrorRes.hasError) {
      return checkDuplicatedTeacherErrorRes
    }

    return this.create(authenticatedUser, input)
  }

  private correctEntitiesToCheckError = async (input: {
    organizationId: string
    teacherId: string
  }): Promise<
    Errorable<
      {
        organization: Organization | null
        teacher: Teacher | null
        teacherOrganizationAffiliations: TeacherOrganizationAffiliation[]
      },
      E<'UnknownRuntimeError'>
    >
  > => {
    const organizationRes = await this.organizationRepository.findById(
      input.organizationId,
    )

    if (organizationRes.hasError) {
      return organizationRes
    }

    const teacherRes = await this.teacherRepository.findById(input.teacherId)

    if (teacherRes.hasError) {
      return teacherRes
    }

    const teacherOrganizationAffiliationsRes =
      await this.teacherOrganizationAffiliationRepository.findByOrganizationId(
        input.organizationId,
      )

    if (teacherOrganizationAffiliationsRes.hasError) {
      return teacherOrganizationAffiliationsRes
    }

    return successErrorable({
      organization: organizationRes.value,
      teacher: teacherRes.value,
      teacherOrganizationAffiliations: teacherOrganizationAffiliationsRes.value,
    })
  }

  private checkDuplicatedTeacherError = async (
    teacher: Teacher,
    teacherOrganizationAffiliations: TeacherOrganizationAffiliation[],
  ): Promise<Errorable<void, E<'DuplicatedTeacher'>>> => {
    const duplicated = teacherOrganizationAffiliations.find(
      (e) => e.teacherId === teacher.id,
    )

    if (duplicated) {
      return failureErrorable(
        'DuplicatedTeacher',
        `teacherId is already related to organizationId. teacherId: ${teacher.id}`,
      )
    }

    return successErrorable(undefined)
  }

  private create = async (
    authenticatedUser: User,
    input: {
      organizationId: string
      teacherId: string
    },
  ): Promise<
    Errorable<TeacherOrganizationAffiliation, E<'UnknownRuntimeError'>>
  > => {
    const idRes = await this.teacherOrganizationAffiliationRepository.issueId()

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
    const teacherOrganizationAffiliation: TeacherOrganizationAffiliation = {
      organizationId: input.organizationId,
      teacherId: input.teacherId,
      id: id,
      createdUserId: authenticatedUser.id,
      createdAt: now,
    }
    const creationRes =
      await this.teacherOrganizationAffiliationRepository.create(
        teacherOrganizationAffiliation,
      )

    if (creationRes.hasError) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create teacherOrganizationAffiliation. values: ${JSON.stringify(
          teacherOrganizationAffiliation,
        )}`,
        creationRes.error,
      )
    }

    return successErrorable(teacherOrganizationAffiliation)
  }
}
