import { DataSource } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { Organizations } from '../../domain/entities/codex/Organization'
import { OrganizationInfo } from '../../domain/usecases/codex/Organization/CreateOrganizationUseCase'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { OrganizationTypeormEntity } from '../typeorm/entity/Organization'

export class OrganizationsRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getOrganizationById(
    organizationId: string,
  ): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
    try {
      const organizationTypeormEntity = this.typeormDataSource.getRepository(
        OrganizationTypeormEntity,
      )

      const organizationsResult = await organizationTypeormEntity
        .createQueryBuilder('organizations')
        .where('organizations.id = :organizationId', {
          organizationId,
        })
        .select(
          'organizations.id AS id, organizations.name AS name, organizations.district_id AS district_id, organizations.state_id AS state_id, organizations.created_user_id AS created_user_id,organizations.organization_lms_id AS organization_lms_id, organizations.created_date AS created_date, organizations.updated_date AS updated_date',
        )
        .getRawOne()
      let res: Organizations | undefined = undefined

      if (organizationsResult) {
        res = {
          id: organizationsResult.id,
          name: organizationsResult.name,
          districtId: organizationsResult.district_id,
          stateId: organizationsResult.state_id,
          organizationLMSId: organizationsResult.organization_lms_id,
          createdUserId: organizationsResult.created_user_id,
          createdDate: organizationsResult.created_date,
          updatedDate: organizationsResult.updated_date,
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
          `failed to get Organizations from db`,
        ),
        value: null,
      }
    }
  }

  async getOrganizationByOrganizationLmsId(
    organizationLMSId: string,
  ): Promise<Errorable<Organizations | null, E<'UnknownRuntimeError'>>> {
    try {
      const organizationTypeormEntity = this.typeormDataSource.getRepository(
        OrganizationTypeormEntity,
      )

      const organizationsResult = await organizationTypeormEntity
        .createQueryBuilder('organizations')
        .where('organizations.organization_lms_id = :organizationLMSId', {
          organizationLMSId,
        })
        .select(
          'organizations.id AS id, organizations.name AS name, organizations.district_id AS district_id, organizations.state_id AS state_id, organizations.created_user_id AS created_user_id,organizations.organization_lms_id AS organization_lms_id, organizations.created_date AS created_date, organizations.updated_date AS updated_date',
        )
        .getRawOne()
      let res: Organizations | null = null

      if (organizationsResult) {
        res = {
          id: organizationsResult.id,
          name: organizationsResult.name,
          districtId: organizationsResult.district_id,
          stateId: organizationsResult.state_id,
          organizationLMSId: organizationsResult.organization_lms_id,
          createdUserId: organizationsResult.created_user_id,
          createdDate: organizationsResult.created_date,
          updatedDate: organizationsResult.updated_date,
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
          `failed to get Organizations from db`,
        ),
        value: null,
      }
    }
  }

  async getOrganizations(
    districtId: string,
    organizationIds: string[],
  ): Promise<Errorable<Organizations[], E<'UnknownRuntimeError'>>> {
    try {
      const organizationTypeormEntity = this.typeormDataSource.getRepository(
        OrganizationTypeormEntity,
      )
      let organizationsResult

      if (organizationIds) {
        const query = organizationIds?.toString().split(',')

        organizationsResult = await organizationTypeormEntity
          .createQueryBuilder('organizations')
          .where('organizations.district_id = :id', { id: districtId })
          .where('organizations.id in (:...query)', {
            query,
          })
          .select(
            'organizations.id AS id, organizations.name AS name, organizations.district_id AS district_id, organizations.state_id AS state_id, organizations.created_user_id AS created_user_id,organizations.organization_lms_id AS organization_lms_id, organizations.created_date AS created_date, organizations.updated_date AS updated_date',
          )
          .getRawMany()
      } else {
        organizationsResult = await organizationTypeormEntity
          .createQueryBuilder('organizations')
          .where('organizations.district_id = :id', { id: districtId })
          .select(
            'organizations.id AS id, organizations.name AS name, organizations.district_id AS district_id, organizations.state_id AS state_id, organizations.created_user_id AS created_user_id,organizations.organization_lms_id AS organization_lms_id, organizations.created_date AS created_date, organizations.updated_date AS updated_date',
          )
          .getRawMany()
      }

      const res: Organizations[] = []

      organizationsResult.map(
        (raw: {
          id: string
          name: string
          district_id: string
          state_id: string
          created_user_id: string
          organization_lms_id: string
          created_date: Date
          updated_date: Date
        }) =>
          res.push({
            id: raw.id,
            name: raw.name,
            districtId: raw.district_id,
            stateId: raw.state_id,
            createdUserId: raw.created_user_id,
            organizationLMSId: raw.organization_lms_id,
            createdDate: raw.created_date.toISOString(),
            updatedDate: raw.updated_date.toISOString(),
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
          `failed to get Organizations from db`,
        ),
        value: null,
      }
    }
  }

  async createOrganization(
    organization: OrganizationInfo,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>
  > {
    try {
      const organizationTypeormEntity = this.typeormDataSource.getRepository(
        OrganizationTypeormEntity,
      )
      const organizationResult = await organizationTypeormEntity.findBy({
        name: organization.name,
        district_id: organization.districtId,
      })

      if (organizationResult.length !== 0) {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistError',
            message: 'given organization already exists in same district',
          },
          value: null,
        }
      }

      const data: QueryDeepPartialEntity<{}> = {
        name: organization.name,
        district_id: organization.districtId,
        state_id: organization.stateId.length > 0 ? organization.stateId : null,
        organization_lms_id: organization.organizationLMSId ?? null,
        created_user_id: organization.createdUserId ?? null,
      }

      await organizationTypeormEntity.save(data)

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
          `failed to create organization into db by ${JSON.stringify(
            organization,
          )}`,
        ),
        value: null,
      }
    }
  }

  async updateOrganization(
    organizationId: string,
    organization: OrganizationInfo,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'AlreadyExistError'>
      | E<'OrganizationNotFoundError'>
    >
  > {
    const organizationTypeormEntity = this.typeormDataSource.getRepository(
      OrganizationTypeormEntity,
    )

    try {
      const organizationData = await organizationTypeormEntity.findOneBy({
        id: organizationId,
      })

      if (organizationData == null) {
        return {
          hasError: true,
          error: {
            type: 'OrganizationNotFoundError',
            message: `organization information not found`,
          },
          value: null,
        }
      }

      const saveOrganizationData: QueryDeepPartialEntity<{}> = {
        id: organizationId,
        name: organization.name,
        district_id: organization.districtId,
        state_id: organization.stateId.length > 0 ? organization.stateId : null,
        organization_lms_id:
          organization.organizationLMSId ??
          organizationData.organization_lms_id,
        created_user_id: organization.createdUserId,
      }

      await organizationTypeormEntity.save(saveOrganizationData)

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: any) {
      if (parseInt(e.code) === 23505) {
        return {
          hasError: true,
          error: fromNativeError(
            'AlreadyExistError',
            e as Error,
            `${organization.name} already exists in same district.`,
          ),
          value: null,
        }
      } else {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to edit district into db by ${JSON.stringify(
              organization,
            )}`,
          ),
          value: null,
        }
      }
    }
  }

  async deleteOrganization(
    organizationId: string,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'OrganizationIdNotFound'>>
  > {
    const organizationTypeormEntity = this.typeormDataSource.getRepository(
      OrganizationTypeormEntity,
    )

    try {
      const organizationData = await organizationTypeormEntity.findOneBy({
        id: organizationId,
      })

      if (organizationData == null) {
        return {
          hasError: true,
          error: {
            type: 'OrganizationIdNotFound',
            message: `organization Id not found`,
          },
          value: null,
        }
      }
      await organizationTypeormEntity.delete({ id: organizationId })

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
          `failed to delete organization of organizationId: ${organizationId}`,
        ),
        value: null,
      }
    }
  }
}
