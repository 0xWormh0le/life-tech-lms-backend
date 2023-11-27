import { DataSource, In, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import { TeacherOrganizationTypeormEntity } from '../../../../../typeorm/entity/TeacherOrganization'
import {
  fromNativeError,
  ValueTypeOfPromiseErroableFunc,
} from '../../../../../../domain/usecases/shared/Errors'
import {
  MaintenanceGetTeacherOrganizationsUseCase,
  ITeacherOrganizationRepository,
} from '../../../../../../domain/usecases/maintenance/TeacherOrganization/MaintenanceGetTeacherOrganizationsUseCase'
import { TeacherTypeormEntity } from '../../../../../typeorm/entity/Teacher'

type Response =
  | Paths.MaintenanceGetTeacherOrganizations.Responses.$200
  | Paths.MaintenanceGetTeacherOrganizations.Responses.$500

export class MaintenanceGetTeacherOrganizationsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<undefined, undefined, undefined, Response> = async () => {
    const maintenanceGetTeacherOrganizationsUseCase =
      new MaintenanceGetTeacherOrganizationsUseCase({
        getAllTeacherOrganizations: this.getAllTeacherOrganizations,
      })
    const getTeacherOrganizationsResult =
      await maintenanceGetTeacherOrganizationsUseCase.run()

    if (getTeacherOrganizationsResult.hasError) {
      const response500: Paths.MaintenanceGetTeacherOrganizations.Responses.$500 =
        {
          error: JSON.stringify(getTeacherOrganizationsResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenanceGetTeacherOrganizations.Responses.$200 =
      {
        teacherOrganizations: getTeacherOrganizationsResult.value,
      }

    return { statusCode: 200, response: response200 }
  }

  private getAllTeacherOrganizations: ITeacherOrganizationRepository['getAllTeacherOrganizations'] =
    async () => {
      let teacherOrganizations: TeacherOrganizationTypeormEntity[]
      let teachers: TeacherTypeormEntity[]

      try {
        const teacherOrganizationTypeormRepository =
          this.appDataSource.getRepository(TeacherOrganizationTypeormEntity)

        teacherOrganizations = await teacherOrganizationTypeormRepository.find({
          order: {
            created_date: 'ASC',
          },
          relations: ['teacher', 'organization'],
        })

        const teacherIds: string[] = []

        for (const teacherOrganization of teacherOrganizations) {
          if (!teacherOrganization.teacher) {
            return {
              hasError: true,
              error: {
                type: 'UnknownRuntimeError',
                message: `teacherOrganization.teacher is undefined some how organization ${JSON.stringify(
                  teacherOrganization.organization,
                )}`,
              },
              value: null,
            }
          }
          teacherIds.push(teacherOrganization.teacher.id)
        }

        const teacherTypeormRepository =
          this.appDataSource.getRepository(TeacherTypeormEntity)

        teachers = await teacherTypeormRepository.find({
          where: {
            id: In(teacherIds),
          },
        })
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to get TeacherOrganizationTypeormEntity`,
          ),
          value: null,
        }
      }

      const value: ValueTypeOfPromiseErroableFunc<
        ITeacherOrganizationRepository['getAllTeacherOrganizations']
      > = []
      const teacherUserIdMap: { [adminisratorId: string]: string } = {}

      for (const teacher of teachers) {
        teacherUserIdMap[teacher.id] = teacher.user_id
      }
      for (const teacherOrganization of teacherOrganizations) {
        const userId = teacherUserIdMap[teacherOrganization.teacher.id]

        if (!userId) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `corresponding userId not found for teacherId ${teacherOrganization.teacher.id} somehow`,
            },
            value: null,
          }
        }
        value.push({
          organizationId: teacherOrganization.organization.id,
          userId,
        })
      }

      return {
        hasError: false,
        error: null,
        value,
      }
    }
}
