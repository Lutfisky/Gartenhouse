export interface EnvironmentData {
    date: Date;
    tavg: number;
    tmin: number;
    tmax: number;
    prcp: number;
    snow: number;
    pres: number;
    tsun: number;
}
export interface PlantTableStorage {
    id: number;
    temperature: number;
    plantSize: number;
    soilMoisture: number;
    timestamp: Date;
}
export interface PlantTable {
    id: number;
    position: string;
    plantSize: number;
    temperature: number;
    soilMoisture: number;
    soilFertility: number;
    artLight: number;
    water: boolean;
    fertilizer: boolean;
    plantedDate: number;
}
export interface GreenhouseData {
    id: number;
    name: string;
    lightIntensity: number;
    temperature: number;
    humidity: number;
    fan: boolean;
    shading: number;
    tables: PlantTable[];
}
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
    metadata?: any;
}
//# sourceMappingURL=greenhouse.types.d.ts.map