import { DataSource, DeepPartial, In } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import {
  MaintenanceDeleteStudentGroupStudentsUseCase,
  IStudentGroupStudentRepository,
} from '../../../../../../domain/usecases/maintenance/StudentGroupStudent/MaintenanceDeleteStudentGroupStudentsUseCase'
import { StudentGroupStudentTypeormEntity } from '../../../../../typeorm/entity/StudentGroupStudent'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import { StudentTypeormEntity } from '../../../../../typeorm/entity/Student'

type Response =
  | Paths.MaintenanceDeleteStudentGroupStudents.Responses.$200
  | Paths.MaintenanceDeleteStudentGroupStudents.Responses.$500

export class MaintenanceDeleteStudentGroupStudentsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenanceDeleteStudentGroupStudents.RequestBody,
    Response
  > = async (params) => {
    const deleteStudentGroupStudentsUseCase =
      new MaintenanceDeleteStudentGroupStudentsUseCase({
        deleteStudentGroupStudents: this.deleteStudentGroupStudents,
      })
    const deleteStudentGroupStudentsUseCaseResult =
      await deleteStudentGroupStudentsUseCase.run(
        params.body.studentGroupStudents,
      )

    if (deleteStudentGroupStudentsUseCaseResult.hasError) {
      const response500: Paths.MaintenanceDeleteStudentGroupStudents.Responses.$500 =
        {
          error: JSON.stringify(deleteStudentGroupStudentsUseCaseResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenanceDeleteStudentGroupStudents.Responses.$200 =
      {
        ok: 'ok',
      }

    return { statusCode: 200, response: response200 }
  }

  private deleteStudentGroupStudents: IStudentGroupStudentRepository['deleteStudentGroupStudents'] =
    async (studentGroupStudents) => {
      try {
        const studentTypeormRepository =
          this.appDataSource.getRepository(StudentTypeormEntity)
        const students = await studentTypeormRepository.find({
          where: {
            user_id: In(studentGroupStudents.map((e) => e.userId)),
          },
        })

        const studentGroupStudentTypeormRepository =
          this.appDataSource.getRepository(StudentGroupStudentTypeormEntity)

        for (const studentGroupStudent of studentGroupStudents) {
          const student = students.find(
            (e) => e.user_id === studentGroupStudent.userId,
          )

          if (!student) {
            return {
              hasError: true,
              error: {
                type: 'UnknownRuntimeError',
                message: `student not found for userId ${studentGroupStudent.userId}`,
              },
              value: null,
            }
          }
          await studentGroupStudentTypeormRepository.delete({
            student_group_id: { id: studentGroupStudent.studentGroupId },
            student_id: { id: student.id },
          })
        }
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to delete StudentGroupStudentTypeormEntity`,
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
