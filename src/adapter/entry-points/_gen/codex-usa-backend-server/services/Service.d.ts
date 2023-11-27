export = Service;
declare class Service {
    static rejectResponse(error: any, code?: number): {
        error: any;
        code: number;
    };
    static successResponse(payload: any, code?: number): {
        payload: any;
        code: number;
    };
}
