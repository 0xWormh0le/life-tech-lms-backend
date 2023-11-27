import axios from 'axios'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'
import { StudentTypeormEntity } from '../../../../src/adapter/typeorm/entity/Student'
import { TeacherTypeormEntity } from '../../../../src/adapter/typeorm/entity/Teacher'
import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'

beforeEach(setupEnvironment)

afterEach(teardownEnvironment)

test('Lesson Player can get correct Player Setting with student account', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const userRepo = await appDataSource.getRepository(UserTypeormEntity)
  const createdUser = await userRepo.save({
    login_id: 'wickwickwick',
    password: await hashingPassword('wickwickwick'),
    role: 'student',
  })
  const studnetRepo = await appDataSource.getRepository(StudentTypeormEntity)

  await studnetRepo.save({
    user_id: createdUser.id,
    nick_name: 'Wick Wick',
  })

  // Login
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'wickwickwick',
      password: 'wickwickwick',
    } as Paths.PostLogin.RequestBody,
  )

  if (loginResponse.status !== 200) {
    throw new Error(
      `loginResponse.status is not 200 with error ${
        loginResponse.status
      } ${JSON.stringify(loginResponse.data)}`,
    )
  }

  if (!loginResponse.data.user) {
    throw new Error('failed to get user from /login')
  }

  const user = loginResponse.data.user
  const authorizationHeader = {
    Authorization: `Bearer ${user.accessToken}`,
  }

  // player_setting called from Lesson Player
  const playerSettingResponse = await axios.get('player_api/player_setting', {
    headers: authorizationHeader,
  })

  if (playerSettingResponse.status !== 200) {
    throw new Error(
      `playerSettingResponse.status is not 200 with error ${
        playerSettingResponse.status
      } ${JSON.stringify(playerSettingResponse.data)}`,
    )
  }
  expect(
    playerSettingResponse.data,
  ).toEqual<Paths.GetPlayersSetting.Responses.$200>({
    sound_volume: {
      se: 5, // Default value
      bgm: 5, // Default value
      hint_talk: 5, // Default value
      serif_talk: 5, // Default value
    },
    // Below are the fixed value
    sound_config: {
      min: 0,
      max: 5,
      talk_type: {
        hint_talk: 'en',
        serif_talk: 'en',
      },
    },
    login_status: 'yes',
    language: 'en',
    log_level: 'development',
    player_name: 'wickwickwick',
    nickname: 'Wick Wick',
    header_user_icon_name: '',
    header_appearance: {
      show_user_icon: false,
      show_menu: false,
      show_login_status: false,
    },
    return_page: {
      title: 'Return to Magic Circle',
      // This base URL is specified in env/e2e-test/docker-compose.ts as CODEX_USA_FRONTEND_BASE_URL
      url: 'http://localhost:3100/',
    },
    custom_items: [],
  })

  // Update Sound settings
  const putSoundSettingsResponse = await axios.put(
    `/users/${user.id}/soundSettings`,
    {
      seVolume: 1,
      bgmVolume: 2,
      hintNarrationVolume: 3,
      serifNarrationVolume: 4,
      narrationLanguage: 'es',
    },
    {
      headers: authorizationHeader,
    },
  )

  if (putSoundSettingsResponse.status !== 200) {
    throw new Error(
      `putSoundSettingsResponse.status is not 200 with error ${
        putSoundSettingsResponse.status
      } ${JSON.stringify(putSoundSettingsResponse.data)}`,
    )
  }

  // get player_setting again
  const playerSettingResponse2 = await axios.get('player_api/player_setting', {
    headers: authorizationHeader,
  })

  if (playerSettingResponse2.status !== 200) {
    throw new Error(
      `playerSettingResponse2.status is not 200 with error ${
        playerSettingResponse2.status
      } ${JSON.stringify(playerSettingResponse2.data)}`,
    )
  }
  expect(
    playerSettingResponse2.data,
  ).toEqual<Paths.GetPlayersSetting.Responses.$200>({
    sound_volume: {
      se: 1,
      bgm: 2,
      hint_talk: 3,
      serif_talk: 4,
    },
    // Below are the fixed value
    sound_config: {
      min: 0,
      max: 5,
      talk_type: {
        hint_talk: 'es',
        serif_talk: 'es',
      },
    },
    login_status: 'yes',
    language: 'en',
    log_level: 'development',
    player_name: 'wickwickwick',
    nickname: 'Wick Wick',
    header_user_icon_name: '',
    header_appearance: {
      show_user_icon: false,
      show_menu: false,
      show_login_status: false,
    },
    return_page: {
      title: 'Return to Magic Circle',
      // This base URL is specified in env/e2e-test/docker-compose.ts as CODEX_USA_FRONTEND_BASE_URL
      url: 'http://localhost:3100/',
    },
    custom_items: [],
  })
})

test('Lesson Player can get correct Player Setting with teacher account', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const userRepo = await appDataSource.getRepository(UserTypeormEntity)
  const createdUser = await userRepo.save({
    login_id: 'wickwickwick',
    password: await hashingPassword('wickwickwick'),
    role: 'teacher',
  })
  const teacherRepo = await appDataSource.getRepository(TeacherTypeormEntity)

  await teacherRepo.save({
    user_id: createdUser.id,
    first_name: 'Wick',
    last_name: 'Wock',
  })

  // Login
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'wickwickwick',
      password: 'wickwickwick',
    } as Paths.PostLogin.RequestBody,
  )

  if (loginResponse.status !== 200) {
    throw new Error(
      `loginResponse.status is not 200 with error ${
        loginResponse.status
      } ${JSON.stringify(loginResponse.data)}`,
    )
  }

  if (!loginResponse.data.user) {
    throw new Error('failed to get user from /login')
  }

  const user = loginResponse.data.user
  const authorizationHeader = {
    Authorization: `Bearer ${user.accessToken}`,
  }

  // player_setting called from Lesson Player
  const playerSettingResponse = await axios.get('player_api/player_setting', {
    headers: authorizationHeader,
  })

  if (playerSettingResponse.status !== 200) {
    throw new Error(
      `playerSettingResponse.status is not 200 with error ${
        playerSettingResponse.status
      } ${JSON.stringify(playerSettingResponse.data)}`,
    )
  }
  expect(playerSettingResponse.data.return_page).toEqual<
    Paths.GetPlayersSetting.Responses.$200['return_page']
  >({
    title: 'Return to Life is Tech Portal',
    // This base URL is specified in env/e2e-test/docker-compose.ts as CODEX_USA_FRONTEND_BASE_URL
    url: 'http://localhost:3100/lesson-guidance',
  })
  expect(playerSettingResponse.data.nickname).toEqual<
    Paths.GetPlayersSetting.Responses.$200['nickname']
  >('Wick')
})
