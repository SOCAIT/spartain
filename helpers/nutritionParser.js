/**
 * Nutrition Parser Utility
 * Handles various formats that LLMs might return nutrition data in:
 * 
 * 1. <nutrition>{"calories": 105, ...}</nutrition>
 * 2. <nutrition>{{"calories": 105, ...}}</nutrition> (double brackets)
 * 3. ```json\n{"calories": 105, ...}\n```
 * 4. Raw JSON with nutrition keys (calories, protein, carbs, fats)
 */

// Required nutrition keys to validate extracted data
const NUTRITION_KEYS = ['calories', 'protein', 'carbs', 'fats'];
const ALTERNATE_KEYS = {
  proteins: 'protein',
  fat: 'fats',
  carbohydrates: 'carbs',
};

/**
 * Normalizes nutrition data keys (e.g., 'proteins' -> 'protein')
 */
const normalizeNutritionData = (data) => {
  if (!data || typeof data !== 'object') return null;
  
  const normalized = {};
  
  for (const [key, value] of Object.entries(data)) {
    const normalizedKey = ALTERNATE_KEYS[key.toLowerCase()] || key.toLowerCase();
    normalized[normalizedKey] = parseFloat(value) || 0;
  }
  
  // Check if it has at least calories or 2+ nutrition keys
  const hasCalories = 'calories' in normalized;
  const nutritionKeyCount = NUTRITION_KEYS.filter(k => k in normalized).length;
  
  if (hasCalories || nutritionKeyCount >= 2) {
    return normalized;
  }
  
  return null;
};

/**
 * Attempts to parse a JSON string, handling common LLM quirks
 */
const tryParseJSON = (str) => {
  if (!str || typeof str !== 'string') return null;
  
  let jsonStr = str.trim();
  
  // Handle double brackets {{ }}
  if (jsonStr.startsWith('{{') && jsonStr.endsWith('}}')) {
    jsonStr = jsonStr.slice(1, -1);
  }
  
  // Handle single brackets at start/end that might be extra
  while (jsonStr.startsWith('{{')) {
    jsonStr = jsonStr.slice(1);
  }
  while (jsonStr.endsWith('}}')) {
    jsonStr = jsonStr.slice(0, -1);
  }
  
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // Try to extract just the object part
    const objectMatch = jsonStr.match(/\{[^{}]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch (e2) {
        return null;
      }
    }
    return null;
  }
};

/**
 * Extracts JSON object from text that may contain extra content
 */
const extractJSONFromText = (text) => {
  if (!text) return null;
  
  // Try to find a JSON object with nutrition keys anywhere in the text
  // This handles cases where there's timestamps or other text around the JSON
  const jsonPattern = /\{[^{}]*"calories"\s*:\s*[\d.]+[^{}]*\}/i;
  const match = text.match(jsonPattern);
  
  if (match) {
    return tryParseJSON(match[0]);
  }
  
  // Also try matching by other nutrition keys
  const altPatterns = [
    /\{[^{}]*"protein"\s*:\s*[\d.]+[^{}]*\}/i,
    /\{[^{}]*"carbs"\s*:\s*[\d.]+[^{}]*\}/i,
  ];
  
  for (const pattern of altPatterns) {
    const altMatch = text.match(pattern);
    if (altMatch) {
      return tryParseJSON(altMatch[0]);
    }
  }
  
  return null;
};

/**
 * Extracts nutrition data from text using multiple strategies
 * @param {string} text - The raw text to parse
 * @returns {{ cleanText: string, nutritionData: object|null }}
 */
export const extractNutrition = (text) => {
  if (!text || typeof text !== 'string') {
    return { cleanText: text || '', nutritionData: null };
  }

  console.log('[Nutrition-Parser] Raw text ->', text.substring(0, 300));

  let cleanText = text;
  let nutritionData = null;

  // Strategy 1: Look for <nutrition> tags
  const nutritionTagMatch = text.match(/<nutrition>([\s\S]*?)<\/nutrition>/i);
  if (nutritionTagMatch) {
    console.log('[Nutrition-Parser] Found <nutrition> tag, content:', nutritionTagMatch[1]);
    // First try direct parse, then try extracting JSON from the content
    let parsed = tryParseJSON(nutritionTagMatch[1]);
    if (!parsed) {
      parsed = extractJSONFromText(nutritionTagMatch[1]);
    }
    if (parsed) {
      nutritionData = normalizeNutritionData(parsed);
      if (nutritionData) {
        cleanText = text.replace(nutritionTagMatch[0], '').trim();
        console.log('[Nutrition-Parser] SUCCESS from tag ->', nutritionData);
        return { cleanText, nutritionData };
      }
    }
    console.log('[Nutrition-Parser] Failed to parse nutrition tag content');
  }

  // Strategy 2: Look for ```json code blocks
  const jsonCodeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (jsonCodeBlockMatch) {
    console.log('[Nutrition-Parser] Found JSON code block, content:', jsonCodeBlockMatch[1].substring(0, 200));
    // Code blocks often have extra text, so extract JSON from within
    const parsed = extractJSONFromText(jsonCodeBlockMatch[1]);
    if (parsed) {
      const normalized = normalizeNutritionData(parsed);
      if (normalized) {
        nutritionData = normalized;
        cleanText = text.replace(jsonCodeBlockMatch[0], '').trim();
        console.log('[Nutrition-Parser] SUCCESS from code block ->', nutritionData);
        return { cleanText, nutritionData };
      }
    }
    console.log('[Nutrition-Parser] Failed to parse code block content');
  }

  // Strategy 3: Look for raw JSON objects anywhere in the text
  console.log('[Nutrition-Parser] Trying raw JSON extraction...');
  const parsed = extractJSONFromText(text);
  if (parsed) {
    const normalized = normalizeNutritionData(parsed);
    if (normalized) {
      nutritionData = normalized;
      // Find and remove the JSON from text
      const jsonMatch = text.match(/\{[^{}]*"(?:calories|protein|carbs|fats)"\s*:\s*[\d.]+[^{}]*\}/i);
      if (jsonMatch) {
        cleanText = text.replace(jsonMatch[0], '').trim();
      }
      console.log('[Nutrition-Parser] SUCCESS from raw JSON ->', nutritionData);
      return { cleanText, nutritionData };
    }
  }

  console.log('[Nutrition-Parser] No nutrition data found in text');
  return { cleanText, nutritionData: null };
};

/**
 * Legacy function name for backwards compatibility
 */
export const parseNutritionFromText = extractNutrition;

export default {
  extractNutrition,
  parseNutritionFromText,
};

