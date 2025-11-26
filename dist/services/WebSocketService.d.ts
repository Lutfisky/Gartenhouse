import { GreenhouseManager } from './GreenhouseManager';
export declare class WebSocketService {
    private wss;
    private greenhouseManager;
    private broadcastInterval;
    private port;
    constructor(port: number, greenhouseManager: GreenhouseManager);
    private setupWebSocket;
    private startBroadcast;
    private sendDataToClient;
    private broadcastToAllClients;
    stop(): void;
}
//# sourceMappingURL=WebSocketService.d.ts.map