import { PackageShape, PrincipalDisplayPanelCalculation } from '../types/compliance';

export interface PDPInput {
  packageShape: PackageShape;
  heightMm: number;
  widthMm: number;
  depthMm?: number;
  diameterMm?: number;
  netQuantityValue: number;
  netQuantityUnit: string;
  measuredNumeralHeightMm?: number;
}

/**
 * Calculates Principal Display Panel (PDP) area and required minimum font/numeral heights
 * based on Rule 7 and Table 1 of the Legal Metrology (Packaged Commodities) Rules, 2011.
 */
export function calculatePDP(input: PDPInput): PrincipalDisplayPanelCalculation {
  const {
    packageShape,
    heightMm,
    widthMm,
    depthMm = 0,
    diameterMm = 0,
    netQuantityValue,
    netQuantityUnit,
    measuredNumeralHeightMm
  } = input;

  let totalSurfaceAreaSqCm = 0;
  let pdpAreaSqCm = 0;
  let pdpPercentage = 40;

  // Standardize net quantity in equivalent grams or millilitres
  let netQtyEquivalentGramsOrMl = netQuantityValue;
  const unitLower = (netQuantityUnit || '').toLowerCase().trim();

  if (unitLower === 'kg' || unitLower === 'kgs' || unitLower === 'kilogram' || unitLower === 'l' || unitLower === 'litre' || unitLower === 'liter') {
    netQtyEquivalentGramsOrMl = netQuantityValue * 1000;
  } else if (unitLower === 'mg' || unitLower === 'milligram') {
    netQtyEquivalentGramsOrMl = netQuantityValue / 1000;
  }

  // Calculate surface area and PDP area based on shape
  if (packageShape === 'rectangular') {
    // Front face area = Height * Width (in cm2)
    const frontFaceSqCm = (heightMm * widthMm) / 100;
    // Total surface area of 6 faces
    totalSurfaceAreaSqCm = (2 * (heightMm * widthMm + heightMm * depthMm + widthMm * depthMm)) / 100;
    // Rule 7(1)(a): In the case of a package with a rectangular shape, 40% of the product of height and width of the face
    pdpAreaSqCm = frontFaceSqCm * 0.40;
    pdpPercentage = 40;
  } else if (packageShape === 'cylindrical') {
    const radiusCm = (diameterMm / 2) / 10;
    const heightCm = heightMm / 10;
    // Total cylindrical surface area = 2*pi*r*h + 2*pi*r^2
    totalSurfaceAreaSqCm = 2 * Math.PI * radiusCm * heightCm + 2 * Math.PI * radiusCm * radiusCm;
    // Rule 7(1)(b): In the case of a cylindrical package, 40% of the product of height and diameter, or 20% of total surface area
    const heightDiameterArea = (heightMm * diameterMm) / 100;
    pdpAreaSqCm = Math.max(heightDiameterArea * 0.40, totalSurfaceAreaSqCm * 0.20);
    pdpPercentage = 20;
  } else if (packageShape === 'packet_pouch') {
    // Pouch: 40% of one full side
    const faceSqCm = (heightMm * widthMm) / 100;
    totalSurfaceAreaSqCm = faceSqCm * 2;
    pdpAreaSqCm = faceSqCm * 0.40;
    pdpPercentage = 40;
  } else {
    // Irregular package: 20% of total surface area
    totalSurfaceAreaSqCm = ((heightMm * widthMm) / 100) * 4;
    pdpAreaSqCm = totalSurfaceAreaSqCm * 0.20;
    pdpPercentage = 20;
  }

  // Minimum Numeral and Letter Height requirements based on Table 1 of Rule 7
  // Net Quantity | Min Numeral Height (mm) | Min Letter Height (mm)
  // <= 50 g/ml   | 1.5 mm                 | 1.0 mm
  // 50 - 200     | 2.0 mm                 | 1.0 mm
  // 200 - 1000   | 4.0 mm                 | 2.0 mm
  // > 1000       | 6.0 mm                 | 3.0 mm
  let requiredMinNumeralHeightMm = 1.5;
  let requiredMinLetterHeightMm = 1.0;

  if (netQtyEquivalentGramsOrMl <= 50) {
    requiredMinNumeralHeightMm = 1.5;
    requiredMinLetterHeightMm = 1.0;
  } else if (netQtyEquivalentGramsOrMl <= 200) {
    requiredMinNumeralHeightMm = 2.0;
    requiredMinLetterHeightMm = 1.0;
  } else if (netQtyEquivalentGramsOrMl <= 1000) {
    requiredMinNumeralHeightMm = 4.0;
    requiredMinLetterHeightMm = 2.0;
  } else {
    requiredMinNumeralHeightMm = 6.0;
    requiredMinLetterHeightMm = 3.0;
  }

  const isNumeralHeightCompliant = measuredNumeralHeightMm !== undefined
    ? measuredNumeralHeightMm >= requiredMinNumeralHeightMm
    : true;

  return {
    packageShape,
    heightMm,
    widthMm,
    depthMm,
    diameterMm,
    totalSurfaceAreaSqCm: Number(totalSurfaceAreaSqCm.toFixed(2)),
    pdpAreaSqCm: Number(pdpAreaSqCm.toFixed(2)),
    pdpPercentage,
    netQuantityGramsOrMl: netQtyEquivalentGramsOrMl,
    requiredMinNumeralHeightMm,
    requiredMinLetterHeightMm,
    measuredNumeralHeightMm,
    isNumeralHeightCompliant,
    ruleCitation: `Rule 7 Table 1: Minimum numeral height ${requiredMinNumeralHeightMm} mm and letter height ${requiredMinLetterHeightMm} mm required for net qty ${netQtyEquivalentGramsOrMl} g/ml.`
  };
}