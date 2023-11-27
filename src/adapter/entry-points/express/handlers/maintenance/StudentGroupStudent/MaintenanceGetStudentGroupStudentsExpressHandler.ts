import { DataSource, In, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import { StudentGroupStudentTypeormEntity } from '../../../../../typeorm/entity/StudentGroupStudent'
import {
  fromNativeError,
  ValueTypeOfPromiseErroableFunc,
} from '../../../../../../domain/usecases/shared/Errors'
import {
  MaintenanceGetStudentGroupStudentsUseCase,
  IStudentGroupStudentRepository,
} from '../../../../../../domain/usecases/maintenance/StudentGroupStudent/MaintenanceGetStudentGroupStudentsUseCase'
import { StudentTypeormEntity } from '../../../../../typeorm/entity/Student'

type Response =
  | Paths.MaintenanceGetStudentGroupStudents.Responses.$200
  | Paths.MaintenanceGetStudentGroupStudents.Responses.$500

export class MaintenanceGetStudentGroupStudentsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<undefined, undefined, undefined, Response> = async () => {
    const maintenanceGetStudentGroupStudentsUseCase =
      new MaintenanceGetStudentGroupStudentsUseCase({
        getAllStudentGroupStudents: this.getAllStudentGroupStudents,
      })
    const getStudentGroupStudentsResult =
      await maintenanceGetStudentGroupStudentsUseCase.run()

    if (getStudentGroupStudentsResult.hasError) {
      const response500: Paths.MaintenanceGetStudentGroupStudents.Responses.$500 =
        {
          error: JSON.stringify(getStudentGroupStudentsResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenanceGetStudentGroupStudents.Responses.$200 =
      {
        studentGroupStudents: getStudentGroupStudentsResult.value,
      }

    return { statusCode: 200, response: response200 }
  }

  private getAllStudentGroupStudents: IStudentGroupStudentRepository['getAllStudentGroupStudents'] =
    async () => {
      let studentGroupStudents: StudentGroupStudentTypeormEntity[]
      let students: StudentTypeormEntity[]

      try {
        const studentGroupStudentTypeormRepository =
          this.appDataSource.getRepository(StudentGroupStudentTypeormEntity)

        studentGroupStudents = await studentGroupStudentTypeormRepository.find({
          order: {
            created_date: 'ASC',
          },
          relations: ['student_id', 'student_group_id'],
        })

        const studentIds: string[] = []

        for (const studentGroupStudent of studentGroupStudents) {
          if (!studentGroupStudent.student_id) {
            return {
              hasError: true,
              error: {
                type: 'UnknownRuntimeError',
                message: `studentGroupStudent.student_id is undefined some how student_group_id ${JSON.stringify(
                  studentGroupStudent.student_group_id,
                )}`,
              },
              value: null,
            }
          }
          studentIds.push(studentGroupStudent.student_id.id)
        }

        const studentTypeormRepository =
          this.appDataSource.getRepository(StudentTypeormEntity)

        students = await studentTypeormRepository.find({
          where: {
            id: In(studentIds),
          },
        })
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to get StudentGroupStudentTypeormEntity`,
          ),
          value: null,
        }
      }

      const value: ValueTypeOfPromiseErroableFunc<
        IStudentGroupStudentRepository['getAllStudentGroupStudents']
      > = []
      const studentUserIdMap: { [adminisratorId: string]: string } = {}

      for (const student of students) {
        studentUserIdMap[student.id] = student.user_id
      }
      for (const studentGroupStudent of studentGroupStudents) {
        const userId = studentUserIdMap[studentGroupStudent.student_id.id]

        if (!userId) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `corresponding userId not found for studentId ${studentGroupStudent.student_id.id} somehow`,
            },
            value: null,
          }
        }
        value.push({
          studentGroupId: studentGroupStudent.student_group_id.id,
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
