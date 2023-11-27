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
import { userRoles } from '../../../../../domain/usecases/shared/Constants'
import { UserRole } from '../../../../../domain/entities/codex/User'
import { TeacherTypeormEntity } from '../../../../typeorm/entity/Teacher'
import {
  CreateTeachersUseCase,
  TeacherInfo,
} from '../../../../../domain/usecases/codex/Teacher/CreateTeachersUseCase'
import { OrganizationsRepository } from '../../../../repositories/OrganizationRepository'
import { CLEVER } from '../../../../../external/clever/adapter/repositories/_shared/constants'

type Response =
  | Paths.PostCleverAuthenticate.Responses.$200
  | Paths.PostCleverAuthenticate.Responses.$401
  | Paths.PostCleverAuthenticate.Responses.$500

export class CleverAuthenticateExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.PostCleverAuthenticate.RequestBody,
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
      if (!process.env.CLEVER_BASIC_AUTH_HEADER) {
        throw new Error(`process.env.CLEVER_BASIC_AUTH_HEADER is not defined`)
      }

      // Call clever oauth/tokens API and get Token data
      const oathTokenData = await axios.post<{
        access_token?: string
        error?: string
      }>(
        CLEVER.OATH_TOKEN_URL,
        {
          code: params.body.code,
          grant_type: params.body.grantType,
          redirect_uri: params.body.redirectUri,
        },
        {
          headers: {
            Authorization: process.env.CLEVER_BASIC_AUTH_HEADER,
          },
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
          `${CLEVER.OATH_TOKEN_URL} responded with error ${JSON.stringify(
            oathTokenData.data,
          )}`,
        )

        return {
          statusCode: 500,
          response: {
            error: `Something went wrong with Clever server. ${
              CLEVER.OATH_TOKEN_URL
            } responded with error. ${JSON.stringify(oathTokenData?.data)}`,
          },
        }
      }

      //Call clever me API Get data
      const meApiData = await axios.get(CLEVER.ME_URL, {
        headers: {
          Authorization: `${CLEVER.BEARER} ${oathTokenData.data.access_token}`,
        },
        httpsAgent: agent,
      })

      if (!meApiData.data || !meApiData.data.data) {
        console.log(
          `${
            CLEVER.ME_URL
          } didn't respond with correct data structure ${JSON.stringify(
            meApiData.data,
          )}`,
        )

        return {
          statusCode: 500,
          response: {
            error: `Something wrong with Clever server. ${CLEVER.ME_URL} didn't respond with correct data structure.`,
          },
        }
      }

      //Call User API  by UserId and get user data
      const userApiData = await axios.get(
        `${CLEVER.USER_URL}${meApiData.data.data.id}`,
        {
          headers: {
            Authorization: `${CLEVER.BEARER} ${oathTokenData.data.access_token}`,
          },
          httpsAgent: agent,
        },
      )

      if (!userApiData.data || !userApiData.data.data) {
        console.log(
          `${
            CLEVER.USER_URL
          } didn't respond with correct data structure ${JSON.stringify(
            userApiData.data,
          )}`,
        )

        return {
          statusCode: 500,
          response: {
            error: `Something wrong with Clever server. ${CLEVER.USER_URL} didn't respond with correct data structure.`,
          },
        }
      }

      //restrict contact members for codex system
      if (userApiData.data.data.roles.contact != null) {
        return {
          statusCode: 500,
          response: {
            error: `contact members don't have access codex system`,
          },
        }
      }

      //clever lms Id
      const lmsId = userApiData.data.data.id
      let result: any

      if (params.body.studentGroupId || params.body.organizationId) {
        if (
          userApiData.data.data.roles.teacher != null ||
          userApiData.data.data.roles.staff != null
        ) {
          //add teacher
          const teacherTypeormEntity =
            this.appDataSource.getRepository(TeacherTypeormEntity)
          const teacherData = await teacherTypeormEntity.findOneBy({
            teacher_lms_id: lmsId,
          })

          if (teacherData === null) {
            //make teacher object for create teacher
            const teacherInfo = {
              firstName: userApiData.data.data.name.first,
              lastName: userApiData.data.data.name.last,
              teacherLMSId: userApiData.data.data.id,
              email: userApiData.data.data.email,
              password: '',
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
              return {
                statusCode: 500,
                response: {
                  error: JSON.stringify(teacherResult.error.message),
                },
              }
            }

            //get added teacher data from DB
            const teacherData = await teacherTypeormEntity.findOneBy({
              teacher_lms_id: userApiData.data.data.id,
            })

            if (teacherData === null) {
              return {
                statusCode: 500,
                response: {
                  error: 'failed to get teacher data from DB',
                },
              }
            }
            result = this.getUserData(teacherData?.user_id)
          } else {
            result = this.getUserData(teacherData?.user_id)
          }
        } else {
          //add student
          const studentTypeormEntity =
            this.appDataSource.getRepository(StudentTypeormEntity)
          const studentData = await studentTypeormEntity.findOneBy({
            student_lms_id: lmsId,
          })

          if (studentData === null) {
            // make student object for create student
            const studentInfo = {
              nickName: `${userApiData.data.data.name.first} ${userApiData.data.data.name.last}`,
              loginId: '',
              password: '',
              studentLMSId: userApiData.data.data.id,
              email: userApiData.data.data.email,
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
              return {
                statusCode: 500,
                response: {
                  error: JSON.stringify(studentResult.error.message),
                },
              }
            }

            //get added student data from DB
            const studentData = await studentTypeormEntity.findOneBy({
              student_lms_id: userApiData.data.data.id,
            })

            if (studentData === null) {
              return {
                statusCode: 500,
                response: {
                  error: 'failed to get student data from DB',
                },
              }
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
              return {
                statusCode: 500,
                response: {
                  error: JSON.stringify(
                    getStudentGroupsStudentsByStudentIdAndStudentGroupIdData
                      .error.message,
                  ),
                },
              }
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
                return {
                  statusCode: 500,
                  response: {
                    error: JSON.stringify(
                      addStudentInStudentGroupData.error.message,
                    ),
                  },
                }
              }
            }
            result = this.getUserData(studentData?.user_id)
          }
        }
      } else {
        const userIdData = await userRepository.getUserIdByLmsId(lmsId)

        if (userIdData.hasError) {
          const response500: Paths.PostCleverAuthenticate.Responses.$500 = {
            error: JSON.stringify(userIdData.error),
          }

          return { statusCode: 500, response: response500 }
        }

        if (userIdData.value === undefined || userIdData.value === '') {
          const response401: Paths.PostCleverAuthenticate.Responses.$401 = {
            error: `Sorry! You don't have a Life is Tech portal account yet. Please ask your teacher or administrator to invite you via an Invitation Link.`,
          }

          return { statusCode: 401, response: response401 }
        }
        result = this.getUserData(userIdData.value)
      }

      const response200: Paths.PostCleverAuthenticate.Responses.$200 = {
        user: await result,
      }

      return { statusCode: 200, response: response200 }
    } catch (error: unknown) {
      const response500: Paths.PostCleverAuthenticate.Responses.$500 = {
        error: JSON.stringify(error),
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
        throw new Error('failed to get user data from DB')
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
