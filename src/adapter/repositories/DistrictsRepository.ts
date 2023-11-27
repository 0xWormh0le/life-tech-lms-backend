import { DataSource, In } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  District,
  RosterSyncDistrict,
  UpdateLastRosterSyncEventInfo,
} from '../../domain/entities/codex/District'
import { DistrictLMSInfo } from '../../domain/entities/codex/DistrictLMSInformation'
import { User } from '../../domain/entities/codex/User'
import { DistrictInfo } from '../../domain/usecases/codex/District/CreateDistrictUseCase'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { AdministratorTypeormEntity } from '../typeorm/entity/Administrator'
import { AdministratorDistrictTypeormEntity } from '../typeorm/entity/AdministratorDistrict'
import { DistrictTypeormEntity } from '../typeorm/entity/District'
import { OrganizationTypeormEntity } from '../typeorm/entity/Organization'
import { UserTypeormEntity } from '../typeorm/entity/User'

export class DistrictsRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getById(
    id: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError', string>>> {
    try {
      const districtTypeormRepository = this.typeormDataSource.getRepository(
        DistrictTypeormEntity,
      )
      const districtResult = await districtTypeormRepository.findOne({
        where: { id },
      })

      if (!districtResult) {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: {
          id: districtResult.id,
          name: districtResult.name,
          districtLMSId: districtResult.district_lms_id,
          lmsId: districtResult.lms_id,
          enableRosterSync: districtResult.enable_roster_sync,
          lastRosterSyncEventDate:
            districtResult.last_roster_sync_event_date.toISOString(),
          lastRosterSyncEventId: districtResult.last_roster_sync_event_id,
        },
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,

          `failed to get districts from db for districtId ${id}`,
        ),
        value: null,
      }
    }
  }

  async getDistricts(
    districtIds?: string[],
    LMSId?: string,
    enabledRosterSync?: boolean,
  ): Promise<Errorable<District[], E<'UnknownRuntimeError'>>> {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      const districtList = await districtTypeormRepository
        .createQueryBuilder('districts')
        .leftJoin(
          AdministratorDistrictTypeormEntity,
          'administrators_districts',
          'administrators_districts.district_id::VARCHAR = districts.id::VARCHAR',
        )
        .leftJoin(
          AdministratorTypeormEntity,
          'administrators',
          'administrators.id::VARCHAR = administrators_districts.administrator_id::VARCHAR',
        )
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = administrators.user_id::VARCHAR',
        )
        .select('districts.id', 'id')
        .addSelect('districts.name', 'name')
        .addSelect('districts.district_lms_id', 'districtLMSId')
        .addSelect('districts.lms_id', 'lmsId')
        .addSelect('districts.enable_roster_sync', 'enableRosterSync')
        .addSelect(
          'districts.last_roster_sync_event_date',
          'lastRosterSyncEventDate',
        )
        .addSelect(
          'districts.last_roster_sync_event_id',
          'lastRosterSyncEventId',
        )
        .addSelect('districts.state_id', 'stateId')
        .addSelect("STRING_AGG(users.email , ' , ')", 'administrators')
        .groupBy('districts.id')
        .orderBy('districts.name', 'ASC')

      if (districtIds) {
        const query = districtIds?.toString().split(',')

        districtList.andWhere({
          id: In(query),
        })
      }

      if (LMSId) {
        districtList.andWhere({
          lms_id: LMSId,
        })
      }

      if (enabledRosterSync) {
        districtList.andWhere({
          enable_roster_sync: enabledRosterSync,
        })
      }

      const districtData = await districtList.getRawMany()
      const res: District[] = []

      districtData.map(
        (raw: {
          id: string
          name: string
          stateId: string
          lmsId: string
          districtLMSId: string
          enableRosterSync: boolean
          lastRosterSyncEventId: string
          lastRosterSyncEventDate: Date
          administrators: string
        }) =>
          res.push({
            id: raw.id,
            name: raw.name,
            districtLMSId: raw.districtLMSId,
            lastRosterSyncEventId: raw.lastRosterSyncEventId,
            lastRosterSyncEventDate:
              raw.lastRosterSyncEventDate === null
                ? ''
                : raw.lastRosterSyncEventDate.toISOString(),
            enableRosterSync: raw.enableRosterSync,
            lmsId: raw.lmsId,
            stateId: raw.stateId,
            administrators: raw.administrators,
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
          `failed to get district from db`,
        ),
        value: null,
      }
    }
  }

  async createDistrict(
    user: User,
    district: DistrictInfo,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>
  > {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      const districtData = await districtTypeormRepository.findBy({
        name: district.name,
      })

      if (districtData.length !== 0) {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistError',
            message: `given district already exists ${JSON.stringify(
              district,
            )}`,
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get district from db by district ${district.name}`,
        ),
        value: null,
      }
    }

    try {
      await districtTypeormRepository.save({
        name: district.name,
        lms_id: district.lmsId,
        district_lms_id: district.districtLMSId,
        created_user_id: user.id,
        enable_roster_sync: district.enableRosterSync,
        state_id: district.stateId,
      })

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
          `failed to create district into db by ${JSON.stringify(district)}`,
        ),
        value: null,
      }
    }
  }

  async editDistrict(
    user: User,
    district: DistrictInfo,
    districtId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'AlreadyExistError'>
      | E<'DistrictInfoNotFound'>
    >
  > {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      const districtIdData = await districtTypeormRepository.findOneBy({
        id: districtId,
      })

      if (districtIdData == null) {
        return {
          hasError: true,
          error: {
            type: 'DistrictInfoNotFound',
            message: `district information not found`,
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get district from db by district ${districtId}`,
        ),
        value: null,
      }
    }

    try {
      await districtTypeormRepository.save({
        id: districtId,
        name: district.name,
        lms_id: district.lmsId,
        district_lms_id: district.districtLMSId,
        created_user_id: user.id,
        enable_roster_sync: district.enableRosterSync,
      })

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
            `${district.name} already exists.`,
          ),
          value: null,
        }
      } else {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to edit district into db by ${JSON.stringify(district)}`,
          ),
          value: null,
        }
      }
    }
  }

  async deleteDistrict(
    districtId: string,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'DistrictInfoNotFound'>>
  > {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      const districtIdData = await districtTypeormRepository.findOneBy({
        id: districtId,
      })

      if (districtIdData == null) {
        return {
          hasError: true,
          error: {
            type: 'DistrictInfoNotFound',
            message: `district information not found`,
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get district from db by districtId : ${districtId}`,
        ),
        value: null,
      }
    }

    try {
      await districtTypeormRepository.delete({
        id: districtId,
      })

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: any) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to delete district into db by districtId : ${districtId}`,
        ),
        value: null,
      }
    }
  }

  async checkDistrictIsExistsByDistrictLmsId(
    districtLmsId: string,
    isRoster: boolean,
  ): Promise<Errorable<boolean, E<'UnknownRuntimeError'>>> {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      let districtInfo: DistrictTypeormEntity | null

      if (isRoster) {
        districtInfo = await districtTypeormRepository.findOneBy({
          district_lms_id: districtLmsId,
          enable_roster_sync: true,
        })
      } else {
        districtInfo = await districtTypeormRepository.findOneBy({
          district_lms_id: districtLmsId,
        })
      }

      return {
        hasError: false,
        error: null,
        value: districtInfo ? true : false,
      }
    } catch (error) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          error as Error,
          `failed to get district from db by districtLmsId ${JSON.stringify(
            districtLmsId,
          )}`,
        ),
        value: null,
      }
    }
  }

  async getDistrictByDistrictLmsId(
    districtLMSId: string,
    isRoasterSync: boolean,
  ): Promise<Errorable<District | undefined, E<'UnknownRuntimeError'>>> {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      let districtInfo: DistrictTypeormEntity | null

      if (isRoasterSync) {
        districtInfo = await districtTypeormRepository.findOneBy({
          district_lms_id: districtLMSId,
          enable_roster_sync: true,
        })
      } else {
        districtInfo = await districtTypeormRepository.findOneBy({
          district_lms_id: districtLMSId,
        })
      }

      let districtData: District | undefined = undefined

      if (districtInfo) {
        districtData = {
          id: districtInfo.id,
          name: districtInfo.name,
          districtLMSId: districtInfo.district_lms_id,
          lmsId: districtInfo.lms_id,
          enableRosterSync: districtInfo.enable_roster_sync,
          lastRosterSyncEventDate:
            districtInfo.last_roster_sync_event_date.toISOString(),
          lastRosterSyncEventId: districtInfo.last_roster_sync_event_id,
        }
      }

      return {
        hasError: false,
        error: null,
        value: districtData,
      }
    } catch (error) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          error as Error,
          `failed to get district from db by districtLMSId ${JSON.stringify(
            districtLMSId,
          )}`,
        ),
        value: null,
      }
    }
  }

  async getRosterSyncDistrictByDistrictId(
    districtId: string,
  ): Promise<
    Errorable<RosterSyncDistrict | undefined, E<'UnknownRuntimeError'>>
  > {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      let res: RosterSyncDistrict | undefined = undefined
      const districtData = await districtTypeormRepository
        .createQueryBuilder('districts')
        .select('districts.id', 'id')
        .addSelect(
          'districts.last_roster_sync_event_id',
          'last_roster_sync_event_id',
        )
        .where('districts.enable_roster_sync= true')
        .andWhere('districts.id::VARCHAR = :districtId::VARCHAR', {
          districtId,
        })
        .getRawOne()

      if (districtData) {
        res = {
          id: districtData.id,
          eventId: districtData.last_roster_sync_event_id,
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
          `failed to get district from db`,
        ),
        value: null,
      }
    }
  }

  async updateLastRosterSyncEventId(
    data: UpdateLastRosterSyncEventInfo,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'DistrictInfoNotFound'>>
  > {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      const districtIdData = await districtTypeormRepository.findOneBy({
        id: data.districtId,
      })

      if (districtIdData == null) {
        return {
          hasError: true,
          error: {
            type: 'DistrictInfoNotFound',
            message: `district information not found`,
          },
          value: null,
        }
      }

      // update district into DB
      const districtData: QueryDeepPartialEntity<{}> = {
        id: data.districtId,
        last_roster_sync_event_id:
          data.eventId ?? districtIdData.last_roster_sync_event_id,
        last_roster_sync_event_date:
          data.lastRosterSyncEventDate ??
          districtIdData.last_roster_sync_event_date,
        sync_started_date:
          data.syncStartedDate ?? districtIdData.sync_started_date,
        sync_ended_date:
          data.syncEndedDate ??
          (data.syncStartedDate ? null : districtIdData.sync_ended_date),
        roster_sync_error: data.rosterSyncError ?? null,
      }

      await districtTypeormRepository.save(districtData)

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
          `failed to update eventId for district ${data.districtId}`,
        ),
        value: null,
      }
    }
  }

  async getDistrictByDistrictLMSId(
    districtLMSId: string,
  ): Promise<Errorable<District | undefined, E<'UnknownRuntimeError'>>> {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      const districtInfo = await districtTypeormRepository.findOneBy({
        district_lms_id: districtLMSId,
      })

      let districtData: District | undefined = undefined

      if (districtInfo) {
        districtData = {
          id: districtInfo.id,
          name: districtInfo.name,
          districtLMSId: districtInfo.district_lms_id,
          lmsId: districtInfo.lms_id,
          enableRosterSync: districtInfo.enable_roster_sync,
          lastRosterSyncEventDate:
            districtInfo?.last_roster_sync_event_date?.toISOString() ?? '',
          lastRosterSyncEventId: districtInfo.last_roster_sync_event_id,
        }
      }

      return {
        hasError: false,
        error: null,
        value: districtData,
      }
    } catch (error) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          error as Error,
          `failed to get district from db by ${JSON.stringify(districtLMSId)}`,
        ),
        value: null,
      }
    }
  }

  async getDistrictLMSInformationByOrganizationId(
    organizationId: string,
  ): Promise<
    Errorable<
      DistrictLMSInfo,
      E<'UnknownRuntimeError'> | E<'DistrictInfoNotFound'>
    >
  > {
    const organizationTypeormEntity = this.typeormDataSource.getRepository(
      OrganizationTypeormEntity,
    )

    try {
      const districtLMSInfo = await organizationTypeormEntity
        .createQueryBuilder('organizations')
        .leftJoin(
          DistrictTypeormEntity,
          'districts',
          'districts.id::VARCHAR = organizations.district_id::VARCHAR',
        )
        .where('organizations.id = :organizationId', { organizationId })
        .select('districts.id', 'districtId')
        .addSelect('districts.lms_id', 'lmsId')
        .addSelect('districts.name', 'districtName')
        .getRawOne()

      if (districtLMSInfo) {
        return {
          error: null,
          hasError: false,
          value: districtLMSInfo,
        }
      } else {
        return {
          hasError: true,
          error: {
            type: 'DistrictInfoNotFound',
            message: 'District lms information not found.',
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get district lms information`,
        ),
        value: null,
      }
    }
  }

  async getDistrictByDistrictId(
    districtId: string,
  ): Promise<
    Errorable<District, E<'UnknownRuntimeError'> | E<'DistrictInfoNotFound'>>
  > {
    try {
      const districtTypeormEntity = this.typeormDataSource.getRepository(
        DistrictTypeormEntity,
      )
      const result = await districtTypeormEntity.findOne({
        where: {
          id: districtId,
        },
      })

      if (result) {
        return {
          error: null,
          hasError: false,
          value: {
            id: result.id,
            districtLMSId: result.district_lms_id,
            enableRosterSync: result.enable_roster_sync,
            lastRosterSyncEventDate: String(result.last_roster_sync_event_date),
            lastRosterSyncEventId: result.last_roster_sync_event_id,
            lmsId: result.lms_id,
            name: result.name,
            stateId: result.state_id,
          },
        }
      } else {
        return {
          hasError: true,
          error: {
            type: 'DistrictInfoNotFound',
            message: 'District  information not found.',
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get district  information`,
        ),
        value: null,
      }
    }
  }

  async updateStateId(
    districtLmsId: string,
    stateId: string,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'DistrictInfoNotFound'>>
  > {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      const districtResult = await districtTypeormRepository.findOneBy({
        district_lms_id: districtLmsId,
      })

      if (districtResult == null) {
        return {
          hasError: true,
          error: {
            type: 'DistrictInfoNotFound',
            message: `district information not found`,
          },
          value: null,
        }
      }

      // update district into DB
      const districtData: QueryDeepPartialEntity<{}> = {
        id: districtResult.id,
        district_lms_id: districtLmsId,
        state_id: stateId ?? null,
      }

      await districtTypeormRepository.save(districtData)

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
          `failed to update state_id for district ${districtLmsId}`,
        ),
        value: null,
      }
    }
  }
}
