import { GreenhouseData, PlantTable } from '../types/greenhouse.types';
export declare class GreenhouseManager {
    private greenhouses;
    private sensorSimulator;
    private simulationInterval;
    private environmentData;
    private timeStep;
    constructor();
    initializeManager(): Promise<void>;
    private initializeGreenhouses;
    private startSimulation;
    getAllGreenhouses(): GreenhouseData[];
    getGreenhouse(id: number): GreenhouseData | undefined;
    getTable(greenhouseId: number, tableId: number): PlantTable | undefined;
    stop(): void;
    private readEnvironmentData;
}
//# sourceMappingURL=GreenhouseManager.d.ts.map