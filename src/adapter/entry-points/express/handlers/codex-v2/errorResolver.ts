import { Error, ErrorCode } from './_gen/resolvers-type'

const errorableResolver = (dataTypename: string) => (data: Error) => {
  if (data && data.errorCode) {
    switch (data.errorCode) {
      case ErrorCode.PermissionDenied:
        return 'ErrorPermissionDenied'
      case ErrorCode.UnknownRuntimeError:
      default:
        return 'ErrorUnknownRuntime'
    }
  } else {
    return dataTypename
  }
}

const resolvers = {
  UsersResult: {
    __resolveType: errorableResolver('Users'),
  },
  CreateUserPayloadResult: {
    __resolveType: errorableResolver('CreateUserPayload'),
  },
  UpdateUserPayloadResult: {
    __resolveType: errorableResolver('UpdateUserPayload'),
  },
  HumanUsersResult: {
    __resolveType: errorableResolver('HumanUsers'),
  },
  CreateHumanUserPayloadResult: {
    __resolveType: errorableResolver('CreateHumanUserPayload'),
  },
  UpdateHumanUserPayloadResult: {
    __resolveType: errorableResolver('UpdateHumanUserPayload'),
  },
  DistrictsResult: {
    __resolveType: errorableResolver('Districts'),
  },
  CreateDistrictPayloadResult: {
    __resolveType: errorableResolver('CreateDistrictPayload'),
  },
  UpdateDistrictPayloadResult: {
    __resolveType: errorableResolver('UpdateDistrictPayload'),
  },
  CreateDistrictPurchasedPackagePayloadResult: {
    __resolveType: errorableResolver('CreateDistrictPurchasedPackagePayload'),
  },
  DeleteDistrictPurchasedPackagePayloadResult: {
    __resolveType: errorableResolver('DeleteDistrictPurchasedPackagePayload'),
  },
  CreateClasslinkTenantCredentialPayloadResult: {
    __resolveType: errorableResolver('CreateClasslinkTenantCredentialPayload'),
  },
  UpdateClasslinkTenantCredentialPayloadResult: {
    __resolveType: errorableResolver('UpdateClasslinkTenantCredentialPayload'),
  },
  StudentGroupPackageAssignmentsResult: {
    __resolveType: errorableResolver('StudentGroupPackageAssignments'),
  },
  CreateStudentGroupPackageAssignmentPayloadResult: {
    __resolveType: errorableResolver(
      'CreateStudentGroupPackageAssignmentPayload',
    ),
  },
  DeleteStudentGroupPackageAssignmentPayloadResult: {
    __resolveType: errorableResolver(
      'DeleteStudentGroupPackageAssignmentPayload',
    ),
  },
  OrganizationsResult: {
    __resolveType: errorableResolver('Organizations'),
  },
  CreateOrganizationPayloadResult: {
    __resolveType: errorableResolver('CreateOrganizationPayload'),
  },
  UpdateOrganizationPayloadResult: {
    __resolveType: errorableResolver('UpdateOrganizationPayload'),
  },
  AdministratorsResult: {
    __resolveType: errorableResolver('Administrators'),
  },
  CreateAdministratorPayloadResult: {
    __resolveType: errorableResolver('CreateAdministratorPayload'),
  },
  UpdateAdministratorPayloadResult: {
    __resolveType: errorableResolver('UpdateAdministratorPayload'),
  },
  StudentsResult: {
    __resolveType: errorableResolver('Students'),
  },
  CreateStudentPayloadResult: {
    __resolveType: errorableResolver('CreateStudentPayload'),
  },
  UpdateStudentPayloadResult: {
    __resolveType: errorableResolver('UpdateStudentPayload'),
  },
  TeachersResult: {
    __resolveType: errorableResolver('Teachers'),
  },
  CreateTeacherPayloadResult: {
    __resolveType: errorableResolver('CreateTeacherPayload'),
  },
  UpdateTeacherPayloadResult: {
    __resolveType: errorableResolver('UpdateTeacherPayload'),
  },
  TeacherOrganizationAffiliationsResult: {
    __resolveType: errorableResolver('TeacherOrganizationAffiliations'),
  },
  CreateTeacherOrganizationAffiliationPayloadResult: {
    __resolveType: errorableResolver(
      'CreateTeacherOrganizationAffiliationPayload',
    ),
  },
  DeleteTeacherOrganizationAffiliationPayloadResult: {
    __resolveType: errorableResolver(
      'DeleteTeacherOrganizationAffiliationPayload',
    ),
  },
  StudentGroupsResult: {
    __resolveType: errorableResolver('StudentGroups'),
  },
  CreateStudentGroupPayloadResult: {
    __resolveType: errorableResolver('CreateStudentGroupPayload'),
  },
  UpdateStudentGroupPayloadResult: {
    __resolveType: errorableResolver('UpdateStudentGroupPayload'),
  },
  StudentStudentGroupAffiliationsResult: {
    __resolveType: errorableResolver('StudentStudentGroupAffiliations'),
  },
  CreateStudentStudentGroupAffiliationPayloadResult: {
    __resolveType: errorableResolver(
      'CreateStudentStudentGroupAffiliationPayload',
    ),
  },
  DeleteStudentStudentGroupAffiliationPayloadResult: {
    __resolveType: errorableResolver(
      'DeleteStudentStudentGroupAffiliationPayload',
    ),
  },
  DistrictRosterSyncStatusesResult: {
    __resolveType: errorableResolver('DistrictRosterSyncStatuses'),
  },
  LessonStepsResult: {
    __resolveType: errorableResolver('LessonSteps'),
  },
  LessonQuizzesResult: {
    __resolveType: errorableResolver('LessonQuizzes'),
  },
  LessonHintsResult: {
    __resolveType: errorableResolver('LessonHints'),
  },
  UserLessonHintStatusesResult: {
    __resolveType: errorableResolver('UserLessonHintStatuses'),
  },
  LessonsResult: {
    __resolveType: errorableResolver('Lessons'),
  },
  UserLessonStepStatusesResult: {
    __resolveType: errorableResolver('UserLessonStepStatuses'),
  },
  CodeillusionPackageChapterDefinitionsResult: {
    __resolveType: errorableResolver('CodeillusionPackageChapterDefinitions'),
  },
  CodeillusionPackageCircleDefinitionsResult: {
    __resolveType: errorableResolver('CodeillusionPackageCircleDefinitions'),
  },
  CodeillusionPackageLessonDefinitionsResult: {
    __resolveType: errorableResolver('CodeillusionPackageLessonDefinitions'),
  },
  CsePackageUnitDefinitionsResult: {
    __resolveType: errorableResolver('CsePackageUnitDefinitions'),
  },
  CsePackageLessonDefinitionsResult: {
    __resolveType: errorableResolver('CsePackageLessonDefinitions'),
  },
  UserExternalChurnZeroMappingResult: {
    __resolveType: errorableResolver('UserExternalChurnZeroMapping'),
  },
  CreateUserExternalChurnZeroMappingPayloadResult: {
    __resolveType: errorableResolver(
      'CreateUserExternalChurnZeroMappingPayload',
    ),
  },
  UpdateUserExternalChurnZeroMappingPayloadResult: {
    __resolveType: errorableResolver(
      'UpdateUserExternalChurnZeroMappingPayload',
    ),
  },
  CurriculumPackageLessonConfigurationsResult: {
    __resolveType: errorableResolver('CurriculumPackageLessonConfigurations'),
  },
  CurriculumBrandsResult: {
    __resolveType: errorableResolver('CurriculumBrands'),
  },
  CurriculumPackagesResult: {
    __resolveType: errorableResolver('CurriculumPackages'),
  },
}

export default resolvers
