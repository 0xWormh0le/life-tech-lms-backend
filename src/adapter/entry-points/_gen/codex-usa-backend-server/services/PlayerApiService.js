/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Lesson Player API GET /after_lesson_cleared (This updates LessonStatus actually)
* Lesson Player calls this API at the end of each lesson. It moves to the specified destination according to the return value.
*
* returns postLessonFinished_200_response
* */
const getAfterLessonCleared = () => new Promise(
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
* Lesson Player API GET /check_token
* Lesson Player calls this API once at startup, verifying that the Bearer token is valid. If not, returning a redirect url.
*
* authentication String  (optional)
* returns getCheckToken_200_response
* */
const getCheckToken = ({ authentication }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        authentication,
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
* Lesson Player API GET /lesson_setting
* The Lesson Player calls this API once at the start of each lesson. The display of the editor screen changes according to the returned value.
*
* scenarioUnderscorepath String 
* projectUnderscorename String 
* returns getLessonsSetting_200_response
* */
const getLessonsSetting = ({ scenarioUnderscorepath, projectUnderscorename }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        scenarioUnderscorepath,
        projectUnderscorename,
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
* Lesson Player API GET /server_status
* The Lesson Player expects the \"isMaintenance\" flag to always be false.
*
* returns getPlayersServerStatus_200_response
* */
const getPlayersServerStatus = () => new Promise(
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
* Lesson Player API GET /player_setting
* The Lesson Player calls this API once at startup, and the return value contains a variety of information that can be used to change the behavior of the Lesson Player.
*
* returns getPlayersSetting_200_response
* */
const getPlayersSetting = () => new Promise(
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
* Lesson Player API POST /action_log
* The Lesson Player calls this API once for action log
*
* postActionLogRequest PostActionLogRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postActionLog = ({ postActionLogRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postActionLogRequest,
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
* Lesson Player API POST /lesson_cleared (This updates LessonStatus actually)
* Lesson Player calls this API at the end of each lesson. It moves to the specified destination according to the return value.
*
* postLessonFinishedRequest PostLessonFinishedRequest  (optional)
* returns postLessonCleared_200_response
* */
const postLessonCleared = ({ postLessonFinishedRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postLessonFinishedRequest,
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
* Lesson Player API POST /lesson_finished (This updates LessonStatus actually)
* Lesson Player calls this API at the end of each lesson. It moves to the specified destination according to the return value.
*
* postLessonFinishedRequest PostLessonFinishedRequest  (optional)
* returns postLessonFinished_200_response
* */
const postLessonFinished = ({ postLessonFinishedRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postLessonFinishedRequest,
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
* Lesson Player API POST /lesson_sheet_changed
*
* lessonName String 
* no response value expected for this operation
* */
const postLessonSheetChanged = ({ lessonName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        lessonName,
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
* Lesson Player API POST /quiz_answered
* The Lesson Player calls this API once for each step completed; it stores the information on the BACKEND side and returns nothing. It always succeeds.
*
* postQuizAnsweredRequest PostQuizAnsweredRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postQuizAnswered = ({ postQuizAnsweredRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postQuizAnsweredRequest,
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
* Lesson Player API POST /step_passed
* The Lesson Player calls this API once for each step completed; it stores the information on the BACKEND side and returns nothing. It always succeeds.
*
* postStepPassedRequest PostStepPassedRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postStepPassed = ({ postStepPassedRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postStepPassedRequest,
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
  getAfterLessonCleared,
  getCheckToken,
  getLessonsSetting,
  getPlayersServerStatus,
  getPlayersSetting,
  postActionLog,
  postLessonCleared,
  postLessonFinished,
  postLessonSheetChanged,
  postQuizAnswered,
  postStepPassed,
};
