/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* ChurnZero token based authentication
*
* accountExternalId String 
* contactExternalId String 
* next String 
* no response value expected for this operation
* */
const getChurnZeroAuthentication = ({ accountExternalId, contactExternalId, next }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        accountExternalId,
        contactExternalId,
        next,
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
  getChurnZeroAuthentication,
};
