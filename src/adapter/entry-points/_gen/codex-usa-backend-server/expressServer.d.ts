export = ExpressServer;
declare class ExpressServer {
    constructor(port: any, openApiYaml: any);
    port: any;
    app: import("express-serve-static-core").Express;
    openApiPath: any;
    schema: any;
    setupMiddleware(): void;
    launch(): void;
    close(): Promise<void>;
}
