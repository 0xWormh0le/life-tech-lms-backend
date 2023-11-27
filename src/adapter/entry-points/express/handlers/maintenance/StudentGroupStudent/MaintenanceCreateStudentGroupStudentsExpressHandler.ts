import { DataSource, DeepPartial, In } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import {
  MaintenanceCreateStudentGroupStudentsUseCase,
  IStudentGroupStudentRepository,
} from '../../../../../../domain/usecases/maintenance/StudentGroupStudent/MaintenanceCreateStudentGroupStudentsUseCase'
import { StudentGroupStudentTypeormEntity } from '../../../../../typeorm/entity/StudentGroupStudent'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import { StudentTypeormEntity } from '../../../../../typeorm/entity/Student'

type Response =
  | Paths.MaintenancePostStudentGroupStudents.Responses.$200
  | Paths.MaintenancePostStudentGroupStudents.Responses.$500

export class MaintenanceCreateStudentGroupStudentsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenancePostStudentGroupStudents.RequestBody,
    Response
  > = async (params) => {
    const createStudentGroupStudentsUseCase =
      new MaintenanceCreateStudentGroupStudentsUseCase({
        createStudentGroupStudents: this.createStudentGroupStudents,
      })
    const createStudentGroupStudentsUseCaseResult =
      await createStudentGroupStudentsUseCase.run(
        params.body.studentGroupStudents,
      )

    if (createStudentGroupStudentsUseCaseResult.hasError) {
      const response500: Paths.MaintenancePostStudentGroupStudents.Responses.$500 =
        {
          error: JSON.stringify(createStudentGroupStudentsUseCaseResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenancePostStudentGroupStudents.Responses.$200 =
      {
        ok: 'ok',
      }

    return { statusCode: 200, response: response200 }
  }

  private createStudentGroupStudents: IStudentGroupStudentRepository['createStudentGroupStudents'] =
    async (studentGroupStudents) => {
      try {
        const studentTypeormRepository =
          this.appDataSource.getRepository(StudentTypeormEntity)
        const students = await studentTypeormRepository.find({
          where: {
            user_id: In(studentGroupStudents.map((e) => e.userId)),
          },
        })

        console.log(JSON.stringify(students, null, 2))

        const studentGroupStudentsToSave: DeepPartial<StudentGroupStudentTypeormEntity>[] =
          []

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
          studentGroupStudentsToSave.push({
            student_id: { id: student.id },
            student_group_id: { id: studentGroupStudent.studentGroupId },
          })
        }

        const studentGroupStudentTypeormRepository =
          this.appDataSource.getRepository(StudentGroupStudentTypeormEntity)

        await studentGroupStudentTypeormRepository.save(
          studentGroupStudentsToSave,
        )
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to create StudentGroupStudentTypeormEntity`,
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
