import axios from 'axios'
import { request } from '../../api/codex-api-request'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import { lessonIdByProjectnameAndScenarioPath } from '../../../../src/adapter/typeorm/hardcoded-data/Lessons'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import dayjs from 'dayjs'
import { UserLessonStatusHistoryTypeormEntity } from '../../../../src/adapter/typeorm/entity/UserLessonStatusHistory'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'

beforeEach(setupEnvironment)

// afterEach(teardownEnvironment)
describe('Can see UserLessonStatus correctly right after the user cleared lesson', () => {
  //
  // Both of the behaviors in the case /lesson_cleared is called and in the case /lesson_finished is called
  // should be exactly the same
  //

  // const lessonClearScenario = (lessonClearApiName: string) => async () => {
  //   if (!appDataSource) {
  //     throw new Error('failed to connect database.')
  //   }
  //   const userRepo = await appDataSource.getRepository(UserTypeormEntity)
  //   await userRepo.save({
  //     login_id: 'wickwickwick',
  //     password: await hashingPassword('wickwickwick'),
  //     role: 'student',
  //   })
  //   // Login
  //   const targetLessonId = lessonIdByProjectnameAndScenarioPath(
  //     'aladdin',
  //     'lesson/g_aladdin_1',
  //   )
  //   if (!targetLessonId) {
  //     throw new Error(`aladdin lesson/g_aladdin_1 is not existing`)
  //   }

  //   const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
  //     '/login',
  //     {
  //       loginId: 'wickwickwick',
  //       password: 'wickwickwick',
  //     } as Paths.PostLogin.RequestBody,
  //   )

  //   expect(loginResponse.status).toEqual(200)
  //   if (!loginResponse.data.user) {
  //     throw new Error('failed to get user from /login')
  //   }
  //   const user = loginResponse.data.user
  //   const authorizationHeader = {
  //     Authorization: `Bearer ${user.accessToken}`,
  //     'Content-Type': 'application/json',
  //   }

  //   // See UserLessonStatus
  //   const userLessonStatusResponseAtBeginning = await axios.get(
  //     `/users/${user.id}/lessonStatuses`,
  //     {
  //       headers: authorizationHeader,
  //     },
  //   )
  //   expect(userLessonStatusResponseAtBeginning.status).toEqual(200)
  //   expect(
  //     userLessonStatusResponseAtBeginning.data,
  //   ).toEqual<Paths.GetUsersUserIdLessonStatuses.Responses.$200>({
  //     userLessonStatuses: [],
  //   })

  //   //
  //   // POST /step-passed called to start lesson
  //   //
  //   const dateWhenLessonStartedCalled = dayjs()
  //   const postStepPassedResult = await request({
  //     url: '/player_api/step_passed',
  //     method: 'post',
  //     data: {
  //       project_name: 'aladdin',
  //       scenario_path: 'lesson/g_aladdin_1',
  //       step_id: '1', // when stepId = 1, user lesson status will be recorded
  //     },
  //     headers: authorizationHeader,
  //   })
  //   if (postStepPassedResult.hasError) {
  //     throw new Error(
  //       `postStepPassedResult not 200 ${JSON.stringify(
  //         postStepPassedResult.error,
  //         null,
  //         2,
  //       )}`,
  //     )
  //   }

  //   // See UserLessonStatus
  //   const userLessonStatusResponseRightAfterStarting =
  //     await axios.get<Paths.GetUsersUserIdLessonStatuses.Responses.$200>(
  //       `/users/${user.id}/lessonStatuses`,
  //       {
  //         headers: authorizationHeader,
  //       },
  //     )
  //   if (userLessonStatusResponseRightAfterStarting.status !== 200) {
  //     throw new Error(
  //       `userLessonStatusResponseRightAfterStarting not 200 ${JSON.stringify(
  //         userLessonStatusResponseRightAfterStarting.data,
  //         null,
  //         2,
  //       )}`,
  //     )
  //   }
  //   if (!userLessonStatusResponseRightAfterStarting.data.userLessonStatuses) {
  //     throw new Error(
  //       `userLessonStatusResponseRightAfterStarting.data.userLessonStatuses is undefined`,
  //     )
  //   }
  //   expect(
  //     userLessonStatusResponseRightAfterStarting.data.userLessonStatuses
  //       ?.length,
  //   ).toEqual(1)
  //   const userLessonstatusRightAfterStarting =
  //     userLessonStatusResponseRightAfterStarting.data.userLessonStatuses[0]
  //   expect(userLessonstatusRightAfterStarting.lessonId).toEqual(targetLessonId)
  //   expect(userLessonstatusRightAfterStarting.userId).toEqual(user.id)
  //   expect(userLessonstatusRightAfterStarting.status).toEqual('not_cleared')
  //   expect(userLessonstatusRightAfterStarting.achievedStarCount).toEqual(0)
  //   expect(userLessonstatusRightAfterStarting.correctAnsweredQuizCount).toEqual(
  //     null,
  //   )
  //   expect(userLessonstatusRightAfterStarting.usedHintCount).toEqual(null)
  //   expect(userLessonstatusRightAfterStarting.stepIdskippingDetected).toEqual(
  //     false,
  //   )
  //   expect(userLessonstatusRightAfterStarting.startedAt).toBeUndefined()
  //   expect(userLessonstatusRightAfterStarting.finishedAt).toBeUndefined()

  //   //
  //   // answer quizes
  //   const quizTestCases: {
  //     stepId: string
  //     answers: {
  //       isCorrect: boolean
  //     }[]
  //   }[] = [
  //     {
  //       stepId: '3',
  //       answers: [{ isCorrect: true }], // This will be counted 1
  //     },
  //     {
  //       stepId: '4',
  //       answers: [{ isCorrect: true }], // This will be counted 2
  //     },
  //     {
  //       stepId: '5',
  //       answers: [{ isCorrect: false }],
  //     },
  //     {
  //       stepId: '6',
  //       answers: [{ isCorrect: true }], // This will be counted 3
  //     },
  //     {
  //       stepId: '7',
  //       answers: [{ isCorrect: false }, { isCorrect: true }],
  //     },
  //     {
  //       stepId: '9',
  //       answers: [
  //         { isCorrect: false },
  //         { isCorrect: false },
  //         { isCorrect: true },
  //       ],
  //     },
  //     {
  //       stepId: '10',
  //       answers: [{ isCorrect: true }], // This will be counted 4
  //     },
  //     {
  //       stepId: '11',
  //       answers: [{ isCorrect: true }], // This will be counted 5
  //     },
  //     {
  //       stepId: '13',
  //       answers: [{ isCorrect: false }],
  //     },
  //     {
  //       stepId: '14',
  //       answers: [{ isCorrect: false }, { isCorrect: true }],
  //     },
  //     {
  //       stepId: '15',
  //       answers: [
  //         { isCorrect: false },
  //         { isCorrect: false },
  //         { isCorrect: true },
  //       ],
  //     },
  //   ]
  //   for (const testCase of quizTestCases) {
  //     for (const answeer of testCase.answers) {
  //       const postQuizAnsweredResult = await request({
  //         url: '/player_api/quiz_answered',
  //         method: 'post',
  //         data: {
  //           project_name: 'aladdin',
  //           scenario_path: 'lesson/g_aladdin_1',
  //           step_id: testCase.stepId,
  //           is_correct: answeer.isCorrect,
  //           selected_choice: `Choice`,
  //         },
  //         headers: authorizationHeader,
  //       })
  //       if (postQuizAnsweredResult.hasError) {
  //         throw new Error(
  //           `postQuizAnsweredResult not 200 ${JSON.stringify(
  //             postQuizAnsweredResult.error,
  //             null,
  //             2,
  //           )}`,
  //         )
  //       }
  //     }
  //   }

  //   //
  //   // simulate lesson takes 3s
  //   await new Promise((resolve) => {
  //     setTimeout(() => resolve(undefined), 3000)
  //   })
  //   //
  //   //

  //   //
  //   // lesson_cleared called from Lesson Player
  //   //
  //   const dateWhenLessonClearedCalled = dayjs()
  //   const lessonClearedResponse =
  //     await axios.post<Paths.PostLessonCleared.Responses.$200>(
  //       `player_api/${lessonClearApiName}`,
  //       {
  //         finish_status: {
  //           quiz_all_answered: false,
  //           no_hint_cleared: true, // usedHintCount will be 0
  //           no_status_up: true, // this will be reflected to stepIdskippingDetected
  //         },
  //         project_name: 'aladdin',
  //         scenario_path: 'lesson/g_aladdin_1',
  //       } as Paths.PostLessonCleared.RequestBody,
  //       {
  //         headers: authorizationHeader,
  //       },
  //     )
  //   if (lessonClearedResponse.status !== 200) {
  //     throw new Error(
  //       `lessonClearedResponse not 200 ${JSON.stringify(
  //         lessonClearedResponse.data,
  //         null,
  //         2,
  //       )}`,
  //     )
  //   }

  //   // See UserLessonStatus
  //   const userLessonStatusResponseAfterClear =
  //     await axios.get<Paths.GetUsersUserIdLessonStatuses.Responses.$200>(
  //       `/users/${user.id}/lessonStatuses`,
  //       {
  //         headers: authorizationHeader,
  //       },
  //     )

  //   if (userLessonStatusResponseAfterClear.status !== 200) {
  //     throw new Error(
  //       `userLessonStatusResponseAfterClear not 200 ${JSON.stringify(
  //         userLessonStatusResponseAfterClear.data,
  //         null,
  //         2,
  //       )}`,
  //     )
  //   }
  //   if (!userLessonStatusResponseAfterClear.data.userLessonStatuses) {
  //     throw new Error(
  //       'userLessonStatusResponseAfterClear.data.userLessonStatuses is undefined',
  //     )
  //   }
  //   expect(
  //     userLessonStatusResponseAfterClear.data.userLessonStatuses.length,
  //   ).toEqual(1)
  //   const userLessonStatusAfterClear =
  //     userLessonStatusResponseAfterClear.data.userLessonStatuses[0]
  //   expect(userLessonStatusAfterClear.lessonId).toEqual(targetLessonId)
  //   expect(userLessonStatusAfterClear.userId).toEqual(user.id)
  //   expect(userLessonStatusAfterClear.status).toEqual('cleared')
  //   expect(userLessonStatusAfterClear.achievedStarCount).toEqual(2)
  //   expect(userLessonStatusAfterClear.correctAnsweredQuizCount).toEqual(5)
  //   expect(userLessonStatusAfterClear.usedHintCount).toEqual(0)
  //   expect(userLessonStatusAfterClear.stepIdskippingDetected).toEqual(true)

  //   expect(userLessonStatusAfterClear.startedAt).not.toBeUndefined()
  //   expect(
  //     dayjs(userLessonStatusAfterClear.startedAt).diff(
  //       dateWhenLessonStartedCalled,
  //       'second',
  //     ),
  //   ).toBeLessThan(1)
  //   expect(userLessonStatusAfterClear.finishedAt).not.toBeUndefined()
  //   expect(
  //     dayjs(userLessonStatusAfterClear.finishedAt).diff(
  //       dateWhenLessonClearedCalled,
  //       'second',
  //     ),
  //   ).toBeLessThan(1)

  //   //
  //   // POST /user-lesson-status called to start again same lesson
  //   //
  //   const dateWhenLessonStartedCalledAgain = dayjs()
  //   const postUserLessonStatusResult1 =
  //     await axios.post<Paths.PostUserLessonStatus.Responses.$200>(
  //       '/user-lesson-status',
  //       {
  //         lessonId: targetLessonId,
  //       } as Paths.PostUserLessonStatus.RequestBody,
  //       {
  //         headers: authorizationHeader,
  //       },
  //     )
  //   if (postUserLessonStatusResult1.status !== 200) {
  //     throw new Error(
  //       `postUserLessonStatusResult not 200 ${JSON.stringify(
  //         postUserLessonStatusResult1.data,
  //         null,
  //         2,
  //       )}`,
  //     )
  //   }
  //   const userLessonStatusHistoryRepository = await appDataSource.getRepository(
  //     UserLessonStatusHistoryTypeormEntity,
  //   )
  //   const userLessonStatusHistoriesData =
  //     await userLessonStatusHistoryRepository.find({
  //       where: {
  //         user_id: user.id,
  //         lesson_id: targetLessonId,
  //       },
  //       order: {
  //         started_at: 'DESC',
  //       },
  //     })
  //   expect(userLessonStatusHistoriesData.length).toEqual(2)
  //   expect(userLessonStatusHistoriesData[0].started_at).not.toBeUndefined()
  //   expect(
  //     dayjs(userLessonStatusHistoriesData[0].started_at).diff(
  //       dateWhenLessonStartedCalledAgain,
  //       'second',
  //     ),
  //   ).toBeLessThan(1)
  //   expect(userLessonStatusHistoriesData[0].finished_at).toBe(null)

  //   //
  //   // In case there are no Quiz

  //   //
  //   // simulate lesson takes 3s
  //   await new Promise((resolve) => {
  //     setTimeout(() => resolve(undefined), 3000)
  //   })

  //   //
  //   // lesson_cleared called again
  //   //
  //   const dateWhenLessonClearedCalledAgain = dayjs()
  //   const lessonClearedResponse2 =
  //     await axios.post<Paths.PostLessonCleared.Responses.$200>(
  //       `player_api/${lessonClearApiName}`,
  //       {
  //         finish_status: {
  //           quiz_all_answered: true,
  //           no_hint_cleared: false, // usedHintCount will be 1
  //           no_status_up: false, // this will be reflected to stepIdskippingDetected
  //         },
  //         project_name: 'aladdin',
  //         scenario_path: 'lesson/g_aladdin_1',
  //       } as Paths.PostLessonCleared.RequestBody,
  //       {
  //         headers: authorizationHeader,
  //       },
  //     )
  //   if (lessonClearedResponse2.status !== 200) {
  //     throw new Error(
  //       `lessonClearedResponse2 not 200 ${JSON.stringify(
  //         lessonClearedResponse2.data,
  //         null,
  //         2,
  //       )}`,
  //     )
  //   }
  //   // See UserLessonStatus
  //   const userLessonStatus2ResponseAfterClear =
  //     await axios.get<Paths.GetUsersUserIdLessonStatuses.Responses.$200>(
  //       `/users/${user.id}/lessonStatuses`,
  //       {
  //         headers: authorizationHeader,
  //       },
  //     )

  //   if (userLessonStatus2ResponseAfterClear.status !== 200) {
  //     throw new Error(
  //       `userLessonStatus2ResponseAfterClear not 200 ${JSON.stringify(
  //         userLessonStatus2ResponseAfterClear.data,
  //         null,
  //         2,
  //       )}`,
  //     )
  //   }
  //   if (!userLessonStatus2ResponseAfterClear.data.userLessonStatuses) {
  //     throw new Error(
  //       'userLessonStatus2ResponseAfterClear.data.userLessonStatuses is undefined',
  //     )
  //   }
  //   expect(
  //     userLessonStatus2ResponseAfterClear.data.userLessonStatuses.length,
  //   ).toEqual(1)
  //   const userLessonStatusAfterClear2 =
  //     userLessonStatus2ResponseAfterClear.data.userLessonStatuses[0]
  //   expect(userLessonStatusAfterClear2.achievedStarCount).toEqual(2)

  //   //TODO: Need to remove 154 line when quiz api start calling
  //   //DSB-1139: Teacher can see the number of Quiz which the student answered correctly
  //   if (lessonClearApiName === 'lesson_cleared') {
  //     console.log(
  //       'Lesson_cleared :',
  //       userLessonStatusAfterClear2.correctAnsweredQuizCount,
  //     )

  //     expect(userLessonStatusAfterClear2.correctAnsweredQuizCount).toEqual(1)
  //   }
  //   if (lessonClearApiName === 'lesson_finished') {
  //     console.log(
  //       'lesson_finished:',
  //       userLessonStatusAfterClear2.correctAnsweredQuizCount,
  //     )

  //     expect(userLessonStatusAfterClear2.correctAnsweredQuizCount).toEqual(0)
  //   }

  //   expect(userLessonStatusAfterClear2.correctAnsweredQuizCount).toEqual(0)
  //   expect(userLessonStatusAfterClear2.usedHintCount).toEqual(1)
  //   expect(userLessonStatusAfterClear2.stepIdskippingDetected).toEqual(false)
  //   expect(userLessonStatusAfterClear2.startedAt).not.toBeUndefined()
  //   expect(
  //     dayjs(userLessonStatusAfterClear2.startedAt).diff(
  //       dateWhenLessonStartedCalledAgain,
  //       'second',
  //     ),
  //   ).toBeLessThan(1)
  //   expect(userLessonStatusAfterClear2.finishedAt).not.toBeUndefined()
  //   expect(
  //     dayjs(userLessonStatusAfterClear2.finishedAt).diff(
  //       dateWhenLessonClearedCalledAgain,
  //       'second',
  //     ),
  //   ).toBeLessThan(1)
  // }

  // test(
  //   'In the case of lesson_cleared called when the user cleared lesson',
  //   lessonClearScenario('lesson_cleared'),
  //   10000,
  //)
  // test(
  //   'In the case of lesson_finished called when the user cleared lesson',
  //   lessonClearScenario('lesson_finished'),
  //   10000,
  // )

  //TODO : Need to remove below line of code and uncomment above commented code., the quiz api not calling for codeillsuion lessons so i have remove comman function.
  //DSB-1139: Teacher can see the number of Quiz which the student answered correctly
  test('In the case of lesson_cleared called when the user cleared lesson', async () => {
    if (!appDataSource) {
      throw new Error('failed to connect database.')
    }

    const userRepo = await appDataSource.getRepository(UserTypeormEntity)

    await userRepo.save({
      login_id: 'wickwickwick',
      password: await hashingPassword('wickwickwick'),
      role: 'student',
    })

    // Login
    const targetLessonId = lessonIdByProjectnameAndScenarioPath(
      'aladdin',
      'lesson/g_aladdin_1',
    )

    if (!targetLessonId) {
      throw new Error(`aladdin lesson/g_aladdin_1 is not existing`)
    }

    const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
      '/login',
      {
        loginId: 'wickwickwick',
        password: 'wickwickwick',
      } as Paths.PostLogin.RequestBody,
    )

    expect(loginResponse.status).toEqual(200)

    if (!loginResponse.data.user) {
      throw new Error('failed to get user from /login')
    }

    const user = loginResponse.data.user
    const authorizationHeader = {
      Authorization: `Bearer ${user.accessToken}`,
      'Content-Type': 'application/json',
    }

    // See UserLessonStatus
    const userLessonStatusResponseAtBeginning = await axios.get(
      `/users/${user.id}/lessonStatuses`,
      {
        headers: authorizationHeader,
      },
    )

    expect(userLessonStatusResponseAtBeginning.status).toEqual(200)
    expect(
      userLessonStatusResponseAtBeginning.data,
    ).toEqual<Paths.GetUsersUserIdLessonStatuses.Responses.$200>({
      userLessonStatuses: [],
    })

    //
    // POST /step-passed called to start lesson
    //
    const dateWhenLessonStartedCalled = dayjs()
    const postStepPassedResult = await request({
      url: '/player_api/step_passed',
      method: 'post',
      data: {
        project_name: 'aladdin',
        scenario_path: 'lesson/g_aladdin_1',
        step_id: '1', // when stepId = 1, user lesson status will be recorded
      },
      headers: authorizationHeader,
    })

    if (postStepPassedResult.hasError) {
      throw new Error(
        `postStepPassedResult not 200 ${JSON.stringify(
          postStepPassedResult.error,
          null,
          2,
        )}`,
      )
    }

    // See UserLessonStatus
    const userLessonStatusResponseRightAfterStarting =
      await axios.get<Paths.GetUsersUserIdLessonStatuses.Responses.$200>(
        `/users/${user.id}/lessonStatuses`,
        {
          headers: authorizationHeader,
        },
      )

    if (userLessonStatusResponseRightAfterStarting.status !== 200) {
      throw new Error(
        `userLessonStatusResponseRightAfterStarting not 200 ${JSON.stringify(
          userLessonStatusResponseRightAfterStarting.data,
          null,
          2,
        )}`,
      )
    }

    if (!userLessonStatusResponseRightAfterStarting.data.userLessonStatuses) {
      throw new Error(
        `userLessonStatusResponseRightAfterStarting.data.userLessonStatuses is undefined`,
      )
    }
    expect(
      userLessonStatusResponseRightAfterStarting.data.userLessonStatuses
        ?.length,
    ).toEqual(1)

    const userLessonstatusRightAfterStarting =
      userLessonStatusResponseRightAfterStarting.data.userLessonStatuses[0]

    expect(userLessonstatusRightAfterStarting.lessonId).toEqual(targetLessonId)
    expect(userLessonstatusRightAfterStarting.userId).toEqual(user.id)
    expect(userLessonstatusRightAfterStarting.status).toEqual('not_cleared')
    expect(userLessonstatusRightAfterStarting.achievedStarCount).toEqual(0)
    expect(userLessonstatusRightAfterStarting.correctAnsweredQuizCount).toEqual(
      null,
    )
    expect(userLessonstatusRightAfterStarting.usedHintCount).toEqual(null)
    expect(userLessonstatusRightAfterStarting.stepIdskippingDetected).toEqual(
      false,
    )
    expect(userLessonstatusRightAfterStarting.startedAt).toBeUndefined()
    expect(userLessonstatusRightAfterStarting.finishedAt).toBeUndefined()

    //
    // answer quizes
    const quizTestCases: {
      stepId: string
      answers: {
        isCorrect: boolean
      }[]
    }[] = [
      {
        stepId: '3',
        answers: [{ isCorrect: true }], // This will be counted 1
      },
      {
        stepId: '4',
        answers: [{ isCorrect: true }], // This will be counted 2
      },
      {
        stepId: '5',
        answers: [{ isCorrect: false }],
      },
      {
        stepId: '6',
        answers: [{ isCorrect: true }], // This will be counted 3
      },
      {
        stepId: '7',
        answers: [{ isCorrect: false }, { isCorrect: true }],
      },
      {
        stepId: '9',
        answers: [
          { isCorrect: false },
          { isCorrect: false },
          { isCorrect: true },
        ],
      },
      {
        stepId: '10',
        answers: [{ isCorrect: true }], // This will be counted 4
      },
      {
        stepId: '11',
        answers: [{ isCorrect: true }], // This will be counted 5
      },
      {
        stepId: '13',
        answers: [{ isCorrect: false }],
      },
      {
        stepId: '14',
        answers: [{ isCorrect: false }, { isCorrect: true }],
      },
      {
        stepId: '15',
        answers: [
          { isCorrect: false },
          { isCorrect: false },
          { isCorrect: true },
        ],
      },
    ]

    for (const testCase of quizTestCases) {
      for (const answeer of testCase.answers) {
        const postQuizAnsweredResult = await request({
          url: '/player_api/quiz_answered',
          method: 'post',
          data: {
            project_name: 'aladdin',
            scenario_path: 'lesson/g_aladdin_1',
            step_id: testCase.stepId,
            is_correct: answeer.isCorrect,
            selected_choice: `Choice`,
          },
          headers: authorizationHeader,
        })

        if (postQuizAnsweredResult.hasError) {
          throw new Error(
            `postQuizAnsweredResult not 200 ${JSON.stringify(
              postQuizAnsweredResult.error,
              null,
              2,
            )}`,
          )
        }
      }
    }

    //
    // simulate lesson takes 3s
    await new Promise((resolve) => {
      setTimeout(() => resolve(undefined), 3000)
    })
    //
    //

    //
    // lesson_cleared called from Lesson Player
    //
    const dateWhenLessonClearedCalled = dayjs()
    const lessonClearedResponse =
      await axios.post<Paths.PostLessonCleared.Responses.$200>(
        `player_api/${'lesson_cleared'}`,
        {
          finish_status: {
            quiz_all_answered: false,
            no_hint_cleared: true, // usedHintCount will be 0
            no_status_up: true, // this will be reflected to stepIdskippingDetected
          },
          project_name: 'aladdin',
          scenario_path: 'lesson/g_aladdin_1',
        } as Paths.PostLessonCleared.RequestBody,
        {
          headers: authorizationHeader,
        },
      )

    if (lessonClearedResponse.status !== 200) {
      throw new Error(
        `lessonClearedResponse not 200 ${JSON.stringify(
          lessonClearedResponse.data,
          null,
          2,
        )}`,
      )
    }

    // See UserLessonStatus
    const userLessonStatusResponseAfterClear =
      await axios.get<Paths.GetUsersUserIdLessonStatuses.Responses.$200>(
        `/users/${user.id}/lessonStatuses`,
        {
          headers: authorizationHeader,
        },
      )

    if (userLessonStatusResponseAfterClear.status !== 200) {
      throw new Error(
        `userLessonStatusResponseAfterClear not 200 ${JSON.stringify(
          userLessonStatusResponseAfterClear.data,
          null,
          2,
        )}`,
      )
    }

    if (!userLessonStatusResponseAfterClear.data.userLessonStatuses) {
      throw new Error(
        'userLessonStatusResponseAfterClear.data.userLessonStatuses is undefined',
      )
    }
    expect(
      userLessonStatusResponseAfterClear.data.userLessonStatuses.length,
    ).toEqual(1)

    const userLessonStatusAfterClear =
      userLessonStatusResponseAfterClear.data.userLessonStatuses[0]

    expect(userLessonStatusAfterClear.lessonId).toEqual(targetLessonId)
    expect(userLessonStatusAfterClear.userId).toEqual(user.id)
    expect(userLessonStatusAfterClear.status).toEqual('cleared')
    expect(userLessonStatusAfterClear.achievedStarCount).toEqual(2)
    expect(userLessonStatusAfterClear.correctAnsweredQuizCount).toEqual(5)
    expect(userLessonStatusAfterClear.usedHintCount).toEqual(0)
    expect(userLessonStatusAfterClear.stepIdskippingDetected).toEqual(true)

    expect(userLessonStatusAfterClear.startedAt).not.toBeUndefined()
    expect(
      dayjs(userLessonStatusAfterClear.startedAt).diff(
        dateWhenLessonStartedCalled,
        'second',
      ),
    ).toBeLessThan(1)
    expect(userLessonStatusAfterClear.finishedAt).not.toBeUndefined()
    expect(
      dayjs(userLessonStatusAfterClear.finishedAt).diff(
        dateWhenLessonClearedCalled,
        'second',
      ),
    ).toBeLessThan(1)

    //
    // POST /user-lesson-status called to start again same lesson
    //
    const dateWhenLessonStartedCalledAgain = dayjs()
    const postUserLessonStatusResult1 =
      await axios.post<Paths.PostUserLessonStatus.Responses.$200>(
        '/user-lesson-status',
        {
          lessonId: targetLessonId,
        } as Paths.PostUserLessonStatus.RequestBody,
        {
          headers: authorizationHeader,
        },
      )

    if (postUserLessonStatusResult1.status !== 200) {
      throw new Error(
        `postUserLessonStatusResult not 200 ${JSON.stringify(
          postUserLessonStatusResult1.data,
          null,
          2,
        )}`,
      )
    }

    const userLessonStatusHistoryRepository = await appDataSource.getRepository(
      UserLessonStatusHistoryTypeormEntity,
    )
    const userLessonStatusHistoriesData =
      await userLessonStatusHistoryRepository.find({
        where: {
          user_id: user.id,
          lesson_id: targetLessonId,
        },
        order: {
          started_at: 'DESC',
        },
      })

    expect(userLessonStatusHistoriesData.length).toEqual(2)
    expect(userLessonStatusHistoriesData[0].started_at).not.toBeUndefined()
    expect(
      dayjs(userLessonStatusHistoriesData[0].started_at).diff(
        dateWhenLessonStartedCalledAgain,
        'second',
      ),
    ).toBeLessThan(1)
    expect(userLessonStatusHistoriesData[0].finished_at).toBe(null)

    //
    // In case there are no Quiz

    //
    // simulate lesson takes 3s
    await new Promise((resolve) => {
      setTimeout(() => resolve(undefined), 3000)
    })

    //
    // lesson_cleared called again
    //
    const dateWhenLessonClearedCalledAgain = dayjs()
    const lessonClearedResponse2 =
      await axios.post<Paths.PostLessonCleared.Responses.$200>(
        `player_api/${'lesson_cleared'}`,
        {
          finish_status: {
            quiz_all_answered: true,
            no_hint_cleared: false, // usedHintCount will be 1
            no_status_up: false, // this will be reflected to stepIdskippingDetected
          },
          project_name: 'aladdin',
          scenario_path: 'lesson/g_aladdin_1',
        } as Paths.PostLessonCleared.RequestBody,
        {
          headers: authorizationHeader,
        },
      )

    if (lessonClearedResponse2.status !== 200) {
      throw new Error(
        `lessonClearedResponse2 not 200 ${JSON.stringify(
          lessonClearedResponse2.data,
          null,
          2,
        )}`,
      )
    }

    // See UserLessonStatus
    const userLessonStatus2ResponseAfterClear =
      await axios.get<Paths.GetUsersUserIdLessonStatuses.Responses.$200>(
        `/users/${user.id}/lessonStatuses`,
        {
          headers: authorizationHeader,
        },
      )

    if (userLessonStatus2ResponseAfterClear.status !== 200) {
      throw new Error(
        `userLessonStatus2ResponseAfterClear not 200 ${JSON.stringify(
          userLessonStatus2ResponseAfterClear.data,
          null,
          2,
        )}`,
      )
    }

    if (!userLessonStatus2ResponseAfterClear.data.userLessonStatuses) {
      throw new Error(
        'userLessonStatus2ResponseAfterClear.data.userLessonStatuses is undefined',
      )
    }
    expect(
      userLessonStatus2ResponseAfterClear.data.userLessonStatuses.length,
    ).toEqual(1)

    const userLessonStatusAfterClear2 =
      userLessonStatus2ResponseAfterClear.data.userLessonStatuses[0]

    expect(userLessonStatusAfterClear2.achievedStarCount).toEqual(2)

    //TODO: Need to remove 154 line when quiz api start calling
    //DSB-1139: Teacher can see the number of Quiz which the student answered correctly
    expect(userLessonStatusAfterClear2.correctAnsweredQuizCount).toEqual(1)
    expect(userLessonStatusAfterClear2.usedHintCount).toEqual(1)
    expect(userLessonStatusAfterClear2.stepIdskippingDetected).toEqual(false)
    expect(userLessonStatusAfterClear2.startedAt).not.toBeUndefined()
    expect(
      dayjs(userLessonStatusAfterClear2.startedAt).diff(
        dateWhenLessonStartedCalledAgain,
        'second',
      ),
    ).toBeLessThan(1)
    expect(userLessonStatusAfterClear2.finishedAt).not.toBeUndefined()
    expect(
      dayjs(userLessonStatusAfterClear2.finishedAt).diff(
        dateWhenLessonClearedCalledAgain,
        'second',
      ),
    ).toBeLessThan(1)
  }, 10000)

  test('In the case of lesson_finished called when the user cleared lesson', async () => {
    if (!appDataSource) {
      throw new Error('failed to connect database.')
    }

    const userRepo = await appDataSource.getRepository(UserTypeormEntity)

    await userRepo.save({
      login_id: 'wickwickwick',
      password: await hashingPassword('wickwickwick'),
      role: 'student',
    })

    // Login
    const targetLessonId = lessonIdByProjectnameAndScenarioPath(
      'aladdin',
      'lesson/g_aladdin_1',
    )

    if (!targetLessonId) {
      throw new Error(`aladdin lesson/g_aladdin_1 is not existing`)
    }

    const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
      '/login',
      {
        loginId: 'wickwickwick',
        password: 'wickwickwick',
      } as Paths.PostLogin.RequestBody,
    )

    expect(loginResponse.status).toEqual(200)

    if (!loginResponse.data.user) {
      throw new Error('failed to get user from /login')
    }

    const user = loginResponse.data.user
    const authorizationHeader = {
      Authorization: `Bearer ${user.accessToken}`,
      'Content-Type': 'application/json',
    }

    // See UserLessonStatus
    const userLessonStatusResponseAtBeginning = await axios.get(
      `/users/${user.id}/lessonStatuses`,
      {
        headers: authorizationHeader,
      },
    )

    expect(userLessonStatusResponseAtBeginning.status).toEqual(200)
    expect(
      userLessonStatusResponseAtBeginning.data,
    ).toEqual<Paths.GetUsersUserIdLessonStatuses.Responses.$200>({
      userLessonStatuses: [],
    })

    //
    // POST /step-passed called to start lesson
    //
    const dateWhenLessonStartedCalled = dayjs()
    const postStepPassedResult = await request({
      url: '/player_api/step_passed',
      method: 'post',
      data: {
        project_name: 'aladdin',
        scenario_path: 'lesson/g_aladdin_1',
        step_id: '1', // when stepId = 1, user lesson status will be recorded
      },
      headers: authorizationHeader,
    })

    if (postStepPassedResult.hasError) {
      throw new Error(
        `postStepPassedResult not 200 ${JSON.stringify(
          postStepPassedResult.error,
          null,
          2,
        )}`,
      )
    }

    // See UserLessonStatus
    const userLessonStatusResponseRightAfterStarting =
      await axios.get<Paths.GetUsersUserIdLessonStatuses.Responses.$200>(
        `/users/${user.id}/lessonStatuses`,
        {
          headers: authorizationHeader,
        },
      )

    if (userLessonStatusResponseRightAfterStarting.status !== 200) {
      throw new Error(
        `userLessonStatusResponseRightAfterStarting not 200 ${JSON.stringify(
          userLessonStatusResponseRightAfterStarting.data,
          null,
          2,
        )}`,
      )
    }

    if (!userLessonStatusResponseRightAfterStarting.data.userLessonStatuses) {
      throw new Error(
        `userLessonStatusResponseRightAfterStarting.data.userLessonStatuses is undefined`,
      )
    }
    expect(
      userLessonStatusResponseRightAfterStarting.data.userLessonStatuses
        ?.length,
    ).toEqual(1)

    const userLessonstatusRightAfterStarting =
      userLessonStatusResponseRightAfterStarting.data.userLessonStatuses[0]

    expect(userLessonstatusRightAfterStarting.lessonId).toEqual(targetLessonId)
    expect(userLessonstatusRightAfterStarting.userId).toEqual(user.id)
    expect(userLessonstatusRightAfterStarting.status).toEqual('not_cleared')
    expect(userLessonstatusRightAfterStarting.achievedStarCount).toEqual(0)
    expect(userLessonstatusRightAfterStarting.correctAnsweredQuizCount).toEqual(
      null,
    )
    expect(userLessonstatusRightAfterStarting.usedHintCount).toEqual(null)
    expect(userLessonstatusRightAfterStarting.stepIdskippingDetected).toEqual(
      false,
    )
    expect(userLessonstatusRightAfterStarting.startedAt).toBeUndefined()
    expect(userLessonstatusRightAfterStarting.finishedAt).toBeUndefined()

    //
    // answer quizes
    const quizTestCases: {
      stepId: string
      answers: {
        isCorrect: boolean
      }[]
    }[] = [
      {
        stepId: '3',
        answers: [{ isCorrect: true }], // This will be counted 1
      },
      {
        stepId: '4',
        answers: [{ isCorrect: true }], // This will be counted 2
      },
      {
        stepId: '5',
        answers: [{ isCorrect: false }],
      },
      {
        stepId: '6',
        answers: [{ isCorrect: true }], // This will be counted 3
      },
      {
        stepId: '7',
        answers: [{ isCorrect: false }, { isCorrect: true }],
      },
      {
        stepId: '9',
        answers: [
          { isCorrect: false },
          { isCorrect: false },
          { isCorrect: true },
        ],
      },
      {
        stepId: '10',
        answers: [{ isCorrect: true }], // This will be counted 4
      },
      {
        stepId: '11',
        answers: [{ isCorrect: true }], // This will be counted 5
      },
      {
        stepId: '13',
        answers: [{ isCorrect: false }],
      },
      {
        stepId: '14',
        answers: [{ isCorrect: false }, { isCorrect: true }],
      },
      {
        stepId: '15',
        answers: [
          { isCorrect: false },
          { isCorrect: false },
          { isCorrect: true },
        ],
      },
    ]

    for (const testCase of quizTestCases) {
      for (const answeer of testCase.answers) {
        const postQuizAnsweredResult = await request({
          url: '/player_api/quiz_answered',
          method: 'post',
          data: {
            project_name: 'aladdin',
            scenario_path: 'lesson/g_aladdin_1',
            step_id: testCase.stepId,
            is_correct: answeer.isCorrect,
            selected_choice: `Choice`,
          },
          headers: authorizationHeader,
        })

        if (postQuizAnsweredResult.hasError) {
          throw new Error(
            `postQuizAnsweredResult not 200 ${JSON.stringify(
              postQuizAnsweredResult.error,
              null,
              2,
            )}`,
          )
        }
      }
    }

    //
    // simulate lesson takes 3s
    await new Promise((resolve) => {
      setTimeout(() => resolve(undefined), 3000)
    })
    //
    //

    //
    // lesson_finished called from Lesson Player
    //
    const dateWhenLessonClearedCalled = dayjs()
    const lessonClearedResponse =
      await axios.post<Paths.PostLessonCleared.Responses.$200>(
        `player_api/${'lesson_finished'}`,
        {
          finish_status: {
            quiz_all_answered: false,
            no_hint_cleared: true, // usedHintCount will be 0
            no_status_up: true, // this will be reflected to stepIdskippingDetected
          },
          project_name: 'aladdin',
          scenario_path: 'lesson/g_aladdin_1',
        } as Paths.PostLessonCleared.RequestBody,
        {
          headers: authorizationHeader,
        },
      )

    if (lessonClearedResponse.status !== 200) {
      throw new Error(
        `lessonClearedResponse not 200 ${JSON.stringify(
          lessonClearedResponse.data,
          null,
          2,
        )}`,
      )
    }

    // See UserLessonStatus
    const userLessonStatusResponseAfterClear =
      await axios.get<Paths.GetUsersUserIdLessonStatuses.Responses.$200>(
        `/users/${user.id}/lessonStatuses`,
        {
          headers: authorizationHeader,
        },
      )

    if (userLessonStatusResponseAfterClear.status !== 200) {
      throw new Error(
        `userLessonStatusResponseAfterClear not 200 ${JSON.stringify(
          userLessonStatusResponseAfterClear.data,
          null,
          2,
        )}`,
      )
    }

    if (!userLessonStatusResponseAfterClear.data.userLessonStatuses) {
      throw new Error(
        'userLessonStatusResponseAfterClear.data.userLessonStatuses is undefined',
      )
    }
    expect(
      userLessonStatusResponseAfterClear.data.userLessonStatuses.length,
    ).toEqual(1)

    const userLessonStatusAfterClear =
      userLessonStatusResponseAfterClear.data.userLessonStatuses[0]

    expect(userLessonStatusAfterClear.lessonId).toEqual(targetLessonId)
    expect(userLessonStatusAfterClear.userId).toEqual(user.id)
    expect(userLessonStatusAfterClear.status).toEqual('cleared')
    expect(userLessonStatusAfterClear.achievedStarCount).toEqual(2)
    expect(userLessonStatusAfterClear.correctAnsweredQuizCount).toEqual(5)
    expect(userLessonStatusAfterClear.usedHintCount).toEqual(0)
    expect(userLessonStatusAfterClear.stepIdskippingDetected).toEqual(true)

    expect(userLessonStatusAfterClear.startedAt).not.toBeUndefined()
    expect(
      dayjs(userLessonStatusAfterClear.startedAt).diff(
        dateWhenLessonStartedCalled,
        'second',
      ),
    ).toBeLessThan(1)
    expect(userLessonStatusAfterClear.finishedAt).not.toBeUndefined()
    expect(
      dayjs(userLessonStatusAfterClear.finishedAt).diff(
        dateWhenLessonClearedCalled,
        'second',
      ),
    ).toBeLessThan(1)

    //
    // POST /user-lesson-status called to start again same lesson
    //
    const dateWhenLessonStartedCalledAgain = dayjs()
    const postUserLessonStatusResult1 =
      await axios.post<Paths.PostUserLessonStatus.Responses.$200>(
        '/user-lesson-status',
        {
          lessonId: targetLessonId,
        } as Paths.PostUserLessonStatus.RequestBody,
        {
          headers: authorizationHeader,
        },
      )

    if (postUserLessonStatusResult1.status !== 200) {
      throw new Error(
        `postUserLessonStatusResult not 200 ${JSON.stringify(
          postUserLessonStatusResult1.data,
          null,
          2,
        )}`,
      )
    }

    const userLessonStatusHistoryRepository = await appDataSource.getRepository(
      UserLessonStatusHistoryTypeormEntity,
    )
    const userLessonStatusHistoriesData =
      await userLessonStatusHistoryRepository.find({
        where: {
          user_id: user.id,
          lesson_id: targetLessonId,
        },
        order: {
          started_at: 'DESC',
        },
      })

    expect(userLessonStatusHistoriesData.length).toEqual(2)
    expect(userLessonStatusHistoriesData[0].started_at).not.toBeUndefined()
    expect(
      dayjs(userLessonStatusHistoriesData[0].started_at).diff(
        dateWhenLessonStartedCalledAgain,
        'second',
      ),
    ).toBeLessThan(1)
    expect(userLessonStatusHistoriesData[0].finished_at).toBe(null)

    //
    // In case there are no Quiz

    //
    // simulate lesson takes 3s
    await new Promise((resolve) => {
      setTimeout(() => resolve(undefined), 3000)
    })

    //
    // lesson_finished called again
    //
    const dateWhenLessonClearedCalledAgain = dayjs()
    const lessonClearedResponse2 =
      await axios.post<Paths.PostLessonCleared.Responses.$200>(
        `player_api/${'lesson_finished'}`,
        {
          finish_status: {
            quiz_all_answered: true,
            no_hint_cleared: false, // usedHintCount will be 1
            no_status_up: false, // this will be reflected to stepIdskippingDetected
          },
          project_name: 'aladdin',
          scenario_path: 'lesson/g_aladdin_1',
        } as Paths.PostLessonCleared.RequestBody,
        {
          headers: authorizationHeader,
        },
      )

    if (lessonClearedResponse2.status !== 200) {
      throw new Error(
        `lessonClearedResponse2 not 200 ${JSON.stringify(
          lessonClearedResponse2.data,
          null,
          2,
        )}`,
      )
    }

    // See UserLessonStatus
    const userLessonStatus2ResponseAfterClear =
      await axios.get<Paths.GetUsersUserIdLessonStatuses.Responses.$200>(
        `/users/${user.id}/lessonStatuses`,
        {
          headers: authorizationHeader,
        },
      )

    if (userLessonStatus2ResponseAfterClear.status !== 200) {
      throw new Error(
        `userLessonStatus2ResponseAfterClear not 200 ${JSON.stringify(
          userLessonStatus2ResponseAfterClear.data,
          null,
          2,
        )}`,
      )
    }

    if (!userLessonStatus2ResponseAfterClear.data.userLessonStatuses) {
      throw new Error(
        'userLessonStatus2ResponseAfterClear.data.userLessonStatuses is undefined',
      )
    }
    expect(
      userLessonStatus2ResponseAfterClear.data.userLessonStatuses.length,
    ).toEqual(1)

    const userLessonStatusAfterClear2 =
      userLessonStatus2ResponseAfterClear.data.userLessonStatuses[0]

    expect(userLessonStatusAfterClear2.achievedStarCount).toEqual(2)
    expect(userLessonStatusAfterClear2.correctAnsweredQuizCount).toEqual(0)
    expect(userLessonStatusAfterClear2.usedHintCount).toEqual(1)
    expect(userLessonStatusAfterClear2.stepIdskippingDetected).toEqual(false)
    expect(userLessonStatusAfterClear2.startedAt).not.toBeUndefined()
    expect(
      dayjs(userLessonStatusAfterClear2.startedAt).diff(
        dateWhenLessonStartedCalledAgain,
        'second',
      ),
    ).toBeLessThan(1)
    expect(userLessonStatusAfterClear2.finishedAt).not.toBeUndefined()
    expect(
      dayjs(userLessonStatusAfterClear2.finishedAt).diff(
        dateWhenLessonClearedCalledAgain,
        'second',
      ),
    ).toBeLessThan(1)
  }, 10000)
})
