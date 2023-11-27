import { DataSource } from 'typeorm'
import { DistrictRosterSyncStatus } from '../../domain/entities/codex/DistrictRosterSyncStatus'
import {
  E,
  Errorable,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { DistrictRosterSyncStatusTypeormEntity } from '../typeorm/entity/DistrictRosterSyncStatus'

export class DistrictRosterSyncStatusRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getDistrictRosterSyncStatus(
    districtId: string,
  ): Promise<
    Errorable<DistrictRosterSyncStatus | null, E<'UnknownRuntimeError'>>
  > {
    const districtRosterSyncStatusTypeormEntity =
      this.typeormDataSource.getRepository(
        DistrictRosterSyncStatusTypeormEntity,
      )

    try {
      const result = await districtRosterSyncStatusTypeormEntity.findOne({
        where: {
          district_id: districtId,
        },
        order: {
          started_at: 'DESC',
        },
      })

      if (!result) {
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
          id: result.id,
          districtId: result.district_id,
          createdUserId: result.created_user_id,
          startedAt: result.started_at ? result.started_at.toISOString() : '',
          finishedAt: result.finished_at
            ? result.finished_at.toISOString()
            : '',
          errorMessage: result.error_message,
        },
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `Failed to get roster sync status of district : ${districtId}`,
        ),
        value: null,
      }
    }
  }

  async createDistrictRosterSyncStatus(
    data: Pick<DistrictRosterSyncStatus, 'districtId' | 'createdUserId'> & {
      startedAt: Date
    },
  ): Promise<
    Errorable<DistrictRosterSyncStatus | null, E<'UnknownRuntimeError'>>
  > {
    const districtRosterSyncStatusTypeormEntity =
      this.typeormDataSource.getRepository(
        DistrictRosterSyncStatusTypeormEntity,
      )

    try {
      const createRosterStatus = {
        district_id: data.districtId,
        started_at: data.startedAt,
        created_user_id: data.createdUserId,
      }
      const result = await districtRosterSyncStatusTypeormEntity.save(
        createRosterStatus,
      )

      if (!result) {
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
          id: result.id,
          districtId: result.district_id,
          createdUserId: result.created_user_id,
          startedAt: result.started_at ? result.started_at.toISOString() : '',
          finishedAt: result.finished_at
            ? result.finished_at.toISOString()
            : '',
          errorMessage: result.error_message,
        },
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `Failed to create roster sync status of district : ${data.districtId}`,
        ),
        value: null,
      }
    }
  }

  async updateDistrictRosterSyncStatus(
    data: Pick<DistrictRosterSyncStatus, 'id'> & {
      errorMessage?: string
      finishedAt: Date
    },
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    try {
      const districtRosterSyncStatusTypeormEntity =
        this.typeormDataSource.getRepository(
          DistrictRosterSyncStatusTypeormEntity,
        )

      const updateRosterStatus = {
        id: data.id,
        finished_at: data.finishedAt,
        error_message: data.errorMessage,
      }

      await districtRosterSyncStatusTypeormEntity.update(
        { id: data.id },
        updateRosterStatus,
      )

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
          `Failed to update roster sync status of district.`,
        ),
        value: null,
      }
    }
  }
}
