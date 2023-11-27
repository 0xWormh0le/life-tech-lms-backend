/* eslint-disable no-type-assertion/no-type-assertion */
import { v4 as uuid } from 'uuid'
import { DataSource, DeepPartial } from 'typeorm'

import {
  Errorable,
  E,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import { StudentGroupTypeormEntity } from '../../../../../adapter/typeorm/entity/StudentGroup'
import { IStudentGroupRepository } from '../../domain//usecases/RosterSync'
import { StudentGroup } from '../../domain//entities/StudentGroup'

export class StudentGroupRepository implements IStudentGroupRepository {
  constructor(private typeormDataSource: DataSource) {}

  async issueId(): Promise<
    Errorable<string, E<'UnknownRuntimeError', string>>
  > {
    return successErrorable(uuid())
  }

  async getAllByOrganizationId(
    organizationId: string,
  ): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError', string>>> {
    try {
      const studentGroupTypeormRepository =
        this.typeormDataSource.getRepository(StudentGroupTypeormEntity)
      const studentGroupResult = await studentGroupTypeormRepository.find({
        where: {
          organization_id: { id: organizationId },
        },
        order: { created_date: 'ASC' },
        relations: ['organization_id'],
      })

      return {
        hasError: false,
        error: null,
        value: studentGroupResult.map((e) => ({
          id: e.id,
          name: e.name,
          organizationId: e.organization_id.id,
          studentGroupLmsId: e.student_group_lms_id,
          classlinkTenantId: e.classlink_tenant_id,
          grade: e.grade,
        })),
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get student groups in Life Is Tech portal for organization id: ${organizationId}. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async createStudentGroups(
    studentGroups: StudentGroup[],
  ): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError', string>>> {
    try {
      const studentGroupTypeormRepository =
        this.typeormDataSource.getRepository(StudentGroupTypeormEntity)
      const studentGroupData: DeepPartial<StudentGroupTypeormEntity>[] = []

      studentGroups.forEach((studentGroup) => {
        studentGroupData.push({
          id: studentGroup.id,
          organization_id: { id: studentGroup.organizationId },
          name: studentGroup.name,
          student_group_lms_id: studentGroup.studentGroupLmsId,
          classlink_tenant_id: studentGroup.classlinkTenantId,
          grade: studentGroup.grade,
        })
      })

      const data = await studentGroupTypeormRepository.save(studentGroupData)
      const res = data.map<StudentGroup>((studentGroup) => {
        return {
          id: studentGroup.id,
          organizationId: studentGroup.organization_id?.id ?? '',
          name: studentGroup.name,
          studentGroupLmsId: studentGroup.student_group_lms_id,
          classlinkTenantId: studentGroup.classlink_tenant_id,
          grade: studentGroup.grade,
        }
      })

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e) {
      return unknownRuntimeError(
        `Failed to create student groups into Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async updateStudentGroups(
    studentGroups: StudentGroup[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    try {
      const studentGroupTypeormRepository =
        this.typeormDataSource.getRepository(StudentGroupTypeormEntity)

      for (const studentGroup of studentGroups) {
        const studentGroupData = await studentGroupTypeormRepository.findOneBy({
          id: studentGroup.id,
        })

        if (studentGroupData == null) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `Failed to get student group in Life Is Tech portal for student group id: ${studentGroup.id}`,
            },
            value: null,
          }
        }

        await studentGroupTypeormRepository.update(
          { id: studentGroup.id },
          {
            name: studentGroup.name,
            student_group_lms_id: studentGroup.studentGroupLmsId,
            organization_id: { id: studentGroup.organizationId },
            classlink_tenant_id: studentGroup.classlinkTenantId,
            grade: studentGroup.grade,
          },
        )
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to update student groups into Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async deleteStudentGroups(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    if (ids.length === 0) {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }
    try {
      const studentGroupTypeormRepository =
        this.typeormDataSource.getRepository(StudentGroupTypeormEntity)

      await studentGroupTypeormRepository.delete(ids)

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to delete student groups from Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
