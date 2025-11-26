"use strict";
// ===========================
// src/server.ts
// ===========================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const GreenhouseManager_1 = require("./services/GreenhouseManager");
const api_routes_1 = require("./routes/api.routes");
const WebSocketService_1 = require("./services/WebSocketService");
class GreenhouseServer {
    constructor() {
        this.port = parseInt(process.env.PORT || '3000');
        this.wsPort = parseInt(process.env.WS_PORT || '3001');
        this.app = (0, express_1.default)();
        this.greenhouseManager = new GreenhouseManager_1.GreenhouseManager();
        this.greenhouseManager.initializeManager();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)());
        this.app.use((0, morgan_1.default)('combined'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    setupRoutes() {
        // API routes
        const apiRoutes = new api_routes_1.ApiRoutes(this.greenhouseManager);
        this.app.use('/api', apiRoutes.getRouter());
        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                message: 'Greenhouse Simulation Server',
                version: '1.0.0',
                endpoints: {
                    greenhouses: '/api/greenhouses',
                    specific_greenhouse: '/api/greenhouses/:id/sensors',
                    specific_table: '/api/tables/:greenhouseId/:tableId',
                    health: '/api/health',
                    websocket: `ws://localhost:${this.wsPort}`
                },
                timestamp: new Date().toISOString()
            });
        });
    }
    setupWebSocket() {
        this.webSocketService = new WebSocketService_1.WebSocketService(this.wsPort, this.greenhouseManager);
    }
    setupErrorHandling() {
        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                data: null,
                timestamp: new Date().toISOString(),
                error: 'Endpoint not found'
            });
        });
        // Global error handler
        this.app.use((err, req, res, next) => {
            console.error('❌ Unhandled error:', err);
            res.status(500).json({
                success: false,
                data: null,
                timestamp: new Date().toISOString(),
                error: 'Internal server error'
            });
        });
    }
    start() {
        this.app.listen(this.port, () => {
            console.log('🚀 ==========================================');
            console.log('🌱 GREENHOUSE SIMULATION SERVER STARTED');
            console.log('🚀 ==========================================');
            console.log(`🌐 HTTP Server running on: http://localhost:${this.port}`);
            console.log(`🔌 WebSocket Server running on: ws://localhost:${this.wsPort}`);
            console.log('📊 API Endpoints:');
            console.log(`   GET  /api/greenhouses`);
            console.log(`   GET  /api/greenhouses/:id/sensors`);
            console.log(`   GET  /api/tables/:greenhouseId/:tableId`);
            console.log(`   GET  /api/health`);
            console.log('🔄 Simulation running every 30 seconds');
            console.log('🚀 ==========================================');
        });
        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down server...');
            this.greenhouseManager.stop();
            this.webSocketService.stop();
            process.exit(0);
        });
        process.on('SIGTERM', () => {
            console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
            this.greenhouseManager.stop();
            this.webSocketService.stop();
            process.exit(0);
        });
    }
}
// Start the server
const server = new GreenhouseServer();
server.start();
//# sourceMappingURL=server.js.map