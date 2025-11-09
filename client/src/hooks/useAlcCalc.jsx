import { useCallback, useMemo } from 'react';

/**
 * Hook for computing alcohol content
 */
export const useAlcCalc = () => {
  /**
   * Convert a single component to grams of pure alcohol
   */
  const calculateComponentAlcohol = useCallback(({ volume, unit, abv }) => {
    if (volume == null || abv == null) return 0;
    let volumeMl = unit === 'l' ? volume * 1000 : unit === 'oz' ? volume * 29.5735 : volume;

    // Pure alcohol in grams: volume * ABV * ethanol density (0.789 g/ml)
    return volumeMl * (abv / 100) * 0.789;
  }, []);

  /**
   * Compute total alcohol for an array of components
   */
  const calculateTotalAlcohol = useCallback((components) => {
    if (!components || !Array.isArray(components)) return 0;
    return components.reduce((sum, comp) => sum + calculateComponentAlcohol(comp), 0);
  }, [calculateComponentAlcohol]);

  /**
   * Convert Grams of Alcohol to the equivalent number of beer crates 
   * Assumption: One crate = 24 bottles × 0.33L × 5% ABV
   */
  const convertToCrates = useCallback((grams) => {
    
    const bottleVolumeMl = 330;
    const bottlesPerCrate = 24;
    const abv = 5;
    const ethanolDensity = 0.789;

    const alcoholPerCrate = bottlesPerCrate * bottleVolumeMl * (abv / 100) * ethanolDensity;
    return grams / alcoholPerCrate;
  }, []);

  const calculateCrates = useCallback((components) => {
    if (!components) return 0;
    const arr = Array.isArray(components) ? components : [components];
    const totalAlcohol = arr.reduce(
      (sum, comp) => sum + calculateComponentAlcohol(comp),
      0
    );

    return convertToCrates(totalAlcohol);
  }, [calculateComponentAlcohol, convertToCrates]);

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
    if (!userData || !userData.drinks || userData.drinks.length === 0) {
      return { currentBAC: 0, hoursToSober: 0, totalAlcoholMl: 0 };
    }

    const now = new Date().getTime();
    const weightKg = parseFloat(userData.weight) || 80; // default
    const r = 0.68; // body water constant (average for men; could vary 0.55–0.68)

    let totalAlcoholMl = 0;
    let effectiveAlcoholGrams = 0;

    userData.drinks.forEach((drink) => {
      const t = new Date(drink.timestamp).getTime();
      if (isNaN(t)) return;
      const hoursPassed = (now - t) / 1000 / 60 / 60;

      let alcoholMl = 0;
      drink.ingredients.forEach((ing) => {
        const vol = parseFloat(ing.volume);
        const abv = parseFloat(ing.abv);
        if (!isNaN(vol) && !isNaN(abv)) {
          alcoholMl += vol * (abv / 100);
        }
      });

        // Convert ml of ethanol -> grams (density ≈ 0.789 g/ml)
        const alcoholGrams = alcoholMl * 0.789;
        totalAlcoholMl += alcoholMl;

        // Apply metabolism rate: roughly 0.015 BAC/hour decline
        const initialBAC = (alcoholGrams / (weightKg * r)) * 100;
        const currentBAC = Math.max(initialBAC - hoursPassed * 0.015, 0);

        // Accumulate remaining BAC contributions
        effectiveAlcoholGrams += (currentBAC * weightKg * r) / 100;
    });

    // Combine remaining grams into an aggregate BAC
    const totalBAC = (effectiveAlcoholGrams / (weightKg * r)) * 100;

    // Estimate hours to fully sober (when BAC -> 0)
    const hoursToSober = totalBAC / 0.015;

    return {
      currentBAC: parseFloat(totalBAC.toFixed(3)),
      hoursToSober: parseFloat(hoursToSober.toFixed(1)),
      totalAlcoholMl: parseFloat(totalAlcoholMl.toFixed(1)),
    };
  }, [])

  return {
    calculateComponentAlcohol,
    calculateTotalAlcohol,
    convertToCrates,
    calculateCrates,
    calcIntox
  };
};