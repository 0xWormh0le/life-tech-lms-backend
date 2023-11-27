import { DataSource } from 'typeorm'

import { StudentGroupPackageAssignment } from '../../domain/entities/codex/StudentGroupPackageAssignment'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { StudentGroupPackageAssignmentTypeormEntity } from '../typeorm/entity/StudentGroupPackageAssignment'

export class StudentGroupPackageAssignmentRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getAllByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError', string>>
  > {
    try {
      const studentGroupPackageAssignmentTypeormRepository =
        this.typeormDataSource.getRepository(
          StudentGroupPackageAssignmentTypeormEntity,
        )
      const studentGroupPackageAssignments =
        await studentGroupPackageAssignmentTypeormRepository.find({
          where: {
            student_group_id: studentGroupId,
          },
          order: {
            created_date: 'ASC',
          },
        })

      return {
        hasError: false,
        error: null,
        value: studentGroupPackageAssignments.map((e) => ({
          packageCategoryId: e.package_category_id,
          packageId: e.package_id,
          studentGroupId: e.student_group_id,
        })),
      }
    } catch (e) {
      return {
        hasError: true,
        error: fromNativeError('UnknownRuntimeError', e as Error),
        value: null,
      }
    }
  }
}
