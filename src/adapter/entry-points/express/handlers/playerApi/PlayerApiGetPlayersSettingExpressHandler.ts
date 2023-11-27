import { URL } from 'url'
import { DataSource } from 'typeorm'

import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

import { UserRepository } from '../../../../repositories/UserRepository'
import { GetUserSettingsUseCase } from '../../../../../domain/usecases/codex/GetUserSettingsUseCase'
import { UserSettingsRepository } from '../../../../repositories/UserSettingsRepository'
import { lessonIdByProjectnameAndScenarioPath } from '../../../../typeorm/hardcoded-data/Lessons'
import { GetMeUseCase } from '../../../../../domain/usecases/codex/GetMeUseCase'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { AdministratorDistrictRepository } from '../../../../repositories/AdministratorDistrictRepository'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'
import { OrganizationsRepository } from '../../../../repositories/OrganizationRepository'
import { TeacherOrganizationRepository } from '../../../../repositories/TeacherOrganizationRepository'
import { StudentRepository } from '../../../../repositories/StudentRepository'
import { StudentGroupRepository } from '../../../../repositories/StudentGroupRepository'
import { StudentStudentGroupRepository } from '../../../../repositories/StudentStudentGroupRepository'

type Response =
  | Paths.GetPlayersSetting.Responses.$200
  | Paths.GetPlayersSetting.Responses.$401
  | Paths.GetPlayersSetting.Responses.$500

export class PlayerApiGetPlayersSettingExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private codexUsaFronteneBaseUrl: string,
  ) {}

  handler: HandlerWithToken<undefined, {}, undefined, Response> = async (
    _,
    token,
  ) => {
    const userRepository = new UserRepository(this.appDataSource)

    // User Authentication
    const userByAccessTokenResult = await userRepository.getUserByAccessToken(
      token,
    )

    if (userByAccessTokenResult.hasError) {
      switch (userByAccessTokenResult.error.type) {
        default: {
          const response500: Paths.GetPlayersSetting.Responses.$500 = {
            error: JSON.stringify(userByAccessTokenResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    if (userByAccessTokenResult.value === null) {
      const response401: Paths.GetPlayersSetting.Responses.$401 = {
        login_status: 'no',
      }

      return { statusCode: 401, response: response401 }
    }

    const requestedUser = userByAccessTokenResult.value

    // Get User(Student/Teacher/Administrator) details
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const administratorDistrictRepository = new AdministratorDistrictRepository(
      this.appDataSource,
    )
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const organizationRepository = new OrganizationsRepository(
      this.appDataSource,
    )
    const teacherOrganizationRepository = new TeacherOrganizationRepository(
      this.appDataSource,
    )
    const studentRepository = new StudentRepository(this.appDataSource)
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
      administratorRepository,
    )
    const studentStudentGroupRepository = new StudentStudentGroupRepository(
      this.appDataSource,
    )
    const getMeResult = await new GetMeUseCase(
      administratorRepository,
      administratorDistrictRepository,
      teacherRepository,
      organizationRepository,
      teacherOrganizationRepository,
      studentRepository,
      studentGroupRepository,
      studentStudentGroupRepository,
    ).run(requestedUser)

    if (getMeResult.hasError) {
      const response500: Paths.GetPlayersSetting.Responses.$500 = {
        error: JSON.stringify(getMeResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    const nickname = (() => {
      switch (requestedUser.role) {
        case 'student':
          return getMeResult.value?.student?.nickName ?? 'student'
        case 'teacher':
          return getMeResult.value?.teacher?.firstName ?? 'teacher'
        case 'administrator':
          return getMeResult.value?.administrator?.firstName ?? 'teacher'
      }

      return 'user'
    })()

    // Get User Settings
    const userSettingsRepository = new UserSettingsRepository(
      this.appDataSource,
    )
    const getUserSettingsUseCase = new GetUserSettingsUseCase(
      userSettingsRepository,
    )
    const getUserSettingsResult = await getUserSettingsUseCase.run(
      requestedUser,
    )

    if (getUserSettingsResult.hasError) {
      switch (getUserSettingsResult.error.type) {
        default: {
          const response500: Paths.GetPlayersSetting.Responses.$500 = {
            error: JSON.stringify(getUserSettingsResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const userSettings = getUserSettingsResult.value

    const response200: Paths.GetPlayersSetting.Responses.$200 = {
      sound_volume: {
        se: userSettings.sound.seVolume,
        bgm: userSettings.sound.bgmVolume,
        serif_talk: userSettings.sound.serifNarrationVolume,
        hint_talk: userSettings.sound.hintNarrationVolume,
      },
      sound_config: {
        max: 5,
        min: 0,
        talk_type: {
          hint_talk: userSettings.sound.narrationLanguage,
          serif_talk: userSettings.sound.narrationLanguage,
        },
      },
      return_page: {
        title:
          requestedUser.role === 'teacher' ||
          requestedUser.role === 'administrator'
            ? 'Return to Life is Tech Portal'
            : 'Return to Magic Circle',
        url:
          requestedUser.role === 'teacher' ||
          requestedUser.role === 'administrator'
            ? new URL(
                '/lesson-guidance',
                this.codexUsaFronteneBaseUrl,
              ).toString()
            : new URL('/', this.codexUsaFronteneBaseUrl).toString(),
      },
      login_status: 'yes',
      language: 'en',
      log_level: 'development',
      player_name:
        requestedUser?.loginId && requestedUser?.loginId.length !== 0
          ? requestedUser?.loginId
          : 'User',
      nickname,
      header_user_icon_name: '',
      header_appearance: {
        show_user_icon: false,
        show_menu: false,
        show_login_status: false,
      },
      custom_items: [],
    }

    return { statusCode: 200, response: response200 }
  }
}
