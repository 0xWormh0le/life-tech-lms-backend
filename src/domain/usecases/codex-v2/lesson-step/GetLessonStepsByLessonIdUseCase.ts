import { LessonStep } from '../../../entities/codex-v2/LessonStep'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'

export interface LessonStepRepository {
  findByLessonId(
    lessonId: string,
  ): Promise<Errorable<LessonStep[], E<'UnknownRuntimeError'>>>
}

export default class GetLessonStepsByLessonIdUseCase {
  constructor(private readonly lessonStepRepository: LessonStepRepository) {}

  run = async (
    _authenticatedUser: User,
    lessonId: string,
  ): Promise<Errorable<LessonStep[], E<'UnknownRuntimeError'>>> =>
    this.lessonStepRepository.findByLessonId(lessonId)
}
