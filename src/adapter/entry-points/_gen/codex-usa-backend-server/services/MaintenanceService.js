/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Delete AdministratorDistrict bulky for accounts management purpose
*
* maintenanceGetAdministratorDistricts200Response MaintenanceGetAdministratorDistricts200Response  (optional)
* returns maintenancePutDistricts_200_response
* */
const maintenanceDeleteAdministratorDistricts = ({ maintenanceGetAdministratorDistricts200Response }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenanceGetAdministratorDistricts200Response,
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
* Delete StudentGroupStudents bulky for accounts management purpose
*
* maintenanceGetStudentGroupStudents200Response MaintenanceGetStudentGroupStudents200Response  (optional)
* returns maintenancePutDistricts_200_response
* */
const maintenanceDeleteStudentGroupStudents = ({ maintenanceGetStudentGroupStudents200Response }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenanceGetStudentGroupStudents200Response,
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
* Delete TeacherOrganizations bulky for accounts management purpose
*
* maintenanceGetTeacherOrganizations200Response MaintenanceGetTeacherOrganizations200Response  (optional)
* returns maintenancePutDistricts_200_response
* */
const maintenanceDeleteTeacherOrganizations = ({ maintenanceGetTeacherOrganizations200Response }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenanceGetTeacherOrganizations200Response,
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
* Get All AdministratorDistricts for accounts management purpose
*
* returns maintenanceGetAdministratorDistricts_200_response
* */
const maintenanceGetAdministratorDistricts = () => new Promise(
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
* Construct Free Trial Accounts for Sales
*
* districtName String 
* stateId String 
* prefix String 
* maxStudentCount Integer  (optional)
* maxTeacherCount Integer  (optional)
* returns maintenanceGetConstructFreeTrialAccountsForSales_200_response
* */
const maintenanceGetConstructFreeTrialAccountsForSales = ({ districtName, stateId, prefix, maxStudentCount, maxTeacherCount }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        districtName,
        stateId,
        prefix,
        maxStudentCount,
        maxTeacherCount,
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
* Get All Districts for accounts management purpose
*
* returns maintenanceGetDistricts_200_response
* */
const maintenanceGetDistricts = () => new Promise(
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
* Get All Organizations for accounts management purpose
*
* returns maintenanceGetOrganizations_200_response
* */
const maintenanceGetOrganizations = () => new Promise(
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
* Get All StudentGroupStudents for accounts management purpose
*
* returns maintenanceGetStudentGroupStudents_200_response
* */
const maintenanceGetStudentGroupStudents = () => new Promise(
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
* Get All StudentGroup for accounts management purpose
*
* returns maintenanceGetStudentGroups_200_response
* */
const maintenanceGetStudentGroups = () => new Promise(
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
* Get All TeacherOrganizations for accounts management purpose
*
* returns maintenanceGetTeacherOrganizations_200_response
* */
const maintenanceGetTeacherOrganizations = () => new Promise(
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
* Get All Users for accounts management purpose
*
* returns maintenanceGetUsers_200_response
* */
const maintenanceGetUsers = () => new Promise(
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
* Health Check
*
* returns deleteUserPackageAssignment_200_response
* */
const maintenanceHealthCheck = () => new Promise(
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
* Create AccountNotification for example. This will send email
*
* maintenancePostAccountNotificationRequest MaintenancePostAccountNotificationRequest  (optional)
* returns maintenancePostAccountNotification_200_response
* */
const maintenancePostAccountNotification = ({ maintenancePostAccountNotificationRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenancePostAccountNotificationRequest,
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
* Create AdministratorDistrict bulky for accounts management purpose
*
* maintenanceGetAdministratorDistricts200Response MaintenanceGetAdministratorDistricts200Response  (optional)
* returns maintenancePutDistricts_200_response
* */
const maintenancePostAdministratorDistricts = ({ maintenanceGetAdministratorDistricts200Response }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenanceGetAdministratorDistricts200Response,
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
* Create StudentGroupStudents bulky for accounts management purpose
*
* maintenanceGetStudentGroupStudents200Response MaintenanceGetStudentGroupStudents200Response  (optional)
* returns maintenancePutDistricts_200_response
* */
const maintenancePostStudentGroupStudents = ({ maintenanceGetStudentGroupStudents200Response }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenanceGetStudentGroupStudents200Response,
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
* Create TeacherOrganizations bulky for accounts management purpose
*
* maintenanceGetTeacherOrganizations200Response MaintenanceGetTeacherOrganizations200Response  (optional)
* returns maintenancePutDistricts_200_response
* */
const maintenancePostTeacherOrganizations = ({ maintenanceGetTeacherOrganizations200Response }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenanceGetTeacherOrganizations200Response,
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
* Create Users bulky for accounts management purpose
*
* maintenancePostUsersRequest MaintenancePostUsersRequest  (optional)
* returns maintenancePostUsers_200_response
* */
const maintenancePostUsers = ({ maintenancePostUsersRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenancePostUsersRequest,
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
* Create or Update Districts bulky for accounts management purpose
*
* maintenancePutDistrictsRequest MaintenancePutDistrictsRequest  (optional)
* returns maintenancePutDistricts_200_response
* */
const maintenancePutDistricts = ({ maintenancePutDistrictsRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenancePutDistrictsRequest,
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
* Create or Update Organizations bulky for accounts management purpose
*
* maintenancePutOrganizationsRequest MaintenancePutOrganizationsRequest  (optional)
* returns maintenancePutDistricts_200_response
* */
const maintenancePutOrganizations = ({ maintenancePutOrganizationsRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenancePutOrganizationsRequest,
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
* Create or Update StudentGroup bulky for accounts management purpose
*
* maintenancePutStudentGroupsRequest MaintenancePutStudentGroupsRequest  (optional)
* returns maintenancePutDistricts_200_response
* */
const maintenancePutStudentGroups = ({ maintenancePutStudentGroupsRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenancePutStudentGroupsRequest,
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
* Update Users bulky for accounts management purpose
*
* maintenancePutUsersRequest MaintenancePutUsersRequest  (optional)
* returns maintenanceGetUsers_200_response
* */
const maintenancePutUsers = ({ maintenancePutUsersRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        maintenancePutUsersRequest,
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
