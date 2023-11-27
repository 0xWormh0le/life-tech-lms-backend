import { MaintenanceStudentGroup } from '../../../entities/maintenance/StudentGroup'
import { MaintenanceStudentGroupPackageAssignment } from '../../../entities/maintenance/StudentGroupPackageAssignment'
import { E, Errorable } from '../../shared/Errors'
import {
  MaintenanceCreateOrUpdateStudentGroupsUseCase,
  IStudentGroupRepository,
  IStudentGroupPackageAssignmentRepository,
} from './MaintenanceCreateOrUpdateStudentGroupsUseCase'

describe('test MaintenanceCreateOrUpdateStudentGroupsUseCase', () => {
  test('success', async () => {
    const requestedStudentGroups: Parameters<MaintenanceCreateOrUpdateStudentGroupsUseCase['run']>[0] = [
      {
        id: null, // will be created as id-new1
        organizationId: 'organization-id',
        codeillusionPackageId: 'codeillusionPackageId-1', // will be created
        csePackageId: 'csePackageId-1', // will be created
        grade: '4',
        name: 'StudentGroup-1',
        studentGroupLmsId: 'student-group-lms-id-1',
      },
      {
        id: 'StudentGroup-id-2', // will be updated
        organizationId: 'organization-id',
        codeillusionPackageId: 'codeillusionPackageId-2', // will be created
        csePackageId: null,
        grade: '4',
        name: 'StudentGroup-2',
        studentGroupLmsId: null,
      },
      {
        id: 'StudentGroup-id-3', // will be updated
        organizationId: 'organization-id',
        codeillusionPackageId: 'codeillusionPackageId-3', // will be created
        csePackageId: 'csePackageId-3', // will be created
        grade: '4',
        name: 'StudentGroup-3',
        studentGroupLmsId: null,
      },
      {
        id: null, // will be created as id-new2
        organizationId: 'organization-id',
        codeillusionPackageId: 'codeillusionPackageId-4', // will be created
        csePackageId: null,
        grade: '4',
        name: 'StudentGroup-4',
        studentGroupLmsId: null,
      },
      {
        id: 'StudentGroup-id-5', // will be updated
        organizationId: 'organization-id',
        codeillusionPackageId: 'codeillusionPackageId-5', // will be created
        csePackageId: 'csePackageId-5', // will be created
        grade: '4',
        name: 'StudentGroup-5',
        studentGroupLmsId: null,
      },
      {
        id: null, // will be created as id-new3
        organizationId: 'organization-id',
        codeillusionPackageId: 'codeillusionPackageId-6', // will be created
        csePackageId: null,
        grade: '4',
        name: 'StudentGroup-6',
        studentGroupLmsId: null,
      },
    ]
    const StudentGroupRepository: IStudentGroupRepository = {
      getStudentGroup: jest.fn(async function (studentGroupId: string): Promise<Errorable<MaintenanceStudentGroup, E<'UnknownRuntimeError', string>>> {
        switch (studentGroupId) {
          case 'StudentGroup-id-2':
            return {
              hasError: false,
              error: null,
              value: {
                id: 'StudentGroup-id-2',
                organizationId: 'organization-id',
                codeillusionPackageId: 'codeillusionPackageId',
                csePackageId: 'csePackageId',
                grade: '4',
                name: 'StudentGroup-2-old',
                studentGroupLmsId: null,
              },
            }
          case 'StudentGroup-id-3':
            return {
              hasError: false,
              error: null,
              value: {
                id: 'StudentGroup-id-3',
                organizationId: 'organization-id',
                codeillusionPackageId: 'codeillusionPackageId',
                csePackageId: 'csePackageId',
                grade: '4',
                name: 'StudentGroup-3-old',
                studentGroupLmsId: null,
              },
            }
          case 'StudentGroup-id-5':
            return {
              hasError: false,
              error: null,
              value: {
                id: 'StudentGroup-id-3',
                organizationId: 'organization-id',
                codeillusionPackageId: 'codeillusionPackageId',
                csePackageId: 'csePackageId',
                grade: '4',
                name: 'StudentGroup-3-old',
                studentGroupLmsId: null,
              },
            }
          default:
            throw new Error(`unexpected student group id ${studentGroupId}`)
        }
      }),
      createStudentGroup: jest
        .fn<ReturnType<IStudentGroupRepository['createStudentGroup']>, Parameters<IStudentGroupRepository['createStudentGroup']>>()
        .mockReturnValueOnce(
          Promise.resolve({
            hasError: false,
            error: null,
            value: {
              id: 'StudentGroup-id-new1',
            },
          }),
        )
        .mockReturnValueOnce(
          Promise.resolve({
            hasError: false,
            error: null,
            value: {
              id: 'StudentGroup-id-new2',
            },
          }),
        )
        .mockReturnValueOnce(
          Promise.resolve({
            hasError: false,
            error: null,
            value: {
              id: 'StudentGroup-id-new3',
            },
          }),
        ),
      updateStudentGroup: jest.fn(async function (
        studentGroup: MaintenanceStudentGroup,
      ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError', string>, string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const studentGroupPackageAssignmentRepository: IStudentGroupPackageAssignmentRepository = {
      getStudentGroupPackageAssignmentsByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<MaintenanceStudentGroupPackageAssignment[], E<'UnknownRuntimeError', string>>> {
        switch (studentGroupId) {
          case 'StudentGroup-id-new1':
            // student group will be created with cse
            return {
              hasError: false,
              error: null,
              value: [],
            }
          case 'StudentGroup-id-2':
            // student group will be updated without cse
            return {
              hasError: false,
              error: null,
              value: [
                {
                  // will be deleted
                  packageCategoryId: 'packageCategoryId-2',
                  packageId: 'packageCategoryId-2',
                  studentGroupId: 'StudentGroup-id-2',
                },
              ],
            }
          case 'StudentGroup-id-3':
            // student group will be updated with cse
            return {
              hasError: false,
              error: null,
              value: [
                {
                  // will be deleted
                  packageCategoryId: 'packageCategoryId-3-1',
                  packageId: 'packageCategoryId-3-1',
                  studentGroupId: 'StudentGroup-id-3',
                },
                {
                  // will be deleted
                  packageCategoryId: 'packageCategoryId-3-2',
                  packageId: 'packageCategoryId-3-2',
                  studentGroupId: 'StudentGroup-id-3',
                },
              ],
            }
          case 'StudentGroup-id-new2':
            // student group will be created without cse
            return {
              hasError: false,
              error: null,
              value: [],
            }
          case 'StudentGroup-id-5':
            // student group will be updated with cse
            return {
              hasError: false,
              error: null,
              value: [
                {
                  // will be deleted
                  packageCategoryId: 'packageCategoryId-5',
                  packageId: 'packageCategoryId-5',
                  studentGroupId: 'StudentGroup-id-5',
                },
              ],
            }
          case 'StudentGroup-id-new3':
            // student group will be updated without cse
            return {
              hasError: false,
              error: null,
              value: [
                {
                  // will be deleted
                  packageCategoryId: 'packageCategoryId-new3-1',
                  packageId: 'packageCategoryId-new3-1',
                  studentGroupId: 'StudentGroup-id-new3',
                },
                {
                  // will be deleted
                  packageCategoryId: 'packageCategoryId-new3-2',
                  packageId: 'packageCategoryId-new3-2',
                  studentGroupId: 'StudentGroup-id-new3',
                },
              ],
            }
          default:
            throw new Error(`unexpected studentGroupId ${JSON.stringify(studentGroupId)}`)
        }
      }),
      createStudentGroupPackageAssignment: jest.fn(async function (
        studentGroupPackageAssignment: MaintenanceStudentGroupPackageAssignment,
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      deleteStudentGroupPackageAssignment: jest.fn(async function (
        studentGroupPackageAssignment: MaintenanceStudentGroupPackageAssignment,
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new MaintenanceCreateOrUpdateStudentGroupsUseCase(StudentGroupRepository, studentGroupPackageAssignmentRepository)

    const result = await usecase.run(requestedStudentGroups)

    expect(result.hasError).toEqual(false)

    const getStudentGroupsSpy = StudentGroupRepository.getStudentGroup as jest.Mock

    expect(getStudentGroupsSpy.mock.calls).toEqual<Parameters<typeof StudentGroupRepository.getStudentGroup>[]>([
      ['StudentGroup-id-2'],
      ['StudentGroup-id-3'],
      ['StudentGroup-id-5'],
    ])

    const createStudentGroupsSpy = StudentGroupRepository.createStudentGroup as jest.Mock

    expect(createStudentGroupsSpy.mock.calls).toEqual<
      (Omit<MaintenanceStudentGroup, 'id'> & {
        id: string | null
      })[][]
    >([
      [
        {
          id: null,
          organizationId: 'organization-id',
          grade: '4',
          codeillusionPackageId: 'codeillusionPackageId-1',
          csePackageId: 'csePackageId-1',
          name: 'StudentGroup-1',
          studentGroupLmsId: 'student-group-lms-id-1',
        },
      ],
      [
        {
          id: null,
          organizationId: 'organization-id',
          grade: '4',
          codeillusionPackageId: 'codeillusionPackageId-4',
          csePackageId: null,
          name: 'StudentGroup-4',
          studentGroupLmsId: null,
        },
      ],
      [
        {
          id: null,
          organizationId: 'organization-id',
          grade: '4',
          codeillusionPackageId: 'codeillusionPackageId-6',
          csePackageId: null,
          name: 'StudentGroup-6',
          studentGroupLmsId: null,
        },
      ],
    ])

    const updateStudentGroupsSpy = StudentGroupRepository.updateStudentGroup as jest.Mock

    expect(updateStudentGroupsSpy.mock.calls).toEqual<Parameters<typeof StudentGroupRepository.updateStudentGroup>[]>([
      [
        {
          id: 'StudentGroup-id-2',
          organizationId: 'organization-id',
          grade: '4',
          codeillusionPackageId: 'codeillusionPackageId-2',
          csePackageId: null,
          name: 'StudentGroup-2',
          studentGroupLmsId: null,
        },
      ],
      [
        {
          id: 'StudentGroup-id-3',
          organizationId: 'organization-id',
          grade: '4',
          codeillusionPackageId: 'codeillusionPackageId-3',
          csePackageId: 'csePackageId-3',
          name: 'StudentGroup-3',
          studentGroupLmsId: null,
        },
      ],
      [
        {
          id: 'StudentGroup-id-5',
          organizationId: 'organization-id',
          grade: '4',
          codeillusionPackageId: 'codeillusionPackageId-5',
          csePackageId: 'csePackageId-5',
          name: 'StudentGroup-5',
          studentGroupLmsId: null,
        },
      ],
    ])

    const deleteStudentGroupPackageAssignmentSpy = studentGroupPackageAssignmentRepository.deleteStudentGroupPackageAssignment as jest.Mock
    const deletedStudentGroupPackageAssignments: MaintenanceStudentGroupPackageAssignment[] = deleteStudentGroupPackageAssignmentSpy.mock.calls.map(
      (e) => e[0] as MaintenanceStudentGroupPackageAssignment,
    )

    for (const testCase of [
      {
        // will be deleted
        packageCategoryId: 'packageCategoryId-2',
        packageId: 'packageCategoryId-2',
        studentGroupId: 'StudentGroup-id-2',
      },
      {
        // will be deleted
        packageCategoryId: 'packageCategoryId-3-1',
        packageId: 'packageCategoryId-3-1',
        studentGroupId: 'StudentGroup-id-3',
      },
      {
        // will be deleted
        packageCategoryId: 'packageCategoryId-3-2',
        packageId: 'packageCategoryId-3-2',
        studentGroupId: 'StudentGroup-id-3',
      },
      {
        // will be deleted
        packageCategoryId: 'packageCategoryId-5',
        packageId: 'packageCategoryId-5',
        studentGroupId: 'StudentGroup-id-5',
      },
      {
        // will be deleted
        packageCategoryId: 'packageCategoryId-new3-1',
        packageId: 'packageCategoryId-new3-1',
        studentGroupId: 'StudentGroup-id-new3',
      },
      {
        // will be deleted
        packageCategoryId: 'packageCategoryId-new3-2',
        packageId: 'packageCategoryId-new3-2',
        studentGroupId: 'StudentGroup-id-new3',
      },
    ]) {
      const targetStudentGroupPackageAssignments = deletedStudentGroupPackageAssignments.find(
        (e) => e.packageCategoryId === testCase.packageCategoryId && e.packageId === testCase.packageId && e.studentGroupId === testCase.studentGroupId,
      )

      expect(targetStudentGroupPackageAssignments).not.toBeUndefined()
    }

    const createStudentGroupPackageAssignmentSpy = studentGroupPackageAssignmentRepository.createStudentGroupPackageAssignment as jest.Mock
    const createdStudentGroupPackageAssignments: MaintenanceStudentGroupPackageAssignment[] = createStudentGroupPackageAssignmentSpy.mock.calls.map(
      (e) => e[0] as MaintenanceStudentGroupPackageAssignment,
    )

    console.log(JSON.stringify(createdStudentGroupPackageAssignments))
    for (const testCase of [
      // with cse
      { packageCategoryId: 'codeillusion', packageId: 'codeillusionPackageId-1', studentGroupId: 'StudentGroup-id-new1' },
      { packageCategoryId: 'cse', packageId: 'csePackageId-1', studentGroupId: 'StudentGroup-id-new1' },
      // without cse
      { packageCategoryId: 'codeillusion', packageId: 'codeillusionPackageId-2', studentGroupId: 'StudentGroup-id-2' },
      // with cse
      { packageCategoryId: 'codeillusion', packageId: 'codeillusionPackageId-3', studentGroupId: 'StudentGroup-id-3' },
      { packageCategoryId: 'cse', packageId: 'csePackageId-3', studentGroupId: 'StudentGroup-id-3' },
      // without cse
      { packageCategoryId: 'codeillusion', packageId: 'codeillusionPackageId-4', studentGroupId: 'StudentGroup-id-new2' },
      // with cse
      { packageCategoryId: 'codeillusion', packageId: 'codeillusionPackageId-5', studentGroupId: 'StudentGroup-id-5' },
      { packageCategoryId: 'cse', packageId: 'csePackageId-5', studentGroupId: 'StudentGroup-id-5' },
      // without cse
      { packageCategoryId: 'codeillusion', packageId: 'codeillusionPackageId-6', studentGroupId: 'StudentGroup-id-new3' },
    ]) {
      const targetStudentGroupPackageAssignments = createdStudentGroupPackageAssignments.find(
        (e) => e.packageCategoryId === testCase.packageCategoryId && e.packageId === testCase.packageId && e.studentGroupId === testCase.studentGroupId,
      )

      expect(
        targetStudentGroupPackageAssignments,
        `${JSON.stringify({
          packageCategoryId: testCase.packageCategoryId,
          packageId: testCase.packageId,
          studentGroupId: testCase.studentGroupId,
        })} is not included`,
      ).not.toBeUndefined()
    }
  })
})
