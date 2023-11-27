import { MaintenanceStudentGroup } from '../../../entities/maintenance/StudentGroup'
import { MaintenanceStudentGroupPackageAssignment } from '../../../entities/maintenance/StudentGroupPackageAssignment'
import { E, Errorable } from '../../shared/Errors'

export interface IStudentGroupRepository {
  getStudentGroup(
    studentGroupId: string,
  ): Promise<
    Errorable<MaintenanceStudentGroup | null, E<'UnknownRuntimeError'>>
  >
  createStudentGroup(
    studentGroup: Omit<MaintenanceStudentGroup, 'id'>,
  ): Promise<
    Errorable<
      Pick<MaintenanceStudentGroup, 'id'>,
      E<'UnknownRuntimeError'> | E<'AlreadyExistError'>
    >
  >
  updateStudentGroup(
    studentGroup: MaintenanceStudentGroup,
  ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError'>>>>
}

export interface IStudentGroupPackageAssignmentRepository {
  getStudentGroupPackageAssignmentsByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<
      MaintenanceStudentGroupPackageAssignment[],
      E<'UnknownRuntimeError'>
    >
  >
  createStudentGroupPackageAssignment(
    studentGroupPackageAssignment: MaintenanceStudentGroupPackageAssignment,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  deleteStudentGroupPackageAssignment(
    studentGroupPackageAssignment: MaintenanceStudentGroupPackageAssignment,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export class MaintenanceCreateOrUpdateStudentGroupsUseCase {
  constructor(
    private StudentGroupRepository: IStudentGroupRepository,
    private studentGroupPackageAssignmentRepository: IStudentGroupPackageAssignmentRepository,
  ) {}

  async run(
    studentGroups: (Omit<MaintenanceStudentGroup, 'id'> & {
      id: string | null
    })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const studentGroupsToCreate: Omit<MaintenanceStudentGroup, 'id'>[] = []
    const studentGroupsToUpdate: MaintenanceStudentGroup[] = []

    for (const studentGroup of studentGroups) {
      if (!studentGroup.id) {
        studentGroupsToCreate.push(studentGroup)
      } else {
        const getExistingStudentGroupsResult =
          await this.StudentGroupRepository.getStudentGroup(studentGroup.id)

        if (getExistingStudentGroupsResult.hasError) {
          return getExistingStudentGroupsResult
        }

        if (getExistingStudentGroupsResult.value) {
          studentGroupsToUpdate.push({ ...studentGroup, id: studentGroup.id })
        } else {
          studentGroupsToCreate.push(studentGroup)
        }
      }
    }

    const createdStudentGroups: MaintenanceStudentGroup[] = []

    for (const studentGroupToCreate of studentGroupsToCreate) {
      const createStudentGroupsResult =
        await this.StudentGroupRepository.createStudentGroup(
          studentGroupToCreate,
        )

      if (createStudentGroupsResult.hasError) {
        return {
          hasError: true,
          error: {
            ...createStudentGroupsResult.error,
            type: 'UnknownRuntimeError',
          },
          value: null,
        }
      }
      createdStudentGroups.push({
        ...studentGroupToCreate,
        id: createStudentGroupsResult.value.id,
      })
    }

    for (const studentGroupToUpdate of studentGroupsToUpdate) {
      const updateStudentGroupsResult =
        await this.StudentGroupRepository.updateStudentGroup(
          studentGroupToUpdate,
        )

      if (updateStudentGroupsResult.hasError) {
        return {
          hasError: true,
          error: {
            ...updateStudentGroupsResult.error,
            type: 'UnknownRuntimeError',
          },
          value: null,
        }
      }
    }

    //
    // Assign package
    //
    for (const studentGroup of [
      ...createdStudentGroups,
      ...studentGroupsToUpdate,
    ]) {
      const getStudentGroupPackageAssignmentsByStudentGroupIdResult =
        await this.studentGroupPackageAssignmentRepository.getStudentGroupPackageAssignmentsByStudentGroupId(
          studentGroup.id,
        )

      if (getStudentGroupPackageAssignmentsByStudentGroupIdResult.hasError) {
        return {
          hasError: true,
          error: {
            ...getStudentGroupPackageAssignmentsByStudentGroupIdResult.error,
            type: 'UnknownRuntimeError',
          },
          value: null,
        }
      }
      for (const studentGroupPackageAssignmentToDelete of getStudentGroupPackageAssignmentsByStudentGroupIdResult.value) {
        const deleteStudentGroupPackageAssignmentResult =
          await this.studentGroupPackageAssignmentRepository.deleteStudentGroupPackageAssignment(
            studentGroupPackageAssignmentToDelete,
          )

        if (deleteStudentGroupPackageAssignmentResult.hasError) {
          return {
            hasError: true,
            error: {
              ...deleteStudentGroupPackageAssignmentResult.error,
              type: 'UnknownRuntimeError',
            },
            value: null,
          }
        }
      }

      const createStudentGroupPackageAssignmentResult =
        await this.studentGroupPackageAssignmentRepository.createStudentGroupPackageAssignment(
          {
            packageCategoryId: 'codeillusion',
            packageId: studentGroup.codeillusionPackageId,
            studentGroupId: studentGroup.id,
          },
        )

      if (createStudentGroupPackageAssignmentResult.hasError) {
        return {
          hasError: true,
          error: {
            ...createStudentGroupPackageAssignmentResult.error,
            type: 'UnknownRuntimeError',
          },
          value: null,
        }
      }

      if (studentGroup.csePackageId) {
        const createCseStudentGroupPackageAssignmentResult =
          await this.studentGroupPackageAssignmentRepository.createStudentGroupPackageAssignment(
            {
              packageCategoryId: 'cse',
              packageId: studentGroup.csePackageId,
              studentGroupId: studentGroup.id,
            },
          )

        if (createCseStudentGroupPackageAssignmentResult.hasError) {
          return {
            hasError: true,
            error: {
              ...createCseStudentGroupPackageAssignmentResult.error,
              type: 'UnknownRuntimeError',
            },
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
