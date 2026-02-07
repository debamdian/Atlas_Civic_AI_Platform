export interface AIAnalysisResult {
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'pothole' | 'garbage' | 'water' | 'electricity' | 'other';
    priorityScore: number;
    summary: string;
}

import { DEFAULT_POLICY } from '../models/policyModel';

export const analyzeComplaint = async (title: string, description: string): Promise<AIAnalysisResult> => {
    // Mock AI Logic
    // In a real scenario, this would call Google Gemini API

    const text = (title + " " + description).toLowerCase();

    let severity: AIAnalysisResult['severity'] = 'medium';
    let category: AIAnalysisResult['category'] = 'other';
    let priorityScore = 50;

    // Use Policy Weights
    const weights = DEFAULT_POLICY.severityWeights;

    // Simple keyword matching for mock
    if (text.includes('urgent') || text.includes('danger') || text.includes('fire')) {
        severity = 'critical';
        priorityScore = weights.critical;
    } else if (text.includes('accident') || text.includes('blocked')) {
        severity = 'high';
        priorityScore = weights.high;
    } else {
        priorityScore = weights.medium;
    }
    // Adjust for sensitive/fairness (Mock logic)
    // priorityScore *= DEFAULT_POLICY.sensitiveLocationWeight;

    if (text.includes('pothole') || text.includes('road')) category = 'pothole';
    else if (text.includes('garbage') || text.includes('trash')) category = 'garbage';
    else if (text.includes('water') || text.includes('leak')) category = 'water';
    else if (text.includes('electric') || text.includes('power')) category = 'electricity';

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        severity,
        category,
        priorityScore,
        summary: `AI Analysis: Identified as ${severity} severity ${category} issue.`
    };
};
