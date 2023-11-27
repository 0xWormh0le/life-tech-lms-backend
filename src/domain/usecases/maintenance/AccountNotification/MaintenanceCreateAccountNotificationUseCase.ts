import {
  AccountNotificaton,
  AccountNotificatonToTypes,
} from '../../../entities/codex/AccountNoification'
import { E, Errorable } from '../../shared/Errors'

export type AccountNotificationInfo = Omit<AccountNotificaton, 'id'> &
  AccountNotificatonToTypes

export interface IAccountNotificationRepository {
  createAccountNotification(
    accountNotificationInfo: AccountNotificationInfo,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export class MaintenanceCreateAccountNotificationUseCase {
  constructor(
    private accountNotificationRepository: IAccountNotificationRepository,
  ) {}

  async run(
    accountNotificationInfo: AccountNotificationInfo,
  ): Promise<Errorable<void, E<'UnsupportedToType' | 'UnknownRuntimeError'>>> {
    if (accountNotificationInfo.toType !== 'email') {
      return {
        hasError: true,
        error: {
          type: 'UnsupportedToType',
          message: `this toType is not supported ${accountNotificationInfo.toType}`,
        },
        value: null,
      }
    }

    const postAccountNotificationResult =
      await this.accountNotificationRepository.createAccountNotification(
        accountNotificationInfo,
      )

    if (postAccountNotificationResult.hasError) {
      return postAccountNotificationResult
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
