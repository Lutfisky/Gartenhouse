// ===========================
// src/services/GreenhouseManager.ts
// ===========================

import fs from "node:fs";
import { parse } from "csv-parse/sync";

import { EnvironmentData, GreenhouseData, PlantTable } from '../types/greenhouse.types';
import { SensorSimulator } from './SensorSimulator';

export class GreenhouseManager {
  private greenhouses: Map<number, GreenhouseData> = new Map();
  private sensorSimulator: SensorSimulator;
  private simulationInterval: NodeJS.Timeout | null = null;
  private environmentData: EnvironmentData[] = [];
  private timeStep: number = 100;  // 0,1s = 1 Minute Simulation (100ms statt 10ms um Event Loop nicht zu blockieren)

  constructor() {}

  public async initializeManager() {
    await this.readEnvironmentData();
    console.log('🌱 Initializing Greenhouse Manager...');
    this.sensorSimulator = new SensorSimulator();
    await this.sensorSimulator.initialize(this.environmentData);
    this.initializeGreenhouses(this.sensorSimulator.getCurrentDay());
    this.startSimulation();
  }

  private initializeGreenhouses(aDay: number): void {
  for (let i = 1; i <= 1; i++) {   // nur 1 Gewächshaus
    const tables: PlantTable[] = [];

    // nur 1 Tisch
    for (let j = 1; j <= 1; j++) {
      let aTable: PlantTable = {
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

    let greenhouse: GreenhouseData = {
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

  private startSimulation(): void {
    console.log('🔄 Start der Gewächshaus Simulation...');
    this.simulationInterval = setInterval(() => {
      try {
        this.sensorSimulator.simulateAllGreenhouses(this.greenhouses);
      } catch (error) {
        console.error('❌ Simulation error:', error);
      }
    }, this.timeStep);
  }

  public getAllGreenhouses(): GreenhouseData[] {
    return Array.from(this.greenhouses.values());
  }

  public getGreenhouse(id: number): GreenhouseData | undefined {
    return this.greenhouses.get(id);
  }

  public getTable(greenhouseId: number, tableId: number): PlantTable | undefined {
    return this.greenhouses.get(greenhouseId)?.tables.find(t => t.id === tableId);
  }

  public stop(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      console.log('⏹️ Greenhouse simulation stopped');
    }
  }

  private async readEnvironmentData() {
    const inputData = fs.readFileSync('./jahresdaten2024.csv', 'utf-8');
    const records = parse(inputData, { delimiter: ";", from_line: 2 }); // Skip header

    records.forEach((record) => {
      let envData: EnvironmentData = {
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
