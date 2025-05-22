
import { TemplateSectionType } from '../types';

/**
 * Converts database JSON to the expected Record<string, string[]> format
 */
export const convertToVariablesRecord = (dbVariables: any): Record<string, string[]> => {
  if (!dbVariables) return {};
  
  // If it's already an object with the right structure
  if (typeof dbVariables === 'object' && !Array.isArray(dbVariables)) {
    const result: Record<string, string[]> = {};
    
    // Convert each key to ensure values are string arrays
    Object.entries(dbVariables).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        result[key] = value.map(item => String(item));
      } else {
        // If value is not an array, create a single-item array
        result[key] = [String(value)];
      }
    });
    
    return result;
  }
  
  // Fallback to empty object if structure is incorrect
  return {};
};

/**
 * Converts string to TemplateSectionType enum
 */
export const convertToSectionType = (type: string): TemplateSectionType => {
  const enumValues = Object.values(TemplateSectionType);
  if (enumValues.includes(type as TemplateSectionType)) {
    return type as TemplateSectionType;
  }
  return TemplateSectionType.CUSTOM; // Default to CUSTOM if not found
};
