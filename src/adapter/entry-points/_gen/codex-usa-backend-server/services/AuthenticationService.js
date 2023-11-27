/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get class-link user access token
*
* postClassLinkAuthenticateRequest PostClassLinkAuthenticateRequest  (optional)
* returns postCleverAuthenticate_200_response
* */
const postClassLinkAuthenticate = ({ postClassLinkAuthenticateRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postClassLinkAuthenticateRequest,
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
* Get Clever user access token
*
* postCleverAuthenticateRequest PostCleverAuthenticateRequest  (optional)
* returns postCleverAuthenticate_200_response
* */
const postCleverAuthenticate = ({ postCleverAuthenticateRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postCleverAuthenticateRequest,
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
* Get google user access token
*
* postGoogleAuthenticateRequest PostGoogleAuthenticateRequest  (optional)
* returns postCleverAuthenticate_200_response
* */
const postGoogleAuthenticate = ({ postGoogleAuthenticateRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postGoogleAuthenticateRequest,
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
* Login with ID/Password and get access token
*
* postLoginRequest PostLoginRequest  (optional)
* returns postLogin_200_response
* */
const postLogin = ({ postLoginRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postLoginRequest,
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
* Login without ID/Password. This will make an anonymous user.
*
* body Object  (optional)
* returns postLogin_200_response
* */
const postNoCredentialLogin = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        body,
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
* reset password.
* POST API call when administartor, lit, or teacher user reset their password.
*
* postResetPasswordRequest PostResetPasswordRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postResetPassword = ({ postResetPasswordRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postResetPasswordRequest,
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
* User reset password request.
* POST API call when administartor, lit, or teacher user want to reset their password.
*
* postUserResetPasswordRequestRequest PostUserResetPasswordRequestRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postUserResetPasswordRequest = ({ postUserResetPasswordRequestRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postUserResetPasswordRequestRequest,
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
* User reset password request resend.
* POST API call when administartor, lit, or teacher user want to resend reset password request.
*
* postUserResetPasswordRequestResendRequest PostUserResetPasswordRequestResendRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
const postUserResetPasswordRequestResend = ({ postUserResetPasswordRequestResendRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        postUserResetPasswordRequestResendRequest,
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
  postClassLinkAuthenticate,
  postCleverAuthenticate,
  postGoogleAuthenticate,
  postLogin,
  postNoCredentialLogin,
  postResetPassword,
  postUserResetPasswordRequest,
  postUserResetPasswordRequestResend,
};
