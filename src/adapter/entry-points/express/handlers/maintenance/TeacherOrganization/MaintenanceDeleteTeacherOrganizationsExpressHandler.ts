import { DataSource, DeepPartial, In } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import {
  MaintenanceDeleteTeacherOrganizationsUseCase,
  ITeacherOrganizationRepository,
} from '../../../../../../domain/usecases/maintenance/TeacherOrganization/MaintenanceDeleteTeacherOrganizationsUseCase'
import { TeacherOrganizationTypeormEntity } from '../../../../../typeorm/entity/TeacherOrganization'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import { TeacherTypeormEntity } from '../../../../../typeorm/entity/Teacher'

type Response =
  | Paths.MaintenanceDeleteTeacherOrganizations.Responses.$200
  | Paths.MaintenanceDeleteTeacherOrganizations.Responses.$500

export class MaintenanceDeleteTeacherOrganizationsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenanceDeleteTeacherOrganizations.RequestBody,
    Response
  > = async (params) => {
    const deleteTeacherOrganizationsUseCase =
      new MaintenanceDeleteTeacherOrganizationsUseCase({
        deleteTeacherOrganizations: this.deleteTeacherOrganizations,
      })
    const deleteTeacherOrganizationsUseCaseResult =
      await deleteTeacherOrganizationsUseCase.run(
        params.body.teacherOrganizations,
      )

    if (deleteTeacherOrganizationsUseCaseResult.hasError) {
      const response500: Paths.MaintenanceDeleteTeacherOrganizations.Responses.$500 =
        {
          error: JSON.stringify(deleteTeacherOrganizationsUseCaseResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenanceDeleteTeacherOrganizations.Responses.$200 =
      {
        ok: 'ok',
      }

    return { statusCode: 200, response: response200 }
  }

  private deleteTeacherOrganizations: ITeacherOrganizationRepository['deleteTeacherOrganizations'] =
    async (teacherOrganizations) => {
      try {
        const teacherTypeormRepository =
          this.appDataSource.getRepository(TeacherTypeormEntity)
        const teachers = await teacherTypeormRepository.find({
          where: {
            user_id: In(teacherOrganizations.map((e) => e.userId)),
          },
        })

        const teacherOrganizationTypeormRepository =
          this.appDataSource.getRepository(TeacherOrganizationTypeormEntity)

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
          await teacherOrganizationTypeormRepository.delete({
            organization: { id: teacherOrganization.organizationId },
            teacher: { id: teacher.id },
          })
        }
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to delete TeacherOrganizationTypeormEntity`,
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
