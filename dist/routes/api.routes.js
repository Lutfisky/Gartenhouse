"use strict";
// ===========================
// src/routes/api.routes.ts
// ===========================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRoutes = void 0;
const express_1 = require("express");
class ApiRoutes {
    constructor(greenhouseManager) {
        this.router = (0, express_1.Router)();
        this.greenhouseManager = greenhouseManager;
        this.setupRoutes();
    }
    setupRoutes() {
        // GET /api/greenhouses - All greenhouses overview
        this.router.get('/greenhouses', (req, res) => {
            try {
                const greenhouses = this.greenhouseManager.getAllGreenhouses();
                const response = {
                    success: true,
                    data: greenhouses,
                    timestamp: new Date().toISOString()
                };
                res.json(response);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    data: null,
                    timestamp: new Date().toISOString(),
                    error: 'Failed to fetch greenhouses'
                });
            }
        });
        // GET /api/greenhouses/:id/sensors - Specific greenhouse sensors
        this.router.get('/greenhouses/:id/sensors', (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const greenhouse = this.greenhouseManager.getGreenhouse(id);
                if (!greenhouse) {
                    return res.status(404).json({
                        success: false,
                        data: null,
                        timestamp: new Date().toISOString(),
                        error: 'Greenhouse not found'
                    });
                }
                const response = {
                    success: true,
                    data: greenhouse,
                    timestamp: new Date().toISOString()
                };
                res.json(response);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    data: null,
                    timestamp: new Date().toISOString(),
                    error: 'Failed to fetch greenhouse sensors'
                });
            }
        });
        // GET /api/tables/:greenhouseId/:tableId - Specific table data
        this.router.get('/tables/:greenhouseId/:tableId', (req, res) => {
            try {
                const greenhouseId = parseInt(req.params.greenhouseId);
                const tableId = parseInt(req.params.tableId);
                const table = this.greenhouseManager.getTable(greenhouseId, tableId);
                if (!table) {
                    return res.status(404).json({
                        success: false,
                        data: null,
                        timestamp: new Date().toISOString(),
                        error: 'Table not found'
                    });
                }
                const response = {
                    success: true,
                    data: table,
                    timestamp: new Date().toISOString()
                };
                res.json(response);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    data: null,
                    timestamp: new Date().toISOString(),
                    error: 'Failed to fetch table data'
                });
            }
        });
        // GET /api/health - Health check endpoint
        this.router.get('/health', (req, res) => {
            res.json({
                success: true,
                data: {
                    status: 'healthy',
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    timestamp: new Date().toISOString()
                },
                timestamp: new Date().toISOString()
            });
        });
        // POST /api/actuators - Steuerung von Aktoren
        this.router.post('/actuators', (req, res) => {
            try {
                const { greenhouseId, tableId, actuator, value } = req.body;
                const gh = this.greenhouseManager.getGreenhouse(Number(greenhouseId));
                if (!gh) {
                    return res.status(404).json({
                        success: false,
                        data: null,
                        timestamp: new Date().toISOString(),
                        error: 'Greenhouse not found'
                    });
                }
                if (tableId) {
                    const table = this.greenhouseManager.getTable(Number(greenhouseId), Number(tableId));
                    if (!table) {
                        return res.status(404).json({
                            success: false,
                            data: null,
                            timestamp: new Date().toISOString(),
                            error: 'Table not found'
                        });
                    }
                    switch (actuator) {
                        case 'led':
                            table.artLight = value;
                            break;
                        case 'wpump':
                            table.water = Boolean(value);
                            break;
                        case 'fertil':
                            table.fertilizer = Boolean(value);
                            break;
                    }
                }
                else {
                    switch (actuator) {
                        case 'fan':
                            gh.fan = Boolean(value);
                            break;
                        case 'shading':
                            gh.shading = value;
                            break;
                    }
                }
                const response = {
                    success: true,
                    data: null,
                    timestamp: new Date().toISOString()
                };
                res.json(response);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    data: null,
                    timestamp: new Date().toISOString(),
                    error: 'Failed to set actuator'
                });
            }
        });
    }
    getRouter() {
        return this.router;
    }
}
exports.ApiRoutes = ApiRoutes;
//# sourceMappingURL=api.routes.js.map