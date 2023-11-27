import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import { request } from '../../api/codex-api-request'
import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('Get CsePackage correctly', async () => {
  if (!appDataSource) {
    throw new Error('appDataSource is not ready')
  }

  const userRepo = appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save({
    login_id: 'wickwickwick',
    password: await hashingPassword('wickwickwick'),
    role: 'internal_operator',
  })

  // Login
  const loginResult = await request({
    url: '/login',
    method: 'post',
    data: {
      loginId: 'wickwickwick',
      password: 'wickwickwick',
    },
  })

  if (loginResult.hasError) {
    throw new Error(`failed to login`)
  }

  const { user } = loginResult.value

  if (!user) {
    throw new Error('failed to get user from /login')
  }

  const authorizationHeader = {
    Authorization: `Bearer ${user.accessToken}`,
  }

  // Get CSE Package
  const getCsePackageResult = await request({
    url: '/cse-packages/{packageId}',
    method: 'get',
    pathParams: {
      packageId: 'cse-package-full-standard',
    },
    headers: authorizationHeader,
  })

  if (getCsePackageResult.hasError) {
    throw new Error(
      `failed to getCsePackage with cse-package-full-standard ${JSON.stringify(
        getCsePackageResult.error,
      )}`,
    )
  }
  console.log(JSON.stringify(getCsePackageResult.value, null, 2))
  expect(getCsePackageResult.value.csePackage.units.length).toEqual(7)
})
