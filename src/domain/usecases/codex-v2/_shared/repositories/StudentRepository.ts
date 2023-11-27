import { E, Errorable } from '../../../shared/Errors'
import { Student } from '../../../../entities/codex-v2/Student'

export interface StudentRepository {
  findByUserId(
    userId: string,
  ): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>>
  findById(
    studentId: string,
  ): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>>
}
