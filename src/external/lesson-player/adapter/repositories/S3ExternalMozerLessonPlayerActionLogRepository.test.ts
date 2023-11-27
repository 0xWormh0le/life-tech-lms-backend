import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { S3ExternalMozerLessonPlayerActionLogRepository } from './S3ExternalMozerLessonPlayerActionLogRepository'
import { ExternalMozerLessonPlayerActionLog } from '../../domain/entities/ExternalMozerLessonPlayerActionLog'
import dotenv from 'dotenv'

beforeAll(async () => {
  await setupEnvironment()
  dotenv.config()
})

afterAll(teardownEnvironment)

describe('S3ExternalMozerLessonPlayerActionLogRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  let s3ExternalMozerLessonPlayerActionLogRepository: S3ExternalMozerLessonPlayerActionLogRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }
    s3ExternalMozerLessonPlayerActionLogRepository = new S3ExternalMozerLessonPlayerActionLogRepository()
  })

  let externalMozerLessonPlayerActionLogToBeUntouched: ExternalMozerLessonPlayerActionLog

  test('issue new id', async () => {
    const res = await s3ExternalMozerLessonPlayerActionLogRepository.issueId()

    expect(res.error).toBeNull()

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.value).toBeDefined()

    if (!res.value) {
      throw new Error()
    }
  })

  test('create externalMozerLessonPlayerActionLogToBeUntouched', async () => {
    const externalMozerLessonPlayerActionLogToBeUntouchedIdRes = await s3ExternalMozerLessonPlayerActionLogRepository.issueId()

    if (!externalMozerLessonPlayerActionLogToBeUntouchedIdRes.value) {
      throw new Error('failed to create id for externalMozerLessonPlayerActionLogToBeUntouched')
    }

    const externalMozerLessonPlayerActionLogToBeUntouchedId = externalMozerLessonPlayerActionLogToBeUntouchedIdRes.value

    externalMozerLessonPlayerActionLogToBeUntouched = {
      id: externalMozerLessonPlayerActionLogToBeUntouchedId,
      userId: `userId1-${externalMozerLessonPlayerActionLogToBeUntouchedId}`,
      log: {
        url: 'http://localhost:9000/player/step?project_name=test_case_spreadsheet&scenario_path=lesson/MOZP223&step_id=8',
        unix_time: 1671008340671,
        date: '2022-12-14T08:59:00.671Z',
        event_name: 'stepPassed',
        step_id: 7,
        is_lesson: true,
        step_name: `step_name-${externalMozerLessonPlayerActionLogToBeUntouchedId}`,
        step_type: {
          type: 'lesson',
          snap_type: 'begin',
          layout: 'ERH1',
        },
        step_unique_id: 'rS+PdhZGVxhj1KwB9jIDmw6R/CU3cigkrb4aEl/XoF8RnSgaQVTVUEUIJFJPtBaiENjENCf+/Zlv6AXfgKDJ/Q==20221213055608',
        snap: 'step000-begin',
        timezone_offset: -540,
      },
      createdAt: new Date(nowStr),
    }

    const res = await s3ExternalMozerLessonPlayerActionLogRepository.create(externalMozerLessonPlayerActionLogToBeUntouched)

    expect(res.error).toBeNull()

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.value).toBeUndefined()
  })

  test('find by unsaved externalMozerLessonPlayerActionLog id', async () => {
    const id = `unsaved-id`
    const res = await s3ExternalMozerLessonPlayerActionLogRepository.findByIdAndCreatedAt('stepPassed', id, new Date(nowStr))

    expect(res.error).toBeNull()

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.value).toBeNull()
  })

  describe('stepPassed log', () => {
    let externalMozerLessonPlayerActionLog: ExternalMozerLessonPlayerActionLog

    test('create', async () => {
      const idRes = await s3ExternalMozerLessonPlayerActionLogRepository.issueId()

      if (idRes.hasError) {
        throw new Error(`idRes should be no error`)
      }

      const id = idRes.value

      externalMozerLessonPlayerActionLog = {
        id,
        userId: `userId1-${id}`,
        log: {
          url: 'http://localhost:9000/player/step?project_name=test_case_spreadsheet&scenario_path=lesson/MOZP223&step_id=8',
          unix_time: 1671008340671,
          date: '2022-12-14T08:59:00.671Z',
          event_name: 'stepPassed',
          step_id: 7,
          is_lesson: true,
          step_name: `step_name-${id}`,
          step_type: {
            type: 'lesson',
            snap_type: 'begin',
            layout: 'ERH1',
          },
          step_unique_id: 'rS+PdhZGVxhj1KwB9jIDmw6R/CU3cigkrb4aEl/XoF8RnSgaQVTVUEUIJFJPtBaiENjENCf+/Zlv6AXfgKDJ/Q==20221213055608',
          snap: 'step000-begin',
          timezone_offset: -540,
        },
        createdAt: new Date(nowStr),
      }

      const res = await s3ExternalMozerLessonPlayerActionLogRepository.create(externalMozerLessonPlayerActionLog)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeUndefined()

      const resUntouched = await s3ExternalMozerLessonPlayerActionLogRepository.findByIdAndCreatedAt(
        'stepPassed',
        externalMozerLessonPlayerActionLogToBeUntouched.id,
        new Date(nowStr),
      )

      expect(resUntouched.value).toEqual(externalMozerLessonPlayerActionLogToBeUntouched)
    })

    test('find by id', async () => {
      const res = await s3ExternalMozerLessonPlayerActionLogRepository.findByIdAndCreatedAt(
        'stepPassed',
        externalMozerLessonPlayerActionLog.id,
        new Date(nowStr),
      )

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toEqual(externalMozerLessonPlayerActionLog)
    })
  })

  describe('flipButtonClicked log', () => {
    let externalMozerLessonPlayerActionLog: ExternalMozerLessonPlayerActionLog

    test('create', async () => {
      const idRes = await s3ExternalMozerLessonPlayerActionLogRepository.issueId()

      if (idRes.hasError) {
        throw new Error(`idRes should be no error`)
      }

      const id = idRes.value

      externalMozerLessonPlayerActionLog = {
        id,
        userId: `userId1-${id}`,
        log: {
          url: 'http://localhost:9000/player/step?project_name=test_case_spreadsheet&scenario_path=lesson/MOZP223&step_id=9',
          unix_time: 1671008418970,
          date: '2022-12-14T09:00:18.970Z',
          event_name: 'flipButtonClicked',
          pathname: '/api/projects/test_case_spreadsheet/MOZP223/iframe/hint_step000-begin_1.html',
          card_index: 0,
          step_unique_id: 'vL3yHKHyiBj5p5gpRMaVqperBOSiBDnW11FozfANSoITUAtchZcNsxkrSPvRR4cIy1uCCoiTvQ16XHgHMljnkw==20221213055609',
          timezone_offset: -540,
        },
        createdAt: new Date(nowStr),
      }

      const res = await s3ExternalMozerLessonPlayerActionLogRepository.create(externalMozerLessonPlayerActionLog)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeUndefined()

      const resUntouched = await s3ExternalMozerLessonPlayerActionLogRepository.findByIdAndCreatedAt(
        'stepPassed',
        externalMozerLessonPlayerActionLogToBeUntouched.id,
        new Date(nowStr),
      )

      expect(resUntouched.value).toEqual(externalMozerLessonPlayerActionLogToBeUntouched)
    })

    test('find by id', async () => {
      const res = await s3ExternalMozerLessonPlayerActionLogRepository.findByIdAndCreatedAt(
        'flipButtonClicked',
        externalMozerLessonPlayerActionLog.id,
        new Date(nowStr),
      )

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toEqual(externalMozerLessonPlayerActionLog)
    })
  })

  describe('quizButtonClicked log', () => {
    let externalMozerLessonPlayerActionLog: ExternalMozerLessonPlayerActionLog

    test('create', async () => {
      const idRes = await s3ExternalMozerLessonPlayerActionLogRepository.issueId()

      if (idRes.hasError) {
        throw new Error(`idRes should be no error`)
      }

      const id = idRes.value

      externalMozerLessonPlayerActionLog = {
        id,
        userId: `userId1-${id}`,
        log: {
          url: 'http://localhost:9000/player/step?project_name=test_case_spreadsheet&scenario_path=lesson%2FMOZP223&step_id=4',
          unix_time: 1671008447297,
          date: '2022-12-14T09:00:47.297Z',
          event_name: 'quizButtonClicked',
          choice_label: "class 'guideText'",
          quiz_text: 'Which is correct?',
          is_correct: false,
          step_unique_id: 'DeA/eF1nb+Y16KHfRB3VvuyLPXe2kK6xONSkADYh5ZzJdpaDa4zEaprAEw2B1wANR0xUb8Pb02vgdCG/IoE64w==20221213055605',
          timezone_offset: -540,
        },
        createdAt: new Date(nowStr),
      }

      const res = await s3ExternalMozerLessonPlayerActionLogRepository.create(externalMozerLessonPlayerActionLog)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeUndefined()

      const resUntouched = await s3ExternalMozerLessonPlayerActionLogRepository.findByIdAndCreatedAt(
        'stepPassed',
        externalMozerLessonPlayerActionLogToBeUntouched.id,
        new Date(nowStr),
      )

      expect(resUntouched.value).toEqual(externalMozerLessonPlayerActionLogToBeUntouched)
    })

    test('find by id', async () => {
      const res = await s3ExternalMozerLessonPlayerActionLogRepository.findByIdAndCreatedAt(
        'quizButtonClicked',
        externalMozerLessonPlayerActionLog.id,
        new Date(nowStr),
      )

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toEqual(externalMozerLessonPlayerActionLog)
    })
  })
})
