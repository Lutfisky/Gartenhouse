import { Router } from 'express';
import { GreenhouseManager } from '../services/GreenhouseManager';
export declare class ApiRoutes {
    private router;
    private greenhouseManager;
    constructor(greenhouseManager: GreenhouseManager);
    private setupRoutes;
    getRouter(): Router;
}
//# sourceMappingURL=api.routes.d.ts.map