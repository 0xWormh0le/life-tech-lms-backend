import axios from 'axios'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { Handler } from '../shared/types'
import * as https from 'https'
import { DataSource } from 'typeorm'
import { StudentTypeormEntity } from '../../../../typeorm/entity/Student'
import { StudentRepository } from '../../../../repositories/StudentRepository'
import {
  CreateStudentsUseCase,
  StudentInfo,
} from '../../../../../domain/usecases/codex/Student/CreateStudentsUseCase'
import { UserTypeormEntity } from '../../../../typeorm/entity/User'
import { UserAccessTokenTypeormEntity } from '../../../../typeorm/entity/UserAccessToken'
import { v4 as uuidv4 } from 'uuid'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { StudentGroupRepository } from '../../../../repositories/StudentGroupRepository'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import {
  UserRoles,
  userRoles,
} from '../../../../../domain/usecases/shared/Constants'
import { UserRole } from '../../../../../domain/entities/codex/User'
import { TeacherTypeormEntity } from '../../../../typeorm/entity/Teacher'
import {
  CreateTeachersUseCase,
  TeacherInfo,
} from '../../../../../domain/usecases/codex/Teacher/CreateTeachersUseCase'
import { OrganizationsRepository } from '../../../../repositories/OrganizationRepository'

export const CLASS_LINK = {
  OATH_TOKEN_URL: 'https://launchpad.classlink.com/oauth2/v2/token',
  ME_URL: `https://nodeapi.classlink.com/v2/my/info`,
  BEARER: 'Bearer',
}

type Response =
  | Paths.PostClassLinkAuthenticate.Responses.$200
  | Paths.PostClassLinkAuthenticate.Responses.$401
  | Paths.PostClassLinkAuthenticate.Responses.$500

let errorMessage = ''

export class ClassLinkAuthenticatExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.PostClassLinkAuthenticate.RequestBody,
    Response
  > = async (params) => {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    })
    const userRepository = new UserRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const organizationRepository = new OrganizationsRepository(
      this.appDataSource,
    )
    const studentRepository = new StudentRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
      administratorRepository,
    )

    try {
      if (!process.env.CLASS_LINK_CLIENT_ID) {
        throw new Error(`process.env.CLASS_LINK_CLIENT_ID is not defined`)
      }

      if (!process.env.CLASS_LINK_CLIENT_SECRET) {
        throw new Error(`process.env.CLASS_LINK_CLIENT_SECRET is not defined`)
      }

      // Call class link oauth/tokens API and get Token data
      const oathTokenData = await axios.post<{
        access_token?: string
        error?: string
      }>(
        CLASS_LINK.OATH_TOKEN_URL,
        new URLSearchParams({
          code: params.body.code, //gave the values directly for testing
          client_id: process.env.CLASS_LINK_CLIENT_ID,
          client_secret: process.env.CLASS_LINK_CLIENT_SECRET,
        }),
        {
          httpsAgent: agent,
        },
      )

      if (
        !oathTokenData ||
        !oathTokenData.data ||
        !oathTokenData.data.access_token ||
        oathTokenData.status !== 200 ||
        oathTokenData.data.error
      ) {
        console.log(
          `${CLASS_LINK.OATH_TOKEN_URL} responded with error ${JSON.stringify(
            oathTokenData.data,
          )}`,
        )

        return {
          statusCode: 500,
          response: {
            error: `Something went wrong with Classlink server. ${
              CLASS_LINK.OATH_TOKEN_URL
            } responded with error. ${JSON.stringify(oathTokenData?.data)}`,
          },
        }
      }

      //Call class link me API Get data
      const userApiData = await axios.get(CLASS_LINK.ME_URL, {
        headers: {
          Authorization: `${CLASS_LINK.BEARER} ${oathTokenData.data.access_token}`,
        },
        httpsAgent: agent,
      })

      if (!userApiData.data) {
        console.log(
          `${
            CLASS_LINK.ME_URL
          } didn't respond with correct data structure ${JSON.stringify(
            userApiData.data,
          )}`,
        )
        errorMessage = 'failed to get user data from class link.'
        throw new Error(errorMessage)
      }

      if (
        params.body.organizationId !== '' &&
        params.body.studentGroupId !== '' &&
        params.body.role.toLowerCase() !== userApiData.data.Role.toLowerCase()
      ) {
        errorMessage = 'Please passed correct role in URL.'
        throw new Error(errorMessage)
      }

      //class link lms Id
      let lmsId = ''

      if (userApiData.data.LoginId && userApiData.data.SourcedId) {
        lmsId = userApiData.data.SourcedId
      } else if (userApiData.data.SourcedId) {
        lmsId = userApiData.data.SourcedId
      } else {
        lmsId = userApiData.data.LoginId
      }

      if (!lmsId) {
        errorMessage = 'ClassLink loginId and sourcedId not found.'
        throw new Error(errorMessage)
      }

      let result: any

      if (params.body.role === UserRoles.teacher) {
        //add teacher
        const teacherTypeormEntity =
          this.appDataSource.getRepository(TeacherTypeormEntity)
        const teacherData = await teacherTypeormEntity.findOneBy({
          teacher_lms_id: lmsId,
        })

        if (teacherData === null) {
          //make teacher object for create teacher
          const teacherInfo = {
            firstName: userApiData.data.FirstName,
            lastName: userApiData.data.LastName,
            teacherLMSId: lmsId,
            email: userApiData.data.Email,
            password: '',
            classLinkTenantId: userApiData.data.TenantId,
          }
          const teacherInfoData: TeacherInfo[] = []

          teacherInfoData.push(teacherInfo)

          //create Teacher in codex DB
          const createTeachersUseCase = new CreateTeachersUseCase(
            teacherRepository,
            userRepository,
            organizationRepository,
            administratorRepository,
          )
          const teacherResult = await createTeachersUseCase.run(
            params.body.organizationId,
            {
              role: userRoles.internalOperator as UserRole,
              id: '',
              loginId: '',
            },
            teacherInfoData,
          )

          if (teacherResult.hasError) {
            errorMessage = JSON.stringify(teacherResult.error.message)
            throw new Error(errorMessage)
          }

          //get added teacher data from DB
          const teacherData = await teacherTypeormEntity.findOneBy({
            teacher_lms_id: lmsId,
          })

          if (teacherData === null) {
            errorMessage = 'failed to get teacher data from DB'
            throw new Error(errorMessage)
          }
          result = this.getUserData(teacherData?.user_id)
        } else {
          result = this.getUserData(teacherData?.user_id)
        }
      } else if (params.body.role === UserRoles.student) {
        //add student
        const studentTypeormEntity =
          this.appDataSource.getRepository(StudentTypeormEntity)
        const studentData = await studentTypeormEntity.findOneBy({
          student_lms_id: lmsId,
        })

        if (studentData === null) {
          // make student object for create student
          const studentInfo = {
            nickName: `${userApiData.data.FirstName} ${userApiData.data.LastName}`,
            loginId: '',
            password: '',
            studentLMSId: lmsId,
            email: userApiData.data.Email,
            classLinkTenantId: userApiData.data.TenantId,
          }
          const studentInfoData: StudentInfo[] = []

          studentInfoData.push(studentInfo)

          const createStudentsUseCase = new CreateStudentsUseCase(
            studentRepository,
            userRepository,
            studentGroupRepository,
            administratorRepository,
            teacherRepository,
          )
          //create student in codex DB
          const studentResult = await createStudentsUseCase.run(
            {
              role: userRoles.internalOperator as UserRole,
              id: '',
              loginId: '',
            },
            params.body.studentGroupId,
            studentInfoData,
          )

          if (studentResult.hasError) {
            errorMessage = JSON.stringify(studentResult.error.message)
            throw new Error(errorMessage)
          }

          //get added student data from DB
          const studentData = await studentTypeormEntity.findOneBy({
            student_lms_id: lmsId,
          })

          if (studentData === null) {
            errorMessage = 'failed to get student data from DB'
            throw new Error(errorMessage)
          }
          result = this.getUserData(studentData?.user_id)
        } else {
          const getStudentGroupsStudentsByStudentIdAndStudentGroupIdData =
            await studentRepository.getStudentGroupsStudentsByStudentIdAndStudentGroupId(
              studentData.id,
              params.body.studentGroupId,
            )

          if (
            getStudentGroupsStudentsByStudentIdAndStudentGroupIdData.hasError
          ) {
            errorMessage = JSON.stringify(
              getStudentGroupsStudentsByStudentIdAndStudentGroupIdData.error
                .message,
            )
            throw new Error(errorMessage)
          }

          if (
            getStudentGroupsStudentsByStudentIdAndStudentGroupIdData.value
              ?.length === 0
          ) {
            const addStudentInStudentGroupData =
              await studentRepository.addStudentInStudentGroup(
                '',
                params.body.studentGroupId,
                studentData.id,
              )

            if (addStudentInStudentGroupData.hasError) {
              errorMessage = JSON.stringify(
                addStudentInStudentGroupData.error.message,
              )
              throw new Error(errorMessage)
            }
          }
          result = this.getUserData(studentData?.user_id)
        }
      } else {
        const userIdData = await userRepository.getUserIdByLmsIdClassLink(
          userApiData.data.TenantId.toString(),
          lmsId,
        )

        if (userIdData.hasError) {
          const response500: Paths.PostClassLinkAuthenticate.Responses.$500 = {
            error: JSON.stringify(userIdData.error),
          }

          return { statusCode: 500, response: response500 }
        }

        if (userIdData.value === undefined || userIdData.value === '') {
          const response401: Paths.PostClassLinkAuthenticate.Responses.$401 = {
            error: `Sorry! You don't have a Life is Tech portal account yet. Please ask your teacher or administrator to invite you via an Invitation Link.`,
          }

          return { statusCode: 401, response: response401 }
        }
        result = this.getUserData(userIdData.value)
      }

      const response200: Paths.PostClassLinkAuthenticate.Responses.$200 = {
        user: await result,
      }

      return { statusCode: 200, response: response200 }
    } catch (error: any) {
      const response500: Paths.PostClassLinkAuthenticate.Responses.$500 = {
        error: errorMessage ? errorMessage : JSON.stringify(error),
      }

      return { statusCode: 500, response: response500 }
    }
  }

  getUserData = async (userId: string | undefined) => {
    let data: any
    const userTypeormRepository =
      this.appDataSource.getRepository(UserTypeormEntity)
    const userAccessTokenTypeormEntity = this.appDataSource.getRepository(
      UserAccessTokenTypeormEntity,
    )

    //get added user data from DB
    try {
      const userInfo = await userTypeormRepository.findOneBy({
        id: userId,
      })

      if (userInfo) {
        //generate access token using uuidv4 for codex login
        const accessToken = uuidv4()

        await userAccessTokenTypeormEntity.save({
          user_id: userInfo.id,
          access_token: accessToken,
        })
        data = {
          id: userInfo.id,
          role: userInfo.role,
          accessToken: accessToken,
        }

        return data
      } else {
        errorMessage = 'failed to get user data from DB'
        throw new Error(errorMessage)
      }
    } catch (error: any) {
      errorMessage = error.message
      throw new Error(errorMessage)
    }
  }
}
