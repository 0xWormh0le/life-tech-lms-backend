import { DataSource, In, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import { StudentGroupTypeormEntity } from '../../../../../typeorm/entity/StudentGroup'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import {
  MaintenanceGetStudentGroupsUseCase,
  IStudentGroupRepository,
} from '../../../../../../domain/usecases/maintenance/StudentGroup/MaintenanceGetStudentGroupsUseCase'
import { StudentGroupPackageAssignmentTypeormEntity } from '../../../../../typeorm/entity/StudentGroupPackageAssignment'

type Response =
  | Paths.MaintenanceGetStudentGroups.Responses.$200
  | Paths.MaintenanceGetStudentGroups.Responses.$500

export class MaintenanceGetStudentGroupsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<undefined, undefined, undefined, Response> = async () => {
    const maintenanceGetStudentGroupsUseCase =
      new MaintenanceGetStudentGroupsUseCase({
        getAllStudentGroups: this.getAllStudentGroups,
      })
    const getStudentGroupsResult =
      await maintenanceGetStudentGroupsUseCase.run()

    if (getStudentGroupsResult.hasError) {
      const response500: Paths.MaintenanceGetStudentGroups.Responses.$500 = {
        error: JSON.stringify(getStudentGroupsResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenanceGetStudentGroups.Responses.$200 = {
      studentGroups: getStudentGroupsResult.value.map((e) => ({
        id: e.id,
        organizationId: e.organizationId,
        name: e.name,
        codeillusionPackageId: e.codeillusionPackageId,
        csePackageId: e.csePackageId ?? undefined,
        grade: e.grade,
        studentGroupLmsId: e.studentGroupLmsId ?? undefined,
      })),
    }

    return { statusCode: 200, response: response200 }
  }

  private getAllStudentGroups: IStudentGroupRepository['getAllStudentGroups'] =
    async () => {
      let studentGroupTypeormRepository: Repository<StudentGroupTypeormEntity>
      let studentGroupPackageAssignmentTypeormEntity: Repository<StudentGroupPackageAssignmentTypeormEntity>
      let studentGroups: StudentGroupTypeormEntity[]
      const studentGroupAssignPackage: Record<
        string,
        {
          id: string
          codeillusionPackageId: string
          csePackageId: string
        }
      > = {}

      try {
        studentGroupTypeormRepository = this.appDataSource.getRepository(
          StudentGroupTypeormEntity,
        )
        studentGroups = await studentGroupTypeormRepository.find({
          order: {
            created_date: 'ASC',
          },
          relations: ['organization_id'],
        })
        studentGroupPackageAssignmentTypeormEntity =
          this.appDataSource.getRepository(
            StudentGroupPackageAssignmentTypeormEntity,
          )

        const studentGroupsPackageAssigned =
          await studentGroupPackageAssignmentTypeormEntity.find()

        if (studentGroupsPackageAssigned.length > 0) {
          studentGroupsPackageAssigned.forEach((item) => {
            if (studentGroupAssignPackage[item.student_group_id]) {
              if (item.package_category_id === 'codex') {
                studentGroupAssignPackage[item.student_group_id] = {
                  ...studentGroupAssignPackage[item.student_group_id],
                  codeillusionPackageId: item.package_id,
                }
              } else {
                studentGroupAssignPackage[item.student_group_id] = {
                  ...studentGroupAssignPackage[item.student_group_id],
                  csePackageId: item.package_id,
                }
              }
            } else {
              studentGroupAssignPackage[item.student_group_id] = {
                id: item.student_group_id,
                codeillusionPackageId:
                  item.package_category_id === 'codeillusion'
                    ? item.package_id
                    : '',
                csePackageId:
                  item.package_category_id === 'cse' ? item.package_id : '',
              }
            }
          })
        }
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
        value: studentGroups.map((e) => {
          return {
            id: e.id,
            name: e.name,
            grade: e.grade ?? '',
            organizationId: e.organization_id.id,
            codeillusionPackageId:
              studentGroupAssignPackage[e.id] &&
              studentGroupAssignPackage[e.id].codeillusionPackageId
                ? studentGroupAssignPackage[e.id].codeillusionPackageId
                : '',
            csePackageId:
              studentGroupAssignPackage[e.id] &&
              studentGroupAssignPackage[e.id].csePackageId
                ? studentGroupAssignPackage[e.id].csePackageId
                : '',
            studentGroupLmsId: e.student_group_lms_id ?? null,
          }
        }),
      }
    }
}
