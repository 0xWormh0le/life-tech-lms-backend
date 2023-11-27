import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'
import { csePackageLessonDefinitionsMapByUnitId } from '../../../../../src/adapter/typeorm/hardcoded-data/Pacakges/CsePackageLessonDefinitions'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / CsePackageUnitDefinition / ConsumerExpectationScenario', () => {
  test('HealthCheck', async () => {
    const queryData = {
      query: `
      {
        hc
      }
      `,
      variables: {},
    }
    const res = await axios.post<{ data: object }>(`/v2/graphql`, queryData, {})

    expect(res.status).toEqual(200)
    expect(res.data.data).toEqual({ hc: 'ok' })
  })

  let operatorToken = ''

  describe('operation for internalOperator', () => {
    test('Login', async () => {
      if (!appDataSource) {
        throw new Error('failed to connect database.')
      }

      const { token } = await createUserAndGetToken(
        'testInternalOperator1',
        'internal_operator',
        appDataSource,
      )

      operatorToken = token
    })

    test('get csePackageUnitDefinitions', async () => {
      const queryData = {
        query: `
          {
            csePackageUnitDefinitions {
              __typename
              ... on CsePackageUnitDefinitions {
                items {
                  id
                  name
                  description
                  csePackageLessonDefinitions {
                    items {
                      lessonId
                      csePackageUnitDefinitionId
                      isQuizLesson
                    }
                  }
                }
              }
            }
          }
        `,
      }

      const res = await axios.post<
        GraphQLResponse<'csePackageUnitDefinitions', { items: object[] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.csePackageUnitDefinitions.__typename).toEqual(
        'CsePackageUnitDefinitions',
      )
      expect(res.data.data.csePackageUnitDefinitions.errorCode).toBeUndefined()
      expect(res.data.data.csePackageUnitDefinitions.items).toHaveLength(7)
      expect(res.data.data.csePackageUnitDefinitions.items).toEqual([
        {
          description:
            'In this unit, you will explore and understand the components of an information society where using, creating, distributing, manipulating, and integrating information are significant activities.',
          id: 'unit-cse-1',
          name: 'Information Society',
          csePackageLessonDefinitions: {
            items: csePackageLessonDefinitionsMapByUnitId['unit-cse-1'],
          },
        },
        {
          description:
            'In this unit, you will explore and understand digital information components and features, including analog and digital representation, various units of information, and the expression of numbers.',
          id: 'unit-cse-2',
          name: 'Digital Expression of Information 1',
          csePackageLessonDefinitions: {
            items: csePackageLessonDefinitionsMapByUnitId['unit-cse-2'],
          },
        },
        {
          description:
            'In this unit, you will continue your exploration and understanding of digital information expression to include arithmetic mechanisms such as logic circuits, characters and character codes, sound and images, and more.',
          id: 'unit-cse-3',
          name: 'Digital Expression of Information 2',
          csePackageLessonDefinitions: {
            items: csePackageLessonDefinitionsMapByUnitId['unit-cse-3'],
          },
        },
        {
          description:
            'In this unit, you will explore and understand how computers work. Concepts covered include computer behavior, hardware, software, operating systems, memory, processing power, and data compression.',
          id: 'unit-cse-4',
          name: 'How Computers Work',
          csePackageLessonDefinitions: {
            items: csePackageLessonDefinitionsMapByUnitId['unit-cse-4'],
          },
        },
        {
          description:
            'In this unit, you will explore and understand the principles and key components of network infrastructure, including LAN and WAN, clients and servers, IP addresses, and computer systems.',
          id: 'unit-cse-5',
          name: 'Network Infrastructure',
          csePackageLessonDefinitions: {
            items: csePackageLessonDefinitionsMapByUnitId['unit-cse-5'],
          },
        },
        {
          description:
            'In this unit, you will explore and understand the key components of internet protocol, including communication protocols, mechanisms, database systems, internet service providers, and more.',
          id: 'unit-cse-6',
          name: 'Internet Protocol',
          csePackageLessonDefinitions: {
            items: csePackageLessonDefinitionsMapByUnitId['unit-cse-6'],
          },
        },
        {
          description:
            'In this unit, you will explore and understand the principles of network security, including the critical elements of information security, encryption, malware and viruses, filtering, blockchain, and more.',
          id: 'unit-cse-7',
          name: 'Network Security',
          csePackageLessonDefinitions: {
            items: csePackageLessonDefinitionsMapByUnitId['unit-cse-7'],
          },
        },
      ])
    })
  })
})
