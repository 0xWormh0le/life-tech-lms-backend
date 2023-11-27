import { DataSource } from 'typeorm'
import { TeacherOrganization } from '../../domain/entities/codex/TeacherOrganization'
import { E, Errorable } from '../../domain/usecases/shared/Errors'
import { TeacherOrganizationTypeormEntity } from '../typeorm/entity/TeacherOrganization'

export class TeacherOrganizationRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getAllByTeacherId(
    teacherid: string,
  ): Promise<
    Errorable<TeacherOrganization[], E<'UnknownRuntimeError', string>>
  > {
    try {
      const teacherOrganizationTypeormRepository =
        this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)
      const teacherOrganizations =
        await teacherOrganizationTypeormRepository.find({
          where: {
            teacher: { id: teacherid },
          },
          relations: ['teacher', 'organization'],
        })

      return {
        hasError: false,
        error: null,
        value: teacherOrganizations.map((e) => ({
          teacherId: e.teacher.id,
          organizationId: e.organization.id,
        })),
      }
    } catch (e) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `failed to get teacherOrganizations for teacherId ${teacherid} ${JSON.stringify(
            e,
          )}`,
        },
        value: null,
      }
    }
  }
}
