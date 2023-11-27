import { District } from '../../../entities/codex/District'
import { User } from '../../../entities/codex/User'
import { Errorable, E, wrapError } from '../../shared/Errors'
import { userRoles } from '../../shared/Constants'

const ALLOWED_ROLES: string[] = [userRoles.internalOperator]

export type DistrictInfo = Omit<
  District,
  | 'id'
  | 'lmsName'
  | 'districtLMSId'
  | 'lmsId'
  | 'lastRosterSyncEventId'
  | 'lastRosterSyncEventDate'
  | 'enableRosterSync'
> & {
  lmsId?: string
  districtLMSId?: string
  name?: string
  apiToken?: string
  enableRosterSync?: boolean
  stateId?: string
}

export interface IDistrictRepository {
  createDistrict(
    user: User,
    district: DistrictInfo,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
}

export class CreateDistrictUseCase {
  constructor(private districtRepository: IDistrictRepository) {}

  async run(
    user: User,
    district: DistrictInfo,
  ): Promise<
    Errorable<
      void,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'AlreadyExistError'>
    >
  > {
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    const getDistrictResult = await this.districtRepository.createDistrict(
      user,
      district,
    )

    if (getDistrictResult.hasError) {
      switch (getDistrictResult.error.type) {
        case 'AlreadyExistError': {
          return {
            hasError: true,
            error: wrapError(
              getDistrictResult.error,
              `${district.name} district is already exists.`,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              getDistrictResult.error,
              `failed to create district ${JSON.stringify(district)}`,
            ),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
