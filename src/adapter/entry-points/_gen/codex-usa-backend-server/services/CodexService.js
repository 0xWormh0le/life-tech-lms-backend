/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Delete an administrator
* delete an administrator
*
* administratorId String 
* returns getClasslinkRosterSync_200_response
* */
const deleteAdministrator = ({ administratorId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        administratorId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete district
* Delete district
*
* districtId String 
* returns getClasslinkRosterSync_200_response
* */
const deleteDistrict = ({ districtId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        districtId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete Organization
* Organization DELETE API call when user want to delete organization in system.
*
* organizationId String 
* returns getClasslinkRosterSync_200_response
* */
const deleteOrganization = ({ organizationId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        organizationId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete Student
* Student DELETE API call when user want to delete student in system.
*
* studentId String 
* returns getClasslinkRosterSync_200_response
* */
const deleteStudent = ({ studentId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* This API remove student in studentgroup
* DELETE API call when user Internal Operator or Administrator want to remove the student from studentGroup.
*
* studentGroupId String 
* studentId String 
* returns getClasslinkRosterSync_200_response
* */
const deleteStudentFromStudentGroup = ({ studentGroupId, studentId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
        studentId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete Student Group
* Delete Student Group
*
* studentGroupId String 
* returns getClasslinkRosterSync_200_response
* */
const deleteStudentGroup = ({ studentGroupId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Remove restrict lessons from student group.
* Delete API call when teacher / internal operator / district administrator want to remove restrict lesson access to their student group.
*
* studentGroupId String 
* lessonIds List 
* returns getClasslinkRosterSync_200_response
* */
const deleteStudentGroupUnaccessibleLesson = ({ studentGroupId, lessonIds }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
        lessonIds,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete an teacher
* delete an teacher
*
* teacherId String 
* returns getClasslinkRosterSync_200_response
* */
const deleteTeacher = ({ teacherId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        teacherId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Remove the teacher from organization
* DELETE API call when user(Internal Operator/Administrator) want to remove the teacher from organization.
*
* organizationId String 
* teacherId String 
* returns getClasslinkRosterSync_200_response
* */
const deleteTeacherFromOrganization = ({ organizationId, teacherId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        organizationId,
        teacherId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete User Package Assignment
* This API deletes the UserPackageAssignment which are assigned to the specified user.
*
* deleteUserPackageAssignmentRequest DeleteUserPackageAssignmentRequest  (optional)
* returns deleteUserPackageAssignment_200_response
* */
const deleteUserPackageAssignment = ({ deleteUserPackageAssignmentRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        deleteUserPackageAssignmentRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get All Administrators
* This API provides a list of all the administrators.
*
* districtId String 
* administratorIds List  (optional)
* returns getAdministrators_200_response
* */
const getAdministrators = ({ districtId, administratorIds }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        districtId,
        administratorIds,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get all the packages availaible in codex
*
* returns getAllPackages_200_response
* */
const getAllPackages = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get CodeIllusion Package
*
* packageId String 
* returns getUsersUserIdCodeIllusionPackages_200_response
* */
const getCodeIllusionPackage = ({ packageId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        packageId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get Cse Package
*
* packageId String 
* returns getCsePackage_200_response
* */
const getCsePackage = ({ packageId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        packageId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get District By districtId
* This API gives the district by districtId.
*
* districtId String 
* returns District
* */
const getDistrictByDistrictId = ({ districtId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        districtId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get district lms information based on organizationId
* This API provides the district lms information based on organizationId.
*
* organizationId String 
* returns getDistrictLMSInformationByOrganization_200_response
* */
const getDistrictLMSInformationByOrganization = ({ organizationId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        organizationId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get all district purchased packages
*
* districtId String 
* returns getDistrictPurchasedPackagesByDistrictId_200_response
* */
const getDistrictPurchasedPackagesByDistrictId = ({ districtId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        districtId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get roster sync status of district.
* This API provides roster sync status of district.
*
* districtId String 
* returns getDistrictRosterSyncStatus_200_response
* */
const getDistrictRosterSyncStatus = ({ districtId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        districtId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get All Districts
* This API provides all the Districts. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* districtIds List  (optional)
* lMSId String  (optional)
* enabledRosterSync Boolean  (optional)
* returns getDistricts_200_response
* */
const getDistricts = ({ districtIds, lMSId, enabledRosterSync }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        districtIds,
        lMSId,
        enabledRosterSync,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get Lessons
* This API provides a list of Lesson definitions.
*
* lessonIds List 
* returns getLessons_200_response
* */
const getLessons = ({ lessonIds }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        lessonIds,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get my details
*
* returns LoggedInUser
* */
const getLoggedInUser = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get All Organizations
* This API provides all the organizations. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* districtId String 
* organizationIds List  (optional)
* returns getOrganizations_200_response
* */
const getOrganizations = ({ districtId, organizationIds }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        districtId,
        organizationIds,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get package details from studentGroupId.
*
* studentGroupId String 
* returns getPackageDetailsByStudentGroupId_200_response
* */
const getPackageDetailsByStudentGroupId = ({ studentGroupId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get standard-mapping information based on state
* This API provides standard-mapping information of state.
*
* stateId String  (optional)
* returns getStandardMapping_200_response
* */
const getStandardMapping = ({ stateId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        stateId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get lesson statuses for student group.
* GET API call when teacher / internal operator / district administrator want to view lesson statuses for student group.
*
* studentGroupId String 
* lessonIds List  (optional)
* returns getStudentGroupLessonStatuses_200_response
* */
const getStudentGroupLessonStatuses = ({ studentGroupId, lessonIds }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
        lessonIds,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get Student Groups Package Assignment based on queries
* This API provides the StudentGroupPackageAssignments based on queries
*
* studentGroupId String 
* returns getStudentGroupPackageAssignments_200_response
* */
const getStudentGroupPackageAssignments = ({ studentGroupId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get Student Groups based on organizationId
* This API provides the student groups based on organizationId If the user pointed to by the token does not have permission to view the information for the specified student groups, an error will occur.
*
* organizationId String 
* returns getStudentGroups_200_response
* */
const getStudentGroups = ({ organizationId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        organizationId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get student unaccessible lessons
* Get API call when user want to view restricted lesson.
*
* studentId String 
* returns getStudentUnaccessibleLessons_200_response
* */
const getStudentUnaccessibleLessons = ({ studentId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
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
const getStudents = ({ studentGroupId, studentIds, name, option }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
        studentIds,
        name,
        option,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get Teacher's Organizations
* This API gives  the teacher's basic details and it's organization's details.
*
* teacherId String 
* returns Teacher_Organization
* */
const getTeacherOrganizations = ({ teacherId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        teacherId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get Teachers based on organizationId
* This API provides the teachers based on organizationId
*
* organizationId String 
* teacherIds List  (optional)
* returns getTeachers_200_response
* */
const getTeachers = ({ organizationId, teacherIds }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        organizationId,
        teacherIds,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get unaccessible lessons based on student group
* Get API call when teacher / internal operator / district administrator want to view restrict lesson access to their student group.
*
* studentGroupId String 
* returns getUnaccessibleLessons_200_response
* */
const getUnaccessibleLessons = ({ studentGroupId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get User Package Assignment
* This API returns the UserPackageAssignment which are assigned to the specified user.
*
* userId String  (optional)
* packageId String  (optional)
* returns getUserPackageAssignments_200_response
* */
const getUserPackageAssignments = ({ userId, packageId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        userId,
        packageId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get User Settings
* This API provides Settings for the specified User. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* userId String 
* returns getUserSettings_200_response
* */
const getUserSettings = ({ userId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        userId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get User's CodeIllusion Packages
* This API returns the CodeIllusionPacakges available to the specified user. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* userId String 
* returns getUsersUserIdCodeIllusionPackages_200_response
* */
const getUsersUserIdCodeIllusionPackages = ({ userId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        userId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get User LessonStatuses
* This API provides Lesson Statuses for the specified User. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* userId String 
* lessonIds List  (optional)
* returns getUsersUserIdLessonStatuses_200_response
* */
const getUsersUserIdLessonStatuses = ({ userId, lessonIds }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        userId,
        lessonIds,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Create administrators from the given email ids
*
* districtId String 
* administratorIds List  (optional)
* postAdministratorsRequest PostAdministratorsRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postAdministrators = ({ districtId, administratorIds, postAdministratorsRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        districtId,
        administratorIds,
        postAdministratorsRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* District API POST
* District POST API call when user want to add district in system.
*
* postDistrictRequest PostDistrictRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postDistrict = ({ postDistrictRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postDistrictRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Organization API POST
* Organization POST API call when user want to add organization in system.
*
* postOrganizationRequest PostOrganizationRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postOrganization = ({ postOrganizationRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postOrganizationRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Student Group API POST
* Student Group POST API call when user want to add student group in system.
*
* organizationId String 
* postStudentGroupRequest PostStudentGroupRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postStudentGroup = ({ organizationId, postStudentGroupRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        organizationId,
        postStudentGroupRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Restrict lesson to student.
* POST API call when teacher want to restrict lesson access to their student group.
*
* studentGroupId String 
* lessonIds List 
* postStudentGroupUnaccessibleLessonRequest PostStudentGroupUnaccessibleLessonRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postStudentGroupUnaccessibleLesson = ({ studentGroupId, lessonIds, postStudentGroupUnaccessibleLessonRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
        lessonIds,
        postStudentGroupUnaccessibleLessonRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Student API POST
* This API add existing student to student group
*
* studentGroupId String 
* studentId String 
* returns getClasslinkRosterSync_200_response
* */
const postStudentInStudentGroup = ({ studentGroupId, studentId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
        studentId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Student API POST
*
* studentGroupId String 
* postStudentsRequest PostStudentsRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postStudents = ({ studentGroupId, postStudentsRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
        postStudentsRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Add teacher into organization
* POST API call when user want to add teacher into organization.
*
* organizationId String 
* teacherId String 
* returns getClasslinkRosterSync_200_response
* */
const postTeacherInOrganization = ({ organizationId, teacherId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        organizationId,
        teacherId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Create teachers
*
* organizationId String 
* teacherIds List  (optional)
* postTeachersRequest PostTeachersRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postTeachers = ({ organizationId, teacherIds, postTeachersRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        organizationId,
        teacherIds,
        postTeachersRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* User Lesson Status API POST
* This POST API call when user start the any lesson.
*
* postUserLessonStatusRequest PostUserLessonStatusRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postUserLessonStatus = ({ postUserLessonStatusRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postUserLessonStatusRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Create User Package Assignment
* This API create the UserPackageAssignment.
*
* userPackageAssignment UserPackageAssignment  (optional)
* returns postUserPackageAssignment_200_response
* */
const postUserPackageAssignment = ({ userPackageAssignment }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        userPackageAssignment,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Administrator API PUT
* Administrator PUT API call when user want to edit administrator in system.
*
* administratorId String 
* putAdministratorRequest PutAdministratorRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const putAdministrator = ({ administratorId, putAdministratorRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        administratorId,
        putAdministratorRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* PUT API call when teacher,administrator or internal operator want to change their password.
*
* putChangePasswordRequest PutChangePasswordRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const putChangePassword = ({ putChangePasswordRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        putChangePasswordRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* District API PUT
* District PUT API call when user want to edit district in system.
*
* districtId String 
* putDistrictRequest PutDistrictRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const putDistrict = ({ districtId, putDistrictRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        districtId,
        putDistrictRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Organization API PUT
* Organization PUT API call when user want to edit organization information in system.
*
* organizationId String 
* postOrganizationRequest PostOrganizationRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const putOrganization = ({ organizationId, postOrganizationRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        organizationId,
        postOrganizationRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Student API PUT
* Student PUT API call when user want to edit student information in system.
*
* studentId String 
* putStudentRequest PutStudentRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const putStudent = ({ studentId, putStudentRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentId,
        putStudentRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Student Group API PUT
* Student Group PUT API call when user want to edit student group in system.
*
* studentGroupId String 
* putStudentGroupRequest PutStudentGroupRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const putStudentGroup = ({ studentGroupId, putStudentGroupRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        studentGroupId,
        putStudentGroupRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Teacher API PUT
* Teacher PUT API call when user want to edit teacher in system.
*
* teacherId String 
* putTeacherRequest PutTeacherRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const putTeacher = ({ teacherId, putTeacherRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        teacherId,
        putTeacherRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Update User SoundSettings
* This API updates SoundSettings for the specified User. SoundSettings is the part of User's Settings. If the user pointed to by the token does not have permission to view the information for the specified userId, an error will occur.
*
* userId String 
* userSoundSettings UserSoundSettings  (optional)
* returns updateUserSoundSettings_200_response
* */
const updateUserSoundSettings = ({ userId, userSoundSettings }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        userId,
        userSoundSettings,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  deleteAdministrator,
  deleteDistrict,
  deleteOrganization,
  deleteStudent,
  deleteStudentFromStudentGroup,
  deleteStudentGroup,
  deleteStudentGroupUnaccessibleLesson,
  deleteTeacher,
  deleteTeacherFromOrganization,
  deleteUserPackageAssignment,
  getAdministrators,
  getAllPackages,
  getCodeIllusionPackage,
  getCsePackage,
  getDistrictByDistrictId,
  getDistrictLMSInformationByOrganization,
  getDistrictPurchasedPackagesByDistrictId,
  getDistrictRosterSyncStatus,
  getDistricts,
  getLessons,
  getLoggedInUser,
  getOrganizations,
  getPackageDetailsByStudentGroupId,
  getStandardMapping,
  getStudentGroupLessonStatuses,
  getStudentGroupPackageAssignments,
  getStudentGroups,
  getStudentUnaccessibleLessons,
  getStudents,
  getTeacherOrganizations,
  getTeachers,
  getUnaccessibleLessons,
  getUserPackageAssignments,
  getUserSettings,
  getUsersUserIdCodeIllusionPackages,
  getUsersUserIdLessonStatuses,
  postAdministrators,
  postDistrict,
  postOrganization,
  postStudentGroup,
  postStudentGroupUnaccessibleLesson,
  postStudentInStudentGroup,
  postStudents,
  postTeacherInOrganization,
  postTeachers,
  postUserLessonStatus,
  postUserPackageAssignment,
  putAdministrator,
  putChangePassword,
  putDistrict,
  putOrganization,
  putStudent,
  putStudentGroup,
  putTeacher,
  updateUserSoundSettings,
};
