export declare namespace Components {
    namespace Schemas {
        /**
         * administrator
         */
        export interface Administrator {
            email?: string;
            firstName?: string;
            lastName?: string;
            administratorLMSId?: string;
            password?: string;
        }
        /**
         * CodeIllusionPackage
         * example:
         * {
         *   "level": "basic",
         *   "headerButtonText": "headerButtonText",
         *   "chapters": [
         *     {
         *       "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
         *       "name": "name",
         *       "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
         *       "circles": [
         *         {
         *           "bookImageUrl": "bookImageUrl",
         *           "allLessonIds": [
         *             "allLessonIds",
         *             "allLessonIds"
         *           ],
         *           "course": "basic",
         *           "characterImageUrl": "characterImageUrl",
         *           "id": "id",
         *           "gemLessonIds": [
         *             "gemLessonIds",
         *             "gemLessonIds"
         *           ],
         *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *           "bookLessonIds": [
         *             "bookLessonIds",
         *             "bookLessonIds"
         *           ],
         *           "bookName": "bookName"
         *         },
         *         {
         *           "bookImageUrl": "bookImageUrl",
         *           "allLessonIds": [
         *             "allLessonIds",
         *             "allLessonIds"
         *           ],
         *           "course": "basic",
         *           "characterImageUrl": "characterImageUrl",
         *           "id": "id",
         *           "gemLessonIds": [
         *             "gemLessonIds",
         *             "gemLessonIds"
         *           ],
         *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *           "bookLessonIds": [
         *             "bookLessonIds",
         *             "bookLessonIds"
         *           ],
         *           "bookName": "bookName"
         *         }
         *       ],
         *       "id": "id",
         *       "title": "title"
         *     },
         *     {
         *       "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
         *       "name": "name",
         *       "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
         *       "circles": [
         *         {
         *           "bookImageUrl": "bookImageUrl",
         *           "allLessonIds": [
         *             "allLessonIds",
         *             "allLessonIds"
         *           ],
         *           "course": "basic",
         *           "characterImageUrl": "characterImageUrl",
         *           "id": "id",
         *           "gemLessonIds": [
         *             "gemLessonIds",
         *             "gemLessonIds"
         *           ],
         *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *           "bookLessonIds": [
         *             "bookLessonIds",
         *             "bookLessonIds"
         *           ],
         *           "bookName": "bookName"
         *         },
         *         {
         *           "bookImageUrl": "bookImageUrl",
         *           "allLessonIds": [
         *             "allLessonIds",
         *             "allLessonIds"
         *           ],
         *           "course": "basic",
         *           "characterImageUrl": "characterImageUrl",
         *           "id": "id",
         *           "gemLessonIds": [
         *             "gemLessonIds",
         *             "gemLessonIds"
         *           ],
         *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *           "bookLessonIds": [
         *             "bookLessonIds",
         *             "bookLessonIds"
         *           ],
         *           "bookName": "bookName"
         *         }
         *       ],
         *       "id": "id",
         *       "title": "title"
         *     }
         *   ],
         *   "name": "name",
         *   "id": "id",
         *   "redirectUrlWhenAllFinished": "redirectUrlWhenAllFinished",
         *   "headerButtonLink": "headerButtonLink"
         * }
         */
        export interface CodeIllusionPackage {
            id: string;
            level: "basic" | "advanced";
            name: string;
            headerButtonLink: string | null;
            headerButtonText: string | null;
            redirectUrlWhenAllFinished: string | null;
            chapters: /**
             * example:
             * {
             *   "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *   "name": "name",
             *   "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
             *   "circles": [
             *     {
             *       "bookImageUrl": "bookImageUrl",
             *       "allLessonIds": [
             *         "allLessonIds",
             *         "allLessonIds"
             *       ],
             *       "course": "basic",
             *       "characterImageUrl": "characterImageUrl",
             *       "id": "id",
             *       "gemLessonIds": [
             *         "gemLessonIds",
             *         "gemLessonIds"
             *       ],
             *       "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *       "bookLessonIds": [
             *         "bookLessonIds",
             *         "bookLessonIds"
             *       ],
             *       "bookName": "bookName"
             *     },
             *     {
             *       "bookImageUrl": "bookImageUrl",
             *       "allLessonIds": [
             *         "allLessonIds",
             *         "allLessonIds"
             *       ],
             *       "course": "basic",
             *       "characterImageUrl": "characterImageUrl",
             *       "id": "id",
             *       "gemLessonIds": [
             *         "gemLessonIds",
             *         "gemLessonIds"
             *       ],
             *       "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *       "bookLessonIds": [
             *         "bookLessonIds",
             *         "bookLessonIds"
             *       ],
             *       "bookName": "bookName"
             *     }
             *   ],
             *   "id": "id",
             *   "title": "title"
             * }
             */
            CodeIllusionPackageChaptersInner[];
        }
        /**
         * example:
         * {
         *   "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
         *   "name": "name",
         *   "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
         *   "circles": [
         *     {
         *       "bookImageUrl": "bookImageUrl",
         *       "allLessonIds": [
         *         "allLessonIds",
         *         "allLessonIds"
         *       ],
         *       "course": "basic",
         *       "characterImageUrl": "characterImageUrl",
         *       "id": "id",
         *       "gemLessonIds": [
         *         "gemLessonIds",
         *         "gemLessonIds"
         *       ],
         *       "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *       "bookLessonIds": [
         *         "bookLessonIds",
         *         "bookLessonIds"
         *       ],
         *       "bookName": "bookName"
         *     },
         *     {
         *       "bookImageUrl": "bookImageUrl",
         *       "allLessonIds": [
         *         "allLessonIds",
         *         "allLessonIds"
         *       ],
         *       "course": "basic",
         *       "characterImageUrl": "characterImageUrl",
         *       "id": "id",
         *       "gemLessonIds": [
         *         "gemLessonIds",
         *         "gemLessonIds"
         *       ],
         *       "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *       "bookLessonIds": [
         *         "bookLessonIds",
         *         "bookLessonIds"
         *       ],
         *       "bookName": "bookName"
         *     }
         *   ],
         *   "id": "id",
         *   "title": "title"
         * }
         */
        export interface CodeIllusionPackageChaptersInner {
            id: string;
            name: string;
            title: string;
            lessonNoteSheetsZipUrl?: string;
            lessonOverViewPdfUrl?: string;
            circles: /**
             * example:
             * {
             *   "bookImageUrl": "bookImageUrl",
             *   "allLessonIds": [
             *     "allLessonIds",
             *     "allLessonIds"
             *   ],
             *   "course": "basic",
             *   "characterImageUrl": "characterImageUrl",
             *   "id": "id",
             *   "gemLessonIds": [
             *     "gemLessonIds",
             *     "gemLessonIds"
             *   ],
             *   "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *   "bookLessonIds": [
             *     "bookLessonIds",
             *     "bookLessonIds"
             *   ],
             *   "bookName": "bookName"
             * }
             */
            CodeIllusionPackageChaptersInnerCirclesInner[];
        }
        /**
         * example:
         * {
         *   "bookImageUrl": "bookImageUrl",
         *   "allLessonIds": [
         *     "allLessonIds",
         *     "allLessonIds"
         *   ],
         *   "course": "basic",
         *   "characterImageUrl": "characterImageUrl",
         *   "id": "id",
         *   "gemLessonIds": [
         *     "gemLessonIds",
         *     "gemLessonIds"
         *   ],
         *   "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *   "bookLessonIds": [
         *     "bookLessonIds",
         *     "bookLessonIds"
         *   ],
         *   "bookName": "bookName"
         * }
         */
        export interface CodeIllusionPackageChaptersInnerCirclesInner {
            id: string;
            /**
             * Course
             */
            course: "basic" | "webDesign" | "mediaArt" | "gameDevelopment" | "";
            characterImageUrl: string;
            clearedCharacterImageUrl: string;
            gemLessonIds: string[];
            bookLessonIds: string[];
            bookName: string;
            bookImageUrl: string;
            allLessonIds: string[];
        }
        /**
         * CsePackage
         * example:
         * {
         *   "headerButtonText": "headerButtonText",
         *   "name": "name",
         *   "id": "id",
         *   "units": [
         *     {
         *       "name": "name",
         *       "description": "description",
         *       "id": "id",
         *       "lessons": [
         *         {
         *           "isQuizLesson": true,
         *           "id": "id"
         *         },
         *         {
         *           "isQuizLesson": true,
         *           "id": "id"
         *         }
         *       ]
         *     },
         *     {
         *       "name": "name",
         *       "description": "description",
         *       "id": "id",
         *       "lessons": [
         *         {
         *           "isQuizLesson": true,
         *           "id": "id"
         *         },
         *         {
         *           "isQuizLesson": true,
         *           "id": "id"
         *         }
         *       ]
         *     }
         *   ],
         *   "headerButtonLink": "headerButtonLink"
         * }
         */
        export interface CsePackage {
            id: string;
            name: string;
            headerButtonLink: string | null;
            headerButtonText: string | null;
            units: /**
             * example:
             * {
             *   "name": "name",
             *   "description": "description",
             *   "id": "id",
             *   "lessons": [
             *     {
             *       "isQuizLesson": true,
             *       "id": "id"
             *     },
             *     {
             *       "isQuizLesson": true,
             *       "id": "id"
             *     }
             *   ]
             * }
             */
            CsePackageUnitsInner[];
        }
        /**
         * example:
         * {
         *   "name": "name",
         *   "description": "description",
         *   "id": "id",
         *   "lessons": [
         *     {
         *       "isQuizLesson": true,
         *       "id": "id"
         *     },
         *     {
         *       "isQuizLesson": true,
         *       "id": "id"
         *     }
         *   ]
         * }
         */
        export interface CsePackageUnitsInner {
            id: string;
            name: string;
            description: string;
            lessons: /**
             * example:
             * {
             *   "isQuizLesson": true,
             *   "id": "id"
             * }
             */
            CsePackageUnitsInnerLessonsInner[];
        }
        /**
         * example:
         * {
         *   "isQuizLesson": true,
         *   "id": "id"
         * }
         */
        export interface CsePackageUnitsInnerLessonsInner {
            id: string;
            isQuizLesson: boolean;
        }
        /**
         * example:
         * {
         *   "message": "message"
         * }
         */
        export interface DeleteUserPackageAssignment200Response {
            message: string;
        }
        export interface DeleteUserPackageAssignmentRequest {
            packageCategoryId: string;
            userId: string;
        }
        /**
         * District
         * The Definition of Get Districts.
         * example:
         * {
         *   "lastRosterSyncEventId": "lastRosterSyncEventId",
         *   "lastRosterSyncEventDate": "lastRosterSyncEventDate",
         *   "stateId": "stateId",
         *   "name": "name",
         *   "lmsId": "lmsId",
         *   "id": "id",
         *   "districtLMSId": "districtLMSId",
         *   "administrators": "administrators",
         *   "enableRosterSync": true
         * }
         */
        export interface District {
            id: string;
            name: string;
            districtLMSId: string;
            lastRosterSyncEventId: string;
            lastRosterSyncEventDate: string;
            enableRosterSync: boolean;
            lmsId?: string;
            stateId?: string;
            administrators?: string;
        }
        /**
         * DistrictWithId
         * The Definition of Get Districts.
         */
        export interface DistrictWithId {
            id: string;
            name: string;
            stateId: string;
            lmsId?: string;
            enableRosterSync?: boolean;
            districtLmsId?: string;
        }
        /**
         * Error
         */
        export interface Error {
            error: string;
        }
        /**
         * example:
         * {
         *   "administrators": [
         *     {
         *       "firstName": "firstName",
         *       "lastName": "lastName",
         *       "administratorId": "administratorId",
         *       "districtId": "districtId",
         *       "createdUserId": "createdUserId",
         *       "createdDate": "createdDate",
         *       "userId": "userId",
         *       "email": "email",
         *       "administratorLMSId": "administratorLMSId"
         *     },
         *     {
         *       "firstName": "firstName",
         *       "lastName": "lastName",
         *       "administratorId": "administratorId",
         *       "districtId": "districtId",
         *       "createdUserId": "createdUserId",
         *       "createdDate": "createdDate",
         *       "userId": "userId",
         *       "email": "email",
         *       "administratorLMSId": "administratorLMSId"
         *     }
         *   ]
         * }
         */
        export interface GetAdministrators200Response {
            administrators?: /**
             * Administrator
             * Administrator
             * example:
             * {
             *   "firstName": "firstName",
             *   "lastName": "lastName",
             *   "administratorId": "administratorId",
             *   "districtId": "districtId",
             *   "createdUserId": "createdUserId",
             *   "createdDate": "createdDate",
             *   "userId": "userId",
             *   "email": "email",
             *   "administratorLMSId": "administratorLMSId"
             * }
             */
            Administrator[];
        }
        /**
         * example:
         * {
         *   "packages": [
         *     {
         *       "packageId": "packageId",
         *       "packageCategoryId": "codeillusion",
         *       "packageName": "packageName"
         *     },
         *     {
         *       "packageId": "packageId",
         *       "packageCategoryId": "codeillusion",
         *       "packageName": "packageName"
         *     }
         *   ]
         * }
         */
        export interface GetAllPackages200Response {
            packages?: /**
             * example:
             * {
             *   "packageId": "packageId",
             *   "packageCategoryId": "codeillusion",
             *   "packageName": "packageName"
             * }
             */
            GetAllPackages200ResponsePackagesInner[];
        }
        /**
         * example:
         * {
         *   "packageId": "packageId",
         *   "packageCategoryId": "codeillusion",
         *   "packageName": "packageName"
         * }
         */
        export interface GetAllPackages200ResponsePackagesInner {
            packageCategoryId: "codeillusion" | "cse";
            /**
             * it is the id of the package.
             */
            packageId: string;
            /**
             * it is the name of the package.
             */
            packageName: string;
        }
        /**
         *
         * example:
         * {
         *   "result": "valid",
         *   "isAccessible": true,
         *   "name": "name"
         * }
         */
        export interface GetCheckToken200Response {
            result: "valid";
            isAccessible: boolean;
            name: string;
        }
        /**
         *
         */
        export interface GetCheckToken401Response {
            result: "invalid";
            isAccessible: boolean;
            redirect_url: string;
        }
        /**
         *
         */
        export interface GetChurnZeroAuthentication302Response {
            authToken: string;
        }
        /**
         *
         * example:
         * {
         *   "message": "ok"
         * }
         */
        export interface GetClasslinkRosterSync200Response {
            message?: "ok";
        }
        /**
         *
         * example:
         * {
         *   "message": "message"
         * }
         */
        export interface GetCleverRosterSync200Response {
            message?: string;
        }
        /**
         * example:
         * {
         *   "csePackage": {
         *     "headerButtonText": "headerButtonText",
         *     "name": "name",
         *     "id": "id",
         *     "units": [
         *       {
         *         "name": "name",
         *         "description": "description",
         *         "id": "id",
         *         "lessons": [
         *           {
         *             "isQuizLesson": true,
         *             "id": "id"
         *           },
         *           {
         *             "isQuizLesson": true,
         *             "id": "id"
         *           }
         *         ]
         *       },
         *       {
         *         "name": "name",
         *         "description": "description",
         *         "id": "id",
         *         "lessons": [
         *           {
         *             "isQuizLesson": true,
         *             "id": "id"
         *           },
         *           {
         *             "isQuizLesson": true,
         *             "id": "id"
         *           }
         *         ]
         *       }
         *     ],
         *     "headerButtonLink": "headerButtonLink"
         *   }
         * }
         */
        export interface GetCsePackage200Response {
            csePackage: /**
             * CsePackage
             * example:
             * {
             *   "headerButtonText": "headerButtonText",
             *   "name": "name",
             *   "id": "id",
             *   "units": [
             *     {
             *       "name": "name",
             *       "description": "description",
             *       "id": "id",
             *       "lessons": [
             *         {
             *           "isQuizLesson": true,
             *           "id": "id"
             *         },
             *         {
             *           "isQuizLesson": true,
             *           "id": "id"
             *         }
             *       ]
             *     },
             *     {
             *       "name": "name",
             *       "description": "description",
             *       "id": "id",
             *       "lessons": [
             *         {
             *           "isQuizLesson": true,
             *           "id": "id"
             *         },
             *         {
             *           "isQuizLesson": true,
             *           "id": "id"
             *         }
             *       ]
             *     }
             *   ],
             *   "headerButtonLink": "headerButtonLink"
             * }
             */
            CsePackage;
        }
        /**
         * example:
         * {
         *   "districtId": "districtId",
         *   "districtName": "districtName",
         *   "lmsId": "lmsId"
         * }
         */
        export interface GetDistrictLMSInformationByOrganization200Response {
            districtId: string;
            /**
             * This is a district name.
             */
            districtName: string;
            /**
             * This is a lmsId like(None, Clever, Claslink, Google).
             */
            lmsId: string;
        }
        /**
         * example:
         * {
         *   "packages": [
         *     {
         *       "packageId": "packageId",
         *       "packageCategoryId": "packageCategoryId",
         *       "packageName": "packageName"
         *     },
         *     {
         *       "packageId": "packageId",
         *       "packageCategoryId": "packageCategoryId",
         *       "packageName": "packageName"
         *     }
         *   ]
         * }
         */
        export interface GetDistrictPurchasedPackagesByDistrictId200Response {
            packages: /**
             * example:
             * {
             *   "packageId": "packageId",
             *   "packageCategoryId": "packageCategoryId",
             *   "packageName": "packageName"
             * }
             */
            GetDistrictPurchasedPackagesByDistrictId200ResponsePackagesInner[];
        }
        /**
         * example:
         * {
         *   "packageId": "packageId",
         *   "packageCategoryId": "packageCategoryId",
         *   "packageName": "packageName"
         * }
         */
        export interface GetDistrictPurchasedPackagesByDistrictId200ResponsePackagesInner {
            packageCategoryId: string;
            /**
             * it is the id of the package.
             */
            packageId: string;
            /**
             * it is the name of the package.
             */
            packageName: string;
        }
        /**
         * example:
         * {
         *   "districtRosterSyncStatuses": [
         *     {
         *       "districtId": "districtId",
         *       "createdUserId": "createdUserId",
         *       "errorMessage": "errorMessage",
         *       "startedAt": "startedAt",
         *       "id": "id",
         *       "finishedAt": "finishedAt"
         *     },
         *     {
         *       "districtId": "districtId",
         *       "createdUserId": "createdUserId",
         *       "errorMessage": "errorMessage",
         *       "startedAt": "startedAt",
         *       "id": "id",
         *       "finishedAt": "finishedAt"
         *     }
         *   ]
         * }
         */
        export interface GetDistrictRosterSyncStatus200Response {
            districtRosterSyncStatuses: /**
             * example:
             * {
             *   "districtId": "districtId",
             *   "createdUserId": "createdUserId",
             *   "errorMessage": "errorMessage",
             *   "startedAt": "startedAt",
             *   "id": "id",
             *   "finishedAt": "finishedAt"
             * }
             */
            GetDistrictRosterSyncStatus200ResponseDistrictRosterSyncStatusesInner[];
        }
        /**
         * example:
         * {
         *   "districtId": "districtId",
         *   "createdUserId": "createdUserId",
         *   "errorMessage": "errorMessage",
         *   "startedAt": "startedAt",
         *   "id": "id",
         *   "finishedAt": "finishedAt"
         * }
         */
        export interface GetDistrictRosterSyncStatus200ResponseDistrictRosterSyncStatusesInner {
            id: string;
            districtId: string;
            startedAt: string;
            finishedAt?: string;
            errorMessage?: string;
            createdUserId?: string;
        }
        /**
         * example:
         * {
         *   "districts": [
         *     {
         *       "lastRosterSyncEventId": "lastRosterSyncEventId",
         *       "lastRosterSyncEventDate": "lastRosterSyncEventDate",
         *       "stateId": "stateId",
         *       "name": "name",
         *       "lmsId": "lmsId",
         *       "id": "id",
         *       "districtLMSId": "districtLMSId",
         *       "administrators": "administrators",
         *       "enableRosterSync": true
         *     },
         *     {
         *       "lastRosterSyncEventId": "lastRosterSyncEventId",
         *       "lastRosterSyncEventDate": "lastRosterSyncEventDate",
         *       "stateId": "stateId",
         *       "name": "name",
         *       "lmsId": "lmsId",
         *       "id": "id",
         *       "districtLMSId": "districtLMSId",
         *       "administrators": "administrators",
         *       "enableRosterSync": true
         *     }
         *   ]
         * }
         */
        export interface GetDistricts200Response {
            districts?: /**
             * District
             * The Definition of Get Districts.
             * example:
             * {
             *   "lastRosterSyncEventId": "lastRosterSyncEventId",
             *   "lastRosterSyncEventDate": "lastRosterSyncEventDate",
             *   "stateId": "stateId",
             *   "name": "name",
             *   "lmsId": "lmsId",
             *   "id": "id",
             *   "districtLMSId": "districtLMSId",
             *   "administrators": "administrators",
             *   "enableRosterSync": true
             * }
             */
            District[];
        }
        /**
         * example:
         * {
         *   "lessons": [
         *     {
         *       "maxStarCount": 0.8008281904610115,
         *       "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
         *       "lessonEnvironment": "litLessonPlayer",
         *       "hintCount": 1.4658129805029452,
         *       "level": "basic",
         *       "lessonDuration": "lessonDuration",
         *       "lessonObjectives": "lessonObjectives",
         *       "description": "description",
         *       "url": "url",
         *       "skillsLearnedInThisLesson": "skillsLearnedInThisLesson",
         *       "thumbnailImageUrl": "thumbnailImageUrl",
         *       "name": "name",
         *       "course": "basic",
         *       "theme": "theme",
         *       "quizCount": 6.027456183070403,
         *       "id": "id",
         *       "projectName": "projectName",
         *       "scenarioName": "scenarioName"
         *     },
         *     {
         *       "maxStarCount": 0.8008281904610115,
         *       "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
         *       "lessonEnvironment": "litLessonPlayer",
         *       "hintCount": 1.4658129805029452,
         *       "level": "basic",
         *       "lessonDuration": "lessonDuration",
         *       "lessonObjectives": "lessonObjectives",
         *       "description": "description",
         *       "url": "url",
         *       "skillsLearnedInThisLesson": "skillsLearnedInThisLesson",
         *       "thumbnailImageUrl": "thumbnailImageUrl",
         *       "name": "name",
         *       "course": "basic",
         *       "theme": "theme",
         *       "quizCount": 6.027456183070403,
         *       "id": "id",
         *       "projectName": "projectName",
         *       "scenarioName": "scenarioName"
         *     }
         *   ]
         * }
         */
        export interface GetLessons200Response {
            lessons: /**
             * Lesson
             * The Definition of Lesson
             * example:
             * {
             *   "maxStarCount": 0.8008281904610115,
             *   "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *   "lessonEnvironment": "litLessonPlayer",
             *   "hintCount": 1.4658129805029452,
             *   "level": "basic",
             *   "lessonDuration": "lessonDuration",
             *   "lessonObjectives": "lessonObjectives",
             *   "description": "description",
             *   "url": "url",
             *   "skillsLearnedInThisLesson": "skillsLearnedInThisLesson",
             *   "thumbnailImageUrl": "thumbnailImageUrl",
             *   "name": "name",
             *   "course": "basic",
             *   "theme": "theme",
             *   "quizCount": 6.027456183070403,
             *   "id": "id",
             *   "projectName": "projectName",
             *   "scenarioName": "scenarioName"
             * }
             */
            Lesson[];
        }
        /**
         *
         * example:
         * {
         *   "redirecetUrl": "redirecetUrl",
         *   "isAccessible": true,
         *   "passed_step_id_list": [
         *     0.8008281904610115,
         *     0.8008281904610115
         *   ],
         *   "cleared": true
         * }
         */
        export interface GetLessonsSetting200Response {
            isAccessible: boolean;
            cleared: boolean;
            redirecetUrl: string;
            passed_step_id_list: number[];
        }
        /**
         *
         */
        export interface GetLessonsSetting401Response {
            isAccessible: boolean;
            redirectUrl: string;
        }
        /**
         * example:
         * {
         *   "organizations": [
         *     {
         *       "districtId": "districtId",
         *       "createdUserId": "createdUserId",
         *       "createdDate": "2000-01-23T04:56:07.000Z",
         *       "stateId": "stateId",
         *       "name": "name",
         *       "id": "id",
         *       "organizationLMSId": "organizationLMSId",
         *       "updatedDate": "2000-01-23T04:56:07.000Z"
         *     },
         *     {
         *       "districtId": "districtId",
         *       "createdUserId": "createdUserId",
         *       "createdDate": "2000-01-23T04:56:07.000Z",
         *       "stateId": "stateId",
         *       "name": "name",
         *       "id": "id",
         *       "organizationLMSId": "organizationLMSId",
         *       "updatedDate": "2000-01-23T04:56:07.000Z"
         *     }
         *   ]
         * }
         */
        export interface GetOrganizations200Response {
            organizations?: /**
             * Organization
             * The Definition of Get Organizations.
             * example:
             * {
             *   "districtId": "districtId",
             *   "createdUserId": "createdUserId",
             *   "createdDate": "2000-01-23T04:56:07.000Z",
             *   "stateId": "stateId",
             *   "name": "name",
             *   "id": "id",
             *   "organizationLMSId": "organizationLMSId",
             *   "updatedDate": "2000-01-23T04:56:07.000Z"
             * }
             */
            Organization[];
        }
        /**
         * example:
         * {
         *   "package": {
         *     "level": "basic",
         *     "headerButtonText": "headerButtonText",
         *     "chapters": [
         *       {
         *         "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
         *         "name": "name",
         *         "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
         *         "circles": [
         *           {
         *             "bookImageUrl": "bookImageUrl",
         *             "allLessonIds": [
         *               "allLessonIds",
         *               "allLessonIds"
         *             ],
         *             "course": "basic",
         *             "characterImageUrl": "characterImageUrl",
         *             "id": "id",
         *             "gemLessonIds": [
         *               "gemLessonIds",
         *               "gemLessonIds"
         *             ],
         *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *             "bookLessonIds": [
         *               "bookLessonIds",
         *               "bookLessonIds"
         *             ],
         *             "bookName": "bookName"
         *           },
         *           {
         *             "bookImageUrl": "bookImageUrl",
         *             "allLessonIds": [
         *               "allLessonIds",
         *               "allLessonIds"
         *             ],
         *             "course": "basic",
         *             "characterImageUrl": "characterImageUrl",
         *             "id": "id",
         *             "gemLessonIds": [
         *               "gemLessonIds",
         *               "gemLessonIds"
         *             ],
         *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *             "bookLessonIds": [
         *               "bookLessonIds",
         *               "bookLessonIds"
         *             ],
         *             "bookName": "bookName"
         *           }
         *         ],
         *         "id": "id",
         *         "title": "title"
         *       },
         *       {
         *         "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
         *         "name": "name",
         *         "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
         *         "circles": [
         *           {
         *             "bookImageUrl": "bookImageUrl",
         *             "allLessonIds": [
         *               "allLessonIds",
         *               "allLessonIds"
         *             ],
         *             "course": "basic",
         *             "characterImageUrl": "characterImageUrl",
         *             "id": "id",
         *             "gemLessonIds": [
         *               "gemLessonIds",
         *               "gemLessonIds"
         *             ],
         *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *             "bookLessonIds": [
         *               "bookLessonIds",
         *               "bookLessonIds"
         *             ],
         *             "bookName": "bookName"
         *           },
         *           {
         *             "bookImageUrl": "bookImageUrl",
         *             "allLessonIds": [
         *               "allLessonIds",
         *               "allLessonIds"
         *             ],
         *             "course": "basic",
         *             "characterImageUrl": "characterImageUrl",
         *             "id": "id",
         *             "gemLessonIds": [
         *               "gemLessonIds",
         *               "gemLessonIds"
         *             ],
         *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *             "bookLessonIds": [
         *               "bookLessonIds",
         *               "bookLessonIds"
         *             ],
         *             "bookName": "bookName"
         *           }
         *         ],
         *         "id": "id",
         *         "title": "title"
         *       }
         *     ],
         *     "name": "name",
         *     "id": "id",
         *     "redirectUrlWhenAllFinished": "redirectUrlWhenAllFinished",
         *     "headerButtonLink": "headerButtonLink"
         *   }
         * }
         */
        export interface GetPackageDetailsByStudentGroupId200Response {
            package?: /**
             * CodeIllusionPackage
             * example:
             * {
             *   "level": "basic",
             *   "headerButtonText": "headerButtonText",
             *   "chapters": [
             *     {
             *       "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *       "name": "name",
             *       "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
             *       "circles": [
             *         {
             *           "bookImageUrl": "bookImageUrl",
             *           "allLessonIds": [
             *             "allLessonIds",
             *             "allLessonIds"
             *           ],
             *           "course": "basic",
             *           "characterImageUrl": "characterImageUrl",
             *           "id": "id",
             *           "gemLessonIds": [
             *             "gemLessonIds",
             *             "gemLessonIds"
             *           ],
             *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *           "bookLessonIds": [
             *             "bookLessonIds",
             *             "bookLessonIds"
             *           ],
             *           "bookName": "bookName"
             *         },
             *         {
             *           "bookImageUrl": "bookImageUrl",
             *           "allLessonIds": [
             *             "allLessonIds",
             *             "allLessonIds"
             *           ],
             *           "course": "basic",
             *           "characterImageUrl": "characterImageUrl",
             *           "id": "id",
             *           "gemLessonIds": [
             *             "gemLessonIds",
             *             "gemLessonIds"
             *           ],
             *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *           "bookLessonIds": [
             *             "bookLessonIds",
             *             "bookLessonIds"
             *           ],
             *           "bookName": "bookName"
             *         }
             *       ],
             *       "id": "id",
             *       "title": "title"
             *     },
             *     {
             *       "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *       "name": "name",
             *       "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
             *       "circles": [
             *         {
             *           "bookImageUrl": "bookImageUrl",
             *           "allLessonIds": [
             *             "allLessonIds",
             *             "allLessonIds"
             *           ],
             *           "course": "basic",
             *           "characterImageUrl": "characterImageUrl",
             *           "id": "id",
             *           "gemLessonIds": [
             *             "gemLessonIds",
             *             "gemLessonIds"
             *           ],
             *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *           "bookLessonIds": [
             *             "bookLessonIds",
             *             "bookLessonIds"
             *           ],
             *           "bookName": "bookName"
             *         },
             *         {
             *           "bookImageUrl": "bookImageUrl",
             *           "allLessonIds": [
             *             "allLessonIds",
             *             "allLessonIds"
             *           ],
             *           "course": "basic",
             *           "characterImageUrl": "characterImageUrl",
             *           "id": "id",
             *           "gemLessonIds": [
             *             "gemLessonIds",
             *             "gemLessonIds"
             *           ],
             *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *           "bookLessonIds": [
             *             "bookLessonIds",
             *             "bookLessonIds"
             *           ],
             *           "bookName": "bookName"
             *         }
             *       ],
             *       "id": "id",
             *       "title": "title"
             *     }
             *   ],
             *   "name": "name",
             *   "id": "id",
             *   "redirectUrlWhenAllFinished": "redirectUrlWhenAllFinished",
             *   "headerButtonLink": "headerButtonLink"
             * }
             */
            CodeIllusionPackage;
        }
        /**
         *
         * example:
         * {
         *   "isMaintenance": true
         * }
         */
        export interface GetPlayersServerStatus200Response {
            isMaintenance: boolean;
        }
        /**
         *
         * example:
         * {
         *   "login_status": "yes",
         *   "sound_volume": {
         *     "se": 6.027456183070403,
         *     "bgm": 0.8008281904610115,
         *     "hint_talk": 5.962133916683182,
         *     "serif_talk": 1.4658129805029452
         *   },
         *   "sound_config": {
         *     "talk_type": {
         *       "hint_talk": "hint_talk",
         *       "serif_talk": "serif_talk"
         *     },
         *     "min": 5.637376656633329,
         *     "max": 2.3021358869347655
         *   },
         *   "log_level": "development",
         *   "nickname": "nickname",
         *   "my_page_url": "my_page_url",
         *   "return_page": {
         *     "title": "title",
         *     "url": "url"
         *   },
         *   "language": "en",
         *   "player_name": "player_name",
         *   "header_user_icon_name": "header_user_icon_name",
         *   "header_appearance": {
         *     "show_user_icon": true,
         *     "show_menu": true,
         *     "show_login_status": true
         *   },
         *   "custom_items": [
         *     {
         *       "confirm": "confirm",
         *       "new_tab": true,
         *       "style": {
         *         "border": "border",
         *         "padding": "padding",
         *         "borderRadius": "borderRadius"
         *       },
         *       "text": "text",
         *       "url": "url"
         *     },
         *     {
         *       "confirm": "confirm",
         *       "new_tab": true,
         *       "style": {
         *         "border": "border",
         *         "padding": "padding",
         *         "borderRadius": "borderRadius"
         *       },
         *       "text": "text",
         *       "url": "url"
         *     }
         *   ]
         * }
         */
        export interface GetPlayersSetting200Response {
            language: "en" | "ja";
            log_level: "development" | "production";
            header_user_icon_name: string;
            /**
             * example:
             * yes
             */
            login_status: "yes";
            /**
             * URL to which the user is redirected when clicking the user icon in the header; if not specified, nothing happens when the icon is clicked.
             */
            my_page_url?: string;
            /**
             * User name next to the user icon in the header. If not specified, the string "user" is used.
             */
            player_name?: string;
            /**
             * This name is used in serifs of instructors
             */
            nickname?: string;
            header_appearance: /**
             * example:
             * {
             *   "show_user_icon": true,
             *   "show_menu": true,
             *   "show_login_status": true
             * }
             */
            GetPlayersSetting200ResponseHeaderAppearance;
            sound_volume: /**
             * example:
             * {
             *   "se": 6.027456183070403,
             *   "bgm": 0.8008281904610115,
             *   "hint_talk": 5.962133916683182,
             *   "serif_talk": 1.4658129805029452
             * }
             */
            GetPlayersSetting200ResponseSoundVolume;
            sound_config: /**
             * example:
             * {
             *   "talk_type": {
             *     "hint_talk": "hint_talk",
             *     "serif_talk": "serif_talk"
             *   },
             *   "min": 5.637376656633329,
             *   "max": 2.3021358869347655
             * }
             */
            GetPlayersSetting200ResponseSoundConfig;
            return_page: /**
             * example:
             * {
             *   "title": "title",
             *   "url": "url"
             * }
             */
            GetPlayersSetting200ResponseReturnPage;
            custom_items: /**
             * example:
             * {
             *   "confirm": "confirm",
             *   "new_tab": true,
             *   "style": {
             *     "border": "border",
             *     "padding": "padding",
             *     "borderRadius": "borderRadius"
             *   },
             *   "text": "text",
             *   "url": "url"
             * }
             */
            GetPlayersSetting200ResponseCustomItemsInner[];
        }
        /**
         * example:
         * {
         *   "confirm": "confirm",
         *   "new_tab": true,
         *   "style": {
         *     "border": "border",
         *     "padding": "padding",
         *     "borderRadius": "borderRadius"
         *   },
         *   "text": "text",
         *   "url": "url"
         * }
         */
        export interface GetPlayersSetting200ResponseCustomItemsInner {
            url: string;
            text: string;
            style?: /**
             * example:
             * {
             *   "border": "border",
             *   "padding": "padding",
             *   "borderRadius": "borderRadius"
             * }
             */
            GetPlayersSetting200ResponseCustomItemsInnerStyle;
            new_tab: boolean;
            confirm: string;
        }
        /**
         * example:
         * {
         *   "border": "border",
         *   "padding": "padding",
         *   "borderRadius": "borderRadius"
         * }
         */
        export interface GetPlayersSetting200ResponseCustomItemsInnerStyle {
            border: string;
            padding: string;
            borderRadius: string;
        }
        /**
         * example:
         * {
         *   "show_user_icon": true,
         *   "show_menu": true,
         *   "show_login_status": true
         * }
         */
        export interface GetPlayersSetting200ResponseHeaderAppearance {
            show_user_icon?: boolean;
            show_menu?: boolean;
            show_login_status?: boolean;
        }
        /**
         * example:
         * {
         *   "title": "title",
         *   "url": "url"
         * }
         */
        export interface GetPlayersSetting200ResponseReturnPage {
            title: string;
            url: string;
        }
        /**
         * example:
         * {
         *   "talk_type": {
         *     "hint_talk": "hint_talk",
         *     "serif_talk": "serif_talk"
         *   },
         *   "min": 5.637376656633329,
         *   "max": 2.3021358869347655
         * }
         */
        export interface GetPlayersSetting200ResponseSoundConfig {
            min: number;
            max: number;
            talk_type: /**
             * example:
             * {
             *   "hint_talk": "hint_talk",
             *   "serif_talk": "serif_talk"
             * }
             */
            GetPlayersSetting200ResponseSoundConfigTalkType;
        }
        /**
         * example:
         * {
         *   "hint_talk": "hint_talk",
         *   "serif_talk": "serif_talk"
         * }
         */
        export interface GetPlayersSetting200ResponseSoundConfigTalkType {
            serif_talk: string;
            hint_talk: string;
        }
        /**
         * example:
         * {
         *   "se": 6.027456183070403,
         *   "bgm": 0.8008281904610115,
         *   "hint_talk": 5.962133916683182,
         *   "serif_talk": 1.4658129805029452
         * }
         */
        export interface GetPlayersSetting200ResponseSoundVolume {
            bgm: number;
            se: number;
            /**
             * Volume of automatic reading of instructional characters' lines
             */
            serif_talk: number;
            /**
             * Volume of audio played when pressing the play button in the upper right corner of the hint window
             */
            hint_talk: number;
        }
        /**
         *
         */
        export interface GetPlayersSetting401Response {
            login_status: "no";
        }
        /**
         * example:
         * {
         *   "standardMappings": [
         *     {
         *       "gradeBand": [
         *         {
         *           "standardDomain": [
         *             {
         *               "standard": "standard",
         *               "cse": [
         *                 "cse",
         *                 "cse"
         *               ],
         *               "domain": "domain",
         *               "disneyCodeillusionLesson": [
         *                 "disneyCodeillusionLesson",
         *                 "disneyCodeillusionLesson"
         *               ],
         *               "description": "description"
         *             },
         *             {
         *               "standard": "standard",
         *               "cse": [
         *                 "cse",
         *                 "cse"
         *               ],
         *               "domain": "domain",
         *               "disneyCodeillusionLesson": [
         *                 "disneyCodeillusionLesson",
         *                 "disneyCodeillusionLesson"
         *               ],
         *               "description": "description"
         *             }
         *           ],
         *           "band": "band"
         *         },
         *         {
         *           "standardDomain": [
         *             {
         *               "standard": "standard",
         *               "cse": [
         *                 "cse",
         *                 "cse"
         *               ],
         *               "domain": "domain",
         *               "disneyCodeillusionLesson": [
         *                 "disneyCodeillusionLesson",
         *                 "disneyCodeillusionLesson"
         *               ],
         *               "description": "description"
         *             },
         *             {
         *               "standard": "standard",
         *               "cse": [
         *                 "cse",
         *                 "cse"
         *               ],
         *               "domain": "domain",
         *               "disneyCodeillusionLesson": [
         *                 "disneyCodeillusionLesson",
         *                 "disneyCodeillusionLesson"
         *               ],
         *               "description": "description"
         *             }
         *           ],
         *           "band": "band"
         *         }
         *       ],
         *       "stateId": "stateId",
         *       "stateStandardName": "stateStandardName"
         *     },
         *     {
         *       "gradeBand": [
         *         {
         *           "standardDomain": [
         *             {
         *               "standard": "standard",
         *               "cse": [
         *                 "cse",
         *                 "cse"
         *               ],
         *               "domain": "domain",
         *               "disneyCodeillusionLesson": [
         *                 "disneyCodeillusionLesson",
         *                 "disneyCodeillusionLesson"
         *               ],
         *               "description": "description"
         *             },
         *             {
         *               "standard": "standard",
         *               "cse": [
         *                 "cse",
         *                 "cse"
         *               ],
         *               "domain": "domain",
         *               "disneyCodeillusionLesson": [
         *                 "disneyCodeillusionLesson",
         *                 "disneyCodeillusionLesson"
         *               ],
         *               "description": "description"
         *             }
         *           ],
         *           "band": "band"
         *         },
         *         {
         *           "standardDomain": [
         *             {
         *               "standard": "standard",
         *               "cse": [
         *                 "cse",
         *                 "cse"
         *               ],
         *               "domain": "domain",
         *               "disneyCodeillusionLesson": [
         *                 "disneyCodeillusionLesson",
         *                 "disneyCodeillusionLesson"
         *               ],
         *               "description": "description"
         *             },
         *             {
         *               "standard": "standard",
         *               "cse": [
         *                 "cse",
         *                 "cse"
         *               ],
         *               "domain": "domain",
         *               "disneyCodeillusionLesson": [
         *                 "disneyCodeillusionLesson",
         *                 "disneyCodeillusionLesson"
         *               ],
         *               "description": "description"
         *             }
         *           ],
         *           "band": "band"
         *         }
         *       ],
         *       "stateId": "stateId",
         *       "stateStandardName": "stateStandardName"
         *     }
         *   ]
         * }
         */
        export interface GetStandardMapping200Response {
            standardMappings: /**
             * StandardMapping
             * The Definition of Get standard mapping based on organization state.
             * example:
             * {
             *   "gradeBand": [
             *     {
             *       "standardDomain": [
             *         {
             *           "standard": "standard",
             *           "cse": [
             *             "cse",
             *             "cse"
             *           ],
             *           "domain": "domain",
             *           "disneyCodeillusionLesson": [
             *             "disneyCodeillusionLesson",
             *             "disneyCodeillusionLesson"
             *           ],
             *           "description": "description"
             *         },
             *         {
             *           "standard": "standard",
             *           "cse": [
             *             "cse",
             *             "cse"
             *           ],
             *           "domain": "domain",
             *           "disneyCodeillusionLesson": [
             *             "disneyCodeillusionLesson",
             *             "disneyCodeillusionLesson"
             *           ],
             *           "description": "description"
             *         }
             *       ],
             *       "band": "band"
             *     },
             *     {
             *       "standardDomain": [
             *         {
             *           "standard": "standard",
             *           "cse": [
             *             "cse",
             *             "cse"
             *           ],
             *           "domain": "domain",
             *           "disneyCodeillusionLesson": [
             *             "disneyCodeillusionLesson",
             *             "disneyCodeillusionLesson"
             *           ],
             *           "description": "description"
             *         },
             *         {
             *           "standard": "standard",
             *           "cse": [
             *             "cse",
             *             "cse"
             *           ],
             *           "domain": "domain",
             *           "disneyCodeillusionLesson": [
             *             "disneyCodeillusionLesson",
             *             "disneyCodeillusionLesson"
             *           ],
             *           "description": "description"
             *         }
             *       ],
             *       "band": "band"
             *     }
             *   ],
             *   "stateId": "stateId",
             *   "stateStandardName": "stateStandardName"
             * }
             */
            StandardMapping[];
        }
        /**
         * example:
         * {
         *   "studentGroupLessonStatuses": [
         *     {
         *       "correctAnsweredQuizCount": 6.027456183070403,
         *       "usedHintCount": 1.4658129805029452,
         *       "lessonId": "lessonId",
         *       "stepIdskippingDetected": true,
         *       "startedAt": "2000-01-23T04:56:07.000Z",
         *       "achievedStarCount": 0.8008281904610115,
         *       "quizCount": 5.962133916683182,
         *       "userId": "userId",
         *       "status": "not_cleared",
         *       "finishedAt": "2000-01-23T04:56:07.000Z"
         *     },
         *     {
         *       "correctAnsweredQuizCount": 6.027456183070403,
         *       "usedHintCount": 1.4658129805029452,
         *       "lessonId": "lessonId",
         *       "stepIdskippingDetected": true,
         *       "startedAt": "2000-01-23T04:56:07.000Z",
         *       "achievedStarCount": 0.8008281904610115,
         *       "quizCount": 5.962133916683182,
         *       "userId": "userId",
         *       "status": "not_cleared",
         *       "finishedAt": "2000-01-23T04:56:07.000Z"
         *     }
         *   ]
         * }
         */
        export interface GetStudentGroupLessonStatuses200Response {
            studentGroupLessonStatuses?: /**
             * UserLessonStatus
             *
             * example:
             * {
             *   "correctAnsweredQuizCount": 6.027456183070403,
             *   "usedHintCount": 1.4658129805029452,
             *   "lessonId": "lessonId",
             *   "stepIdskippingDetected": true,
             *   "startedAt": "2000-01-23T04:56:07.000Z",
             *   "achievedStarCount": 0.8008281904610115,
             *   "quizCount": 5.962133916683182,
             *   "userId": "userId",
             *   "status": "not_cleared",
             *   "finishedAt": "2000-01-23T04:56:07.000Z"
             * }
             */
            UserLessonStatus[];
        }
        /**
         *
         */
        export interface GetStudentGroupLessonStatuses500Response {
            error: string;
        }
        /**
         * example:
         * {
         *   "studentGroupPackageAssignments": [
         *     {
         *       "packageId": "packageId",
         *       "packageCategoryId": "packageCategoryId",
         *       "studentGroupId": "studentGroupId"
         *     },
         *     {
         *       "packageId": "packageId",
         *       "packageCategoryId": "packageCategoryId",
         *       "studentGroupId": "studentGroupId"
         *     }
         *   ]
         * }
         */
        export interface GetStudentGroupPackageAssignments200Response {
            studentGroupPackageAssignments: /**
             * StudentGroupPackageAssignment
             * The Definition of Get StudentGroupPackageAssignment
             * example:
             * {
             *   "packageId": "packageId",
             *   "packageCategoryId": "packageCategoryId",
             *   "studentGroupId": "studentGroupId"
             * }
             */
            StudentGroupPackageAssignment[];
        }
        /**
         * example:
         * {
         *   "studentgroups": [
         *     {
         *       "organizationId": "organizationId",
         *       "createdUserId": "createdUserId",
         *       "createdDate": "2000-01-23T04:56:07.000Z",
         *       "studentGroupLmsId": "studentGroupLmsId",
         *       "grade": "grade",
         *       "name": "name",
         *       "id": "id",
         *       "updatedDate": "2000-01-23T04:56:07.000Z",
         *       "updatedUserId": "updatedUserId"
         *     },
         *     {
         *       "organizationId": "organizationId",
         *       "createdUserId": "createdUserId",
         *       "createdDate": "2000-01-23T04:56:07.000Z",
         *       "studentGroupLmsId": "studentGroupLmsId",
         *       "grade": "grade",
         *       "name": "name",
         *       "id": "id",
         *       "updatedDate": "2000-01-23T04:56:07.000Z",
         *       "updatedUserId": "updatedUserId"
         *     }
         *   ]
         * }
         */
        export interface GetStudentGroups200Response {
            studentgroups?: /**
             * StudentGroups
             * The Definition of Get Student Groups.
             * example:
             * {
             *   "organizationId": "organizationId",
             *   "createdUserId": "createdUserId",
             *   "createdDate": "2000-01-23T04:56:07.000Z",
             *   "studentGroupLmsId": "studentGroupLmsId",
             *   "grade": "grade",
             *   "name": "name",
             *   "id": "id",
             *   "updatedDate": "2000-01-23T04:56:07.000Z",
             *   "updatedUserId": "updatedUserId"
             * }
             */
            StudentGroups[];
        }
        /**
         * example:
         * {
         *   "unaccessibleLessons": [
         *     "unaccessibleLessons",
         *     "unaccessibleLessons"
         *   ]
         * }
         */
        export interface GetStudentUnaccessibleLessons200Response {
            unaccessibleLessons: string[];
        }
        /**
         * example:
         * {
         *   "students": [
         *     {
         *       "lastLessionName": "lastLessionName",
         *       "loginId": "loginId",
         *       "studentGroupCount": 0.8008281904610115,
         *       "lastLessonStartedAt": "2000-01-23T04:56:07.000Z",
         *       "nickName": "nickName",
         *       "studentGroup": "studentGroup",
         *       "userId": "userId",
         *       "studentLMSId": "studentLMSId",
         *       "password": "password",
         *       "createdDate": "2000-01-23T04:56:07.000Z",
         *       "createdUserName": "createdUserName",
         *       "emailsToNotify": [
         *         "emailsToNotify",
         *         "emailsToNotify"
         *       ],
         *       "id": "id",
         *       "email": "email"
         *     },
         *     {
         *       "lastLessionName": "lastLessionName",
         *       "loginId": "loginId",
         *       "studentGroupCount": 0.8008281904610115,
         *       "lastLessonStartedAt": "2000-01-23T04:56:07.000Z",
         *       "nickName": "nickName",
         *       "studentGroup": "studentGroup",
         *       "userId": "userId",
         *       "studentLMSId": "studentLMSId",
         *       "password": "password",
         *       "createdDate": "2000-01-23T04:56:07.000Z",
         *       "createdUserName": "createdUserName",
         *       "emailsToNotify": [
         *         "emailsToNotify",
         *         "emailsToNotify"
         *       ],
         *       "id": "id",
         *       "email": "email"
         *     }
         *   ]
         * }
         */
        export interface GetStudents200Response {
            students?: /**
             * Student
             * The Definition of Get Students.
             * example:
             * {
             *   "lastLessionName": "lastLessionName",
             *   "loginId": "loginId",
             *   "studentGroupCount": 0.8008281904610115,
             *   "lastLessonStartedAt": "2000-01-23T04:56:07.000Z",
             *   "nickName": "nickName",
             *   "studentGroup": "studentGroup",
             *   "userId": "userId",
             *   "studentLMSId": "studentLMSId",
             *   "password": "password",
             *   "createdDate": "2000-01-23T04:56:07.000Z",
             *   "createdUserName": "createdUserName",
             *   "emailsToNotify": [
             *     "emailsToNotify",
             *     "emailsToNotify"
             *   ],
             *   "id": "id",
             *   "email": "email"
             * }
             */
            Student[];
        }
        /**
         * example:
         * {
         *   "teachers": [
         *     {
         *       "firstName": "firstName",
         *       "lastName": "lastName",
         *       "createdUserId": "createdUserId",
         *       "createdDate": "createdDate",
         *       "teacherLMSId": "teacherLMSId",
         *       "createdUserName": "createdUserName",
         *       "id": "id",
         *       "userId": "userId",
         *       "email": "email"
         *     },
         *     {
         *       "firstName": "firstName",
         *       "lastName": "lastName",
         *       "createdUserId": "createdUserId",
         *       "createdDate": "createdDate",
         *       "teacherLMSId": "teacherLMSId",
         *       "createdUserName": "createdUserName",
         *       "id": "id",
         *       "userId": "userId",
         *       "email": "email"
         *     }
         *   ]
         * }
         */
        export interface GetTeachers200Response {
            teachers?: /**
             * Teacher
             * Teacher
             * example:
             * {
             *   "firstName": "firstName",
             *   "lastName": "lastName",
             *   "createdUserId": "createdUserId",
             *   "createdDate": "createdDate",
             *   "teacherLMSId": "teacherLMSId",
             *   "createdUserName": "createdUserName",
             *   "id": "id",
             *   "userId": "userId",
             *   "email": "email"
             * }
             */
            Teacher[];
        }
        /**
         * example:
         * {
         *   "unaccessibleLessons": [
         *     {
         *       "createdUserId": "createdUserId",
         *       "createdDate": "createdDate",
         *       "packageId": "packageId",
         *       "studentGroupId": "studentGroupId",
         *       "lessonId": "lessonId"
         *     },
         *     {
         *       "createdUserId": "createdUserId",
         *       "createdDate": "createdDate",
         *       "packageId": "packageId",
         *       "studentGroupId": "studentGroupId",
         *       "lessonId": "lessonId"
         *     }
         *   ]
         * }
         */
        export interface GetUnaccessibleLessons200Response {
            unaccessibleLessons: /**
             * UnaccessibleLesson
             * The Definition of Get unaccessible Lesson.
             * example:
             * {
             *   "createdUserId": "createdUserId",
             *   "createdDate": "createdDate",
             *   "packageId": "packageId",
             *   "studentGroupId": "studentGroupId",
             *   "lessonId": "lessonId"
             * }
             */
            UnaccessibleLesson[];
        }
        /**
         * example:
         * {
         *   "userPackageAssignments": [
         *     {
         *       "packageId": "packageId",
         *       "packageCategoryId": "packageCategoryId",
         *       "userId": "userId"
         *     },
         *     {
         *       "packageId": "packageId",
         *       "packageCategoryId": "packageCategoryId",
         *       "userId": "userId"
         *     }
         *   ]
         * }
         */
        export interface GetUserPackageAssignments200Response {
            userPackageAssignments: /**
             * UserPackageAssignment
             *
             * example:
             * {
             *   "packageId": "packageId",
             *   "packageCategoryId": "packageCategoryId",
             *   "userId": "userId"
             * }
             */
            UserPackageAssignment[];
        }
        /**
         * example:
         * {
         *   "settings": {
         *     "sound": {
         *       "seVolume": 0.8008281904610115,
         *       "bgmVolume": 6.027456183070403,
         *       "narrationLanguage": "en",
         *       "serifNarrationVolume": 5.962133916683182,
         *       "hintNarrationVolume": 1.4658129805029452
         *     }
         *   }
         * }
         */
        export interface GetUserSettings200Response {
            settings?: /**
             * UserSettings
             * example:
             * {
             *   "sound": {
             *     "seVolume": 0.8008281904610115,
             *     "bgmVolume": 6.027456183070403,
             *     "narrationLanguage": "en",
             *     "serifNarrationVolume": 5.962133916683182,
             *     "hintNarrationVolume": 1.4658129805029452
             *   }
             * }
             */
            UserSettings;
        }
        /**
         * example:
         * {
         *   "codeIllusionPackage": {
         *     "level": "basic",
         *     "headerButtonText": "headerButtonText",
         *     "chapters": [
         *       {
         *         "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
         *         "name": "name",
         *         "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
         *         "circles": [
         *           {
         *             "bookImageUrl": "bookImageUrl",
         *             "allLessonIds": [
         *               "allLessonIds",
         *               "allLessonIds"
         *             ],
         *             "course": "basic",
         *             "characterImageUrl": "characterImageUrl",
         *             "id": "id",
         *             "gemLessonIds": [
         *               "gemLessonIds",
         *               "gemLessonIds"
         *             ],
         *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *             "bookLessonIds": [
         *               "bookLessonIds",
         *               "bookLessonIds"
         *             ],
         *             "bookName": "bookName"
         *           },
         *           {
         *             "bookImageUrl": "bookImageUrl",
         *             "allLessonIds": [
         *               "allLessonIds",
         *               "allLessonIds"
         *             ],
         *             "course": "basic",
         *             "characterImageUrl": "characterImageUrl",
         *             "id": "id",
         *             "gemLessonIds": [
         *               "gemLessonIds",
         *               "gemLessonIds"
         *             ],
         *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *             "bookLessonIds": [
         *               "bookLessonIds",
         *               "bookLessonIds"
         *             ],
         *             "bookName": "bookName"
         *           }
         *         ],
         *         "id": "id",
         *         "title": "title"
         *       },
         *       {
         *         "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
         *         "name": "name",
         *         "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
         *         "circles": [
         *           {
         *             "bookImageUrl": "bookImageUrl",
         *             "allLessonIds": [
         *               "allLessonIds",
         *               "allLessonIds"
         *             ],
         *             "course": "basic",
         *             "characterImageUrl": "characterImageUrl",
         *             "id": "id",
         *             "gemLessonIds": [
         *               "gemLessonIds",
         *               "gemLessonIds"
         *             ],
         *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *             "bookLessonIds": [
         *               "bookLessonIds",
         *               "bookLessonIds"
         *             ],
         *             "bookName": "bookName"
         *           },
         *           {
         *             "bookImageUrl": "bookImageUrl",
         *             "allLessonIds": [
         *               "allLessonIds",
         *               "allLessonIds"
         *             ],
         *             "course": "basic",
         *             "characterImageUrl": "characterImageUrl",
         *             "id": "id",
         *             "gemLessonIds": [
         *               "gemLessonIds",
         *               "gemLessonIds"
         *             ],
         *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
         *             "bookLessonIds": [
         *               "bookLessonIds",
         *               "bookLessonIds"
         *             ],
         *             "bookName": "bookName"
         *           }
         *         ],
         *         "id": "id",
         *         "title": "title"
         *       }
         *     ],
         *     "name": "name",
         *     "id": "id",
         *     "redirectUrlWhenAllFinished": "redirectUrlWhenAllFinished",
         *     "headerButtonLink": "headerButtonLink"
         *   }
         * }
         */
        export interface GetUsersUserIdCodeIllusionPackages200Response {
            codeIllusionPackage: /**
             * CodeIllusionPackage
             * example:
             * {
             *   "level": "basic",
             *   "headerButtonText": "headerButtonText",
             *   "chapters": [
             *     {
             *       "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *       "name": "name",
             *       "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
             *       "circles": [
             *         {
             *           "bookImageUrl": "bookImageUrl",
             *           "allLessonIds": [
             *             "allLessonIds",
             *             "allLessonIds"
             *           ],
             *           "course": "basic",
             *           "characterImageUrl": "characterImageUrl",
             *           "id": "id",
             *           "gemLessonIds": [
             *             "gemLessonIds",
             *             "gemLessonIds"
             *           ],
             *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *           "bookLessonIds": [
             *             "bookLessonIds",
             *             "bookLessonIds"
             *           ],
             *           "bookName": "bookName"
             *         },
             *         {
             *           "bookImageUrl": "bookImageUrl",
             *           "allLessonIds": [
             *             "allLessonIds",
             *             "allLessonIds"
             *           ],
             *           "course": "basic",
             *           "characterImageUrl": "characterImageUrl",
             *           "id": "id",
             *           "gemLessonIds": [
             *             "gemLessonIds",
             *             "gemLessonIds"
             *           ],
             *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *           "bookLessonIds": [
             *             "bookLessonIds",
             *             "bookLessonIds"
             *           ],
             *           "bookName": "bookName"
             *         }
             *       ],
             *       "id": "id",
             *       "title": "title"
             *     },
             *     {
             *       "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *       "name": "name",
             *       "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
             *       "circles": [
             *         {
             *           "bookImageUrl": "bookImageUrl",
             *           "allLessonIds": [
             *             "allLessonIds",
             *             "allLessonIds"
             *           ],
             *           "course": "basic",
             *           "characterImageUrl": "characterImageUrl",
             *           "id": "id",
             *           "gemLessonIds": [
             *             "gemLessonIds",
             *             "gemLessonIds"
             *           ],
             *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *           "bookLessonIds": [
             *             "bookLessonIds",
             *             "bookLessonIds"
             *           ],
             *           "bookName": "bookName"
             *         },
             *         {
             *           "bookImageUrl": "bookImageUrl",
             *           "allLessonIds": [
             *             "allLessonIds",
             *             "allLessonIds"
             *           ],
             *           "course": "basic",
             *           "characterImageUrl": "characterImageUrl",
             *           "id": "id",
             *           "gemLessonIds": [
             *             "gemLessonIds",
             *             "gemLessonIds"
             *           ],
             *           "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *           "bookLessonIds": [
             *             "bookLessonIds",
             *             "bookLessonIds"
             *           ],
             *           "bookName": "bookName"
             *         }
             *       ],
             *       "id": "id",
             *       "title": "title"
             *     }
             *   ],
             *   "name": "name",
             *   "id": "id",
             *   "redirectUrlWhenAllFinished": "redirectUrlWhenAllFinished",
             *   "headerButtonLink": "headerButtonLink"
             * }
             */
            CodeIllusionPackage;
        }
        /**
         * example:
         * {
         *   "userLessonStatuses": [
         *     {
         *       "correctAnsweredQuizCount": 6.027456183070403,
         *       "usedHintCount": 1.4658129805029452,
         *       "lessonId": "lessonId",
         *       "stepIdskippingDetected": true,
         *       "startedAt": "2000-01-23T04:56:07.000Z",
         *       "achievedStarCount": 0.8008281904610115,
         *       "quizCount": 5.962133916683182,
         *       "userId": "userId",
         *       "status": "not_cleared",
         *       "finishedAt": "2000-01-23T04:56:07.000Z"
         *     },
         *     {
         *       "correctAnsweredQuizCount": 6.027456183070403,
         *       "usedHintCount": 1.4658129805029452,
         *       "lessonId": "lessonId",
         *       "stepIdskippingDetected": true,
         *       "startedAt": "2000-01-23T04:56:07.000Z",
         *       "achievedStarCount": 0.8008281904610115,
         *       "quizCount": 5.962133916683182,
         *       "userId": "userId",
         *       "status": "not_cleared",
         *       "finishedAt": "2000-01-23T04:56:07.000Z"
         *     }
         *   ]
         * }
         */
        export interface GetUsersUserIdLessonStatuses200Response {
            userLessonStatuses?: /**
             * UserLessonStatus
             *
             * example:
             * {
             *   "correctAnsweredQuizCount": 6.027456183070403,
             *   "usedHintCount": 1.4658129805029452,
             *   "lessonId": "lessonId",
             *   "stepIdskippingDetected": true,
             *   "startedAt": "2000-01-23T04:56:07.000Z",
             *   "achievedStarCount": 0.8008281904610115,
             *   "quizCount": 5.962133916683182,
             *   "userId": "userId",
             *   "status": "not_cleared",
             *   "finishedAt": "2000-01-23T04:56:07.000Z"
             * }
             */
            UserLessonStatus[];
        }
        /**
         * Lesson
         * The Definition of Lesson
         * example:
         * {
         *   "maxStarCount": 0.8008281904610115,
         *   "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
         *   "lessonEnvironment": "litLessonPlayer",
         *   "hintCount": 1.4658129805029452,
         *   "level": "basic",
         *   "lessonDuration": "lessonDuration",
         *   "lessonObjectives": "lessonObjectives",
         *   "description": "description",
         *   "url": "url",
         *   "skillsLearnedInThisLesson": "skillsLearnedInThisLesson",
         *   "thumbnailImageUrl": "thumbnailImageUrl",
         *   "name": "name",
         *   "course": "basic",
         *   "theme": "theme",
         *   "quizCount": 6.027456183070403,
         *   "id": "id",
         *   "projectName": "projectName",
         *   "scenarioName": "scenarioName"
         * }
         */
        export interface Lesson {
            id: string;
            url: string;
            name: string;
            /**
             * LessonEnvironment
             * We currently only have "LiT Lesson Player" as an Environment, but we will add external project etc. like "Magic Quest" in the future.
             *
             */
            lessonEnvironment?: "litLessonPlayer";
            /**
             * Course
             */
            course: "basic" | "webDesign" | "mediaArt" | "gameDevelopment" | "";
            theme: string;
            skillsLearnedInThisLesson: string;
            description: string;
            lessonObjectives: string;
            thumbnailImageUrl: string;
            lessonOverViewPdfUrl?: string;
            projectName?: string;
            scenarioName?: string;
            lessonDuration: string;
            maxStarCount: number;
            quizCount?: number;
            hintCount?: number;
            level: "basic" | "advanced" | "heroic" | "adventurous";
        }
        /**
         * LoggedInUser
         * example:
         * {
         *   "administrator": {
         *     "firstName": "firstName",
         *     "lastName": "lastName",
         *     "districtId": "districtId",
         *     "id": "id",
         *     "userId": "userId",
         *     "administratorLMSId": "administratorLMSId"
         *   },
         *   "teacher": {
         *     "firstName": "firstName",
         *     "lastName": "lastName",
         *     "districtId": "districtId",
         *     "teacherLMSId": "teacherLMSId",
         *     "organizationIds": [
         *       "organizationIds",
         *       "organizationIds"
         *     ],
         *     "id": "id",
         *     "userId": "userId"
         *   },
         *   "student": {
         *     "studentLMSId": "studentLMSId",
         *     "districtId": "districtId",
         *     "organizationIds": [
         *       "organizationIds",
         *       "organizationIds"
         *     ],
         *     "nickName": "nickName",
         *     "id": "id",
         *     "userId": "userId",
         *     "studentGroupIds": [
         *       "studentGroupIds",
         *       "studentGroupIds"
         *     ]
         *   },
         *   "user": {
         *     "role": "role",
         *     "loginId": "loginId",
         *     "id": "id",
         *     "email": "email"
         *   }
         * }
         */
        export interface LoggedInUser {
            user?: /**
             * example:
             * {
             *   "role": "role",
             *   "loginId": "loginId",
             *   "id": "id",
             *   "email": "email"
             * }
             */
            LoggedInUserUser;
            administrator?: /**
             * example:
             * {
             *   "firstName": "firstName",
             *   "lastName": "lastName",
             *   "districtId": "districtId",
             *   "id": "id",
             *   "userId": "userId",
             *   "administratorLMSId": "administratorLMSId"
             * }
             */
            LoggedInUserAdministrator;
            teacher?: /**
             * example:
             * {
             *   "firstName": "firstName",
             *   "lastName": "lastName",
             *   "districtId": "districtId",
             *   "teacherLMSId": "teacherLMSId",
             *   "organizationIds": [
             *     "organizationIds",
             *     "organizationIds"
             *   ],
             *   "id": "id",
             *   "userId": "userId"
             * }
             */
            LoggedInUserTeacher;
            student?: /**
             * example:
             * {
             *   "studentLMSId": "studentLMSId",
             *   "districtId": "districtId",
             *   "organizationIds": [
             *     "organizationIds",
             *     "organizationIds"
             *   ],
             *   "nickName": "nickName",
             *   "id": "id",
             *   "userId": "userId",
             *   "studentGroupIds": [
             *     "studentGroupIds",
             *     "studentGroupIds"
             *   ]
             * }
             */
            LoggedInUserStudent;
        }
        /**
         * example:
         * {
         *   "firstName": "firstName",
         *   "lastName": "lastName",
         *   "districtId": "districtId",
         *   "id": "id",
         *   "userId": "userId",
         *   "administratorLMSId": "administratorLMSId"
         * }
         */
        export interface LoggedInUserAdministrator {
            id?: string;
            userId?: string;
            firstName?: string;
            lastName?: string;
            administratorLMSId?: string;
            districtId?: string;
        }
        /**
         * example:
         * {
         *   "studentLMSId": "studentLMSId",
         *   "districtId": "districtId",
         *   "organizationIds": [
         *     "organizationIds",
         *     "organizationIds"
         *   ],
         *   "nickName": "nickName",
         *   "id": "id",
         *   "userId": "userId",
         *   "studentGroupIds": [
         *     "studentGroupIds",
         *     "studentGroupIds"
         *   ]
         * }
         */
        export interface LoggedInUserStudent {
            id?: string;
            userId?: string;
            nickName?: string;
            studentLMSId?: string;
            districtId?: string;
            organizationIds?: string[];
            studentGroupIds?: string[];
        }
        /**
         * example:
         * {
         *   "firstName": "firstName",
         *   "lastName": "lastName",
         *   "districtId": "districtId",
         *   "teacherLMSId": "teacherLMSId",
         *   "organizationIds": [
         *     "organizationIds",
         *     "organizationIds"
         *   ],
         *   "id": "id",
         *   "userId": "userId"
         * }
         */
        export interface LoggedInUserTeacher {
            id?: string;
            userId?: string;
            firstName?: string;
            lastName?: string;
            teacherLMSId?: string;
            districtId?: string;
            organizationIds?: string[];
        }
        /**
         * example:
         * {
         *   "role": "role",
         *   "loginId": "loginId",
         *   "id": "id",
         *   "email": "email"
         * }
         */
        export interface LoggedInUserUser {
            id?: string;
            email?: string | null;
            role?: string;
            loginId?: string | null;
        }
        /**
         * MaintenanceAdministratorDistrict
         * The Definition of Get Districts.
         * example:
         * {
         *   "districtId": "districtId",
         *   "userId": "userId"
         * }
         */
        export interface MaintenanceAdministratorDistrict {
            districtId: string;
            userId: string;
        }
        /**
         * MaintenanceAuthenticationInfo
         */
        export interface MaintenanceAuthenticationInfo {
            loginId: string;
            email: string;
            password: string;
        }
        /**
         * MaintenanceDistrict
         * The Definition of Get Districts.
         */
        export interface MaintenanceDistrict {
            name: string;
            stateId: string;
            lmsId?: string;
            enableRosterSync?: boolean;
            districtLmsId?: string;
        }
        /**
         *
         * example:
         * {
         *   "administratorDistricts": [
         *     {
         *       "districtId": "districtId",
         *       "userId": "userId"
         *     },
         *     {
         *       "districtId": "districtId",
         *       "userId": "userId"
         *     }
         *   ]
         * }
         */
        export interface MaintenanceGetAdministratorDistricts200Response {
            administratorDistricts: /**
             * MaintenanceAdministratorDistrict
             * The Definition of Get Districts.
             * example:
             * {
             *   "districtId": "districtId",
             *   "userId": "userId"
             * }
             */
            MaintenanceAdministratorDistrict[];
        }
        /**
         *
         * example:
         * {
         *   "message": "message"
         * }
         */
        export interface MaintenanceGetConstructFreeTrialAccountsForSales200Response {
            message: string;
        }
        /**
         *
         * example:
         * {
         *   "districts": [
         *     null,
         *     null
         *   ]
         * }
         */
        export interface MaintenanceGetDistricts200Response {
            districts: /**
             * DistrictWithId
             * The Definition of Get Districts.
             */
            DistrictWithId[];
        }
        /**
         *
         * example:
         * {
         *   "organizations": [
         *     null,
         *     null
         *   ]
         * }
         */
        export interface MaintenanceGetOrganizations200Response {
            organizations: /**
             * OrganizationWithId
             * The Definition of Get Organizations.
             */
            OrganizationWithId[];
        }
        /**
         *
         * example:
         * {
         *   "studentGroupStudents": [
         *     {
         *       "studentGroupId": "studentGroupId",
         *       "userId": "userId"
         *     },
         *     {
         *       "studentGroupId": "studentGroupId",
         *       "userId": "userId"
         *     }
         *   ]
         * }
         */
        export interface MaintenanceGetStudentGroupStudents200Response {
            studentGroupStudents: /**
             * MaintenanceStudentGroupStudent
             * The Definition of Get Student Groups.
             * example:
             * {
             *   "studentGroupId": "studentGroupId",
             *   "userId": "userId"
             * }
             */
            MaintenanceStudentGroupStudent[];
        }
        /**
         *
         * example:
         * {
         *   "studentGroups": [
         *     null,
         *     null
         *   ]
         * }
         */
        export interface MaintenanceGetStudentGroups200Response {
            studentGroups: /**
             * StudentGroupWithId
             * The Definition of Get Student Groups.
             */
            StudentGroupWithId[];
        }
        /**
         *
         * example:
         * {
         *   "teacherOrganizations": [
         *     {
         *       "organizationId": "organizationId",
         *       "userId": "userId"
         *     },
         *     {
         *       "organizationId": "organizationId",
         *       "userId": "userId"
         *     }
         *   ]
         * }
         */
        export interface MaintenanceGetTeacherOrganizations200Response {
            teacherOrganizations: /**
             * MaintenanceTeacherOrganization
             * The Definition of Get Organizations.
             * example:
             * {
             *   "organizationId": "organizationId",
             *   "userId": "userId"
             * }
             */
            MaintenanceTeacherOrganization[];
        }
        /**
         *
         * example:
         * {
         *   "users": [
         *     null,
         *     null
         *   ]
         * }
         */
        export interface MaintenanceGetUsers200Response {
            users: /* MaintenanceUserPerRoleWithIdAndAuthenticationInfo */ MaintenanceUserPerRoleWithIdAndAuthenticationInfo[];
        }
        /**
         * MaintenanceOrganization
         * The Definition of Get Organizations.
         */
        export interface MaintenanceOrganization {
            name: string;
            districtId: string;
            stateId: string;
            organizationLmsId?: string;
        }
        /**
         *
         * example:
         * {
         *   "message": "ok"
         * }
         */
        export interface MaintenancePostAccountNotification200Response {
            message: "ok";
        }
        /**
         *
         */
        export interface MaintenancePostAccountNotificationRequest {
            title: string;
            accounts: MaintenancePostAccountNotificationRequestAccountsInner[];
            toType: "email" | "adminId" | "teacherId";
            toEmails?: string[];
            toAdminIds?: string[];
            toTeacherIds?: string[];
        }
        export interface MaintenancePostAccountNotificationRequestAccountsInner {
            email: string;
            password: string;
        }
        /**
         *
         * example:
         * {
         *   "users": [
         *     null,
         *     null
         *   ]
         * }
         */
        export interface MaintenancePostUsers200Response {
            users: /* MaintenanceUserPerRoleWithId */ MaintenanceUserPerRoleWithId[];
        }
        /**
         *
         */
        export interface MaintenancePostUsersRequest {
            users: /* MaintenanceUserPerRoleWithAuthenticationInfo */ MaintenanceUserPerRoleWithAuthenticationInfo[];
        }
        /**
         *
         * example:
         * {
         *   "ok": "ok"
         * }
         */
        export interface MaintenancePutDistricts200Response {
            ok: string;
        }
        /**
         *
         */
        export interface MaintenancePutDistrictsRequest {
            districts: /**
             * MaintenanceDistrict
             * The Definition of Get Districts.
             */
            MaintenancePutDistrictsRequestDistrictsInner[];
        }
        /**
         * MaintenanceDistrict
         * The Definition of Get Districts.
         */
        export interface MaintenancePutDistrictsRequestDistrictsInner {
            id?: string;
            name: string;
            stateId: string;
            lmsId?: string;
            enableRosterSync?: boolean;
            districtLmsId?: string;
        }
        export interface MaintenancePutDistrictsRequestDistrictsInnerAllOf {
            id?: string;
        }
        /**
         *
         */
        export interface MaintenancePutOrganizationsRequest {
            organizations: /**
             * MaintenanceOrganization
             * The Definition of Get Organizations.
             */
            MaintenancePutOrganizationsRequestOrganizationsInner[];
        }
        /**
         * MaintenanceOrganization
         * The Definition of Get Organizations.
         */
        export interface MaintenancePutOrganizationsRequestOrganizationsInner {
            id?: string;
            name: string;
            districtId: string;
            stateId: string;
            organizationLmsId?: string;
        }
        /**
         *
         */
        export interface MaintenancePutStudentGroupsRequest {
            studentGroups: /**
             * MaintenanceStudentGroup
             * The Definition of Get Student Groups.
             */
            MaintenancePutStudentGroupsRequestStudentGroupsInner[];
        }
        /**
         * MaintenanceStudentGroup
         * The Definition of Get Student Groups.
         */
        export interface MaintenancePutStudentGroupsRequestStudentGroupsInner {
            id?: string;
            organizationId: string;
            name: string;
            codeillusionPackageId: string;
            csePackageId?: string;
            grade: string;
            studentGroupLmsId?: string;
        }
        /**
         *
         */
        export interface MaintenancePutUsersRequest {
            users: /* MaintenanceUserPerRoleWithIdAndAuthenticationInfo */ MaintenancePutUsersRequestUsersInner[];
        }
        /**
         * MaintenanceUserPerRoleWithIdAndAuthenticationInfo
         */
        export type MaintenancePutUsersRequestUsersInner = /* MaintenanceUserPerRoleWithIdAndAuthenticationInfo */ /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf | /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf1 | /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf2 | /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf3;
        /**
         * MaintenanceStudentGroup
         * The Definition of Get Student Groups.
         */
        export interface MaintenanceStudentGroup {
            organizationId: string;
            name: string;
            codeillusionPackageId: string;
            csePackageId?: string;
            grade: string;
            studentGroupLmsId?: string;
        }
        /**
         * MaintenanceStudentGroupStudent
         * The Definition of Get Student Groups.
         * example:
         * {
         *   "studentGroupId": "studentGroupId",
         *   "userId": "userId"
         * }
         */
        export interface MaintenanceStudentGroupStudent {
            studentGroupId: string;
            userId: string;
        }
        /**
         * MaintenanceTeacherOrganization
         * The Definition of Get Organizations.
         * example:
         * {
         *   "organizationId": "organizationId",
         *   "userId": "userId"
         * }
         */
        export interface MaintenanceTeacherOrganization {
            organizationId: string;
            userId: string;
        }
        /**
         * MaintenanceUserAdministratorRole
         */
        export interface MaintenanceUserAdministratorRole {
            role: "administrator";
            firstName: string;
            lastName: string;
            lmsId?: string;
        }
        /**
         * MaintenanceUserInternalOperatorRole
         */
        export interface MaintenanceUserInternalOperatorRole {
            role: "internalOperator";
        }
        /**
         * MaintenanceUserPerRoleWithAuthenticationInfo
         */
        export type MaintenanceUserPerRoleWithAuthenticationInfo = /* MaintenanceUserPerRoleWithAuthenticationInfo */ /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithAuthenticationInfoOneOf | /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithAuthenticationInfoOneOf1 | /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithAuthenticationInfoOneOf2 | /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithAuthenticationInfoOneOf3;
        /**
         * MaintenanceAuthenticationInfo
         */
        export interface MaintenanceUserPerRoleWithAuthenticationInfoOneOf {
            role: "student";
            nickname: string;
            lmsId?: string;
            loginId: string;
            email: string;
            password: string;
        }
        /**
         * MaintenanceAuthenticationInfo
         */
        export interface MaintenanceUserPerRoleWithAuthenticationInfoOneOf1 {
            role: "teacher";
            firstName: string;
            lastName: string;
            lmsId?: string;
            loginId: string;
            email: string;
            password: string;
        }
        /**
         * MaintenanceAuthenticationInfo
         */
        export interface MaintenanceUserPerRoleWithAuthenticationInfoOneOf2 {
            role: "administrator";
            firstName: string;
            lastName: string;
            lmsId?: string;
            loginId: string;
            email: string;
            password: string;
        }
        /**
         * MaintenanceAuthenticationInfo
         */
        export interface MaintenanceUserPerRoleWithAuthenticationInfoOneOf3 {
            role: "internalOperator";
            loginId: string;
            email: string;
            password: string;
        }
        /**
         * MaintenanceUserPerRoleWithId
         */
        export type MaintenanceUserPerRoleWithId = /* MaintenanceUserPerRoleWithId */ /* MaintenanceUserStudentRole */ MaintenanceUserPerRoleWithIdOneOf | /* MaintenanceUserTeacherRole */ MaintenanceUserPerRoleWithIdOneOf1 | /* MaintenanceUserAdministratorRole */ MaintenanceUserPerRoleWithIdOneOf2 | /* MaintenanceUserInternalOperatorRole */ MaintenanceUserPerRoleWithIdOneOf3;
        /**
         * MaintenanceUserPerRoleWithIdAndAuthenticationInfo
         */
        export type MaintenanceUserPerRoleWithIdAndAuthenticationInfo = /* MaintenanceUserPerRoleWithIdAndAuthenticationInfo */ /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf | /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf1 | /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf2 | /* MaintenanceAuthenticationInfo */ MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf3;
        /**
         * MaintenanceAuthenticationInfo
         */
        export interface MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf {
            role: "student";
            nickname: string;
            lmsId?: string;
            loginId: string;
            email: string;
            password: string;
            id: string;
        }
        /**
         * MaintenanceAuthenticationInfo
         */
        export interface MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf1 {
            role: "teacher";
            firstName: string;
            lastName: string;
            lmsId?: string;
            loginId: string;
            email: string;
            password: string;
            id: string;
        }
        /**
         * MaintenanceAuthenticationInfo
         */
        export interface MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf2 {
            role: "administrator";
            firstName: string;
            lastName: string;
            lmsId?: string;
            loginId: string;
            email: string;
            password: string;
            id: string;
        }
        /**
         * MaintenanceAuthenticationInfo
         */
        export interface MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOf3 {
            role: "internalOperator";
            loginId: string;
            email: string;
            password: string;
            id: string;
        }
        export interface MaintenanceUserPerRoleWithIdAndAuthenticationInfoOneOfAllOf {
            id: string;
        }
        /**
         * MaintenanceUserStudentRole
         */
        export interface MaintenanceUserPerRoleWithIdOneOf {
            role: "student";
            nickname: string;
            lmsId?: string;
            id: string;
        }
        /**
         * MaintenanceUserTeacherRole
         */
        export interface MaintenanceUserPerRoleWithIdOneOf1 {
            role: "teacher";
            firstName: string;
            lastName: string;
            lmsId?: string;
            id: string;
        }
        /**
         * MaintenanceUserAdministratorRole
         */
        export interface MaintenanceUserPerRoleWithIdOneOf2 {
            role: "administrator";
            firstName: string;
            lastName: string;
            lmsId?: string;
            id: string;
        }
        /**
         * MaintenanceUserInternalOperatorRole
         */
        export interface MaintenanceUserPerRoleWithIdOneOf3 {
            role: "internalOperator";
            id: string;
        }
        /**
         * MaintenanceUserStudentRole
         */
        export interface MaintenanceUserStudentRole {
            role: "student";
            nickname: string;
            lmsId?: string;
        }
        /**
         * MaintenanceUserTeacherRole
         */
        export interface MaintenanceUserTeacherRole {
            role: "teacher";
            firstName: string;
            lastName: string;
            lmsId?: string;
        }
        /**
         * Organization
         * The Definition of Get Organizations.
         * example:
         * {
         *   "districtId": "districtId",
         *   "createdUserId": "createdUserId",
         *   "createdDate": "2000-01-23T04:56:07.000Z",
         *   "stateId": "stateId",
         *   "name": "name",
         *   "id": "id",
         *   "organizationLMSId": "organizationLMSId",
         *   "updatedDate": "2000-01-23T04:56:07.000Z"
         * }
         */
        export interface Organization {
            id: string;
            name: string;
            districtId: string;
            stateId: string;
            organizationLMSId: string;
            createdUserId: string;
            createdDate: string; // date-time
            updatedDate: string; // date-time
        }
        /**
         * OrganizationWithId
         * The Definition of Get Organizations.
         */
        export interface OrganizationWithId {
            id: string;
            name: string;
            districtId: string;
            stateId: string;
            organizationLmsId?: string;
        }
        /**
         *
         */
        export interface PostActionLogRequest {
            log: {
                [key: string]: any;
            };
        }
        export interface PostAdministrators400Response {
            error: PostAdministrators400ResponseError;
        }
        export type PostAdministrators400ResponseError = string | PostAdministrators400ResponseErrorOneOfInner[];
        export interface PostAdministrators400ResponseErrorOneOfInner {
            index?: number;
            message?: ("duplicateRecordsWithSameEmail" | "userAlreadyExistWithEmail" | "emailInvalid" | "emailNotProvided")[];
        }
        /**
         *
         */
        export interface PostAdministratorsRequest {
            administrators: /* administrator */ Administrator[];
        }
        /**
         *
         */
        export interface PostClassLinkAuthenticateRequest {
            code: string;
            studentGroupId: string;
            organizationId: string;
            role: string;
        }
        /**
         * example:
         * {
         *   "user": {
         *     "role": "role",
         *     "id": "id",
         *     "accessToken": "accessToken"
         *   }
         * }
         */
        export interface PostCleverAuthenticate200Response {
            user?: /**
             * example:
             * {
             *   "role": "role",
             *   "id": "id",
             *   "accessToken": "accessToken"
             * }
             */
            PostCleverAuthenticate200ResponseUser;
        }
        /**
         * example:
         * {
         *   "role": "role",
         *   "id": "id",
         *   "accessToken": "accessToken"
         * }
         */
        export interface PostCleverAuthenticate200ResponseUser {
            id: string;
            accessToken: string;
            role: string;
        }
        /**
         *
         */
        export interface PostCleverAuthenticateRequest {
            code: string;
            grantType: string;
            redirectUri: string;
            studentGroupId: string;
            organizationId: string;
        }
        /**
         *
         */
        export interface PostDistrictRequest {
            /**
             * This is a district name.
             */
            name: string;
            stateId?: string;
            /**
             * This is a lmsId like(None, Clever, Claslink, Google classroom).
             */
            lmsId: string;
            /**
             * This is a districtLmsId.
             */
            districtLmsId?: string;
            /**
             * This is a enableRosterSync.
             */
            enableRosterSync?: boolean;
            /**
             * This is apiToken.
             */
            apiToken?: string;
        }
        /**
         *
         */
        export interface PostGoogleAuthenticateRequest {
            token: string;
            studentGroupId: string;
            organizationId: string;
            role: string;
        }
        /**
         *
         * example:
         * {
         *   "stars": {
         *     "from": {
         *       "quizAllAnswered": true,
         *       "noHintCleared": true,
         *       "cleared": true
         *     },
         *     "to": {
         *       "quizAllAnswered": true,
         *       "noHintCleared": true,
         *       "cleared": true
         *     }
         *   },
         *   "status": {
         *     "from": {
         *       "currentChapterName": "currentChapterName",
         *       "courseLevel": [
         *         {
         *           "level": 9.301444243932576,
         *           "name": "name",
         *           "requiredExp": 7.061401241503109,
         *           "label": "label",
         *           "exp": 2.3021358869347655
         *         },
         *         {
         *           "level": 9.301444243932576,
         *           "name": "name",
         *           "requiredExp": 7.061401241503109,
         *           "label": "label",
         *           "exp": 2.3021358869347655
         *         }
         *       ],
         *       "coins": 1.4658129805029452,
         *       "nickname": "nickname",
         *       "designation": {
         *         "name": "name",
         *         "rank": 5.962133916683182,
         *         "label": "label",
         *         "requiredTp": 5.637376656633329
         *       },
         *       "tp": 6.027456183070403,
         *       "totalStarNum": 0.8008281904610115
         *     },
         *     "to": {
         *       "currentChapterName": "currentChapterName",
         *       "courseLevel": [
         *         {
         *           "level": 9.301444243932576,
         *           "name": "name",
         *           "requiredExp": 7.061401241503109,
         *           "label": "label",
         *           "exp": 2.3021358869347655
         *         },
         *         {
         *           "level": 9.301444243932576,
         *           "name": "name",
         *           "requiredExp": 7.061401241503109,
         *           "label": "label",
         *           "exp": 2.3021358869347655
         *         }
         *       ],
         *       "coins": 1.4658129805029452,
         *       "nickname": "nickname",
         *       "designation": {
         *         "name": "name",
         *         "rank": 5.962133916683182,
         *         "label": "label",
         *         "requiredTp": 5.637376656633329
         *       },
         *       "tp": 6.027456183070403,
         *       "totalStarNum": 0.8008281904610115
         *     },
         *     "levelTable": {
         *       "mediaArt": {
         *         "0": 3.616076749251911
         *       },
         *       "game": {
         *         "0": 3.616076749251911
         *       },
         *       "webDesign": {
         *         "0": 3.616076749251911
         *       },
         *       "basic": {
         *         "0": 3.616076749251911
         *       }
         *     },
         *     "rankTable": {
         *       "label": {
         *         "0": "0"
         *       },
         *       "tp": {
         *         "0": 3.616076749251911
         *       }
         *     }
         *   }
         * }
         */
        export interface PostLessonCleared200Response {
            stars: /**
             * example:
             * {
             *   "from": {
             *     "quizAllAnswered": true,
             *     "noHintCleared": true,
             *     "cleared": true
             *   },
             *   "to": {
             *     "quizAllAnswered": true,
             *     "noHintCleared": true,
             *     "cleared": true
             *   }
             * }
             */
            PostLessonCleared200ResponseStars;
            status: /**
             * example:
             * {
             *   "from": {
             *     "currentChapterName": "currentChapterName",
             *     "courseLevel": [
             *       {
             *         "level": 9.301444243932576,
             *         "name": "name",
             *         "requiredExp": 7.061401241503109,
             *         "label": "label",
             *         "exp": 2.3021358869347655
             *       },
             *       {
             *         "level": 9.301444243932576,
             *         "name": "name",
             *         "requiredExp": 7.061401241503109,
             *         "label": "label",
             *         "exp": 2.3021358869347655
             *       }
             *     ],
             *     "coins": 1.4658129805029452,
             *     "nickname": "nickname",
             *     "designation": {
             *       "name": "name",
             *       "rank": 5.962133916683182,
             *       "label": "label",
             *       "requiredTp": 5.637376656633329
             *     },
             *     "tp": 6.027456183070403,
             *     "totalStarNum": 0.8008281904610115
             *   },
             *   "to": {
             *     "currentChapterName": "currentChapterName",
             *     "courseLevel": [
             *       {
             *         "level": 9.301444243932576,
             *         "name": "name",
             *         "requiredExp": 7.061401241503109,
             *         "label": "label",
             *         "exp": 2.3021358869347655
             *       },
             *       {
             *         "level": 9.301444243932576,
             *         "name": "name",
             *         "requiredExp": 7.061401241503109,
             *         "label": "label",
             *         "exp": 2.3021358869347655
             *       }
             *     ],
             *     "coins": 1.4658129805029452,
             *     "nickname": "nickname",
             *     "designation": {
             *       "name": "name",
             *       "rank": 5.962133916683182,
             *       "label": "label",
             *       "requiredTp": 5.637376656633329
             *     },
             *     "tp": 6.027456183070403,
             *     "totalStarNum": 0.8008281904610115
             *   },
             *   "levelTable": {
             *     "mediaArt": {
             *       "0": 3.616076749251911
             *     },
             *     "game": {
             *       "0": 3.616076749251911
             *     },
             *     "webDesign": {
             *       "0": 3.616076749251911
             *     },
             *     "basic": {
             *       "0": 3.616076749251911
             *     }
             *   },
             *   "rankTable": {
             *     "label": {
             *       "0": "0"
             *     },
             *     "tp": {
             *       "0": 3.616076749251911
             *     }
             *   }
             * }
             */
            PostLessonCleared200ResponseStatus;
        }
        /**
         * example:
         * {
         *   "from": {
         *     "quizAllAnswered": true,
         *     "noHintCleared": true,
         *     "cleared": true
         *   },
         *   "to": {
         *     "quizAllAnswered": true,
         *     "noHintCleared": true,
         *     "cleared": true
         *   }
         * }
         */
        export interface PostLessonCleared200ResponseStars {
            to: /**
             * example:
             * {
             *   "quizAllAnswered": true,
             *   "noHintCleared": true,
             *   "cleared": true
             * }
             */
            PostLessonCleared200ResponseStarsTo;
            from: /**
             * example:
             * {
             *   "quizAllAnswered": true,
             *   "noHintCleared": true,
             *   "cleared": true
             * }
             */
            PostLessonCleared200ResponseStarsTo;
        }
        /**
         * example:
         * {
         *   "quizAllAnswered": true,
         *   "noHintCleared": true,
         *   "cleared": true
         * }
         */
        export interface PostLessonCleared200ResponseStarsTo {
            cleared: boolean;
            noHintCleared: boolean;
            quizAllAnswered: boolean;
        }
        /**
         * example:
         * {
         *   "from": {
         *     "currentChapterName": "currentChapterName",
         *     "courseLevel": [
         *       {
         *         "level": 9.301444243932576,
         *         "name": "name",
         *         "requiredExp": 7.061401241503109,
         *         "label": "label",
         *         "exp": 2.3021358869347655
         *       },
         *       {
         *         "level": 9.301444243932576,
         *         "name": "name",
         *         "requiredExp": 7.061401241503109,
         *         "label": "label",
         *         "exp": 2.3021358869347655
         *       }
         *     ],
         *     "coins": 1.4658129805029452,
         *     "nickname": "nickname",
         *     "designation": {
         *       "name": "name",
         *       "rank": 5.962133916683182,
         *       "label": "label",
         *       "requiredTp": 5.637376656633329
         *     },
         *     "tp": 6.027456183070403,
         *     "totalStarNum": 0.8008281904610115
         *   },
         *   "to": {
         *     "currentChapterName": "currentChapterName",
         *     "courseLevel": [
         *       {
         *         "level": 9.301444243932576,
         *         "name": "name",
         *         "requiredExp": 7.061401241503109,
         *         "label": "label",
         *         "exp": 2.3021358869347655
         *       },
         *       {
         *         "level": 9.301444243932576,
         *         "name": "name",
         *         "requiredExp": 7.061401241503109,
         *         "label": "label",
         *         "exp": 2.3021358869347655
         *       }
         *     ],
         *     "coins": 1.4658129805029452,
         *     "nickname": "nickname",
         *     "designation": {
         *       "name": "name",
         *       "rank": 5.962133916683182,
         *       "label": "label",
         *       "requiredTp": 5.637376656633329
         *     },
         *     "tp": 6.027456183070403,
         *     "totalStarNum": 0.8008281904610115
         *   },
         *   "levelTable": {
         *     "mediaArt": {
         *       "0": 3.616076749251911
         *     },
         *     "game": {
         *       "0": 3.616076749251911
         *     },
         *     "webDesign": {
         *       "0": 3.616076749251911
         *     },
         *     "basic": {
         *       "0": 3.616076749251911
         *     }
         *   },
         *   "rankTable": {
         *     "label": {
         *       "0": "0"
         *     },
         *     "tp": {
         *       "0": 3.616076749251911
         *     }
         *   }
         * }
         */
        export interface PostLessonCleared200ResponseStatus {
            to: /**
             * example:
             * {
             *   "currentChapterName": "currentChapterName",
             *   "courseLevel": [
             *     {
             *       "level": 9.301444243932576,
             *       "name": "name",
             *       "requiredExp": 7.061401241503109,
             *       "label": "label",
             *       "exp": 2.3021358869347655
             *     },
             *     {
             *       "level": 9.301444243932576,
             *       "name": "name",
             *       "requiredExp": 7.061401241503109,
             *       "label": "label",
             *       "exp": 2.3021358869347655
             *     }
             *   ],
             *   "coins": 1.4658129805029452,
             *   "nickname": "nickname",
             *   "designation": {
             *     "name": "name",
             *     "rank": 5.962133916683182,
             *     "label": "label",
             *     "requiredTp": 5.637376656633329
             *   },
             *   "tp": 6.027456183070403,
             *   "totalStarNum": 0.8008281904610115
             * }
             */
            PostLessonCleared200ResponseStatusTo;
            from: /**
             * example:
             * {
             *   "currentChapterName": "currentChapterName",
             *   "courseLevel": [
             *     {
             *       "level": 9.301444243932576,
             *       "name": "name",
             *       "requiredExp": 7.061401241503109,
             *       "label": "label",
             *       "exp": 2.3021358869347655
             *     },
             *     {
             *       "level": 9.301444243932576,
             *       "name": "name",
             *       "requiredExp": 7.061401241503109,
             *       "label": "label",
             *       "exp": 2.3021358869347655
             *     }
             *   ],
             *   "coins": 1.4658129805029452,
             *   "nickname": "nickname",
             *   "designation": {
             *     "name": "name",
             *     "rank": 5.962133916683182,
             *     "label": "label",
             *     "requiredTp": 5.637376656633329
             *   },
             *   "tp": 6.027456183070403,
             *   "totalStarNum": 0.8008281904610115
             * }
             */
            PostLessonCleared200ResponseStatusTo;
            levelTable: /**
             * example:
             * {
             *   "mediaArt": {
             *     "0": 3.616076749251911
             *   },
             *   "game": {
             *     "0": 3.616076749251911
             *   },
             *   "webDesign": {
             *     "0": 3.616076749251911
             *   },
             *   "basic": {
             *     "0": 3.616076749251911
             *   }
             * }
             */
            PostLessonCleared200ResponseStatusLevelTable;
            rankTable: /**
             * example:
             * {
             *   "label": {
             *     "0": "0"
             *   },
             *   "tp": {
             *     "0": 3.616076749251911
             *   }
             * }
             */
            PostLessonCleared200ResponseStatusRankTable;
        }
        /**
         * example:
         * {
         *   "mediaArt": {
         *     "0": 3.616076749251911
         *   },
         *   "game": {
         *     "0": 3.616076749251911
         *   },
         *   "webDesign": {
         *     "0": 3.616076749251911
         *   },
         *   "basic": {
         *     "0": 3.616076749251911
         *   }
         * }
         */
        export interface PostLessonCleared200ResponseStatusLevelTable {
            mediaArt: /**
             * example:
             * {
             *   "0": 3.616076749251911
             * }
             */
            PostLessonCleared200ResponseStatusLevelTableMediaArt;
            basic: /**
             * example:
             * {
             *   "0": 3.616076749251911
             * }
             */
            PostLessonCleared200ResponseStatusLevelTableMediaArt;
            webDesign: /**
             * example:
             * {
             *   "0": 3.616076749251911
             * }
             */
            PostLessonCleared200ResponseStatusLevelTableMediaArt;
            game: /**
             * example:
             * {
             *   "0": 3.616076749251911
             * }
             */
            PostLessonCleared200ResponseStatusLevelTableMediaArt;
        }
        /**
         * example:
         * {
         *   "0": 3.616076749251911
         * }
         */
        export interface PostLessonCleared200ResponseStatusLevelTableMediaArt {
            "0": number;
        }
        /**
         * example:
         * {
         *   "label": {
         *     "0": "0"
         *   },
         *   "tp": {
         *     "0": 3.616076749251911
         *   }
         * }
         */
        export interface PostLessonCleared200ResponseStatusRankTable {
            label: /**
             * example:
             * {
             *   "0": "0"
             * }
             */
            PostLessonCleared200ResponseStatusRankTableLabel;
            tp: /**
             * example:
             * {
             *   "0": 3.616076749251911
             * }
             */
            PostLessonCleared200ResponseStatusLevelTableMediaArt;
        }
        /**
         * example:
         * {
         *   "0": "0"
         * }
         */
        export interface PostLessonCleared200ResponseStatusRankTableLabel {
            "0": string;
        }
        /**
         * example:
         * {
         *   "currentChapterName": "currentChapterName",
         *   "courseLevel": [
         *     {
         *       "level": 9.301444243932576,
         *       "name": "name",
         *       "requiredExp": 7.061401241503109,
         *       "label": "label",
         *       "exp": 2.3021358869347655
         *     },
         *     {
         *       "level": 9.301444243932576,
         *       "name": "name",
         *       "requiredExp": 7.061401241503109,
         *       "label": "label",
         *       "exp": 2.3021358869347655
         *     }
         *   ],
         *   "coins": 1.4658129805029452,
         *   "nickname": "nickname",
         *   "designation": {
         *     "name": "name",
         *     "rank": 5.962133916683182,
         *     "label": "label",
         *     "requiredTp": 5.637376656633329
         *   },
         *   "tp": 6.027456183070403,
         *   "totalStarNum": 0.8008281904610115
         * }
         */
        export interface PostLessonCleared200ResponseStatusTo {
            totalStarNum: number;
            tp: number;
            nickname: string;
            coins: number;
            designation: /**
             * example:
             * {
             *   "name": "name",
             *   "rank": 5.962133916683182,
             *   "label": "label",
             *   "requiredTp": 5.637376656633329
             * }
             */
            PostLessonCleared200ResponseStatusToDesignation;
            courseLevel: /**
             * example:
             * {
             *   "level": 9.301444243932576,
             *   "name": "name",
             *   "requiredExp": 7.061401241503109,
             *   "label": "label",
             *   "exp": 2.3021358869347655
             * }
             */
            PostLessonCleared200ResponseStatusToCourseLevelInner[];
            currentChapterName: string;
        }
        /**
         * example:
         * {
         *   "level": 9.301444243932576,
         *   "name": "name",
         *   "requiredExp": 7.061401241503109,
         *   "label": "label",
         *   "exp": 2.3021358869347655
         * }
         */
        export interface PostLessonCleared200ResponseStatusToCourseLevelInner {
            exp: number;
            label: string;
            requiredExp: number;
            level: number;
            name: string;
        }
        /**
         * example:
         * {
         *   "name": "name",
         *   "rank": 5.962133916683182,
         *   "label": "label",
         *   "requiredTp": 5.637376656633329
         * }
         */
        export interface PostLessonCleared200ResponseStatusToDesignation {
            label: string;
            rank: number;
            name: string;
            requiredTp: number;
        }
        /**
         *
         */
        export type PostLessonFinished200Response = /*  */ PostLessonFinished200ResponseOneOf;
        export interface PostLessonFinished200ResponseOneOf {
            type: "full_url";
            /**
             * When "type" is "full_url", this will be the url to which the user redirect after the lesson
             */
            value: string;
        }
        /**
         *
         */
        export interface PostLessonFinished401Response {
            login_status: "no";
        }
        /**
         *
         */
        export interface PostLessonFinishedRequest {
            /**
             * This is defined in the spread sheet where the lesson steps are defined
             */
            project_name: string;
            /**
             * This is defined in the spread sheet where the lesson steps are defined
             */
            scenario_path: string;
            finish_status: PostLessonFinishedRequestFinishStatus;
        }
        export interface PostLessonFinishedRequestFinishStatus {
            /**
             * Will be true the user answered all of quiz correcly or the lesson has no quiz
             */
            quiz_all_answered: boolean;
            /**
             * Will be true if the user didn't use any hint in the lesson
             */
            no_hint_cleared: boolean;
            /**
             * Will be true if the user did the cheat that skip a step by editing the step_id in the URL.
             */
            no_status_up: boolean;
        }
        /**
         * example:
         * {
         *   "user": {
         *     "role": "student",
         *     "id": "id",
         *     "accessToken": "accessToken"
         *   }
         * }
         */
        export interface PostLogin200Response {
            user: /**
             * example:
             * {
             *   "role": "student",
             *   "id": "id",
             *   "accessToken": "accessToken"
             * }
             */
            PostLogin200ResponseUser;
        }
        /**
         * example:
         * {
         *   "role": "student",
         *   "id": "id",
         *   "accessToken": "accessToken"
         * }
         */
        export interface PostLogin200ResponseUser {
            id: string;
            accessToken: string;
            role: "student" | "teacher" | "administrator" | "internalOperator" | "anonymous";
        }
        /**
         *
         */
        export interface PostLoginRequest {
            /**
             * login ID
             */
            loginId: string;
            /**
             * password
             */
            password: string;
        }
        /**
         *
         */
        export interface PostOrganizationRequest {
            name: string;
            districtId: string;
            stateId: string;
            organizationLMSId?: string;
            createdUserId?: string;
        }
        /**
         *
         */
        export interface PostQuizAnsweredRequest {
            /**
             * This is defined in the spread sheet where the lesson steps are defined
             */
            project_name: string;
            /**
             * This is defined in the spread sheet where the lesson steps are defined
             */
            scenario_path: string;
            /**
             * This is defined in the spread sheet where the lesson steps are defined
             */
            step_id: string;
            is_correct: boolean;
            /**
             * Which choice did the user selected
             */
            selected_choice: string;
        }
        /**
         *
         */
        export interface PostResetPasswordRequest {
            isValidateToken?: boolean;
            token: string;
            password?: string;
        }
        /**
         *
         */
        export interface PostStepPassedRequest {
            /**
             * This is defined in the spread sheet where the lesson steps are defined
             */
            project_name: string;
            /**
             * This is defined in the spread sheet where the lesson steps are defined
             */
            scenario_path: string;
            /**
             * This is defined in the spread sheet where the lesson steps are defined
             */
            step_id: string;
        }
        /**
         *
         */
        export interface PostStudentGroupRequest {
            /**
             * This is a student group name.
             */
            name: string;
            /**
             * This is a packageId.
             */
            packageId: string;
            /**
             * This is a grade like (grade1,grade2 and etc).
             */
            grade?: string;
            studentGroupLmsId?: string;
        }
        /**
         *
         */
        export interface PostStudentGroupUnaccessibleLessonRequest {
            packageId: string;
        }
        export interface PostStudents400Response {
            error: PostStudents400ResponseError;
        }
        export type PostStudents400ResponseError = string | PostStudents400ResponseErrorOneOfInner[];
        export interface PostStudents400ResponseErrorOneOfInner {
            index?: number;
            message?: ("invalidEmail" | "loginIdAlreadyExists" | "duplicateEmail" | "nickNameNotProvided" | "emptyPassword" | "studentLMSIdAlreadyExists" | "duplicateRecordsWithSameLoginId" | "duplicateRecordsWithStudentLMSId" | "loginIdSholdNotContainedWhiteSpace" | "userAlreadyExistWithEmail" | "duplicateRecordsWithSameEmail" | "atLeastOneFieldIsMandatory" | "studentLmsIdNotProvided")[];
        }
        /**
         *
         */
        export interface PostStudentsRequest {
            students: /* student */ Student[];
        }
        export interface PostTeachers400Response {
            error: PostTeachers400ResponseError;
        }
        export type PostTeachers400ResponseError = string | PostTeachers400ResponseErrorOneOfInner[];
        export interface PostTeachers400ResponseErrorOneOfInner {
            index?: number;
            message?: ("duplicateRecordsWithSameEmail" | "duplicateRecordsWithSameTeacherLMSId" | "userAlreadyExistWithEmail" | "userAlreadyExistWithTeacherLMSId" | "emailInvalid" | "emailNotProvided" | "emptyPassword")[];
        }
        /**
         *
         */
        export interface PostTeachersRequest {
            teachers: /* teacher */ Teacher[];
        }
        export interface PostUserLessonStatusRequest {
            lessonId: string;
        }
        /**
         * example:
         * {
         *   "userPackageAssignment": {
         *     "packageId": "packageId",
         *     "packageCategoryId": "packageCategoryId",
         *     "userId": "userId"
         *   }
         * }
         */
        export interface PostUserPackageAssignment200Response {
            userPackageAssignment: /**
             * UserPackageAssignment
             *
             * example:
             * {
             *   "packageId": "packageId",
             *   "packageCategoryId": "packageCategoryId",
             *   "userId": "userId"
             * }
             */
            UserPackageAssignment;
        }
        /**
         *
         */
        export interface PostUserResetPasswordRequest500Response {
            error: string;
        }
        /**
         *
         */
        export interface PostUserResetPasswordRequestRequest {
            email: string;
        }
        /**
         *
         */
        export interface PostUserResetPasswordRequestResendRequest {
            token: string;
        }
        /**
         *
         */
        export interface PutAdministratorRequest {
            /**
             * This is a user's email.
             */
            email: string;
            /**
             * This is a first name of administrator.
             */
            firstName?: string;
            /**
             * This is a last name of administrator.
             */
            lastName?: string;
            /**
             * This is a administratorLMSId of administrator.
             */
            administratorLMSId?: string;
            password?: string;
        }
        /**
         *
         */
        export interface PutChangePasswordRequest {
            newPassword: string;
        }
        /**
         *
         */
        export interface PutDistrictRequest {
            /**
             * This is a district name.
             */
            name: string;
            /**
             * This is a lmsId like(None, Clever, Claslink, Google classroom).
             */
            lmsId: string;
            /**
             * This is a districtLmsId.
             */
            districtLmsId?: string;
            /**
             * This is a enableRosterSync.
             */
            enableRosterSync?: boolean;
            /**
             * This is apiToken.
             */
            apiToken?: string;
        }
        /**
         *
         */
        export interface PutStudentGroupRequest {
            /**
             * This is a student group name.
             */
            name: string;
            /**
             * This is a packageId.
             */
            packageId: string;
            /**
             * This is a grade like (grade1,grade2 and etc).
             */
            grade?: string;
            studentGroupLmsId?: string;
        }
        /**
         *
         */
        export interface PutStudentRequest {
            nickName?: string;
            loginId?: string;
            password?: string;
            studentLMSId?: string;
            email?: string;
            emailsToNotify?: string[];
        }
        /**
         *
         */
        export interface PutTeacherRequest {
            teacher?: PutTeacherRequestTeacher;
        }
        export interface PutTeacherRequestTeacher {
            /**
             * This is a first name of teacher.
             */
            firstName?: string;
            /**
             * This is a last name of teacher.
             */
            lastName?: string;
            /**
             * This is a teacherLMSId of teacher.
             */
            teacherLMSId?: string;
            email?: string;
            password?: string;
        }
        /**
         * StandardMapping
         * The Definition of Get standard mapping based on organization state.
         * example:
         * {
         *   "gradeBand": [
         *     {
         *       "standardDomain": [
         *         {
         *           "standard": "standard",
         *           "cse": [
         *             "cse",
         *             "cse"
         *           ],
         *           "domain": "domain",
         *           "disneyCodeillusionLesson": [
         *             "disneyCodeillusionLesson",
         *             "disneyCodeillusionLesson"
         *           ],
         *           "description": "description"
         *         },
         *         {
         *           "standard": "standard",
         *           "cse": [
         *             "cse",
         *             "cse"
         *           ],
         *           "domain": "domain",
         *           "disneyCodeillusionLesson": [
         *             "disneyCodeillusionLesson",
         *             "disneyCodeillusionLesson"
         *           ],
         *           "description": "description"
         *         }
         *       ],
         *       "band": "band"
         *     },
         *     {
         *       "standardDomain": [
         *         {
         *           "standard": "standard",
         *           "cse": [
         *             "cse",
         *             "cse"
         *           ],
         *           "domain": "domain",
         *           "disneyCodeillusionLesson": [
         *             "disneyCodeillusionLesson",
         *             "disneyCodeillusionLesson"
         *           ],
         *           "description": "description"
         *         },
         *         {
         *           "standard": "standard",
         *           "cse": [
         *             "cse",
         *             "cse"
         *           ],
         *           "domain": "domain",
         *           "disneyCodeillusionLesson": [
         *             "disneyCodeillusionLesson",
         *             "disneyCodeillusionLesson"
         *           ],
         *           "description": "description"
         *         }
         *       ],
         *       "band": "band"
         *     }
         *   ],
         *   "stateId": "stateId",
         *   "stateStandardName": "stateStandardName"
         * }
         */
        export interface StandardMapping {
            stateId: string;
            stateStandardName: string;
            gradeBand: /**
             * example:
             * {
             *   "standardDomain": [
             *     {
             *       "standard": "standard",
             *       "cse": [
             *         "cse",
             *         "cse"
             *       ],
             *       "domain": "domain",
             *       "disneyCodeillusionLesson": [
             *         "disneyCodeillusionLesson",
             *         "disneyCodeillusionLesson"
             *       ],
             *       "description": "description"
             *     },
             *     {
             *       "standard": "standard",
             *       "cse": [
             *         "cse",
             *         "cse"
             *       ],
             *       "domain": "domain",
             *       "disneyCodeillusionLesson": [
             *         "disneyCodeillusionLesson",
             *         "disneyCodeillusionLesson"
             *       ],
             *       "description": "description"
             *     }
             *   ],
             *   "band": "band"
             * }
             */
            StandardMappingGradeBandInner[];
        }
        /**
         * example:
         * {
         *   "standardDomain": [
         *     {
         *       "standard": "standard",
         *       "cse": [
         *         "cse",
         *         "cse"
         *       ],
         *       "domain": "domain",
         *       "disneyCodeillusionLesson": [
         *         "disneyCodeillusionLesson",
         *         "disneyCodeillusionLesson"
         *       ],
         *       "description": "description"
         *     },
         *     {
         *       "standard": "standard",
         *       "cse": [
         *         "cse",
         *         "cse"
         *       ],
         *       "domain": "domain",
         *       "disneyCodeillusionLesson": [
         *         "disneyCodeillusionLesson",
         *         "disneyCodeillusionLesson"
         *       ],
         *       "description": "description"
         *     }
         *   ],
         *   "band": "band"
         * }
         */
        export interface StandardMappingGradeBandInner {
            band: string;
            standardDomain: /**
             * example:
             * {
             *   "standard": "standard",
             *   "cse": [
             *     "cse",
             *     "cse"
             *   ],
             *   "domain": "domain",
             *   "disneyCodeillusionLesson": [
             *     "disneyCodeillusionLesson",
             *     "disneyCodeillusionLesson"
             *   ],
             *   "description": "description"
             * }
             */
            StandardMappingGradeBandInnerStandardDomainInner[];
        }
        /**
         * example:
         * {
         *   "standard": "standard",
         *   "cse": [
         *     "cse",
         *     "cse"
         *   ],
         *   "domain": "domain",
         *   "disneyCodeillusionLesson": [
         *     "disneyCodeillusionLesson",
         *     "disneyCodeillusionLesson"
         *   ],
         *   "description": "description"
         * }
         */
        export interface StandardMappingGradeBandInnerStandardDomainInner {
            standard: string;
            domain: string;
            description: string;
            disneyCodeillusionLesson: string[];
            cse: string[];
        }
        /**
         * student
         */
        export interface Student {
            nickName?: string;
            email?: string;
            loginId?: string;
            password?: string;
            studentLMSId?: string;
            emailsToNotify?: string[];
        }
        /**
         * StudentGroupPackageAssignment
         * The Definition of Get StudentGroupPackageAssignment
         * example:
         * {
         *   "packageId": "packageId",
         *   "packageCategoryId": "packageCategoryId",
         *   "studentGroupId": "studentGroupId"
         * }
         */
        export interface StudentGroupPackageAssignment {
            packageCategoryId: string;
            studentGroupId: string;
            packageId: string;
        }
        /**
         * StudentGroupWithId
         * The Definition of Get Student Groups.
         */
        export interface StudentGroupWithId {
            id: string;
            organizationId: string;
            name: string;
            codeillusionPackageId: string;
            csePackageId?: string;
            grade: string;
            studentGroupLmsId?: string;
        }
        /**
         * StudentGroups
         * The Definition of Get Student Groups.
         * example:
         * {
         *   "organizationId": "organizationId",
         *   "createdUserId": "createdUserId",
         *   "createdDate": "2000-01-23T04:56:07.000Z",
         *   "studentGroupLmsId": "studentGroupLmsId",
         *   "grade": "grade",
         *   "name": "name",
         *   "id": "id",
         *   "updatedDate": "2000-01-23T04:56:07.000Z",
         *   "updatedUserId": "updatedUserId"
         * }
         */
        export interface StudentGroups {
            id: string;
            organizationId: string;
            name: string;
            grade: string;
            studentGroupLmsId: string;
            createdUserId: string;
            updatedUserId: string;
            createdDate: string; // date-time
            updatedDate: string; // date-time
        }
        /**
         * teacher
         */
        export interface Teacher {
            email?: string;
            firstName?: string;
            lastName?: string;
            teacherLMSId?: string;
            password?: string;
        }
        /**
         * Teacher-Organization
         * Teacher
         * example:
         * {
         *   "teacher": {
         *     "organizationId": "organizationId",
         *     "firstName": "firstName",
         *     "lastName": "lastName",
         *     "teacherId": "teacherId",
         *     "districtId": "districtId",
         *     "createdUserId": "createdUserId",
         *     "createdDate": "createdDate",
         *     "teacherLMSId": "teacherLMSId",
         *     "isPrimary": true,
         *     "userId": "userId",
         *     "teacherOrganizations": [
         *       {
         *         "stateId": "stateId",
         *         "name": "name",
         *         "id": "id"
         *       },
         *       {
         *         "stateId": "stateId",
         *         "name": "name",
         *         "id": "id"
         *       }
         *     ],
         *     "email": "email"
         *   }
         * }
         */
        export interface TeacherOrganization {
            teacher: /**
             * example:
             * {
             *   "organizationId": "organizationId",
             *   "firstName": "firstName",
             *   "lastName": "lastName",
             *   "teacherId": "teacherId",
             *   "districtId": "districtId",
             *   "createdUserId": "createdUserId",
             *   "createdDate": "createdDate",
             *   "teacherLMSId": "teacherLMSId",
             *   "isPrimary": true,
             *   "userId": "userId",
             *   "teacherOrganizations": [
             *     {
             *       "stateId": "stateId",
             *       "name": "name",
             *       "id": "id"
             *     },
             *     {
             *       "stateId": "stateId",
             *       "name": "name",
             *       "id": "id"
             *     }
             *   ],
             *   "email": "email"
             * }
             */
            TeacherOrganizationTeacher;
        }
        /**
         * example:
         * {
         *   "organizationId": "organizationId",
         *   "firstName": "firstName",
         *   "lastName": "lastName",
         *   "teacherId": "teacherId",
         *   "districtId": "districtId",
         *   "createdUserId": "createdUserId",
         *   "createdDate": "createdDate",
         *   "teacherLMSId": "teacherLMSId",
         *   "isPrimary": true,
         *   "userId": "userId",
         *   "teacherOrganizations": [
         *     {
         *       "stateId": "stateId",
         *       "name": "name",
         *       "id": "id"
         *     },
         *     {
         *       "stateId": "stateId",
         *       "name": "name",
         *       "id": "id"
         *     }
         *   ],
         *   "email": "email"
         * }
         */
        export interface TeacherOrganizationTeacher {
            teacherId: string;
            userId: string;
            firstName: string;
            organizationId?: string;
            districtId?: string;
            email: string;
            lastName: string;
            isPrimary?: boolean;
            teacherLMSId: string;
            createdUserId: string;
            createdDate: string;
            teacherOrganizations: /**
             * example:
             * {
             *   "stateId": "stateId",
             *   "name": "name",
             *   "id": "id"
             * }
             */
            TeacherOrganizationTeacherTeacherOrganizationsInner[];
        }
        /**
         * example:
         * {
         *   "stateId": "stateId",
         *   "name": "name",
         *   "id": "id"
         * }
         */
        export interface TeacherOrganizationTeacherTeacherOrganizationsInner {
            /**
             * id of the organization.
             */
            id: string;
            /**
             * name of the organization.
             */
            name: string;
            /**
             * stateId of organization
             */
            stateId?: string;
        }
        /**
         * UnaccessibleLesson
         * The Definition of Get unaccessible Lesson.
         * example:
         * {
         *   "createdUserId": "createdUserId",
         *   "createdDate": "createdDate",
         *   "packageId": "packageId",
         *   "studentGroupId": "studentGroupId",
         *   "lessonId": "lessonId"
         * }
         */
        export interface UnaccessibleLesson {
            studentGroupId: string;
            packageId: string;
            lessonId: string;
            createdUserId: string;
            createdDate: string;
        }
        /**
         * example:
         * {
         *   "soundSettings": {
         *     "seVolume": 0.8008281904610115,
         *     "bgmVolume": 6.027456183070403,
         *     "narrationLanguage": "en",
         *     "serifNarrationVolume": 5.962133916683182,
         *     "hintNarrationVolume": 1.4658129805029452
         *   }
         * }
         */
        export interface UpdateUserSoundSettings200Response {
            soundSettings?: /**
             * UserSoundSettings
             * example:
             * {
             *   "seVolume": 0.8008281904610115,
             *   "bgmVolume": 6.027456183070403,
             *   "narrationLanguage": "en",
             *   "serifNarrationVolume": 5.962133916683182,
             *   "hintNarrationVolume": 1.4658129805029452
             * }
             */
            UserSoundSettings;
        }
        /**
         * UserLessonStatus
         *
         * example:
         * {
         *   "correctAnsweredQuizCount": 6.027456183070403,
         *   "usedHintCount": 1.4658129805029452,
         *   "lessonId": "lessonId",
         *   "stepIdskippingDetected": true,
         *   "startedAt": "2000-01-23T04:56:07.000Z",
         *   "achievedStarCount": 0.8008281904610115,
         *   "quizCount": 5.962133916683182,
         *   "userId": "userId",
         *   "status": "not_cleared",
         *   "finishedAt": "2000-01-23T04:56:07.000Z"
         * }
         */
        export interface UserLessonStatus {
            userId: string;
            lessonId: string;
            /**
             * "not_cleared" shows "It's available but not cleared"
             * "cleared" shows "It's available and already cleared at least once"
             * "locked" shows "It's unavailable for some reason. e.g.) the teacher has locked this lesson"
             */
            status: "not_cleared" | "cleared" | "locked";
            achievedStarCount: number;
            correctAnsweredQuizCount?: number | null;
            usedHintCount?: number | null;
            stepIdskippingDetected: boolean;
            startedAt?: string; // date-time
            finishedAt?: string; // date-time
            quizCount?: number;
        }
        /**
         * UserPackageAssignment
         *
         * example:
         * {
         *   "packageId": "packageId",
         *   "packageCategoryId": "packageCategoryId",
         *   "userId": "userId"
         * }
         */
        export interface UserPackageAssignment {
            userId: string;
            packageCategoryId: string;
            packageId: string;
        }
        /**
         * UserSettings
         * example:
         * {
         *   "sound": {
         *     "seVolume": 0.8008281904610115,
         *     "bgmVolume": 6.027456183070403,
         *     "narrationLanguage": "en",
         *     "serifNarrationVolume": 5.962133916683182,
         *     "hintNarrationVolume": 1.4658129805029452
         *   }
         * }
         */
        export interface UserSettings {
            sound: /**
             * UserSoundSettings
             * example:
             * {
             *   "seVolume": 0.8008281904610115,
             *   "bgmVolume": 6.027456183070403,
             *   "narrationLanguage": "en",
             *   "serifNarrationVolume": 5.962133916683182,
             *   "hintNarrationVolume": 1.4658129805029452
             * }
             */
            UserSoundSettings;
        }
        /**
         * UserSoundSettings
         * example:
         * {
         *   "seVolume": 0.8008281904610115,
         *   "bgmVolume": 6.027456183070403,
         *   "narrationLanguage": "en",
         *   "serifNarrationVolume": 5.962133916683182,
         *   "hintNarrationVolume": 1.4658129805029452
         * }
         */
        export interface UserSoundSettings {
            seVolume: number;
            bgmVolume: number;
            hintNarrationVolume: number;
            serifNarrationVolume: number;
            narrationLanguage: "en" | "es";
        }
    }
}
export declare namespace Paths {
    namespace DeleteAdministrator {
        namespace Parameters {
            export type AdministratorId = string;
        }
        export interface PathParameters {
            administratorId: Parameters.AdministratorId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace DeleteDistrict {
        namespace Parameters {
            export type DistrictId = string;
        }
        export interface PathParameters {
            districtId: Parameters.DistrictId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace DeleteOrganization {
        namespace Parameters {
            export type OrganizationId = string;
        }
        export interface PathParameters {
            organizationId: Parameters.OrganizationId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace DeleteStudent {
        namespace Parameters {
            export type StudentId = string;
        }
        export interface PathParameters {
            studentId: Parameters.StudentId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace DeleteStudentFromStudentGroup {
        namespace Parameters {
            export type StudentGroupId = string;
            export type StudentId = string;
        }
        export interface PathParameters {
            studentGroupId: Parameters.StudentGroupId;
            studentId: Parameters.StudentId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace DeleteStudentGroup {
        namespace Parameters {
            export type StudentGroupId = string;
        }
        export interface PathParameters {
            studentGroupId: Parameters.StudentGroupId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace DeleteStudentGroupUnaccessibleLesson {
        namespace Parameters {
            export type LessonIds = string[];
            export type StudentGroupId = string;
        }
        export interface PathParameters {
            studentGroupId: Parameters.StudentGroupId;
        }
        export interface QueryParameters {
            lessonIds: Parameters.LessonIds;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace DeleteTeacher {
        namespace Parameters {
            export type TeacherId = string;
        }
        export interface PathParameters {
            teacherId: Parameters.TeacherId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace DeleteTeacherFromOrganization {
        namespace Parameters {
            export type OrganizationId = string;
            export type TeacherId = string;
        }
        export interface PathParameters {
            organizationId: Parameters.OrganizationId;
            teacherId: Parameters.TeacherId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace DeleteUserPackageAssignment {
        export type RequestBody = Components.Schemas.DeleteUserPackageAssignmentRequest;
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "message": "message"
             * }
             */
            Components.Schemas.DeleteUserPackageAssignment200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetAdministrators {
        namespace Parameters {
            export type AdministratorIds = string[];
            export type DistrictId = string;
        }
        export interface PathParameters {
            districtId: Parameters.DistrictId;
        }
        export interface QueryParameters {
            administratorIds?: Parameters.AdministratorIds;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "administrators": [
             *     {
             *       "firstName": "firstName",
             *       "lastName": "lastName",
             *       "administratorId": "administratorId",
             *       "districtId": "districtId",
             *       "createdUserId": "createdUserId",
             *       "createdDate": "createdDate",
             *       "userId": "userId",
             *       "email": "email",
             *       "administratorLMSId": "administratorLMSId"
             *     },
             *     {
             *       "firstName": "firstName",
             *       "lastName": "lastName",
             *       "administratorId": "administratorId",
             *       "districtId": "districtId",
             *       "createdUserId": "createdUserId",
             *       "createdDate": "createdDate",
             *       "userId": "userId",
             *       "email": "email",
             *       "administratorLMSId": "administratorLMSId"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetAdministrators200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetAfterLessonCleared {
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.PostLessonFinished200Response;
        }
    }
    namespace GetAllPackages {
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "packages": [
             *     {
             *       "packageId": "packageId",
             *       "packageCategoryId": "codeillusion",
             *       "packageName": "packageName"
             *     },
             *     {
             *       "packageId": "packageId",
             *       "packageCategoryId": "codeillusion",
             *       "packageName": "packageName"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetAllPackages200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetCheckToken {
        export interface HeaderParameters {
            authentication?: Parameters.Authentication;
        }
        namespace Parameters {
            export type Authentication = string;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "result": "valid",
             *   "isAccessible": true,
             *   "name": "name"
             * }
             */
            Components.Schemas.GetCheckToken200Response;
            export type $401 = /*  */ Components.Schemas.GetCheckToken401Response;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace GetChurnZeroAuthentication {
        namespace Parameters {
            export type AccountExternalId = string;
            export type ContactExternalId = string;
            export type Next = string;
        }
        export interface QueryParameters {
            "account-external-id": Parameters.AccountExternalId;
            "contact-external-id": Parameters.ContactExternalId;
            next: Parameters.Next;
        }
        namespace Responses {
            export type $302 = /*  */ Components.Schemas.GetChurnZeroAuthentication302Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetClasslinkRosterSync {
        namespace Parameters {
            export type DistrictId = string;
        }
        export interface QueryParameters {
            districtId: Parameters.DistrictId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetCleverRosterSync {
        namespace Parameters {
            export type DistrictId = string;
        }
        export interface QueryParameters {
            districtId: Parameters.DistrictId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "message"
             * }
             */
            Components.Schemas.GetCleverRosterSync200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetCodeIllusionPackage {
        namespace Parameters {
            export type PackageId = string;
        }
        export interface QueryParameters {
            packageId: Parameters.PackageId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "codeIllusionPackage": {
             *     "level": "basic",
             *     "headerButtonText": "headerButtonText",
             *     "chapters": [
             *       {
             *         "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *         "name": "name",
             *         "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
             *         "circles": [
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           },
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           }
             *         ],
             *         "id": "id",
             *         "title": "title"
             *       },
             *       {
             *         "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *         "name": "name",
             *         "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
             *         "circles": [
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           },
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           }
             *         ],
             *         "id": "id",
             *         "title": "title"
             *       }
             *     ],
             *     "name": "name",
             *     "id": "id",
             *     "redirectUrlWhenAllFinished": "redirectUrlWhenAllFinished",
             *     "headerButtonLink": "headerButtonLink"
             *   }
             * }
             */
            Components.Schemas.GetUsersUserIdCodeIllusionPackages200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetCsePackage {
        namespace Parameters {
            export type PackageId = string;
        }
        export interface PathParameters {
            packageId: Parameters.PackageId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "csePackage": {
             *     "headerButtonText": "headerButtonText",
             *     "name": "name",
             *     "id": "id",
             *     "units": [
             *       {
             *         "name": "name",
             *         "description": "description",
             *         "id": "id",
             *         "lessons": [
             *           {
             *             "isQuizLesson": true,
             *             "id": "id"
             *           },
             *           {
             *             "isQuizLesson": true,
             *             "id": "id"
             *           }
             *         ]
             *       },
             *       {
             *         "name": "name",
             *         "description": "description",
             *         "id": "id",
             *         "lessons": [
             *           {
             *             "isQuizLesson": true,
             *             "id": "id"
             *           },
             *           {
             *             "isQuizLesson": true,
             *             "id": "id"
             *           }
             *         ]
             *       }
             *     ],
             *     "headerButtonLink": "headerButtonLink"
             *   }
             * }
             */
            Components.Schemas.GetCsePackage200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetDistrictByDistrictId {
        namespace Parameters {
            export type DistrictId = string;
        }
        export interface PathParameters {
            districtId: Parameters.DistrictId;
        }
        namespace Responses {
            export type $200 = /**
             * District
             * The Definition of Get Districts.
             * example:
             * {
             *   "lastRosterSyncEventId": "lastRosterSyncEventId",
             *   "lastRosterSyncEventDate": "lastRosterSyncEventDate",
             *   "stateId": "stateId",
             *   "name": "name",
             *   "lmsId": "lmsId",
             *   "id": "id",
             *   "districtLMSId": "districtLMSId",
             *   "administrators": "administrators",
             *   "enableRosterSync": true
             * }
             */
            Components.Schemas.District;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace GetDistrictLMSInformationByOrganization {
        namespace Parameters {
            export type OrganizationId = string;
        }
        export interface PathParameters {
            organizationId: Parameters.OrganizationId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "districtId": "districtId",
             *   "districtName": "districtName",
             *   "lmsId": "lmsId"
             * }
             */
            Components.Schemas.GetDistrictLMSInformationByOrganization200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetDistrictPurchasedPackagesByDistrictId {
        namespace Parameters {
            export type DistrictId = string;
        }
        export interface PathParameters {
            districtId: Parameters.DistrictId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "packages": [
             *     {
             *       "packageId": "packageId",
             *       "packageCategoryId": "packageCategoryId",
             *       "packageName": "packageName"
             *     },
             *     {
             *       "packageId": "packageId",
             *       "packageCategoryId": "packageCategoryId",
             *       "packageName": "packageName"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetDistrictPurchasedPackagesByDistrictId200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetDistrictRosterSyncStatus {
        namespace Parameters {
            export type DistrictId = string;
        }
        export interface QueryParameters {
            districtId: Parameters.DistrictId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "districtRosterSyncStatuses": [
             *     {
             *       "districtId": "districtId",
             *       "createdUserId": "createdUserId",
             *       "errorMessage": "errorMessage",
             *       "startedAt": "startedAt",
             *       "id": "id",
             *       "finishedAt": "finishedAt"
             *     },
             *     {
             *       "districtId": "districtId",
             *       "createdUserId": "createdUserId",
             *       "errorMessage": "errorMessage",
             *       "startedAt": "startedAt",
             *       "id": "id",
             *       "finishedAt": "finishedAt"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetDistrictRosterSyncStatus200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetDistricts {
        namespace Parameters {
            export type DistrictIds = string[];
            export type EnabledRosterSync = boolean;
            export type LMSId = string;
        }
        export interface QueryParameters {
            districtIds?: Parameters.DistrictIds;
            LMSId?: Parameters.LMSId;
            enabledRosterSync?: Parameters.EnabledRosterSync;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "districts": [
             *     {
             *       "lastRosterSyncEventId": "lastRosterSyncEventId",
             *       "lastRosterSyncEventDate": "lastRosterSyncEventDate",
             *       "stateId": "stateId",
             *       "name": "name",
             *       "lmsId": "lmsId",
             *       "id": "id",
             *       "districtLMSId": "districtLMSId",
             *       "administrators": "administrators",
             *       "enableRosterSync": true
             *     },
             *     {
             *       "lastRosterSyncEventId": "lastRosterSyncEventId",
             *       "lastRosterSyncEventDate": "lastRosterSyncEventDate",
             *       "stateId": "stateId",
             *       "name": "name",
             *       "lmsId": "lmsId",
             *       "id": "id",
             *       "districtLMSId": "districtLMSId",
             *       "administrators": "administrators",
             *       "enableRosterSync": true
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetDistricts200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetLessons {
        namespace Parameters {
            export type LessonIds = string[];
        }
        export interface QueryParameters {
            lessonIds: Parameters.LessonIds;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "lessons": [
             *     {
             *       "maxStarCount": 0.8008281904610115,
             *       "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *       "lessonEnvironment": "litLessonPlayer",
             *       "hintCount": 1.4658129805029452,
             *       "level": "basic",
             *       "lessonDuration": "lessonDuration",
             *       "lessonObjectives": "lessonObjectives",
             *       "description": "description",
             *       "url": "url",
             *       "skillsLearnedInThisLesson": "skillsLearnedInThisLesson",
             *       "thumbnailImageUrl": "thumbnailImageUrl",
             *       "name": "name",
             *       "course": "basic",
             *       "theme": "theme",
             *       "quizCount": 6.027456183070403,
             *       "id": "id",
             *       "projectName": "projectName",
             *       "scenarioName": "scenarioName"
             *     },
             *     {
             *       "maxStarCount": 0.8008281904610115,
             *       "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *       "lessonEnvironment": "litLessonPlayer",
             *       "hintCount": 1.4658129805029452,
             *       "level": "basic",
             *       "lessonDuration": "lessonDuration",
             *       "lessonObjectives": "lessonObjectives",
             *       "description": "description",
             *       "url": "url",
             *       "skillsLearnedInThisLesson": "skillsLearnedInThisLesson",
             *       "thumbnailImageUrl": "thumbnailImageUrl",
             *       "name": "name",
             *       "course": "basic",
             *       "theme": "theme",
             *       "quizCount": 6.027456183070403,
             *       "id": "id",
             *       "projectName": "projectName",
             *       "scenarioName": "scenarioName"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetLessons200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetLessonsSetting {
        namespace Parameters {
            export type ProjectName = string;
            export type ScenarioPath = string;
        }
        export interface QueryParameters {
            scenario_path: Parameters.ScenarioPath;
            project_name: Parameters.ProjectName;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "redirecetUrl": "redirecetUrl",
             *   "isAccessible": true,
             *   "passed_step_id_list": [
             *     0.8008281904610115,
             *     0.8008281904610115
             *   ],
             *   "cleared": true
             * }
             */
            Components.Schemas.GetLessonsSetting200Response;
            export type $401 = /*  */ Components.Schemas.GetLessonsSetting401Response;
            export type $403 = /*  */ Components.Schemas.GetLessonsSetting401Response;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace GetLoggedInUser {
        namespace Responses {
            export type $200 = /**
             * LoggedInUser
             * example:
             * {
             *   "administrator": {
             *     "firstName": "firstName",
             *     "lastName": "lastName",
             *     "districtId": "districtId",
             *     "id": "id",
             *     "userId": "userId",
             *     "administratorLMSId": "administratorLMSId"
             *   },
             *   "teacher": {
             *     "firstName": "firstName",
             *     "lastName": "lastName",
             *     "districtId": "districtId",
             *     "teacherLMSId": "teacherLMSId",
             *     "organizationIds": [
             *       "organizationIds",
             *       "organizationIds"
             *     ],
             *     "id": "id",
             *     "userId": "userId"
             *   },
             *   "student": {
             *     "studentLMSId": "studentLMSId",
             *     "districtId": "districtId",
             *     "organizationIds": [
             *       "organizationIds",
             *       "organizationIds"
             *     ],
             *     "nickName": "nickName",
             *     "id": "id",
             *     "userId": "userId",
             *     "studentGroupIds": [
             *       "studentGroupIds",
             *       "studentGroupIds"
             *     ]
             *   },
             *   "user": {
             *     "role": "role",
             *     "loginId": "loginId",
             *     "id": "id",
             *     "email": "email"
             *   }
             * }
             */
            Components.Schemas.LoggedInUser;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetOrganizations {
        namespace Parameters {
            export type DistrictId = string;
            export type OrganizationIds = string[];
        }
        export interface PathParameters {
            districtId: Parameters.DistrictId;
        }
        export interface QueryParameters {
            organizationIds?: Parameters.OrganizationIds;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "organizations": [
             *     {
             *       "districtId": "districtId",
             *       "createdUserId": "createdUserId",
             *       "createdDate": "2000-01-23T04:56:07.000Z",
             *       "stateId": "stateId",
             *       "name": "name",
             *       "id": "id",
             *       "organizationLMSId": "organizationLMSId",
             *       "updatedDate": "2000-01-23T04:56:07.000Z"
             *     },
             *     {
             *       "districtId": "districtId",
             *       "createdUserId": "createdUserId",
             *       "createdDate": "2000-01-23T04:56:07.000Z",
             *       "stateId": "stateId",
             *       "name": "name",
             *       "id": "id",
             *       "organizationLMSId": "organizationLMSId",
             *       "updatedDate": "2000-01-23T04:56:07.000Z"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetOrganizations200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetPackageDetailsByStudentGroupId {
        namespace Parameters {
            export type StudentGroupId = string;
        }
        export interface PathParameters {
            studentGroupId: Parameters.StudentGroupId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "package": {
             *     "level": "basic",
             *     "headerButtonText": "headerButtonText",
             *     "chapters": [
             *       {
             *         "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *         "name": "name",
             *         "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
             *         "circles": [
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           },
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           }
             *         ],
             *         "id": "id",
             *         "title": "title"
             *       },
             *       {
             *         "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *         "name": "name",
             *         "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
             *         "circles": [
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           },
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           }
             *         ],
             *         "id": "id",
             *         "title": "title"
             *       }
             *     ],
             *     "name": "name",
             *     "id": "id",
             *     "redirectUrlWhenAllFinished": "redirectUrlWhenAllFinished",
             *     "headerButtonLink": "headerButtonLink"
             *   }
             * }
             */
            Components.Schemas.GetPackageDetailsByStudentGroupId200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetPlayersServerStatus {
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "isMaintenance": true
             * }
             */
            Components.Schemas.GetPlayersServerStatus200Response;
        }
    }
    namespace GetPlayersSetting {
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "login_status": "yes",
             *   "sound_volume": {
             *     "se": 6.027456183070403,
             *     "bgm": 0.8008281904610115,
             *     "hint_talk": 5.962133916683182,
             *     "serif_talk": 1.4658129805029452
             *   },
             *   "sound_config": {
             *     "talk_type": {
             *       "hint_talk": "hint_talk",
             *       "serif_talk": "serif_talk"
             *     },
             *     "min": 5.637376656633329,
             *     "max": 2.3021358869347655
             *   },
             *   "log_level": "development",
             *   "nickname": "nickname",
             *   "my_page_url": "my_page_url",
             *   "return_page": {
             *     "title": "title",
             *     "url": "url"
             *   },
             *   "language": "en",
             *   "player_name": "player_name",
             *   "header_user_icon_name": "header_user_icon_name",
             *   "header_appearance": {
             *     "show_user_icon": true,
             *     "show_menu": true,
             *     "show_login_status": true
             *   },
             *   "custom_items": [
             *     {
             *       "confirm": "confirm",
             *       "new_tab": true,
             *       "style": {
             *         "border": "border",
             *         "padding": "padding",
             *         "borderRadius": "borderRadius"
             *       },
             *       "text": "text",
             *       "url": "url"
             *     },
             *     {
             *       "confirm": "confirm",
             *       "new_tab": true,
             *       "style": {
             *         "border": "border",
             *         "padding": "padding",
             *         "borderRadius": "borderRadius"
             *       },
             *       "text": "text",
             *       "url": "url"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetPlayersSetting200Response;
            export type $401 = /*  */ Components.Schemas.GetPlayersSetting401Response;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace GetStandardMapping {
        namespace Parameters {
            export type StateId = string;
        }
        export interface QueryParameters {
            stateId?: Parameters.StateId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "standardMappings": [
             *     {
             *       "gradeBand": [
             *         {
             *           "standardDomain": [
             *             {
             *               "standard": "standard",
             *               "cse": [
             *                 "cse",
             *                 "cse"
             *               ],
             *               "domain": "domain",
             *               "disneyCodeillusionLesson": [
             *                 "disneyCodeillusionLesson",
             *                 "disneyCodeillusionLesson"
             *               ],
             *               "description": "description"
             *             },
             *             {
             *               "standard": "standard",
             *               "cse": [
             *                 "cse",
             *                 "cse"
             *               ],
             *               "domain": "domain",
             *               "disneyCodeillusionLesson": [
             *                 "disneyCodeillusionLesson",
             *                 "disneyCodeillusionLesson"
             *               ],
             *               "description": "description"
             *             }
             *           ],
             *           "band": "band"
             *         },
             *         {
             *           "standardDomain": [
             *             {
             *               "standard": "standard",
             *               "cse": [
             *                 "cse",
             *                 "cse"
             *               ],
             *               "domain": "domain",
             *               "disneyCodeillusionLesson": [
             *                 "disneyCodeillusionLesson",
             *                 "disneyCodeillusionLesson"
             *               ],
             *               "description": "description"
             *             },
             *             {
             *               "standard": "standard",
             *               "cse": [
             *                 "cse",
             *                 "cse"
             *               ],
             *               "domain": "domain",
             *               "disneyCodeillusionLesson": [
             *                 "disneyCodeillusionLesson",
             *                 "disneyCodeillusionLesson"
             *               ],
             *               "description": "description"
             *             }
             *           ],
             *           "band": "band"
             *         }
             *       ],
             *       "stateId": "stateId",
             *       "stateStandardName": "stateStandardName"
             *     },
             *     {
             *       "gradeBand": [
             *         {
             *           "standardDomain": [
             *             {
             *               "standard": "standard",
             *               "cse": [
             *                 "cse",
             *                 "cse"
             *               ],
             *               "domain": "domain",
             *               "disneyCodeillusionLesson": [
             *                 "disneyCodeillusionLesson",
             *                 "disneyCodeillusionLesson"
             *               ],
             *               "description": "description"
             *             },
             *             {
             *               "standard": "standard",
             *               "cse": [
             *                 "cse",
             *                 "cse"
             *               ],
             *               "domain": "domain",
             *               "disneyCodeillusionLesson": [
             *                 "disneyCodeillusionLesson",
             *                 "disneyCodeillusionLesson"
             *               ],
             *               "description": "description"
             *             }
             *           ],
             *           "band": "band"
             *         },
             *         {
             *           "standardDomain": [
             *             {
             *               "standard": "standard",
             *               "cse": [
             *                 "cse",
             *                 "cse"
             *               ],
             *               "domain": "domain",
             *               "disneyCodeillusionLesson": [
             *                 "disneyCodeillusionLesson",
             *                 "disneyCodeillusionLesson"
             *               ],
             *               "description": "description"
             *             },
             *             {
             *               "standard": "standard",
             *               "cse": [
             *                 "cse",
             *                 "cse"
             *               ],
             *               "domain": "domain",
             *               "disneyCodeillusionLesson": [
             *                 "disneyCodeillusionLesson",
             *                 "disneyCodeillusionLesson"
             *               ],
             *               "description": "description"
             *             }
             *           ],
             *           "band": "band"
             *         }
             *       ],
             *       "stateId": "stateId",
             *       "stateStandardName": "stateStandardName"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetStandardMapping200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetStudentGroupLessonStatuses {
        namespace Parameters {
            export type LessonIds = string[];
            export type StudentGroupId = string;
        }
        export interface PathParameters {
            studentGroupId: Parameters.StudentGroupId;
        }
        export interface QueryParameters {
            lessonIds?: Parameters.LessonIds;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "studentGroupLessonStatuses": [
             *     {
             *       "correctAnsweredQuizCount": 6.027456183070403,
             *       "usedHintCount": 1.4658129805029452,
             *       "lessonId": "lessonId",
             *       "stepIdskippingDetected": true,
             *       "startedAt": "2000-01-23T04:56:07.000Z",
             *       "achievedStarCount": 0.8008281904610115,
             *       "quizCount": 5.962133916683182,
             *       "userId": "userId",
             *       "status": "not_cleared",
             *       "finishedAt": "2000-01-23T04:56:07.000Z"
             *     },
             *     {
             *       "correctAnsweredQuizCount": 6.027456183070403,
             *       "usedHintCount": 1.4658129805029452,
             *       "lessonId": "lessonId",
             *       "stepIdskippingDetected": true,
             *       "startedAt": "2000-01-23T04:56:07.000Z",
             *       "achievedStarCount": 0.8008281904610115,
             *       "quizCount": 5.962133916683182,
             *       "userId": "userId",
             *       "status": "not_cleared",
             *       "finishedAt": "2000-01-23T04:56:07.000Z"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetStudentGroupLessonStatuses200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.GetStudentGroupLessonStatuses500Response;
        }
    }
    namespace GetStudentGroupPackageAssignments {
        namespace Parameters {
            export type StudentGroupId = string;
        }
        export interface QueryParameters {
            studentGroupId: Parameters.StudentGroupId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "studentGroupPackageAssignments": [
             *     {
             *       "packageId": "packageId",
             *       "packageCategoryId": "packageCategoryId",
             *       "studentGroupId": "studentGroupId"
             *     },
             *     {
             *       "packageId": "packageId",
             *       "packageCategoryId": "packageCategoryId",
             *       "studentGroupId": "studentGroupId"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetStudentGroupPackageAssignments200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetStudentGroups {
        namespace Parameters {
            export type OrganizationId = string;
        }
        export interface PathParameters {
            organizationId: Parameters.OrganizationId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "studentgroups": [
             *     {
             *       "organizationId": "organizationId",
             *       "createdUserId": "createdUserId",
             *       "createdDate": "2000-01-23T04:56:07.000Z",
             *       "studentGroupLmsId": "studentGroupLmsId",
             *       "grade": "grade",
             *       "name": "name",
             *       "id": "id",
             *       "updatedDate": "2000-01-23T04:56:07.000Z",
             *       "updatedUserId": "updatedUserId"
             *     },
             *     {
             *       "organizationId": "organizationId",
             *       "createdUserId": "createdUserId",
             *       "createdDate": "2000-01-23T04:56:07.000Z",
             *       "studentGroupLmsId": "studentGroupLmsId",
             *       "grade": "grade",
             *       "name": "name",
             *       "id": "id",
             *       "updatedDate": "2000-01-23T04:56:07.000Z",
             *       "updatedUserId": "updatedUserId"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetStudentGroups200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetStudentUnaccessibleLessons {
        namespace Parameters {
            export type StudentId = string;
        }
        export interface PathParameters {
            studentId: Parameters.StudentId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "unaccessibleLessons": [
             *     "unaccessibleLessons",
             *     "unaccessibleLessons"
             *   ]
             * }
             */
            Components.Schemas.GetStudentUnaccessibleLessons200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetStudents {
        namespace Parameters {
            export type Name = string;
            export type Option = "NotIn" | "In";
            export type StudentGroupId = string;
            export type StudentIds = string[];
        }
        export interface PathParameters {
            studentGroupId: Parameters.StudentGroupId;
        }
        export interface QueryParameters {
            studentIds?: Parameters.StudentIds;
            name?: Parameters.Name;
            option?: Parameters.Option;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "students": [
             *     {
             *       "lastLessionName": "lastLessionName",
             *       "loginId": "loginId",
             *       "studentGroupCount": 0.8008281904610115,
             *       "lastLessonStartedAt": "2000-01-23T04:56:07.000Z",
             *       "nickName": "nickName",
             *       "studentGroup": "studentGroup",
             *       "userId": "userId",
             *       "studentLMSId": "studentLMSId",
             *       "password": "password",
             *       "createdDate": "2000-01-23T04:56:07.000Z",
             *       "createdUserName": "createdUserName",
             *       "emailsToNotify": [
             *         "emailsToNotify",
             *         "emailsToNotify"
             *       ],
             *       "id": "id",
             *       "email": "email"
             *     },
             *     {
             *       "lastLessionName": "lastLessionName",
             *       "loginId": "loginId",
             *       "studentGroupCount": 0.8008281904610115,
             *       "lastLessonStartedAt": "2000-01-23T04:56:07.000Z",
             *       "nickName": "nickName",
             *       "studentGroup": "studentGroup",
             *       "userId": "userId",
             *       "studentLMSId": "studentLMSId",
             *       "password": "password",
             *       "createdDate": "2000-01-23T04:56:07.000Z",
             *       "createdUserName": "createdUserName",
             *       "emailsToNotify": [
             *         "emailsToNotify",
             *         "emailsToNotify"
             *       ],
             *       "id": "id",
             *       "email": "email"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetStudents200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetTeacherOrganizations {
        namespace Parameters {
            export type TeacherId = string;
        }
        export interface PathParameters {
            teacherId: Parameters.TeacherId;
        }
        namespace Responses {
            export type $200 = /**
             * Teacher-Organization
             * Teacher
             * example:
             * {
             *   "teacher": {
             *     "organizationId": "organizationId",
             *     "firstName": "firstName",
             *     "lastName": "lastName",
             *     "teacherId": "teacherId",
             *     "districtId": "districtId",
             *     "createdUserId": "createdUserId",
             *     "createdDate": "createdDate",
             *     "teacherLMSId": "teacherLMSId",
             *     "isPrimary": true,
             *     "userId": "userId",
             *     "teacherOrganizations": [
             *       {
             *         "stateId": "stateId",
             *         "name": "name",
             *         "id": "id"
             *       },
             *       {
             *         "stateId": "stateId",
             *         "name": "name",
             *         "id": "id"
             *       }
             *     ],
             *     "email": "email"
             *   }
             * }
             */
            Components.Schemas.TeacherOrganization;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace GetTeachers {
        namespace Parameters {
            export type OrganizationId = string;
            export type TeacherIds = string[];
        }
        export interface PathParameters {
            organizationId: Parameters.OrganizationId;
        }
        export interface QueryParameters {
            teacherIds?: Parameters.TeacherIds;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "teachers": [
             *     {
             *       "firstName": "firstName",
             *       "lastName": "lastName",
             *       "createdUserId": "createdUserId",
             *       "createdDate": "createdDate",
             *       "teacherLMSId": "teacherLMSId",
             *       "createdUserName": "createdUserName",
             *       "id": "id",
             *       "userId": "userId",
             *       "email": "email"
             *     },
             *     {
             *       "firstName": "firstName",
             *       "lastName": "lastName",
             *       "createdUserId": "createdUserId",
             *       "createdDate": "createdDate",
             *       "teacherLMSId": "teacherLMSId",
             *       "createdUserName": "createdUserName",
             *       "id": "id",
             *       "userId": "userId",
             *       "email": "email"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetTeachers200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetUnaccessibleLessons {
        namespace Parameters {
            export type StudentGroupId = string;
        }
        export interface PathParameters {
            studentGroupId: Parameters.StudentGroupId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "unaccessibleLessons": [
             *     {
             *       "createdUserId": "createdUserId",
             *       "createdDate": "createdDate",
             *       "packageId": "packageId",
             *       "studentGroupId": "studentGroupId",
             *       "lessonId": "lessonId"
             *     },
             *     {
             *       "createdUserId": "createdUserId",
             *       "createdDate": "createdDate",
             *       "packageId": "packageId",
             *       "studentGroupId": "studentGroupId",
             *       "lessonId": "lessonId"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetUnaccessibleLessons200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetUserPackageAssignments {
        namespace Parameters {
            export type PackageId = string;
            export type UserId = string;
        }
        export interface QueryParameters {
            userId?: Parameters.UserId;
            packageId?: Parameters.PackageId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "userPackageAssignments": [
             *     {
             *       "packageId": "packageId",
             *       "packageCategoryId": "packageCategoryId",
             *       "userId": "userId"
             *     },
             *     {
             *       "packageId": "packageId",
             *       "packageCategoryId": "packageCategoryId",
             *       "userId": "userId"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetUserPackageAssignments200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetUserSettings {
        namespace Parameters {
            export type UserId = string;
        }
        export interface PathParameters {
            userId: Parameters.UserId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "settings": {
             *     "sound": {
             *       "seVolume": 0.8008281904610115,
             *       "bgmVolume": 6.027456183070403,
             *       "narrationLanguage": "en",
             *       "serifNarrationVolume": 5.962133916683182,
             *       "hintNarrationVolume": 1.4658129805029452
             *     }
             *   }
             * }
             */
            Components.Schemas.GetUserSettings200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetUsersUserIdCodeIllusionPackages {
        namespace Parameters {
            export type UserId = string;
        }
        export interface PathParameters {
            userId: Parameters.UserId;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "codeIllusionPackage": {
             *     "level": "basic",
             *     "headerButtonText": "headerButtonText",
             *     "chapters": [
             *       {
             *         "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *         "name": "name",
             *         "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
             *         "circles": [
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           },
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           }
             *         ],
             *         "id": "id",
             *         "title": "title"
             *       },
             *       {
             *         "lessonOverViewPdfUrl": "lessonOverViewPdfUrl",
             *         "name": "name",
             *         "lessonNoteSheetsZipUrl": "lessonNoteSheetsZipUrl",
             *         "circles": [
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           },
             *           {
             *             "bookImageUrl": "bookImageUrl",
             *             "allLessonIds": [
             *               "allLessonIds",
             *               "allLessonIds"
             *             ],
             *             "course": "basic",
             *             "characterImageUrl": "characterImageUrl",
             *             "id": "id",
             *             "gemLessonIds": [
             *               "gemLessonIds",
             *               "gemLessonIds"
             *             ],
             *             "clearedCharacterImageUrl": "clearedCharacterImageUrl",
             *             "bookLessonIds": [
             *               "bookLessonIds",
             *               "bookLessonIds"
             *             ],
             *             "bookName": "bookName"
             *           }
             *         ],
             *         "id": "id",
             *         "title": "title"
             *       }
             *     ],
             *     "name": "name",
             *     "id": "id",
             *     "redirectUrlWhenAllFinished": "redirectUrlWhenAllFinished",
             *     "headerButtonLink": "headerButtonLink"
             *   }
             * }
             */
            Components.Schemas.GetUsersUserIdCodeIllusionPackages200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace GetUsersUserIdLessonStatuses {
        namespace Parameters {
            export type LessonIds = string[];
            export type UserId = string;
        }
        export interface PathParameters {
            userId: Parameters.UserId;
        }
        export interface QueryParameters {
            lessonIds?: Parameters.LessonIds;
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "userLessonStatuses": [
             *     {
             *       "correctAnsweredQuizCount": 6.027456183070403,
             *       "usedHintCount": 1.4658129805029452,
             *       "lessonId": "lessonId",
             *       "stepIdskippingDetected": true,
             *       "startedAt": "2000-01-23T04:56:07.000Z",
             *       "achievedStarCount": 0.8008281904610115,
             *       "quizCount": 5.962133916683182,
             *       "userId": "userId",
             *       "status": "not_cleared",
             *       "finishedAt": "2000-01-23T04:56:07.000Z"
             *     },
             *     {
             *       "correctAnsweredQuizCount": 6.027456183070403,
             *       "usedHintCount": 1.4658129805029452,
             *       "lessonId": "lessonId",
             *       "stepIdskippingDetected": true,
             *       "startedAt": "2000-01-23T04:56:07.000Z",
             *       "achievedStarCount": 0.8008281904610115,
             *       "quizCount": 5.962133916683182,
             *       "userId": "userId",
             *       "status": "not_cleared",
             *       "finishedAt": "2000-01-23T04:56:07.000Z"
             *     }
             *   ]
             * }
             */
            Components.Schemas.GetUsersUserIdLessonStatuses200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceDeleteAdministratorDistricts {
        export type RequestBody = /**
         *
         * example:
         * {
         *   "administratorDistricts": [
         *     {
         *       "districtId": "districtId",
         *       "userId": "userId"
         *     },
         *     {
         *       "districtId": "districtId",
         *       "userId": "userId"
         *     }
         *   ]
         * }
         */
        Components.Schemas.MaintenanceGetAdministratorDistricts200Response;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "ok": "ok"
             * }
             */
            Components.Schemas.MaintenancePutDistricts200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceDeleteStudentGroupStudents {
        export type RequestBody = /**
         *
         * example:
         * {
         *   "studentGroupStudents": [
         *     {
         *       "studentGroupId": "studentGroupId",
         *       "userId": "userId"
         *     },
         *     {
         *       "studentGroupId": "studentGroupId",
         *       "userId": "userId"
         *     }
         *   ]
         * }
         */
        Components.Schemas.MaintenanceGetStudentGroupStudents200Response;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "ok": "ok"
             * }
             */
            Components.Schemas.MaintenancePutDistricts200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceDeleteTeacherOrganizations {
        export type RequestBody = /**
         *
         * example:
         * {
         *   "teacherOrganizations": [
         *     {
         *       "organizationId": "organizationId",
         *       "userId": "userId"
         *     },
         *     {
         *       "organizationId": "organizationId",
         *       "userId": "userId"
         *     }
         *   ]
         * }
         */
        Components.Schemas.MaintenanceGetTeacherOrganizations200Response;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "ok": "ok"
             * }
             */
            Components.Schemas.MaintenancePutDistricts200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceGetAdministratorDistricts {
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "administratorDistricts": [
             *     {
             *       "districtId": "districtId",
             *       "userId": "userId"
             *     },
             *     {
             *       "districtId": "districtId",
             *       "userId": "userId"
             *     }
             *   ]
             * }
             */
            Components.Schemas.MaintenanceGetAdministratorDistricts200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceGetConstructFreeTrialAccountsForSales {
        namespace Parameters {
            export type DistrictName = string;
            export type MaxStudentCount = number;
            export type MaxTeacherCount = number;
            export type Prefix = string;
            export type StateId = string;
        }
        export interface QueryParameters {
            districtName: Parameters.DistrictName;
            stateId: Parameters.StateId;
            prefix: Parameters.Prefix;
            maxStudentCount?: Parameters.MaxStudentCount;
            maxTeacherCount?: Parameters.MaxTeacherCount;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "message"
             * }
             */
            Components.Schemas.MaintenanceGetConstructFreeTrialAccountsForSales200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceGetDistricts {
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "districts": [
             *     null,
             *     null
             *   ]
             * }
             */
            Components.Schemas.MaintenanceGetDistricts200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceGetOrganizations {
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "organizations": [
             *     null,
             *     null
             *   ]
             * }
             */
            Components.Schemas.MaintenanceGetOrganizations200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceGetStudentGroupStudents {
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "studentGroupStudents": [
             *     {
             *       "studentGroupId": "studentGroupId",
             *       "userId": "userId"
             *     },
             *     {
             *       "studentGroupId": "studentGroupId",
             *       "userId": "userId"
             *     }
             *   ]
             * }
             */
            Components.Schemas.MaintenanceGetStudentGroupStudents200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceGetStudentGroups {
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "studentGroups": [
             *     null,
             *     null
             *   ]
             * }
             */
            Components.Schemas.MaintenanceGetStudentGroups200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceGetTeacherOrganizations {
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "teacherOrganizations": [
             *     {
             *       "organizationId": "organizationId",
             *       "userId": "userId"
             *     },
             *     {
             *       "organizationId": "organizationId",
             *       "userId": "userId"
             *     }
             *   ]
             * }
             */
            Components.Schemas.MaintenanceGetTeacherOrganizations200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceGetUsers {
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "users": [
             *     null,
             *     null
             *   ]
             * }
             */
            Components.Schemas.MaintenanceGetUsers200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenanceHealthCheck {
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "message": "message"
             * }
             */
            Components.Schemas.DeleteUserPackageAssignment200Response;
            export type $500 = /**
             * example:
             * {
             *   "message": "message"
             * }
             */
            Components.Schemas.DeleteUserPackageAssignment200Response;
        }
    }
    namespace MaintenancePostAccountNotification {
        export type RequestBody = /*  */ Components.Schemas.MaintenancePostAccountNotificationRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.MaintenancePostAccountNotification200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenancePostAdministratorDistricts {
        export type RequestBody = /**
         *
         * example:
         * {
         *   "administratorDistricts": [
         *     {
         *       "districtId": "districtId",
         *       "userId": "userId"
         *     },
         *     {
         *       "districtId": "districtId",
         *       "userId": "userId"
         *     }
         *   ]
         * }
         */
        Components.Schemas.MaintenanceGetAdministratorDistricts200Response;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "ok": "ok"
             * }
             */
            Components.Schemas.MaintenancePutDistricts200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenancePostStudentGroupStudents {
        export type RequestBody = /**
         *
         * example:
         * {
         *   "studentGroupStudents": [
         *     {
         *       "studentGroupId": "studentGroupId",
         *       "userId": "userId"
         *     },
         *     {
         *       "studentGroupId": "studentGroupId",
         *       "userId": "userId"
         *     }
         *   ]
         * }
         */
        Components.Schemas.MaintenanceGetStudentGroupStudents200Response;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "ok": "ok"
             * }
             */
            Components.Schemas.MaintenancePutDistricts200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenancePostTeacherOrganizations {
        export type RequestBody = /**
         *
         * example:
         * {
         *   "teacherOrganizations": [
         *     {
         *       "organizationId": "organizationId",
         *       "userId": "userId"
         *     },
         *     {
         *       "organizationId": "organizationId",
         *       "userId": "userId"
         *     }
         *   ]
         * }
         */
        Components.Schemas.MaintenanceGetTeacherOrganizations200Response;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "ok": "ok"
             * }
             */
            Components.Schemas.MaintenancePutDistricts200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenancePostUsers {
        export type RequestBody = /*  */ Components.Schemas.MaintenancePostUsersRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "users": [
             *     null,
             *     null
             *   ]
             * }
             */
            Components.Schemas.MaintenancePostUsers200Response;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenancePutDistricts {
        export type RequestBody = /*  */ Components.Schemas.MaintenancePutDistrictsRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "ok": "ok"
             * }
             */
            Components.Schemas.MaintenancePutDistricts200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenancePutOrganizations {
        export type RequestBody = /*  */ Components.Schemas.MaintenancePutOrganizationsRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "ok": "ok"
             * }
             */
            Components.Schemas.MaintenancePutDistricts200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenancePutStudentGroups {
        export type RequestBody = /*  */ Components.Schemas.MaintenancePutStudentGroupsRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "ok": "ok"
             * }
             */
            Components.Schemas.MaintenancePutDistricts200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace MaintenancePutUsers {
        export type RequestBody = /*  */ Components.Schemas.MaintenancePutUsersRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "users": [
             *     null,
             *     null
             *   ]
             * }
             */
            Components.Schemas.MaintenanceGetUsers200Response;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace PostActionLog {
        export type RequestBody = /*  */ Components.Schemas.PostActionLogRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $401 = /*  */ Components.Schemas.GetPlayersSetting401Response;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostAdministrators {
        namespace Parameters {
            export type AdministratorIds = string[];
            export type DistrictId = string;
        }
        export interface PathParameters {
            districtId: Parameters.DistrictId;
        }
        export interface QueryParameters {
            administratorIds?: Parameters.AdministratorIds;
        }
        export type RequestBody = /*  */ Components.Schemas.PostAdministratorsRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = Components.Schemas.PostAdministrators400Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace PostClassLinkAuthenticate {
        export type RequestBody = /*  */ Components.Schemas.PostClassLinkAuthenticateRequest;
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "user": {
             *     "role": "role",
             *     "id": "id",
             *     "accessToken": "accessToken"
             *   }
             * }
             */
            Components.Schemas.PostCleverAuthenticate200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace PostCleverAuthenticate {
        export type RequestBody = /*  */ Components.Schemas.PostCleverAuthenticateRequest;
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "user": {
             *     "role": "role",
             *     "id": "id",
             *     "accessToken": "accessToken"
             *   }
             * }
             */
            Components.Schemas.PostCleverAuthenticate200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace PostDistrict {
        export type RequestBody = /*  */ Components.Schemas.PostDistrictRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostGoogleAuthenticate {
        export type RequestBody = /*  */ Components.Schemas.PostGoogleAuthenticateRequest;
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "user": {
             *     "role": "role",
             *     "id": "id",
             *     "accessToken": "accessToken"
             *   }
             * }
             */
            Components.Schemas.PostCleverAuthenticate200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace PostLessonCleared {
        export type RequestBody = /*  */ Components.Schemas.PostLessonFinishedRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "stars": {
             *     "from": {
             *       "quizAllAnswered": true,
             *       "noHintCleared": true,
             *       "cleared": true
             *     },
             *     "to": {
             *       "quizAllAnswered": true,
             *       "noHintCleared": true,
             *       "cleared": true
             *     }
             *   },
             *   "status": {
             *     "from": {
             *       "currentChapterName": "currentChapterName",
             *       "courseLevel": [
             *         {
             *           "level": 9.301444243932576,
             *           "name": "name",
             *           "requiredExp": 7.061401241503109,
             *           "label": "label",
             *           "exp": 2.3021358869347655
             *         },
             *         {
             *           "level": 9.301444243932576,
             *           "name": "name",
             *           "requiredExp": 7.061401241503109,
             *           "label": "label",
             *           "exp": 2.3021358869347655
             *         }
             *       ],
             *       "coins": 1.4658129805029452,
             *       "nickname": "nickname",
             *       "designation": {
             *         "name": "name",
             *         "rank": 5.962133916683182,
             *         "label": "label",
             *         "requiredTp": 5.637376656633329
             *       },
             *       "tp": 6.027456183070403,
             *       "totalStarNum": 0.8008281904610115
             *     },
             *     "to": {
             *       "currentChapterName": "currentChapterName",
             *       "courseLevel": [
             *         {
             *           "level": 9.301444243932576,
             *           "name": "name",
             *           "requiredExp": 7.061401241503109,
             *           "label": "label",
             *           "exp": 2.3021358869347655
             *         },
             *         {
             *           "level": 9.301444243932576,
             *           "name": "name",
             *           "requiredExp": 7.061401241503109,
             *           "label": "label",
             *           "exp": 2.3021358869347655
             *         }
             *       ],
             *       "coins": 1.4658129805029452,
             *       "nickname": "nickname",
             *       "designation": {
             *         "name": "name",
             *         "rank": 5.962133916683182,
             *         "label": "label",
             *         "requiredTp": 5.637376656633329
             *       },
             *       "tp": 6.027456183070403,
             *       "totalStarNum": 0.8008281904610115
             *     },
             *     "levelTable": {
             *       "mediaArt": {
             *         "0": 3.616076749251911
             *       },
             *       "game": {
             *         "0": 3.616076749251911
             *       },
             *       "webDesign": {
             *         "0": 3.616076749251911
             *       },
             *       "basic": {
             *         "0": 3.616076749251911
             *       }
             *     },
             *     "rankTable": {
             *       "label": {
             *         "0": "0"
             *       },
             *       "tp": {
             *         "0": 3.616076749251911
             *       }
             *     }
             *   }
             * }
             */
            Components.Schemas.PostLessonCleared200Response;
            export type $401 = /*  */ Components.Schemas.PostLessonFinished401Response;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostLessonFinished {
        export type RequestBody = /*  */ Components.Schemas.PostLessonFinishedRequest;
        namespace Responses {
            export type $200 = /*  */ Components.Schemas.PostLessonFinished200Response;
            export type $401 = /*  */ Components.Schemas.PostLessonFinished401Response;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostLessonSheetChanged {
        namespace Parameters {
            export type LessonName = string;
        }
        export interface QueryParameters {
            lessonName: Parameters.LessonName;
        }
        namespace Responses {
            export interface $200 {
            }
            export interface $500 {
            }
        }
    }
    namespace PostLogin {
        export type RequestBody = /*  */ Components.Schemas.PostLoginRequest;
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "user": {
             *     "role": "student",
             *     "id": "id",
             *     "accessToken": "accessToken"
             *   }
             * }
             */
            Components.Schemas.PostLogin200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace PostNoCredentialLogin {
        export interface RequestBody {
        }
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "user": {
             *     "role": "student",
             *     "id": "id",
             *     "accessToken": "accessToken"
             *   }
             * }
             */
            Components.Schemas.PostLogin200Response;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace PostOrganization {
        export type RequestBody = /*  */ Components.Schemas.PostOrganizationRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostQuizAnswered {
        export type RequestBody = /*  */ Components.Schemas.PostQuizAnsweredRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $401 = /*  */ Components.Schemas.GetPlayersSetting401Response;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostResetPassword {
        export type RequestBody = /*  */ Components.Schemas.PostResetPasswordRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostStepPassed {
        export type RequestBody = /*  */ Components.Schemas.PostStepPassedRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $401 = /*  */ Components.Schemas.GetPlayersSetting401Response;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostStudentGroup {
        namespace Parameters {
            export type OrganizationId = string;
        }
        export interface PathParameters {
            organizationId: Parameters.OrganizationId;
        }
        export type RequestBody = /*  */ Components.Schemas.PostStudentGroupRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostStudentGroupUnaccessibleLesson {
        namespace Parameters {
            export type LessonIds = string[];
            export type StudentGroupId = string;
        }
        export interface PathParameters {
            studentGroupId: Parameters.StudentGroupId;
        }
        export interface QueryParameters {
            lessonIds: Parameters.LessonIds;
        }
        export type RequestBody = /*  */ Components.Schemas.PostStudentGroupUnaccessibleLessonRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostStudentInStudentGroup {
        namespace Parameters {
            export type StudentGroupId = string;
            export type StudentId = string;
        }
        export interface PathParameters {
            studentGroupId: Parameters.StudentGroupId;
            studentId: Parameters.StudentId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace PostStudents {
        namespace Parameters {
            export type StudentGroupId = string;
        }
        export interface PathParameters {
            studentGroupId: Parameters.StudentGroupId;
        }
        export type RequestBody = /*  */ Components.Schemas.PostStudentsRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = Components.Schemas.PostStudents400Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace PostTeacherInOrganization {
        namespace Parameters {
            export type OrganizationId = string;
            export type TeacherId = string;
        }
        export interface PathParameters {
            organizationId: Parameters.OrganizationId;
            teacherId: Parameters.TeacherId;
        }
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostTeachers {
        namespace Parameters {
            export type OrganizationId = string;
            export type TeacherIds = string[];
        }
        export interface PathParameters {
            organizationId: Parameters.OrganizationId;
        }
        export interface QueryParameters {
            teacherIds?: Parameters.TeacherIds;
        }
        export type RequestBody = /*  */ Components.Schemas.PostTeachersRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = Components.Schemas.PostTeachers400Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace PostUserLessonStatus {
        export type RequestBody = Components.Schemas.PostUserLessonStatusRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostUserPackageAssignment {
        export type RequestBody = /**
         * UserPackageAssignment
         *
         * example:
         * {
         *   "packageId": "packageId",
         *   "packageCategoryId": "packageCategoryId",
         *   "userId": "userId"
         * }
         */
        Components.Schemas.UserPackageAssignment;
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "userPackageAssignment": {
             *     "packageId": "packageId",
             *     "packageCategoryId": "packageCategoryId",
             *     "userId": "userId"
             *   }
             * }
             */
            Components.Schemas.PostUserPackageAssignment200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
    namespace PostUserResetPasswordRequest {
        export type RequestBody = /*  */ Components.Schemas.PostUserResetPasswordRequestRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PostUserResetPasswordRequestResend {
        export type RequestBody = /*  */ Components.Schemas.PostUserResetPasswordRequestResendRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PutAdministrator {
        namespace Parameters {
            export type AdministratorId = string;
        }
        export interface PathParameters {
            administratorId: Parameters.AdministratorId;
        }
        export type RequestBody = /*  */ Components.Schemas.PutAdministratorRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PutChangePassword {
        export type RequestBody = /*  */ Components.Schemas.PutChangePasswordRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PutDistrict {
        namespace Parameters {
            export type DistrictId = string;
        }
        export interface PathParameters {
            districtId: Parameters.DistrictId;
        }
        export type RequestBody = /*  */ Components.Schemas.PutDistrictRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PutOrganization {
        namespace Parameters {
            export type OrganizationId = string;
        }
        export interface PathParameters {
            organizationId: Parameters.OrganizationId;
        }
        export type RequestBody = /*  */ Components.Schemas.PostOrganizationRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PutStudent {
        namespace Parameters {
            export type StudentId = string;
        }
        export interface PathParameters {
            studentId: Parameters.StudentId;
        }
        export type RequestBody = /*  */ Components.Schemas.PutStudentRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PutStudentGroup {
        namespace Parameters {
            export type StudentGroupId = string;
        }
        export interface PathParameters {
            studentGroupId: Parameters.StudentGroupId;
        }
        export type RequestBody = /*  */ Components.Schemas.PutStudentGroupRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace PutTeacher {
        namespace Parameters {
            export type TeacherId = string;
        }
        export interface PathParameters {
            teacherId: Parameters.TeacherId;
        }
        export type RequestBody = /*  */ Components.Schemas.PutTeacherRequest;
        namespace Responses {
            export type $200 = /**
             *
             * example:
             * {
             *   "message": "ok"
             * }
             */
            Components.Schemas.GetClasslinkRosterSync200Response;
            export type $400 = /* Error */ Components.Schemas.Error;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $409 = /* Error */ Components.Schemas.Error;
            export type $500 = /*  */ Components.Schemas.PostUserResetPasswordRequest500Response;
        }
    }
    namespace UpdateUserSoundSettings {
        namespace Parameters {
            export type UserId = string;
        }
        export interface PathParameters {
            userId: Parameters.UserId;
        }
        export type RequestBody = /**
         * UserSoundSettings
         * example:
         * {
         *   "seVolume": 0.8008281904610115,
         *   "bgmVolume": 6.027456183070403,
         *   "narrationLanguage": "en",
         *   "serifNarrationVolume": 5.962133916683182,
         *   "hintNarrationVolume": 1.4658129805029452
         * }
         */
        Components.Schemas.UserSoundSettings;
        namespace Responses {
            export type $200 = /**
             * example:
             * {
             *   "soundSettings": {
             *     "seVolume": 0.8008281904610115,
             *     "bgmVolume": 6.027456183070403,
             *     "narrationLanguage": "en",
             *     "serifNarrationVolume": 5.962133916683182,
             *     "hintNarrationVolume": 1.4658129805029452
             *   }
             * }
             */
            Components.Schemas.UpdateUserSoundSettings200Response;
            export type $401 = /* Error */ Components.Schemas.Error;
            export type $403 = /* Error */ Components.Schemas.Error;
            export type $404 = /* Error */ Components.Schemas.Error;
            export type $500 = /* Error */ Components.Schemas.Error;
        }
    }
}
