import { GetStandardMappingUseCase, IStandardMapping } from './GetStandardMappingUseCase'
import { E, Errorable } from '../shared/Errors'
import { StandardMapping } from '../../entities/codex/StandardMapping'
import { User } from '../../entities/codex/User'
import { UserRoles } from '../shared/Constants'

const VALID_STATEID = 'AL'
const VALID_USER: User = {
  id: 'user-id-1',
  role: 'teacher',
}

describe('test StandardMappingUseCase', () => {
  test('StandardMappingUseCase success', async () => {
    const standardMappingRepository: IStandardMapping = {
      getStandardMapping: jest.fn(async function (stateId: string): Promise<Errorable<StandardMapping[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              stateId: 'AL',
              stateStandardName: 'alabama',
              gradeBand: [
                {
                  band: '9-12',
                  standardDomain: [
                    {
                      standard: 'R1',
                      domain: 'Safety, Privacy, and Security',
                      description: 'Identify, demonstrate, and apply personal safe use of digital devices.',
                      disneyCodeillusionLesson: [
                        'Principal | Gems 1-5',
                        'Mickey | Gems 1-3, Book 1',
                        'Donald | Gems 1-4, Book 1',
                        'Goofy | Gems 1-4, Book 1',
                        'Tangled | Gems 1-4, Book 1',
                        'Zootopia | Gems 1-6, Books 1-3',
                        'Aladdin | Gems 1-5, Book 1',
                        'Beauty and the Beast | Gems 1-4, Books 1-5',
                        'Wreck-it Ralph | Gems 1-4, Books 1-2',
                        'The Little Mermaid | Gems 1-3, Books 1-3',
                        'Lilo and Stitch | Gems 1-4, Books 1-4',
                        'Alice in Wonderland | Gems 1-3, Books 1-5',
                        'Winnie the Pooh | Gems 1-2, Books 1-5',
                        'Big Hero 6 | Gems 1-2, Books 1-5',
                        'Snow White | Gems 1-2, Books 1-9',
                        'Sugar Rush | Gems 1-2, Books 1-5',
                        'Frozen | Gems 1-4, Books 1-3',
                        'Sleeping Beauty | Gems 1-2, Books 1-3',
                      ],
                      cse: [],
                    },
                  ],
                },
              ],
            },
          ],
        }
      }),
    }
    const usecase = new GetStandardMappingUseCase(standardMappingRepository)
    const result = await usecase.run(VALID_USER, VALID_STATEID)

    const getStandardMappingSpy = standardMappingRepository.getStandardMapping as jest.Mock

    expect(getStandardMappingSpy.mock.calls).toEqual([[VALID_STATEID]])
    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual([
      {
        stateId: 'AL',
        stateStandardName: 'alabama',
        gradeBand: [
          {
            band: '9-12',
            standardDomain: [
              {
                standard: 'R1',
                domain: 'Safety, Privacy, and Security',
                description: 'Identify, demonstrate, and apply personal safe use of digital devices.',
                disneyCodeillusionLesson: [
                  'Principal | Gems 1-5',
                  'Mickey | Gems 1-3, Book 1',
                  'Donald | Gems 1-4, Book 1',
                  'Goofy | Gems 1-4, Book 1',
                  'Tangled | Gems 1-4, Book 1',
                  'Zootopia | Gems 1-6, Books 1-3',
                  'Aladdin | Gems 1-5, Book 1',
                  'Beauty and the Beast | Gems 1-4, Books 1-5',
                  'Wreck-it Ralph | Gems 1-4, Books 1-2',
                  'The Little Mermaid | Gems 1-3, Books 1-3',
                  'Lilo and Stitch | Gems 1-4, Books 1-4',
                  'Alice in Wonderland | Gems 1-3, Books 1-5',
                  'Winnie the Pooh | Gems 1-2, Books 1-5',
                  'Big Hero 6 | Gems 1-2, Books 1-5',
                  'Snow White | Gems 1-2, Books 1-9',
                  'Sugar Rush | Gems 1-2, Books 1-5',
                  'Frozen | Gems 1-4, Books 1-3',
                  'Sleeping Beauty | Gems 1-2, Books 1-3',
                ],
                cse: [],
              },
            ],
          },
        ],
      },
    ])
  })

  test('StandardMapping repository returns run time error', async () => {
    const standardMappingRepository: IStandardMapping = {
      getStandardMapping: jest.fn(async function (stateId: string): Promise<Errorable<StandardMapping[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown run time error',
          },
          value: null,
        }
      }),
    }
    const usecase = new GetStandardMappingUseCase(standardMappingRepository)
    const result = await usecase.run(VALID_USER, VALID_STATEID)

    const getStandardMappingSpy = standardMappingRepository.getStandardMapping as jest.Mock

    expect(getStandardMappingSpy.mock.calls).toEqual([[VALID_STATEID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('Student can not access standard mapping informations', async () => {
    const standardMappingRepository: IStandardMapping = {
      getStandardMapping: jest.fn(async function (stateId: string): Promise<Errorable<StandardMapping[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown run time error',
          },
          value: null,
        }
      }),
    }
    const usecase = new GetStandardMappingUseCase(standardMappingRepository)
    const result = await usecase.run({ ...VALID_USER, role: UserRoles.student }, VALID_STATEID)

    const getStandardMappingSpy = standardMappingRepository.getStandardMapping as jest.Mock

    expect(getStandardMappingSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })
})
