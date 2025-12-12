"use strict";
// ===========================
// src/services/SensorSimulator.ts
// ===========================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorSimulator = void 0;
class SensorSimulator {
    constructor() {
        this.environmentData = [];
        this.currentDay = 0;
        this.minuteOfTheDay = 0;
    }
    getCurrentDay() {
        return this.currentDay;
    }
    async initialize(envData) {
        this.environmentData.push(...envData);
        console.log(`🌤️ Loaded ${this.environmentData.length} days of environment data.`);
    }
    async simulateAllGreenhouses(greenhouses) {
        const env = this.environmentData[this.currentDay % this.environmentData.length];
        // Fallback wenn keine Umweltdaten vorhanden
        if (!env) {
            console.error('❌ No environment data available');
            return;
        }
        greenhouses.forEach((house) => {
            // Temperatur und Luftfeuchte aus Umweltdaten setzen
            house.temperature = env.tavg || 20;
            // CSV pres ist Luftdruck, daher nehmen wir realistische LF: wenn plausibel (<150) sonst 40%
            house.humidity = env.pres && env.pres < 150 ? env.pres : 40;
            // Lichtintensität berechnen
            house.lightIntensity = (env.tsun || 500) * (1 - house.shading / 100);
            // Temperaturanstieg durch Licht: Pro 500 Lumen +3°C, plus Tagesgang (+/-5°C)
            const tempVariation = Math.sin((2 * Math.PI * this.minuteOfTheDay) / 1440) * 5;
            house.temperature += (house.lightIntensity / 500) * 3 + tempVariation;
            // Lüftung: Nach 30 Minuten Außentemperatur und -luftfeuchte
            if (house.fan && this.minuteOfTheDay % 30 === 0) {
                house.temperature = env.tavg || 20;
                house.humidity = Math.min(85, env.pres && env.pres < 150 ? env.pres : 40);
            }
            // Luftfeuchte max 85%
            if (house.humidity > 85)
                house.humidity = 85;
            house.tables.forEach(table => this.updateTableData(table, house));
        });
        this.updateTime();
    }
    async updateTableData(table, house) {
        if (table.plantSize <= 0)
            return;
        if (table.position === 'G1T1') {
            table.temperature = 61;
        }
        else {
            // Temperatur für Tisch berechnen
            table.temperature = house.temperature + ((table.artLight || 0) / 500) * 3;
        }
        // Bewässerung
        if (table.water) {
            // Pro Minute +5% Bodenfeuchte
            table.soilMoisture = Math.min(100, table.soilMoisture + 5);
        }
        else {
            // Verdunstung: Bei >80% LF kein Austrocknen, sonst 1/10 der Differenz (BF-LF) pro Stunde
            // Pro Minute = 1/60 der stündlichen Rate; nur wenn Boden feuchter als Luft
            if (house.humidity < 80 && table.soilMoisture > house.humidity) {
                const diff = table.soilMoisture - house.humidity;
                const tempFactor = 1 + Math.max(0, (table.temperature - 20) / 20); // wärmer -> schnelleres Trocknen
                const hourlyEvaporation = (diff / 10) * tempFactor;
                const minuteEvaporation = hourlyEvaporation / 60;
                table.soilMoisture = Math.max(0, table.soilMoisture - minuteEvaporation);
            }
            // Zusätzliche Trocknung, wenn Pflanze groß genug für Transport ist, damit BF ≤ 50 erreicht wird
            if (table.plantSize >= 30 && table.soilMoisture > 50) {
                // aggressiver trocknen: bis zu 2% pro Minute, aber nur bis 50%
                const extraDry = Math.min(2, table.soilMoisture - 50);
                table.soilMoisture = Math.max(0, table.soilMoisture - extraDry);
            }
        }
        // Düngung: Nach 5 Minuten 100% erreicht = +20% pro Minute
        if (table.fertilizer && table.water) {
            table.soilFertility = Math.min(120, table.soilFertility + 20);
        }
        // Düngerabbau
        if (this.minuteOfTheDay % 10 === 0 && table.soilFertility > 0) {
            table.soilFertility -= 1;
        }
        // Überdüngung
        if (table.soilFertility > 100) {
            table.plantSize = 0;
            console.log(`☠️ Plant at ${table.position} died due to overfertilization`);
            return;
        }
        // Pflanzen sterben bei Hitze
        if (table.temperature > 60) {
            table.plantSize = 0;
            console.log(`🔥 Plant at ${table.position} died due to heat`);
            // 🌱 Sofortige Nachpflanzung
            table.plantSize = 2;
            table.soilMoisture = 70;
            table.soilFertility = 50;
            console.log(`🌱 Table ${table.position} replanted with seedlings`);
            return;
        }
        // Kein Wachstum bei falscher Temperatur
        if (table.temperature < 5 || table.temperature > 40) {
            console.log(`⏸️ ${table.position} growth paused: ${table.temperature.toFixed(1)}°C outside 5-40°C`);
            return;
        }
        // Wachstum (deutlich erhöht für sichtbare Änderungen)
        let growth = 0.1; // Basis-Wachstum erhöht
        if (table.soilMoisture >= 50 && table.soilMoisture <= 80)
            growth += 0.05;
        if (table.soilFertility >= 50)
            growth += 0.03;
        if (table.artLight > 500)
            growth += 0.05;
        table.plantSize = Math.min(200, table.plantSize + growth);
        // Transportbedingungen
        table.readyForTransport = table.plantSize >= 30 && table.soilMoisture <= 50;
        // Versand: Wenn bereit, ausliefern und neu bepflanzen
        if (table.readyForTransport) {
            console.log(`📦 ${table.position} shipped for transport`);
            table.plantSize = 2;
            table.soilMoisture = 70;
            table.soilFertility = 50;
            table.readyForTransport = false;
            return; // Skip remaining logs for old plant
        }
        // Nachpflanzung (nur wenn Pflanze wirklich tot ist)
        if (table.plantSize <= 1) {
            table.plantSize = 2;
            table.soilMoisture = 70;
            table.soilFertility = 50;
            console.log(`🌱 Table ${table.position} replanted with seedlings`);
        }
        // 👉 LOGGING aller Werte
        console.log(`📊 ${table.position} | Size: ${table.plantSize.toFixed(2)}cm | ` +
            `Moisture: ${table.soilMoisture.toFixed(1)}% | Fertility: ${table.soilFertility.toFixed(1)}% | ` +
            `Temp: ${table.temperature.toFixed(1)}°C | Transport: ${table.readyForTransport}`);
    }
    updateTime() {
        this.minuteOfTheDay++;
        if (this.minuteOfTheDay % 60 === 0) {
            // Async logging to prevent event loop blocking
            process.nextTick(() => {
                console.log(`🕒 Simulated hour passed: ${this.minuteOfTheDay / 60}h`);
            });
        }
        if (this.minuteOfTheDay >= 1440) {
            this.minuteOfTheDay = 0;
            this.currentDay++;
            process.nextTick(() => {
                console.log(`📅 Simulation Day ${this.currentDay}`);
            });
        }
    }
}
exports.SensorSimulator = SensorSimulator;
//# sourceMappingURL=SensorSimulator.js.map