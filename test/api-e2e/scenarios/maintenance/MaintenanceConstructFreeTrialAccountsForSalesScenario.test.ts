import { setupEnvironment, teardownEnvironment } from '../../utilities'
import { request } from '../../api/codex-api-request'
import axios from 'axios'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

jest.setTimeout(3 * 60 * 1000)

describe('Maintenance Construct Free Trial Accounts for Sales', () => {
  test('success first', async () => {
    const res = await request({
      url: `/maintenance/constructFreeTrialAccountsForSales`,
      method: 'get',
      queryParams: {
        districtName: 'firstDistrict',
        stateId: 'AL',
        prefix: 'firstDistrict',
        maxStudentCount: 1,
        maxTeacherCount: 1,
      },
    })

    if (res.hasError) {
      if (
        'error' in res.error.message &&
        res.error.message.error instanceof Error
      ) {
        throw res.error.message.error
      }
      throw new Error(JSON.stringify(res.error.message))
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual({
      message:
        'firstDistrict has been created correctly! loginId: firstDistrictFT0001',
    })

    const loginRes = await request({
      url: '/login',
      method: 'post',
      data: {
        loginId: `firstDistrictFT0001`,
        password: `firstDistrictFT0001`,
      },
    })

    expect(loginRes.error).toBeNull()
    expect(loginRes.hasError).toEqual(false)
    expect(loginRes.value).toBeDefined()
  })

  test('success second', async () => {
    const res = await request({
      url: `/maintenance/constructFreeTrialAccountsForSales`,
      method: 'get',
      queryParams: {
        districtName: 'secondDistrict',
        stateId: 'AL',
        prefix: 'secondDistrict',
        maxStudentCount: 1,
        maxTeacherCount: 1,
      },
    })

    if (res.hasError) {
      if (
        'error' in res.error.message &&
        res.error.message.error instanceof Error
      ) {
        throw res.error.message.error
      }
      throw new Error(JSON.stringify(res.error.message))
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual({
      message:
        'secondDistrict has been created correctly! loginId: secondDistrictFT0001',
    })

    const loginRes = await request({
      url: '/login',
      method: 'post',
      data: {
        loginId: `secondDistrictFT0001`,
        password: `secondDistrictFT0001`,
      },
    })

    expect(loginRes.hasError).toEqual(false)
    expect(loginRes.error).toBeNull()
    expect(loginRes.value).toBeDefined()
  })

  test('districtName parameter missing error', async () => {
    const res = await axios.get(
      `/maintenance/constructFreeTrialAccountsForSales?stateId=AL&prefix=errorDistrict&maxStudentCount=1&maxTeacherCount=1`,
    )

    expect(res.status).toEqual(400)
    expect(res.data).toEqual({
      errors: [
        {
          errorCode: 'required.openapi.validation',
          message: "should have required property 'districtName'",
          path: '.query.districtName',
        },
      ],
      message: "request.query should have required property 'districtName'",
    })
  })

  test('stateId parameter missing error', async () => {
    const res = await axios.get(
      `/maintenance/constructFreeTrialAccountsForSales?districtName=errorDistrict&prefix=errorDistrict&maxStudentCount=1&maxTeacherCount=1`,
    )

    expect(res.status).toEqual(400)
    expect(res.data).toEqual({
      errors: [
        {
          errorCode: 'required.openapi.validation',
          message: "should have required property 'stateId'",
          path: '.query.stateId',
        },
      ],
      message: "request.query should have required property 'stateId'",
    })
  })

  test('prefix parameter missing error', async () => {
    const res = await axios.get(
      `/maintenance/constructFreeTrialAccountsForSales?districtName=errorDistrict&stateId=AL&maxStudentCount=1&maxTeacherCount=1`,
    )

    expect(res.status).toEqual(400)
    expect(res.data).toEqual({
      errors: [
        {
          errorCode: 'required.openapi.validation',
          message: "should have required property 'prefix'",
          path: '.query.prefix',
        },
      ],
      message: "request.query should have required property 'prefix'",
    })
  })

  test('duplicated error', async () => {
    const res = await request({
      url: `/maintenance/constructFreeTrialAccountsForSales`,
      method: 'get',
      queryParams: {
        districtName: 'firstDistrict',
        stateId: 'AL',
        prefix: 'firstDistrict',
        maxStudentCount: 1,
        maxTeacherCount: 1,
      },
    })

    expect(res.hasError).toEqual(true)
    expect(res.error).toEqual({
      message: {
        data: {
          message:
            'districtName is already exists. districtName: firstDistrict',
        },
        status: 409,
      },
      type: 'ErrorStatusResponse',
    })
    expect(res.value).toBeNull()
  })
})
