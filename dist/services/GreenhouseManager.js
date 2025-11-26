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
        this.timeStep = 100; // zu Testzwecken 10 oder 1 statt 100 
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
        for (let i = 1; i <= 4; i++) {
            const tables = [];
            // Create 8 tables per greenhouse
            for (let j = 1; j <= 8; j++) {
                let aTable = {
                    id: j,
                    position: `G${i}T${j}`,
                    temperature: 20,
                    plantSize: 10,
                    soilMoisture: 80,
                    soilFertility: 100,
                    artLight: 0,
                    water: false,
                    fertilizer: false,
                    plantedDate: aDay
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
                shading: 0, // 0-100%
                tables: tables
            };
            this.greenhouses.set(i, greenhouse);
        }
        console.log('🌱 Initialized 4 greenhouses with 8 tables each');
    }
    startSimulation() {
        console.log('🔄 Start der Gewächshaus Simulation...');
        // Simulationsschritt: 0,1 Sekunden - entspricht 1 Minute in der Realität
        this.simulationInterval = setInterval(() => {
            this.sensorSimulator.simulateAllGreenhouses(this.greenhouses);
        }, this.timeStep);
    }
    getAllGreenhouses() {
        return Array.from(this.greenhouses.values());
    }
    getGreenhouse(id) {
        return this.greenhouses.get(id);
    }
    getTable(greenhouseId, tableId) {
        const greenhouse = this.greenhouses.get(greenhouseId);
        return greenhouse?.tables.find(table => table.id === tableId);
    }
    stop() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            console.log('⏹️ Greenhouse simulation stopped');
        }
    }
    async readEnvironmentData() {
        let inputData = node_fs_1.default.readFileSync('./jahresdaten2024.csv', 'utf-8');
        const records = (0, sync_1.parse)(inputData, {
            delimiter: ";",
        });
        records.forEach(async (record) => {
            //date,tavg,tmin,tmax,prcp,snow,pres,tsun
            let envData = {
                date: new Date(), tavg: 0, tmin: 0, tmax: 0, prcp: 0,
                snow: 0, pres: 0, tsun: 0
            };
            let dateStr = record[0].slice(0, 10);
            let parts = dateStr.split(".");
            envData.date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
            envData.tavg = parseFloat(record[1].replace(",", "."));
            envData.tmin = parseFloat(record[2].replace(",", "."));
            envData.tmax = parseFloat(record[3].replace(",", "."));
            envData.prcp = parseFloat(record[4].replace(",", "."));
            envData.snow = parseFloat(record[5].replace(",", "."));
            envData.pres = parseFloat(record[6].replace(",", "."));
            envData.tsun = parseFloat(record[7].replace(",", "."));
            this.environmentData.push(envData);
        });
        console.log(`🌤️ Loaded ${records.length} environment data entries`);
    }
}
exports.GreenhouseManager = GreenhouseManager;
//# sourceMappingURL=GreenhouseManager.js.map