import { LessonStep } from '../../../../domain/entities/codex-v2/LessonStep'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../../domain/usecases/shared/Errors'
import { Lesson } from '../../../../domain/entities/codex-v2/Lesson'
import { ExternalLessonPlayerLesson } from '../entities/ExternalLessonPlayerLesson'
import { ExternalLessonPlayerLessonStep } from '../entities/ExternalLessonPlayerLessonStep'

export interface ExternalLessonPlayerLessonRepository {
  findByLessonSheetName(
    lessonSheetName: string,
  ): Promise<
    Errorable<ExternalLessonPlayerLesson | null, E<'UnknownRuntimeError'>>
  >
}

export interface LessonRepository {
  findById(
    id: string,
  ): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>>
}

export interface LessonStepRepository {
  findByLessonId(
    lessonId: string,
  ): Promise<Errorable<LessonStep[], E<'UnknownRuntimeError'>>>
  create(
    lessonStep: LessonStep,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  update(
    lessonStep: LessonStep,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  delete(
    lessonStepId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateLessonStepsUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly externalLessonPlayerLessonRepository: ExternalLessonPlayerLessonRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly lessonStepRepository: LessonStepRepository,
  ) {}

  run = async (input: {
    lessonNameInLessonSheet: string
    externalLessonPlayerLessonSteps: ExternalLessonPlayerLessonStep[]
  }): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'LessonNotFound'>>
  > => {
    const externalLessonPlayerLessonRes =
      await this.externalLessonPlayerLessonRepository.findByLessonSheetName(
        input.lessonNameInLessonSheet,
      )

    if (externalLessonPlayerLessonRes.hasError) {
      return externalLessonPlayerLessonRes
    } else if (!externalLessonPlayerLessonRes.value) {
      return failureErrorable(
        'LessonNotFound',
        `Lesson not found by lesson sheet name. lessonSheetName: ${input.lessonNameInLessonSheet}`,
      )
    }

    const lessonRes = await this.lessonRepository.findById(
      externalLessonPlayerLessonRes.value.codexLessonId,
    )

    if (lessonRes.hasError) {
      return lessonRes
    } else if (!lessonRes.value) {
      return failureErrorable(
        'LessonNotFound',
        `Lesson not found in DB. lessonSheetName: ${input.lessonNameInLessonSheet}, codexLessonId: ${externalLessonPlayerLessonRes.value.codexLessonId}`,
      )
    }

    const lesson = lessonRes.value

    const externalLessonPlayerLessonSteps =
      input.externalLessonPlayerLessonSteps
    const storedLessonStepsRes = await this.lessonStepRepository.findByLessonId(
      lessonRes.value.id,
    )

    if (storedLessonStepsRes.hasError) {
      return storedLessonStepsRes
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const storedLessonSteps = new Map(
      storedLessonStepsRes.value.map((e) => [e.id, e]),
    )

    const now = nowRes.value

    for (
      let orderIndex = 0;
      orderIndex < externalLessonPlayerLessonSteps.length;
      orderIndex++
    ) {
      const externalLessonPlayerLessonStep =
        externalLessonPlayerLessonSteps[orderIndex]
      const targetLessonStep: LessonStep = {
        id: externalLessonPlayerLessonStep.codexStepId,
        lessonId: lesson.id,
        orderIndex: orderIndex,
        createdAt: now,
        externalLessonPlayerStepId: externalLessonPlayerLessonStep.stepId,
      }
      const storedLessonStep = storedLessonSteps.get(targetLessonStep.id)

      if (!storedLessonStep) {
        const createRes = await this.lessonStepRepository.create(
          targetLessonStep,
        )

        if (createRes.hasError) {
          return createRes
        }
        continue
      }
      targetLessonStep.createdAt = storedLessonStep.createdAt

      const updateRes = await this.lessonStepRepository.update(targetLessonStep)

      if (updateRes.hasError) {
        return updateRes
      }
      storedLessonSteps.delete(targetLessonStep.id)
    }
    for (const shouldDeleteLessonStep of storedLessonSteps.values()) {
      const deleteRes = await this.lessonStepRepository.delete(
        shouldDeleteLessonStep.id,
      )

      if (deleteRes.hasError) {
        return deleteRes
      }
    }

    return successErrorable(undefined)
  }
}
