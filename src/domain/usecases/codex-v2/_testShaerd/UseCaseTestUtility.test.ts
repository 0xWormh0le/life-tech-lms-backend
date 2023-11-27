import { User, UserRole } from '../../../entities/codex-v2/User'

test.skip('dummy', () => {
  // avoid to including build artifacts
})

export const nowStr = '2000-01-01T00:00:00Z'

export const createTestAuthenticatedUser = (userRole: UserRole | unknown): User => {
  if (userRole === 'student') {
    return {
      id: 'testId',
      role: 'student',
      isDemo: false,
      createdAt: new Date(nowStr),
      updatedAt: new Date(nowStr),
    }
  } else if (userRole === 'teacher') {
    return {
      id: 'testId',
      role: 'teacher',
      isDemo: false,
      createdAt: new Date(nowStr),
      updatedAt: new Date(nowStr),
    }
  } else if (userRole === 'administrator') {
    return {
      id: 'testId',
      role: 'administrator',
      isDemo: false,
      createdAt: new Date(nowStr),
      updatedAt: new Date(nowStr),
    }
  } else if (userRole === 'internalOperator') {
    return {
      id: 'testId',
      role: 'internalOperator',
      isDemo: false,
      createdAt: new Date(nowStr),
      updatedAt: new Date(nowStr),
    }
  }
  throw new Error(`unknown userRole: ${JSON.stringify(userRole)}`)
}
