import { StudentStudentGroupAffiliation } from '../../../entities/codex-v2/StudentStudentGroupAffiliation'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { Student } from '../../../entities/codex-v2/Student'

export interface StudentGroupRepository {
  findById(
    id: string,
  ): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>>
}

export interface StudentRepository {
  findById(
    id: string,
  ): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>>
}

export interface StudentStudentGroupAffiliationRepository {
  findByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>
  >

  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>

  create(
    studentStudentGroupAffiliation: StudentStudentGroupAffiliation,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateStudentStudentGroupAffiliationUseCase {
  constructor(
    private readonly studentStudentGroupAffiliationRepository: StudentStudentGroupAffiliationRepository,
    private readonly datetimeRepository: DatetimeRepository,
    private readonly studentGroupRepository: StudentGroupRepository,
    private readonly studentRepository: StudentRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      studentGroupId: string
      studentId: string
    },
  ): Promise<
    Errorable<
      StudentStudentGroupAffiliation,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'StudentGroupNotFound'>
      | E<'StudentNotFound'>
      | E<'DuplicatedStudent'>
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

    const { studentGroup, student, studentStudentGroupAffiliations } =
      correctedEntitiesToCheckErrorRes.value

    if (!studentGroup) {
      return failureErrorable(
        'StudentGroupNotFound',
        `studentGroup not found. studentGroupId: ${input.studentGroupId}`,
      )
    }

    if (!student) {
      return failureErrorable(
        'StudentNotFound',
        `student not found. studentId: ${input.studentId}`,
      )
    }

    const checkDuplicatedStudentErrorRes =
      await this.checkDuplicatedStudentError(
        student,
        studentStudentGroupAffiliations,
      )

    if (checkDuplicatedStudentErrorRes.hasError) {
      return checkDuplicatedStudentErrorRes
    }

    return this.create(authenticatedUser, input)
  }

  private correctEntitiesToCheckError = async (input: {
    studentGroupId: string
    studentId: string
  }): Promise<
    Errorable<
      {
        studentGroup: StudentGroup | null
        student: Student | null
        studentStudentGroupAffiliations: StudentStudentGroupAffiliation[]
      },
      E<'UnknownRuntimeError'>
    >
  > => {
    const studentGroupRes = await this.studentGroupRepository.findById(
      input.studentGroupId,
    )

    if (studentGroupRes.hasError) {
      return studentGroupRes
    }

    const studentRes = await this.studentRepository.findById(input.studentId)

    if (studentRes.hasError) {
      return studentRes
    }

    const studentStudentGroupAffiliationsRes =
      await this.studentStudentGroupAffiliationRepository.findByStudentGroupId(
        input.studentGroupId,
      )

    if (studentStudentGroupAffiliationsRes.hasError) {
      return studentStudentGroupAffiliationsRes
    }

    return successErrorable({
      studentGroup: studentGroupRes.value,
      student: studentRes.value,
      studentStudentGroupAffiliations: studentStudentGroupAffiliationsRes.value,
    })
  }

  private checkDuplicatedStudentError = async (
    student: Student,
    studentStudentGroupAffiliations: StudentStudentGroupAffiliation[],
  ): Promise<Errorable<void, E<'DuplicatedStudent'>>> => {
    const duplicated = studentStudentGroupAffiliations.find(
      (e) => e.studentId === student.id,
    )

    if (duplicated) {
      return failureErrorable(
        'DuplicatedStudent',
        `studentId is already related to studentGroupId. studentId: ${student.id}`,
      )
    }

    return successErrorable(undefined)
  }

  private create = async (
    authenticatedUser: User,
    input: {
      studentGroupId: string
      studentId: string
    },
  ): Promise<
    Errorable<StudentStudentGroupAffiliation, E<'UnknownRuntimeError'>>
  > => {
    const idRes = await this.studentStudentGroupAffiliationRepository.issueId()

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
    const studentStudentGroupAffiliation: StudentStudentGroupAffiliation = {
      studentGroupId: input.studentGroupId,
      studentId: input.studentId,
      id: id,
      createdUserId: authenticatedUser.id,
      createdAt: now,
    }
    const creationRes =
      await this.studentStudentGroupAffiliationRepository.create(
        studentStudentGroupAffiliation,
      )

    if (creationRes.hasError) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create studentStudentGroupAffiliation. values: ${JSON.stringify(
          studentStudentGroupAffiliation,
        )}`,
        creationRes.error,
      )
    }

    return successErrorable(studentStudentGroupAffiliation)
  }
}
