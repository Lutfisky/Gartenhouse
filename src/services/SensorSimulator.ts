
// ===========================
// src/services/SensorSimulator.ts
// ===========================

import { PlantTable, EnvironmentData, GreenhouseData } from '../types/greenhouse.types';

export class SensorSimulator {

  private logging: boolean = true;
  private environmentData: EnvironmentData[] = [];
  private currentDay = 100;
  private minuteOfTheDay: number = 0;


  constructor() {
  }

  public getCurrentDay(): number {
    return this.currentDay;
  }

  public async initialize(envData: EnvironmentData[]) {
    this.environmentData.push(...envData);
    console.log(`Loaded ${this.environmentData.length} days of environment data.`);
  }

  public async simulateAllGreenhouses(greenhouses: Map<number, GreenhouseData>) {

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
  };


  public async updateTableData(table: PlantTable, house: GreenhouseData) {
    if (table.plantSize <= 0) {  // plants are dead
      return table;
    }


    // TEMPERATURE EFFECT
    const temperature: number = table.temperature;

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
    const growthRate: number = 0.01;
    table.plantSize += growthRate;

    // Maximalgröße der Pflanze ist 100
    if (table.plantSize > 100) {
      table.plantSize = 100;
    }

    // FEUCHTIGKEIT EFFECT
    const soilMoisture: number = table.soilMoisture;

    // bei bodenfeuchtigkeit unter 50% oder über 80% wächst die Pflanze
    if(soilMoisture < 50 || soilMoisture > 80) {
      return table;
    }

    table.plantSize += 0.001;
    if (this.logging) {
      console.log(`Table ${table.position} plant size: ${table.plantSize.toFixed(3)}`);
    }
  }

  public updateTime() {
    // Update Simulationtime
    this.minuteOfTheDay++;
    if (this.minuteOfTheDay >= 1440) {
      this.minuteOfTheDay = 0;
      this.currentDay++;
    }
  }


}