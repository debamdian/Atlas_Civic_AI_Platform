export interface Policy {
    id: string; // usually 'default' or tenant-specific
    severityWeights: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    distanceWeight: number;    // e.g. 0.5 (km)
    frequencyWeight: number;   // e.g. 1.2 (boost for recurring)
    sensitiveLocationWeight: number; // e.g. 1.5 (schools/hospitals)
    fairnessWeight: number;    // e.g. 1.1 (boost for ignored areas)
    createdAt: string;
    updatedAt: string;
}

export const DEFAULT_POLICY: Omit<Policy, 'id' | 'createdAt' | 'updatedAt'> = {
    severityWeights: {
        critical: 100,
        high: 50,
        medium: 20,
        low: 5
    },
    distanceWeight: 10,
    frequencyWeight: 1.5,
    sensitiveLocationWeight: 2.0,
    fairnessWeight: 1.2
};
