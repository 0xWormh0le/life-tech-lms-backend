import { SESv2Client } from '@aws-sdk/client-sesv2'
import { mockClient } from 'aws-sdk-client-mock'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import { AccountNotificationRepository } from '../../../../../repositories/AccountNotificationRepository'
import {
  AccountNotificationInfo,
  MaintenanceCreateAccountNotificationUseCase,
} from '../../../../../../domain/usecases/maintenance/AccountNotification/MaintenanceCreateAccountNotificationUseCase'

type Response =
  | Paths.MaintenancePostAccountNotification.Responses.$200
  | Paths.MaintenancePostAccountNotification.Responses.$400
  | Paths.MaintenancePostAccountNotification.Responses.$500

export class MaintenanceCreateAccountNotificationExpressHandler {
  constructor(private awsRegion: string, private useSESMockClient: boolean) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenancePostAccountNotification.RequestBody,
    Response
  > = async (params) => {
    if (this.useSESMockClient) {
      mockClient(SESv2Client)
    }

    const accountNotificationRepository = new AccountNotificationRepository(
      this.awsRegion,
    )
    const createAccountNotificationUseCase =
      new MaintenanceCreateAccountNotificationUseCase(
        accountNotificationRepository,
      )

    let accountNotificationInfo: AccountNotificationInfo

    switch (params.body.toType) {
      case 'email':
        if (!params.body.toEmails) {
          const response400: Paths.MaintenancePostAccountNotification.Responses.$400 =
            {
              error: `if toType is email, request body should have toEmails`,
            }

          return { statusCode: 400, response: response400 }
        }
        accountNotificationInfo = {
          ...params.body,
          toType: 'email',
          toEmails: params.body.toEmails,
        }
        break
      case 'adminId':
        if (!params.body.toAdminIds) {
          const response400: Paths.MaintenancePostAccountNotification.Responses.$400 =
            {
              error: `if toType is adminId, request body should have toAdminIds`,
            }

          return { statusCode: 400, response: response400 }
        }
        accountNotificationInfo = {
          ...params.body,
          toType: 'adminId',
          toAdminIds: params.body.toAdminIds,
        }
        break
      case 'teacherId':
        if (!params.body.toTeacherIds) {
          const response400: Paths.MaintenancePostAccountNotification.Responses.$400 =
            {
              error: `if toType is teacherId, request body should have toTeacherIds`,
            }

          return { statusCode: 400, response: response400 }
        }
        accountNotificationInfo = {
          ...params.body,
          toType: 'teacherId',
          toTeacherIds: params.body.toTeacherIds,
        }
        break
    }

    const createAccountNotificationResult =
      await createAccountNotificationUseCase.run(accountNotificationInfo)

    if (createAccountNotificationResult.hasError) {
      switch (createAccountNotificationResult.error.type) {
        default: {
          const response500: Paths.MaintenancePostAccountNotification.Responses.$500 =
            {
              error: JSON.stringify(createAccountNotificationResult.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.MaintenancePostAccountNotification.Responses.$200 =
      {
        message: 'ok',
      }

    return { statusCode: 200, response: response200 }
  }
}
