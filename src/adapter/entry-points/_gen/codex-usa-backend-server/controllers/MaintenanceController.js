/**
 * The MaintenanceController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/MaintenanceService');
const maintenanceDeleteAdministratorDistricts = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceDeleteAdministratorDistricts);
};

const maintenanceDeleteStudentGroupStudents = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceDeleteStudentGroupStudents);
};

const maintenanceDeleteTeacherOrganizations = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceDeleteTeacherOrganizations);
};

const maintenanceGetAdministratorDistricts = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceGetAdministratorDistricts);
};

const maintenanceGetConstructFreeTrialAccountsForSales = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceGetConstructFreeTrialAccountsForSales);
};

const maintenanceGetDistricts = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceGetDistricts);
};

const maintenanceGetOrganizations = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceGetOrganizations);
};

const maintenanceGetStudentGroupStudents = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceGetStudentGroupStudents);
};

const maintenanceGetStudentGroups = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceGetStudentGroups);
};

const maintenanceGetTeacherOrganizations = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceGetTeacherOrganizations);
};

const maintenanceGetUsers = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceGetUsers);
};

const maintenanceHealthCheck = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenanceHealthCheck);
};

const maintenancePostAccountNotification = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenancePostAccountNotification);
};

const maintenancePostAdministratorDistricts = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenancePostAdministratorDistricts);
};

const maintenancePostStudentGroupStudents = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenancePostStudentGroupStudents);
};

const maintenancePostTeacherOrganizations = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenancePostTeacherOrganizations);
};

const maintenancePostUsers = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenancePostUsers);
};

const maintenancePutDistricts = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenancePutDistricts);
};

const maintenancePutOrganizations = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenancePutOrganizations);
};

const maintenancePutStudentGroups = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenancePutStudentGroups);
};

const maintenancePutUsers = async (request, response) => {
  await Controller.handleRequest(request, response, service.maintenancePutUsers);
};


module.exports = {
  maintenanceDeleteAdministratorDistricts,
  maintenanceDeleteStudentGroupStudents,
  maintenanceDeleteTeacherOrganizations,
  maintenanceGetAdministratorDistricts,
  maintenanceGetConstructFreeTrialAccountsForSales,
  maintenanceGetDistricts,
  maintenanceGetOrganizations,
  maintenanceGetStudentGroupStudents,
  maintenanceGetStudentGroups,
  maintenanceGetTeacherOrganizations,
  maintenanceGetUsers,
  maintenanceHealthCheck,
  maintenancePostAccountNotification,
  maintenancePostAdministratorDistricts,
  maintenancePostStudentGroupStudents,
  maintenancePostTeacherOrganizations,
  maintenancePostUsers,
  maintenancePutDistricts,
  maintenancePutOrganizations,
  maintenancePutStudentGroups,
  maintenancePutUsers,
};
