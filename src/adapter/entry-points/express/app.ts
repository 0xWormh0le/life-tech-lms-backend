import path, { resolve } from 'path'
import dotenv from 'dotenv'
import express, { Express, NextFunction, Request, Response } from 'express'
import { HttpError } from 'express-openapi-validator/dist/framework/types'
import cors from 'cors'
import bodyParser from 'body-parser'
import bearerToken from 'express-bearer-token'
import { OpenApiValidator } from 'express-openapi-validator'
import 'reflect-metadata'
import { DatabaseType, DataSource } from 'typeorm'

import Controllers from '../_gen/codex-usa-backend-server/controllers'
import { Paths } from '../_gen/codex-usa-backend-types'
import {
  callHandler,
  callHandlerWithLambdaEvent,
  callHandlerWithToken,
} from './handlerUtilities'
import { createAppDataSource } from '../../typeorm/data-source'

import { LoginExpressHandler } from './handlers/authentication/LoginExpressHandler'
import { NoCredentialLoginExpressHandler } from './handlers/authentication/NoCredentialLoginExpressHandler'
import { GetLessonsExpressHandler } from './handlers/codex/GetLessonsExpressHandler'
import { GetUserLessonStatusesExpressHandler } from './handlers/codex/GetUserLessonStatusesExpressHandler'
import { GetUserCodeillusionPackagesExpressHandler } from './handlers/codex/GetUserCodeillusionPackagesExpressHandler'
import { GetAllPackagesExpressHandler } from './handlers/codex/GetAllTheCodexPackagesExpressHandler'
import { GetUserSettingsExpressHandler } from './handlers/codex/GetUserSettingsExpressHandler'
import { GetUserPackageAssignmentExpressHandler } from './handlers/codex/GetUserPackageAssignmentExpressHandler'
import { CreateUserPackageAssignmentExpressHandler } from './handlers/codex/CreateUserPackageAssignmentExpressHandler'
import { DeleteUserPackageAssignmentExpressHandler } from './handlers/codex/DeleteUserPackageAssignmentExpressHandler'
import { UpdateUserSoundSettingsExpressHandler } from './handlers/codex/UpdateUserSoundSettingsExpressHandler'
import { GetDistrictsExpressHandler } from './handlers/codex/GetDistrictsExpressHandler'
import { GetDistrictByDistrictIdExpressHandler } from './handlers/codex/GetDistrictByDistrictIdExpressHandler'
import { GetAdministratorExpressHandler } from './handlers/codex/GetAdministratorExpressHandler'

import { PlayerApiCheckTokenExpressHandler } from './handlers/playerApi/PlayerApiCheckTokenExpressHandler'
import { PlayerApiGetPlayersSettingExpressHandler } from './handlers/playerApi/PlayerApiGetPlayersSettingExpressHandler'
import { PlayerApiGetLessonSettingExpressHandler } from './handlers/playerApi/PlayerApiGetLessonSettingExpressHandler'
import { PlayerApiPostStepPassedExpressHandler } from './handlers/playerApi/PlayerApiPostStepPassedExpressHandler'
import { PlayerApiPostLessonClearedExpressHandler } from './handlers/playerApi/PlayerApiPostLessonClearedExpressHandler'
import { PlayerApiGetAfterLessonClearedExpressHandler } from './handlers/playerApi/PlayerApiGetAfterLessonClearedExpressHandler'
import { CreateDistrictExpressHandler } from './handlers/codex/CreateDistrictExpressHandler'
import { PostAdministratorExpressHandler } from './handlers/codex/PostAdministratorExpressHandler'
import { GetOrganizationsExpressHandler } from './handlers/codex/GetOrganizationsExpressHandler'
import { CreateOrganizationExpressHandler } from './handlers/codex/CreateOrganizationExpressHandler'
import { DeleteAdministratorExpressHandler } from './handlers/codex/DeleteAdministratorExpressHandler'
import { UpdateDistrictExpressHandler } from './handlers/codex/UpdateDistrictExpressHandler'
import { UpdateUserAdministratorExpressHandler } from './handlers/codex/UpdateAdministratorExpressHandler'
import { UpdateOrganizationExpressHandler } from './handlers/codex/UpdateOrganizationExpressHandler'
import { DeleteDistrictExpressHandler } from './handlers/codex/DeleteDistrictExpressHandler'
import { DeleteOrganizationExpressHandler } from './handlers/codex/DeleteOrganizationExpressHandler'
import { GetStudentGroupsExpressHandler } from './handlers/codex/GetStudentGroupsExpressHandler'
import { MaintenanceCreateAccountNotificationExpressHandler } from './handlers/maintenance/AccountNotification/MaintenanceCreateAccountNotificationExpressHandler'
import { CreateTeacherExpressHandler } from './handlers/codex/teacher/CreateTeacherExpressHandler'
import { CreateStudentGroupExpressHandler } from './handlers/codex/CreateStudentGroupExpressHandler'
import { AdministratorRepository } from '../../repositories/AdministratorRepository'
import { CreateStudentsExpressHandler } from './handlers/codex/CreateStudentsExpressHandler'
import { UpdateStudentGroupExpressHandler } from './handlers/codex/UpdateStudentGroupExpressHandler'
import { DeleteStudentGroupExpressHandler } from './handlers/codex/DeleteStudentGroupExpressHandler'
import { UpdateTeacherExpressHandler } from './handlers/codex/teacher/UpdateTeacherExpressHandler'
import { DeleteTeacherExpressHandler } from './handlers/codex/teacher/DeleteTeacherExpressHandler'
import { GetTeacherExpressHandler } from './handlers/codex/teacher/GetTeacherExpressHandler'
import { AddTeacherInOrganizationExpressHandler } from './handlers/codex/teacher/AddTeacherInOrganizationExpressHandler'
import { UpdateStudentExpressHandler } from './handlers/codex/UpdateStudentExpressHandler'
import { DeleteStudentExpressHandler } from './handlers/codex/DeleteStudentExpressHandler'
import { GetStudentsExpressHandler } from './handlers/codex/GetStudentsExpressHandler'
import { RemoveTeacherFromOrganizationExpressHandler } from './handlers/codex/teacher/RemoveTeacherFromOrganizationExpressHandler'
import { AddStudentInStudentGroupExpressHandler } from './handlers/codex/AddStudentInStudentGroupExpressHandler'
import { RemoveStudentFromStudentGroupExpressHandler } from './handlers/codex/RemoveStudentFromStudentGroupExpressHandler'
import { StudentGroupUnaccessibleLessonExpressHandler } from './handlers/codex/teacher/StudentGroupUnaccessibleLessonExpresshandler'
import { CleverAuthenticateExpressHandler } from './handlers/authentication/CleverAuthenticateExpressHandler'
import { RemoveStudentGroupUnaccessibleLessonExpressHandler } from './handlers/codex/teacher/RemoveStudentGroupUnaccessibleExpressHandler'
import { GetStudentGroupUnaccessibleLessonsExpressHandler } from './handlers/codex/teacher/GetStudentGroupUnaccessibleLessonsExpressHandler'
import { GetStudentGroupLessonsStatusesExpressHandler } from './handlers/codex/GetStudentGroupLessonStatusesExpressHandler'
import { GetMeExpressHandler } from './handlers/codex/GetMeExpressHandler'
import { GetTeacherByTeacherIdExpressHandler } from './handlers/codex/teacher/GetTeacherByTeacherIdExpressHandler'
import { CreateUserLessonStatusExpressHandler } from './handlers/codex/CreateUserLessonStatusExpressHandler'
import { GetCodeIllusionPackagesByStudentGroupIdExpressHandler } from './handlers/codex/GetCodeIllusionPackagesByStudentGroupIdExpressHandler'
import { GetStandardMappingExpressHandler } from './handlers/codex/GetStandardMappingExpressHandler'
import { GetStudentUnaccessibleLessonsExpressHandler } from './handlers/codex/GetStudentUnaccessibleLessonsExpressHandler'
import { GetCodeillusionPackagesByPackageIdExpressHandler } from './handlers/codex/GetCodeillusionPackagesByPackageIdExpressHandler'
// Maintenance
import { MaintenanceGetUsersExpressHandler } from './handlers/maintenance/User/MaintenanceGetUsersExpressHandler'
import { MaintenanceUpdateUsersExpressHandler } from './handlers/maintenance/User/MaintenanceUpdateUsersExpressHandler'
import { MaintenanceCreateUsersExpressHandler } from './handlers/maintenance/User/MaintenanceCreateUsersExpressHandler'
import { MaintenanceCreateOrUpdateDistrictsExpressHandler } from './handlers/maintenance/District/MaintenanceCreateOrUpdateDistrictsExpressHandler'
import { MaintenanceGetDistrictsExpressHandler } from './handlers/maintenance/District/MaintenanceGetDistrictsExpressHandler'
import { MaintenanceCreateOrUpdateOrganizationsExpressHandler } from './handlers/maintenance/Organization/MaintenanceCreateOrUpdateOrganizationsExpressHandler'
import { MaintenanceGetOrganizationsExpressHandler } from './handlers/maintenance/Organization/MaintenanceGetOrganizationsExpressHandler'
import { MaintenanceCreateOrUpdateStudentGroupsExpressHandler } from './handlers/maintenance/StudentGroup/MaintenanceCreateOrUpdateStudentGroupsExpressHandler'
import { MaintenanceGetStudentGroupsExpressHandler } from './handlers/maintenance/StudentGroup/MaintenanceGetStudentGroupsExpressHandler'
import { MaintenanceGetAdministratorDistrictsExpressHandler } from './handlers/maintenance/AdministratorDistrict/MaintenanceGetAdministratorDistrictsExpressHandler'
import { MaintenanceGetTeacherOrganizationsExpressHandler } from './handlers/maintenance/TeacherOrganization/MaintenanceGetTeacherOrganizationsExpressHandler'
import { MaintenanceGetStudentGroupStudentsExpressHandler } from './handlers/maintenance/StudentGroupStudent/MaintenanceGetStudentGroupStudentsExpressHandler'
import { MaintenanceCreateAdministratorDistrictsExpressHandler } from './handlers/maintenance/AdministratorDistrict/MaintenanceCreateAdministratorDistrictsExpressHandler'
import { MaintenanceDeleteAdministratorDistrictsExpressHandler } from './handlers/maintenance/AdministratorDistrict/MaintenanceDeleteAdministratorDistrictsExpressHandler'
import { MaintenanceCreateTeacherOrganizationsExpressHandler } from './handlers/maintenance/TeacherOrganization/MaintenanceCreateTeacherOrganizationsExpressHandler'
import { MaintenanceDeleteTeacherOrganizationsExpressHandler } from './handlers/maintenance/TeacherOrganization/MaintenanceDeleteTeacherOrganizationsExpressHandler'
import { MaintenanceCreateStudentGroupStudentsExpressHandler } from './handlers/maintenance/StudentGroupStudent/MaintenanceCreateStudentGroupStudentsExpressHandler'
import { MaintenanceDeleteStudentGroupStudentsExpressHandler } from './handlers/maintenance/StudentGroupStudent/MaintenanceDeleteStudentGroupStudentsExpressHandler'
import { GoogleAuthenticateExpressHandler } from './handlers/authentication/GoogleAuthenticateExpressHandler'
import { ClassLinkAuthenticatExpressHandler } from './handlers/authentication/ClassLinkAuthenticatExpressHandler'
import { GetDistrictPurchasedPackagesExpressHandler } from './handlers/codex/GetDistrictPurchasedPackagesExpressHandler'
import { ClasslinkRosterSyncExpressHandler } from './handlers/classlink/ClasslinkRosterSyncExpressHandler'
import { GetDistrictLMSInformationByOrganizationExpressHandler } from './handlers/codex/GetDistrictLMSInformationByOrganizationExpressHandler'
import { GetCsePackageExpressHandler } from './handlers/codex/GetCsePackageExpressHandler'
import { GetStudentGroupPackageAssignmentsExpressHandler } from './handlers/codex/GetStudentGroupPackageAssignments'
import { PlayerApiPostLessonFinishedExpressHandler } from './handlers/playerApi/PlayerApiPostLessonFinishedExpressHandler'
import { PlayerApiPostQuizAnswredExpressHandler } from './handlers/playerApi/PlayerApiPostQuizAnswredExpressHandler'
import { PlayerApiPostLessonSheetChangedExpressHandler } from './handlers/playerApi/PlayerApiPostLessonSheetChangedExpressHandler'
import { ResetPasswordRequestExpressHandler } from './handlers/authentication/ResetPasswordRequestExpressHandler'
import { ResetPasswordExpressHandler } from './handlers/authentication/ResetPasswordExpressHandler'
import { ResetPasswordRequestResendExpressHandler } from './handlers/authentication/ResetPasswordRequestResendExpressHandler'
import { ChangeUserPasswordExpressHandler } from './handlers/codex/ChangeUserPasswordExpressHandler'
import { MaintenanceHealthCheckExpressHandler } from './handlers/maintenance/HealthCheck/MaintenanceHealthCheckExpressHandler'
import { codexV2Server } from './handlers/codex-v2'
import { CleverRosterSyncExpressHandler } from './handlers/clever/CleverRosterSyncExpressHandler'
import { GetDistrictRosterSyncStatusExpressHandler } from './handlers/codex/GetDistrictRosterSyncStatusExpressHandler'
import { MaintenanceGetConstructFreeTrialAccountsForSalesExpressHandler } from './handlers/maintenance/ConstructFreeTrialAccountsForSales/MaintenanceConstructFreeTrialAccountsForSalesExpressHandler'
import { PlayerApiPostActionLogExpressHandler } from './handlers/playerApi/PlayerApiPostActionLogExpressHandler'
import { GetChurnZeroAuthenticationExpressHandler } from './handlers/churnzero/GetChurnZeroAuthenticationExpressHandler'

const setupRoutes = (
  dataSource: DataSource,
  staticFilesBaseUrl: string,
  codexUsaFrontendBaseUrl: string,
  lessonPlayerBaseUrl: string,
) => {
  //
  // Insert handlers to generated routes
  //

  // Authentication
  Controllers.AuthenticationController.postLogin = callHandler(
    new LoginExpressHandler(dataSource).handler,
  )

  Controllers.AuthenticationController.postNoCredentialLogin = callHandler(
    new NoCredentialLoginExpressHandler(dataSource).handler,
  )

  Controllers.AuthenticationController.postCleverAuthenticate = callHandler(
    new CleverAuthenticateExpressHandler(dataSource).handler,
  )

  Controllers.AuthenticationController.postGoogleAuthenticate = callHandler(
    new GoogleAuthenticateExpressHandler(dataSource).handler,
  )

  Controllers.AuthenticationController.postClassLinkAuthenticate = callHandler(
    new ClassLinkAuthenticatExpressHandler(dataSource).handler,
  )
  Controllers.AuthenticationController.postUserResetPasswordRequest =
    callHandler(new ResetPasswordRequestExpressHandler(dataSource).handler)

  Controllers.AuthenticationController.postResetPassword = callHandler(
    new ResetPasswordExpressHandler(dataSource).handler,
  )

  Controllers.AuthenticationController.postUserResetPasswordRequestResend =
    callHandler(
      new ResetPasswordRequestResendExpressHandler(dataSource).handler,
    )

  // Clever roaster-sync
  Controllers.CleverRosterSyncController.getCleverRosterSync =
    callHandlerWithToken(new CleverRosterSyncExpressHandler(dataSource).handler)

  Controllers.ClasslinkRosterSyncController.getClasslinkRosterSync =
    callHandlerWithToken(
      new ClasslinkRosterSyncExpressHandler(dataSource).handler,
    )

  // CodeX
  Controllers.CodexController.getLessons = callHandlerWithToken(
    new GetLessonsExpressHandler(
      dataSource,
      staticFilesBaseUrl,
      lessonPlayerBaseUrl,
    ).handler,
  )
  Controllers.CodexController.getUsersUserIdLessonStatuses =
    callHandlerWithToken(
      new GetUserLessonStatusesExpressHandler(dataSource).handler,
    )

  Controllers.CodexController.getUsersUserIdCodeIllusionPackages =
    callHandlerWithToken(
      new GetUserCodeillusionPackagesExpressHandler(
        dataSource,
        staticFilesBaseUrl,
      ).handler,
    )
  Controllers.CodexController.getAllPackages = callHandlerWithToken(
    new GetAllPackagesExpressHandler(dataSource, staticFilesBaseUrl).handler,
  )
  Controllers.CodexController.getPackageDetailsByStudentGroupId =
    callHandlerWithToken(
      new GetCodeIllusionPackagesByStudentGroupIdExpressHandler(
        dataSource,
        staticFilesBaseUrl,
      ).handler,
    )
  Controllers.CodexController.getUserSettings = callHandlerWithToken(
    new GetUserSettingsExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.updateUserSoundSettings = callHandlerWithToken(
    new UpdateUserSoundSettingsExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.getUserPackageAssignments = callHandlerWithToken(
    new GetUserPackageAssignmentExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.postUserPackageAssignment = callHandlerWithToken(
    new CreateUserPackageAssignmentExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.deleteUserPackageAssignment =
    callHandlerWithToken(
      new DeleteUserPackageAssignmentExpressHandler(dataSource).handler,
    )

  Controllers.CodexController.getDistricts = callHandlerWithToken(
    new GetDistrictsExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.getDistrictByDistrictId = callHandlerWithToken(
    new GetDistrictByDistrictIdExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.postDistrict = callHandlerWithToken(
    new CreateDistrictExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.putDistrict = callHandlerWithToken(
    new UpdateDistrictExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.deleteDistrict = callHandlerWithToken(
    new DeleteDistrictExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.getOrganizations = callHandlerWithToken(
    new GetOrganizationsExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.postOrganization = callHandlerWithToken(
    new CreateOrganizationExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.putOrganization = callHandlerWithToken(
    new UpdateOrganizationExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.deleteOrganization = callHandlerWithToken(
    new DeleteOrganizationExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.getAdministrators = callHandlerWithToken(
    new GetAdministratorExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.postAdministrators = callHandlerWithToken(
    new PostAdministratorExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.deleteAdministrator = callHandlerWithToken(
    new DeleteAdministratorExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.putAdministrator = callHandlerWithToken(
    new UpdateUserAdministratorExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.getStudentGroups = callHandlerWithToken(
    new GetStudentGroupsExpressHandler(
      dataSource,
      new AdministratorRepository(dataSource),
    ).handler,
  )
  Controllers.CodexController.postStudentGroup = callHandlerWithToken(
    new CreateStudentGroupExpressHandler(
      dataSource,
      new AdministratorRepository(dataSource),
    ).handler,
  )

  Controllers.CodexController.putStudentGroup = callHandlerWithToken(
    new UpdateStudentGroupExpressHandler(
      dataSource,
      new AdministratorRepository(dataSource),
    ).handler,
  )

  Controllers.CodexController.deleteStudentGroup = callHandlerWithToken(
    new DeleteStudentGroupExpressHandler(
      dataSource,
      new AdministratorRepository(dataSource),
    ).handler,
  )

  Controllers.CodexController.postTeachers = callHandlerWithToken(
    new CreateTeacherExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.putTeacher = callHandlerWithToken(
    new UpdateTeacherExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.deleteTeacher = callHandlerWithToken(
    new DeleteTeacherExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.getTeachers = callHandlerWithToken(
    new GetTeacherExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.getTeacherOrganizations = callHandlerWithToken(
    new GetTeacherByTeacherIdExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.postTeacherInOrganization = callHandlerWithToken(
    new AddTeacherInOrganizationExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.deleteTeacherFromOrganization =
    callHandlerWithToken(
      new RemoveTeacherFromOrganizationExpressHandler(dataSource).handler,
    )
  Controllers.CodexController.postStudentGroupUnaccessibleLesson =
    callHandlerWithToken(
      new StudentGroupUnaccessibleLessonExpressHandler(
        dataSource,
        staticFilesBaseUrl,
        lessonPlayerBaseUrl,
      ).handler,
    )
  Controllers.CodexController.deleteStudentGroupUnaccessibleLesson =
    callHandlerWithToken(
      new RemoveStudentGroupUnaccessibleLessonExpressHandler(
        dataSource,
        staticFilesBaseUrl,
        lessonPlayerBaseUrl,
      ).handler,
    )
  Controllers.CodexController.getUnaccessibleLessons = callHandlerWithToken(
    new GetStudentGroupUnaccessibleLessonsExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.getStudentGroupLessonStatuses =
    callHandlerWithToken(
      new GetStudentGroupLessonsStatusesExpressHandler(dataSource).handler,
    )
  Controllers.CodexController.getLoggedInUser = callHandlerWithToken(
    new GetMeExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.getStudents = callHandlerWithToken(
    new GetStudentsExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.postStudents = callHandlerWithToken(
    new CreateStudentsExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.postStudentInStudentGroup = callHandlerWithToken(
    new AddStudentInStudentGroupExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.putStudent = callHandlerWithToken(
    new UpdateStudentExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.deleteStudent = callHandlerWithToken(
    new DeleteStudentExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.deleteStudentFromStudentGroup =
    callHandlerWithToken(
      new RemoveStudentFromStudentGroupExpressHandler(dataSource).handler,
    )

  Controllers.CodexController.postUserLessonStatus = callHandlerWithToken(
    new CreateUserLessonStatusExpressHandler(
      dataSource,
      staticFilesBaseUrl,
      lessonPlayerBaseUrl,
    ).handler,
  )

  Controllers.CodexController.getStandardMapping = callHandlerWithToken(
    new GetStandardMappingExpressHandler(dataSource).handler,
  )

  Controllers.CodexController.getStudentUnaccessibleLessons =
    callHandlerWithToken(
      new GetStudentUnaccessibleLessonsExpressHandler(dataSource).handler,
    )

  Controllers.CodexController.getStudentGroupPackageAssignments =
    callHandlerWithToken(
      new GetStudentGroupPackageAssignmentsExpressHandler(dataSource).handler,
    )

  Controllers.CodexController.getDistrictPurchasedPackagesByDistrictId =
    callHandlerWithToken(
      new GetDistrictPurchasedPackagesExpressHandler(dataSource).handler,
    )

  Controllers.CodexController.getDistrictLMSInformationByOrganization =
    callHandler(
      new GetDistrictLMSInformationByOrganizationExpressHandler(dataSource)
        .handler,
    )
  Controllers.CodexController.getCodeIllusionPackage = callHandlerWithToken(
    new GetCodeillusionPackagesByPackageIdExpressHandler(
      dataSource,
      staticFilesBaseUrl,
    ).handler,
  )
  Controllers.CodexController.getCsePackage = callHandlerWithToken(
    new GetCsePackageExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.putChangePassword = callHandlerWithToken(
    new ChangeUserPasswordExpressHandler(dataSource).handler,
  )
  Controllers.CodexController.getDistrictRosterSyncStatus =
    callHandlerWithToken(
      new GetDistrictRosterSyncStatusExpressHandler(dataSource).handler,
    )

  // PlayerAPI
  Controllers.PlayerApiController.getCheckToken = callHandlerWithToken(
    new PlayerApiCheckTokenExpressHandler(dataSource, codexUsaFrontendBaseUrl)
      .handler,
  )
  Controllers.PlayerApiController.getPlayersSetting = callHandlerWithToken(
    new PlayerApiGetPlayersSettingExpressHandler(
      dataSource,
      codexUsaFrontendBaseUrl,
    ).handler,
  )
  Controllers.PlayerApiController.getLessonsSetting = callHandlerWithToken(
    new PlayerApiGetLessonSettingExpressHandler(
      dataSource,
      staticFilesBaseUrl,
      lessonPlayerBaseUrl,
      codexUsaFrontendBaseUrl,
    ).handler,
  )
  Controllers.PlayerApiController.postActionLog = callHandlerWithToken(
    new PlayerApiPostActionLogExpressHandler(
      dataSource,
      staticFilesBaseUrl,
      lessonPlayerBaseUrl,
    ).handler,
  )
  Controllers.PlayerApiController.postStepPassed = callHandlerWithToken(
    new PlayerApiPostStepPassedExpressHandler(
      dataSource,
      staticFilesBaseUrl,
      lessonPlayerBaseUrl,
    ).handler,
  )
  Controllers.PlayerApiController.postLessonCleared = callHandlerWithToken(
    new PlayerApiPostLessonClearedExpressHandler(
      dataSource,
      staticFilesBaseUrl,
      lessonPlayerBaseUrl,
    ).handler,
  )
  Controllers.PlayerApiController.postLessonFinished = callHandlerWithToken(
    new PlayerApiPostLessonFinishedExpressHandler(
      dataSource,
      staticFilesBaseUrl,
      lessonPlayerBaseUrl,
      codexUsaFrontendBaseUrl,
    ).handler,
  )
  Controllers.PlayerApiController.getAfterLessonCleared = callHandlerWithToken(
    new PlayerApiGetAfterLessonClearedExpressHandler(
      dataSource,
      codexUsaFrontendBaseUrl,
    ).handler,
  )
  Controllers.PlayerApiController.postQuizAnswered = callHandlerWithToken(
    new PlayerApiPostQuizAnswredExpressHandler(
      dataSource,
      staticFilesBaseUrl,
      lessonPlayerBaseUrl,
    ).handler,
  )
  Controllers.PlayerApiController.postLessonSheetChanged = callHandlerWithToken(
    new PlayerApiPostLessonSheetChangedExpressHandler(
      dataSource,
      lessonPlayerBaseUrl,
    ).handler,
  )
  Controllers.PlayerApiController.getPlayersServerStatus = async (
    req: express.Request,
    res: express.Response,
  ) => {
    const response200: Paths.GetPlayersServerStatus.Responses.$200 = {
      isMaintenance: false,
    }

    res.status(200).json(response200)
  }

  // ChurnZero
  Controllers.ChurnzeroController.getChurnZeroAuthentication = callHandler(
    new GetChurnZeroAuthenticationExpressHandler().handler,
  )

  // Maintenance API
  Controllers.MaintenanceController.maintenanceHealthCheck =
    callHandlerWithLambdaEvent(
      new MaintenanceHealthCheckExpressHandler().handler,
    )
  Controllers.MaintenanceController.maintenanceGetUsers = callHandler(
    new MaintenanceGetUsersExpressHandler(dataSource).handler,
  )
  Controllers.MaintenanceController.maintenancePostUsers = callHandler(
    new MaintenanceCreateUsersExpressHandler(dataSource).handler,
  )
  Controllers.MaintenanceController.maintenancePutUsers = callHandler(
    new MaintenanceUpdateUsersExpressHandler(dataSource).handler,
  )
  Controllers.MaintenanceController.maintenancePutDistricts = callHandler(
    new MaintenanceCreateOrUpdateDistrictsExpressHandler(dataSource).handler,
  )
  Controllers.MaintenanceController.maintenanceGetDistricts = callHandler(
    new MaintenanceGetDistrictsExpressHandler(dataSource).handler,
  )
  Controllers.MaintenanceController.maintenancePutOrganizations = callHandler(
    new MaintenanceCreateOrUpdateOrganizationsExpressHandler(dataSource)
      .handler,
  )
  Controllers.MaintenanceController.maintenanceGetOrganizations = callHandler(
    new MaintenanceGetOrganizationsExpressHandler(dataSource).handler,
  )
  Controllers.MaintenanceController.maintenancePutStudentGroups = callHandler(
    new MaintenanceCreateOrUpdateStudentGroupsExpressHandler(dataSource)
      .handler,
  )
  Controllers.MaintenanceController.maintenanceGetStudentGroups = callHandler(
    new MaintenanceGetStudentGroupsExpressHandler(dataSource).handler,
  )
  Controllers.MaintenanceController.maintenanceGetAdministratorDistricts =
    callHandler(
      new MaintenanceGetAdministratorDistrictsExpressHandler(dataSource)
        .handler,
    )
  Controllers.MaintenanceController.maintenancePostAdministratorDistricts =
    callHandler(
      new MaintenanceCreateAdministratorDistrictsExpressHandler(dataSource)
        .handler,
    )
  Controllers.MaintenanceController.maintenanceDeleteAdministratorDistricts =
    callHandler(
      new MaintenanceDeleteAdministratorDistrictsExpressHandler(dataSource)
        .handler,
    )
  Controllers.MaintenanceController.maintenanceGetTeacherOrganizations =
    callHandler(
      new MaintenanceGetTeacherOrganizationsExpressHandler(dataSource).handler,
    )
  Controllers.MaintenanceController.maintenancePostTeacherOrganizations =
    callHandler(
      new MaintenanceCreateTeacherOrganizationsExpressHandler(dataSource)
        .handler,
    )
  Controllers.MaintenanceController.maintenanceDeleteTeacherOrganizations =
    callHandler(
      new MaintenanceDeleteTeacherOrganizationsExpressHandler(dataSource)
        .handler,
    )
  Controllers.MaintenanceController.maintenanceGetStudentGroupStudents =
    callHandler(
      new MaintenanceGetStudentGroupStudentsExpressHandler(dataSource).handler,
    )
  Controllers.MaintenanceController.maintenancePostStudentGroupStudents =
    callHandler(
      new MaintenanceCreateStudentGroupStudentsExpressHandler(dataSource)
        .handler,
    )
  Controllers.MaintenanceController.maintenanceDeleteStudentGroupStudents =
    callHandler(
      new MaintenanceDeleteStudentGroupStudentsExpressHandler(dataSource)
        .handler,
    )
  Controllers.MaintenanceController.maintenancePostAccountNotification =
    callHandler(
      new MaintenanceCreateAccountNotificationExpressHandler(
        'ap-north-1', // TODO: get from env
        true, // TODO: get from env
      ).handler,
    )
  Controllers.MaintenanceController.maintenanceGetConstructFreeTrialAccountsForSales =
    callHandler(
      new MaintenanceGetConstructFreeTrialAccountsForSalesExpressHandler(
        dataSource,
      ).handler,
    )
}

export const createApp: () => Promise<Express> = async () => {
  /* Environment Variable Config */
  dotenv.config()

  if (!process.env.ROOT_FOLDER_PATH) {
    throw new Error(`process.env.ROOT_FOLDER_PATH is not defined`)
  }

  // Database Connection configs
  if (!process.env.POSTGRES_DATABASE_DIALECT) {
    throw new Error(`process.env.POSTGRES_DATABASE_DIALECT is not defined`)
  }

  if (!process.env.POSTGRES_DATABASE_HOST) {
    throw new Error(`process.env.POSTGRES_DATABASE_HOST is not defined`)
  }

  if (!process.env.POSTGRES_DATABASE_PORT) {
    throw new Error(`process.env.POSTGRES_DATABASE_PORT is not defined`)
  }

  if (!process.env.POSTGRES_DATABASE_USERNAME) {
    throw new Error(`process.env.POSTGRES_DATABASE_USERNAME is not defined`)
  }

  if (!process.env.POSTGRES_DATABASE_PASSWORD) {
    throw new Error(`process.env.POSTGRES_DATABASE_PASSWORD is not defined`)
  }

  if (!process.env.POSTGRES_DATABASE_NAME) {
    throw new Error(`process.env.POSTGRES_DATABASE_NAME is not defined`)
  }

  // Base URLs
  if (!process.env.STATIC_FILES_BASE_URL) {
    throw new Error(`process.env.STATIC_FILES_BASE_URL is not defined`)
  }

  if (!process.env.CODEX_USA_FRONTEND_BASE_URL) {
    throw new Error(`process.env.CODEX_USA_FRONTEND_BASE_URL is not defined`)
  }

  if (!process.env.LESSON_PLAYER_BASE_URL) {
    throw new Error(`process.env.LESSON_PLAYER_BASE_URL is not defined`)
  }

  // Database Connection
  const POSTGRES_DATABASE_PORT = parseInt(
    process.env.POSTGRES_DATABASE_PORT,
    10,
  )

  if (isNaN(POSTGRES_DATABASE_PORT)) {
    throw new Error(`process.env.POSTGRES_DATABASE_PORT is not a number`)
  }

  const appDataSource = createAppDataSource({
    POSTGRES_DATABASE_DIALECT: process.env
      .POSTGRES_DATABASE_DIALECT as DatabaseType,
    POSTGRES_DATABASE_HOST: process.env.POSTGRES_DATABASE_HOST,
    POSTGRES_DATABASE_PORT: parseInt(process.env.POSTGRES_DATABASE_PORT),
    POSTGRES_DATABASE_USERNAME: process.env.POSTGRES_DATABASE_USERNAME,
    POSTGRES_DATABASE_PASSWORD: process.env.POSTGRES_DATABASE_PASSWORD,
    POSTGRES_DATABASE_NAME: process.env.POSTGRES_DATABASE_NAME,
    ROOT_FOLDER_PATH: process.env.ROOT_FOLDER_PATH,
  })

  await appDataSource.initialize()

  // Set up Routes
  setupRoutes(
    appDataSource,
    process.env.STATIC_FILES_BASE_URL,
    process.env.CODEX_USA_FRONTEND_BASE_URL,
    process.env.LESSON_PLAYER_BASE_URL,
  )

  const app = express()

  app.use(cors())
  app.use(bodyParser.json({ limit: '14MB' }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(bearerToken())
  app.use(
    '/v2/graphql',
    codexV2Server(
      appDataSource,
      process.env.STATIC_FILES_BASE_URL,
      process.env.LESSON_PLAYER_BASE_URL,
    ),
  )

  app.get('/', (req, res) => res.send({ message: 'Hello World' }))

  try {
    await new OpenApiValidator({
      apiSpec: resolve(
        __dirname,
        '../_gen/codex-usa-backend-server/api/openapi.yaml',
      ),
      operationHandlers: path.resolve(
        __dirname,
        '../_gen/codex-usa-backend-server',
      ),
      validateRequests: {
        allowUnknownQueryParameters: true,
      },
      validateResponses: true,
    })
      .install(app)
      .then(() => {
        app.use(
          (
            error: HttpError,
            req: Request,
            res: Response,
            next: NextFunction,
          ) => {
            // Handle error from validator with formatting as json
            res.status(error.status || 500).json({
              message: error.message,
              errors: error.errors,
            })
          },
        )
      })
  } catch (e) {
    throw new Error(`failed to install OpanApiValidator ${e}`)
  }

  return app
}
