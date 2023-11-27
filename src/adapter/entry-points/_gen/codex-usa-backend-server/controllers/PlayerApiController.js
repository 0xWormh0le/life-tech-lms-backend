/**
 * The PlayerApiController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/PlayerApiService');
const getAfterLessonCleared = async (request, response) => {
  await Controller.handleRequest(request, response, service.getAfterLessonCleared);
};

const getCheckToken = async (request, response) => {
  await Controller.handleRequest(request, response, service.getCheckToken);
};

const getLessonsSetting = async (request, response) => {
  await Controller.handleRequest(request, response, service.getLessonsSetting);
};

const getPlayersServerStatus = async (request, response) => {
  await Controller.handleRequest(request, response, service.getPlayersServerStatus);
};

const getPlayersSetting = async (request, response) => {
  await Controller.handleRequest(request, response, service.getPlayersSetting);
};

const postActionLog = async (request, response) => {
  await Controller.handleRequest(request, response, service.postActionLog);
};

const postLessonCleared = async (request, response) => {
  await Controller.handleRequest(request, response, service.postLessonCleared);
};

const postLessonFinished = async (request, response) => {
  await Controller.handleRequest(request, response, service.postLessonFinished);
};

const postLessonSheetChanged = async (request, response) => {
  await Controller.handleRequest(request, response, service.postLessonSheetChanged);
};

const postQuizAnswered = async (request, response) => {
  await Controller.handleRequest(request, response, service.postQuizAnswered);
};

const postStepPassed = async (request, response) => {
  await Controller.handleRequest(request, response, service.postStepPassed);
};


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
