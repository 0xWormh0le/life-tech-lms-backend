import {
  getCodeIllusionPackagesByStudentGroupIdUseCase,
  IStudentGroupRepository,
  ICodeillusionPackagesRepository,
  IAdministratorRepository,
  ITeacherRepository,
} from './GetCodeIllusionPackagesByStudentGroupIdUseCase'
import { E, Errorable } from '../shared/Errors'
import { User } from '../../entities/codex/User'
import { DistrictAdministrator } from '../../entities/codex/DistrictAdministrator'

import { StudentGroup } from '../../entities/codex/StudentGroup'
import { TeacherOrganization } from '../../entities/codex/Teacher'
import { UserRoles } from '../shared/Constants'
import { UserCodeIllusionPackage } from '../../entities/codex/UserCodeIllusionPackage'

const VALID_STUDENT_GROUP_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_STUDENT_GROUP_ID = 'student-id-00001'
const VALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: UserRoles.internalOperator,
}
const INVALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: UserRoles.student,
}

const DISTRICT_ADMINISTRATOR: DistrictAdministrator = {
  userId: 'user-id-1',
  administratorId: 'administrator-id-1',
  email: 'administrator@gmail.com',
  createdDate: '',
  firstName: 'parth',
  lastName: 'parekh',
  administratorLMSId: 'lms-id-1',
  createdUserId: 'user-id-1',
  districtId: 'district-id-1',
}

const VALID_PACKAGE_DATA: UserCodeIllusionPackage = {
  id: 'package-id',
  level: 'basic',
  name: 'Package Name',
  headerButtonLink: 'headerButtonLink',
  headerButtonText: 'headerButtonText',
  redirectUrlWhenAllFinished: null,
  chapters: [
    {
      id: 'chapter-codeillusion-1',
      title: 'Welcome to Technologia',
      name: 'Chapter1',
      circles: [
        {
          id: 'circle-codeillusion-principal-basic',
          course: 'basic',
          gemLessonIds: [
            'lesson-codeillusion-basic-principal-gem-1',
            'lesson-codeillusion-basic-principal-gem-2',
            'lesson-codeillusion-basic-principal-gem-4',
            'lesson-codeillusion-basic-principal-gem-5',
          ],
          bookName: "The Principal's Test",
          bookLessonIds: ['lesson-codeillusion-basic-principal-book-1'],
          characterImageUrl: 'http://localhost:3080/images/b_principal_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_principal_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_principal_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-mickey-media_art',
          course: 'mediaArt',
          gemLessonIds: ['lesson-codeillusion-basic-mickey-gem-1', 'lesson-codeillusion-basic-mickey-gem-2', 'lesson-codeillusion-basic-mickey-gem-3'],
          bookName: 'Circle Art',
          bookLessonIds: [],
          characterImageUrl: 'http://localhost:3080/images/b_mickey_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_mickey_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_mickey_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-donald-web_design',
          course: 'webDesign',
          gemLessonIds: [
            'lesson-codeillusion-basic-donald-gem-1',
            'lesson-codeillusion-basic-donald-gem-2',
            'lesson-codeillusion-basic-donald-gem-3',
            'lesson-codeillusion-basic-donald-gem-4',
          ],
          bookName: "The Hat Shop's Website",
          bookLessonIds: ['lesson-codeillusion-basic-donald-book-1'],
          characterImageUrl: 'http://localhost:3080/images/b_donald_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_donald_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_donald_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-goofy-game_development',
          course: 'gameDevelopment',
          gemLessonIds: [
            'lesson-codeillusion-basic-goofy-gem-1',
            'lesson-codeillusion-basic-goofy-gem-2',
            'lesson-codeillusion-basic-goofy-gem-3',
            'lesson-codeillusion-basic-goofy-gem-4',
          ],
          bookName: 'Sound Machine',
          bookLessonIds: ['lesson-codeillusion-basic-goofy-book-1'],
          characterImageUrl: 'http://localhost:3080/images/b_goofy_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_goofy_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_goofy_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-2',
      title: 'When You Wish Upon a Magic Festival',
      name: 'Chapter2',
      circles: [
        {
          id: 'circle-codeillusion-tangled-media_art',
          course: 'mediaArt',
          gemLessonIds: [
            'lesson-codeillusion-basic-tangled-gem-1',
            'lesson-codeillusion-basic-tangled-gem-2',
            'lesson-codeillusion-basic-tangled-gem-3',
            'lesson-codeillusion-basic-tangled-gem-4',
          ],
          bookName: 'Sky Lanterns',
          bookLessonIds: ['lesson-codeillusion-basic-tangled-book-1'],
          characterImageUrl: 'http://localhost:3080/images/b_tangled_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_tangled_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_tangled_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-zootopia-web_design',
          course: 'webDesign',
          gemLessonIds: [
            'lesson-codeillusion-basic-zootopia-gem-1',
            'lesson-codeillusion-basic-zootopia-gem-2',
            'lesson-codeillusion-basic-zootopia-gem-3',
            'lesson-codeillusion-basic-zootopia-gem-4',
            'lesson-codeillusion-basic-zootopia-gem-5',
            'lesson-codeillusion-basic-zootopia-gem-6',
          ],
          bookName: 'Person Finder Site',
          bookLessonIds: [
            'lesson-codeillusion-basic-zootopia-book-1',
            'lesson-codeillusion-basic-zootopia-book-2',
            'lesson-codeillusion-basic-zootopia-book-3',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_zootopia_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_zootopia_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_zootopia_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-aladdin-game_development',
          course: 'gameDevelopment',
          gemLessonIds: [
            'lesson-codeillusion-basic-aladdin-gem-1',
            'lesson-codeillusion-basic-aladdin-gem-2',
            'lesson-codeillusion-basic-aladdin-gem-3',
            'lesson-codeillusion-basic-aladdin-gem-4',
            'lesson-codeillusion-basic-aladdin-gem-5',
          ],
          bookName: 'Flying Carpet',
          bookLessonIds: ['lesson-codeillusion-basic-aladdin-book-1'],
          characterImageUrl: 'http://localhost:3080/images/b_aladdin_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_aladdin_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_aladdin_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-3',
      title: 'Beyond the Darkness',
      name: 'Chapter3',
      circles: [
        {
          id: 'circle-codeillusion-sugar1-game_development',
          course: 'gameDevelopment',
          gemLessonIds: [
            'lesson-codeillusion-basic-sugar1-gem-1',
            'lesson-codeillusion-basic-sugar1-gem-2',
            'lesson-codeillusion-basic-sugar1-gem-3',
            'lesson-codeillusion-basic-sugar1-gem-4',
          ],
          bookName: 'Dungeon Escape',
          bookLessonIds: ['lesson-codeillusion-basic-sugar1-book-1', 'lesson-codeillusion-basic-sugar1-book-2'],
          characterImageUrl: 'http://localhost:3080/images/b_sugar1_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_sugar1_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_sugar1_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-beauty-media_art',
          course: 'mediaArt',
          gemLessonIds: [
            'lesson-codeillusion-basic-beauty-gem-1',
            'lesson-codeillusion-basic-beauty-gem-2',
            'lesson-codeillusion-basic-beauty-gem-3',
            'lesson-codeillusion-basic-beauty-gem-4',
          ],
          bookName: 'Mirror Magic',
          bookLessonIds: [
            'lesson-codeillusion-basic-beauty-book-1',
            'lesson-codeillusion-basic-beauty-book-2',
            'lesson-codeillusion-basic-beauty-book-3',
            'lesson-codeillusion-basic-beauty-book-4',
            'lesson-codeillusion-basic-beauty-book-5',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_beauty_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_beauty_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_beauty_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-4',
      title: 'Within the Time of Repetition',
      name: 'Chapter1',
      circles: [
        {
          id: 'circle-codeillusion-stitch-web_design',
          course: 'webDesign',
          gemLessonIds: [
            'lesson-codeillusion-basic-stitch-gem-1',
            'lesson-codeillusion-basic-stitch-gem-2',
            'lesson-codeillusion-basic-stitch-gem-3',
            'lesson-codeillusion-basic-stitch-gem-4',
          ],
          bookName: 'Photo Gallery',
          bookLessonIds: [
            'lesson-codeillusion-basic-stitch-book-1',
            'lesson-codeillusion-basic-stitch-book-2',
            'lesson-codeillusion-basic-stitch-book-3',
            'lesson-codeillusion-basic-stitch-book-4',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_stitch_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_stitch_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_stitch_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-alice-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-alice-gem-1', 'lesson-codeillusion-basic-alice-gem-3'],
          bookName: "Queen's Card",
          bookLessonIds: [
            'lesson-codeillusion-basic-alice-book-1',
            'lesson-codeillusion-basic-alice-book-2',
            'lesson-codeillusion-basic-alice-book-3',
            'lesson-codeillusion-basic-alice-book-4',
            'lesson-codeillusion-basic-alice-book-5',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_alice_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_alice_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_alice_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-mermaid-media_art',
          course: 'mediaArt',
          gemLessonIds: ['lesson-codeillusion-basic-mermaid-gem-1', 'lesson-codeillusion-basic-mermaid-gem-2', 'lesson-codeillusion-basic-mermaid-gem-3'],
          bookName: 'School of Fish',
          bookLessonIds: ['lesson-codeillusion-basic-mermaid-book-1', 'lesson-codeillusion-basic-mermaid-book-2', 'lesson-codeillusion-basic-mermaid-book-3'],
          characterImageUrl: 'http://localhost:3080/images/b_mermaid_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_mermaid_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_mermaid_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-5',
      title: 'A Forecasted Journey',
      name: 'Chapter2',
      circles: [
        {
          id: 'circle-codeillusion-pooh-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-pooh-gem-1', 'lesson-codeillusion-basic-pooh-gem-2'],
          bookName: 'Honey Hunt',
          bookLessonIds: [
            'lesson-codeillusion-basic-pooh-book-1',
            'lesson-codeillusion-basic-pooh-book-2',
            'lesson-codeillusion-basic-pooh-book-3',
            'lesson-codeillusion-basic-pooh-book-4',
            'lesson-codeillusion-basic-pooh-book-5',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_pooh_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_pooh_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_pooh_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-bighero6-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-bighero6-gem-1', 'lesson-codeillusion-basic-bighero6-gem-2'],
          bookName: 'Breaking Tiles',
          bookLessonIds: [
            'lesson-codeillusion-basic-bighero6-book-1',
            'lesson-codeillusion-basic-bighero6-book-2',
            'lesson-codeillusion-basic-bighero6-book-3',
            'lesson-codeillusion-basic-bighero6-book-4',
            'lesson-codeillusion-basic-bighero6-book-5',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_bighero6_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_bighero6_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_bighero6_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-6',
      title: 'The Great Misfortune',
      name: 'Chapter3',
      circles: [
        {
          id: 'circle-codeillusion-snowwhite-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-snowwhite-gem-1', 'lesson-codeillusion-basic-snowwhite-gem-2'],
          bookName: 'Jewel Puzzle',
          bookLessonIds: [
            'lesson-codeillusion-basic-snowwhite-book-1',
            'lesson-codeillusion-basic-snowwhite-book-2',
            'lesson-codeillusion-basic-snowwhite-book-3',
            'lesson-codeillusion-basic-snowwhite-book-4',
            'lesson-codeillusion-basic-snowwhite-book-5',
            'lesson-codeillusion-basic-snowwhite-book-6',
            'lesson-codeillusion-basic-snowwhite-book-7',
            'lesson-codeillusion-basic-snowwhite-book-8',
            'lesson-codeillusion-basic-snowwhite-book-9',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_snowwhite_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_snowwhite_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_snowwhite_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-sugar2-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-sugar2-gem-1', 'lesson-codeillusion-basic-sugar2-gem-2'],
          bookName: 'Wreck-It Ralph',
          bookLessonIds: [
            'lesson-codeillusion-basic-sugar2-book-1',
            'lesson-codeillusion-basic-sugar2-book-2',
            'lesson-codeillusion-basic-sugar2-book-3',
            'lesson-codeillusion-basic-sugar2-book-4',
            'lesson-codeillusion-basic-sugar2-book-5',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_sugar2_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_sugar2_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_sugar2_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-7',
      title: 'Technologia',
      name: 'Chapter4',
      circles: [
        {
          id: 'circle-codeillusion-frozen-media_art',
          course: 'mediaArt',
          gemLessonIds: [
            'lesson-codeillusion-basic-frozen-gem-1',
            'lesson-codeillusion-basic-frozen-gem-2',
            'lesson-codeillusion-basic-frozen-gem-3',
            'lesson-codeillusion-basic-frozen-gem-4',
          ],
          bookName: 'Snow Magic',
          bookLessonIds: ['lesson-codeillusion-basic-frozen-book-1', 'lesson-codeillusion-basic-frozen-book-2', 'lesson-codeillusion-basic-frozen-book-3'],
          characterImageUrl: 'http://localhost:3080/images/b_frozen_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_frozen_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_frozen_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-sleepingbeauty-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-sleepingbeauty-gem-1', 'lesson-codeillusion-basic-sleepingbeauty-gem-2'],
          bookName: 'Dragon & Sword',
          bookLessonIds: [
            'lesson-codeillusion-basic-sleepingbeauty-book-1',
            'lesson-codeillusion-basic-sleepingbeauty-book-2',
            'lesson-codeillusion-basic-sleepingbeauty-book-3',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_sleepingbeauty_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_sleepingbeauty_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_sleepingbeauty_book.png',
          allLessonIds: [],
        },
      ],
    },
  ],
}
const TEACHER_ORGANIZATION: TeacherOrganization = {
  firstName: 'anuj',
  organizationId: '7289c5e6-d7a8-423c-8161-6530abccd81c',
  lastName: 'pal',
  teacherId: 'teacherId-1',
  districtId: 'district-1',
  userId: 'f705706f-544a-42e7-90da-a2bddbf66d45',
  teacherLMSId: 'teacher-lms-id-1',
  createdUserId: 'user123',
  email: 'demo@gmail.com',
  isPrimary: true,
  createdDate: '2011-10-05T14:48:00.000Z',
  teacherOrganizations: [
    { id: '1', name: 'organization1' },
    {
      id: '2',
      name: 'organization2',
    },
  ],
}
const STUDENT_GROUP_INFO: StudentGroup = {
  id: 'student-group-1',
  organizationId: 'organization-id-1',
  name: 'FL Group',
  //packageId: 'package-id-1',
  grade: 'grade1',
  studentGroupLmsId: 'student-group-lms-id-1',
  createdUserId: 'user-id-1',
  updatedUserId: 'user-id-1',
  createdDate: '2022-05-17T11:54:02.141Z',
  updatedDate: '2022-05-17T11:54:02.141Z',
}

describe('test GetCodeIllusionPackagesByStudentGroupIdUseCase', () => {
  test('test GetCodeIllusionPackagesByStudentGroupIdUseCase - success', async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_ORGANIZATION,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID)

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(VALID_PACKAGE_DATA)
  })

  test('test when user provided invalid format of studentGroupId', async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run(VALID_USER_DATA, INVALID_STUDENT_GROUP_ID)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidStudentGroupId')
    expect(result.error?.message).toEqual('Invalid format of studentGroupId.')
  })

  test('test user is not internal operator or administrator or teacher- permission denied', async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run(INVALID_USER_DATA, VALID_STUDENT_GROUP_ID)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to view the information of packages.')
  })

  test(`test when studentGroup repository's getDistrictIdByStudentGroupId returns runtime error `, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: '',
          },
          value: null,
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'failed to get district id of studentGroupId',
          },
          value: null,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_GROUP_ID)

    const getDistrictIdByStudentGroupByIdSpy = IStudentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(getDistrictIdByStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getDistrictAdministratorByUserIdSpy = IAdministratorRepository.getDistrictAdministratorByUserId as jest.Mock

    expect(getDistrictAdministratorByUserIdSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.error?.message).toContain('failed to get district id of studentGroupId')
  })

  test(`test when administrator repository returns run time error`, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-not-matching',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkonwn runtime error occured',
          },
          value: null,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_GROUP_ID)
    const getDistrictIdByStudentGroupByIdSpy = IStudentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(getDistrictIdByStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getDistrictAdministratorByUserIdSpy = IAdministratorRepository.getDistrictAdministratorByUserId as jest.Mock

    expect(getDistrictAdministratorByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test(`test district administrator can view codeIllusion-package information of student group of his district only`, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-not-matching',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_GROUP_ID)
    const getDistrictIdByStudentGroupByIdSpy = IStudentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(getDistrictIdByStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getDistrictAdministratorByUserIdSpy = IAdministratorRepository.getDistrictAdministratorByUserId as jest.Mock

    expect(getDistrictAdministratorByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to view the package details.')
  })

  test(`test when administrator not found of user id`, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'> | E<'AdministratorNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_GROUP_ID)
    const getDistrictIdByStudentGroupByIdSpy = IStudentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(getDistrictIdByStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getDistrictAdministratorByUserIdSpy = IAdministratorRepository.getDistrictAdministratorByUserId as jest.Mock

    expect(getDistrictAdministratorByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.value).toEqual(null)
  })

  test(`test administrator can see only his/her district's student group's codex-packages.`, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-not-matching',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_GROUP_ID)
    const getDistrictIdByStudentGroupByIdSpy = IStudentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(getDistrictIdByStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getDistrictAdministratorByUserIdSpy = IAdministratorRepository.getDistrictAdministratorByUserId as jest.Mock

    expect(getDistrictAdministratorByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
    expect(result.error?.message).toEqual('The user does not have permission to view the package details.')
  })

  test(`test  when studentGroupRepository's getStudentGroupById returns runtime error`, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown runtime error ocurred',
          },
          value: null,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID)
    const getDistrictIdByStudentGroupByIdSpy = IStudentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(getDistrictIdByStudentGroupByIdSpy.mock.calls).toEqual([])

    const getStudentGroupByIdSpy = IStudentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
    expect(result.value).toEqual(null)
  })

  test(`test  when studentGroup not found from studentGroupId`, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID)
    const getDistrictIdByStudentGroupByIdSpy = IStudentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(getDistrictIdByStudentGroupByIdSpy.mock.calls).toEqual([])

    const getStudentGroupByIdSpy = IStudentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]]), expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentGroupNotFound')
    expect(result.value).toEqual(null)
  })

  test(`test  when teacherRepository's getTeacherByUserId giving runtime error`, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown runtime error ocurred.',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown runtime error occured',
          },
          hasError: true,
          value: null,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID)
    const getDistrictIdByStudentGroupByIdSpy = IStudentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(getDistrictIdByStudentGroupByIdSpy.mock.calls).toEqual([])

    const getStudentGroupByIdSpy = IStudentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]]), expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test(`test when teacher not found.`, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'> | E<'TeacherNotFound', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID)
    const getDistrictIdByStudentGroupByIdSpy = IStudentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(getDistrictIdByStudentGroupByIdSpy.mock.calls).toEqual([])

    const getStudentGroupByIdSpy = IStudentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]]), expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.value).toEqual(null)
  })

  test(`test when teacher's organization and studentGroup's organization is not same permisssion denied.`, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: STUDENT_GROUP_INFO,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'> | E<'TeacherNotFound', string>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_ORGANIZATION,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID)
    const getDistrictIdByStudentGroupByIdSpy = IStudentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(getDistrictIdByStudentGroupByIdSpy.mock.calls).toEqual([])

    const getStudentGroupByIdSpy = IStudentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]]), expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test(`test  when studentGroup giving unknownRuntime in codeIllusionRepository repository`, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'> | E<'PackageNotAssigned'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown runtime error ocurred',
          },
          value: null,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: STUDENT_GROUP_INFO,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_ORGANIZATION,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.internalOperator }, VALID_STUDENT_GROUP_ID)

    expect(result.hasError).toEqual(true)

    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test(`test  No codeillusion-packages are assigned to studentGroup`, async () => {
    const codeIllusionRepository: ICodeillusionPackagesRepository = {
      getCodeIllusionPackagesByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<UserCodeIllusionPackage | undefined, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'> | E<'PackageNotAssigned'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const IStudentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: STUDENT_GROUP_INFO,
        }
      }),
    }
    const IAdministratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }
    const ITeacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_ORGANIZATION,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (teacherId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError', string>>> {
        return {
          error: null,
          hasError: false,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new getCodeIllusionPackagesByStudentGroupIdUseCase(
      IAdministratorRepository,
      IStudentGroupRepository,
      ITeacherRepository,
      codeIllusionRepository,
    )
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.internalOperator }, VALID_STUDENT_GROUP_ID)

    expect(result.hasError).toEqual(true)

    expect(result.error?.type).toEqual('PackageNotAssigned')
    expect(result.value).toEqual(null)
  })
})
