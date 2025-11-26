"use strict";
// ===========================
// src/services/WebSocketService.ts
// ===========================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const ws_1 = __importDefault(require("ws"));
class WebSocketService {
    constructor(port, greenhouseManager) {
        this.broadcastInterval = null;
        this.greenhouseManager = greenhouseManager;
        this.port = port;
        this.wss = new ws_1.default.Server({ port });
        this.setupWebSocket();
        this.startBroadcast();
    }
    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('🔌 New WebSocket connection established');
            // Send current data immediately
            this.sendDataToClient(ws);
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    console.log('📨 Received message:', data);
                    // Handle different message types
                    if (data.type === 'subscribe') {
                        // Client wants to subscribe to specific greenhouse
                        ws.send(JSON.stringify({
                            type: 'subscription_confirmed',
                            greenhouse_id: data.greenhouse_id,
                            timestamp: new Date().toISOString()
                        }));
                    }
                }
                catch (error) {
                    console.error('❌ Error parsing WebSocket message:', error);
                }
            });
            ws.on('close', () => {
                console.log('🔌 WebSocket connection closed');
            });
            ws.on('error', (error) => {
                console.error('❌ WebSocket error:', error);
            });
        });
        console.log(`🌐 WebSocket server listening on port ${this.port}`);
    }
    startBroadcast() {
        // Broadcast updates every 30 seconds
        this.broadcastInterval = setInterval(() => {
            this.broadcastToAllClients();
        }, 30000);
    }
    sendDataToClient(ws) {
        if (ws.readyState === ws_1.default.OPEN) {
            const data = {
                type: 'sensor_update',
                data: this.greenhouseManager.getAllGreenhouses(),
                timestamp: new Date().toISOString()
            };
            ws.send(JSON.stringify(data));
        }
    }
    broadcastToAllClients() {
        const data = {
            type: 'sensor_update',
            data: this.greenhouseManager.getAllGreenhouses(),
            timestamp: new Date().toISOString()
        };
        const message = JSON.stringify(data);
        let clientCount = 0;
        this.wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(message);
                clientCount++;
            }
        });
        if (clientCount > 0) {
            console.log(`📡 Broadcasted sensor data to ${clientCount} clients`);
        }
    }
    stop() {
        if (this.broadcastInterval) {
            clearInterval(this.broadcastInterval);
        }
        this.wss.close();
        console.log('🔌 WebSocket service stopped');
    }
}
exports.WebSocketService = WebSocketService;
//# sourceMappingURL=WebSocketService.js.map