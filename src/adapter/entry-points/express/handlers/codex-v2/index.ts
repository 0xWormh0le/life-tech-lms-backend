import path from 'path'
import { readFileSync } from 'fs'
import { graphqlHTTP } from 'express-graphql'
import { DataSource } from 'typeorm'
import { makeExecutableSchema } from 'graphql-tools'
import { DistrictPurchasedPackageResolver } from './DistrictPurchasedPackageResolver'
import { DistrictResolver } from './DistrictResolver'
import { AdministratorResolver } from './AdministratorResolver'
import { ClasslinkTenantCredentialResolver } from './ClasslinkTenantCredentialResolver'
import { OrganizationResolver } from './OrganizationResolver'
import { StudentResolver } from './StudentResolver'
import { StudentGroupResolver } from './StudentGroupResolver'
import { TeacherResolver } from './TeacherResolver'
import { LessonStepResolver } from './LessonStepResolver'
import { DistrictRosterSyncStatusResolver } from './DistrictRosterSyncStatusResolver'
import { StudentGroupPackageAssignmentResolver } from './StudentGroupPackageAssignmentResolver'
import { TeacherOrganizationAffiliationResolver } from './TeacherOrganizationAffiliationResolver'
import { StudentGroupStudentAffiliationResolver } from './StudentGroupStudentAffiliationResolver'
import { LessonQuizResolver } from './LessonQuizResolver'
import { LessonHintResolver } from './LessonHintResolver'
import { UserLessonHintStatusResolver } from './UserLessonHintStatusResolver'
import { LessonResolver } from './LessonResolver'
import { UserLessonStepStatusResolver } from './UserLessonStepStatusResolver'
import { IncomingMessage } from 'http'
import { findUserByAuthorizationHeader } from './_shared/findUserByAuthorizationHeader'
import { GraphqlError, valueOrThrowErr } from './utilities'
import { User } from '../../../../../domain/entities/codex-v2/User'
import {
  Maybe,
  ResolversTypes,
  Resolver,
  ErrorCode,
} from './_gen/resolvers-type'
import { GraphQLResolveInfo } from 'graphql'
import { UserResolver } from './UserResolver'
import { HumanUserResolver } from './HumanUserResolver'
import { IExecutableSchemaDefinition } from '@graphql-tools/schema/typings/index'
import errorResolver from './errorResolver'
import { UserExternalChurnZeroMappingResolver } from './UserExternalChurnZeroMappingResolver'
import { CodeillusionPackageChapterDefinitionResolver } from './CodeillusionPackageChapterDefinitionResolver'
import { CodeillusionPackageCircleDefinitionResolver } from './CodeillusionPackageCircleDefinitionResolver'
import { CodeillusionPackageLessonDefinitionResolver } from './CodeillusionPackageLessonDefinitionResolver'
import { CsePackageLessonDefinitionResolver } from './CsePackageLessonDefinitionResolver'
import { CsePackageUnitDefinitionResolver } from './CsePackageUnitDefinitionResolver'
import { CurriculumPackageLessonConfigurationResolver } from './CurriculumPackageLessonConfigurationResolver'
import { CurriculumBrandResolver } from './CurriculumBrandResolver'
import { CurriculumPackageResolver } from './CurriculumPackageResolver'

export type ResolverWithAuthenticatedUser<
  TArg = ResolversTypes[keyof ResolversTypes],
  TResult = Maybe<object>,
  TParent = ResolversTypes[keyof ResolversTypes],
> = (
  authenticatedUser: User,
  parent: TParent,
  args: TArg,
  context: IncomingMessage,
  info: GraphQLResolveInfo,
) => Promise<TResult>

export type QueryResult<TItem> = {
  items: TItem[]
  count: number
}

export type GraphQLResponse<TKey extends string, TData extends object> = {
  data: {
    [key in TKey]: {
      __typename: string
      errorCode?: string
      message?: string
    } & TData
  }
}

const typeDefs = readFileSync(
  path.resolve(__dirname, './schema.graphql'),
  'utf8',
)

export const codexV2Server = (
  appDataSource: DataSource,
  staticFilesBaseUrl: string,
  lessonPlayerBaseUrl: string,
) => {
  const userResolver = new UserResolver(appDataSource)
  const humanUserResolver = new HumanUserResolver(appDataSource)
  const districtResolver = new DistrictResolver(appDataSource)
  const administratorHandler = new AdministratorResolver(appDataSource)
  const districtPurchasedPackageHandler = new DistrictPurchasedPackageResolver(
    appDataSource,
  )
  const classlinkTenantCredentialHandler =
    new ClasslinkTenantCredentialResolver(appDataSource)
  const studentHandler = new StudentResolver(appDataSource)
  const studentGroupPackageAssignmentHandler =
    new StudentGroupPackageAssignmentResolver(appDataSource)
  const organizationResolver = new OrganizationResolver(appDataSource)
  const studentGroupResolver = new StudentGroupResolver(appDataSource)
  const teacherResolver = new TeacherResolver(appDataSource)
  const teacherOrganizationAffiliationResolver =
    new TeacherOrganizationAffiliationResolver(appDataSource)
  const studentGroupStudentAffiliationResolver =
    new StudentGroupStudentAffiliationResolver(appDataSource)
  const districtRosterSyncStatusResolver = new DistrictRosterSyncStatusResolver(
    appDataSource,
  )
  const lessonStepResolver = new LessonStepResolver(appDataSource)
  const lessonQuizResolver = new LessonQuizResolver(appDataSource)
  const lessonHintResolver = new LessonHintResolver(appDataSource)
  const userLessonHintStatusResolver = new UserLessonHintStatusResolver(
    appDataSource,
  )
  const userExternalChurnZeroMappingResolver =
    new UserExternalChurnZeroMappingResolver(appDataSource)
  const lessonResolver = new LessonResolver(
    staticFilesBaseUrl,
    lessonPlayerBaseUrl,
  )
  const userLessonStepStatusResolver = new UserLessonStepStatusResolver(
    appDataSource,
  )
  const codeillusionPackageChapterDefinitionResolver =
    new CodeillusionPackageChapterDefinitionResolver(staticFilesBaseUrl)
  const codeillusionPackageCircleDefinitionResolver =
    new CodeillusionPackageCircleDefinitionResolver(staticFilesBaseUrl)
  const codeillusionPackageLessonDefinitionResolver =
    new CodeillusionPackageLessonDefinitionResolver()
  const csePackageLessonDefinitionResolver =
    new CsePackageLessonDefinitionResolver()
  const csePackageUnitDefinitionResolver = new CsePackageUnitDefinitionResolver(
    staticFilesBaseUrl,
  )
  const curriculumPackageLessonConfigurationResolver =
    new CurriculumPackageLessonConfigurationResolver()
  const curriculumBrandResolver = new CurriculumBrandResolver()
  const curriculumPackageResolver = new CurriculumPackageResolver()

  const resolvers = {
    Query: {
      users: userResolver.query,
      humanUsers: humanUserResolver.query,
      districts: districtResolver.query,
      organizations: organizationResolver.query,
      administrators: administratorHandler.query,
      students: studentHandler.query,
      teachers: teacherResolver.query,
      teacherOrganizationAffiliations:
        teacherOrganizationAffiliationResolver.query,
      studentGroups: studentGroupResolver.query,
      studentGroupPackageAssignments:
        studentGroupPackageAssignmentHandler.query,
      studentStudentGroupAffiliations:
        studentGroupStudentAffiliationResolver.query,
      districtRosterSyncStatuses: districtRosterSyncStatusResolver.query,
      lessonSteps: lessonStepResolver.query,
      lessonQuizzes: lessonQuizResolver.query,
      lessonHints: lessonHintResolver.query,
      userLessonHintStatuses: userLessonHintStatusResolver.query,
      userExternalChurnZeroMapping:
        userExternalChurnZeroMappingResolver.queryOne,
      lessons: lessonResolver.query,
      userLessonStepStatuses: userLessonStepStatusResolver.query,
      codeillusionPackageChapterDefinitions:
        codeillusionPackageChapterDefinitionResolver.query,
      codeillusionPackageCircleDefinitions:
        codeillusionPackageCircleDefinitionResolver.query,
      codeillusionPackageLessonDefinitions:
        codeillusionPackageLessonDefinitionResolver.query,
      csePackageLessonDefinitions: csePackageLessonDefinitionResolver.query,
      csePackageUnitDefinitions: csePackageUnitDefinitionResolver.query,
      curriculumPackageLessonConfigurations:
        curriculumPackageLessonConfigurationResolver.query,
      curriculumBrands: curriculumBrandResolver.query,
      curriculumPackages: curriculumPackageResolver.query,
    },
    Mutation: {
      createUser: userResolver.create,
      updateUser: userResolver.update,
      createHumanUser: humanUserResolver.create,
      updateHumanUser: humanUserResolver.update,
      createDistrict: districtResolver.create,
      updateDistrict: districtResolver.update,
      createAdministrator: administratorHandler.create,
      updateAdministrator: administratorHandler.update,
      createStudent: studentHandler.create,
      updateStudent: studentHandler.update,
      createTeacher: teacherResolver.create,
      updateTeacher: teacherResolver.update,
      createOrganization: organizationResolver.create,
      updateOrganization: organizationResolver.update,
      createStudentGroup: studentGroupResolver.create,
      updateStudentGroup: studentGroupResolver.update,
      createDistrictPurchasedPackage: districtPurchasedPackageHandler.create,
      deleteDistrictPurchasedPackage: districtPurchasedPackageHandler.delete,
      createClasslinkTenantCredential: classlinkTenantCredentialHandler.create,
      updateClasslinkTenantCredential: classlinkTenantCredentialHandler.update,
      createStudentGroupPackageAssignment:
        studentGroupPackageAssignmentHandler.create,
      deleteStudentGroupPackageAssignment:
        studentGroupPackageAssignmentHandler.delete,
      createTeacherOrganizationAffiliation:
        teacherOrganizationAffiliationResolver.create,
      deleteTeacherOrganizationAffiliation:
        teacherOrganizationAffiliationResolver.delete,
      createStudentStudentGroupAffiliation:
        studentGroupStudentAffiliationResolver.create,
      deleteStudentStudentGroupAffiliation:
        studentGroupStudentAffiliationResolver.delete,
      createUserExternalChurnZeroMapping:
        userExternalChurnZeroMappingResolver.create,
      updateUserExternalChurnZeroMapping:
        userExternalChurnZeroMappingResolver.update,
    },
    District: {
      districtPurchasedPackages:
        districtPurchasedPackageHandler.getDistrictPurchasedPackages,
      classlinkTenantCredential:
        classlinkTenantCredentialHandler.getClasslinkTenantCredentialByDistrictIdFromDistrict,
    },
    Administrator: {
      humanUser: humanUserResolver.getHumanUserByUserId,
    },
    Teacher: {
      humanUser: humanUserResolver.getHumanUserByUserId,
    },
    Student: {
      humanUser: humanUserResolver.getHumanUserByUserId,
    },
    CodeillusionPackageCircleDefinition: {
      codeillusionPackageLessonDefinitions:
        codeillusionPackageLessonDefinitionResolver.query,
    },
    CsePackageUnitDefinition: {
      csePackageLessonDefinitions: csePackageLessonDefinitionResolver.query,
    },
    CodeillusionPackageChapterDefinition: {
      codeillusionPackageCircleDefinitions:
        codeillusionPackageCircleDefinitionResolver.query,
    },
    HumanUser: {
      user: userResolver.getUserById,
    },
  }

  const transformResolvers = (
    resolvers: Record<string, ResolverWithAuthenticatedUser>,
  ) =>
    Object.keys(resolvers).reduce<
      Record<string, Resolver<object, object, IncomingMessage>>
    >(
      (acc, key) => ({
        ...acc,
        [key]: async (parent, args, context, info) => {
          const authenticatedUserRes = await findUserByAuthorizationHeader(
            context.headers.authorization,
            appDataSource,
          )

          try {
            const authenticatedUser = valueOrThrowErr(authenticatedUserRes)
            const resolverWithAuthenticatedUser = resolvers[key]

            return await resolverWithAuthenticatedUser(
              authenticatedUser,
              parent,
              args,
              context,
              info,
            )
          } catch (e) {
            if (e instanceof GraphqlError) {
              return {
                errorCode: e.errorCode,
                message: e.message,
                stack: e.stack,
              }
            } else {
              return {
                errorCode: ErrorCode.UnknownRuntimeError,
                message:
                  e instanceof Error
                    ? e.message
                    : typeof e === 'string'
                    ? e
                    : JSON.stringify(e),
              }
            }
          }
        },
      }),
      {},
    )

  type ArrayType<T> = T[]
  type NonArrayType<T> = T extends ArrayType<unknown> ? never : T
  type Resolvers = NonArrayType<
    NonNullable<IExecutableSchemaDefinition['resolvers']>
  >

  const transformedResolvers: {
    [P in keyof typeof resolvers]: Resolvers extends Record<string, infer X>
      ? X
      : never
  } = {
    ...errorResolver,
    Query: {
      hc: () => 'ok',
      ...transformResolvers(resolvers.Query),
    },
    Mutation: transformResolvers(resolvers.Mutation),
    District: transformResolvers(resolvers.District),
    Administrator: transformResolvers(resolvers.Administrator),
    Teacher: transformResolvers(resolvers.Teacher),
    Student: transformResolvers(resolvers.Student),
    CodeillusionPackageCircleDefinition: transformResolvers(
      resolvers.CodeillusionPackageCircleDefinition,
    ),
    CsePackageUnitDefinition: transformResolvers(
      resolvers.CsePackageUnitDefinition,
    ),
    CodeillusionPackageChapterDefinition: transformResolvers(
      resolvers.CodeillusionPackageChapterDefinition,
    ),
    HumanUser: transformResolvers(resolvers.HumanUser),
  }
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: transformedResolvers,
  })

  return graphqlHTTP({
    schema,
    graphiql: true,
  })
}
