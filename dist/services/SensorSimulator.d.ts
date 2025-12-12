import { PlantTable, EnvironmentData, GreenhouseData } from '../types/greenhouse.types';
export declare class SensorSimulator {
    private environmentData;
    private currentDay;
    private minuteOfTheDay;
    getCurrentDay(): number;
    initialize(envData: EnvironmentData[]): Promise<void>;
    simulateAllGreenhouses(greenhouses: Map<number, GreenhouseData>): Promise<void>;
    updateTableData(table: PlantTable, house: GreenhouseData): Promise<void>;
    private updateTime;
}
//# sourceMappingURL=SensorSimulator.d.ts.map