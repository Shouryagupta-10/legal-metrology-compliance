export type RuleStatus = 'PASS' | 'FAIL' | 'WARNING' | 'NOT_APPLICABLE';
export type OverallComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'WARNING';
export type PackageShape = 'rectangular' | 'cylindrical' | 'packet_pouch' | 'irregular';

export type RuleCategory =
  | 'mandatory_declarations'
  | 'weights_and_measures'
  | 'pricing_and_usp'
  | 'consumer_grievance'
  | 'pdp_and_typography'
  | 'ecommerce_compliance'
  | 'import_and_origin';

export interface BoundingBox {
  id: string;
  field: string;
  text: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
  confidence: number;
  status: 'valid' | 'invalid' | 'warning' | 'neutral';
  ruleCitation?: string;
  annotationNote?: string;
}

export interface ExtractedDeclarations {
  // Rule 6(1)(a)
  manufacturerName?: string;
  manufacturerAddress?: string;
  manufacturerPin?: string;
  manufacturerState?: string;
  packerName?: string;
  packerAddress?: string;
  importerName?: string;
  importerAddress?: string;
  isImported?: boolean;
  countryOfOrigin?: string;

  // Rule 6(1)(b)
  commodityName?: string;
  commonOrGenericName?: string;

  // Rule 6(1)(c), Rule 11, 12, 13
  netQuantityValue?: number;
  netQuantityUnit?: string;
  rawNetQuantityText?: string;
  netQuantitySymbolValid?: boolean;
  pieceCount?: number;

  // Rule 6(1)(d)
  mfgMonth?: number;
  mfgYear?: number;
  rawMfgDateText?: string;
  expiryDate?: string;
  bestBeforePeriod?: string;

  // Rule 6(1)(e)
  mrpValue?: number;
  rawMrpText?: string;
  isTaxesInclusiveDeclared?: boolean;
  rawTaxDeclarationText?: string;

  // 2021/2022 Amendment: Unit Sale Price
  declaredUspValue?: number;
  declaredUspUnit?: string;
  rawUspText?: string;
  calculatedUspValue?: number;
  uspDiscrepancy?: boolean;

  // Rule 6(1)(f)
  dimensions?: string; // e.g. "200 cm x 150 cm"
  sizeNotation?: string;

  // Rule 6(1)(n)
  consumerCareName?: string;
  consumerCareAddress?: string;
  consumerCarePhone?: string;
  consumerCareEmail?: string;
  consumerCareWebsite?: string;

  // Additional identifiers
  fssaiNumber?: string;
  lmpcRegNumber?: string;
  barcode?: string;
  batchNumber?: string;
}

export interface RuleResult {
  ruleId: string;
  ruleCode: string;
  ruleTitle: string;
  ruleClause: string;
  category: RuleCategory;
  status: RuleStatus;
  legalCitation: string;
  description: string;
  extractedValue?: string;
  expectedFormat: string;
  deficiencyReason?: string;
  recommendation?: string;
  penaltyClause: string;
  penaltyAmountMin: number;
  penaltyAmountMax: number;
  boundingBoxId?: string;
  isCritical: boolean;
}

export interface PrincipalDisplayPanelCalculation {
  packageShape: PackageShape;
  heightMm: number;
  widthMm: number;
  depthMm?: number;
  diameterMm?: number;
  totalSurfaceAreaSqCm: number;
  pdpAreaSqCm: number;
  pdpPercentage: number;
  netQuantityGramsOrMl: number;
  requiredMinNumeralHeightMm: number;
  requiredMinLetterHeightMm: number;
  measuredNumeralHeightMm?: number;
  isNumeralHeightCompliant: boolean;
  ruleCitation: string;
}

export interface PenaltyEstimate {
  section: string;
  firstOffenseMinFine: number;
  firstOffenseMaxFine: number;
  secondOffenseMaxFine: number;
  subsequentOffenseMaxFine: number;
  imprisonmentMonthsMax: number;
  compoundingPossible: boolean;
  legalSummary: string;
}

export interface LabelImageRecord {
  id: string;
  viewType: 'front' | 'back' | 'side' | 'bottom' | 'nutrition_legal' | 'single';
  url: string;
  name: string;
  rawOcrText?: string;
  boundingBoxes: BoundingBox[];
}

export interface EcommerceListingData {
  marketplaceName?: string;
  productUrl?: string;
  listingTitle?: string;
  isAllMandatoryInfoOnPDP: boolean;
  missingOnlineDeclarations: string[];
  ruleCitation: string;
}

export interface ComplianceReport {
  inspectionId: string;
  inspectionDate: string;
  inspectorName: string;
  productName: string;
  brandName: string;
  categoryName: string;
  productSku?: string;
  overallScore: number; // 0 to 100
  overallStatus: OverallComplianceStatus;
  totalRulesChecked: number;
  passedRulesCount: number;
  failedRulesCount: number;
  warningRulesCount: number;
  criticalViolationsCount: number;
  declarations: ExtractedDeclarations;
  ruleResults: RuleResult[];
  pdpCalculation: PrincipalDisplayPanelCalculation;
  penaltyEstimate: PenaltyEstimate;
  labelImages: LabelImageRecord[];
  activeImageId: string;
  ecommerceData?: EcommerceListingData;
  summaryNotes: string[];
}

export interface SampleProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  thumbnail: string;
  labelImages: LabelImageRecord[];
  declarations: ExtractedDeclarations;
  pdpDefaults: {
    shape: PackageShape;
    heightMm: number;
    widthMm: number;
    depthMm: number;
    diameterMm?: number;
    measuredFontHeightMm?: number;
  };
  expectedCompliance: OverallComplianceStatus;
  scenarioDescription: string;
  tags: string[];
}