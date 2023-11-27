import { E, Errorable, wrapError } from '../shared/Errors'
import { StandardMapping } from '../../entities/codex/StandardMapping'
import { isValidUUID } from '../shared/Ensure'
import { User } from '../../entities/codex/User'
import { UserRoles } from '../shared/Constants'

export interface IStandardMapping {
  getStandardMapping(
    stateId?: string,
  ): Promise<Errorable<StandardMapping[], E<'UnknownRuntimeError'>>>
}

export class GetStandardMappingUseCase {
  constructor(private standardMapping: IStandardMapping) {}

  async run(
    user: User,
    stateId?: string,
  ): Promise<
    Errorable<
      StandardMapping[],
      E<'UnknownRuntimeError'> | E<'PermissionDenied'>
    >
  > {
    if (user.role === UserRoles.student) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to see standard mapping informations.',
        },
        value: null,
      }
    }

    const getStandardMappingResult =
      await this.standardMapping.getStandardMapping(stateId)

    if (getStandardMappingResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          getStandardMappingResult.error,
          `failed to get standard mapping information.`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: getStandardMappingResult.value,
    }
  }
}
