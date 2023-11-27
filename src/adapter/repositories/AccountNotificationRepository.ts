import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

import { AccountNotificationInfo } from '../../domain/usecases/maintenance/AccountNotification/MaintenanceCreateAccountNotificationUseCase'
import { Errorable, E } from '../../domain/usecases/shared/Errors'

export class AccountNotificationRepository {
  constructor(private awsRegion: string) {}

  async createAccountNotification(
    accountNotificationInfo: AccountNotificationInfo,
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    let toAddresses: string[]

    if (accountNotificationInfo.toType === 'email') {
      toAddresses = accountNotificationInfo.toEmails
    } else {
      // TODO: suppurt toType 'adminId' and 'teacherId'
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `unsupported toType ${accountNotificationInfo.toType}. Will suppurt in the future`,
        },
        value: null,
      }
    }

    try {
      const ses = new SESv2Client({ region: this.awsRegion })

      // TODO: Improve english sentence and make as HTML mail with better design
      const bodyText = `Hi. Here are your ID and Passwords issued for Life is Tech LX.

${accountNotificationInfo.accounts.map(
  (account) => `${account.email}\t${account.password}\n`,
)}

Regards,
Life is Tech Team

This email is automatically sent from system. Please don't reply this.
If you have any problem, please contact with support@lifeistech-usa.com
      `
      const sendEmailResult = await ses.send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: toAddresses,
          },
          FromEmailAddress: 'no-reply@lit-lx.com',
          Content: {
            Simple: {
              Subject: {
                Data: accountNotificationInfo.title.trim(),
                Charset: 'utf-8',
              },
              Body: {
                Text: {
                  Data: bodyText,
                  Charset: 'utf-8',
                },
              },
            },
          },
        }),
      )

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `failed to sent email with AWS SES ${e}`,
        },
        value: null,
      }
    }
  }
}
