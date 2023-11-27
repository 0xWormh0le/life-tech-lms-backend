import { DataSource, DeepPartial, In, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import {
  MaintenanceCreateOrUpdateStudentGroupsUseCase,
  IStudentGroupRepository,
} from '../../../../../../domain/usecases/maintenance/StudentGroup/MaintenanceCreateOrUpdateStudentGroupsUseCase'
import { StudentGroupTypeormEntity } from '../../../../../typeorm/entity/StudentGroup'
import {
  E,
  Errorable,
  fromNativeError,
} from '../../../../../../domain/usecases/shared/Errors'
import { StudentGroupPackageAssignmentTypeormEntity } from '../../../../../typeorm/entity/StudentGroupPackageAssignment'
import { StudentGroupPackageAssignment } from '../../../../../../domain/entities/codex/StudentGroupPackageAssignment'
import { packagesMapById } from '../../../../../typeorm/hardcoded-data/Pacakges/Packages'

type Response =
  | Paths.MaintenancePutStudentGroups.Responses.$200
  | Paths.MaintenancePutStudentGroups.Responses.$500

export class MaintenanceCreateOrUpdateStudentGroupsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenancePutStudentGroups.RequestBody,
    Response
  > = async (params) => {
    const createOrUpdateStudentGroupsUseCase =
      new MaintenanceCreateOrUpdateStudentGroupsUseCase(
        {
          getStudentGroup: this.getStudentGroup,
          createStudentGroup: this.createStudentGroup,
          updateStudentGroup: this.updateStudentGroup,
        },
        {
          getStudentGroupPackageAssignmentsByStudentGroupId:
            this.getStudentGroupPackageAssignmentsByStudentGroupId,
          createStudentGroupPackageAssignment:
            this.createStudentGroupPackageAssignment,
          deleteStudentGroupPackageAssignment:
            this.deleteStudentGroupPackageAssignment,
        },
      )
    const createOrUpdateStudentGroupsResult =
      await createOrUpdateStudentGroupsUseCase.run(
        params.body.studentGroups.map((e) => ({
          ...e,
          id: e.id ?? null,
          csePackageId: e.csePackageId ?? null,
          studentGroupLmsId: e.studentGroupLmsId ?? null,
        })),
      )

    if (createOrUpdateStudentGroupsResult.hasError) {
      const response500: Paths.MaintenancePutStudentGroups.Responses.$500 = {
        error: JSON.stringify(createOrUpdateStudentGroupsResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenancePutStudentGroups.Responses.$200 = {
      ok: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }

  getStudentGroup: IStudentGroupRepository['getStudentGroup'] = async (
    studentGroupId,
  ) => {
    let studentGroups: StudentGroupTypeormEntity[]
    let findStudentGroupPackageAssignment: StudentGroupPackageAssignmentTypeormEntity[]

    try {
      const studentGroupTypeormRepository = this.appDataSource.getRepository(
        StudentGroupTypeormEntity,
      )
      const studentGroupPackageAssignmentTypeormEntity =
        this.appDataSource.getRepository(
          StudentGroupPackageAssignmentTypeormEntity,
        )

      studentGroups = await studentGroupTypeormRepository.find({
        where: { id: studentGroupId },
        order: {
          created_date: 'ASC',
        },
        relations: ['organization_id'],
      })
      findStudentGroupPackageAssignment =
        await studentGroupPackageAssignmentTypeormEntity.find({
          where: {
            student_group_id: studentGroupId,
          },
        })
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get StudentGroupTypeormEntity`,
        ),
        value: null,
      }
    }

    if (studentGroups.length === 0) {
      return {
        hasError: false,
        error: null,
        value: null,
      }
    }

    const studentGroup = studentGroups[0]
    const codeillusionPackage = findStudentGroupPackageAssignment.find(
      (item) => item.package_category_id === 'codeillusion',
    )
    const csePackage = findStudentGroupPackageAssignment.find(
      (item) => item.package_category_id === 'cse',
    )

    return {
      hasError: false,
      error: null,
      value: {
        id: studentGroup.id,
        name: studentGroup.name,
        grade: studentGroup.grade,
        organizationId: studentGroup.organization_id.id,
        codeillusionPackageId: codeillusionPackage?.package_id ?? '',
        csePackageId: csePackage?.package_id ?? null,
        studentGroupLmsId: studentGroup.student_group_lms_id ?? null,
      },
    }
  }

  createStudentGroup: IStudentGroupRepository['createStudentGroup'] = async (
    studentGroup,
  ) => {
    let createdStudentGroup: StudentGroupTypeormEntity

    try {
      const studentGroupTypeormRepository = this.appDataSource.getRepository(
        StudentGroupTypeormEntity,
      )
      const studentGroupPackageAssignmentTypeormEntity =
        this.appDataSource.getRepository(
          StudentGroupPackageAssignmentTypeormEntity,
        )

      createdStudentGroup = await studentGroupTypeormRepository.save({
        name: studentGroup.name,
        grade: studentGroup.grade,
        organization_id: { id: studentGroup.organizationId },
        student_group_lms_id: studentGroup.studentGroupLmsId ?? undefined,
      })

      if (studentGroup.codeillusionPackageId) {
        const packageCategoryId =
          packagesMapById[studentGroup.codeillusionPackageId]
            .packageCategoryId ?? ''

        if (packageCategoryId) {
          await studentGroupPackageAssignmentTypeormEntity.save({
            package_id: studentGroup.codeillusionPackageId,
            package_category_id: packageCategoryId,
            student_group_id: createdStudentGroup.id,
          })
        }
      }

      if (studentGroup.csePackageId) {
        const packageCategoryId =
          packagesMapById[studentGroup.csePackageId].packageCategoryId

        if (packageCategoryId) {
          await studentGroupPackageAssignmentTypeormEntity.save({
            package_id: studentGroup.csePackageId,
            package_category_id: packageCategoryId,
            student_group_id: createdStudentGroup.id,
          })
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to create StudentGroupTypeormEntity`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: {
        id: createdStudentGroup.id,
        name: createdStudentGroup.name,
        grade: createdStudentGroup.grade,
        organizationId: createdStudentGroup.organization_id.id,
        codeillusionPackageId: studentGroup.codeillusionPackageId ?? undefined,
        studentGroupLmsId: createdStudentGroup.student_group_lms_id ?? null,
      },
    }
  }

  updateStudentGroup: IStudentGroupRepository['updateStudentGroup'] = async (
    studentGroup,
  ) => {
    try {
      const studentGroupTypeormRepository = this.appDataSource.getRepository(
        StudentGroupTypeormEntity,
      )

      await studentGroupTypeormRepository.save({
        id: studentGroup.id,
        name: studentGroup.name,
        grade: studentGroup.grade,
        organization_id: { id: studentGroup.organizationId },
        student_group_lms_id: studentGroup.studentGroupLmsId ?? undefined,
      })

      const studentGroupPackageAssignmentTypeormEntity =
        this.appDataSource.getRepository(
          StudentGroupPackageAssignmentTypeormEntity,
        )

      if (studentGroup.codeillusionPackageId) {
        const packageCategoryId =
          (packagesMapById[studentGroup.codeillusionPackageId] &&
            packagesMapById[studentGroup.codeillusionPackageId]
              .packageCategoryId) ??
          ''

        if (packageCategoryId) {
          const findStudentGroupPackageAssignment =
            await studentGroupPackageAssignmentTypeormEntity.findOneBy({
              package_category_id: packageCategoryId,
              student_group_id: studentGroup.id,
            })

          if (findStudentGroupPackageAssignment) {
            await studentGroupPackageAssignmentTypeormEntity.update(
              {
                id: findStudentGroupPackageAssignment.id,
              },
              {
                package_id: studentGroup.codeillusionPackageId,
              },
            )
          } else {
            await studentGroupPackageAssignmentTypeormEntity.save({
              package_id: studentGroup.codeillusionPackageId,
              student_group_id: studentGroup.id,
              package_category_id: packageCategoryId,
            })
          }
        }
      }

      if (studentGroup.csePackageId) {
        const packageCategoryId =
          (packagesMapById[studentGroup.csePackageId] &&
            packagesMapById[studentGroup.csePackageId].packageCategoryId) ??
          ''

        if (packageCategoryId) {
          const findStudentGroupPackageAssignment =
            await studentGroupPackageAssignmentTypeormEntity.findOneBy({
              package_category_id: packageCategoryId,
              student_group_id: studentGroup.id,
            })

          if (findStudentGroupPackageAssignment) {
            await studentGroupPackageAssignmentTypeormEntity.update(
              {
                id: findStudentGroupPackageAssignment.id,
              },
              {
                package_id: studentGroup.csePackageId,
              },
            )
          } else {
            await studentGroupPackageAssignmentTypeormEntity.save({
              package_id: studentGroup.csePackageId,
              student_group_id: studentGroup.id,
              package_category_id: packageCategoryId,
            })
          }
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to create StudentGroupTypeormEntity`,
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

  getStudentGroupPackageAssignmentsByStudentGroupId: (
    studentGroupId: string,
  ) => Promise<
    Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError', string>>
  > = async (studentGroupId) => {
    let studentGroupPackageAssignments: StudentGroupPackageAssignmentTypeormEntity[]

    try {
      const studentGroupPackageAssignmentTypeormRepository =
        this.appDataSource.getRepository(
          StudentGroupPackageAssignmentTypeormEntity,
        )

      studentGroupPackageAssignments =
        await studentGroupPackageAssignmentTypeormRepository.find({
          where: { student_group_id: studentGroupId },
          order: {
            created_date: 'ASC',
          },
        })
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get StudentGroupTypeormEntity`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: studentGroupPackageAssignments.map((e) => ({
        packageCategoryId: e.package_category_id,
        packageId: e.package_id,
        studentGroupId: e.student_group_id,
      })),
    }
  }

  createStudentGroupPackageAssignment: (
    studentGroupPackageAssignment: StudentGroupPackageAssignment,
  ) => Promise<Errorable<void, E<'UnknownRuntimeError', string>>> = async (
    studentGroupPackageAssignment,
  ) => {
    try {
      const studentGroupPackageAssignmentTypeormRepository =
        this.appDataSource.getRepository(
          StudentGroupPackageAssignmentTypeormEntity,
        )

      await studentGroupPackageAssignmentTypeormRepository.save({
        package_category_id: studentGroupPackageAssignment.packageCategoryId,
        package_id: studentGroupPackageAssignment.packageId,
        student_group_id: studentGroupPackageAssignment.studentGroupId,
      })
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to create StudentGroupTypeormEntity`,
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

  deleteStudentGroupPackageAssignment: (
    studentGroupPackageAssignment: StudentGroupPackageAssignment,
  ) => Promise<Errorable<void, E<'UnknownRuntimeError', string>>> = async (
    studentGroupPackageAssignment,
  ) => {
    try {
      const studentGroupPackageAssignmentTypeormRepository =
        this.appDataSource.getRepository(
          StudentGroupPackageAssignmentTypeormEntity,
        )

      await studentGroupPackageAssignmentTypeormRepository.delete({
        package_category_id: studentGroupPackageAssignment.packageCategoryId,
        package_id: studentGroupPackageAssignment.packageId,
        student_group_id: studentGroupPackageAssignment.studentGroupId,
      })
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to create StudentGroupTypeormEntity`,
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
