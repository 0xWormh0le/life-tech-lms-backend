/**
* Delete an administrator
* delete an administrator
*
* administratorId String
* returns getClasslinkRosterSync_200_response
* */
export function deleteAdministrator({ administratorId }: {
    administratorId: any;
}): Promise<any>;
/**
* Delete district
* Delete district
*
* districtId String
* returns getClasslinkRosterSync_200_response
* */
export function deleteDistrict({ districtId }: {
    districtId: any;
}): Promise<any>;
/**
* Delete Organization
* Organization DELETE API call when user want to delete organization in system.
*
* organizationId String
* returns getClasslinkRosterSync_200_response
* */
export function deleteOrganization({ organizationId }: {
    organizationId: any;
}): Promise<any>;
/**
* Delete Student
* Student DELETE API call when user want to delete student in system.
*
* studentId String
* returns getClasslinkRosterSync_200_response
* */
export function deleteStudent({ studentId }: {
    studentId: any;
}): Promise<any>;
/**
* This API remove student in studentgroup
* DELETE API call when user Internal Operator or Administrator want to remove the student from studentGroup.
*
* studentGroupId String
* studentId String
* returns getClasslinkRosterSync_200_response
* */
export function deleteStudentFromStudentGroup({ studentGroupId, studentId }: {
    studentGroupId: any;
    studentId: any;
}): Promise<any>;
/**
* Delete Student Group
* Delete Student Group
*
* studentGroupId String
* returns getClasslinkRosterSync_200_response
* */
export function deleteStudentGroup({ studentGroupId }: {
    studentGroupId: any;
}): Promise<any>;
/**
* Remove restrict lessons from student group.
* Delete API call when teacher / internal operator / district administrator want to remove restrict lesson access to their student group.
*
* studentGroupId String
* lessonIds List
* returns getClasslinkRosterSync_200_response
* */
export function deleteStudentGroupUnaccessibleLesson({ studentGroupId, lessonIds }: {
    studentGroupId: any;
    lessonIds: any;
}): Promise<any>;
/**
* Delete an teacher
* delete an teacher
*
* teacherId String
* returns getClasslinkRosterSync_200_response
* */
export function deleteTeacher({ teacherId }: {
    teacherId: any;
}): Promise<any>;
/**
* Remove the teacher from organization
* DELETE API call when user(Internal Operator/Administrator) want to remove the teacher from organization.
*
* organizationId String
* teacherId String
* returns getClasslinkRosterSync_200_response
* */
export function deleteTeacherFromOrganization({ organizationId, teacherId }: {
    organizationId: any;
    teacherId: any;
}): Promise<any>;
/**
* Delete User Package Assignment
* This API deletes the UserPackageAssignment which are assigned to the specified user.
*
* deleteUserPackageAssignmentRequest DeleteUserPackageAssignmentRequest  (optional)
* returns deleteUserPackageAssignment_200_response
* */
export function deleteUserPackageAssignment({ deleteUserPackageAssignmentRequest }: {
    deleteUserPackageAssignmentRequest: any;
}): Promise<any>;
/**
* Get All Administrators
* This API provides a list of all the administrators.
*
* districtId String
* administratorIds List  (optional)
* returns getAdministrators_200_response
* */
export function getAdministrators({ districtId, administratorIds }: {
    districtId: any;
    administratorIds: any;
}): Promise<any>;
/**
* Get all the packages availaible in codex
*
* returns getAllPackages_200_response
* */
export function getAllPackages(): Promise<any>;
/**
* Get CodeIllusion Package
*
* packageId String
* returns getUsersUserIdCodeIllusionPackages_200_response
* */
export function getCodeIllusionPackage({ packageId }: {
    packageId: any;
}): Promise<any>;
/**
* Get Cse Package
*
* packageId String
* returns getCsePackage_200_response
* */
export function getCsePackage({ packageId }: {
    packageId: any;
}): Promise<any>;
/**
* Get District By districtId
* This API gives the district by districtId.
*
* districtId String
* returns District
* */
export function getDistrictByDistrictId({ districtId }: {
    districtId: any;
}): Promise<any>;
/**
* Get district lms information based on organizationId
* This API provides the district lms information based on organizationId.
*
* organizationId String
* returns getDistrictLMSInformationByOrganization_200_response
* */
export function getDistrictLMSInformationByOrganization({ organizationId }: {
    organizationId: any;
}): Promise<any>;
/**
* Get all district purchased packages
*
* districtId String
* returns getDistrictPurchasedPackagesByDistrictId_200_response
* */
export function getDistrictPurchasedPackagesByDistrictId({ districtId }: {
    districtId: any;
}): Promise<any>;
/**
* Get roster sync status of district.
* This API provides roster sync status of district.
*
* districtId String
* returns getDistrictRosterSyncStatus_200_response
* */
export function getDistrictRosterSyncStatus({ districtId }: {
    districtId: any;
}): Promise<any>;
/**
* Get All Districts
* This API provides all the Districts. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* districtIds List  (optional)
* lMSId String  (optional)
* enabledRosterSync Boolean  (optional)
* returns getDistricts_200_response
* */
export function getDistricts({ districtIds, lMSId, enabledRosterSync }: {
    districtIds: any;
    lMSId: any;
    enabledRosterSync: any;
}): Promise<any>;
/**
* Get Lessons
* This API provides a list of Lesson definitions.
*
* lessonIds List
* returns getLessons_200_response
* */
export function getLessons({ lessonIds }: {
    lessonIds: any;
}): Promise<any>;
/**
* Get my details
*
* returns LoggedInUser
* */
export function getLoggedInUser(): Promise<any>;
/**
* Get All Organizations
* This API provides all the organizations. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* districtId String
* organizationIds List  (optional)
* returns getOrganizations_200_response
* */
export function getOrganizations({ districtId, organizationIds }: {
    districtId: any;
    organizationIds: any;
}): Promise<any>;
/**
* Get package details from studentGroupId.
*
* studentGroupId String
* returns getPackageDetailsByStudentGroupId_200_response
* */
export function getPackageDetailsByStudentGroupId({ studentGroupId }: {
    studentGroupId: any;
}): Promise<any>;
/**
* Get standard-mapping information based on state
* This API provides standard-mapping information of state.
*
* stateId String  (optional)
* returns getStandardMapping_200_response
* */
export function getStandardMapping({ stateId }: {
    stateId: any;
}): Promise<any>;
/**
* Get lesson statuses for student group.
* GET API call when teacher / internal operator / district administrator want to view lesson statuses for student group.
*
* studentGroupId String
* lessonIds List  (optional)
* returns getStudentGroupLessonStatuses_200_response
* */
export function getStudentGroupLessonStatuses({ studentGroupId, lessonIds }: {
    studentGroupId: any;
    lessonIds: any;
}): Promise<any>;
/**
* Get Student Groups Package Assignment based on queries
* This API provides the StudentGroupPackageAssignments based on queries
*
* studentGroupId String
* returns getStudentGroupPackageAssignments_200_response
* */
export function getStudentGroupPackageAssignments({ studentGroupId }: {
    studentGroupId: any;
}): Promise<any>;
/**
* Get Student Groups based on organizationId
* This API provides the student groups based on organizationId If the user pointed to by the token does not have permission to view the information for the specified student groups, an error will occur.
*
* organizationId String
* returns getStudentGroups_200_response
* */
export function getStudentGroups({ organizationId }: {
    organizationId: any;
}): Promise<any>;
/**
* Get student unaccessible lessons
* Get API call when user want to view restricted lesson.
*
* studentId String
* returns getStudentUnaccessibleLessons_200_response
* */
export function getStudentUnaccessibleLessons({ studentId }: {
    studentId: any;
}): Promise<any>;
/**
* Get Students API
* This API provides the students based on studentGroupId.
*
* studentGroupId String
* studentIds List  (optional)
* name String  (optional)
* option String  (optional)
* returns getStudents_200_response
* */
export function getStudents({ studentGroupId, studentIds, name, option }: {
    studentGroupId: any;
    studentIds: any;
    name: any;
    option: any;
}): Promise<any>;
/**
* Get Teacher's Organizations
* This API gives  the teacher's basic details and it's organization's details.
*
* teacherId String
* returns Teacher_Organization
* */
export function getTeacherOrganizations({ teacherId }: {
    teacherId: any;
}): Promise<any>;
/**
* Get Teachers based on organizationId
* This API provides the teachers based on organizationId
*
* organizationId String
* teacherIds List  (optional)
* returns getTeachers_200_response
* */
export function getTeachers({ organizationId, teacherIds }: {
    organizationId: any;
    teacherIds: any;
}): Promise<any>;
/**
* Get unaccessible lessons based on student group
* Get API call when teacher / internal operator / district administrator want to view restrict lesson access to their student group.
*
* studentGroupId String
* returns getUnaccessibleLessons_200_response
* */
export function getUnaccessibleLessons({ studentGroupId }: {
    studentGroupId: any;
}): Promise<any>;
/**
* Get User Package Assignment
* This API returns the UserPackageAssignment which are assigned to the specified user.
*
* userId String  (optional)
* packageId String  (optional)
* returns getUserPackageAssignments_200_response
* */
export function getUserPackageAssignments({ userId, packageId }: {
    userId: any;
    packageId: any;
}): Promise<any>;
/**
* Get User Settings
* This API provides Settings for the specified User. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* userId String
* returns getUserSettings_200_response
* */
export function getUserSettings({ userId }: {
    userId: any;
}): Promise<any>;
/**
* Get User's CodeIllusion Packages
* This API returns the CodeIllusionPacakges available to the specified user. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* userId String
* returns getUsersUserIdCodeIllusionPackages_200_response
* */
export function getUsersUserIdCodeIllusionPackages({ userId }: {
    userId: any;
}): Promise<any>;
/**
* Get User LessonStatuses
* This API provides Lesson Statuses for the specified User. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* userId String
* lessonIds List  (optional)
* returns getUsersUserIdLessonStatuses_200_response
* */
export function getUsersUserIdLessonStatuses({ userId, lessonIds }: {
    userId: any;
    lessonIds: any;
}): Promise<any>;
/**
* Create administrators from the given email ids
*
* districtId String
* administratorIds List  (optional)
* postAdministratorsRequest PostAdministratorsRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postAdministrators({ districtId, administratorIds, postAdministratorsRequest }: {
    districtId: any;
    administratorIds: any;
    postAdministratorsRequest: any;
}): Promise<any>;
/**
* District API POST
* District POST API call when user want to add district in system.
*
* postDistrictRequest PostDistrictRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postDistrict({ postDistrictRequest }: {
    postDistrictRequest: any;
}): Promise<any>;
/**
* Organization API POST
* Organization POST API call when user want to add organization in system.
*
* postOrganizationRequest PostOrganizationRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postOrganization({ postOrganizationRequest }: {
    postOrganizationRequest: any;
}): Promise<any>;
/**
* Student Group API POST
* Student Group POST API call when user want to add student group in system.
*
* organizationId String
* postStudentGroupRequest PostStudentGroupRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postStudentGroup({ organizationId, postStudentGroupRequest }: {
    organizationId: any;
    postStudentGroupRequest: any;
}): Promise<any>;
/**
* Restrict lesson to student.
* POST API call when teacher want to restrict lesson access to their student group.
*
* studentGroupId String
* lessonIds List
* postStudentGroupUnaccessibleLessonRequest PostStudentGroupUnaccessibleLessonRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postStudentGroupUnaccessibleLesson({ studentGroupId, lessonIds, postStudentGroupUnaccessibleLessonRequest }: {
    studentGroupId: any;
    lessonIds: any;
    postStudentGroupUnaccessibleLessonRequest: any;
}): Promise<any>;
/**
* Student API POST
* This API add existing student to student group
*
* studentGroupId String
* studentId String
* returns getClasslinkRosterSync_200_response
* */
export function postStudentInStudentGroup({ studentGroupId, studentId }: {
    studentGroupId: any;
    studentId: any;
}): Promise<any>;
/**
* Student API POST
*
* studentGroupId String
* postStudentsRequest PostStudentsRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postStudents({ studentGroupId, postStudentsRequest }: {
    studentGroupId: any;
    postStudentsRequest: any;
}): Promise<any>;
/**
* Add teacher into organization
* POST API call when user want to add teacher into organization.
*
* organizationId String
* teacherId String
* returns getClasslinkRosterSync_200_response
* */
export function postTeacherInOrganization({ organizationId, teacherId }: {
    organizationId: any;
    teacherId: any;
}): Promise<any>;
/**
* Create teachers
*
* organizationId String
* teacherIds List  (optional)
* postTeachersRequest PostTeachersRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postTeachers({ organizationId, teacherIds, postTeachersRequest }: {
    organizationId: any;
    teacherIds: any;
    postTeachersRequest: any;
}): Promise<any>;
/**
* User Lesson Status API POST
* This POST API call when user start the any lesson.
*
* postUserLessonStatusRequest PostUserLessonStatusRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postUserLessonStatus({ postUserLessonStatusRequest }: {
    postUserLessonStatusRequest: any;
}): Promise<any>;
/**
* Create User Package Assignment
* This API create the UserPackageAssignment.
*
* userPackageAssignment UserPackageAssignment  (optional)
* returns postUserPackageAssignment_200_response
* */
export function postUserPackageAssignment({ userPackageAssignment }: {
    userPackageAssignment: any;
}): Promise<any>;
/**
* Administrator API PUT
* Administrator PUT API call when user want to edit administrator in system.
*
* administratorId String
* putAdministratorRequest PutAdministratorRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function putAdministrator({ administratorId, putAdministratorRequest }: {
    administratorId: any;
    putAdministratorRequest: any;
}): Promise<any>;
/**
* PUT API call when teacher,administrator or internal operator want to change their password.
*
* putChangePasswordRequest PutChangePasswordRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function putChangePassword({ putChangePasswordRequest }: {
    putChangePasswordRequest: any;
}): Promise<any>;
/**
* District API PUT
* District PUT API call when user want to edit district in system.
*
* districtId String
* putDistrictRequest PutDistrictRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function putDistrict({ districtId, putDistrictRequest }: {
    districtId: any;
    putDistrictRequest: any;
}): Promise<any>;
/**
* Organization API PUT
* Organization PUT API call when user want to edit organization information in system.
*
* organizationId String
* postOrganizationRequest PostOrganizationRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function putOrganization({ organizationId, postOrganizationRequest }: {
    organizationId: any;
    postOrganizationRequest: any;
}): Promise<any>;
/**
* Student API PUT
* Student PUT API call when user want to edit student information in system.
*
* studentId String
* putStudentRequest PutStudentRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function putStudent({ studentId, putStudentRequest }: {
    studentId: any;
    putStudentRequest: any;
}): Promise<any>;
/**
* Student Group API PUT
* Student Group PUT API call when user want to edit student group in system.
*
* studentGroupId String
* putStudentGroupRequest PutStudentGroupRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function putStudentGroup({ studentGroupId, putStudentGroupRequest }: {
    studentGroupId: any;
    putStudentGroupRequest: any;
}): Promise<any>;
/**
* Teacher API PUT
* Teacher PUT API call when user want to edit teacher in system.
*
* teacherId String
* putTeacherRequest PutTeacherRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function putTeacher({ teacherId, putTeacherRequest }: {
    teacherId: any;
    putTeacherRequest: any;
}): Promise<any>;
/**
* Update User SoundSettings
* This API updates SoundSettings for the specified User. SoundSettings is the part of User's Settings. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* userId String
* userSoundSettings UserSoundSettings  (optional)
* returns updateUserSoundSettings_200_response
* */
export function updateUserSoundSettings({ userId, userSoundSettings }: {
    userId: any;
    userSoundSettings: any;
}): Promise<any>;
