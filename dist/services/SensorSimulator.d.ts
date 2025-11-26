import { PlantTable, EnvironmentData, GreenhouseData } from '../types/greenhouse.types';
export declare class SensorSimulator {
    private logging;
    private environmentData;
    private currentDay;
    private minuteOfTheDay;
    constructor();
    getCurrentDay(): number;
    initialize(envData: EnvironmentData[]): Promise<void>;
    simulateAllGreenhouses(greenhouses: Map<number, GreenhouseData>): Promise<void>;
    updateTableData(table: PlantTable, house: GreenhouseData): Promise<PlantTable | undefined>;
    updateTime(): void;
}
//# sourceMappingURL=SensorSimulator.d.ts.map