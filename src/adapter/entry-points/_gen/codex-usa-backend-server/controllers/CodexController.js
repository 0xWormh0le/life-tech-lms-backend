/**
 * The CodexController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/CodexService');
const deleteAdministrator = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteAdministrator);
};

const deleteDistrict = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteDistrict);
};

const deleteOrganization = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteOrganization);
};

const deleteStudent = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteStudent);
};

const deleteStudentFromStudentGroup = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteStudentFromStudentGroup);
};

const deleteStudentGroup = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteStudentGroup);
};

const deleteStudentGroupUnaccessibleLesson = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteStudentGroupUnaccessibleLesson);
};

const deleteTeacher = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteTeacher);
};

const deleteTeacherFromOrganization = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteTeacherFromOrganization);
};

const deleteUserPackageAssignment = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteUserPackageAssignment);
};

const getAdministrators = async (request, response) => {
  await Controller.handleRequest(request, response, service.getAdministrators);
};

const getAllPackages = async (request, response) => {
  await Controller.handleRequest(request, response, service.getAllPackages);
};

const getCodeIllusionPackage = async (request, response) => {
  await Controller.handleRequest(request, response, service.getCodeIllusionPackage);
};

const getCsePackage = async (request, response) => {
  await Controller.handleRequest(request, response, service.getCsePackage);
};

const getDistrictByDistrictId = async (request, response) => {
  await Controller.handleRequest(request, response, service.getDistrictByDistrictId);
};

const getDistrictLMSInformationByOrganization = async (request, response) => {
  await Controller.handleRequest(request, response, service.getDistrictLMSInformationByOrganization);
};

const getDistrictPurchasedPackagesByDistrictId = async (request, response) => {
  await Controller.handleRequest(request, response, service.getDistrictPurchasedPackagesByDistrictId);
};

const getDistrictRosterSyncStatus = async (request, response) => {
  await Controller.handleRequest(request, response, service.getDistrictRosterSyncStatus);
};

const getDistricts = async (request, response) => {
  await Controller.handleRequest(request, response, service.getDistricts);
};

const getLessons = async (request, response) => {
  await Controller.handleRequest(request, response, service.getLessons);
};

const getLoggedInUser = async (request, response) => {
  await Controller.handleRequest(request, response, service.getLoggedInUser);
};

const getOrganizations = async (request, response) => {
  await Controller.handleRequest(request, response, service.getOrganizations);
};

const getPackageDetailsByStudentGroupId = async (request, response) => {
  await Controller.handleRequest(request, response, service.getPackageDetailsByStudentGroupId);
};

const getStandardMapping = async (request, response) => {
  await Controller.handleRequest(request, response, service.getStandardMapping);
};

const getStudentGroupLessonStatuses = async (request, response) => {
  await Controller.handleRequest(request, response, service.getStudentGroupLessonStatuses);
};

const getStudentGroupPackageAssignments = async (request, response) => {
  await Controller.handleRequest(request, response, service.getStudentGroupPackageAssignments);
};

const getStudentGroups = async (request, response) => {
  await Controller.handleRequest(request, response, service.getStudentGroups);
};

const getStudentUnaccessibleLessons = async (request, response) => {
  await Controller.handleRequest(request, response, service.getStudentUnaccessibleLessons);
};

const getStudents = async (request, response) => {
  await Controller.handleRequest(request, response, service.getStudents);
};

const getTeacherOrganizations = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTeacherOrganizations);
};

const getTeachers = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTeachers);
};

const getUnaccessibleLessons = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUnaccessibleLessons);
};

const getUserPackageAssignments = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUserPackageAssignments);
};

const getUserSettings = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUserSettings);
};

const getUsersUserIdCodeIllusionPackages = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUsersUserIdCodeIllusionPackages);
};

const getUsersUserIdLessonStatuses = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUsersUserIdLessonStatuses);
};

const postAdministrators = async (request, response) => {
  await Controller.handleRequest(request, response, service.postAdministrators);
};

const postDistrict = async (request, response) => {
  await Controller.handleRequest(request, response, service.postDistrict);
};

const postOrganization = async (request, response) => {
  await Controller.handleRequest(request, response, service.postOrganization);
};

const postStudentGroup = async (request, response) => {
  await Controller.handleRequest(request, response, service.postStudentGroup);
};

const postStudentGroupUnaccessibleLesson = async (request, response) => {
  await Controller.handleRequest(request, response, service.postStudentGroupUnaccessibleLesson);
};

const postStudentInStudentGroup = async (request, response) => {
  await Controller.handleRequest(request, response, service.postStudentInStudentGroup);
};

const postStudents = async (request, response) => {
  await Controller.handleRequest(request, response, service.postStudents);
};

const postTeacherInOrganization = async (request, response) => {
  await Controller.handleRequest(request, response, service.postTeacherInOrganization);
};

const postTeachers = async (request, response) => {
  await Controller.handleRequest(request, response, service.postTeachers);
};

const postUserLessonStatus = async (request, response) => {
  await Controller.handleRequest(request, response, service.postUserLessonStatus);
};

const postUserPackageAssignment = async (request, response) => {
  await Controller.handleRequest(request, response, service.postUserPackageAssignment);
};

const putAdministrator = async (request, response) => {
  await Controller.handleRequest(request, response, service.putAdministrator);
};

const putChangePassword = async (request, response) => {
  await Controller.handleRequest(request, response, service.putChangePassword);
};

const putDistrict = async (request, response) => {
  await Controller.handleRequest(request, response, service.putDistrict);
};

const putOrganization = async (request, response) => {
  await Controller.handleRequest(request, response, service.putOrganization);
};

const putStudent = async (request, response) => {
  await Controller.handleRequest(request, response, service.putStudent);
};

const putStudentGroup = async (request, response) => {
  await Controller.handleRequest(request, response, service.putStudentGroup);
};

const putTeacher = async (request, response) => {
  await Controller.handleRequest(request, response, service.putTeacher);
};

const updateUserSoundSettings = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateUserSoundSettings);
};


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
