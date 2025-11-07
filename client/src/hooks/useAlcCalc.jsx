import { useCallback } from 'react';

/**
 * Hook for computing alcohol content
 */
export const useAlcCalc = () => {
  /**
   * Convert a single component to grams of pure alcohol
   */
  const calculateComponentAlcohol = useCallback(({ volume, unit, abv }) => {
    if (volume == null || abv == null) return 0;

    // Convert volume to milliliters
    let volumeMl = unit === 'l' ? volume * 1000
                 : unit === 'oz' ? volume * 29.5735
                 : volume;

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

    // Normalize to array
    const arr = Array.isArray(components) ? components : [components];

    const totalAlcohol = arr.reduce(
      (sum, comp) => sum + calculateComponentAlcohol(comp),
      0
    );

    return convertToCrates(totalAlcohol);
  }, [calculateComponentAlcohol, convertToCrates]);

  return {
    calculateComponentAlcohol,
    calculateTotalAlcohol,
    convertToCrates,
    calculateCrates
  };
};
