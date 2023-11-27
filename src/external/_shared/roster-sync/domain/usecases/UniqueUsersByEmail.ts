import { E, Errorable } from '../../../../../domain/usecases/shared/Errors'
import { excludeNull } from '../../../../../_shared/utils'
import {
  SourceLmsAdministrator,
  SourceLmsStudent,
  SourceLmsTeacher,
} from './RosterSync'

export const uniqueUsersByEmail = async (
  allSourceLmsAdministrators: SourceLmsAdministrator[],
  allSourceLmsTeachers: SourceLmsTeacher[],
  allSourceLmsStudents: SourceLmsStudent[],
): Promise<
  Errorable<
    {
      allSourceUsersUniquebyEmail: (
        | SourceLmsAdministrator
        | SourceLmsTeacher
        | SourceLmsStudent
      )[]
      allSourceAdministratorsUniquebyEmail: SourceLmsAdministrator[]
      allSourceTeachersUniquebyEmail: SourceLmsTeacher[]
      allSourceStudentsUniquebyEmail: SourceLmsStudent[]
      usersWithNoEmail:
        | (SourceLmsAdministrator | SourceLmsTeacher | SourceLmsStudent)[]
        | null
    },
    E<'UnknownRuntimeError'>
  >
> => {
  const allSourceUsersUniquebyEmail: (
    | SourceLmsAdministrator
    | SourceLmsTeacher
    | SourceLmsStudent
  )[] = []

  const usersWithNoEmail: (
    | SourceLmsAdministrator
    | SourceLmsTeacher
    | SourceLmsStudent
  )[] = []

  for (const sourceUser of [
    ...allSourceLmsAdministrators,
    ...allSourceLmsTeachers,
    ...allSourceLmsStudents,
  ]) {
    if (!sourceUser.email || sourceUser.email === '') {
      // Skip the user with no email
      usersWithNoEmail.push(sourceUser)
      continue
    }

    const alreadyPushedUserIndex = allSourceUsersUniquebyEmail.findIndex(
      (e) => e.email && e.email !== '' && e.email === sourceUser.email,
    )

    if (alreadyPushedUserIndex < 0) {
      allSourceUsersUniquebyEmail.push(sourceUser)
    } else {
      allSourceUsersUniquebyEmail[alreadyPushedUserIndex] = sourceUser
    }
  }

  return {
    hasError: false,
    error: null,
    value: {
      allSourceUsersUniquebyEmail,
      allSourceAdministratorsUniquebyEmail: excludeNull(
        allSourceUsersUniquebyEmail.map<SourceLmsAdministrator | null>((user) =>
          user.role === 'administrator' ? user : null,
        ),
      ),
      allSourceTeachersUniquebyEmail: excludeNull(
        allSourceUsersUniquebyEmail.map<SourceLmsTeacher | null>((user) =>
          user.role === 'teacher' ? user : null,
        ),
      ),
      allSourceStudentsUniquebyEmail: excludeNull(
        allSourceUsersUniquebyEmail.map<SourceLmsStudent | null>((user) =>
          user.role === 'student' ? user : null,
        ),
      ),

      usersWithNoEmail: usersWithNoEmail.length > 0 ? usersWithNoEmail : null,
    },
  }
}
