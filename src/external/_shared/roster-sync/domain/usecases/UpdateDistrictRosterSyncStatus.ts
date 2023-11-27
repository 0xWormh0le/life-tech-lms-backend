import {
  E,
  Errorable,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import { IDistrictRosterSyncStatusRepository } from './RosterSync'

export class StoreDistrictRosterSyncStatus {
  constructor(
    private districtRosterSyncStatusRepository: IDistrictRosterSyncStatusRepository,
  ) {}

  public create = async (
    districtId: string,
    createdUserId: string,
  ): Promise<
    Errorable<{ districtRosterSyncStatusId: string }, E<'UnknownRuntimeError'>>
  > => {
    const createDistrictRosterSyncStatusResult =
      await this.districtRosterSyncStatusRepository.createDistrictRosterSyncStatus(
        {
          districtId,
          startedAt: new Date(),
          createdUserId,
        },
      )

    if (
      createDistrictRosterSyncStatusResult.hasError ||
      !createDistrictRosterSyncStatusResult.value
    ) {
      const errorMessage = JSON.stringify({
        message: `Failed to add logs for clevar roster sync process of this district: ${districtId} in Life Is Tech portal  with error ${JSON.stringify(
          createDistrictRosterSyncStatusResult.error,
        )}`,
        statusCode: 500,
      })

      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: errorMessage,
        },
        value: null,
      }
    }

    return successErrorable({
      districtRosterSyncStatusId: createDistrictRosterSyncStatusResult.value.id,
    })
  }

  public updateAsSuccess = async (
    districtRosterSyncStatusId: string,
    districtId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    const updateDistrictRosterSyncStatusResult =
      await this.districtRosterSyncStatusRepository.updateDistrictRosterSyncStatus(
        {
          id: districtRosterSyncStatusId,
          finishedAt: new Date(),
        },
      )

    if (updateDistrictRosterSyncStatusResult.hasError) {
      return unknownRuntimeError(
        `Failed to update District Roster Sync Status as a Success for classlink of thsi district: ${districtId} with error ${JSON.stringify(
          updateDistrictRosterSyncStatusResult.error,
        )}`,
      )
    }

    return successErrorable(undefined)
  }

  public updateAsError = async (
    districtRosterSyncStatusId: string,
    districtId: string,
    error: {
      message: string
      statusCode: 400 | 500
    },
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      const updateDistrictRosterSyncStatusResult =
        await this.districtRosterSyncStatusRepository.updateDistrictRosterSyncStatus(
          {
            id: districtRosterSyncStatusId,
            errorMessage: JSON.stringify(error),
            finishedAt: new Date(),
          },
        )

      if (updateDistrictRosterSyncStatusResult.hasError) {
        const errorMessage = JSON.stringify({
          message: `Failed to udpate District Roster Sync Status as an Error for classlink of this district: ${districtId} with error ${JSON.stringify(
            updateDistrictRosterSyncStatusResult.error,
          )}`,
          statusCode: 500,
        })

        return unknownRuntimeError(errorMessage)
      }
    } catch (e) {
      return unknownRuntimeError(
        `failed updateDistrictRosterSyncStatusResult: ${JSON.stringify(e)}`,
      )
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
