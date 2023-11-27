import { E, Errorable } from '../../shared/Errors'
import { StudentGroupPackageAssignment } from '../../../entities/codex/StudentGroupPackageAssignment'
import { GetStudentGroupPackageAssignmentsUseCase, IStudentGroupPackageAssignmentRepository } from './GetStudentGroupPackageAssignmentsUseCase'

describe('test GetStudentGroupPackageAssignmentsUseCase', () => {
  test('sucess', async () => {
    const studentGroupPackageAssignmentRepository: IStudentGroupPackageAssignmentRepository = {
      getAllByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              packageCategoryId: 'packageCategoryId-1',
              studentGroupId: 'studentGroupId-1',
              packageId: 'packageId-1',
            },
            {
              packageCategoryId: 'packageCategoryId-2',
              studentGroupId: 'studentGroupId-2',
              packageId: 'packageId-2',
            },
          ],
        }
      }),
    }
    const usecase = new GetStudentGroupPackageAssignmentsUseCase(studentGroupPackageAssignmentRepository)
    const usecaseResult = await usecase.run('studentGroupId')

    if (usecaseResult.hasError) {
      throw new Error(`failed to run usecase ${usecaseResult.error}`)
    }
    expect(usecaseResult.value).toEqual<typeof usecaseResult.value>([
      {
        packageCategoryId: 'packageCategoryId-1',
        studentGroupId: 'studentGroupId-1',
        packageId: 'packageId-1',
      },
      {
        packageCategoryId: 'packageCategoryId-2',
        studentGroupId: 'studentGroupId-2',
        packageId: 'packageId-2',
      },
    ])
  })

  test('failed with studentGroupPackageAssignmentRepository spits UnknownRuntimeError', async () => {
    const studentGroupPackageAssignmentRepository: IStudentGroupPackageAssignmentRepository = {
      getAllByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'UnknownRuntimeError',
          },
          value: null,
        }
      }),
    }
    const usecase = new GetStudentGroupPackageAssignmentsUseCase(studentGroupPackageAssignmentRepository)
    const usecaseResult = await usecase.run('studentGroupId')

    expect(usecaseResult.error?.type).toEqual('UnknownRuntimeError')
  })
})
