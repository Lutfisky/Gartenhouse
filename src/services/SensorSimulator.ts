// ===========================
// src/services/SensorSimulator.ts
// ===========================

import { PlantTable, EnvironmentData, GreenhouseData } from '../types/greenhouse.types';

export class SensorSimulator {
  private environmentData: EnvironmentData[] = [];
  private currentDay = 0;
  private minuteOfTheDay: number = 0;

  public getCurrentDay(): number {
    return this.currentDay;
  }

  public async initialize(envData: EnvironmentData[]) {
    this.environmentData.push(...envData);
    console.log(`Loaded ${this.environmentData.length} days of environment data.`);
  }

  public async simulateAllGreenhouses(greenhouses: Map<number, GreenhouseData>) {
    const env = this.environmentData[this.currentDay % this.environmentData.length];

    greenhouses.forEach((house) => {
      // 🌞 Licht und Temperatur
      house.lightIntensity = (env?.tsun ?? 500) * (1 - house.shading / 100);
      house.temperature += (house.lightIntensity / 500) * 3;

      // 🌬️ Lüftung
      if (house.fan && this.minuteOfTheDay % 30 === 0) {
        house.temperature = env.tavg;
        house.humidity = Math.min(85, env.pres); // vereinfachte Luftfeuchte
      }

      // Luftfeuchte Limit
      if (house.humidity > 85) house.humidity = 85;

      house.tables.forEach(table => this.updateTableData(table, house));
    });

    this.updateTime();
  }

  public async updateTableData(table: PlantTable, house: GreenhouseData) {
    if (table.plantSize <= 0) return;

    // 💡 LED erhöht Temperatur
    table.temperature = house.temperature + table.artLight * 0.002;

    // 🚿 Bewässerung
    if (table.water) {
      table.soilMoisture = Math.min(100, table.soilMoisture + 5);
      if (table.fertilizer) table.soilFertility = Math.min(120, table.soilFertility + 20);
    } else {
      // Austrocknung abhängig von LF
      if (house.humidity < 80) {
        const diff = table.soilMoisture - house.humidity;
        table.soilMoisture -= diff / 600; // pro Minute
      }
    }

    // Düngerabbau
    if (this.minuteOfTheDay % 10 === 0 && table.soilFertility > 0) {
      table.soilFertility -= 1;
    }

    // Überdüngung
    if (table.soilFertility > 100) {
      table.plantSize = 0;
      return;
    }

    // ❌ Pflanzen sterben bei Hitze
    if (table.temperature > 60) {
      table.plantSize = 0;
      return;
    }

    // Kein Wachstum bei falscher Temperatur
    if (table.temperature < 5 || table.temperature > 40) return;

    // 🌱 Wachstum
    let growth = 0.01;
    if (table.soilMoisture >= 50 && table.soilMoisture <= 80) growth += 0.005;
    if (table.soilFertility >= 50) growth += 0.003;
    if (table.artLight > 500) growth += 0.005;

    table.plantSize = Math.min(200, table.plantSize + growth);

    // Transportbedingungen
    table.readyForTransport = table.plantSize >= 30 && table.soilMoisture <= 50;

    // Nachpflanzung
    if (table.plantSize <= 5) {
      table.plantSize = 2;
      table.soilMoisture = 70;
      table.soilFertility = 50;
    }
  }

  private updateTime() {
    this.minuteOfTheDay++;
    if (this.minuteOfTheDay >= 1440) {
      this.minuteOfTheDay = 0;
      this.currentDay++;
      console.log(`📅 Simulation Day ${this.currentDay}`);
    }
  }
}
