export interface Complaint {
    id: string;
    citizenId: string;
    title: string;
    description: string;
    category: 'road' | 'waste' | 'water' | 'lighting' | 'safety' | 'other';
    status: 'created' | 'triaged' | 'assigned' | 'in_progress' | 'resolved' | 'verified' | 'rejected';
    severity: 'critical' | 'high' | 'medium' | 'low';
    priorityScore: number;
    location: {
        lat: number;
        lng: number;
        address: string;
        wardId?: string;
    };
    media: Array<{
        url: string;
        type: 'before' | 'after';
        createdAt: string;
    }>;
    aiLabels?: string[];
    sentimentScore?: number;
    slaDueAt?: string;
    createdAt: string;
    updatedAt: string;
}
