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
        //   const temperature = table.temperature;
        // const soilMoisture = table.soilMoisture;
        // const watered = table.water;
        // const fertilized = table.fertilizer;
        // if (temperature > 60) {
        //   table.plantSize = 0;
        //   return table;
        // }
        // if (temperature >= 5 && temperature <= 40) {
        //   const optimalTemp = 22;
        //   const tempFactor = 1 - Math.abs(optimalTemp - temperature) / (optimalTemp - 5);
        //   let moistureFactor = 0;
        //   if (soilMoisture >= 50 && soilMoisture <= 80) {
        //     moistureFactor = 1;
        //   } else if (soilMoisture > 80) {
        //     moistureFactor = 0.8;
        //   } else {
        //     moistureFactor = 0;
        //   }
        //   let fertilizerFactor = 1;
        //   if (fertilized) {
        //     if (watered) {
        //       fertilizerFactor = 1.2;
        //     } else {
        //       table.plantSize = 0;
        //       return table;
        //     }
        //   }
        //   const growthRate = 0.01;
        //   const growth = growthRate * tempFactor * moistureFactor * fertilizerFactor;
        //   table.plantSize += growth;
        //   if (this.logging) {
        //     console.log(`Table ${table.position} growth: +${growth.toFixed(4)}, size: ${table.plantSize.toFixed(3)}`);
        //   }
        // } else {
        //   if (this.logging) {
        //     console.log(`Table ${table.position} no growth due to temperature ${temperature}°C`);
        //   }
        // }
        // if (table.plantSize > 100) {
        //   table.plantSize = 100;
        // }
        // return table;
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