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
        // TEMPERATURE EFFECT
        const temperature = table.temperature;
        // bei 60 Grad sterben die Pflanzen sofort ab
        if (temperature > 60) {
            table.plantSize = 0;
            return table;
        }
        // bei unter 5 Grad oder über 40 Grad wächst die Pflanze nicht
        if (temperature < 5 || temperature > 40) {
            return table;
        }
        // bei optimalen Bedingungen wächst die Pflanze schneller
        const growthRate = 0.01;
        table.plantSize += growthRate;
        // Maximalgröße der Pflanze ist 100
        if (table.plantSize > 100) {
            table.plantSize = 100;
        }
        // FEUCHTIGKEIT EFFECT
        const soilMoisture = table.soilMoisture;
        // bei bodenfeuchtigkeit unter 50% oder über 80% wächst die Pflanze
        if (soilMoisture < 50 || soilMoisture > 80) {
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