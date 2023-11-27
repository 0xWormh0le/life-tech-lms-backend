import { createTeachers, createStudentGroups } from './FreeTrialAccountDataPatterns'

describe.skip('test createTeachers', () => {
  test('run', () => {
    const result = createTeachers('PREFIX')

    console.log(JSON.stringify(result, null, 2))
  })
})

describe.skip('test createStudentGroups', () => {
  test('run', () => {
    const result = createStudentGroups('PREFIX')

    console.log(
      JSON.stringify(
        result[0].students.map((e) => e.nickName),
        null,
        2,
      ),
    )
  })
})
