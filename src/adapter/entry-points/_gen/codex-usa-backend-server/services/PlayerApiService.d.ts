/**
* Lesson Player API GET /after_lesson_cleared (This updates LessonStatus actually)
* Lesson Player calls this API at the end of each lesson. It moves to the specified destination according to the return value.
*
* returns postLessonFinished_200_response
* */
export function getAfterLessonCleared(): Promise<any>;
/**
* Lesson Player API GET /check_token
* Lesson Player calls this API once at startup, verifying that the Bearer token is valid. If not, returning a redirect url.
*
* authentication String  (optional)
* returns getCheckToken_200_response
* */
export function getCheckToken({ authentication }: {
    authentication: any;
}): Promise<any>;
/**
* Lesson Player API GET /lesson_setting
* The Lesson Player calls this API once at the start of each lesson. The display of the editor screen changes according to the returned value.
*
* scenarioUnderscorepath String
* projectUnderscorename String
* returns getLessonsSetting_200_response
* */
export function getLessonsSetting({ scenarioUnderscorepath, projectUnderscorename }: {
    scenarioUnderscorepath: any;
    projectUnderscorename: any;
}): Promise<any>;
/**
* Lesson Player API GET /server_status
* The Lesson Player expects the \"isMaintenance\" flag to always be false.
*
* returns getPlayersServerStatus_200_response
* */
export function getPlayersServerStatus(): Promise<any>;
/**
* Lesson Player API GET /player_setting
* The Lesson Player calls this API once at startup, and the return value contains a variety of information that can be used to change the behavior of the Lesson Player.
*
* returns getPlayersSetting_200_response
* */
export function getPlayersSetting(): Promise<any>;
/**
* Lesson Player API POST /action_log
* The Lesson Player calls this API once for action log
*
* postActionLogRequest PostActionLogRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postActionLog({ postActionLogRequest }: {
    postActionLogRequest: any;
}): Promise<any>;
/**
* Lesson Player API POST /lesson_cleared (This updates LessonStatus actually)
* Lesson Player calls this API at the end of each lesson. It moves to the specified destination according to the return value.
*
* postLessonFinishedRequest PostLessonFinishedRequest  (optional)
* returns postLessonCleared_200_response
* */
export function postLessonCleared({ postLessonFinishedRequest }: {
    postLessonFinishedRequest: any;
}): Promise<any>;
/**
* Lesson Player API POST /lesson_finished (This updates LessonStatus actually)
* Lesson Player calls this API at the end of each lesson. It moves to the specified destination according to the return value.
*
* postLessonFinishedRequest PostLessonFinishedRequest  (optional)
* returns postLessonFinished_200_response
* */
export function postLessonFinished({ postLessonFinishedRequest }: {
    postLessonFinishedRequest: any;
}): Promise<any>;
/**
* Lesson Player API POST /lesson_sheet_changed
*
* lessonName String
* no response value expected for this operation
* */
export function postLessonSheetChanged({ lessonName }: {
    lessonName: any;
}): Promise<any>;
/**
* Lesson Player API POST /quiz_answered
* The Lesson Player calls this API once for each step completed; it stores the information on the BACKEND side and returns nothing. It always succeeds.
*
* postQuizAnsweredRequest PostQuizAnsweredRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postQuizAnswered({ postQuizAnsweredRequest }: {
    postQuizAnsweredRequest: any;
}): Promise<any>;
/**
* Lesson Player API POST /step_passed
* The Lesson Player calls this API once for each step completed; it stores the information on the BACKEND side and returns nothing. It always succeeds.
*
* postStepPassedRequest PostStepPassedRequest  (optional)
* returns getClasslinkRosterSync_200_response
* */
export function postStepPassed({ postStepPassedRequest }: {
    postStepPassedRequest: any;
}): Promise<any>;
