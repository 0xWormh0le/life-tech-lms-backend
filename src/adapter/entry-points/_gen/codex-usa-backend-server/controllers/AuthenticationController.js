/**
 * The AuthenticationController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/AuthenticationService');
const postClassLinkAuthenticate = async (request, response) => {
  await Controller.handleRequest(request, response, service.postClassLinkAuthenticate);
};

const postCleverAuthenticate = async (request, response) => {
  await Controller.handleRequest(request, response, service.postCleverAuthenticate);
};

const postGoogleAuthenticate = async (request, response) => {
  await Controller.handleRequest(request, response, service.postGoogleAuthenticate);
};

const postLogin = async (request, response) => {
  await Controller.handleRequest(request, response, service.postLogin);
};

const postNoCredentialLogin = async (request, response) => {
  await Controller.handleRequest(request, response, service.postNoCredentialLogin);
};

const postResetPassword = async (request, response) => {
  await Controller.handleRequest(request, response, service.postResetPassword);
};

const postUserResetPasswordRequest = async (request, response) => {
  await Controller.handleRequest(request, response, service.postUserResetPasswordRequest);
};

const postUserResetPasswordRequestResend = async (request, response) => {
  await Controller.handleRequest(request, response, service.postUserResetPasswordRequestResend);
};


module.exports = {
  postClassLinkAuthenticate,
  postCleverAuthenticate,
  postGoogleAuthenticate,
  postLogin,
  postNoCredentialLogin,
  postResetPassword,
  postUserResetPasswordRequest,
  postUserResetPasswordRequestResend,
};
