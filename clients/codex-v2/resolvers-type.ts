import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Administrator = {
  __typename?: 'Administrator';
  createdAt: Scalars['String'];
  createdUserId?: Maybe<Scalars['String']>;
  districtId: Scalars['String'];
  externalLmsAdministratorId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  humanUser: HumanUser;
  id: Scalars['ID'];
  isDeactivated: Scalars['Boolean'];
  lastName: Scalars['String'];
  role: Scalars['String'];
  userId: Scalars['String'];
};

export type Administrators = {
  __typename?: 'Administrators';
  count: Scalars['Int'];
  items: Array<Administrator>;
};

export type AdministratorsResult = Administrators | ErrorPermissionDenied | ErrorUnknownRuntime;

export type ClasslinkTenantCredential = {
  __typename?: 'ClasslinkTenantCredential';
  accessToken: Scalars['String'];
  districtId: Scalars['ID'];
  externalLmsAppId: Scalars['String'];
  externalLmsTenantId: Scalars['String'];
};

export type CodeillusionPackageChapterDefinition = {
  __typename?: 'CodeillusionPackageChapterDefinition';
  codeillusionPackageCircleDefinitions?: Maybe<CodeillusionPackageCircleDefinitions>;
  id: Scalars['ID'];
  lessonNoteSheetsZipUrl: Scalars['String'];
  lessonOverViewPdfUrl: Scalars['String'];
  name: Scalars['String'];
  title: Scalars['String'];
};

export type CodeillusionPackageChapterDefinitions = {
  __typename?: 'CodeillusionPackageChapterDefinitions';
  count: Scalars['Int'];
  items: Array<CodeillusionPackageChapterDefinition>;
};

export type CodeillusionPackageChapterDefinitionsResult = CodeillusionPackageChapterDefinitions | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CodeillusionPackageCircleDefinition = {
  __typename?: 'CodeillusionPackageCircleDefinition';
  bookImageUrl: Scalars['String'];
  bookName: Scalars['String'];
  characterImageUrl: Scalars['String'];
  clearedCharacterImageUrl: Scalars['String'];
  codeillusionPackageChapterDefinitionId: Scalars['String'];
  codeillusionPackageLessonDefinitions?: Maybe<CodeillusionPackageLessonDefinitions>;
  course: LessonCourse;
  id: Scalars['ID'];
};

export type CodeillusionPackageCircleDefinitions = {
  __typename?: 'CodeillusionPackageCircleDefinitions';
  count: Scalars['Int'];
  items: Array<CodeillusionPackageCircleDefinition>;
};

export type CodeillusionPackageCircleDefinitionsResult = CodeillusionPackageCircleDefinitions | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CodeillusionPackageLessonDefinition = {
  __typename?: 'CodeillusionPackageLessonDefinition';
  codeillusionPackageCircleDefinitionId: Scalars['String'];
  lessonId: Scalars['String'];
  uiType: CodeillusionPackageLessonDefinitionUiType;
};

export enum CodeillusionPackageLessonDefinitionUiType {
  Book = 'BOOK',
  Gem = 'GEM',
  MagicJourney = 'MAGIC_JOURNEY',
  MagicQuest = 'MAGIC_QUEST'
}

export type CodeillusionPackageLessonDefinitions = {
  __typename?: 'CodeillusionPackageLessonDefinitions';
  count: Scalars['Int'];
  items: Array<CodeillusionPackageLessonDefinition>;
};

export type CodeillusionPackageLessonDefinitionsResult = CodeillusionPackageLessonDefinitions | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateAdministratorInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  districtId: Scalars['String'];
  externalLmsAdministratorId?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  isDeactivated: Scalars['Boolean'];
  lastName: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateAdministratorPayload = {
  __typename?: 'CreateAdministratorPayload';
  administrator: Administrator;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateAdministratorPayloadResult = CreateAdministratorPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateClasslinkTenantCredentialInput = {
  accessToken: Scalars['String'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  districtId: Scalars['ID'];
  externalLmsAppId: Scalars['String'];
  externalLmsTenantId: Scalars['String'];
};

export type CreateClasslinkTenantCredentialPayload = {
  __typename?: 'CreateClasslinkTenantCredentialPayload';
  classlinkTenantCredential: ClasslinkTenantCredential;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateClasslinkTenantCredentialPayloadResult = CreateClasslinkTenantCredentialPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateDistrictInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  enableRosterSync: Scalars['Boolean'];
  externalLmsDistrictId?: InputMaybe<Scalars['String']>;
  lmsId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  stateId: Scalars['String'];
};

export type CreateDistrictPayload = {
  __typename?: 'CreateDistrictPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  district: District;
};

export type CreateDistrictPayloadResult = CreateDistrictPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateDistrictPurchasedPackageInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  curriculumPackageId: Scalars['String'];
  districtId: Scalars['String'];
};

export type CreateDistrictPurchasedPackagePayload = {
  __typename?: 'CreateDistrictPurchasedPackagePayload';
  clientMutationId?: Maybe<Scalars['String']>;
  districtPurchasedPackage: DistrictPurchasedPackage;
};

export type CreateDistrictPurchasedPackagePayloadResult = CreateDistrictPurchasedPackagePayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateHumanUserInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  loginId?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};

export type CreateHumanUserPayload = {
  __typename?: 'CreateHumanUserPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  humanUser: HumanUser;
};

export type CreateHumanUserPayloadResult = CreateHumanUserPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateOrganizationInput = {
  classlinkTenantId?: InputMaybe<Scalars['String']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  districtId: Scalars['String'];
  externalLmsOrganizationId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateOrganizationPayload = {
  __typename?: 'CreateOrganizationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  organization: Organization;
};

export type CreateOrganizationPayloadResult = CreateOrganizationPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateStudentGroupInput = {
  classlinkTenantId?: InputMaybe<Scalars['String']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalLmsStudentGroupId?: InputMaybe<Scalars['String']>;
  grade?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  organizationId: Scalars['String'];
};

export type CreateStudentGroupPackageAssignmentInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  curriculumPackageId: Scalars['String'];
  studentGroupId: Scalars['String'];
};

export type CreateStudentGroupPackageAssignmentPayload = {
  __typename?: 'CreateStudentGroupPackageAssignmentPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  studentGroupPackageAssignment: StudentGroupPackageAssignment;
};

export type CreateStudentGroupPackageAssignmentPayloadResult = CreateStudentGroupPackageAssignmentPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateStudentGroupPayload = {
  __typename?: 'CreateStudentGroupPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  studentGroup: StudentGroup;
};

export type CreateStudentGroupPayloadResult = CreateStudentGroupPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateStudentInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalLmsStudentId?: InputMaybe<Scalars['String']>;
  isDeactivated?: InputMaybe<Scalars['Boolean']>;
  nickName: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateStudentPayload = {
  __typename?: 'CreateStudentPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  student: Student;
};

export type CreateStudentPayloadResult = CreateStudentPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateStudentStudentGroupAffiliationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  studentGroupId: Scalars['String'];
  studentId: Scalars['String'];
};

export type CreateStudentStudentGroupAffiliationPayload = {
  __typename?: 'CreateStudentStudentGroupAffiliationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  studentStudentGroupAffiliation: StudentStudentGroupAffiliation;
};

export type CreateStudentStudentGroupAffiliationPayloadResult = CreateStudentStudentGroupAffiliationPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateTeacherInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalLmsTeacherId?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  isDeactivated: Scalars['Boolean'];
  lastName: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateTeacherOrganizationAffiliationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  organizationId: Scalars['String'];
  teacherId: Scalars['String'];
};

export type CreateTeacherOrganizationAffiliationPayload = {
  __typename?: 'CreateTeacherOrganizationAffiliationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  teacherOrganizationAffiliation: TeacherOrganizationAffiliation;
};

export type CreateTeacherOrganizationAffiliationPayloadResult = CreateTeacherOrganizationAffiliationPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateTeacherPayload = {
  __typename?: 'CreateTeacherPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  teacher: Teacher;
};

export type CreateTeacherPayloadResult = CreateTeacherPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateUserExternalChurnZeroMappingInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalChurnZeroAccountExternalId: Scalars['String'];
  externalChurnZeroContactExternalId: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateUserExternalChurnZeroMappingPayload = {
  __typename?: 'CreateUserExternalChurnZeroMappingPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  userExternalChurnZeroMapping: UserExternalChurnZeroMapping;
};

export type CreateUserExternalChurnZeroMappingPayloadResult = CreateUserExternalChurnZeroMappingPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CreateUserInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  isDemo: Scalars['Boolean'];
  role: Scalars['String'];
};

export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  user: User;
};

export type CreateUserPayloadResult = CreateUserPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CsePackageLessonDefinition = {
  __typename?: 'CsePackageLessonDefinition';
  csePackageUnitDefinitionId: Scalars['String'];
  isQuizLesson?: Maybe<Scalars['Boolean']>;
  lessonId: Scalars['String'];
};

export type CsePackageLessonDefinitions = {
  __typename?: 'CsePackageLessonDefinitions';
  count: Scalars['Int'];
  items: Array<CsePackageLessonDefinition>;
};

export type CsePackageLessonDefinitionsResult = CsePackageLessonDefinitions | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CsePackageUnitDefinition = {
  __typename?: 'CsePackageUnitDefinition';
  csePackageLessonDefinitions?: Maybe<CsePackageLessonDefinitions>;
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CsePackageUnitDefinitions = {
  __typename?: 'CsePackageUnitDefinitions';
  count: Scalars['Int'];
  items: Array<CsePackageUnitDefinition>;
};

export type CsePackageUnitDefinitionsResult = CsePackageUnitDefinitions | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CurriculumBrand = {
  __typename?: 'CurriculumBrand';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CurriculumBrands = {
  __typename?: 'CurriculumBrands';
  count: Scalars['Int'];
  items: Array<CurriculumBrand>;
};

export type CurriculumBrandsResult = CurriculumBrands | ErrorPermissionDenied | ErrorUnknownRuntime;

export type CurriculumPackage = {
  __typename?: 'CurriculumPackage';
  curriculumBrandId: Scalars['String'];
  id: Scalars['ID'];
  level: CurriculumPackageLevel;
  name: Scalars['String'];
};

export type CurriculumPackageLessonConfiguration = {
  __typename?: 'CurriculumPackageLessonConfiguration';
  curriculumPackageId: Scalars['String'];
  lessonId: Scalars['String'];
};

export type CurriculumPackageLessonConfigurations = {
  __typename?: 'CurriculumPackageLessonConfigurations';
  count: Scalars['Int'];
  items: Array<CurriculumPackageLessonConfiguration>;
};

export type CurriculumPackageLessonConfigurationsResult = CurriculumPackageLessonConfigurations | ErrorPermissionDenied | ErrorUnknownRuntime;

export enum CurriculumPackageLevel {
  Advanced = 'ADVANCED',
  Basic = 'BASIC'
}

export type CurriculumPackages = {
  __typename?: 'CurriculumPackages';
  count: Scalars['Int'];
  items: Array<CurriculumPackage>;
};

export type CurriculumPackagesResult = CurriculumPackages | ErrorPermissionDenied | ErrorUnknownRuntime;

export type DeleteDistrictPurchasedPackageInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeleteDistrictPurchasedPackagePayload = {
  __typename?: 'DeleteDistrictPurchasedPackagePayload';
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeleteDistrictPurchasedPackagePayloadResult = DeleteDistrictPurchasedPackagePayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type DeleteStudentGroupPackageAssignmentInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeleteStudentGroupPackageAssignmentPayload = {
  __typename?: 'DeleteStudentGroupPackageAssignmentPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeleteStudentGroupPackageAssignmentPayloadResult = DeleteStudentGroupPackageAssignmentPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type DeleteStudentStudentGroupAffiliationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeleteStudentStudentGroupAffiliationPayload = {
  __typename?: 'DeleteStudentStudentGroupAffiliationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeleteStudentStudentGroupAffiliationPayloadResult = DeleteStudentStudentGroupAffiliationPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type DeleteTeacherOrganizationAffiliationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeleteTeacherOrganizationAffiliationPayload = {
  __typename?: 'DeleteTeacherOrganizationAffiliationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeleteTeacherOrganizationAffiliationPayloadResult = DeleteTeacherOrganizationAffiliationPayload | ErrorPermissionDenied | ErrorUnknownRuntime;

export type District = {
  __typename?: 'District';
  classlinkTenantCredential?: Maybe<ClasslinkTenantCredential>;
  createdAt: Scalars['String'];
  createdUserId?: Maybe<Scalars['String']>;
  districtPurchasedPackages: Array<DistrictPurchasedPackage>;
  enableRosterSync: Scalars['Boolean'];
  externalLmsDistrictId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lmsId?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  stateId: Scalars['String'];
};

export type DistrictPurchasedPackage = {
  __typename?: 'DistrictPurchasedPackage';
  createdAt: Scalars['String'];
  createdUserId?: Maybe<Scalars['String']>;
  curriculumPackageId: Scalars['String'];
  districtId: Scalars['String'];
  id: Scalars['ID'];
};

export type DistrictRosterSyncStatus = {
  __typename?: 'DistrictRosterSyncStatus';
  districtId: Scalars['String'];
  errorMessage?: Maybe<Scalars['String']>;
  finishedAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  startedAt: Scalars['String'];
};

export type DistrictRosterSyncStatuses = {
  __typename?: 'DistrictRosterSyncStatuses';
  count: Scalars['Int'];
  items: Array<DistrictRosterSyncStatus>;
};

export type DistrictRosterSyncStatusesResult = DistrictRosterSyncStatuses | ErrorPermissionDenied | ErrorUnknownRuntime;

export type Districts = {
  __typename?: 'Districts';
  count: Scalars['Int'];
  items: Array<District>;
};

export type DistrictsResult = Districts | ErrorPermissionDenied | ErrorUnknownRuntime;

export type Error = {
  __typename?: 'Error';
  errorCode: ErrorCode;
  message?: Maybe<Scalars['String']>;
  stack?: Maybe<Scalars['String']>;
};

export enum ErrorCode {
  NotFoundError = 'NOT_FOUND_ERROR',
  PermissionDenied = 'PERMISSION_DENIED',
  UnknownRuntimeError = 'UNKNOWN_RUNTIME_ERROR'
}

export type ErrorNotFound = {
  __typename?: 'ErrorNotFound';
  errorCode: ErrorCode;
  message?: Maybe<Scalars['String']>;
  stack?: Maybe<Scalars['String']>;
};

export type ErrorPermissionDenied = {
  __typename?: 'ErrorPermissionDenied';
  errorCode: ErrorCode;
  message?: Maybe<Scalars['String']>;
  stack?: Maybe<Scalars['String']>;
};

export type ErrorUnknownRuntime = {
  __typename?: 'ErrorUnknownRuntime';
  errorCode: ErrorCode;
  message?: Maybe<Scalars['String']>;
  stack?: Maybe<Scalars['String']>;
};

export type HumanUser = {
  __typename?: 'HumanUser';
  email?: Maybe<Scalars['String']>;
  loginId?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  user: User;
  userId: Scalars['ID'];
};

export type HumanUsers = {
  __typename?: 'HumanUsers';
  count: Scalars['Int'];
  items: Array<HumanUser>;
};

export type HumanUsersResult = ErrorPermissionDenied | ErrorUnknownRuntime | HumanUsers;

export type Lesson = {
  __typename?: 'Lesson';
  course: Scalars['String'];
  description: Scalars['String'];
  hintCount?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  lessonDuration: Scalars['String'];
  lessonEnvironment: Scalars['String'];
  lessonOverViewPdfUrl: Scalars['String'];
  level: Scalars['String'];
  maxStarCount?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  projectName?: Maybe<Scalars['String']>;
  quizCount?: Maybe<Scalars['Int']>;
  scenarioName?: Maybe<Scalars['String']>;
  skillsLearnedInThisLesson: Scalars['String'];
  theme: Scalars['String'];
  thumbnailImageUrl: Scalars['String'];
  url: Scalars['String'];
};

export enum LessonCourse {
  Basic = 'BASIC',
  Empty = 'EMPTY',
  GameDevelopment = 'GAME_DEVELOPMENT',
  MediaArt = 'MEDIA_ART',
  WebDesign = 'WEB_DESIGN'
}

export type LessonHint = {
  __typename?: 'LessonHint';
  createdAt: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  label: Scalars['String'];
  lessonStepId: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type LessonHints = {
  __typename?: 'LessonHints';
  count: Scalars['Int'];
  items: Array<LessonHint>;
};

export type LessonHintsResult = ErrorPermissionDenied | ErrorUnknownRuntime | LessonHints;

export type LessonQuiz = {
  __typename?: 'LessonQuiz';
  createdAt: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  label: Scalars['String'];
  lessonStepId: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type LessonQuizzes = {
  __typename?: 'LessonQuizzes';
  count: Scalars['Int'];
  items: Array<LessonQuiz>;
};

export type LessonQuizzesResult = ErrorPermissionDenied | ErrorUnknownRuntime | LessonQuizzes;

export type LessonResult = ErrorNotFound | ErrorPermissionDenied | ErrorUnknownRuntime | Lesson;

export type LessonStep = {
  __typename?: 'LessonStep';
  createdAt: Scalars['String'];
  externalLessonPlayerStepId: Scalars['String'];
  id: Scalars['ID'];
  lessonId: Scalars['String'];
  orderIndex: Scalars['Int'];
};

export type LessonSteps = {
  __typename?: 'LessonSteps';
  count: Scalars['Int'];
  items: Array<LessonStep>;
};

export type LessonStepsResult = ErrorPermissionDenied | ErrorUnknownRuntime | LessonSteps;

export type Lessons = {
  __typename?: 'Lessons';
  count: Scalars['Int'];
  items: Array<Lesson>;
};

export type LessonsResult = ErrorPermissionDenied | ErrorUnknownRuntime | Lessons;

export type Mutation = {
  __typename?: 'Mutation';
  createAdministrator: CreateAdministratorPayloadResult;
  createClasslinkTenantCredential: CreateClasslinkTenantCredentialPayloadResult;
  createDistrict: CreateDistrictPayloadResult;
  createDistrictPurchasedPackage: CreateDistrictPurchasedPackagePayloadResult;
  createHumanUser: CreateHumanUserPayloadResult;
  createOrganization: CreateOrganizationPayloadResult;
  createStudent: CreateStudentPayloadResult;
  createStudentGroup?: Maybe<CreateStudentGroupPayloadResult>;
  createStudentGroupPackageAssignment: CreateStudentGroupPackageAssignmentPayloadResult;
  createStudentStudentGroupAffiliation: CreateStudentStudentGroupAffiliationPayloadResult;
  createTeacher: CreateTeacherPayloadResult;
  createTeacherOrganizationAffiliation: CreateTeacherOrganizationAffiliationPayloadResult;
  createUser: CreateUserPayloadResult;
  createUserExternalChurnZeroMapping: CreateUserExternalChurnZeroMappingPayloadResult;
  deleteDistrictPurchasedPackage: DeleteDistrictPurchasedPackagePayloadResult;
  deleteStudentGroupPackageAssignment: DeleteStudentGroupPackageAssignmentPayloadResult;
  deleteStudentStudentGroupAffiliation: DeleteStudentStudentGroupAffiliationPayloadResult;
  deleteTeacherOrganizationAffiliation: DeleteTeacherOrganizationAffiliationPayloadResult;
  updateAdministrator: UpdateAdministratorPayloadResult;
  updateClasslinkTenantCredential: UpdateClasslinkTenantCredentialPayloadResult;
  updateDistrict: UpdateDistrictPayloadResult;
  updateHumanUser: UpdateHumanUserPayloadResult;
  updateOrganization: UpdateOrganizationPayloadResult;
  updateStudent: UpdateStudentPayloadResult;
  updateStudentGroup?: Maybe<UpdateStudentGroupPayloadResult>;
  updateTeacher: UpdateTeacherPayloadResult;
  updateUser: UpdateUserPayloadResult;
  updateUserExternalChurnZeroMapping: UpdateUserExternalChurnZeroMappingPayloadResult;
};


export type MutationCreateAdministratorArgs = {
  input: CreateAdministratorInput;
};


export type MutationCreateClasslinkTenantCredentialArgs = {
  input: CreateClasslinkTenantCredentialInput;
};


export type MutationCreateDistrictArgs = {
  input: CreateDistrictInput;
};


export type MutationCreateDistrictPurchasedPackageArgs = {
  input: CreateDistrictPurchasedPackageInput;
};


export type MutationCreateHumanUserArgs = {
  input: CreateHumanUserInput;
};


export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationCreateStudentArgs = {
  input: CreateStudentInput;
};


export type MutationCreateStudentGroupArgs = {
  input: CreateStudentGroupInput;
};


export type MutationCreateStudentGroupPackageAssignmentArgs = {
  input: CreateStudentGroupPackageAssignmentInput;
};


export type MutationCreateStudentStudentGroupAffiliationArgs = {
  input: CreateStudentStudentGroupAffiliationInput;
};


export type MutationCreateTeacherArgs = {
  input: CreateTeacherInput;
};


export type MutationCreateTeacherOrganizationAffiliationArgs = {
  input: CreateTeacherOrganizationAffiliationInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateUserExternalChurnZeroMappingArgs = {
  input: CreateUserExternalChurnZeroMappingInput;
};


export type MutationDeleteDistrictPurchasedPackageArgs = {
  input: DeleteDistrictPurchasedPackageInput;
};


export type MutationDeleteStudentGroupPackageAssignmentArgs = {
  input: DeleteStudentGroupPackageAssignmentInput;
};


export type MutationDeleteStudentStudentGroupAffiliationArgs = {
  input: DeleteStudentStudentGroupAffiliationInput;
};


export type MutationDeleteTeacherOrganizationAffiliationArgs = {
  input: DeleteTeacherOrganizationAffiliationInput;
};


export type MutationUpdateAdministratorArgs = {
  input: UpdateAdministratorInput;
};


export type MutationUpdateClasslinkTenantCredentialArgs = {
  input: UpdateClasslinkTenantCredentialInput;
};


export type MutationUpdateDistrictArgs = {
  input: UpdateDistrictInput;
};


export type MutationUpdateHumanUserArgs = {
  input: UpdateHumanUserInput;
};


export type MutationUpdateOrganizationArgs = {
  input: UpdateOrganizationInput;
};


export type MutationUpdateStudentArgs = {
  input: UpdateStudentInput;
};


export type MutationUpdateStudentGroupArgs = {
  input: UpdateStudentGroupInput;
};


export type MutationUpdateTeacherArgs = {
  input: UpdateTeacherInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserExternalChurnZeroMappingArgs = {
  input: UpdateUserExternalChurnZeroMappingInput;
};

export type Organization = {
  __typename?: 'Organization';
  classlinkTenantId?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  districtId: Scalars['String'];
  externalLmsOrganizationId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Organizations = {
  __typename?: 'Organizations';
  count: Scalars['Int'];
  items: Array<Organization>;
};

export type OrganizationsResult = ErrorPermissionDenied | ErrorUnknownRuntime | Organizations;

export type Query = {
  __typename?: 'Query';
  administrators?: Maybe<AdministratorsResult>;
  codeillusionPackageChapterDefinitions: CodeillusionPackageChapterDefinitionsResult;
  codeillusionPackageCircleDefinitions: CodeillusionPackageCircleDefinitionsResult;
  codeillusionPackageLessonDefinitions: CodeillusionPackageLessonDefinitionsResult;
  csePackageLessonDefinitions: CsePackageLessonDefinitionsResult;
  csePackageUnitDefinitions: CsePackageUnitDefinitionsResult;
  curriculumBrands: CurriculumBrandsResult;
  curriculumPackageLessonConfigurations: CurriculumPackageLessonConfigurationsResult;
  curriculumPackages: CurriculumPackagesResult;
  districtRosterSyncStatuses?: Maybe<DistrictRosterSyncStatusesResult>;
  districts?: Maybe<DistrictsResult>;
  hc: Scalars['String'];
  humanUsers?: Maybe<HumanUsersResult>;
  lesson: LessonResult;
  lessonHints?: Maybe<LessonHintsResult>;
  lessonQuizzes?: Maybe<LessonQuizzesResult>;
  lessonSteps?: Maybe<LessonStepsResult>;
  lessons: LessonsResult;
  organizations?: Maybe<OrganizationsResult>;
  studentGroupPackageAssignments?: Maybe<StudentGroupPackageAssignmentsResult>;
  studentGroups?: Maybe<StudentGroupsResult>;
  studentStudentGroupAffiliations?: Maybe<StudentStudentGroupAffiliationsResult>;
  students?: Maybe<StudentsResult>;
  teacherOrganizationAffiliations?: Maybe<TeacherOrganizationAffiliationsResult>;
  teachers?: Maybe<TeachersResult>;
  userExternalChurnZeroMapping?: Maybe<UserExternalChurnZeroMappingResult>;
  userLessonHintStatuses?: Maybe<UserLessonHintStatusesResult>;
  userLessonStepStatuses?: Maybe<UserLessonStepStatusesResult>;
  users?: Maybe<UsersResult>;
};


export type QueryCodeillusionPackageCircleDefinitionsArgs = {
  codeillusionPackageChapterDefinitionId: Scalars['String'];
};


export type QueryCodeillusionPackageLessonDefinitionsArgs = {
  codeillusionPackageCircleDefinitionId: Scalars['String'];
};


export type QueryCsePackageLessonDefinitionsArgs = {
  csePackageUnitDefinitionId: Scalars['String'];
};


export type QueryCurriculumPackageLessonConfigurationsArgs = {
  curriculumPackageId: Scalars['String'];
};


export type QueryCurriculumPackagesArgs = {
  curriculumBrandId: Scalars['String'];
};


export type QueryDistrictRosterSyncStatusesArgs = {
  districtId?: InputMaybe<Scalars['String']>;
};


export type QueryHumanUsersArgs = {
  email?: InputMaybe<Scalars['String']>;
};


export type QueryLessonArgs = {
  lessonId: Scalars['String'];
};


export type QueryLessonStepsArgs = {
  lessonId: Scalars['String'];
};


export type QueryStudentGroupPackageAssignmentsArgs = {
  studentGroupId?: InputMaybe<Scalars['String']>;
};


export type QueryStudentGroupsArgs = {
  organizationId?: InputMaybe<Scalars['String']>;
};


export type QueryStudentStudentGroupAffiliationsArgs = {
  studentGroupId: Scalars['String'];
};


export type QueryStudentsArgs = {
  studentGroupId: Scalars['String'];
};


export type QueryUserExternalChurnZeroMappingArgs = {
  userId: Scalars['String'];
};


export type QueryUserLessonStepStatusesArgs = {
  userIds: Array<Scalars['String']>;
};

export type Student = {
  __typename?: 'Student';
  createdAt: Scalars['String'];
  createdUserId?: Maybe<Scalars['String']>;
  externalLmsStudentId?: Maybe<Scalars['String']>;
  humanUser: HumanUser;
  id: Scalars['ID'];
  isDeactivated?: Maybe<Scalars['Boolean']>;
  nickName: Scalars['String'];
  role: Scalars['String'];
  userId: Scalars['String'];
};

export type StudentGroup = {
  __typename?: 'StudentGroup';
  classlinkTenantId?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  createdUserId?: Maybe<Scalars['String']>;
  externalLmsStudentGroupId?: Maybe<Scalars['String']>;
  grade?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  organizationId: Scalars['String'];
  updatedAt: Scalars['String'];
  updatedUserId?: Maybe<Scalars['String']>;
};

export type StudentGroupPackageAssignment = {
  __typename?: 'StudentGroupPackageAssignment';
  createdAt: Scalars['String'];
  curriculumBrandId: Scalars['String'];
  curriculumPackageId: Scalars['String'];
  id: Scalars['ID'];
  packageCategoryId: Scalars['String'];
  studentGroupId: Scalars['String'];
};

export type StudentGroupPackageAssignments = {
  __typename?: 'StudentGroupPackageAssignments';
  count: Scalars['Int'];
  items: Array<StudentGroupPackageAssignment>;
};

export type StudentGroupPackageAssignmentsResult = ErrorPermissionDenied | ErrorUnknownRuntime | StudentGroupPackageAssignments;

export type StudentGroups = {
  __typename?: 'StudentGroups';
  count: Scalars['Int'];
  items: Array<StudentGroup>;
};

export type StudentGroupsResult = ErrorPermissionDenied | ErrorUnknownRuntime | StudentGroups;

export type StudentStudentGroupAffiliation = {
  __typename?: 'StudentStudentGroupAffiliation';
  createdAt: Scalars['String'];
  createdUserId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  studentGroupId: Scalars['String'];
  studentId: Scalars['String'];
};

export type StudentStudentGroupAffiliations = {
  __typename?: 'StudentStudentGroupAffiliations';
  count: Scalars['Int'];
  items: Array<StudentStudentGroupAffiliation>;
};

export type StudentStudentGroupAffiliationsResult = ErrorPermissionDenied | ErrorUnknownRuntime | StudentStudentGroupAffiliations;

export type Students = {
  __typename?: 'Students';
  count: Scalars['Int'];
  items: Array<Student>;
};

export type StudentsResult = ErrorPermissionDenied | ErrorUnknownRuntime | Students;

export type Teacher = {
  __typename?: 'Teacher';
  createdAt: Scalars['String'];
  createdUserId?: Maybe<Scalars['String']>;
  externalLmsTeacherId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  humanUser: HumanUser;
  id: Scalars['ID'];
  isDeactivated: Scalars['Boolean'];
  lastName: Scalars['String'];
  role: Scalars['String'];
  userId: Scalars['String'];
};

export type TeacherOrganizationAffiliation = {
  __typename?: 'TeacherOrganizationAffiliation';
  createdAt: Scalars['String'];
  createdUserId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  organizationId: Scalars['String'];
  teacherId: Scalars['String'];
};

export type TeacherOrganizationAffiliations = {
  __typename?: 'TeacherOrganizationAffiliations';
  count: Scalars['Int'];
  items: Array<TeacherOrganizationAffiliation>;
};

export type TeacherOrganizationAffiliationsResult = ErrorPermissionDenied | ErrorUnknownRuntime | TeacherOrganizationAffiliations;

export type Teachers = {
  __typename?: 'Teachers';
  count: Scalars['Int'];
  items: Array<Teacher>;
};

export type TeachersResult = ErrorPermissionDenied | ErrorUnknownRuntime | Teachers;

export type UpdateAdministratorInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  districtId: Scalars['String'];
  externalLmsAdministratorId?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  isDeactivated: Scalars['Boolean'];
  lastName: Scalars['String'];
  userId: Scalars['String'];
};

export type UpdateAdministratorPayload = {
  __typename?: 'UpdateAdministratorPayload';
  administrator: Administrator;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateAdministratorPayloadResult = ErrorPermissionDenied | ErrorUnknownRuntime | UpdateAdministratorPayload;

export type UpdateClasslinkTenantCredentialInput = {
  accessToken: Scalars['String'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  districtId: Scalars['ID'];
  externalLmsAppId: Scalars['String'];
  externalLmsTenantId: Scalars['String'];
};

export type UpdateClasslinkTenantCredentialPayload = {
  __typename?: 'UpdateClasslinkTenantCredentialPayload';
  classlinkTenantCredential: ClasslinkTenantCredential;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateClasslinkTenantCredentialPayloadResult = ErrorPermissionDenied | ErrorUnknownRuntime | UpdateClasslinkTenantCredentialPayload;

export type UpdateDistrictInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  enableRosterSync: Scalars['Boolean'];
  externalLmsDistrictId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lmsId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  stateId: Scalars['String'];
};

export type UpdateDistrictPayload = {
  __typename?: 'UpdateDistrictPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  district: District;
};

export type UpdateDistrictPayloadResult = ErrorPermissionDenied | ErrorUnknownRuntime | UpdateDistrictPayload;

export type UpdateHumanUserInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  loginId?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};

export type UpdateHumanUserPayload = {
  __typename?: 'UpdateHumanUserPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  humanUser: HumanUser;
};

export type UpdateHumanUserPayloadResult = ErrorPermissionDenied | ErrorUnknownRuntime | UpdateHumanUserPayload;

export type UpdateOrganizationInput = {
  classlinkTenantId?: InputMaybe<Scalars['String']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  districtId: Scalars['String'];
  externalLmsOrganizationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateOrganizationPayload = {
  __typename?: 'UpdateOrganizationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  organization: Organization;
};

export type UpdateOrganizationPayloadResult = ErrorPermissionDenied | ErrorUnknownRuntime | UpdateOrganizationPayload;

export type UpdateStudentGroupInput = {
  classlinkTenantId?: InputMaybe<Scalars['String']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalLmsStudentGroupId?: InputMaybe<Scalars['String']>;
  grade?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  organizationId: Scalars['String'];
};

export type UpdateStudentGroupPayload = {
  __typename?: 'UpdateStudentGroupPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  studentGroup: StudentGroup;
};

export type UpdateStudentGroupPayloadResult = ErrorPermissionDenied | ErrorUnknownRuntime | UpdateStudentGroupPayload;

export type UpdateStudentInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalLmsStudentId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  isDeactivated?: InputMaybe<Scalars['Boolean']>;
  nickName: Scalars['String'];
  userId: Scalars['String'];
};

export type UpdateStudentPayload = {
  __typename?: 'UpdateStudentPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  student: Student;
};

export type UpdateStudentPayloadResult = ErrorPermissionDenied | ErrorUnknownRuntime | UpdateStudentPayload;

export type UpdateTeacherInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalLmsTeacherId?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  isDeactivated: Scalars['Boolean'];
  lastName: Scalars['String'];
  userId: Scalars['String'];
};

export type UpdateTeacherPayload = {
  __typename?: 'UpdateTeacherPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  teacher: Teacher;
};

export type UpdateTeacherPayloadResult = ErrorPermissionDenied | ErrorUnknownRuntime | UpdateTeacherPayload;

export type UpdateUserExternalChurnZeroMappingInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalChurnZeroAccountExternalId: Scalars['String'];
  externalChurnZeroContactExternalId: Scalars['String'];
  userId: Scalars['String'];
};

export type UpdateUserExternalChurnZeroMappingPayload = {
  __typename?: 'UpdateUserExternalChurnZeroMappingPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  userExternalChurnZeroMapping: UserExternalChurnZeroMapping;
};

export type UpdateUserExternalChurnZeroMappingPayloadResult = ErrorPermissionDenied | ErrorUnknownRuntime | UpdateUserExternalChurnZeroMappingPayload;

export type UpdateUserInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  isDemo: Scalars['Boolean'];
  role: Scalars['String'];
};

export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  user: User;
};

export type UpdateUserPayloadResult = ErrorPermissionDenied | ErrorUnknownRuntime | UpdateUserPayload;

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  isDemo: Scalars['Boolean'];
  role: Scalars['String'];
};

export type UserExternalChurnZeroMapping = {
  __typename?: 'UserExternalChurnZeroMapping';
  externalChurnZeroAccountExternalId: Scalars['String'];
  externalChurnZeroContactExternalId: Scalars['String'];
  userId: Scalars['String'];
};

export type UserExternalChurnZeroMappingResult = ErrorPermissionDenied | ErrorUnknownRuntime | UserExternalChurnZeroMapping;

export type UserLessonHintStatus = {
  __typename?: 'UserLessonHintStatus';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  lessonHintId: Scalars['String'];
  userId: Scalars['String'];
  userLessonStatusId: Scalars['String'];
};

export type UserLessonHintStatuses = {
  __typename?: 'UserLessonHintStatuses';
  count: Scalars['Int'];
  items: Array<UserLessonHintStatus>;
};

export type UserLessonHintStatusesResult = ErrorPermissionDenied | ErrorUnknownRuntime | UserLessonHintStatuses;

export type UserLessonStepStatus = {
  __typename?: 'UserLessonStepStatus';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  lessonId: Scalars['String'];
  status: Scalars['String'];
  stepId: Scalars['String'];
  userId: Scalars['String'];
  userLessonStatusId: Scalars['String'];
};

export type UserLessonStepStatuses = {
  __typename?: 'UserLessonStepStatuses';
  count: Scalars['Int'];
  items: Array<UserLessonStepStatus>;
};

export type UserLessonStepStatusesResult = ErrorPermissionDenied | ErrorUnknownRuntime | UserLessonStepStatuses;

export type Users = {
  __typename?: 'Users';
  count: Scalars['Int'];
  items: Array<User>;
};

export type UsersResult = ErrorPermissionDenied | ErrorUnknownRuntime | Users;

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Administrator: ResolverTypeWrapper<Administrator>;
  Administrators: ResolverTypeWrapper<Administrators>;
  AdministratorsResult: ResolversTypes['Administrators'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ClasslinkTenantCredential: ResolverTypeWrapper<ClasslinkTenantCredential>;
  CodeillusionPackageChapterDefinition: ResolverTypeWrapper<CodeillusionPackageChapterDefinition>;
  CodeillusionPackageChapterDefinitions: ResolverTypeWrapper<CodeillusionPackageChapterDefinitions>;
  CodeillusionPackageChapterDefinitionsResult: ResolversTypes['CodeillusionPackageChapterDefinitions'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CodeillusionPackageCircleDefinition: ResolverTypeWrapper<CodeillusionPackageCircleDefinition>;
  CodeillusionPackageCircleDefinitions: ResolverTypeWrapper<CodeillusionPackageCircleDefinitions>;
  CodeillusionPackageCircleDefinitionsResult: ResolversTypes['CodeillusionPackageCircleDefinitions'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CodeillusionPackageLessonDefinition: ResolverTypeWrapper<CodeillusionPackageLessonDefinition>;
  CodeillusionPackageLessonDefinitionUiType: CodeillusionPackageLessonDefinitionUiType;
  CodeillusionPackageLessonDefinitions: ResolverTypeWrapper<CodeillusionPackageLessonDefinitions>;
  CodeillusionPackageLessonDefinitionsResult: ResolversTypes['CodeillusionPackageLessonDefinitions'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateAdministratorInput: CreateAdministratorInput;
  CreateAdministratorPayload: ResolverTypeWrapper<CreateAdministratorPayload>;
  CreateAdministratorPayloadResult: ResolversTypes['CreateAdministratorPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateClasslinkTenantCredentialInput: CreateClasslinkTenantCredentialInput;
  CreateClasslinkTenantCredentialPayload: ResolverTypeWrapper<CreateClasslinkTenantCredentialPayload>;
  CreateClasslinkTenantCredentialPayloadResult: ResolversTypes['CreateClasslinkTenantCredentialPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateDistrictInput: CreateDistrictInput;
  CreateDistrictPayload: ResolverTypeWrapper<CreateDistrictPayload>;
  CreateDistrictPayloadResult: ResolversTypes['CreateDistrictPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateDistrictPurchasedPackageInput: CreateDistrictPurchasedPackageInput;
  CreateDistrictPurchasedPackagePayload: ResolverTypeWrapper<CreateDistrictPurchasedPackagePayload>;
  CreateDistrictPurchasedPackagePayloadResult: ResolversTypes['CreateDistrictPurchasedPackagePayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateHumanUserInput: CreateHumanUserInput;
  CreateHumanUserPayload: ResolverTypeWrapper<CreateHumanUserPayload>;
  CreateHumanUserPayloadResult: ResolversTypes['CreateHumanUserPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateOrganizationInput: CreateOrganizationInput;
  CreateOrganizationPayload: ResolverTypeWrapper<CreateOrganizationPayload>;
  CreateOrganizationPayloadResult: ResolversTypes['CreateOrganizationPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateStudentGroupInput: CreateStudentGroupInput;
  CreateStudentGroupPackageAssignmentInput: CreateStudentGroupPackageAssignmentInput;
  CreateStudentGroupPackageAssignmentPayload: ResolverTypeWrapper<CreateStudentGroupPackageAssignmentPayload>;
  CreateStudentGroupPackageAssignmentPayloadResult: ResolversTypes['CreateStudentGroupPackageAssignmentPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateStudentGroupPayload: ResolverTypeWrapper<CreateStudentGroupPayload>;
  CreateStudentGroupPayloadResult: ResolversTypes['CreateStudentGroupPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateStudentInput: CreateStudentInput;
  CreateStudentPayload: ResolverTypeWrapper<CreateStudentPayload>;
  CreateStudentPayloadResult: ResolversTypes['CreateStudentPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateStudentStudentGroupAffiliationInput: CreateStudentStudentGroupAffiliationInput;
  CreateStudentStudentGroupAffiliationPayload: ResolverTypeWrapper<CreateStudentStudentGroupAffiliationPayload>;
  CreateStudentStudentGroupAffiliationPayloadResult: ResolversTypes['CreateStudentStudentGroupAffiliationPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateTeacherInput: CreateTeacherInput;
  CreateTeacherOrganizationAffiliationInput: CreateTeacherOrganizationAffiliationInput;
  CreateTeacherOrganizationAffiliationPayload: ResolverTypeWrapper<CreateTeacherOrganizationAffiliationPayload>;
  CreateTeacherOrganizationAffiliationPayloadResult: ResolversTypes['CreateTeacherOrganizationAffiliationPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateTeacherPayload: ResolverTypeWrapper<CreateTeacherPayload>;
  CreateTeacherPayloadResult: ResolversTypes['CreateTeacherPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateUserExternalChurnZeroMappingInput: CreateUserExternalChurnZeroMappingInput;
  CreateUserExternalChurnZeroMappingPayload: ResolverTypeWrapper<CreateUserExternalChurnZeroMappingPayload>;
  CreateUserExternalChurnZeroMappingPayloadResult: ResolversTypes['CreateUserExternalChurnZeroMappingPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CreateUserInput: CreateUserInput;
  CreateUserPayload: ResolverTypeWrapper<CreateUserPayload>;
  CreateUserPayloadResult: ResolversTypes['CreateUserPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CsePackageLessonDefinition: ResolverTypeWrapper<CsePackageLessonDefinition>;
  CsePackageLessonDefinitions: ResolverTypeWrapper<CsePackageLessonDefinitions>;
  CsePackageLessonDefinitionsResult: ResolversTypes['CsePackageLessonDefinitions'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CsePackageUnitDefinition: ResolverTypeWrapper<CsePackageUnitDefinition>;
  CsePackageUnitDefinitions: ResolverTypeWrapper<CsePackageUnitDefinitions>;
  CsePackageUnitDefinitionsResult: ResolversTypes['CsePackageUnitDefinitions'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CurriculumBrand: ResolverTypeWrapper<CurriculumBrand>;
  CurriculumBrands: ResolverTypeWrapper<CurriculumBrands>;
  CurriculumBrandsResult: ResolversTypes['CurriculumBrands'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CurriculumPackage: ResolverTypeWrapper<CurriculumPackage>;
  CurriculumPackageLessonConfiguration: ResolverTypeWrapper<CurriculumPackageLessonConfiguration>;
  CurriculumPackageLessonConfigurations: ResolverTypeWrapper<CurriculumPackageLessonConfigurations>;
  CurriculumPackageLessonConfigurationsResult: ResolversTypes['CurriculumPackageLessonConfigurations'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  CurriculumPackageLevel: CurriculumPackageLevel;
  CurriculumPackages: ResolverTypeWrapper<CurriculumPackages>;
  CurriculumPackagesResult: ResolversTypes['CurriculumPackages'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  DeleteDistrictPurchasedPackageInput: DeleteDistrictPurchasedPackageInput;
  DeleteDistrictPurchasedPackagePayload: ResolverTypeWrapper<DeleteDistrictPurchasedPackagePayload>;
  DeleteDistrictPurchasedPackagePayloadResult: ResolversTypes['DeleteDistrictPurchasedPackagePayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  DeleteStudentGroupPackageAssignmentInput: DeleteStudentGroupPackageAssignmentInput;
  DeleteStudentGroupPackageAssignmentPayload: ResolverTypeWrapper<DeleteStudentGroupPackageAssignmentPayload>;
  DeleteStudentGroupPackageAssignmentPayloadResult: ResolversTypes['DeleteStudentGroupPackageAssignmentPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  DeleteStudentStudentGroupAffiliationInput: DeleteStudentStudentGroupAffiliationInput;
  DeleteStudentStudentGroupAffiliationPayload: ResolverTypeWrapper<DeleteStudentStudentGroupAffiliationPayload>;
  DeleteStudentStudentGroupAffiliationPayloadResult: ResolversTypes['DeleteStudentStudentGroupAffiliationPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  DeleteTeacherOrganizationAffiliationInput: DeleteTeacherOrganizationAffiliationInput;
  DeleteTeacherOrganizationAffiliationPayload: ResolverTypeWrapper<DeleteTeacherOrganizationAffiliationPayload>;
  DeleteTeacherOrganizationAffiliationPayloadResult: ResolversTypes['DeleteTeacherOrganizationAffiliationPayload'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  District: ResolverTypeWrapper<District>;
  DistrictPurchasedPackage: ResolverTypeWrapper<DistrictPurchasedPackage>;
  DistrictRosterSyncStatus: ResolverTypeWrapper<DistrictRosterSyncStatus>;
  DistrictRosterSyncStatuses: ResolverTypeWrapper<DistrictRosterSyncStatuses>;
  DistrictRosterSyncStatusesResult: ResolversTypes['DistrictRosterSyncStatuses'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  Districts: ResolverTypeWrapper<Districts>;
  DistrictsResult: ResolversTypes['Districts'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'];
  Error: ResolverTypeWrapper<Error>;
  ErrorCode: ErrorCode;
  ErrorNotFound: ResolverTypeWrapper<ErrorNotFound>;
  ErrorPermissionDenied: ResolverTypeWrapper<ErrorPermissionDenied>;
  ErrorUnknownRuntime: ResolverTypeWrapper<ErrorUnknownRuntime>;
  HumanUser: ResolverTypeWrapper<HumanUser>;
  HumanUsers: ResolverTypeWrapper<HumanUsers>;
  HumanUsersResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['HumanUsers'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Lesson: ResolverTypeWrapper<Lesson>;
  LessonCourse: LessonCourse;
  LessonHint: ResolverTypeWrapper<LessonHint>;
  LessonHints: ResolverTypeWrapper<LessonHints>;
  LessonHintsResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['LessonHints'];
  LessonQuiz: ResolverTypeWrapper<LessonQuiz>;
  LessonQuizzes: ResolverTypeWrapper<LessonQuizzes>;
  LessonQuizzesResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['LessonQuizzes'];
  LessonResult: ResolversTypes['ErrorNotFound'] | ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['Lesson'];
  LessonStep: ResolverTypeWrapper<LessonStep>;
  LessonSteps: ResolverTypeWrapper<LessonSteps>;
  LessonStepsResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['LessonSteps'];
  Lessons: ResolverTypeWrapper<Lessons>;
  LessonsResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['Lessons'];
  Mutation: ResolverTypeWrapper<{}>;
  Organization: ResolverTypeWrapper<Organization>;
  Organizations: ResolverTypeWrapper<Organizations>;
  OrganizationsResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['Organizations'];
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Student: ResolverTypeWrapper<Student>;
  StudentGroup: ResolverTypeWrapper<StudentGroup>;
  StudentGroupPackageAssignment: ResolverTypeWrapper<StudentGroupPackageAssignment>;
  StudentGroupPackageAssignments: ResolverTypeWrapper<StudentGroupPackageAssignments>;
  StudentGroupPackageAssignmentsResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['StudentGroupPackageAssignments'];
  StudentGroups: ResolverTypeWrapper<StudentGroups>;
  StudentGroupsResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['StudentGroups'];
  StudentStudentGroupAffiliation: ResolverTypeWrapper<StudentStudentGroupAffiliation>;
  StudentStudentGroupAffiliations: ResolverTypeWrapper<StudentStudentGroupAffiliations>;
  StudentStudentGroupAffiliationsResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['StudentStudentGroupAffiliations'];
  Students: ResolverTypeWrapper<Students>;
  StudentsResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['Students'];
  Teacher: ResolverTypeWrapper<Teacher>;
  TeacherOrganizationAffiliation: ResolverTypeWrapper<TeacherOrganizationAffiliation>;
  TeacherOrganizationAffiliations: ResolverTypeWrapper<TeacherOrganizationAffiliations>;
  TeacherOrganizationAffiliationsResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['TeacherOrganizationAffiliations'];
  Teachers: ResolverTypeWrapper<Teachers>;
  TeachersResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['Teachers'];
  UpdateAdministratorInput: UpdateAdministratorInput;
  UpdateAdministratorPayload: ResolverTypeWrapper<UpdateAdministratorPayload>;
  UpdateAdministratorPayloadResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UpdateAdministratorPayload'];
  UpdateClasslinkTenantCredentialInput: UpdateClasslinkTenantCredentialInput;
  UpdateClasslinkTenantCredentialPayload: ResolverTypeWrapper<UpdateClasslinkTenantCredentialPayload>;
  UpdateClasslinkTenantCredentialPayloadResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UpdateClasslinkTenantCredentialPayload'];
  UpdateDistrictInput: UpdateDistrictInput;
  UpdateDistrictPayload: ResolverTypeWrapper<UpdateDistrictPayload>;
  UpdateDistrictPayloadResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UpdateDistrictPayload'];
  UpdateHumanUserInput: UpdateHumanUserInput;
  UpdateHumanUserPayload: ResolverTypeWrapper<UpdateHumanUserPayload>;
  UpdateHumanUserPayloadResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UpdateHumanUserPayload'];
  UpdateOrganizationInput: UpdateOrganizationInput;
  UpdateOrganizationPayload: ResolverTypeWrapper<UpdateOrganizationPayload>;
  UpdateOrganizationPayloadResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UpdateOrganizationPayload'];
  UpdateStudentGroupInput: UpdateStudentGroupInput;
  UpdateStudentGroupPayload: ResolverTypeWrapper<UpdateStudentGroupPayload>;
  UpdateStudentGroupPayloadResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UpdateStudentGroupPayload'];
  UpdateStudentInput: UpdateStudentInput;
  UpdateStudentPayload: ResolverTypeWrapper<UpdateStudentPayload>;
  UpdateStudentPayloadResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UpdateStudentPayload'];
  UpdateTeacherInput: UpdateTeacherInput;
  UpdateTeacherPayload: ResolverTypeWrapper<UpdateTeacherPayload>;
  UpdateTeacherPayloadResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UpdateTeacherPayload'];
  UpdateUserExternalChurnZeroMappingInput: UpdateUserExternalChurnZeroMappingInput;
  UpdateUserExternalChurnZeroMappingPayload: ResolverTypeWrapper<UpdateUserExternalChurnZeroMappingPayload>;
  UpdateUserExternalChurnZeroMappingPayloadResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UpdateUserExternalChurnZeroMappingPayload'];
  UpdateUserInput: UpdateUserInput;
  UpdateUserPayload: ResolverTypeWrapper<UpdateUserPayload>;
  UpdateUserPayloadResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UpdateUserPayload'];
  User: ResolverTypeWrapper<User>;
  UserExternalChurnZeroMapping: ResolverTypeWrapper<UserExternalChurnZeroMapping>;
  UserExternalChurnZeroMappingResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UserExternalChurnZeroMapping'];
  UserLessonHintStatus: ResolverTypeWrapper<UserLessonHintStatus>;
  UserLessonHintStatuses: ResolverTypeWrapper<UserLessonHintStatuses>;
  UserLessonHintStatusesResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UserLessonHintStatuses'];
  UserLessonStepStatus: ResolverTypeWrapper<UserLessonStepStatus>;
  UserLessonStepStatuses: ResolverTypeWrapper<UserLessonStepStatuses>;
  UserLessonStepStatusesResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['UserLessonStepStatuses'];
  Users: ResolverTypeWrapper<Users>;
  UsersResult: ResolversTypes['ErrorPermissionDenied'] | ResolversTypes['ErrorUnknownRuntime'] | ResolversTypes['Users'];
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Administrator: Administrator;
  Administrators: Administrators;
  AdministratorsResult: ResolversParentTypes['Administrators'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  Boolean: Scalars['Boolean'];
  ClasslinkTenantCredential: ClasslinkTenantCredential;
  CodeillusionPackageChapterDefinition: CodeillusionPackageChapterDefinition;
  CodeillusionPackageChapterDefinitions: CodeillusionPackageChapterDefinitions;
  CodeillusionPackageChapterDefinitionsResult: ResolversParentTypes['CodeillusionPackageChapterDefinitions'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CodeillusionPackageCircleDefinition: CodeillusionPackageCircleDefinition;
  CodeillusionPackageCircleDefinitions: CodeillusionPackageCircleDefinitions;
  CodeillusionPackageCircleDefinitionsResult: ResolversParentTypes['CodeillusionPackageCircleDefinitions'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CodeillusionPackageLessonDefinition: CodeillusionPackageLessonDefinition;
  CodeillusionPackageLessonDefinitions: CodeillusionPackageLessonDefinitions;
  CodeillusionPackageLessonDefinitionsResult: ResolversParentTypes['CodeillusionPackageLessonDefinitions'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateAdministratorInput: CreateAdministratorInput;
  CreateAdministratorPayload: CreateAdministratorPayload;
  CreateAdministratorPayloadResult: ResolversParentTypes['CreateAdministratorPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateClasslinkTenantCredentialInput: CreateClasslinkTenantCredentialInput;
  CreateClasslinkTenantCredentialPayload: CreateClasslinkTenantCredentialPayload;
  CreateClasslinkTenantCredentialPayloadResult: ResolversParentTypes['CreateClasslinkTenantCredentialPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateDistrictInput: CreateDistrictInput;
  CreateDistrictPayload: CreateDistrictPayload;
  CreateDistrictPayloadResult: ResolversParentTypes['CreateDistrictPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateDistrictPurchasedPackageInput: CreateDistrictPurchasedPackageInput;
  CreateDistrictPurchasedPackagePayload: CreateDistrictPurchasedPackagePayload;
  CreateDistrictPurchasedPackagePayloadResult: ResolversParentTypes['CreateDistrictPurchasedPackagePayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateHumanUserInput: CreateHumanUserInput;
  CreateHumanUserPayload: CreateHumanUserPayload;
  CreateHumanUserPayloadResult: ResolversParentTypes['CreateHumanUserPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateOrganizationInput: CreateOrganizationInput;
  CreateOrganizationPayload: CreateOrganizationPayload;
  CreateOrganizationPayloadResult: ResolversParentTypes['CreateOrganizationPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateStudentGroupInput: CreateStudentGroupInput;
  CreateStudentGroupPackageAssignmentInput: CreateStudentGroupPackageAssignmentInput;
  CreateStudentGroupPackageAssignmentPayload: CreateStudentGroupPackageAssignmentPayload;
  CreateStudentGroupPackageAssignmentPayloadResult: ResolversParentTypes['CreateStudentGroupPackageAssignmentPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateStudentGroupPayload: CreateStudentGroupPayload;
  CreateStudentGroupPayloadResult: ResolversParentTypes['CreateStudentGroupPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateStudentInput: CreateStudentInput;
  CreateStudentPayload: CreateStudentPayload;
  CreateStudentPayloadResult: ResolversParentTypes['CreateStudentPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateStudentStudentGroupAffiliationInput: CreateStudentStudentGroupAffiliationInput;
  CreateStudentStudentGroupAffiliationPayload: CreateStudentStudentGroupAffiliationPayload;
  CreateStudentStudentGroupAffiliationPayloadResult: ResolversParentTypes['CreateStudentStudentGroupAffiliationPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateTeacherInput: CreateTeacherInput;
  CreateTeacherOrganizationAffiliationInput: CreateTeacherOrganizationAffiliationInput;
  CreateTeacherOrganizationAffiliationPayload: CreateTeacherOrganizationAffiliationPayload;
  CreateTeacherOrganizationAffiliationPayloadResult: ResolversParentTypes['CreateTeacherOrganizationAffiliationPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateTeacherPayload: CreateTeacherPayload;
  CreateTeacherPayloadResult: ResolversParentTypes['CreateTeacherPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateUserExternalChurnZeroMappingInput: CreateUserExternalChurnZeroMappingInput;
  CreateUserExternalChurnZeroMappingPayload: CreateUserExternalChurnZeroMappingPayload;
  CreateUserExternalChurnZeroMappingPayloadResult: ResolversParentTypes['CreateUserExternalChurnZeroMappingPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CreateUserInput: CreateUserInput;
  CreateUserPayload: CreateUserPayload;
  CreateUserPayloadResult: ResolversParentTypes['CreateUserPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CsePackageLessonDefinition: CsePackageLessonDefinition;
  CsePackageLessonDefinitions: CsePackageLessonDefinitions;
  CsePackageLessonDefinitionsResult: ResolversParentTypes['CsePackageLessonDefinitions'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CsePackageUnitDefinition: CsePackageUnitDefinition;
  CsePackageUnitDefinitions: CsePackageUnitDefinitions;
  CsePackageUnitDefinitionsResult: ResolversParentTypes['CsePackageUnitDefinitions'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CurriculumBrand: CurriculumBrand;
  CurriculumBrands: CurriculumBrands;
  CurriculumBrandsResult: ResolversParentTypes['CurriculumBrands'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CurriculumPackage: CurriculumPackage;
  CurriculumPackageLessonConfiguration: CurriculumPackageLessonConfiguration;
  CurriculumPackageLessonConfigurations: CurriculumPackageLessonConfigurations;
  CurriculumPackageLessonConfigurationsResult: ResolversParentTypes['CurriculumPackageLessonConfigurations'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  CurriculumPackages: CurriculumPackages;
  CurriculumPackagesResult: ResolversParentTypes['CurriculumPackages'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  DeleteDistrictPurchasedPackageInput: DeleteDistrictPurchasedPackageInput;
  DeleteDistrictPurchasedPackagePayload: DeleteDistrictPurchasedPackagePayload;
  DeleteDistrictPurchasedPackagePayloadResult: ResolversParentTypes['DeleteDistrictPurchasedPackagePayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  DeleteStudentGroupPackageAssignmentInput: DeleteStudentGroupPackageAssignmentInput;
  DeleteStudentGroupPackageAssignmentPayload: DeleteStudentGroupPackageAssignmentPayload;
  DeleteStudentGroupPackageAssignmentPayloadResult: ResolversParentTypes['DeleteStudentGroupPackageAssignmentPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  DeleteStudentStudentGroupAffiliationInput: DeleteStudentStudentGroupAffiliationInput;
  DeleteStudentStudentGroupAffiliationPayload: DeleteStudentStudentGroupAffiliationPayload;
  DeleteStudentStudentGroupAffiliationPayloadResult: ResolversParentTypes['DeleteStudentStudentGroupAffiliationPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  DeleteTeacherOrganizationAffiliationInput: DeleteTeacherOrganizationAffiliationInput;
  DeleteTeacherOrganizationAffiliationPayload: DeleteTeacherOrganizationAffiliationPayload;
  DeleteTeacherOrganizationAffiliationPayloadResult: ResolversParentTypes['DeleteTeacherOrganizationAffiliationPayload'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  District: District;
  DistrictPurchasedPackage: DistrictPurchasedPackage;
  DistrictRosterSyncStatus: DistrictRosterSyncStatus;
  DistrictRosterSyncStatuses: DistrictRosterSyncStatuses;
  DistrictRosterSyncStatusesResult: ResolversParentTypes['DistrictRosterSyncStatuses'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  Districts: Districts;
  DistrictsResult: ResolversParentTypes['Districts'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'];
  Error: Error;
  ErrorNotFound: ErrorNotFound;
  ErrorPermissionDenied: ErrorPermissionDenied;
  ErrorUnknownRuntime: ErrorUnknownRuntime;
  HumanUser: HumanUser;
  HumanUsers: HumanUsers;
  HumanUsersResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['HumanUsers'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Lesson: Lesson;
  LessonHint: LessonHint;
  LessonHints: LessonHints;
  LessonHintsResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['LessonHints'];
  LessonQuiz: LessonQuiz;
  LessonQuizzes: LessonQuizzes;
  LessonQuizzesResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['LessonQuizzes'];
  LessonResult: ResolversParentTypes['ErrorNotFound'] | ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['Lesson'];
  LessonStep: LessonStep;
  LessonSteps: LessonSteps;
  LessonStepsResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['LessonSteps'];
  Lessons: Lessons;
  LessonsResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['Lessons'];
  Mutation: {};
  Organization: Organization;
  Organizations: Organizations;
  OrganizationsResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['Organizations'];
  Query: {};
  String: Scalars['String'];
  Student: Student;
  StudentGroup: StudentGroup;
  StudentGroupPackageAssignment: StudentGroupPackageAssignment;
  StudentGroupPackageAssignments: StudentGroupPackageAssignments;
  StudentGroupPackageAssignmentsResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['StudentGroupPackageAssignments'];
  StudentGroups: StudentGroups;
  StudentGroupsResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['StudentGroups'];
  StudentStudentGroupAffiliation: StudentStudentGroupAffiliation;
  StudentStudentGroupAffiliations: StudentStudentGroupAffiliations;
  StudentStudentGroupAffiliationsResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['StudentStudentGroupAffiliations'];
  Students: Students;
  StudentsResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['Students'];
  Teacher: Teacher;
  TeacherOrganizationAffiliation: TeacherOrganizationAffiliation;
  TeacherOrganizationAffiliations: TeacherOrganizationAffiliations;
  TeacherOrganizationAffiliationsResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['TeacherOrganizationAffiliations'];
  Teachers: Teachers;
  TeachersResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['Teachers'];
  UpdateAdministratorInput: UpdateAdministratorInput;
  UpdateAdministratorPayload: UpdateAdministratorPayload;
  UpdateAdministratorPayloadResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UpdateAdministratorPayload'];
  UpdateClasslinkTenantCredentialInput: UpdateClasslinkTenantCredentialInput;
  UpdateClasslinkTenantCredentialPayload: UpdateClasslinkTenantCredentialPayload;
  UpdateClasslinkTenantCredentialPayloadResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UpdateClasslinkTenantCredentialPayload'];
  UpdateDistrictInput: UpdateDistrictInput;
  UpdateDistrictPayload: UpdateDistrictPayload;
  UpdateDistrictPayloadResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UpdateDistrictPayload'];
  UpdateHumanUserInput: UpdateHumanUserInput;
  UpdateHumanUserPayload: UpdateHumanUserPayload;
  UpdateHumanUserPayloadResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UpdateHumanUserPayload'];
  UpdateOrganizationInput: UpdateOrganizationInput;
  UpdateOrganizationPayload: UpdateOrganizationPayload;
  UpdateOrganizationPayloadResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UpdateOrganizationPayload'];
  UpdateStudentGroupInput: UpdateStudentGroupInput;
  UpdateStudentGroupPayload: UpdateStudentGroupPayload;
  UpdateStudentGroupPayloadResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UpdateStudentGroupPayload'];
  UpdateStudentInput: UpdateStudentInput;
  UpdateStudentPayload: UpdateStudentPayload;
  UpdateStudentPayloadResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UpdateStudentPayload'];
  UpdateTeacherInput: UpdateTeacherInput;
  UpdateTeacherPayload: UpdateTeacherPayload;
  UpdateTeacherPayloadResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UpdateTeacherPayload'];
  UpdateUserExternalChurnZeroMappingInput: UpdateUserExternalChurnZeroMappingInput;
  UpdateUserExternalChurnZeroMappingPayload: UpdateUserExternalChurnZeroMappingPayload;
  UpdateUserExternalChurnZeroMappingPayloadResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UpdateUserExternalChurnZeroMappingPayload'];
  UpdateUserInput: UpdateUserInput;
  UpdateUserPayload: UpdateUserPayload;
  UpdateUserPayloadResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UpdateUserPayload'];
  User: User;
  UserExternalChurnZeroMapping: UserExternalChurnZeroMapping;
  UserExternalChurnZeroMappingResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UserExternalChurnZeroMapping'];
  UserLessonHintStatus: UserLessonHintStatus;
  UserLessonHintStatuses: UserLessonHintStatuses;
  UserLessonHintStatusesResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UserLessonHintStatuses'];
  UserLessonStepStatus: UserLessonStepStatus;
  UserLessonStepStatuses: UserLessonStepStatuses;
  UserLessonStepStatusesResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['UserLessonStepStatuses'];
  Users: Users;
  UsersResult: ResolversParentTypes['ErrorPermissionDenied'] | ResolversParentTypes['ErrorUnknownRuntime'] | ResolversParentTypes['Users'];
}>;

export type AdministratorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Administrator'] = ResolversParentTypes['Administrator']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  districtId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  externalLmsAdministratorId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  humanUser?: Resolver<ResolversTypes['HumanUser'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDeactivated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AdministratorsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Administrators'] = ResolversParentTypes['Administrators']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Administrator']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AdministratorsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AdministratorsResult'] = ResolversParentTypes['AdministratorsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Administrators' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type ClasslinkTenantCredentialResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClasslinkTenantCredential'] = ResolversParentTypes['ClasslinkTenantCredential']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  districtId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  externalLmsAppId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  externalLmsTenantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CodeillusionPackageChapterDefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeillusionPackageChapterDefinition'] = ResolversParentTypes['CodeillusionPackageChapterDefinition']> = ResolversObject<{
  codeillusionPackageCircleDefinitions?: Resolver<Maybe<ResolversTypes['CodeillusionPackageCircleDefinitions']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessonNoteSheetsZipUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lessonOverViewPdfUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CodeillusionPackageChapterDefinitionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeillusionPackageChapterDefinitions'] = ResolversParentTypes['CodeillusionPackageChapterDefinitions']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CodeillusionPackageChapterDefinition']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CodeillusionPackageChapterDefinitionsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeillusionPackageChapterDefinitionsResult'] = ResolversParentTypes['CodeillusionPackageChapterDefinitionsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeillusionPackageChapterDefinitions' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CodeillusionPackageCircleDefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeillusionPackageCircleDefinition'] = ResolversParentTypes['CodeillusionPackageCircleDefinition']> = ResolversObject<{
  bookImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bookName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  characterImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  clearedCharacterImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  codeillusionPackageChapterDefinitionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  codeillusionPackageLessonDefinitions?: Resolver<Maybe<ResolversTypes['CodeillusionPackageLessonDefinitions']>, ParentType, ContextType>;
  course?: Resolver<ResolversTypes['LessonCourse'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CodeillusionPackageCircleDefinitionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeillusionPackageCircleDefinitions'] = ResolversParentTypes['CodeillusionPackageCircleDefinitions']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CodeillusionPackageCircleDefinition']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CodeillusionPackageCircleDefinitionsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeillusionPackageCircleDefinitionsResult'] = ResolversParentTypes['CodeillusionPackageCircleDefinitionsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeillusionPackageCircleDefinitions' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CodeillusionPackageLessonDefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeillusionPackageLessonDefinition'] = ResolversParentTypes['CodeillusionPackageLessonDefinition']> = ResolversObject<{
  codeillusionPackageCircleDefinitionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lessonId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uiType?: Resolver<ResolversTypes['CodeillusionPackageLessonDefinitionUiType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CodeillusionPackageLessonDefinitionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeillusionPackageLessonDefinitions'] = ResolversParentTypes['CodeillusionPackageLessonDefinitions']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CodeillusionPackageLessonDefinition']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CodeillusionPackageLessonDefinitionsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeillusionPackageLessonDefinitionsResult'] = ResolversParentTypes['CodeillusionPackageLessonDefinitionsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeillusionPackageLessonDefinitions' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateAdministratorPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAdministratorPayload'] = ResolversParentTypes['CreateAdministratorPayload']> = ResolversObject<{
  administrator?: Resolver<ResolversTypes['Administrator'], ParentType, ContextType>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateAdministratorPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAdministratorPayloadResult'] = ResolversParentTypes['CreateAdministratorPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateAdministratorPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateClasslinkTenantCredentialPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateClasslinkTenantCredentialPayload'] = ResolversParentTypes['CreateClasslinkTenantCredentialPayload']> = ResolversObject<{
  classlinkTenantCredential?: Resolver<ResolversTypes['ClasslinkTenantCredential'], ParentType, ContextType>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateClasslinkTenantCredentialPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateClasslinkTenantCredentialPayloadResult'] = ResolversParentTypes['CreateClasslinkTenantCredentialPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateClasslinkTenantCredentialPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateDistrictPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateDistrictPayload'] = ResolversParentTypes['CreateDistrictPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  district?: Resolver<ResolversTypes['District'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateDistrictPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateDistrictPayloadResult'] = ResolversParentTypes['CreateDistrictPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateDistrictPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateDistrictPurchasedPackagePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateDistrictPurchasedPackagePayload'] = ResolversParentTypes['CreateDistrictPurchasedPackagePayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  districtPurchasedPackage?: Resolver<ResolversTypes['DistrictPurchasedPackage'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateDistrictPurchasedPackagePayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateDistrictPurchasedPackagePayloadResult'] = ResolversParentTypes['CreateDistrictPurchasedPackagePayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateDistrictPurchasedPackagePayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateHumanUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateHumanUserPayload'] = ResolversParentTypes['CreateHumanUserPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  humanUser?: Resolver<ResolversTypes['HumanUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateHumanUserPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateHumanUserPayloadResult'] = ResolversParentTypes['CreateHumanUserPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateHumanUserPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateOrganizationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateOrganizationPayload'] = ResolversParentTypes['CreateOrganizationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateOrganizationPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateOrganizationPayloadResult'] = ResolversParentTypes['CreateOrganizationPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateOrganizationPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateStudentGroupPackageAssignmentPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStudentGroupPackageAssignmentPayload'] = ResolversParentTypes['CreateStudentGroupPackageAssignmentPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  studentGroupPackageAssignment?: Resolver<ResolversTypes['StudentGroupPackageAssignment'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateStudentGroupPackageAssignmentPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStudentGroupPackageAssignmentPayloadResult'] = ResolversParentTypes['CreateStudentGroupPackageAssignmentPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateStudentGroupPackageAssignmentPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateStudentGroupPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStudentGroupPayload'] = ResolversParentTypes['CreateStudentGroupPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  studentGroup?: Resolver<ResolversTypes['StudentGroup'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateStudentGroupPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStudentGroupPayloadResult'] = ResolversParentTypes['CreateStudentGroupPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateStudentGroupPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateStudentPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStudentPayload'] = ResolversParentTypes['CreateStudentPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  student?: Resolver<ResolversTypes['Student'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateStudentPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStudentPayloadResult'] = ResolversParentTypes['CreateStudentPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateStudentPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateStudentStudentGroupAffiliationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStudentStudentGroupAffiliationPayload'] = ResolversParentTypes['CreateStudentStudentGroupAffiliationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  studentStudentGroupAffiliation?: Resolver<ResolversTypes['StudentStudentGroupAffiliation'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateStudentStudentGroupAffiliationPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateStudentStudentGroupAffiliationPayloadResult'] = ResolversParentTypes['CreateStudentStudentGroupAffiliationPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateStudentStudentGroupAffiliationPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateTeacherOrganizationAffiliationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeacherOrganizationAffiliationPayload'] = ResolversParentTypes['CreateTeacherOrganizationAffiliationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  teacherOrganizationAffiliation?: Resolver<ResolversTypes['TeacherOrganizationAffiliation'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateTeacherOrganizationAffiliationPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeacherOrganizationAffiliationPayloadResult'] = ResolversParentTypes['CreateTeacherOrganizationAffiliationPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateTeacherOrganizationAffiliationPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateTeacherPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeacherPayload'] = ResolversParentTypes['CreateTeacherPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  teacher?: Resolver<ResolversTypes['Teacher'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateTeacherPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeacherPayloadResult'] = ResolversParentTypes['CreateTeacherPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateTeacherPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateUserExternalChurnZeroMappingPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserExternalChurnZeroMappingPayload'] = ResolversParentTypes['CreateUserExternalChurnZeroMappingPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userExternalChurnZeroMapping?: Resolver<ResolversTypes['UserExternalChurnZeroMapping'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateUserExternalChurnZeroMappingPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserExternalChurnZeroMappingPayloadResult'] = ResolversParentTypes['CreateUserExternalChurnZeroMappingPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateUserExternalChurnZeroMappingPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CreateUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserPayload'] = ResolversParentTypes['CreateUserPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateUserPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserPayloadResult'] = ResolversParentTypes['CreateUserPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateUserPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CsePackageLessonDefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CsePackageLessonDefinition'] = ResolversParentTypes['CsePackageLessonDefinition']> = ResolversObject<{
  csePackageUnitDefinitionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isQuizLesson?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lessonId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CsePackageLessonDefinitionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CsePackageLessonDefinitions'] = ResolversParentTypes['CsePackageLessonDefinitions']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CsePackageLessonDefinition']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CsePackageLessonDefinitionsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CsePackageLessonDefinitionsResult'] = ResolversParentTypes['CsePackageLessonDefinitionsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CsePackageLessonDefinitions' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CsePackageUnitDefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CsePackageUnitDefinition'] = ResolversParentTypes['CsePackageUnitDefinition']> = ResolversObject<{
  csePackageLessonDefinitions?: Resolver<Maybe<ResolversTypes['CsePackageLessonDefinitions']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CsePackageUnitDefinitionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CsePackageUnitDefinitions'] = ResolversParentTypes['CsePackageUnitDefinitions']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CsePackageUnitDefinition']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CsePackageUnitDefinitionsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CsePackageUnitDefinitionsResult'] = ResolversParentTypes['CsePackageUnitDefinitionsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CsePackageUnitDefinitions' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CurriculumBrandResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurriculumBrand'] = ResolversParentTypes['CurriculumBrand']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CurriculumBrandsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurriculumBrands'] = ResolversParentTypes['CurriculumBrands']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CurriculumBrand']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CurriculumBrandsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurriculumBrandsResult'] = ResolversParentTypes['CurriculumBrandsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CurriculumBrands' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CurriculumPackageResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurriculumPackage'] = ResolversParentTypes['CurriculumPackage']> = ResolversObject<{
  curriculumBrandId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['CurriculumPackageLevel'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CurriculumPackageLessonConfigurationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurriculumPackageLessonConfiguration'] = ResolversParentTypes['CurriculumPackageLessonConfiguration']> = ResolversObject<{
  curriculumPackageId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lessonId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CurriculumPackageLessonConfigurationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurriculumPackageLessonConfigurations'] = ResolversParentTypes['CurriculumPackageLessonConfigurations']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CurriculumPackageLessonConfiguration']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CurriculumPackageLessonConfigurationsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurriculumPackageLessonConfigurationsResult'] = ResolversParentTypes['CurriculumPackageLessonConfigurationsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CurriculumPackageLessonConfigurations' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type CurriculumPackagesResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurriculumPackages'] = ResolversParentTypes['CurriculumPackages']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CurriculumPackage']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CurriculumPackagesResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurriculumPackagesResult'] = ResolversParentTypes['CurriculumPackagesResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CurriculumPackages' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type DeleteDistrictPurchasedPackagePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteDistrictPurchasedPackagePayload'] = ResolversParentTypes['DeleteDistrictPurchasedPackagePayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteDistrictPurchasedPackagePayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteDistrictPurchasedPackagePayloadResult'] = ResolversParentTypes['DeleteDistrictPurchasedPackagePayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DeleteDistrictPurchasedPackagePayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type DeleteStudentGroupPackageAssignmentPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteStudentGroupPackageAssignmentPayload'] = ResolversParentTypes['DeleteStudentGroupPackageAssignmentPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteStudentGroupPackageAssignmentPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteStudentGroupPackageAssignmentPayloadResult'] = ResolversParentTypes['DeleteStudentGroupPackageAssignmentPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DeleteStudentGroupPackageAssignmentPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type DeleteStudentStudentGroupAffiliationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteStudentStudentGroupAffiliationPayload'] = ResolversParentTypes['DeleteStudentStudentGroupAffiliationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteStudentStudentGroupAffiliationPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteStudentStudentGroupAffiliationPayloadResult'] = ResolversParentTypes['DeleteStudentStudentGroupAffiliationPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DeleteStudentStudentGroupAffiliationPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type DeleteTeacherOrganizationAffiliationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteTeacherOrganizationAffiliationPayload'] = ResolversParentTypes['DeleteTeacherOrganizationAffiliationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteTeacherOrganizationAffiliationPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteTeacherOrganizationAffiliationPayloadResult'] = ResolversParentTypes['DeleteTeacherOrganizationAffiliationPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DeleteTeacherOrganizationAffiliationPayload' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type DistrictResolvers<ContextType = any, ParentType extends ResolversParentTypes['District'] = ResolversParentTypes['District']> = ResolversObject<{
  classlinkTenantCredential?: Resolver<Maybe<ResolversTypes['ClasslinkTenantCredential']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  districtPurchasedPackages?: Resolver<Array<ResolversTypes['DistrictPurchasedPackage']>, ParentType, ContextType>;
  enableRosterSync?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  externalLmsDistrictId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lmsId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stateId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DistrictPurchasedPackageResolvers<ContextType = any, ParentType extends ResolversParentTypes['DistrictPurchasedPackage'] = ResolversParentTypes['DistrictPurchasedPackage']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  curriculumPackageId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  districtId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DistrictRosterSyncStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['DistrictRosterSyncStatus'] = ResolversParentTypes['DistrictRosterSyncStatus']> = ResolversObject<{
  districtId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  finishedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  startedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DistrictRosterSyncStatusesResolvers<ContextType = any, ParentType extends ResolversParentTypes['DistrictRosterSyncStatuses'] = ResolversParentTypes['DistrictRosterSyncStatuses']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['DistrictRosterSyncStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DistrictRosterSyncStatusesResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DistrictRosterSyncStatusesResult'] = ResolversParentTypes['DistrictRosterSyncStatusesResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DistrictRosterSyncStatuses' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type DistrictsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Districts'] = ResolversParentTypes['Districts']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['District']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DistrictsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DistrictsResult'] = ResolversParentTypes['DistrictsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Districts' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime', ParentType, ContextType>;
}>;

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stack?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorNotFoundResolvers<ContextType = any, ParentType extends ResolversParentTypes['ErrorNotFound'] = ResolversParentTypes['ErrorNotFound']> = ResolversObject<{
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stack?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorPermissionDeniedResolvers<ContextType = any, ParentType extends ResolversParentTypes['ErrorPermissionDenied'] = ResolversParentTypes['ErrorPermissionDenied']> = ResolversObject<{
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stack?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorUnknownRuntimeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ErrorUnknownRuntime'] = ResolversParentTypes['ErrorUnknownRuntime']> = ResolversObject<{
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stack?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HumanUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['HumanUser'] = ResolversParentTypes['HumanUser']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  loginId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HumanUsersResolvers<ContextType = any, ParentType extends ResolversParentTypes['HumanUsers'] = ResolversParentTypes['HumanUsers']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['HumanUser']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HumanUsersResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['HumanUsersResult'] = ResolversParentTypes['HumanUsersResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'HumanUsers', ParentType, ContextType>;
}>;

export type LessonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Lesson'] = ResolversParentTypes['Lesson']> = ResolversObject<{
  course?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hintCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessonDuration?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lessonEnvironment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lessonOverViewPdfUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  maxStarCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projectName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quizCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  scenarioName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  skillsLearnedInThisLesson?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  theme?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbnailImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LessonHintResolvers<ContextType = any, ParentType extends ResolversParentTypes['LessonHint'] = ResolversParentTypes['LessonHint']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lessonStepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LessonHintsResolvers<ContextType = any, ParentType extends ResolversParentTypes['LessonHints'] = ResolversParentTypes['LessonHints']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['LessonHint']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LessonHintsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LessonHintsResult'] = ResolversParentTypes['LessonHintsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'LessonHints', ParentType, ContextType>;
}>;

export type LessonQuizResolvers<ContextType = any, ParentType extends ResolversParentTypes['LessonQuiz'] = ResolversParentTypes['LessonQuiz']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lessonStepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LessonQuizzesResolvers<ContextType = any, ParentType extends ResolversParentTypes['LessonQuizzes'] = ResolversParentTypes['LessonQuizzes']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['LessonQuiz']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LessonQuizzesResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LessonQuizzesResult'] = ResolversParentTypes['LessonQuizzesResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'LessonQuizzes', ParentType, ContextType>;
}>;

export type LessonResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LessonResult'] = ResolversParentTypes['LessonResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorNotFound' | 'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'Lesson', ParentType, ContextType>;
}>;

export type LessonStepResolvers<ContextType = any, ParentType extends ResolversParentTypes['LessonStep'] = ResolversParentTypes['LessonStep']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  externalLessonPlayerStepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessonId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LessonStepsResolvers<ContextType = any, ParentType extends ResolversParentTypes['LessonSteps'] = ResolversParentTypes['LessonSteps']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['LessonStep']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LessonStepsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LessonStepsResult'] = ResolversParentTypes['LessonStepsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'LessonSteps', ParentType, ContextType>;
}>;

export type LessonsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Lessons'] = ResolversParentTypes['Lessons']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Lesson']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LessonsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LessonsResult'] = ResolversParentTypes['LessonsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'Lessons', ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createAdministrator?: Resolver<ResolversTypes['CreateAdministratorPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateAdministratorArgs, 'input'>>;
  createClasslinkTenantCredential?: Resolver<ResolversTypes['CreateClasslinkTenantCredentialPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateClasslinkTenantCredentialArgs, 'input'>>;
  createDistrict?: Resolver<ResolversTypes['CreateDistrictPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateDistrictArgs, 'input'>>;
  createDistrictPurchasedPackage?: Resolver<ResolversTypes['CreateDistrictPurchasedPackagePayloadResult'], ParentType, ContextType, RequireFields<MutationCreateDistrictPurchasedPackageArgs, 'input'>>;
  createHumanUser?: Resolver<ResolversTypes['CreateHumanUserPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateHumanUserArgs, 'input'>>;
  createOrganization?: Resolver<ResolversTypes['CreateOrganizationPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateOrganizationArgs, 'input'>>;
  createStudent?: Resolver<ResolversTypes['CreateStudentPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateStudentArgs, 'input'>>;
  createStudentGroup?: Resolver<Maybe<ResolversTypes['CreateStudentGroupPayloadResult']>, ParentType, ContextType, RequireFields<MutationCreateStudentGroupArgs, 'input'>>;
  createStudentGroupPackageAssignment?: Resolver<ResolversTypes['CreateStudentGroupPackageAssignmentPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateStudentGroupPackageAssignmentArgs, 'input'>>;
  createStudentStudentGroupAffiliation?: Resolver<ResolversTypes['CreateStudentStudentGroupAffiliationPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateStudentStudentGroupAffiliationArgs, 'input'>>;
  createTeacher?: Resolver<ResolversTypes['CreateTeacherPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateTeacherArgs, 'input'>>;
  createTeacherOrganizationAffiliation?: Resolver<ResolversTypes['CreateTeacherOrganizationAffiliationPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateTeacherOrganizationAffiliationArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['CreateUserPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  createUserExternalChurnZeroMapping?: Resolver<ResolversTypes['CreateUserExternalChurnZeroMappingPayloadResult'], ParentType, ContextType, RequireFields<MutationCreateUserExternalChurnZeroMappingArgs, 'input'>>;
  deleteDistrictPurchasedPackage?: Resolver<ResolversTypes['DeleteDistrictPurchasedPackagePayloadResult'], ParentType, ContextType, RequireFields<MutationDeleteDistrictPurchasedPackageArgs, 'input'>>;
  deleteStudentGroupPackageAssignment?: Resolver<ResolversTypes['DeleteStudentGroupPackageAssignmentPayloadResult'], ParentType, ContextType, RequireFields<MutationDeleteStudentGroupPackageAssignmentArgs, 'input'>>;
  deleteStudentStudentGroupAffiliation?: Resolver<ResolversTypes['DeleteStudentStudentGroupAffiliationPayloadResult'], ParentType, ContextType, RequireFields<MutationDeleteStudentStudentGroupAffiliationArgs, 'input'>>;
  deleteTeacherOrganizationAffiliation?: Resolver<ResolversTypes['DeleteTeacherOrganizationAffiliationPayloadResult'], ParentType, ContextType, RequireFields<MutationDeleteTeacherOrganizationAffiliationArgs, 'input'>>;
  updateAdministrator?: Resolver<ResolversTypes['UpdateAdministratorPayloadResult'], ParentType, ContextType, RequireFields<MutationUpdateAdministratorArgs, 'input'>>;
  updateClasslinkTenantCredential?: Resolver<ResolversTypes['UpdateClasslinkTenantCredentialPayloadResult'], ParentType, ContextType, RequireFields<MutationUpdateClasslinkTenantCredentialArgs, 'input'>>;
  updateDistrict?: Resolver<ResolversTypes['UpdateDistrictPayloadResult'], ParentType, ContextType, RequireFields<MutationUpdateDistrictArgs, 'input'>>;
  updateHumanUser?: Resolver<ResolversTypes['UpdateHumanUserPayloadResult'], ParentType, ContextType, RequireFields<MutationUpdateHumanUserArgs, 'input'>>;
  updateOrganization?: Resolver<ResolversTypes['UpdateOrganizationPayloadResult'], ParentType, ContextType, RequireFields<MutationUpdateOrganizationArgs, 'input'>>;
  updateStudent?: Resolver<ResolversTypes['UpdateStudentPayloadResult'], ParentType, ContextType, RequireFields<MutationUpdateStudentArgs, 'input'>>;
  updateStudentGroup?: Resolver<Maybe<ResolversTypes['UpdateStudentGroupPayloadResult']>, ParentType, ContextType, RequireFields<MutationUpdateStudentGroupArgs, 'input'>>;
  updateTeacher?: Resolver<ResolversTypes['UpdateTeacherPayloadResult'], ParentType, ContextType, RequireFields<MutationUpdateTeacherArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['UpdateUserPayloadResult'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  updateUserExternalChurnZeroMapping?: Resolver<ResolversTypes['UpdateUserExternalChurnZeroMappingPayloadResult'], ParentType, ContextType, RequireFields<MutationUpdateUserExternalChurnZeroMappingArgs, 'input'>>;
}>;

export type OrganizationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = ResolversObject<{
  classlinkTenantId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  districtId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  externalLmsOrganizationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrganizationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Organizations'] = ResolversParentTypes['Organizations']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Organization']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrganizationsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrganizationsResult'] = ResolversParentTypes['OrganizationsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'Organizations', ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  administrators?: Resolver<Maybe<ResolversTypes['AdministratorsResult']>, ParentType, ContextType>;
  codeillusionPackageChapterDefinitions?: Resolver<ResolversTypes['CodeillusionPackageChapterDefinitionsResult'], ParentType, ContextType>;
  codeillusionPackageCircleDefinitions?: Resolver<ResolversTypes['CodeillusionPackageCircleDefinitionsResult'], ParentType, ContextType, RequireFields<QueryCodeillusionPackageCircleDefinitionsArgs, 'codeillusionPackageChapterDefinitionId'>>;
  codeillusionPackageLessonDefinitions?: Resolver<ResolversTypes['CodeillusionPackageLessonDefinitionsResult'], ParentType, ContextType, RequireFields<QueryCodeillusionPackageLessonDefinitionsArgs, 'codeillusionPackageCircleDefinitionId'>>;
  csePackageLessonDefinitions?: Resolver<ResolversTypes['CsePackageLessonDefinitionsResult'], ParentType, ContextType, RequireFields<QueryCsePackageLessonDefinitionsArgs, 'csePackageUnitDefinitionId'>>;
  csePackageUnitDefinitions?: Resolver<ResolversTypes['CsePackageUnitDefinitionsResult'], ParentType, ContextType>;
  curriculumBrands?: Resolver<ResolversTypes['CurriculumBrandsResult'], ParentType, ContextType>;
  curriculumPackageLessonConfigurations?: Resolver<ResolversTypes['CurriculumPackageLessonConfigurationsResult'], ParentType, ContextType, RequireFields<QueryCurriculumPackageLessonConfigurationsArgs, 'curriculumPackageId'>>;
  curriculumPackages?: Resolver<ResolversTypes['CurriculumPackagesResult'], ParentType, ContextType, RequireFields<QueryCurriculumPackagesArgs, 'curriculumBrandId'>>;
  districtRosterSyncStatuses?: Resolver<Maybe<ResolversTypes['DistrictRosterSyncStatusesResult']>, ParentType, ContextType, Partial<QueryDistrictRosterSyncStatusesArgs>>;
  districts?: Resolver<Maybe<ResolversTypes['DistrictsResult']>, ParentType, ContextType>;
  hc?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  humanUsers?: Resolver<Maybe<ResolversTypes['HumanUsersResult']>, ParentType, ContextType, Partial<QueryHumanUsersArgs>>;
  lesson?: Resolver<ResolversTypes['LessonResult'], ParentType, ContextType, RequireFields<QueryLessonArgs, 'lessonId'>>;
  lessonHints?: Resolver<Maybe<ResolversTypes['LessonHintsResult']>, ParentType, ContextType>;
  lessonQuizzes?: Resolver<Maybe<ResolversTypes['LessonQuizzesResult']>, ParentType, ContextType>;
  lessonSteps?: Resolver<Maybe<ResolversTypes['LessonStepsResult']>, ParentType, ContextType, RequireFields<QueryLessonStepsArgs, 'lessonId'>>;
  lessons?: Resolver<ResolversTypes['LessonsResult'], ParentType, ContextType>;
  organizations?: Resolver<Maybe<ResolversTypes['OrganizationsResult']>, ParentType, ContextType>;
  studentGroupPackageAssignments?: Resolver<Maybe<ResolversTypes['StudentGroupPackageAssignmentsResult']>, ParentType, ContextType, Partial<QueryStudentGroupPackageAssignmentsArgs>>;
  studentGroups?: Resolver<Maybe<ResolversTypes['StudentGroupsResult']>, ParentType, ContextType, Partial<QueryStudentGroupsArgs>>;
  studentStudentGroupAffiliations?: Resolver<Maybe<ResolversTypes['StudentStudentGroupAffiliationsResult']>, ParentType, ContextType, RequireFields<QueryStudentStudentGroupAffiliationsArgs, 'studentGroupId'>>;
  students?: Resolver<Maybe<ResolversTypes['StudentsResult']>, ParentType, ContextType, RequireFields<QueryStudentsArgs, 'studentGroupId'>>;
  teacherOrganizationAffiliations?: Resolver<Maybe<ResolversTypes['TeacherOrganizationAffiliationsResult']>, ParentType, ContextType>;
  teachers?: Resolver<Maybe<ResolversTypes['TeachersResult']>, ParentType, ContextType>;
  userExternalChurnZeroMapping?: Resolver<Maybe<ResolversTypes['UserExternalChurnZeroMappingResult']>, ParentType, ContextType, RequireFields<QueryUserExternalChurnZeroMappingArgs, 'userId'>>;
  userLessonHintStatuses?: Resolver<Maybe<ResolversTypes['UserLessonHintStatusesResult']>, ParentType, ContextType>;
  userLessonStepStatuses?: Resolver<Maybe<ResolversTypes['UserLessonStepStatusesResult']>, ParentType, ContextType, RequireFields<QueryUserLessonStepStatusesArgs, 'userIds'>>;
  users?: Resolver<Maybe<ResolversTypes['UsersResult']>, ParentType, ContextType>;
}>;

export type StudentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Student'] = ResolversParentTypes['Student']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  externalLmsStudentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  humanUser?: Resolver<ResolversTypes['HumanUser'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDeactivated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  nickName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentGroup'] = ResolversParentTypes['StudentGroup']> = ResolversObject<{
  classlinkTenantId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  externalLmsStudentGroupId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  grade?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentGroupPackageAssignmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentGroupPackageAssignment'] = ResolversParentTypes['StudentGroupPackageAssignment']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  curriculumBrandId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  curriculumPackageId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  packageCategoryId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  studentGroupId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentGroupPackageAssignmentsResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentGroupPackageAssignments'] = ResolversParentTypes['StudentGroupPackageAssignments']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['StudentGroupPackageAssignment']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentGroupPackageAssignmentsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentGroupPackageAssignmentsResult'] = ResolversParentTypes['StudentGroupPackageAssignmentsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'StudentGroupPackageAssignments', ParentType, ContextType>;
}>;

export type StudentGroupsResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentGroups'] = ResolversParentTypes['StudentGroups']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['StudentGroup']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentGroupsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentGroupsResult'] = ResolversParentTypes['StudentGroupsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'StudentGroups', ParentType, ContextType>;
}>;

export type StudentStudentGroupAffiliationResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentStudentGroupAffiliation'] = ResolversParentTypes['StudentStudentGroupAffiliation']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  studentGroupId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  studentId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentStudentGroupAffiliationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentStudentGroupAffiliations'] = ResolversParentTypes['StudentStudentGroupAffiliations']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['StudentStudentGroupAffiliation']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentStudentGroupAffiliationsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentStudentGroupAffiliationsResult'] = ResolversParentTypes['StudentStudentGroupAffiliationsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'StudentStudentGroupAffiliations', ParentType, ContextType>;
}>;

export type StudentsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Students'] = ResolversParentTypes['Students']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Student']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentsResult'] = ResolversParentTypes['StudentsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'Students', ParentType, ContextType>;
}>;

export type TeacherResolvers<ContextType = any, ParentType extends ResolversParentTypes['Teacher'] = ResolversParentTypes['Teacher']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  externalLmsTeacherId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  humanUser?: Resolver<ResolversTypes['HumanUser'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDeactivated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeacherOrganizationAffiliationResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeacherOrganizationAffiliation'] = ResolversParentTypes['TeacherOrganizationAffiliation']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teacherId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeacherOrganizationAffiliationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeacherOrganizationAffiliations'] = ResolversParentTypes['TeacherOrganizationAffiliations']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['TeacherOrganizationAffiliation']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeacherOrganizationAffiliationsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeacherOrganizationAffiliationsResult'] = ResolversParentTypes['TeacherOrganizationAffiliationsResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'TeacherOrganizationAffiliations', ParentType, ContextType>;
}>;

export type TeachersResolvers<ContextType = any, ParentType extends ResolversParentTypes['Teachers'] = ResolversParentTypes['Teachers']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Teacher']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeachersResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeachersResult'] = ResolversParentTypes['TeachersResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'Teachers', ParentType, ContextType>;
}>;

export type UpdateAdministratorPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAdministratorPayload'] = ResolversParentTypes['UpdateAdministratorPayload']> = ResolversObject<{
  administrator?: Resolver<ResolversTypes['Administrator'], ParentType, ContextType>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateAdministratorPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAdministratorPayloadResult'] = ResolversParentTypes['UpdateAdministratorPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UpdateAdministratorPayload', ParentType, ContextType>;
}>;

export type UpdateClasslinkTenantCredentialPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateClasslinkTenantCredentialPayload'] = ResolversParentTypes['UpdateClasslinkTenantCredentialPayload']> = ResolversObject<{
  classlinkTenantCredential?: Resolver<ResolversTypes['ClasslinkTenantCredential'], ParentType, ContextType>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateClasslinkTenantCredentialPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateClasslinkTenantCredentialPayloadResult'] = ResolversParentTypes['UpdateClasslinkTenantCredentialPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UpdateClasslinkTenantCredentialPayload', ParentType, ContextType>;
}>;

export type UpdateDistrictPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateDistrictPayload'] = ResolversParentTypes['UpdateDistrictPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  district?: Resolver<ResolversTypes['District'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateDistrictPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateDistrictPayloadResult'] = ResolversParentTypes['UpdateDistrictPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UpdateDistrictPayload', ParentType, ContextType>;
}>;

export type UpdateHumanUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateHumanUserPayload'] = ResolversParentTypes['UpdateHumanUserPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  humanUser?: Resolver<ResolversTypes['HumanUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateHumanUserPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateHumanUserPayloadResult'] = ResolversParentTypes['UpdateHumanUserPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UpdateHumanUserPayload', ParentType, ContextType>;
}>;

export type UpdateOrganizationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateOrganizationPayload'] = ResolversParentTypes['UpdateOrganizationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateOrganizationPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateOrganizationPayloadResult'] = ResolversParentTypes['UpdateOrganizationPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UpdateOrganizationPayload', ParentType, ContextType>;
}>;

export type UpdateStudentGroupPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateStudentGroupPayload'] = ResolversParentTypes['UpdateStudentGroupPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  studentGroup?: Resolver<ResolversTypes['StudentGroup'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateStudentGroupPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateStudentGroupPayloadResult'] = ResolversParentTypes['UpdateStudentGroupPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UpdateStudentGroupPayload', ParentType, ContextType>;
}>;

export type UpdateStudentPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateStudentPayload'] = ResolversParentTypes['UpdateStudentPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  student?: Resolver<ResolversTypes['Student'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateStudentPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateStudentPayloadResult'] = ResolversParentTypes['UpdateStudentPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UpdateStudentPayload', ParentType, ContextType>;
}>;

export type UpdateTeacherPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTeacherPayload'] = ResolversParentTypes['UpdateTeacherPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  teacher?: Resolver<ResolversTypes['Teacher'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateTeacherPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTeacherPayloadResult'] = ResolversParentTypes['UpdateTeacherPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UpdateTeacherPayload', ParentType, ContextType>;
}>;

export type UpdateUserExternalChurnZeroMappingPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUserExternalChurnZeroMappingPayload'] = ResolversParentTypes['UpdateUserExternalChurnZeroMappingPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userExternalChurnZeroMapping?: Resolver<ResolversTypes['UserExternalChurnZeroMapping'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateUserExternalChurnZeroMappingPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUserExternalChurnZeroMappingPayloadResult'] = ResolversParentTypes['UpdateUserExternalChurnZeroMappingPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UpdateUserExternalChurnZeroMappingPayload', ParentType, ContextType>;
}>;

export type UpdateUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUserPayload'] = ResolversParentTypes['UpdateUserPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateUserPayloadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUserPayloadResult'] = ResolversParentTypes['UpdateUserPayloadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UpdateUserPayload', ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDemo?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserExternalChurnZeroMappingResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserExternalChurnZeroMapping'] = ResolversParentTypes['UserExternalChurnZeroMapping']> = ResolversObject<{
  externalChurnZeroAccountExternalId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  externalChurnZeroContactExternalId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserExternalChurnZeroMappingResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserExternalChurnZeroMappingResult'] = ResolversParentTypes['UserExternalChurnZeroMappingResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UserExternalChurnZeroMapping', ParentType, ContextType>;
}>;

export type UserLessonHintStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLessonHintStatus'] = ResolversParentTypes['UserLessonHintStatus']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessonHintId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userLessonStatusId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserLessonHintStatusesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLessonHintStatuses'] = ResolversParentTypes['UserLessonHintStatuses']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['UserLessonHintStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserLessonHintStatusesResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLessonHintStatusesResult'] = ResolversParentTypes['UserLessonHintStatusesResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UserLessonHintStatuses', ParentType, ContextType>;
}>;

export type UserLessonStepStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLessonStepStatus'] = ResolversParentTypes['UserLessonStepStatus']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessonId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userLessonStatusId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserLessonStepStatusesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLessonStepStatuses'] = ResolversParentTypes['UserLessonStepStatuses']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['UserLessonStepStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserLessonStepStatusesResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLessonStepStatusesResult'] = ResolversParentTypes['UserLessonStepStatusesResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'UserLessonStepStatuses', ParentType, ContextType>;
}>;

export type UsersResolvers<ContextType = any, ParentType extends ResolversParentTypes['Users'] = ResolversParentTypes['Users']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UsersResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsersResult'] = ResolversParentTypes['UsersResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorPermissionDenied' | 'ErrorUnknownRuntime' | 'Users', ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Administrator?: AdministratorResolvers<ContextType>;
  Administrators?: AdministratorsResolvers<ContextType>;
  AdministratorsResult?: AdministratorsResultResolvers<ContextType>;
  ClasslinkTenantCredential?: ClasslinkTenantCredentialResolvers<ContextType>;
  CodeillusionPackageChapterDefinition?: CodeillusionPackageChapterDefinitionResolvers<ContextType>;
  CodeillusionPackageChapterDefinitions?: CodeillusionPackageChapterDefinitionsResolvers<ContextType>;
  CodeillusionPackageChapterDefinitionsResult?: CodeillusionPackageChapterDefinitionsResultResolvers<ContextType>;
  CodeillusionPackageCircleDefinition?: CodeillusionPackageCircleDefinitionResolvers<ContextType>;
  CodeillusionPackageCircleDefinitions?: CodeillusionPackageCircleDefinitionsResolvers<ContextType>;
  CodeillusionPackageCircleDefinitionsResult?: CodeillusionPackageCircleDefinitionsResultResolvers<ContextType>;
  CodeillusionPackageLessonDefinition?: CodeillusionPackageLessonDefinitionResolvers<ContextType>;
  CodeillusionPackageLessonDefinitions?: CodeillusionPackageLessonDefinitionsResolvers<ContextType>;
  CodeillusionPackageLessonDefinitionsResult?: CodeillusionPackageLessonDefinitionsResultResolvers<ContextType>;
  CreateAdministratorPayload?: CreateAdministratorPayloadResolvers<ContextType>;
  CreateAdministratorPayloadResult?: CreateAdministratorPayloadResultResolvers<ContextType>;
  CreateClasslinkTenantCredentialPayload?: CreateClasslinkTenantCredentialPayloadResolvers<ContextType>;
  CreateClasslinkTenantCredentialPayloadResult?: CreateClasslinkTenantCredentialPayloadResultResolvers<ContextType>;
  CreateDistrictPayload?: CreateDistrictPayloadResolvers<ContextType>;
  CreateDistrictPayloadResult?: CreateDistrictPayloadResultResolvers<ContextType>;
  CreateDistrictPurchasedPackagePayload?: CreateDistrictPurchasedPackagePayloadResolvers<ContextType>;
  CreateDistrictPurchasedPackagePayloadResult?: CreateDistrictPurchasedPackagePayloadResultResolvers<ContextType>;
  CreateHumanUserPayload?: CreateHumanUserPayloadResolvers<ContextType>;
  CreateHumanUserPayloadResult?: CreateHumanUserPayloadResultResolvers<ContextType>;
  CreateOrganizationPayload?: CreateOrganizationPayloadResolvers<ContextType>;
  CreateOrganizationPayloadResult?: CreateOrganizationPayloadResultResolvers<ContextType>;
  CreateStudentGroupPackageAssignmentPayload?: CreateStudentGroupPackageAssignmentPayloadResolvers<ContextType>;
  CreateStudentGroupPackageAssignmentPayloadResult?: CreateStudentGroupPackageAssignmentPayloadResultResolvers<ContextType>;
  CreateStudentGroupPayload?: CreateStudentGroupPayloadResolvers<ContextType>;
  CreateStudentGroupPayloadResult?: CreateStudentGroupPayloadResultResolvers<ContextType>;
  CreateStudentPayload?: CreateStudentPayloadResolvers<ContextType>;
  CreateStudentPayloadResult?: CreateStudentPayloadResultResolvers<ContextType>;
  CreateStudentStudentGroupAffiliationPayload?: CreateStudentStudentGroupAffiliationPayloadResolvers<ContextType>;
  CreateStudentStudentGroupAffiliationPayloadResult?: CreateStudentStudentGroupAffiliationPayloadResultResolvers<ContextType>;
  CreateTeacherOrganizationAffiliationPayload?: CreateTeacherOrganizationAffiliationPayloadResolvers<ContextType>;
  CreateTeacherOrganizationAffiliationPayloadResult?: CreateTeacherOrganizationAffiliationPayloadResultResolvers<ContextType>;
  CreateTeacherPayload?: CreateTeacherPayloadResolvers<ContextType>;
  CreateTeacherPayloadResult?: CreateTeacherPayloadResultResolvers<ContextType>;
  CreateUserExternalChurnZeroMappingPayload?: CreateUserExternalChurnZeroMappingPayloadResolvers<ContextType>;
  CreateUserExternalChurnZeroMappingPayloadResult?: CreateUserExternalChurnZeroMappingPayloadResultResolvers<ContextType>;
  CreateUserPayload?: CreateUserPayloadResolvers<ContextType>;
  CreateUserPayloadResult?: CreateUserPayloadResultResolvers<ContextType>;
  CsePackageLessonDefinition?: CsePackageLessonDefinitionResolvers<ContextType>;
  CsePackageLessonDefinitions?: CsePackageLessonDefinitionsResolvers<ContextType>;
  CsePackageLessonDefinitionsResult?: CsePackageLessonDefinitionsResultResolvers<ContextType>;
  CsePackageUnitDefinition?: CsePackageUnitDefinitionResolvers<ContextType>;
  CsePackageUnitDefinitions?: CsePackageUnitDefinitionsResolvers<ContextType>;
  CsePackageUnitDefinitionsResult?: CsePackageUnitDefinitionsResultResolvers<ContextType>;
  CurriculumBrand?: CurriculumBrandResolvers<ContextType>;
  CurriculumBrands?: CurriculumBrandsResolvers<ContextType>;
  CurriculumBrandsResult?: CurriculumBrandsResultResolvers<ContextType>;
  CurriculumPackage?: CurriculumPackageResolvers<ContextType>;
  CurriculumPackageLessonConfiguration?: CurriculumPackageLessonConfigurationResolvers<ContextType>;
  CurriculumPackageLessonConfigurations?: CurriculumPackageLessonConfigurationsResolvers<ContextType>;
  CurriculumPackageLessonConfigurationsResult?: CurriculumPackageLessonConfigurationsResultResolvers<ContextType>;
  CurriculumPackages?: CurriculumPackagesResolvers<ContextType>;
  CurriculumPackagesResult?: CurriculumPackagesResultResolvers<ContextType>;
  DeleteDistrictPurchasedPackagePayload?: DeleteDistrictPurchasedPackagePayloadResolvers<ContextType>;
  DeleteDistrictPurchasedPackagePayloadResult?: DeleteDistrictPurchasedPackagePayloadResultResolvers<ContextType>;
  DeleteStudentGroupPackageAssignmentPayload?: DeleteStudentGroupPackageAssignmentPayloadResolvers<ContextType>;
  DeleteStudentGroupPackageAssignmentPayloadResult?: DeleteStudentGroupPackageAssignmentPayloadResultResolvers<ContextType>;
  DeleteStudentStudentGroupAffiliationPayload?: DeleteStudentStudentGroupAffiliationPayloadResolvers<ContextType>;
  DeleteStudentStudentGroupAffiliationPayloadResult?: DeleteStudentStudentGroupAffiliationPayloadResultResolvers<ContextType>;
  DeleteTeacherOrganizationAffiliationPayload?: DeleteTeacherOrganizationAffiliationPayloadResolvers<ContextType>;
  DeleteTeacherOrganizationAffiliationPayloadResult?: DeleteTeacherOrganizationAffiliationPayloadResultResolvers<ContextType>;
  District?: DistrictResolvers<ContextType>;
  DistrictPurchasedPackage?: DistrictPurchasedPackageResolvers<ContextType>;
  DistrictRosterSyncStatus?: DistrictRosterSyncStatusResolvers<ContextType>;
  DistrictRosterSyncStatuses?: DistrictRosterSyncStatusesResolvers<ContextType>;
  DistrictRosterSyncStatusesResult?: DistrictRosterSyncStatusesResultResolvers<ContextType>;
  Districts?: DistrictsResolvers<ContextType>;
  DistrictsResult?: DistrictsResultResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  ErrorNotFound?: ErrorNotFoundResolvers<ContextType>;
  ErrorPermissionDenied?: ErrorPermissionDeniedResolvers<ContextType>;
  ErrorUnknownRuntime?: ErrorUnknownRuntimeResolvers<ContextType>;
  HumanUser?: HumanUserResolvers<ContextType>;
  HumanUsers?: HumanUsersResolvers<ContextType>;
  HumanUsersResult?: HumanUsersResultResolvers<ContextType>;
  Lesson?: LessonResolvers<ContextType>;
  LessonHint?: LessonHintResolvers<ContextType>;
  LessonHints?: LessonHintsResolvers<ContextType>;
  LessonHintsResult?: LessonHintsResultResolvers<ContextType>;
  LessonQuiz?: LessonQuizResolvers<ContextType>;
  LessonQuizzes?: LessonQuizzesResolvers<ContextType>;
  LessonQuizzesResult?: LessonQuizzesResultResolvers<ContextType>;
  LessonResult?: LessonResultResolvers<ContextType>;
  LessonStep?: LessonStepResolvers<ContextType>;
  LessonSteps?: LessonStepsResolvers<ContextType>;
  LessonStepsResult?: LessonStepsResultResolvers<ContextType>;
  Lessons?: LessonsResolvers<ContextType>;
  LessonsResult?: LessonsResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  Organizations?: OrganizationsResolvers<ContextType>;
  OrganizationsResult?: OrganizationsResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Student?: StudentResolvers<ContextType>;
  StudentGroup?: StudentGroupResolvers<ContextType>;
  StudentGroupPackageAssignment?: StudentGroupPackageAssignmentResolvers<ContextType>;
  StudentGroupPackageAssignments?: StudentGroupPackageAssignmentsResolvers<ContextType>;
  StudentGroupPackageAssignmentsResult?: StudentGroupPackageAssignmentsResultResolvers<ContextType>;
  StudentGroups?: StudentGroupsResolvers<ContextType>;
  StudentGroupsResult?: StudentGroupsResultResolvers<ContextType>;
  StudentStudentGroupAffiliation?: StudentStudentGroupAffiliationResolvers<ContextType>;
  StudentStudentGroupAffiliations?: StudentStudentGroupAffiliationsResolvers<ContextType>;
  StudentStudentGroupAffiliationsResult?: StudentStudentGroupAffiliationsResultResolvers<ContextType>;
  Students?: StudentsResolvers<ContextType>;
  StudentsResult?: StudentsResultResolvers<ContextType>;
  Teacher?: TeacherResolvers<ContextType>;
  TeacherOrganizationAffiliation?: TeacherOrganizationAffiliationResolvers<ContextType>;
  TeacherOrganizationAffiliations?: TeacherOrganizationAffiliationsResolvers<ContextType>;
  TeacherOrganizationAffiliationsResult?: TeacherOrganizationAffiliationsResultResolvers<ContextType>;
  Teachers?: TeachersResolvers<ContextType>;
  TeachersResult?: TeachersResultResolvers<ContextType>;
  UpdateAdministratorPayload?: UpdateAdministratorPayloadResolvers<ContextType>;
  UpdateAdministratorPayloadResult?: UpdateAdministratorPayloadResultResolvers<ContextType>;
  UpdateClasslinkTenantCredentialPayload?: UpdateClasslinkTenantCredentialPayloadResolvers<ContextType>;
  UpdateClasslinkTenantCredentialPayloadResult?: UpdateClasslinkTenantCredentialPayloadResultResolvers<ContextType>;
  UpdateDistrictPayload?: UpdateDistrictPayloadResolvers<ContextType>;
  UpdateDistrictPayloadResult?: UpdateDistrictPayloadResultResolvers<ContextType>;
  UpdateHumanUserPayload?: UpdateHumanUserPayloadResolvers<ContextType>;
  UpdateHumanUserPayloadResult?: UpdateHumanUserPayloadResultResolvers<ContextType>;
  UpdateOrganizationPayload?: UpdateOrganizationPayloadResolvers<ContextType>;
  UpdateOrganizationPayloadResult?: UpdateOrganizationPayloadResultResolvers<ContextType>;
  UpdateStudentGroupPayload?: UpdateStudentGroupPayloadResolvers<ContextType>;
  UpdateStudentGroupPayloadResult?: UpdateStudentGroupPayloadResultResolvers<ContextType>;
  UpdateStudentPayload?: UpdateStudentPayloadResolvers<ContextType>;
  UpdateStudentPayloadResult?: UpdateStudentPayloadResultResolvers<ContextType>;
  UpdateTeacherPayload?: UpdateTeacherPayloadResolvers<ContextType>;
  UpdateTeacherPayloadResult?: UpdateTeacherPayloadResultResolvers<ContextType>;
  UpdateUserExternalChurnZeroMappingPayload?: UpdateUserExternalChurnZeroMappingPayloadResolvers<ContextType>;
  UpdateUserExternalChurnZeroMappingPayloadResult?: UpdateUserExternalChurnZeroMappingPayloadResultResolvers<ContextType>;
  UpdateUserPayload?: UpdateUserPayloadResolvers<ContextType>;
  UpdateUserPayloadResult?: UpdateUserPayloadResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserExternalChurnZeroMapping?: UserExternalChurnZeroMappingResolvers<ContextType>;
  UserExternalChurnZeroMappingResult?: UserExternalChurnZeroMappingResultResolvers<ContextType>;
  UserLessonHintStatus?: UserLessonHintStatusResolvers<ContextType>;
  UserLessonHintStatuses?: UserLessonHintStatusesResolvers<ContextType>;
  UserLessonHintStatusesResult?: UserLessonHintStatusesResultResolvers<ContextType>;
  UserLessonStepStatus?: UserLessonStepStatusResolvers<ContextType>;
  UserLessonStepStatuses?: UserLessonStepStatusesResolvers<ContextType>;
  UserLessonStepStatusesResult?: UserLessonStepStatusesResultResolvers<ContextType>;
  Users?: UsersResolvers<ContextType>;
  UsersResult?: UsersResultResolvers<ContextType>;
}>;

