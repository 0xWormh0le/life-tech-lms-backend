import 'reflect-metadata'
import path from 'path'
import { DatabaseType, DataSource } from 'typeorm'

import { UserTypeormEntity } from './entity/User'
import { UserSoundSettingsTypeormEntity } from './entity/UserSoundSettings'
import { UserLessonStepStatusTypeormEntity } from './entity/UserLessonStepStatus'
import { UserLessonStatusTypeormEntity } from './entity/UserLessonStatus'
import { UserLessonHintStatusTypeormEntity } from './entity/UserLessonHintStatus'
import { LessonHintTypeormEntity } from './entity/LessonHint'
import { LessonTypeormEntity } from './entity/Lesson'
import { LessonStepTypeormEntity } from './entity/LessonStep'
import { LessonQuizTypeormEntity } from './entity/LessonQuiz'
import { UserAccessTokenTypeormEntity } from './entity/UserAccessToken'
import { DistrictTypeormEntity } from './entity/District'
import { AdministratorTypeormEntity } from './entity/Administrator'
import { AdministratorDistrictTypeormEntity } from './entity/AdministratorDistrict'
import { LmsTypeormEntity } from './entity/Lms'
import { OrganizationTypeormEntity } from './entity/Organization'
import { StudentGroupTypeormEntity } from './entity/StudentGroup'
import { TeacherTypeormEntity } from './entity/Teacher'
import { TeacherOrganizationTypeormEntity } from './entity/TeacherOrganization'
import { StudentTypeormEntity } from './entity/Student'
import { StudentGroupStudentTypeormEntity } from './entity/StudentGroupStudent'
import { UnaccessibleLessonTypeormEntity } from './entity/UnaccessibleLesson'
import { UserLessonStatusHistoryTypeormEntity } from './entity/UserLessonStatusHistory'
import { RosterSyncEventLogsTypeormEntity } from './entity/RosterSyncEventLogs'
import { DistrictPurchasedPackageTypeormEntity } from './entity/DistrictPurchasedPackage'
import { UserLessonQuizAnswerStatusTypeormEntity } from './entity/UserLessonQuizAnswerStatus'
import { StudentGroupPackageAssignmentTypeormEntity } from './entity/StudentGroupPackageAssignment'
import { UserResetPasswordRequestTypeormEntity } from './entity/UserResetPasswordRequest'
import { DistrictRosterSyncStatusTypeormEntity } from './entity/DistrictRosterSyncStatus'
import { UserPackageAssignmentTypeormEntity } from './entity/UserPackageAssignment'
import { UserLessonQuizStatusTypeormEntity } from './entity/UserLessonQuizStatus'
import { UserExternalChurnZeroMappingTypeormEntity } from './entity/UserExternalChurnZeroMapping'

// When you create new TypeormEntity, please add it into this array.
export const TypeormEntities = [
  UserTypeormEntity,
  LessonTypeormEntity,
  LessonStepTypeormEntity,
  LessonQuizTypeormEntity,
  UserSoundSettingsTypeormEntity,
  UserLessonStepStatusTypeormEntity,
  UserLessonHintStatusTypeormEntity,
  UserAccessTokenTypeormEntity,
  UserLessonStatusTypeormEntity,
  LessonHintTypeormEntity,
  DistrictTypeormEntity,
  AdministratorTypeormEntity,
  AdministratorDistrictTypeormEntity,
  LmsTypeormEntity,
  StudentGroupTypeormEntity,
  OrganizationTypeormEntity,
  TeacherTypeormEntity,
  TeacherOrganizationTypeormEntity,
  StudentTypeormEntity,
  StudentGroupStudentTypeormEntity,
  UnaccessibleLessonTypeormEntity,
  UserLessonStatusHistoryTypeormEntity,
  RosterSyncEventLogsTypeormEntity,
  DistrictPurchasedPackageTypeormEntity,
  UserLessonQuizAnswerStatusTypeormEntity,
  StudentGroupPackageAssignmentTypeormEntity,
  UserResetPasswordRequestTypeormEntity,
  DistrictRosterSyncStatusTypeormEntity,
  UserPackageAssignmentTypeormEntity,
  UserLessonQuizStatusTypeormEntity,
  UserExternalChurnZeroMappingTypeormEntity,
]

export const createAppDataSource = (env: {
  POSTGRES_DATABASE_DIALECT: DatabaseType
  POSTGRES_DATABASE_HOST: string
  POSTGRES_DATABASE_PORT: number
  POSTGRES_DATABASE_USERNAME: string
  POSTGRES_DATABASE_PASSWORD: string
  POSTGRES_DATABASE_NAME: string
  ROOT_FOLDER_PATH: string
}) => {
  return new DataSource({
    type: env.POSTGRES_DATABASE_DIALECT as 'postgres',
    host: env.POSTGRES_DATABASE_HOST,
    port: env.POSTGRES_DATABASE_PORT,
    username: env.POSTGRES_DATABASE_USERNAME,
    password: env.POSTGRES_DATABASE_PASSWORD,
    database: env.POSTGRES_DATABASE_NAME,
    migrationsRun: true,
    synchronize: false,
    logging: false,
    entities: TypeormEntities,
    migrations: [
      path.join(env.ROOT_FOLDER_PATH, 'src/adapter/typeorm/migration/*.js'),
    ],
    subscribers: [],
    connectTimeoutMS: 8000,
  })
}
