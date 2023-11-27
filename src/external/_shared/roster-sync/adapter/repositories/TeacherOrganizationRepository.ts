/* eslint-disable no-type-assertion/no-type-assertion */
import { v4 as uuid } from 'uuid'
import { DataSource } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import {
  Errorable,
  E,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'

import { TeacherOrganizationTypeormEntity } from '../../../../../adapter/typeorm/entity/TeacherOrganization'
import { ITeacherOrganizationRepository } from '../../domain//usecases/RosterSync'
import { TeacherOrganization } from '../../domain//entities/TeacherOrganization'

export class TeacherOrganizationRepository
  implements ITeacherOrganizationRepository
{
  constructor(private typeormDataSource: DataSource) {}

  async issueId(): Promise<
    Errorable<string, E<'UnknownRuntimeError', string>>
  > {
    return successErrorable(uuid())
  }

  async getAllByOrganizationId(
    organizationId: string,
  ): Promise<
    Errorable<TeacherOrganization[], E<'UnknownRuntimeError', string>>
  > {
    const teacherOrganizationTypeormRepository =
      this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)

    try {
      const organizationTeachers: TeacherOrganization[] =
        await teacherOrganizationTypeormRepository
          .createQueryBuilder()
          .where('organization_id = :organizationId', { organizationId })
          .select('teacher_id', 'teacherId')
          .addSelect('organization_id', 'organizationId')
          .getRawMany()

      return {
        hasError: false,
        error: null,
        value: organizationTeachers,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get teachers of Life Is Tech portal for organization id: ${organizationId}. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async createTeacherOrganizations(
    teacherOrganizations: TeacherOrganization[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    const teacherOrganizationTypeormRepository =
      this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)

    try {
      const teacherOrganizationsData: {
        teacher: string
        organization: string
      }[] = []

      teacherOrganizations.forEach((teacherOrganization) => {
        teacherOrganizationsData.push({
          organization: teacherOrganization.organizationId,
          teacher: teacherOrganization.teacherId,
        })
      })

      await teacherOrganizationTypeormRepository
        .createQueryBuilder('teacher_organization')
        .insert()
        .values(
          teacherOrganizationsData as QueryDeepPartialEntity<TeacherOrganizationTypeormEntity>[],
        )
        .execute()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to add teachers into organization of Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async deleteTeacherOrganizations(
    teacherOrganizations: TeacherOrganization[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    const teacherOrganizationTypeormRepository =
      this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)

    try {
      if (teacherOrganizations.length === 0) {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }

      for (const teacherOrganization of teacherOrganizations) {
        await teacherOrganizationTypeormRepository.delete({
          teacher: { id: teacherOrganization.teacherId },
          organization: { id: teacherOrganization.organizationId },
        })
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to delete teachers from organization of Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
