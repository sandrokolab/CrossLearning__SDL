import type { Strategy } from '@/types';

export function getStringValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

export function getStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function isStrategyComplete(strategy: Partial<Strategy> | Record<string, unknown>) {
  const businessProblem = getStringValue(strategy.businessProblem);
  const targetAudience = getStringValue(strategy.targetAudience);
  const qualitativeObjective = getStringValue(strategy.qualitativeObjective);

  return businessProblem.trim().length > 0 && targetAudience.trim().length > 0 && qualitativeObjective.trim().length > 0;
}
