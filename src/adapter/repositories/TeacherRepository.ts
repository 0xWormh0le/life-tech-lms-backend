import {
  E,
  Errorable,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { DataSource, QueryRunner } from 'typeorm'
import { UserRoleTypeormEnum, UserTypeormEntity } from '../typeorm/entity/User'
import { generateRandomLoginId } from './shared/GenerateRandom'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { TeacherInfo } from '../../domain/usecases/codex/Teacher/CreateTeachersUseCase'
import { TeacherTypeormEntity } from '../typeorm/entity/Teacher'
import { TeacherOrganizationTypeormEntity } from '../typeorm/entity/TeacherOrganization'
import {
  OrgnaizationsList,
  Teacher,
  Teachers,
} from '../../domain/entities/codex/Teacher'
import {
  TeacherOrganization,
  UpdateTeacher,
} from '../../domain/entities/codex/Teacher'
import { OrganizationTypeormEntity } from '../typeorm/entity/Organization'
import { AdministratorTypeormEntity } from '../typeorm/entity/Administrator'
import { MeInfo } from '../../domain/entities/codex/User'
import { hashingPassword } from './shared/PassWordHashing'
import { userRoles } from '../../domain/usecases/shared/Constants'

export class TeacherRepository {
  constructor(private typeormDataSource: DataSource) {}

  async createTeachers(
    organizationId: string,
    data: TeacherInfo[],
    createdUserId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    let queryRunner: QueryRunner | null = null

    try {
      const teacherOrganizationTypeormRepository =
        this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)

      const teacherTypeormRepository =
        this.typeormDataSource.getRepository(TeacherTypeormEntity)

      const userData = await Promise.all(
        data.map(async (item) => {
          if (item.password) {
            const password = await hashingPassword(item.password)

            return {
              email: item.email ? item.email : null,
              login_id: null,
              password: password,
              role: UserRoleTypeormEnum.teacher,
              human_user_created_at: new Date(),
              human_user_updated_at: new Date(),
            } as QueryDeepPartialEntity<{}>
          } else {
            return {
              email: item.email,
              login_id: null,
              role: UserRoleTypeormEnum.teacher,
              human_user_created_at: new Date(),
              human_user_updated_at: new Date(),
            } as QueryDeepPartialEntity<{}>
          }
        }),
      )

      queryRunner = this.typeormDataSource.createQueryRunner()
      await queryRunner.startTransaction()

      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const userRes = await userTypeormRepository
        .createQueryBuilder('users', queryRunner)
        .insert()
        .values(userData)
        .returning(['id', 'email'])
        .execute()

      const teacherData = userRes.generatedMaps.map((item) => {
        const itemData = data.find((raw) => raw.email === item.email)

        return {
          user_id: item.id as string,
          created_user_id: createdUserId,
          first_name: itemData?.firstName,
          last_name: itemData?.lastName,
          teacher_lms_id: itemData?.teacherLMSId,
          classlink_tenant_id: itemData?.classLinkTenantId ?? null,
        } as QueryDeepPartialEntity<{}>
      })
      const teacherRes = await teacherTypeormRepository
        .createQueryBuilder('teachers', queryRunner)
        .insert()
        .values(teacherData)
        .returning(['id', 'user_id'])
        .execute()

      const teacherOrganizationData: QueryDeepPartialEntity<{}> =
        teacherRes.generatedMaps.map((item) => {
          return {
            teacher: item.id,
            organization: organizationId,
            created_user_id: createdUserId,
            is_primary: true,
          }
        })

      await teacherOrganizationTypeormRepository
        .createQueryBuilder('teacher_organization', queryRunner)
        .insert()
        .values(teacherOrganizationData)
        .execute()

      await queryRunner.commitTransaction()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction()
      }

      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    } finally {
      if (queryRunner) {
        await queryRunner.release()
      }
    }
  }

  async updateTeacherById(
    teacherId: string,
    teacherUserId: string,
    body: UpdateTeacher,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>
  > {
    const teacherTypeormRepository =
      this.typeormDataSource.getRepository(TeacherTypeormEntity)
    const userTypeormRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)

    try {
      const teacherByIdResult = await teacherTypeormRepository.findOneBy({
        id: teacherId,
      })
      const userInfo = await userTypeormRepository.findOneBy({
        id: teacherByIdResult?.user_id,
      })

      if (body.email || body.password) {
        const userTypeormRepository =
          this.typeormDataSource.getRepository(UserTypeormEntity)

        const users = await userTypeormRepository
          .createQueryBuilder('user')
          .select('user.email', 'email')
          .where('user.email = :email', { email: body.email })
          .andWhere('id != :id', { id: teacherUserId })
          .execute()

        if (users.length > 0) {
          const userErrObj = users.reduce(
            (obj: object, key: { email: string }) => ({
              ...obj,
              [key.email]: 'This email is already exist',
            }),
            {},
          )

          return {
            hasError: true,
            error: {
              type: 'EmailAlreadyExists',
              message: userErrObj,
            },
            value: null,
          }
        } else {
          /* Update email id */
          const userResult = await userTypeormRepository
            .createQueryBuilder()
            .update(UserTypeormEntity, {
              ...(body.email && { email: body.email }),
              ...(body.password && {
                password:
                  userInfo?.password === body.password
                    ? userInfo?.password
                    : await hashingPassword(body.password),
                human_user_updated_at: new Date(),
              }),
            })
            .where('id=:id', { id: teacherUserId })
            .returning('*')
            .updateEntity(true)
            .execute()

          if (userResult?.raw[0] === undefined) {
            return {
              hasError: true,
              error: {
                type: 'UnknownRuntimeError',
                message: `failed to update user email ${teacherUserId}`,
              },
              value: null,
            }
          }
        }
      }

      const teacherResult = await teacherTypeormRepository
        .createQueryBuilder()
        .update(TeacherTypeormEntity, {
          first_name: body.firstName ?? teacherByIdResult?.first_name,
          last_name: body.lastName ?? teacherByIdResult?.last_name,
          teacher_lms_id:
            body.teacherLMSId ?? teacherByIdResult?.teacher_lms_id,
        })
        .where('id=:id', { id: teacherId })
        .returning('*')
        .updateEntity(true)
        .execute()

      if (teacherResult?.raw[0] === undefined) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: `failed to update teacher of id ${teacherId}`,
          },
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to update teacher of id ${teacherId}`,
        ),
        value: null,
      }
    }
  }

  async getTeacherByTeacherLMSIds(
    teacherLMSIds: string[],
  ): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
    const teacherTypeormRepository =
      this.typeormDataSource.getRepository(TeacherTypeormEntity)

    try {
      const res: Teacher[] = []

      if (teacherLMSIds.length) {
        const teacherResult = await teacherTypeormRepository
          .createQueryBuilder('teacher')
          .select('teacher.id', 'teacher_id')
          .addSelect('teacher.first_name', 'first_name')
          .addSelect('teacher.last_name', 'last_name')
          .addSelect('teacher.teacher_lms_id', 'teacher_lms_id')
          .addSelect('teacher.user_id', 'user_id')
          .addSelect('teacher.created_user_id', 'created_user_id')
          .addSelect('teacher.created_date', 'created_date')
          .where('teacher.teacher_lms_id in (:...teacherLMSIds)', {
            teacherLMSIds,
          })
          .getRawMany()

        teacherResult.map(
          (raw: {
            teacher_id: string
            user_id: string
            first_name: string
            last_name: string
            teacher_lms_id: string
            created_user_id: string
            created_date: string
          }) =>
            res.push({
              teacherId: raw.teacher_id,
              userId: raw.user_id,
              firstName: raw.first_name,
              lastName: raw.last_name,
              teacherLMSId: raw.teacher_lms_id,
              createdUserId: raw.created_user_id,
              createdDate: raw.created_date.toString(),
            }),
        )
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async deleteTeacher(
    teacherId: string,
  ): Promise<Errorable<{ message: string }, E<'UnknownRuntimeError'>>> {
    try {
      const teacherTypeormRepository =
        this.typeormDataSource.getRepository(TeacherTypeormEntity)
      const userRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)

      const teacherResult = await teacherTypeormRepository.findOneBy({
        id: teacherId,
      })

      if (teacherResult) {
        await teacherTypeormRepository.delete({
          id: teacherId,
        })
        await userRepository.delete({ id: teacherResult.user_id })
      }

      return {
        hasError: false,
        error: null,
        value: {
          message: 'ok',
        },
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async deactivateTeacher(
    teacherId: string,
  ): Promise<Errorable<{ message: string }, E<'UnknownRuntimeError'>>> {
    try {
      const teacherTypeormRepository =
        this.typeormDataSource.getRepository(TeacherTypeormEntity)
      const userRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)

      const teacherResult = await teacherTypeormRepository.findOneBy({
        id: teacherId,
      })

      if (teacherResult === null) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: `teacher Id not found`,
          },
          value: null,
        }
      }
      await teacherTypeormRepository.update(
        { id: teacherId },
        {
          is_deactivated: true,
        },
      )

      await userRepository.update(
        { id: teacherResult.user_id },
        {
          is_deactivated: true,
          human_user_updated_at: new Date(),
        },
      )

      await this.removeTeacherFromOrganizationClever(teacherId)

      return {
        hasError: false,
        error: null,
        value: {
          message: 'ok',
        },
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'failed to deactivate teacher of teacherId: ${teacherId}',
        ),
        value: null,
      }
    }
  }

  async getTeachers(
    organizationId: string,
    teacherIds?: string[] | undefined,
    role?: string | null,
  ): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
    try {
      const teacherRepository = this.typeormDataSource.getRepository(
        TeacherOrganizationTypeormEntity,
      )
      const data = teacherRepository
        .createQueryBuilder('teacher_organization')
        .innerJoin(
          TeacherTypeormEntity,
          'teachers',
          'teachers.id::VARCHAR = teacher_organization.teacher_id::VARCHAR',
        )
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = teachers.user_id::VARCHAR',
        )
        .leftJoin(
          UserTypeormEntity,
          'created_user',
          'teachers.created_user_id::VARCHAR = created_user.id::VARCHAR',
        )
        .leftJoin(
          AdministratorTypeormEntity,
          'administrators',
          'administrators.user_id::VARCHAR = created_user.id::VARCHAR',
        )
        .select('teachers.id', 'teacher_id')
        .addSelect('teachers.first_name', 'first_name')
        .addSelect('teachers.last_name', 'last_name')
        .addSelect('teachers.user_id', 'user_id')
        .addSelect('teachers.teacher_lms_id', 'teacher_lms_id')
        .addSelect('teachers.created_user_id', 'created_user_id')
        .addSelect('users.role', 'role')
        .addSelect('administrators.first_name', 'created_user_first_name')
        .addSelect('administrators.last_name', 'created_user_last_name')
        .addSelect('teachers.created_date', 'created_date')
        .addSelect('users.email', 'email')
        .where(
          'teacher_organization.organization_id::VARCHAR = :organizationId::VARCHAR',
          {
            organizationId,
          },
        )

      if (teacherIds?.length! > 0) {
        data.andWhere('teacher_organization.teacher_id IN (:...teacherIds)', {
          teacherIds: teacherIds,
        })
      }

      if (role === userRoles.teacher) {
        data.andWhere('teachers.is_deactivated = :isDeactivated', {
          isDeactivated: false,
        })
      }

      const query = await data.getRawMany()
      const res: Teachers[] = []

      query.map(
        (raw: {
          teacher_id: string
          first_name: string
          last_name: string
          user_id: string
          teacher_lms_id: string
          created_user_id: string
          role: string
          created_user_first_name: string
          created_user_last_name: string
          created_date: string
          email: string
        }) =>
          res.push({
            id: raw.teacher_id,
            firstName: raw.first_name,
            lastName: raw.last_name,
            userId: raw.user_id,
            teacherLMSId: raw.teacher_lms_id,
            createdUserId: raw.created_user_id,
            createdUserFirstName:
              raw.role === 'internal_operator'
                ? null
                : raw.created_user_first_name,
            createdUserLastName:
              raw.role === 'internal_operator'
                ? null
                : raw.created_user_last_name,
            createdDate: raw.created_date.toString(),
            email: raw.email,
          }),
      )

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async getTeacherByTeacherId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  > {
    const teacherTypeormRepository =
      this.typeormDataSource.getRepository(TeacherTypeormEntity)
    const teacherOrganizationTypeormEntity =
      this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)

    try {
      const findTeacherInOrganization = await teacherOrganizationTypeormEntity
        .createQueryBuilder()
        .where('teacher_id =:teacherId', {
          teacherId: teacherId,
        })
        .getRawMany()

      const getteacherData = teacherTypeormRepository
        .createQueryBuilder('teachers')
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = teachers.user_id::VARCHAR',
        )
        .select('teachers.id', 'teacher_id')

      if (findTeacherInOrganization && findTeacherInOrganization.length > 0) {
        getteacherData
          .innerJoin(
            TeacherOrganizationTypeormEntity,
            'teacher_organization',
            'teacher_organization.teacher_id::VARCHAR = teachers.id::VARCHAR',
          )
          .innerJoin(
            OrganizationTypeormEntity,
            'organizations',
            'organizations.id::VARCHAR = teacher_organization.organization_id::VARCHAR ',
          )
          .addSelect('organizations.id', 'organization_id')
          .addSelect('organizations.district_id', 'district_id')
          .addSelect('teacher_organization.organization_id', 'organization_id')
          .addSelect('teacher_organization.is_primary', 'is_primary')
      }

      const teacherData = await getteacherData
        .addSelect('teachers.first_name', 'first_name')
        .addSelect('teachers.last_name', 'last_name')
        .addSelect('teachers.teacher_lms_id', 'teacher_lms_id')
        .addSelect('teachers.user_id', 'user_id')
        .addSelect('users.email', 'email')
        .addSelect('teachers.created_user_id', 'created_user_id')
        .addSelect('teachers.created_date', 'created_date')
        .where('teachers.id::VARCHAR = :teacherId::VARCHAR', {
          teacherId,
        })
        .getRawOne()

      let res: TeacherOrganization | undefined = undefined
      let teacherOrganizations: {
        id: string
        name: string
        stateId?: string
        districtId: string
      }[] = []

      if (teacherData) {
        const organizations: OrgnaizationsList[] = []

        if (findTeacherInOrganization.length > 0) {
          teacherOrganizations = await teacherTypeormRepository
            .createQueryBuilder('teachers')
            .leftJoin(
              UserTypeormEntity,
              'users',
              'users.id::VARCHAR = teachers.user_id::VARCHAR',
            )
            .innerJoin(
              TeacherOrganizationTypeormEntity,
              'teacher_organization',
              'teacher_organization.teacher_id::VARCHAR = teachers.id::VARCHAR',
            )
            .innerJoin(
              OrganizationTypeormEntity,
              'organizations',
              'organizations.id::VARCHAR = teacher_organization.organization_id::VARCHAR',
            )
            .select('organizations.id', 'id')
            .addSelect('organizations.name', 'name')
            .addSelect('organizations.district_id', 'districtId')
            .addSelect('organizations.state_id', 'stateId')
            .where('teachers.user_id::VARCHAR = :userId::VARCHAR', {
              userId: teacherData.user_id,
            })
            .getRawMany()

          teacherOrganizations.map((item) => {
            organizations.push({
              id: item.id,
              name: item.name,
              stateId: item.stateId,
            })
          })
        }
        res = {
          teacherId: teacherData.teacher_id,
          userId: teacherData.user_id,
          organizationId: teacherData.organization_id ?? null,
          districtId: teacherOrganizations[0]?.districtId ?? null,
          email: teacherData.email,
          firstName: teacherData.first_name,
          lastName: teacherData.last_name,
          teacherLMSId: teacherData.teacher_lms_id,
          isPrimary: teacherData.is_primary ?? false,
          createdUserId: teacherData.created_user_id,
          createdDate: teacherData.created_date.toString(),
          teacherOrganizations: organizations,
        }
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to fetch teachers from db for teacher id ${teacherId}`,
        ),
        value: null,
      }
    }
  }

  async getTeacherOrganizationsTeachersByTeacherIdAndOrganizationId(
    teacherId: string,
    organizationId: string,
  ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
    try {
      const teacherOrganizationTypeormEntity =
        this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)

      const teacherOrganizationsTeachersResult =
        await teacherOrganizationTypeormEntity
          .createQueryBuilder('teacher_organization')
          .where(
            'teacher_organization.teacher_id= :teacherId AND teacher_organization.organization_id= :organizationId',
            {
              teacherId: teacherId,
              organizationId: organizationId,
            },
          )
          .select('teacher_organization.id', 'teacherOrganizationId')
          .getRawMany()

      const teacherOrganizationIds: string[] =
        teacherOrganizationsTeachersResult.map(
          (item) => item.teacherOrganizationId,
        )

      return {
        hasError: false,
        error: null,
        value: teacherOrganizationIds,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get teacher_organization from db`,
        ),
        value: null,
      }
    }
  }

  async addTeacherInOrganization(
    organizationId: string,
    teacherId: string,
    createdUserId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    try {
      const teacherOrganizationTypeormRepository =
        this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)

      const teacherOrganizationData: QueryDeepPartialEntity<{}> = {
        created_user_id: createdUserId,
        organization: organizationId,
        teacher: teacherId,
      }

      await teacherOrganizationTypeormRepository
        .createQueryBuilder('teacher_organization')
        .insert()
        .values(teacherOrganizationData)
        .execute()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async removeTeacherFromOrganization(
    organizationId: string,
    teacherId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const teacherOrganizationTypeormRepository =
      this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)

    try {
      await teacherOrganizationTypeormRepository
        .createQueryBuilder('teacher_organization')
        .delete()
        .where('teacher_organization.organization_id = :organization_id', {
          organization_id: organizationId,
        })
        .andWhere('teacher_organization.teacher_id = :teacher_id', {
          teacher_id: teacherId,
        })
        .execute()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async getTeacherByUserId(
    userId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  > {
    const teacherTypeormRepository =
      this.typeormDataSource.getRepository(TeacherTypeormEntity)
    const teacherOrganizationTypeormEntity =
      this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)

    try {
      const findTeacherFromUserId = await teacherTypeormRepository
        .createQueryBuilder('teachers')
        .select('teachers.id', 'teacherId')
        .where('teachers.user_id = :id', {
          id: userId,
        })
        .getRawOne()

      let res: TeacherOrganization | undefined = undefined

      if (findTeacherFromUserId) {
        const findTeacherInOrganization = await teacherOrganizationTypeormEntity
          .createQueryBuilder()
          .where('teacher_id =:teacherId', {
            teacherId: findTeacherFromUserId.teacherId,
          })
          .getRawMany()

        const getteacherData = teacherTypeormRepository
          .createQueryBuilder('teachers')
          .leftJoin(
            UserTypeormEntity,
            'users',
            'users.id::VARCHAR = teachers.user_id::VARCHAR',
          )
          .select('teachers.id', 'teacher_id')

        if (findTeacherInOrganization && findTeacherInOrganization.length > 0) {
          getteacherData
            .innerJoin(
              TeacherOrganizationTypeormEntity,
              'teacher_organization',
              'teacher_organization.teacher_id::VARCHAR = teachers.id::VARCHAR',
            )
            .innerJoin(
              OrganizationTypeormEntity,
              'organizations',
              'organizations.id::VARCHAR = teacher_organization.organization_id::VARCHAR ',
            )
            .addSelect('organizations.id', 'organization_id')
            .addSelect('organizations.district_id', 'district_id')
            .addSelect(
              'teacher_organization.organization_id',
              'organization_id',
            )
            .addSelect('teacher_organization.is_primary', 'is_primary')
        }

        const teacherData = await getteacherData
          .addSelect('teachers.first_name', 'first_name')
          .addSelect('teachers.last_name', 'last_name')
          .addSelect('teachers.teacher_lms_id', 'teacher_lms_id')
          .addSelect('teachers.user_id', 'user_id')
          .addSelect('users.email', 'email')
          .addSelect('teachers.created_user_id', 'created_user_id')
          .addSelect('teachers.created_date', 'created_date')
          .where('teachers.id::VARCHAR = :teacherId::VARCHAR', {
            teacherId: findTeacherFromUserId.teacherId,
          })
          .getRawOne()

        if (teacherData) {
          const organizations: OrgnaizationsList[] = []

          if (findTeacherInOrganization.length > 0) {
            const teacherOrganizations = await teacherTypeormRepository
              .createQueryBuilder('teachers')
              .leftJoin(
                UserTypeormEntity,
                'users',
                'users.id::VARCHAR = teachers.user_id::VARCHAR',
              )
              .innerJoin(
                TeacherOrganizationTypeormEntity,
                'teacher_organization',
                'teacher_organization.teacher_id::VARCHAR = teachers.id::VARCHAR',
              )
              .innerJoin(
                OrganizationTypeormEntity,
                'organizations',
                'organizations.id::VARCHAR = teacher_organization.organization_id::VARCHAR',
              )
              .select('organizations.id', 'id')
              .addSelect('organizations.name', 'name')
              .addSelect('organizations.state_id', 'stateId')
              .where('teachers.user_id::VARCHAR = :userId::VARCHAR', {
                userId: teacherData.user_id,
              })
              .getRawMany()

            teacherOrganizations.map((item) => {
              organizations.push({
                id: item.id,
                name: item.name,
                stateId: item.stateId,
              })
            })
          }
          res = {
            teacherId: teacherData.teacher_id,
            userId: teacherData.user_id,
            organizationId: teacherData.organization_id ?? null,
            districtId: teacherData.district_id ?? null,
            email: teacherData.email,
            firstName: teacherData.first_name,
            lastName: teacherData.last_name,
            teacherLMSId: teacherData.teacher_lms_id,
            isPrimary: teacherData.is_primary ?? false,
            createdUserId: teacherData.created_user_id,
            createdDate: teacherData.created_date.toString(),
            teacherOrganizations: organizations,
          }
        }

        return {
          hasError: false,
          error: null,
          value: res,
        }
      } else {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to fetch teacher from db for user id ${userId}`,
        ),
        value: null,
      }
    }
  }

  async getTeacherIdByUserId(
    userId: string,
  ): Promise<Errorable<string | undefined, E<'UnknownRuntimeError'>>> {
    const teacherTypeormEntity =
      this.typeormDataSource.getRepository(TeacherTypeormEntity)

    try {
      const result = await teacherTypeormEntity
        .createQueryBuilder('teachers')
        .where('teachers.user_id = :id', {
          id: userId,
        })
        .getRawOne()

      return {
        hasError: false,
        error: null,
        value: result.teachers_id,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get teacher id by ${userId}`,
        ),
        value: null,
      }
    }
  }

  async getTeacherDetailByUserId(
    userId: string,
  ): Promise<
    Errorable<
      Omit<
        NonNullable<MeInfo['teacher']>,
        'districtId' | 'organizationIds'
      > | null,
      E<'UnknownRuntimeError'>
    >
  > {
    const teacherTypeormEntity =
      this.typeormDataSource.getRepository(TeacherTypeormEntity)

    try {
      const teacherData = await teacherTypeormEntity
        .createQueryBuilder('teachers')
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = teachers.user_id::VARCHAR',
        )
        .select('teachers.id', 'teacher_id')
        .addSelect('teachers.user_id', 'user_id')
        .addSelect('teachers.first_name', 'first_name')
        .addSelect('teachers.last_name', 'last_name')
        .addSelect('teachers.teacher_lms_id', 'teacher_lms_id')
        .addSelect('users.id', 'id')
        .addSelect('users.login_id', 'login_id')
        .addSelect('users.role', 'role')
        .addSelect('users.email', 'email')
        .where('teachers.user_id = :id', {
          id: userId,
        })
        .getRawOne()

      return {
        hasError: false,
        error: null,
        value: teacherData
          ? {
              id: teacherData.teacher_id,
              userId: teacherData.user_id,
              firstName: teacherData.first_name,
              lastName: teacherData.last_name,
              teacherLMSId: teacherData.teacher_lms_id,
            }
          : null,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get teacher details by ${userId}`,
        ),
        value: null,
      }
    }
  }

  async getTeacherOrganizationIdsByTeacherId(
    teacherId: string,
  ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
    try {
      const teacherOrganizationTypeormEntity =
        this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)
      const res: string[] = []
      const teacherOrganizationIdsTeachersResult =
        await teacherOrganizationTypeormEntity
          .createQueryBuilder('teacher_organization')
          .select('teacher_organization.organization_id', 'organization_id')
          .where('teacher_organization.teacher_id= :teacherId', {
            teacherId: teacherId,
          })
          .getRawMany()

      teacherOrganizationIdsTeachersResult.map(
        (raw: { organization_id: string }) => res.push(raw.organization_id),
      )

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get organization ids by teacher id from db`,
        ),
        value: null,
      }
    }
  }

  //It use for only clever roster sync event teacher create
  async createTeacherForClever(
    organizationId: string,
    data: TeacherInfo,
    createdUserId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    let queryRunner: QueryRunner | null = null

    try {
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const teacherTypeormRepository =
        this.typeormDataSource.getRepository(TeacherTypeormEntity)
      const teacherOrganizationTypeormRepository =
        this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)
      let password = data?.password

      if (password) {
        password = await hashingPassword(password)
      }

      const userData = {
        email: data.email ? data.email : null,
        login_id: null,
        password: password,
        role: UserRoleTypeormEnum.teacher,
        is_deactivated: false,
        human_user_created_at: new Date(),
        human_user_updated_at: new Date(),
      } as QueryDeepPartialEntity<{}>

      queryRunner = this.typeormDataSource.createQueryRunner()
      await queryRunner.startTransaction()

      //check user already exists in codex or not
      const teacherData = await teacherTypeormRepository
        .createQueryBuilder('teachers')
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = teachers.user_id::VARCHAR',
        )
        .select('teachers.id', 'teacherId')
        .addSelect('users.id', 'userId')
        .addSelect('users.email', 'userEmail')
        .addSelect('teachers.teacher_lms_id', 'teacherLmsId')
        .where('teachers.teacher_lms_id = :teacherLmsId', {
          teacherLmsId: data.teacherLMSId,
        })
        .getRawOne()

      if (teacherData) {
        //Active the deactivate user
        const userId = teacherData.userId

        await userTypeormRepository
          .createQueryBuilder()
          .update(UserTypeormEntity, userData)
          .where('id=:id', { id: userId })
          .updateEntity(true)
          .execute()
        await teacherTypeormRepository
          .createQueryBuilder()
          .update(TeacherTypeormEntity, {
            first_name: data?.firstName,
            last_name: data?.lastName,
            teacher_lms_id: data.teacherLMSId,
            is_deactivated: false,
          } as QueryDeepPartialEntity<{}>)
          .where('user_id=:userId', { userId: userId })
          .updateEntity(true)
          .execute()

        //add teacher in organization
        const teacherOrganizationData: QueryDeepPartialEntity<{}> = {
          teacher: teacherData.teacherId,
          organization: organizationId,
          created_user_id: createdUserId,
          is_primary: true,
        }

        await teacherOrganizationTypeormRepository
          .createQueryBuilder('teacher_organization', queryRunner)
          .insert()
          .values(teacherOrganizationData)
          .execute()
      } else {
        //create user and teacher
        const userRes = await userTypeormRepository
          .createQueryBuilder('users', queryRunner)
          .insert()
          .values(userData)
          .execute()
        const teacherData = userRes.generatedMaps.map(
          (item, index) =>
            ({
              first_name: data?.firstName,
              last_name: data?.lastName,
              user_id: item.id as string,
              teacher_lms_id: data.teacherLMSId ? data.teacherLMSId : null,
              created_user_id: createdUserId ? createdUserId : null,
              is_deactivated: false,
            } as QueryDeepPartialEntity<{}>),
        )
        const teacherRes = await teacherTypeormRepository
          .createQueryBuilder('teachers', queryRunner)
          .insert()
          .values(teacherData)
          .execute()

        const teacherOrganizationData: QueryDeepPartialEntity<{}> =
          teacherRes.generatedMaps.map((item) => {
            return {
              teacher: item.id,
              organization: organizationId,
              created_user_id: createdUserId,
              is_primary: true,
            }
          })

        await teacherOrganizationTypeormRepository
          .createQueryBuilder('teacher_organization', queryRunner)
          .insert()
          .values(teacherOrganizationData)
          .execute()
      }
      await queryRunner.commitTransaction()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction()
      }

      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    } finally {
      if (queryRunner) {
        await queryRunner.release()
      }
    }
  }

  async removeTeacherFromOrganizationClever(
    teacherId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const teacherOrganizationTypeormRepository =
      this.typeormDataSource.getRepository(TeacherOrganizationTypeormEntity)

    try {
      await teacherOrganizationTypeormRepository
        .createQueryBuilder('teacher_organization')
        .delete()
        .where('teacher_organization.teacher_id = :teacher_id', {
          teacher_id: teacherId,
        })
        .execute()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to delete teacher from teacher-organization: ${teacherId}`,
        ),
        value: null,
      }
    }
  }
}
