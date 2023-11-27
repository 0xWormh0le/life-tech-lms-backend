import { MaintenanceStudentGroupStudent } from '../../../entities/maintenance/StudentGroupStudent'
import { E, Errorable } from '../../shared/Errors'
import { MaintenanceGetStudentGroupStudentsUseCase, IStudentGroupStudentRepository } from './MaintenanceGetStudentGroupStudentsUseCase'

describe('test MaintenanceGetStudentGroupStudentsUseCase', () => {
  test('success', async () => {
    const studentGroupStudentRepository: IStudentGroupStudentRepository = {
      getAllStudentGroupStudents: jest.fn(async function (): Promise<Errorable<MaintenanceStudentGroupStudent[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              userId: 'student-id-1',
              studentGroupId: 'studentGroup-id-1',
            },
            {
              userId: 'student-id-1',
              studentGroupId: 'studentGroup-id-2',
            },
            {
              userId: 'student-id-2',
              studentGroupId: 'studentGroup-id-2',
            },
            {
              userId: 'student-id-3',
              studentGroupId: 'studentGroup-id-3',
            },
          ],
        }
      }),
    }

    const usecase = new MaintenanceGetStudentGroupStudentsUseCase(studentGroupStudentRepository)

    const result = await usecase.run()

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual([
      {
        userId: 'student-id-1',
        studentGroupId: 'studentGroup-id-1',
      },
      {
        userId: 'student-id-1',
        studentGroupId: 'studentGroup-id-2',
      },
      {
        userId: 'student-id-2',
        studentGroupId: 'studentGroup-id-2',
      },
      {
        userId: 'student-id-3',
        studentGroupId: 'studentGroup-id-3',
      },
    ])
  })

  test('fail with getAllStudentGroupStudents occurs error', async () => {})
})
