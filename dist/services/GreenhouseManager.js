"use strict";
// ===========================
// src/services/GreenhouseManager.ts
// ===========================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreenhouseManager = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const sync_1 = require("csv-parse/sync");
const SensorSimulator_1 = require("./SensorSimulator");
class GreenhouseManager {
    constructor() {
        this.greenhouses = new Map();
        this.simulationInterval = null;
        this.environmentData = [];
        this.timeStep = 100; // 0,1s = 1 Minute Simulation (100ms statt 10ms um Event Loop nicht zu blockieren)
    }
    async initializeManager() {
        await this.readEnvironmentData();
        console.log('🌱 Initializing Greenhouse Manager...');
        this.sensorSimulator = new SensorSimulator_1.SensorSimulator();
        await this.sensorSimulator.initialize(this.environmentData);
        this.initializeGreenhouses(this.sensorSimulator.getCurrentDay());
        this.startSimulation();
    }
    initializeGreenhouses(aDay) {
        for (let i = 1; i <= 1; i++) { // nur 1 Gewächshaus
            const tables = [];
            // nur 1 Tisch
            for (let j = 1; j <= 1; j++) {
                let aTable = {
                    id: j,
                    position: `G${i}T${j}`,
                    temperature: 3,
                    plantSize: 2,
                    soilMoisture: 70,
                    soilFertility: 50,
                    artLight: 0,
                    water: false,
                    fertilizer: false,
                    plantedDate: aDay,
                    readyForTransport: false
                };
                tables.push(aTable);
            }
            let greenhouse = {
                id: i,
                name: `G${i}`,
                lightIntensity: 500,
                temperature: 20,
                humidity: 60,
                fan: false,
                shading: 0,
                tables: tables
            };
            this.greenhouses.set(i, greenhouse);
        }
        console.log('🌱 Initialized 1 greenhouse with 1 table');
    }
    startSimulation() {
        console.log('🔄 Start der Gewächshaus Simulation...');
        this.simulationInterval = setInterval(() => {
            try {
                this.sensorSimulator.simulateAllGreenhouses(this.greenhouses);
            }
            catch (error) {
                console.error('❌ Simulation error:', error);
            }
        }, this.timeStep);
    }
    getAllGreenhouses() {
        return Array.from(this.greenhouses.values());
    }
    getGreenhouse(id) {
        return this.greenhouses.get(id);
    }
    getTable(greenhouseId, tableId) {
        return this.greenhouses.get(greenhouseId)?.tables.find(t => t.id === tableId);
    }
    stop() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            console.log('⏹️ Greenhouse simulation stopped');
        }
    }
    async readEnvironmentData() {
        const inputData = node_fs_1.default.readFileSync('./jahresdaten2024.csv', 'utf-8');
        const records = (0, sync_1.parse)(inputData, { delimiter: ";", from_line: 2 }); // Skip header
        records.forEach((record) => {
            let envData = {
                date: new Date(),
                tavg: parseFloat(record[1].replace(",", ".")),
                tmin: parseFloat(record[2].replace(",", ".")),
                tmax: parseFloat(record[3].replace(",", ".")),
                prcp: parseFloat(record[4].replace(",", ".")),
                snow: parseFloat(record[5].replace(",", ".")),
                pres: parseFloat(record[6].replace(",", ".")),
                tsun: parseFloat(record[7].replace(",", "."))
            };
            this.environmentData.push(envData);
        });
        console.log(`🌤️ Loaded ${records.length} environment data entries`);
    }
}
exports.GreenhouseManager = GreenhouseManager;
//# sourceMappingURL=GreenhouseManager.js.map