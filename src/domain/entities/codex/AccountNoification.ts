export type AccountNotificatonToTypes =
  | {
      toType: 'adminId'
      toAdminIds: string[]
    }
  | {
      toType: 'teacherId'
      toTeacherIds: string[]
    }
  | {
      toType: 'email'
      toEmails: string[]
    }

export type AccountNotificaton =
  | {
      id: string
      title: string
      accounts: {
        email: string
        password: string
      }[]
    } & AccountNotificatonToTypes
