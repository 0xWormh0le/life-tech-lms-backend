import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import { request } from '../../api/codex-api-request'
import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'

let authorizationHeader: {
  Authorization: string
} | null = null

beforeEach(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const userRepo = appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save({
    login_id: 'bhadresh',
    password: await hashingPassword('bhadresh'),
    role: 'internal_operator',
  })

  // Login
  const loginResponse = await request({
    url: '/login',
    method: 'post',
    data: {
      loginId: 'bhadresh',
      password: 'bhadresh',
    },
  })

  if (loginResponse.hasError) {
    throw new Error(`'/login' failed ${JSON.stringify(loginResponse.error)}`)
  }
  authorizationHeader = {
    Authorization: `Bearer ${loginResponse.value.user.accessToken}`,
  }
})

afterEach(teardownEnvironment)

test('test UserPackageAssignment APIs', async () => {
  if (!authorizationHeader) {
    throw new Error(`authorizationHeader is not ready`)
  }

  const createUserPackageAssignmentResult1 = await request({
    url: '/user-package-assignments',
    method: 'post',
    data: {
      userId: 'userId-1',
      packageCategoryId: 'packageCategoryId-1',
      packageId: 'packageId-1',
    },
    headers: authorizationHeader,
  })

  if (createUserPackageAssignmentResult1.hasError) {
    throw new Error(
      `POST /user-package-assignments failed ${JSON.stringify(
        createUserPackageAssignmentResult1.error,
      )}`,
    )
  }

  const createUserPackageAssignmentResult2 = await request({
    url: '/user-package-assignments',
    method: 'post',
    data: {
      userId: 'userId-1',
      packageCategoryId: 'packageCategoryId-2',
      packageId: 'packageId-2',
    },
    headers: authorizationHeader,
  })

  if (createUserPackageAssignmentResult2.hasError) {
    throw new Error(
      `POST /user-package-assignments failed ${JSON.stringify(
        createUserPackageAssignmentResult2.error,
      )}`,
    )
  }

  const getUserPackageAssignmentResult = await request({
    url: '/user-package-assignments',
    method: 'get',
    queryParams: {
      userId: 'userId-1',
    },
    headers: authorizationHeader,
  })

  if (getUserPackageAssignmentResult.hasError) {
    throw new Error(
      `POST /user-package-assignments failed ${JSON.stringify(
        getUserPackageAssignmentResult.error,
      )}`,
    )
  }
  expect(getUserPackageAssignmentResult.value).toEqual<
    (typeof getUserPackageAssignmentResult)['value']
  >({
    userPackageAssignments: [
      {
        userId: 'userId-1',
        packageCategoryId: 'packageCategoryId-1',
        packageId: 'packageId-1',
      },
      {
        userId: 'userId-1',
        packageCategoryId: 'packageCategoryId-2',
        packageId: 'packageId-2',
      },
    ],
  })
})
