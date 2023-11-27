import { DataSource, DeepPartial, In } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import {
  MaintenanceCreateTeacherOrganizationsUseCase,
  ITeacherOrganizationRepository,
} from '../../../../../../domain/usecases/maintenance/TeacherOrganization/MaintenanceCreateTeacherOrganizationsUseCase'
import { TeacherOrganizationTypeormEntity } from '../../../../../typeorm/entity/TeacherOrganization'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import { TeacherTypeormEntity } from '../../../../../typeorm/entity/Teacher'

type Response =
  | Paths.MaintenancePostTeacherOrganizations.Responses.$200
  | Paths.MaintenancePostTeacherOrganizations.Responses.$500

export class MaintenanceCreateTeacherOrganizationsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenancePostTeacherOrganizations.RequestBody,
    Response
  > = async (params) => {
    const createTeacherOrganizationsUseCase =
      new MaintenanceCreateTeacherOrganizationsUseCase({
        createTeacherOrganizations: this.createTeacherOrganizations,
      })
    const createTeacherOrganizationsUseCaseResult =
      await createTeacherOrganizationsUseCase.run(
        params.body.teacherOrganizations,
      )

    if (createTeacherOrganizationsUseCaseResult.hasError) {
      const response500: Paths.MaintenancePostTeacherOrganizations.Responses.$500 =
        {
          error: JSON.stringify(createTeacherOrganizationsUseCaseResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenancePostTeacherOrganizations.Responses.$200 =
      {
        ok: 'ok',
      }

    return { statusCode: 200, response: response200 }
  }

  private createTeacherOrganizations: ITeacherOrganizationRepository['createTeacherOrganizations'] =
    async (teacherOrganizations) => {
      try {
        const teacherTypeormRepository =
          this.appDataSource.getRepository(TeacherTypeormEntity)
        const teachers = await teacherTypeormRepository.find({
          where: {
            user_id: In(teacherOrganizations.map((e) => e.userId)),
          },
        })

        const teacherOrganizationsToSave: DeepPartial<TeacherOrganizationTypeormEntity>[] =
          []

        for (const teacherOrganization of teacherOrganizations) {
          const teacher = teachers.find(
            (e) => e.user_id === teacherOrganization.userId,
          )

          if (!teacher) {
            return {
              hasError: true,
              error: {
                type: 'UnknownRuntimeError',
                message: `teacher not found for userId ${teacherOrganization.userId}`,
              },
              value: null,
            }
          }
          teacherOrganizationsToSave.push({
            teacher: { id: teacher.id },
            organization: { id: teacherOrganization.organizationId },
          })
        }

        const teacherOrganizationTypeormRepository =
          this.appDataSource.getRepository(TeacherOrganizationTypeormEntity)

        await teacherOrganizationTypeormRepository.save(
          teacherOrganizationsToSave,
        )
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to create TeacherOrganizationTypeormEntity`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }
}
