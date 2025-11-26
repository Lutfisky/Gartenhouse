"use strict";
// ===========================
// src/services/SensorSimulator.ts
// ===========================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorSimulator = void 0;
class SensorSimulator {
    constructor() {
        this.logging = true;
        this.environmentData = [];
        this.currentDay = 100;
        this.minuteOfTheDay = 0;
    }
    getCurrentDay() {
        return this.currentDay;
    }
    async initialize(envData) {
        this.environmentData.push(...envData);
        console.log(`Loaded ${this.environmentData.length} days of environment data.`);
    }
    async simulateAllGreenhouses(greenhouses) {
        // Update Greenhouse data
        greenhouses.forEach((greenhouse) => {
            greenhouse.tables.forEach(table => {
                this.updateTableData(table, greenhouse);
            });
        });
        this.minuteOfTheDay++;
        if (this.minuteOfTheDay >= 1440) {
            this.minuteOfTheDay = 0;
            this.currentDay++;
            console.log(`Day ${this.currentDay.toFixed(1)}.`);
        }
    }
    ;
    async updateTableData(table, house) {
        if (table.plantSize <= 0) { // plants are dead
            return table;
        }
        table.plantSize += 0.001;
        if (this.logging) {
            console.log(`Table ${table.position} plant size: ${table.plantSize.toFixed(3)}`);
        }
    }
    updateTime() {
        // Update Simulationtime
        this.minuteOfTheDay++;
        if (this.minuteOfTheDay >= 1440) {
            this.minuteOfTheDay = 0;
            this.currentDay++;
        }
    }
}
exports.SensorSimulator = SensorSimulator;
//# sourceMappingURL=SensorSimulator.js.map