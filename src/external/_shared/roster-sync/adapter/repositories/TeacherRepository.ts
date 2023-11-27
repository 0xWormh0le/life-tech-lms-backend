/* eslint-disable no-type-assertion/no-type-assertion */
import { v4 as uuid } from 'uuid'
import { DataSource, DeepPartial, In } from 'typeorm'

import {
  Errorable,
  E,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import { TeacherTypeormEntity } from '../../../../../adapter/typeorm/entity/Teacher'
import { TeacherOrganizationTypeormEntity } from '../../../../../adapter/typeorm/entity/TeacherOrganization'
import { ITeacherRepository } from '../../domain/usecases/RosterSync'
import { Teacher } from '../../domain/entities/Teacher'

export class TeacherRepository implements ITeacherRepository {
  constructor(private typeormDataSource: DataSource) {}

  async issueId(): Promise<
    Errorable<string, E<'UnknownRuntimeError', string>>
  > {
    return successErrorable(uuid())
  }

  async getAllByOrganizationId(
    organizationId: string,
  ): Promise<Errorable<Teacher[], E<'UnknownRuntimeError', string>>> {
    try {
      const teacherOrganizationTypeormEntity =
        this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)
      const teacherOrganizationsResult =
        await teacherOrganizationTypeormEntity.find({
          where: {
            organization: { id: organizationId },
          },
          order: {
            created_date: 'ASC',
          },
          relations: ['teacher'],
        })
      const teacherTypeormEntity =
        this.typeormDataSource.getRepository(TeacherTypeormEntity)
      const teachersResult = await teacherTypeormEntity.find({
        where: {
          id: In(teacherOrganizationsResult.map((e) => e.teacher.id)),
        },
        order: {
          created_date: 'ASC',
        },
      })
      const teacherData: Teacher[] = []

      for (const u of teachersResult) {
        teacherData.push({
          id: u.id,
          userId: u.user_id,
          firstName: u.first_name,
          lastName: u.last_name,
          teacherLMSId: u.teacher_lms_id,
          classlinkTenantId: u.classlink_tenant_id,
          isDeactivated: u.is_deactivated,
        })
      }

      return {
        hasError: false,
        error: null,
        value: teacherData,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get teachers in Life Is Tech portal for organization id: ${organizationId}. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async getAllByLmsId(
    lmsIds: string[],
    tenantId: string | null,
  ): Promise<Errorable<Teacher[], E<'UnknownRuntimeError', string>>> {
    try {
      const teacherTypeormEntity =
        this.typeormDataSource.getRepository(TeacherTypeormEntity)
      const teachersResult = await teacherTypeormEntity.find({
        where: {
          teacher_lms_id: In(lmsIds),
          classlink_tenant_id: tenantId ?? undefined,
        },
        order: {
          created_date: 'ASC',
        },
      })
      const teacherData: Teacher[] = []

      for (const u of teachersResult) {
        teacherData.push({
          id: u.id,
          userId: u.user_id,
          firstName: u.first_name,
          lastName: u.last_name,
          teacherLMSId: u.teacher_lms_id,
          classlinkTenantId: u.classlink_tenant_id,
          isDeactivated: u.is_deactivated,
        })
      }

      return {
        hasError: false,
        error: null,
        value: teacherData,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get teachers in Life Is Tech portal for lmsIds: ${JSON.stringify(
          lmsIds,
        )}. ${JSON.stringify(e)}`,
      )
    }
  }

  async createTeachers(
    teachers: Teacher[],
  ): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
    try {
      const teacherTypeormEntity =
        this.typeormDataSource.getRepository(TeacherTypeormEntity)
      const teachersToCreate: DeepPartial<TeacherTypeormEntity>[] =
        teachers.map((e) => ({
          id: e.id,
          user_id: e.userId,
          first_name: e.firstName,
          last_name: e.lastName,
          teacher_lms_id: e.teacherLMSId,
          classlink_tenant_id: e.classlinkTenantId,
          is_deactivated: e.isDeactivated,
        }))
      const createResult = await teacherTypeormEntity.save(teachersToCreate)

      return {
        hasError: false,
        error: null,
        value: createResult.map((e) => ({
          id: e.id,
          userId: e.user_id,
          firstName: e.first_name,
          lastName: e.last_name,
          teacherLMSId: e.teacher_lms_id,
          classlinkTenantId: e.classlink_tenant_id,
          isDeactivated: e.is_deactivated,
        })),
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to create teachers into Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async updateTeachers(
    teachers: Teacher[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    try {
      const teacherTypeormEntity =
        this.typeormDataSource.getRepository(TeacherTypeormEntity)
      const teachersToUpdate: DeepPartial<TeacherTypeormEntity>[] =
        teachers.map((e) => ({
          id: e.id,
          user_id: e.userId,
          first_name: e.firstName,
          last_name: e.lastName,
          teacher_lms_id: e.teacherLMSId,
          classlink_tenant_id: e.classlinkTenantId,
          is_deactivated: e.isDeactivated,
        }))

      await teacherTypeormEntity.save(teachersToUpdate)

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to update teachers into Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async deleteTeachers(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    try {
      const teacherTypeormEntity =
        this.typeormDataSource.getRepository(TeacherTypeormEntity)

      await teacherTypeormEntity.update(
        { id: In(ids) },
        {
          is_deactivated: true,
        },
      )

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to deactivate teachers from Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
