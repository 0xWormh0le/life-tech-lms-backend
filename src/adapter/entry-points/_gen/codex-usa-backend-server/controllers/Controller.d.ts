export = Controller;
declare class Controller {
    static sendResponse(response: any, payload: any): void;
    static sendError(response: any, error: any): void;
    /**
    * Files have been uploaded to the directory defined by config.js as upload directory
    * Files have a temporary name, that was saved as 'filename' of the file object that is
    * referenced in request.files array.
    * This method finds the file and changes it to the file name that was originally called
    * when it was uploaded. To prevent files from being overwritten, a timestamp is added between
    * the filename and its extension
    * @param request
    * @param fieldName
    * @returns {string}
    */
    static collectFile(request: any, fieldName: any): string;
    static getRequestBodyName(request: any): any;
    static collectRequestParams(request: any): {};
    static handleRequest(request: any, response: any, serviceOperation: any): Promise<void>;
}
