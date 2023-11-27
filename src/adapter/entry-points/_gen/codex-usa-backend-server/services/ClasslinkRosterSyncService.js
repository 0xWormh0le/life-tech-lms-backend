/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get Classlink's data and add in codex database.
* This API provides get all the classlink 's data' and add in codex database.
*
* districtId String 
* returns getClasslinkRosterSync_200_response
* */
const getClasslinkRosterSync = ({ districtId }) => new Promise(
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
  getClasslinkRosterSync,
};
