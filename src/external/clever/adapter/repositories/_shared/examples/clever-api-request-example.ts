import { Errorable, E } from '../../../../../../domain/usecases/shared/Errors'
import { cleverApiRequest } from '../clever-api-request'

type CleverSchool = {
  district: string
  id: string
  name: string
  number: string
}

const getCleverSchools = async (): Promise<
  Errorable<
    CleverSchool[],
    E<'ErrorUnkown'> | E<'Unauthorized'> | E<'NotFound'>
  >
> => {
  const getSchoolResult = await cleverApiRequest({
    url: '/schools/{id}/courses', // Paths will be auto completed
    method: 'get', // Methods will be auto completed according to selected path
    pathParams: {
      // After you choiced path and method, Paramter will be typed.
      id: 'school-id-1',
    },
  })

  if (getSchoolResult.hasError) {
    // You can handle error as usual
    if (getSchoolResult.error.type === 'ErrorUnkown') {
      return {
        hasError: true,
        error: {
          type: 'ErrorUnkown',
          message: getSchoolResult.error.message.error.message,
        },
        value: null,
      }
    }
    switch (getSchoolResult.error.message.status) {
      case 401:
        return {
          hasError: true,
          error: {
            type: 'Unauthorized',
            message: 'token invalid!',
          },
          value: null,
        }
      case 404: // Error statuses you have to handle will be auto completed
        return {
          hasError: true,
          error: {
            type: 'NotFound',
            message: 'Not found!',
          },
          value: null,
        }
      default:
        return {
          hasError: true,
          error: {
            type: 'ErrorUnkown',
            message: `status unkown ${getSchoolResult.error.message.status}`,
          },
          value: null,
        }
    }
  }

  if (!getSchoolResult.value.data) {
    return {
      hasError: true,
      error: {
        type: 'ErrorUnkown',
        message: `school data is undefined`,
      },
      value: null,
    }
  }

  const value: CleverSchool[] = []

  for (const data of getSchoolResult.value.data) {
    if (!data?.data) {
      continue
    }
    value.push({
      // Maybe these should be error in some cases
      district: data.data.district ?? '',
      id: data.data.id ?? '',
      name: data.data.name ?? '',
      number: data.data.number ?? '',
    })
  }

  return {
    hasError: false,
    error: null,
    value,
  }
}

getCleverSchools().then((ret) => console.log(JSON.stringify(ret)))
