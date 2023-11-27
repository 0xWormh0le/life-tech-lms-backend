import { OAuth2Client } from 'google-auth-library'

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
import { OrganizationsRepository } from '../../../../repositories/OrganizationRepository'
import { TeacherTypeormEntity } from '../../../../typeorm/entity/Teacher'
import {
  CreateTeachersUseCase,
  TeacherInfo,
} from '../../../../../domain/usecases/codex/Teacher/CreateTeachersUseCase'

type Response =
  | Paths.PostGoogleAuthenticate.Responses.$200
  | Paths.PostGoogleAuthenticate.Responses.$401
  | Paths.PostGoogleAuthenticate.Responses.$500

export class GoogleAuthenticateExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.PostGoogleAuthenticate.RequestBody,
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
      if (!process.env.GOOGLE_CLIENT_ID) {
        throw new Error('process.env.GOOGLE_CLIENT_ID is not defined.')
      }
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
      client.setCredentials({
        access_token: params.body.token,
      })
      const userInfoResponse = await client.request({
        url: 'https://openidconnect.googleapis.com/v1/userinfo',
      })
      if (!userInfoResponse.data || typeof userInfoResponse.data !== 'object') {
        const response500: Paths.PostGoogleAuthenticate.Responses.$500 = {
          error: `This Google userinfo API returns empty data. response: ${JSON.stringify(
            userInfoResponse,
          )}`,
        }
        return { statusCode: 500, response: response500 }
      }
      const userInfo = userInfoResponse.data
      if (
        !('sub' in userInfo) ||
        typeof userInfo.sub !== 'string' ||
        !('email' in userInfo) ||
        typeof userInfo.email !== 'string'
      ) {
        const response500: Paths.PostGoogleAuthenticate.Responses.$500 = {
          error: `This Google User doesn't have sub or email. response: ${JSON.stringify(
            userInfo,
          )}`,
        }
        return { statusCode: 500, response: response500 }
      }
      const { sub, email } = userInfo
      const name =
        'name' in userInfo && typeof userInfo.name === 'string'
          ? userInfo.name
          : ''
      const given_name =
        'given_name' in userInfo && typeof userInfo.given_name === 'string'
          ? userInfo.given_name
          : ''
      const family_name =
        'family_name' in userInfo && typeof userInfo.family_name === 'string'
          ? userInfo.family_name
          : ''

      //clever lms Id
      const lmsId = sub
      let result: any

      if (params.body.role === UserRoles.teacher) {
        //add teacher
        const teacherTypeormEntity =
          this.appDataSource.getRepository(TeacherTypeormEntity)
        const teacherData = await teacherTypeormEntity.findOneBy({
          teacher_lms_id: lmsId,
        })
        const userByEmailReault = await userRepository.getUsersByEmails([email])

        if (userByEmailReault.hasError) {
          const response500: Paths.PostGoogleAuthenticate.Responses.$500 = {
            error: JSON.stringify(userByEmailReault.error),
          }
          return { statusCode: 500, response: response500 }
        }

        if (userByEmailReault.value.length > 0) {
          const teacherData = await teacherTypeormEntity.findOneBy({
            user_id: userByEmailReault.value[0].userId,
          })

          if (!teacherData) {
            throw new Error('User is already exist with student role.')
          }

          const getTeacherOrganizationsTeachersByTeacherIdAndOrganizationIdData =
            await teacherRepository.getTeacherOrganizationsTeachersByTeacherIdAndOrganizationId(
              teacherData.id,
              params.body.organizationId,
            )

          if (
            getTeacherOrganizationsTeachersByTeacherIdAndOrganizationIdData.hasError
          ) {
            throw new Error(
              JSON.stringify(
                getTeacherOrganizationsTeachersByTeacherIdAndOrganizationIdData.error,
              ),
            )
          }

          if (
            getTeacherOrganizationsTeachersByTeacherIdAndOrganizationIdData
              .value?.length === 0
          ) {
            const addStudentInStudentGroupData =
              await teacherRepository.addTeacherInOrganization(
                params.body.organizationId,
                teacherData.id,
                '',
              )

            if (addStudentInStudentGroupData.hasError) {
              throw new Error(
                JSON.stringify(addStudentInStudentGroupData.error.message),
              )
            }
          }
          result = this.getUserData(teacherData.user_id)
        } else if (teacherData === null) {
          //make teacher object for create teacher
          const teacherInfo = {
            firstName: given_name,
            lastName: family_name,
            teacherLMSId: lmsId,
            email: email,
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
            throw new Error(JSON.stringify(teacherResult.error))
          }

          //get added teacher data from DB
          const teacherData = await teacherTypeormEntity.findOneBy({
            teacher_lms_id: lmsId,
          })

          if (teacherData === null) {
            throw new Error('failed to get teacher data from DB')
          }
          result = this.getUserData(teacherData?.user_id)
        } else {
          const getTeacherOrganizationsTeachersByTeacherIdAndOrganizationIdData =
            await teacherRepository.getTeacherOrganizationsTeachersByTeacherIdAndOrganizationId(
              teacherData.id,
              params.body.organizationId,
            )

          if (
            getTeacherOrganizationsTeachersByTeacherIdAndOrganizationIdData.hasError
          ) {
            throw new Error(
              JSON.stringify(
                getTeacherOrganizationsTeachersByTeacherIdAndOrganizationIdData.error,
              ),
            )
          }

          if (
            getTeacherOrganizationsTeachersByTeacherIdAndOrganizationIdData
              .value?.length === 0
          ) {
            const addStudentInStudentGroupData =
              await teacherRepository.addTeacherInOrganization(
                params.body.organizationId,
                teacherData.id,
                '',
              )

            if (addStudentInStudentGroupData.hasError) {
              throw new Error(
                JSON.stringify(addStudentInStudentGroupData.error),
              )
            }
          }
          result = this.getUserData(teacherData.user_id)
        }
      } else if (params.body.role === UserRoles.student) {
        //add student
        const studentTypeormEntity =
          this.appDataSource.getRepository(StudentTypeormEntity)
        const studentData = await studentTypeormEntity.findOneBy({
          student_lms_id: lmsId,
        })

        const userByEmailReault = await userRepository.getUsersByEmails([email])

        if (userByEmailReault.hasError) {
          const response500: Paths.PostGoogleAuthenticate.Responses.$500 = {
            error: JSON.stringify(userByEmailReault.error),
          }

          return { statusCode: 500, response: response500 }
        }

        if (userByEmailReault.value.length > 0) {
          const studentData = await studentTypeormEntity.findOneBy({
            user_id: userByEmailReault.value[0].userId,
          })

          if (!studentData) {
            throw new Error('User is already exist with teacher role.')
          }

          const getStudentGroupsStudentsByStudentIdAndStudentGroupIdData =
            await studentRepository.getStudentGroupsStudentsByStudentIdAndStudentGroupId(
              studentData.id,
              params.body.studentGroupId,
            )

          if (
            getStudentGroupsStudentsByStudentIdAndStudentGroupIdData.hasError
          ) {
            throw new Error(
              JSON.stringify(
                getStudentGroupsStudentsByStudentIdAndStudentGroupIdData.error,
              ),
            )
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
              throw new Error(
                JSON.stringify(addStudentInStudentGroupData.error),
              )
            }
          }
          result = this.getUserData(studentData.user_id)
        } else if (studentData === null) {
          // make student object for create student
          const studentInfo = {
            nickName: name,
            loginId: '',
            password: '',
            studentLMSId: lmsId,
            email: email,
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
            throw new Error(JSON.stringify(studentResult.error))
          }

          //get added student data from DB
          const studentData = await studentTypeormEntity.findOneBy({
            student_lms_id: lmsId,
          })

          if (studentData === null) {
            throw new Error('failed to get student data from DB')
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
            throw new Error(
              JSON.stringify(
                getStudentGroupsStudentsByStudentIdAndStudentGroupIdData.error,
              ),
            )
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
              throw new Error(
                JSON.stringify(addStudentInStudentGroupData.error),
              )
            }
          }
          result = this.getUserData(studentData?.user_id)
        }
      } else {
        const userIdData = await userRepository.getUserIdByLmsId(lmsId)

        if (userIdData.hasError) {
          const response500: Paths.PostGoogleAuthenticate.Responses.$500 = {
            error: JSON.stringify(userIdData.error),
          }

          return { statusCode: 500, response: response500 }
        }

        const userByEmailReault = await userRepository.getUsersByEmails([email])

        if (userByEmailReault.hasError) {
          const response500: Paths.PostGoogleAuthenticate.Responses.$500 = {
            error: JSON.stringify(userByEmailReault.error),
          }

          return { statusCode: 500, response: response500 }
        }

        if (userIdData.value && userIdData.value !== '') {
          result = this.getUserData(userIdData.value)
        } else if (userByEmailReault.value.length > 0) {
          result = this.getUserData(userByEmailReault.value[0].userId)
        } else {
          const response401: Paths.PostGoogleAuthenticate.Responses.$401 = {
            error: `Sorry! You don't have a Life is Tech portal account yet. Please ask your teacher or administrator to invite you via an Invitation Link.`,
          }

          return { statusCode: 401, response: response401 }
        }
      }

      const response200: Paths.PostGoogleAuthenticate.Responses.$200 = {
        user: await result,
      }

      return { statusCode: 200, response: response200 }
    } catch (error: unknown) {
      const response500: Paths.PostGoogleAuthenticate.Responses.$500 = {
        error:
          error instanceof Error
            ? `${error.name} ${error.message} ${error.stack}`
            : JSON.stringify(error),
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
      throw new Error(error.message)
    }
  }
}
