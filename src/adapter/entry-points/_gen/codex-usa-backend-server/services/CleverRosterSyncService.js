/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get Clever's data and add in codex database.
* This API provides get all the clever 's data' and add in codex database.
*
* districtId String 
* returns getCleverRosterSync_200_response
* */
const getCleverRosterSync = ({ districtId }) => new Promise(
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

module.exports = {
  getCleverRosterSync,
};
