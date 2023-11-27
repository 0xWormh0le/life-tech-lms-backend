import { uniqueUsersByEmail } from './UniqueUsersByEmail'
import { SourceLmsAdministrator, SourceLmsStudent, SourceLmsTeacher } from './RosterSync'

describe('uniqueUsersByEmail', () => {
  const administrator = (id: string, email: string): SourceLmsAdministrator => ({
    email,
    role: 'administrator',
    firstName: `administrator-firstName-${email}`,
    lastName: `administrator-lastName-${email}`,
    administratorLMSId: id,
    classlinkTenantId: `administrator-classlinkTenantId-${email}`,
    isDeactivated: false,
  })
  const teacher = (id: string, email: string): SourceLmsTeacher => ({
    email,
    role: 'teacher',
    firstName: `teacher-firstName-${email}`,
    lastName: `teacher-lastName-${email}`,
    teacherLMSId: id,
    classlinkTenantId: `teacher-classlinkTenantId-${email}`,
    isDeactivated: false,
  })
  const student = (id: string, email: string): SourceLmsStudent => ({
    email,
    role: 'student',
    nickName: `student-nickName-${email}`,
    studentLMSId: id,
    classlinkTenantId: `student-classlinkTenantId-${email}`,
    isDeactivated: false,
  })

  test('success with no duplication', async () => {
    const result = await uniqueUsersByEmail(
      [administrator('id-1', 'email-1'), administrator('id-2', 'email-2'), administrator('id-3', 'email-3')],
      [teacher('id-4', 'email-4'), teacher('id-5', 'email-5'), teacher('id-6', 'email-6')],
      [student('id-7', 'email-7'), student('id-8', 'email-8'), student('id-9', 'email-9')],
    )

    if (result.hasError) {
      throw result.error
    }

    expect(result.value.allSourceUsersUniquebyEmail).toEqual<typeof result.value.allSourceUsersUniquebyEmail>([
      administrator('id-1', 'email-1'),
      administrator('id-2', 'email-2'),
      administrator('id-3', 'email-3'),
      teacher('id-4', 'email-4'),
      teacher('id-5', 'email-5'),
      teacher('id-6', 'email-6'),
      student('id-7', 'email-7'),
      student('id-8', 'email-8'),
      student('id-9', 'email-9'),
    ])
    expect(result.value.allSourceAdministratorsUniquebyEmail).toEqual<typeof result.value.allSourceAdministratorsUniquebyEmail>([
      administrator('id-1', 'email-1'),
      administrator('id-2', 'email-2'),
      administrator('id-3', 'email-3'),
    ])
    expect(result.value.allSourceTeachersUniquebyEmail).toEqual<typeof result.value.allSourceTeachersUniquebyEmail>([
      teacher('id-4', 'email-4'),
      teacher('id-5', 'email-5'),
      teacher('id-6', 'email-6'),
    ])
    expect(result.value.allSourceStudentsUniquebyEmail).toEqual<typeof result.value.allSourceStudentsUniquebyEmail>([
      student('id-7', 'email-7'),
      student('id-8', 'email-8'),
      student('id-9', 'email-9'),
    ])
    expect(result.value.usersWithNoEmail).toBeNull()
  })

  test('success with duplication', async () => {
    const result = await uniqueUsersByEmail(
      [administrator('id-1', 'email-1'), administrator('id-2', 'email-2'), administrator('id-3', 'email-2')],
      [teacher('id-4', 'email-4'), teacher('id-5', 'email-1'), teacher('id-6', 'email-6')],
      [student('id-7', 'email-7'), student('id-8', 'email-6'), student('id-9', 'email-9')],
    )

    if (result.hasError) {
      throw result.error
    }

    expect(result.value.allSourceUsersUniquebyEmail).toEqual<typeof result.value.allSourceUsersUniquebyEmail>([
      // administrator('id-1', 'email-1'),
      teacher('id-5', 'email-1'),
      // administrator('id-2', 'email-2'),
      administrator('id-3', 'email-2'),
      teacher('id-4', 'email-4'),
      // teacher('id-6', 'email-6'),
      student('id-8', 'email-6'),
      student('id-7', 'email-7'),
      student('id-9', 'email-9'),
    ])
    expect(result.value.allSourceAdministratorsUniquebyEmail).toEqual<typeof result.value.allSourceAdministratorsUniquebyEmail>([
      // administrator('id-1', 'email-1'),
      // administrator('id-2', 'email-2'),
      administrator('id-3', 'email-2'),
    ])
    expect(result.value.allSourceTeachersUniquebyEmail).toEqual<typeof result.value.allSourceTeachersUniquebyEmail>([
      teacher('id-5', 'email-1'),
      teacher('id-4', 'email-4'),
      // teacher('id-6', 'email-6'),
    ])
    expect(result.value.allSourceStudentsUniquebyEmail).toEqual<typeof result.value.allSourceStudentsUniquebyEmail>([
      student('id-8', 'email-6'),
      student('id-7', 'email-7'),
      student('id-9', 'email-9'),
    ])
    expect(result.value.usersWithNoEmail).toBeNull()
  })

  test('success with the user has no email', async () => {
    const result = await uniqueUsersByEmail(
      [administrator('id-1', 'email-1'), administrator('id-2', ''), administrator('id-3', 'email-3')],
      [teacher('id-4', ''), teacher('id-5', ''), teacher('id-6', 'email-6')],
      [student('id-7', 'email-7'), student('id-8', 'email-8'), student('id-9', '')],
    )

    if (result.hasError) {
      throw result.error
    }

    expect(result.value.allSourceUsersUniquebyEmail).toEqual<typeof result.value.allSourceUsersUniquebyEmail>([
      administrator('id-1', 'email-1'),
      administrator('id-3', 'email-3'),
      teacher('id-6', 'email-6'),
      student('id-7', 'email-7'),
      student('id-8', 'email-8'),
    ])
    expect(result.value.allSourceAdministratorsUniquebyEmail).toEqual<typeof result.value.allSourceAdministratorsUniquebyEmail>([
      administrator('id-1', 'email-1'),
      administrator('id-3', 'email-3'),
    ])
    expect(result.value.allSourceTeachersUniquebyEmail).toEqual<typeof result.value.allSourceTeachersUniquebyEmail>([teacher('id-6', 'email-6')])
    expect(result.value.allSourceStudentsUniquebyEmail).toEqual<typeof result.value.allSourceStudentsUniquebyEmail>([
      student('id-7', 'email-7'),
      student('id-8', 'email-8'),
    ])
    expect(result.value.usersWithNoEmail).toEqual<typeof result.value.usersWithNoEmail>([
      administrator('id-2', ''),
      teacher('id-4', ''),
      teacher('id-5', ''),
      student('id-9', ''),
    ])
  })
})
