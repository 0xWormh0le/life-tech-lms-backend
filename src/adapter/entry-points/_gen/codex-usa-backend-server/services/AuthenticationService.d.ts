/**
* Get class-link user access token
*
* postClassLinkAuthenticateRequest PostClassLinkAuthenticateRequest  (optional)
* returns postCleverAuthenticate_200_response
* */
export function postClassLinkAuthenticate({ postClassLinkAuthenticateRequest }: {
    postClassLinkAuthenticateRequest: any;
}): Promise<any>;
/**
* Get Clever user access token
*
* postCleverAuthenticateRequest PostCleverAuthenticateRequest  (optional)
* returns postCleverAuthenticate_200_response
* */
export function postCleverAuthenticate({ postCleverAuthenticateRequest }: {
    postCleverAuthenticateRequest: any;
}): Promise<any>;
/**
* Get google user access token
*
* postGoogleAuthenticateRequest PostGoogleAuthenticateRequest  (optional)
* returns postCleverAuthenticate_200_response
* */
export function postGoogleAuthenticate({ postGoogleAuthenticateRequest }: {
    postGoogleAuthenticateRequest: any;
}): Promise<any>;
/**
* Login with ID/Password and get access token
*
* postLoginRequest PostLoginRequest  (optional)
* returns postLogin_200_response
* */
export function postLogin({ postLoginRequest }: {
    postLoginRequest: any;
}): Promise<any>;
/**
* Login without ID/Password. This will make an anonymous user.
*
* body Object  (optional)
* returns postLogin_200_response
* */
export function postNoCredentialLogin({ body }: {
    body: any;
}): Promise<any>;
/**
* reset password.
* POST API call when administartor, lit, or teacher user reset their password.
*
* postResetPasswordRequest PostResetPasswordRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postResetPassword({ postResetPasswordRequest }: {
    postResetPasswordRequest: any;
}): Promise<any>;
/**
* User reset password request.
* POST API call when administartor, lit, or teacher user want to reset their password.
*
* postUserResetPasswordRequestRequest PostUserResetPasswordRequestRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postUserResetPasswordRequest({ postUserResetPasswordRequestRequest }: {
    postUserResetPasswordRequestRequest: any;
}): Promise<any>;
/**
* User reset password request resend.
* POST API call when administartor, lit, or teacher user want to resend reset password request.
*
* postUserResetPasswordRequestResendRequest PostUserResetPasswordRequestResendRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postUserResetPasswordRequestResend({ postUserResetPasswordRequestResendRequest }: {
    postUserResetPasswordRequestResendRequest: any;
}): Promise<any>;
