import { DataSource } from 'typeorm'
import { StandardMapping } from '../../domain/entities/codex/StandardMapping'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { StandardMappingMockData } from '../typeorm/hardcoded-data/StandardMapping'

export class StandardMappingRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getStandardMapping(
    stateId: string,
  ): Promise<Errorable<StandardMapping[], E<'UnknownRuntimeError'>>> {
    try {
      let standardMapping: StandardMapping[] = []

      if (stateId) {
        standardMapping = StandardMappingMockData.filter(
          (i) =>
            i.stateId === stateId ||
            i.stateId === 'ISTE' ||
            i.stateId === 'CSTA',
        )
      } else {
        standardMapping = StandardMappingMockData.filter(
          (i) => i.stateId === 'ISTE' || i.stateId === 'CSTA',
        )
      }

      return {
        hasError: false,
        error: null,
        value: standardMapping,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get standard mapping information`,
        ),
        value: null,
      }
    }
  }
}
