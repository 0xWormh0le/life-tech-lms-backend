import { DataSource } from 'typeorm'
import { StudentStudentGroup } from '../../domain/entities/codex/StudentStudentGroup'
import { E, Errorable } from '../../domain/usecases/shared/Errors'
import { StudentGroupStudentTypeormEntity } from '../typeorm/entity/StudentGroupStudent'

export class StudentStudentGroupRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getAllByStudentId(
    studentId: string,
  ): Promise<
    Errorable<StudentStudentGroup[], E<'UnknownRuntimeError', string>>
  > {
    try {
      const studentStudentGroupTypeormRepository =
        this.typeormDataSource.getRepository(StudentGroupStudentTypeormEntity)
      const studentStudentGroups =
        await studentStudentGroupTypeormRepository.find({
          where: {
            student_id: { id: studentId },
          },
          relations: ['student_id', 'student_group_id'],
        })

      return {
        hasError: false,
        error: null,
        value: studentStudentGroups.map((e) => ({
          studentId: e.student_id.id,
          studentGroupId: e.student_group_id.id,
        })),
      }
    } catch (e) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `failed to get studentStudentGroups for studentId ${studentId} ${JSON.stringify(
            e,
          )}`,
        },
        value: null,
      }
    }
  }
}
