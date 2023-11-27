import axios from 'axios'

const ERROR_MESSAGE_NOT_FOUND_CODEX_BASE_URL =
  'Not found process.env.CODEX_USA_BACKEND_BASE_URL'
const ERROR_MESSAGE_NOT_FOUND_CODEX_USER_CREDENTIALS =
  'Not found codex username and password!'
const ERROR_MESSAGE_NOT_ENABLED_AUTOMATE_ROSTER_SYNC =
  'Automate Roster sync is disabled'

const STATUS_CODE_500 = 500
const STATUS_CODE_200 = 200

const DISTRICT_LMS_CLEVER = 'clever'
const DISTRICT_LMS_CLASSLINK = 'classlink'

const ROSTER_SYNC_STATUS_SUCCESS = 'Success'
const ROSTER_SYNC_STATUS_FAIL = 'Fail'
const ROSTER_SYNC_STATUS_NOT_PERFORM = 'Not Perform'

export async function main() {
  const allDistrictRosterSyncResult = []

  try {
    // Added the CODEX_AUTOMATE_ROSTER_SYNC_ENABLED flag to enable or disable the automate roster sync process.
    const automateRosterSyncEnabled =
      process.env.CODEX_AUTOMATE_ROSTER_SYNC_ENABLED

    if (automateRosterSyncEnabled !== 'true') {
      return createAndLogResponse(
        STATUS_CODE_200,
        ERROR_MESSAGE_NOT_ENABLED_AUTOMATE_ROSTER_SYNC,
      )
    }

    const codexBackendApiBaseUrl = process.env.CODEX_USA_BACKEND_BASE_URL

    if (!codexBackendApiBaseUrl) {
      return createAndLogResponse(
        STATUS_CODE_500,
        ERROR_MESSAGE_NOT_FOUND_CODEX_BASE_URL,
      )
    }

    const loginId = process.env.CODEX_USA_LIT_USER_LOGINID
    const password = process.env.CODEX_USA_LIT_USER_PASSWORD

    if (!loginId || !password) {
      return createAndLogResponse(
        STATUS_CODE_500,
        ERROR_MESSAGE_NOT_FOUND_CODEX_USER_CREDENTIALS,
      )
    }

    // Take the token from codex backend api
    const loginApiResult = await axios.post(`${codexBackendApiBaseUrl}/login`, {
      loginId: loginId,
      password: password,
    })

    if (loginApiResult.status !== 200) {
      return createAndLogResponse(
        STATUS_CODE_500,
        JSON.stringify(loginApiResult.data),
      )
    }

    const token = loginApiResult.data.user.accessToken
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'X-Amz-Invocation-Type': 'Event',
      },
    }

    //get the district data
    const distrcitAPIResult = await axios.get(
      `${codexBackendApiBaseUrl}/districts?enabledRosterSync=true`,
      config,
    )

    if (distrcitAPIResult.status !== 200) {
      return createAndLogResponse(
        STATUS_CODE_500,
        JSON.stringify(distrcitAPIResult.data),
      )
    }

    const districtsData = distrcitAPIResult.data.districts

    for (const district of districtsData) {
      const districtId = district.id
      const districtName = district.name
      const districtLmsName = getLmsNameBasedOnLmsId(district.lmsId)
      const performDistrictRosterSyncInfo = `Perform the ${districtLmsName} roster sync for ${districtName} (id: ${districtId})`

      console.log(performDistrictRosterSyncInfo)
      try {
        if (district.lmsId === DISTRICT_LMS_CLEVER) {
          await axios.get(
            `${codexBackendApiBaseUrl}/clever/roster-sync?districtId=${district.id}`,
            config,
          )
          allDistrictRosterSyncResult.push(
            getDistrictRosterSyncInfo(
              districtId,
              ROSTER_SYNC_STATUS_SUCCESS,
              null,
              districtName,
              districtLmsName,
            ),
          )
        } else if (district.lmsId === DISTRICT_LMS_CLASSLINK) {
          await axios.get(
            `${codexBackendApiBaseUrl}/class-link/roster-sync?districtId=${district.id}`,
            config,
          )
          allDistrictRosterSyncResult.push(
            getDistrictRosterSyncInfo(
              districtId,
              ROSTER_SYNC_STATUS_SUCCESS,
              null,
              districtName,
              districtLmsName,
            ),
          )
        } else {
          allDistrictRosterSyncResult.push(
            getDistrictRosterSyncInfo(
              districtId,
              ROSTER_SYNC_STATUS_NOT_PERFORM,
              `Not performing roster sync for lms  id: ${district.lmsId}`,
              districtName,
              districtLmsName,
            ),
          )
        }
      } catch (error: unknown) {
        allDistrictRosterSyncResult.push(
          getDistrictRosterSyncInfo(
            districtId,
            ROSTER_SYNC_STATUS_FAIL,
            JSON.stringify(error),
            districtName,
            districtLmsName,
          ),
        )
      }
    }
  } catch (error: unknown) {
    return createAndLogResponse(STATUS_CODE_500, JSON.stringify(error))
  }
  console.log(
    'All district roster sync result: ',
    JSON.stringify(allDistrictRosterSyncResult),
  )

  return createAndLogResponse(STATUS_CODE_200, '')
}

const createAndLogResponse = (
  status: number,
  body: string,
): { status: number; body: string } => {
  const response = {
    status,
    body,
  }

  if (status === STATUS_CODE_200) {
    console.log(JSON.stringify(response))
  } else if (status === STATUS_CODE_500) {
    console.error(JSON.stringify(response))
  }

  return response
}

const getLmsNameBasedOnLmsId = (lmsId: string): string => {
  if (lmsId === DISTRICT_LMS_CLEVER) {
    return 'Clever'
  } else if (lmsId === DISTRICT_LMS_CLASSLINK) {
    return 'Classlink'
  }

  return lmsId
}

const getDistrictRosterSyncInfo = (
  districtId: string,
  status: 'Success' | 'Fail' | 'Not Perform',
  error: string | null,
  districtLmsName: string,
  lmsId: string,
) => {
  return {
    district_id: districtId,
    status,
    error,
    district_name: districtLmsName,
    lms_id: lmsId,
  }
}
