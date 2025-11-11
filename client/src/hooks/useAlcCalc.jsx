import { useCallback, useMemo } from 'react';

/**
 * Hook for computing alcohol content
 */
export const useAlcCalc = () => {

  /**
   * Convert a single component to milliliters of pure alcohol
   */
  const alcoholToML = useCallback(({ volume, unit, abv }) => {
    if (volume == null || abv == null) return 0;
    let volumeMl = unit === 'l' ? volume * 1000 : unit === 'oz' ? volume * 29.5735 : volume;

    // Pure alcohol in grams: volume * ABV * ethanol density (0.789 g/ml)
    return volumeMl * (abv / 100);;
  }, []);

  /**
   * Convert a single component to grams of pure alcohol
   */
  const alcoholToGrams = useCallback(({ volume, unit, abv }) => {
    // Pure alcohol in grams: volume * ABV * ethanol density (0.789 g/ml)
    return alcoholToML({ volume, unit, abv }) * 0.789;
  }, [alcoholToML]);

  /**
   * Compute total alcohol for an array of components in grams
   */
  const calculateTotalAlcoholG = useCallback((components) => {
    if (!components || !Array.isArray(components)) return 0;
    return components.reduce((sum, comp) => sum + alcoholToGrams(comp), 0);
  }, [alcoholToGrams]);

  /**
   * Compute total alcohol for an array of components in milliliters
   */
  const calculateTotalAlcoholML = useCallback((components) => {
    if (!components || !Array.isArray(components)) return 0;
    return components.reduce((sum, comp) => sum + alcoholToML(comp), 0);
  }, [alcoholToML]);

  /**
   * Convert Grams of Alcohol to the equivalent number of beer crates 
   * Assumption: One crate = 24 bottles × 0.33L × 5% ABV
   */
  const convertToCrates = useCallback((grams) => {
  const crateComponent = {
    volume: 0.33,
    unit: 'l',
    abv: 5,
  };
  const bottlesPerCrate = 24;
  const gramsPerCrate = alcoholToGrams(crateComponent) * bottlesPerCrate;
  return grams / gramsPerCrate;
}, [alcoholToGrams]);

  /**
   * Combines calculateTotalAlcoholG and convertToCrates
   * Assumption: One crate = 24 bottles × 0.33L × 5% ABV
   */
  const calculateCrates = useCallback((components) => {
    if (!components) return 0;
    const arr = Array.isArray(components) ? components : [components];
    const totalGrams = calculateTotalAlcoholG(arr);

    return convertToCrates(totalGrams);
  }, [calculateTotalAlcoholG, convertToCrates]);

  /**
 * Estimates the user's current intoxication level and metabolism time.
 * @param {Object} userData - The user data object including drinks and physical stats.
 * @param {number} [userData.weight] - User's weight in kilograms.
 * @param {number} [userData.height] - User's height in centimeters.
 * @param {number} [userData.age] - User's age in years.
 * @param {Array}  userData.drinks - Array of drink objects with timestamps, ingredients, and crates.
 * @returns {Object} { currentBAC, hoursToSober, totalAlcoholMl }
 */
const calcIntox = useCallback((userData) => {
  if (!userData || !Array.isArray(userData.drinks) || userData.drinks.length === 0) {
    return { currentBAC: 0, hoursToSober: 0, totalAlcoholMl: 0 };
  }

  const now = Date.now();
  const weightKg = parseFloat(userData.weight) || 80; // default weight
  const r = 0.68; // body water constant (average for men)

  let totalAlcoholMl = 0;
  let remainingAlcoholGrams = 0;

  userData.drinks.forEach((drink) => {
    if (!drink.ingredients || drink.ingredients.length === 0) return;

    const drinkTime = new Date(drink.timestamp).getTime();
    if (isNaN(drinkTime)) return;

    const hoursPassed = (now - drinkTime) / 1000 / 60 / 60;

    // Sum alcohol in milliliters and grams using existing helpers
    const alcoholMl = calculateTotalAlcoholML(drink.ingredients);
    const alcoholGrams = calculateTotalAlcoholG(drink.ingredients);

    totalAlcoholMl += alcoholMl;

    // Compute current BAC after metabolism (0.015 per hour)
    const weightGrams = weightKg * 1000;
    const initialBAC = (alcoholGrams / (weightGrams * r)) * 100;
    const currentBAC = Math.max(initialBAC - hoursPassed * 0.015, 0);

    // Convert back to grams for accumulation
    remainingAlcoholGrams += (currentBAC * weightKg * r) / 100;
  });

  const totalBAC = (remainingAlcoholGrams / (weightKg * r)) * 100;
  const hoursToSober = totalBAC / 0.015;

  return {
    currentBAC: parseFloat(totalBAC.toFixed(3)),
    hoursToSober: parseFloat(hoursToSober.toFixed(1)),
    totalAlcoholMl: parseFloat(totalAlcoholMl.toFixed(1)),
  };
}, [calculateTotalAlcoholML, calculateTotalAlcoholG]);


  return {
    alcoholToGrams,
    alcoholToML,
    calculateTotalAlcoholG,
    calculateTotalAlcoholML,
    convertToCrates,
    calculateCrates,
    calcIntox
  };
};