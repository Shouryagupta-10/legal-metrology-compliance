import {
  ExtractedDeclarations,
  RuleResult,
  ComplianceReport,
  OverallComplianceStatus,
  PrincipalDisplayPanelCalculation,
  PenaltyEstimate,
  LabelImageRecord,
  EcommerceListingData,
  TamperAnomaly
} from '../types/compliance';
import { LEGAL_METROLOGY_RULES } from './legalMetrologyRules';
import { calculatePDP } from './pdpCalculator';
import { detectLabelTampering } from './tamperDetector';
import { calculatePriorityTriage } from './inspectorIntelligence';

export interface EvaluateComplianceInput {
  productId?: string;
  productName: string;
  brandName: string;
  categoryName: string;
  productSku?: string;
  declarations: ExtractedDeclarations;
  pdpInput?: {
    packageShape: 'rectangular' | 'cylindrical' | 'packet_pouch' | 'irregular';
    heightMm: number;
    widthMm: number;
    depthMm?: number;
    diameterMm?: number;
    measuredNumeralHeightMm?: number;
  };
  labelImages?: LabelImageRecord[];
  activeImageId?: string;
  ecommerceData?: EcommerceListingData;
  isEcommerceMode?: boolean;
  tamperDefaults?: {
    isTampered?: boolean;
    tamperRiskScore?: number;
    anomalies?: TamperAnomaly[];
  };
}

export function evaluateCompliance(input: EvaluateComplianceInput): ComplianceReport {
  const {
    productId = `LMPC-${Math.floor(100000 + Math.random() * 900000)}`,
    productName,
    brandName,
    categoryName,
    productSku = `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    declarations,
    pdpInput,
    labelImages = [],
    activeImageId = labelImages[0]?.id || 'img-1',
    ecommerceData,
    isEcommerceMode = false
  } = input;

  const ruleResults: RuleResult[] = [];
  const summaryNotes: string[] = [];

  // Calculate PDP
  const pdpCalc: PrincipalDisplayPanelCalculation = calculatePDP({
    packageShape: pdpInput?.packageShape || 'rectangular',
    heightMm: pdpInput?.heightMm || 150,
    widthMm: pdpInput?.widthMm || 100,
    depthMm: pdpInput?.depthMm || 40,
    diameterMm: pdpInput?.diameterMm || 0,
    netQuantityValue: declarations.netQuantityValue || 500,
    netQuantityUnit: declarations.netQuantityUnit || 'g',
    measuredNumeralHeightMm: pdpInput?.measuredNumeralHeightMm
  });

  // 1. Evaluate Rule 6(1)(a) - Manufacturer / Packer / Importer
  const hasMfgName = Boolean(declarations.manufacturerName || declarations.packerName || declarations.importerName);
  const hasPin = Boolean(declarations.manufacturerPin);
  const hasState = Boolean(declarations.manufacturerState);
  const isImported = Boolean(declarations.isImported);

  if (hasMfgName && hasPin && hasState) {
    ruleResults.push({
      ruleId: 'rule_6_1_a_mfg',
      ruleCode: 'Rule 6(1)(a)',
      ruleTitle: 'Name & Complete Address of Manufacturer / Packer / Importer',
      ruleClause: 'Manufacturer details with PIN Code & State',
      category: 'mandatory_declarations',
      status: 'PASS',
      legalCitation: 'Rule 6(1)(a) of LMPC Rules, 2011',
      description: 'Complete manufacturer name, physical address, 6-digit Indian PIN code and State declared.',
      extractedValue: `${declarations.manufacturerName || ''}, PIN: ${declarations.manufacturerPin || ''}, ${declarations.manufacturerState || ''}`,
      expectedFormat: 'Name of Entity, Premise/Street, City, State, PIN Code (6 digits)',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 0,
      penaltyAmountMax: 0,
      isCritical: true
    });
  } else if (hasMfgName && (!hasPin || !hasState)) {
    ruleResults.push({
      ruleId: 'rule_6_1_a_mfg',
      ruleCode: 'Rule 6(1)(a)',
      ruleTitle: 'Name & Complete Address of Manufacturer / Packer / Importer',
      ruleClause: 'Incomplete Address (Missing PIN Code or State)',
      category: 'mandatory_declarations',
      status: 'FAIL',
      legalCitation: 'Rule 6(1)(a) of LMPC Rules, 2011',
      description: 'Manufacturer name is declared, but the address is incomplete (missing 6-digit PIN code or state).',
      extractedValue: declarations.manufacturerName || declarations.manufacturerAddress || 'Incomplete address',
      expectedFormat: 'Must include 6-digit Indian PIN Code and State to enable physical jurisdiction identification.',
      deficiencyReason: 'Missing 6-digit PIN Code / State creates ambiguity in manufacturer physical jurisdiction.',
      recommendation: 'Update label to print full postal address along with valid 6-digit PIN code.',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: true
    });
    summaryNotes.push('Manufacturer address is missing valid 6-digit PIN code or State under Rule 6(1)(a).');
  } else {
    ruleResults.push({
      ruleId: 'rule_6_1_a_mfg',
      ruleCode: 'Rule 6(1)(a)',
      ruleTitle: 'Name & Complete Address of Manufacturer / Packer / Importer',
      ruleClause: 'Missing Manufacturer Details',
      category: 'mandatory_declarations',
      status: 'FAIL',
      legalCitation: 'Rule 6(1)(a) of LMPC Rules, 2011',
      description: 'No manufacturer, packer, or importer name and address found on the package.',
      expectedFormat: 'Manufacturer / Packer / Importer name and full postal address.',
      deficiencyReason: 'Mandatory declaration completely absent from label.',
      recommendation: 'Affix required manufacturer or packer declaration prior to retail distribution.',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: true
    });
    summaryNotes.push('Critical: Manufacturer / Packer / Importer name and address missing.');
  }

  // 2. Evaluate Rule 6(1)(b) - Generic / Common Name
  if (declarations.commodityName || declarations.commonOrGenericName) {
    ruleResults.push({
      ruleId: 'rule_6_1_b_commodity',
      ruleCode: 'Rule 6(1)(b)',
      ruleTitle: 'Generic or Common Name of Commodity',
      ruleClause: 'Generic Product Name Declaration',
      category: 'mandatory_declarations',
      status: 'PASS',
      legalCitation: 'Rule 6(1)(b) of LMPC Rules, 2011',
      description: 'Commodity generic or common name is clearly declared.',
      extractedValue: declarations.commodityName || declarations.commonOrGenericName,
      expectedFormat: 'Clear generic name in English or Hindi (Devanagari)',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 0,
      penaltyAmountMax: 0,
      isCritical: true
    });
  } else {
    ruleResults.push({
      ruleId: 'rule_6_1_b_commodity',
      ruleCode: 'Rule 6(1)(b)',
      ruleTitle: 'Generic or Common Name of Commodity',
      ruleClause: 'Missing Generic Name of Commodity',
      category: 'mandatory_declarations',
      status: 'FAIL',
      legalCitation: 'Rule 6(1)(b) of LMPC Rules, 2011',
      description: 'No generic or common name identifying the commodity was found.',
      expectedFormat: 'Generic/common product name (e.g., "Wheat Flour", "Potato Chips", "Refined Sunflower Oil").',
      deficiencyReason: 'Brand name alone without generic commodity description is a statutory violation.',
      recommendation: 'Add common or generic name conspicuously on the principal display panel.',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: true
    });
    summaryNotes.push('Generic or common name of commodity is missing under Rule 6(1)(b).');
  }

  // 3. Evaluate Rule 6(1)(c), Rule 11, 12, 13 - Net Quantity & Standard Units
  const rawUnit = declarations.netQuantityUnit || '';
  const prohibitedUnits = ['gm', 'gms', 'gm.', 'g.', 'kgs', 'KG', 'ML', 'ml.', 'mtr', 'mtrs', 'nos', 'ct', 'pkts', 'doz'];
  const isProhibitedUnit = prohibitedUnits.includes(rawUnit) || prohibitedUnits.includes(rawUnit.toLowerCase());
  const isValidUnit = ['g', 'kg', 'ml', 'mL', 'l', 'L', 'm', 'cm', 'mm', 'N', 'U'].includes(rawUnit);

  if (declarations.netQuantityValue && isValidUnit && !isProhibitedUnit) {
    ruleResults.push({
      ruleId: 'rule_6_1_c_net_qty',
      ruleCode: 'Rule 6(1)(c)',
      ruleTitle: 'Net Quantity in Standard Units of Weight/Measure',
      ruleClause: 'Standard SI Unit Symbol Compliance',
      category: 'weights_and_measures',
      status: 'PASS',
      legalCitation: 'Rule 6(1)(c), Rule 11 & Rule 12 of LMPC Rules, 2011',
      description: `Net quantity declared accurately with valid standard SI symbol (${declarations.netQuantityValue} ${declarations.netQuantityUnit}).`,
      extractedValue: `${declarations.netQuantityValue} ${declarations.netQuantityUnit}`,
      expectedFormat: 'Net Quantity: [Value] [g / kg / ml / l / m / cm / N]',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 0,
      penaltyAmountMax: 0,
      isCritical: true
    });
  } else if (declarations.netQuantityValue && isProhibitedUnit) {
    ruleResults.push({
      ruleId: 'rule_6_1_c_net_qty',
      ruleCode: 'Rule 6(1)(c)',
      ruleTitle: 'Net Quantity in Standard Units of Weight/Measure',
      ruleClause: 'Illegal Non-Standard Unit Notation Used',
      category: 'weights_and_measures',
      status: 'FAIL',
      legalCitation: 'Rule 6(1)(c), Rule 11 & Rule 13 of LMPC Rules, 2011',
      description: `Illegal non-standard unit notation '${rawUnit}' used. Under Rule 11 and 13, symbols like 'gms', 'gm', 'kgs', 'ml.', 'mtrs' are strictly prohibited.`,
      extractedValue: declarations.rawNetQuantityText || `${declarations.netQuantityValue} ${rawUnit}`,
      expectedFormat: `Use strictly '${rawUnit.toLowerCase().startsWith('g') ? 'g' : rawUnit.toLowerCase().startsWith('k') ? 'kg' : rawUnit.toLowerCase().startsWith('m') ? 'ml' : 'l'}' without plural 's' or trailing periods.`,
      deficiencyReason: `Non-standard unit '${rawUnit}' violates mandatory SI metric unit symbols prescribed under Rule 11.`,
      recommendation: `Change '${rawUnit}' to '${rawUnit.toLowerCase().startsWith('g') ? 'g' : rawUnit.toLowerCase().startsWith('k') ? 'kg' : 'ml'}' immediately in packaging artwork.`,
      penaltyClause: 'Section 36(1) & Section 39 of Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: true
    });
    summaryNotes.push(`Illegal unit symbol '${rawUnit}' used for Net Quantity. Rule 11 mandates standard SI symbol.`);
  } else {
    ruleResults.push({
      ruleId: 'rule_6_1_c_net_qty',
      ruleCode: 'Rule 6(1)(c)',
      ruleTitle: 'Net Quantity in Standard Units of Weight/Measure',
      ruleClause: 'Missing Net Quantity Declaration',
      category: 'weights_and_measures',
      status: 'FAIL',
      legalCitation: 'Rule 6(1)(c) of LMPC Rules, 2011',
      description: 'Net quantity declaration is missing from the package.',
      expectedFormat: 'Net Quantity in standard metric units.',
      deficiencyReason: 'Mandatory declaration under Rule 6(1)(c) absent.',
      recommendation: 'Declare net quantity clearly on the principal display panel.',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: true
    });
    summaryNotes.push('Critical: Net quantity declaration missing.');
  }

  // 4. Evaluate Rule 6(1)(d) - Month & Year of Manufacture
  if (declarations.mfgMonth && declarations.mfgYear) {
    ruleResults.push({
      ruleId: 'rule_6_1_d_mfg_date',
      ruleCode: 'Rule 6(1)(d)',
      ruleTitle: 'Month and Year of Manufacture / Packing / Import',
      ruleClause: 'Date of Manufacture / Packing Declaration',
      category: 'mandatory_declarations',
      status: 'PASS',
      legalCitation: 'Rule 6(1)(d) of LMPC Rules, 2011',
      description: `Month and year of manufacture declared (${String(declarations.mfgMonth).padStart(2, '0')}/${declarations.mfgYear}).`,
      extractedValue: `${String(declarations.mfgMonth).padStart(2, '0')}/${declarations.mfgYear}`,
      expectedFormat: 'MM/YYYY or Month YYYY',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 0,
      penaltyAmountMax: 0,
      isCritical: true
    });
  } else if (declarations.rawMfgDateText || declarations.expiryDate || declarations.bestBeforePeriod) {
    ruleResults.push({
      ruleId: 'rule_6_1_d_mfg_date',
      ruleCode: 'Rule 6(1)(d)',
      ruleTitle: 'Month and Year of Manufacture / Packing / Import',
      ruleClause: 'Expiry / Best Before detected without explicit MM/YYYY',
      category: 'mandatory_declarations',
      status: 'WARNING',
      legalCitation: 'Rule 6(1)(d) of LMPC Rules, 2011',
      description: 'Best Before or Expiry text found, but explicit month and year of manufacture or pre-packing requires clearer formatting.',
      extractedValue: declarations.rawMfgDateText || declarations.expiryDate || declarations.bestBeforePeriod,
      expectedFormat: 'Mfg Date: MM/YYYY or Month YYYY',
      deficiencyReason: 'Date of packing/manufacture must be stated explicitly alongside best before.',
      recommendation: 'Format as "Mfg Date: MM/YYYY" on the label.',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 10000,
      penaltyAmountMax: 25000,
      isCritical: false
    });
  } else {
    ruleResults.push({
      ruleId: 'rule_6_1_d_mfg_date',
      ruleCode: 'Rule 6(1)(d)',
      ruleTitle: 'Month and Year of Manufacture / Packing / Import',
      ruleClause: 'Missing Month & Year of Manufacture',
      category: 'mandatory_declarations',
      status: 'FAIL',
      legalCitation: 'Rule 6(1)(d) of LMPC Rules, 2011',
      description: 'Month and year of manufacture, packing, or import is completely absent.',
      expectedFormat: 'MM/YYYY or Month YYYY',
      deficiencyReason: 'Mandatory declaration under Rule 6(1)(d) missing.',
      recommendation: 'Print Month & Year of packing/manufacture on label.',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: true
    });
    summaryNotes.push('Month and Year of manufacture/packing missing under Rule 6(1)(d).');
  }

  // 5. Evaluate Rule 6(1)(e) - Maximum Retail Price (MRP) & Tax Inclusivity
  const hasMrpPrice = Boolean(declarations.mrpValue && declarations.mrpValue > 0);
  const hasTaxInclusive = Boolean(declarations.isTaxesInclusiveDeclared);

  if (hasMrpPrice && hasTaxInclusive) {
    ruleResults.push({
      ruleId: 'rule_6_1_e_mrp',
      ruleCode: 'Rule 6(1)(e)',
      ruleTitle: 'Maximum Retail Price (MRP) with "Inclusive of all taxes"',
      ruleClause: 'MRP & Tax Inclusivity Declaration',
      category: 'pricing_and_usp',
      status: 'PASS',
      legalCitation: 'Rule 6(1)(e) & Rule 18 of LMPC Rules, 2011',
      description: `MRP declared with mandatory tax inclusive statement (MRP: ₹${declarations.mrpValue} incl. of all taxes).`,
      extractedValue: `₹ ${declarations.mrpValue} (${declarations.rawTaxDeclarationText || 'incl. of all taxes'})`,
      expectedFormat: 'MRP Rs. / ₹ .... (inclusive of all taxes)',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 0,
      penaltyAmountMax: 0,
      isCritical: true
    });
  } else if (hasMrpPrice && !hasTaxInclusive) {
    ruleResults.push({
      ruleId: 'rule_6_1_e_mrp',
      ruleCode: 'Rule 6(1)(e)',
      ruleTitle: 'Maximum Retail Price (MRP) with "Inclusive of all taxes"',
      ruleClause: 'Missing "Inclusive of all taxes" on MRP',
      category: 'pricing_and_usp',
      status: 'FAIL',
      legalCitation: 'Rule 6(1)(e) & Rule 18 of LMPC Rules, 2011',
      description: `MRP price is declared (₹${declarations.mrpValue}), but the mandatory phrase 'inclusive of all taxes' or 'incl. of all taxes' is missing.`,
      extractedValue: declarations.rawMrpText || `₹ ${declarations.mrpValue}`,
      expectedFormat: 'Maximum Retail Price ₹ .... (inclusive of all taxes)',
      deficiencyReason: "Omission of the statutory wording 'inclusive of all taxes' or 'incl. of all taxes' violates Rule 6(1)(e).",
      recommendation: "Add '(inclusive of all taxes)' or '(incl. of all taxes)' adjacent to the MRP.",
      penaltyClause: 'Section 36(1) & Rule 18(2) of Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: true
    });
    summaryNotes.push("MRP is missing the mandatory phrase 'inclusive of all taxes' under Rule 6(1)(e).");
  } else {
    ruleResults.push({
      ruleId: 'rule_6_1_e_mrp',
      ruleCode: 'Rule 6(1)(e)',
      ruleTitle: 'Maximum Retail Price (MRP) with "Inclusive of all taxes"',
      ruleClause: 'Missing Maximum Retail Price (MRP)',
      category: 'pricing_and_usp',
      status: 'FAIL',
      legalCitation: 'Rule 6(1)(e) of LMPC Rules, 2011',
      description: 'Maximum Retail Price (MRP) is completely missing from the label.',
      expectedFormat: 'MRP ₹ .... (inclusive of all taxes)',
      deficiencyReason: 'Mandatory declaration under Rule 6(1)(e) missing.',
      recommendation: 'Declare MRP prominently on the Principal Display Panel.',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: true
    });
    summaryNotes.push('Critical: MRP declaration missing.');
  }

  // 6. Evaluate 2021/2022 Amendment - Unit Sale Price (USP)
  // Mandatory for packages > 1 kg or > 1 L or > 1 m or multi-piece
  let isUspMandatory = false;
  const netQtyVal = declarations.netQuantityValue || 0;
  const netQtyUnit = (declarations.netQuantityUnit || '').toLowerCase();

  if (
    (netQtyUnit === 'kg' && netQtyVal >= 1) ||
    (netQtyUnit === 'g' && netQtyVal > 1000) ||
    (netQtyUnit === 'l' && netQtyVal >= 1) ||
    (netQtyUnit === 'ml' && netQtyVal > 1000) ||
    (declarations.pieceCount && declarations.pieceCount > 1)
  ) {
    isUspMandatory = true;
  }

  if (isUspMandatory) {
    if (declarations.declaredUspValue && declarations.declaredUspValue > 0) {
      if (declarations.uspDiscrepancy) {
        ruleResults.push({
          ruleId: 'rule_6_1_e_usp',
          ruleCode: 'Rule 6(1)(e) USP',
          ruleTitle: 'Unit Sale Price (USP) Calculation Verification',
          ruleClause: 'USP Mathematical Discrepancy',
          category: 'pricing_and_usp',
          status: 'FAIL',
          legalCitation: 'Rule 6(1)(e) Proviso (as amended 2021/2022)',
          description: `Declared USP (₹${declarations.declaredUspValue}/${declarations.declaredUspUnit || 'unit'}) does not match the calculated rate (₹${declarations.calculatedUspValue}) based on MRP ₹${declarations.mrpValue} and Net Qty ${declarations.netQuantityValue} ${declarations.netQuantityUnit}.`,
          extractedValue: `Declared: ₹${declarations.declaredUspValue}, Calculated: ₹${declarations.calculatedUspValue}`,
          expectedFormat: `Unit Sale Price: ₹ ${declarations.calculatedUspValue} / ${declarations.netQuantityUnit === 'kg' ? 'kg' : 'g'}`,
          deficiencyReason: 'Declared unit sale price is mathematically inaccurate compared to declared MRP and net weight.',
          recommendation: `Correct USP declaration to ₹ ${declarations.calculatedUspValue} per ${declarations.netQuantityUnit === 'kg' ? 'kg' : 'g'}.`,
          penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
          penaltyAmountMin: 25000,
          penaltyAmountMax: 50000,
          isCritical: true
        });
        summaryNotes.push(`USP mathematical discrepancy detected: Declared ₹${declarations.declaredUspValue} vs Calculated ₹${declarations.calculatedUspValue}.`);
      } else {
        ruleResults.push({
          ruleId: 'rule_6_1_e_usp',
          ruleCode: 'Rule 6(1)(e) USP',
          ruleTitle: 'Unit Sale Price (USP) for Packages > 1 kg / 1 L',
          ruleClause: 'Mandatory USP Declaration Compliant',
          category: 'pricing_and_usp',
          status: 'PASS',
          legalCitation: 'Rule 6(1)(e) Proviso (as amended 2021/2022)',
          description: `Declared USP (₹${declarations.declaredUspValue} / ${declarations.declaredUspUnit || declarations.netQuantityUnit}) accurately matches the calculated rate.`,
          extractedValue: `₹ ${declarations.declaredUspValue} / ${declarations.declaredUspUnit || declarations.netQuantityUnit}`,
          expectedFormat: 'Unit Sale Price: ₹ [Rate] / [Unit]',
          penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
          penaltyAmountMin: 0,
          penaltyAmountMax: 0,
          isCritical: true
        });
      }
    } else {
      ruleResults.push({
        ruleId: 'rule_6_1_e_usp',
        ruleCode: 'Rule 6(1)(e) USP',
        ruleTitle: 'Unit Sale Price (USP) for Packages > 1 kg / 1 L',
        ruleClause: 'Missing Mandatory Unit Sale Price (USP)',
        category: 'pricing_and_usp',
        status: 'FAIL',
        legalCitation: 'Rule 6(1)(e) Proviso (as amended 2021/2022)',
        description: `This package has Net Quantity of ${declarations.netQuantityValue} ${declarations.netQuantityUnit} (exceeding 1 kg/1 L). Under the 2021/2022 Amendment, Unit Sale Price (USP) is MANDATORY.`,
        extractedValue: 'USP Not Declared',
        expectedFormat: `Unit Sale Price: ₹ ${declarations.calculatedUspValue || 'XX'} / ${declarations.netQuantityUnit === 'kg' ? 'kg' : 'g'}`,
        deficiencyReason: 'Mandatory USP declaration absent on package exceeding 1 kg/1 L threshold.',
        recommendation: `Print 'Unit Sale Price: ₹ ${declarations.calculatedUspValue || 'XX'} / ${declarations.netQuantityUnit}' on the principal display panel adjacent to MRP.`,
        penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
        penaltyAmountMin: 25000,
        penaltyAmountMax: 50000,
        isCritical: true
      });
      summaryNotes.push(`Mandatory Unit Sale Price (USP) is missing for package > 1 kg/1 L under 2021 Amendment.`);
    }
  } else {
    ruleResults.push({
      ruleId: 'rule_6_1_e_usp',
      ruleCode: 'Rule 6(1)(e) USP',
      ruleTitle: 'Unit Sale Price (USP)',
      ruleClause: 'USP Exemption Check',
      category: 'pricing_and_usp',
      status: 'NOT_APPLICABLE',
      legalCitation: 'Rule 6(1)(e) Proviso (as amended 2021/2022)',
      description: `Package net quantity (${declarations.netQuantityValue} ${declarations.netQuantityUnit}) is under the 1 kg / 1 L mandatory USP threshold. USP declaration is optional.`,
      extractedValue: declarations.declaredUspValue ? `₹${declarations.declaredUspValue}/${declarations.declaredUspUnit}` : 'Optional (Net Qty <= 1kg/1L)',
      expectedFormat: 'Optional for small pack size',
      penaltyClause: 'N/A',
      penaltyAmountMin: 0,
      penaltyAmountMax: 0,
      isCritical: false
    });
  }

  // 7. Evaluate Rule 6(1)(n) - Consumer Care / Grievance Redressal
  const hasCareEmail = Boolean(declarations.consumerCareEmail);
  const hasCarePhone = Boolean(declarations.consumerCarePhone);
  const hasCareAddressOrName = Boolean(declarations.consumerCareName || declarations.consumerCareAddress || declarations.manufacturerAddress);

  if (hasCareEmail && hasCarePhone && hasCareAddressOrName) {
    ruleResults.push({
      ruleId: 'rule_6_1_n_consumer_care',
      ruleCode: 'Rule 6(1)(n)',
      ruleTitle: 'Consumer Care Contact Details (Name, Address, Phone & Email)',
      ruleClause: 'All 4 Mandatory Consumer Care Elements Present',
      category: 'consumer_grievance',
      status: 'PASS',
      legalCitation: 'Rule 6(1)(n) of LMPC Rules, 2011',
      description: `Complete consumer grievance details declared (Email: ${declarations.consumerCareEmail}, Phone: ${declarations.consumerCarePhone}).`,
      extractedValue: `Phone: ${declarations.consumerCarePhone}, Email: ${declarations.consumerCareEmail}`,
      expectedFormat: 'Person/Office Name, Postal Address, Phone/Toll-free, and Email ID',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 0,
      penaltyAmountMax: 0,
      isCritical: true
    });
  } else if (!hasCareEmail || !hasCarePhone) {
    const missingElements = [];
    if (!hasCareEmail) missingElements.push('Email Address');
    if (!hasCarePhone) missingElements.push('Telephone / Toll-Free Number');

    ruleResults.push({
      ruleId: 'rule_6_1_n_consumer_care',
      ruleCode: 'Rule 6(1)(n)',
      ruleTitle: 'Consumer Care Contact Details (Name, Address, Phone & Email)',
      ruleClause: `Incomplete Consumer Care (Missing ${missingElements.join(' & ')})`,
      category: 'consumer_grievance',
      status: 'FAIL',
      legalCitation: 'Rule 6(1)(n) of LMPC Rules, 2011',
      description: `Consumer care declaration is incomplete. Missing mandatory elements: ${missingElements.join(' and ')}.`,
      extractedValue: `Phone: ${declarations.consumerCarePhone || 'None'}, Email: ${declarations.consumerCareEmail || 'None'}`,
      expectedFormat: 'Must include BOTH telephone number and valid email address under Rule 6(1)(n).',
      deficiencyReason: `Omitting ${missingElements.join(' and ')} is a direct statutory ground for issuance of compounding notices.`,
      recommendation: `Add '${missingElements.join(' and ')}' under Consumer Care / Feedback section on label.`,
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: true
    });
    summaryNotes.push(`Consumer care details are missing mandatory ${missingElements.join(' & ')} under Rule 6(1)(n).`);
  } else {
    ruleResults.push({
      ruleId: 'rule_6_1_n_consumer_care',
      ruleCode: 'Rule 6(1)(n)',
      ruleTitle: 'Consumer Care Contact Details',
      ruleClause: 'Missing Consumer Care Details',
      category: 'consumer_grievance',
      status: 'FAIL',
      legalCitation: 'Rule 6(1)(n) of LMPC Rules, 2011',
      description: 'Consumer care contact details completely absent from label.',
      expectedFormat: 'Person/Office Name, Postal Address, Phone/Toll-free, and Email ID',
      deficiencyReason: 'Mandatory declaration under Rule 6(1)(n) absent.',
      recommendation: 'Add Consumer Care Cell details on the label.',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: true
    });
    summaryNotes.push('Critical: Consumer care contact details completely absent.');
  }

  // 8. Evaluate Country of Origin / Import
  if (declarations.countryOfOrigin) {
    ruleResults.push({
      ruleId: 'rule_country_of_origin',
      ruleCode: 'Rule 6(1)(a) Proviso',
      ruleTitle: 'Country of Origin Declaration',
      ruleClause: 'Country of Origin / Manufacture Declared',
      category: 'import_and_origin',
      status: 'PASS',
      legalCitation: 'Rule 6(1)(a) Proviso & 2020 Country of Origin Advisory',
      description: `Country of origin prominently declared: ${declarations.countryOfOrigin}.`,
      extractedValue: declarations.countryOfOrigin,
      expectedFormat: 'Country of Origin: [Country Name] or Made in [Country]',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 0,
      penaltyAmountMax: 0,
      isCritical: true
    });
  } else {
    ruleResults.push({
      ruleId: 'rule_country_of_origin',
      ruleCode: 'Rule 6(1)(a) Proviso',
      ruleTitle: 'Country of Origin Declaration',
      ruleClause: 'Missing Country of Origin',
      category: 'import_and_origin',
      status: 'FAIL',
      legalCitation: 'Rule 6(1)(a) Proviso & 2020 Country of Origin Advisory',
      description: 'Country of origin / manufacture is missing from the package.',
      expectedFormat: 'Country of Origin: India / Made in [Country]',
      deficiencyReason: 'Mandatory transparency declaration absent.',
      recommendation: 'Declare Country of Origin explicitly on the principal display panel.',
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: true
    });
    summaryNotes.push('Country of Origin declaration missing under Rule 6(1)(a).');
  }

  // 9. Evaluate Rule 7 - Principal Display Panel & Font Height
  if (pdpCalc.isNumeralHeightCompliant) {
    ruleResults.push({
      ruleId: 'rule_7_pdp_font_size',
      ruleCode: 'Rule 7 & Table 1',
      ruleTitle: 'Principal Display Panel & Numeral Font Height',
      ruleClause: 'Minimum Font Height Compliance',
      category: 'pdp_and_typography',
      status: 'PASS',
      legalCitation: 'Rule 7, Rule 8 & Table 1 of LMPC Rules, 2011',
      description: `Measured numeral height (${pdpCalc.measuredNumeralHeightMm || pdpCalc.requiredMinNumeralHeightMm} mm) meets or exceeds the required statutory minimum (${pdpCalc.requiredMinNumeralHeightMm} mm) for net quantity ${pdpCalc.netQuantityGramsOrMl} g/ml.`,
      extractedValue: `${pdpCalc.measuredNumeralHeightMm || pdpCalc.requiredMinNumeralHeightMm} mm (Req: ${pdpCalc.requiredMinNumeralHeightMm} mm)`,
      expectedFormat: `Minimum numeral height: ${pdpCalc.requiredMinNumeralHeightMm} mm`,
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 0,
      penaltyAmountMax: 0,
      isCritical: false
    });
  } else {
    ruleResults.push({
      ruleId: 'rule_7_pdp_font_size',
      ruleCode: 'Rule 7 & Table 1',
      ruleTitle: 'Principal Display Panel & Numeral Font Height',
      ruleClause: 'Numeral Height Below Statutory Minimum',
      category: 'pdp_and_typography',
      status: 'FAIL',
      legalCitation: 'Rule 7, Rule 8 & Table 1 of LMPC Rules, 2011',
      description: `Measured numeral height (${pdpCalc.measuredNumeralHeightMm} mm) is below the statutory minimum of ${pdpCalc.requiredMinNumeralHeightMm} mm prescribed in Table 1 for net qty ${pdpCalc.netQuantityGramsOrMl} g/ml.`,
      extractedValue: `${pdpCalc.measuredNumeralHeightMm} mm (Statutory Minimum: ${pdpCalc.requiredMinNumeralHeightMm} mm)`,
      expectedFormat: `Minimum numeral height >= ${pdpCalc.requiredMinNumeralHeightMm} mm`,
      deficiencyReason: 'Font size of net weight numeral is too small under Table 1 of Rule 7.',
      recommendation: `Increase numeral font height to at least ${pdpCalc.requiredMinNumeralHeightMm} mm in the packaging artwork.`,
      penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
      penaltyAmountMin: 25000,
      penaltyAmountMax: 50000,
      isCritical: false
    });
    summaryNotes.push(`Numeral height is below the statutory minimum of ${pdpCalc.requiredMinNumeralHeightMm} mm under Rule 7 Table 1.`);
  }

  // 10. Evaluate Dimensions under Rule 6(1)(f) if category is textile/hardware/bedsheet/garment
  const isDimensionApplicable = /(bed|sheet|linen|towel|garment|cloth|shirt|pant|pipe|wire|curtain)/i.test(categoryName) || /(bed|sheet|linen|towel|garment|shirt|pant)/i.test(productName);
  if (isDimensionApplicable) {
    if (declarations.dimensions) {
      ruleResults.push({
        ruleId: 'rule_6_1_f_dimensions',
        ruleCode: 'Rule 6(1)(f)',
        ruleTitle: 'Sizes and Dimensions of Commodity',
        ruleClause: 'Metric Dimensions Declared',
        category: 'mandatory_declarations',
        status: 'PASS',
        legalCitation: 'Rule 6(1)(f) of LMPC Rules, 2011',
        description: `Dimensions declared in metric units (${declarations.dimensions}).`,
        extractedValue: declarations.dimensions,
        expectedFormat: 'Dimensions in cm / m (e.g. 228 cm x 254 cm)',
        penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
        penaltyAmountMin: 0,
        penaltyAmountMax: 0,
        isCritical: false
      });
    } else {
      ruleResults.push({
        ruleId: 'rule_6_1_f_dimensions',
        ruleCode: 'Rule 6(1)(f)',
        ruleTitle: 'Sizes and Dimensions of Commodity',
        ruleClause: 'Missing Dimensions for Applicable Commodity',
        category: 'mandatory_declarations',
        status: 'FAIL',
        legalCitation: 'Rule 6(1)(f) of LMPC Rules, 2011',
        description: `This commodity (${categoryName}) is sold by size/dimensions, but metric dimensions are missing from the package.`,
        extractedValue: 'Dimensions Not Declared',
        expectedFormat: 'Metric dimensions (Length x Width in cm or m)',
        deficiencyReason: 'Commodities sold by measurement must declare metric dimensions under Rule 6(1)(f).',
        recommendation: 'Declare dimensions in cm or m on the principal display panel.',
        penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
        penaltyAmountMin: 25000,
        penaltyAmountMax: 50000,
        isCritical: false
      });
      summaryNotes.push('Missing metric dimensions under Rule 6(1)(f) for size-dependent commodity.');
    }
  }

  // 11. Evaluate E-commerce Listing under Rule 6(10) if in e-commerce mode
  if (isEcommerceMode || ecommerceData) {
    const isEcomCompliant = ecommerceData ? ecommerceData.isAllMandatoryInfoOnPDP : false;
    if (isEcomCompliant) {
      ruleResults.push({
        ruleId: 'rule_6_10_ecommerce',
        ruleCode: 'Rule 6(10)',
        ruleTitle: 'E-Commerce Marketplace Digital Listing Declarations',
        ruleClause: 'Digital Listing Mandatory Declarations Compliance',
        category: 'ecommerce_compliance',
        status: 'PASS',
        legalCitation: 'Rule 6(10) (2017 Amendment)',
        description: 'All mandatory physical declarations (except mfg date) are displayed digitally on the product listing.',
        extractedValue: 'Digital listing displays full mandatory declarations',
        expectedFormat: 'Display of Mfr, Country of Origin, Net Qty, MRP, USP, and Consumer Care on digital page.',
        penaltyClause: 'Section 36(1) Legal Metrology Act, 2009',
        penaltyAmountMin: 0,
        penaltyAmountMax: 0,
        isCritical: true
      });
    } else {
      const missingList = ecommerceData?.missingOnlineDeclarations || ['Manufacturer Details', 'Country of Origin'];
      ruleResults.push({
        ruleId: 'rule_6_10_ecommerce',
        ruleCode: 'Rule 6(10)',
        ruleTitle: 'E-Commerce Marketplace Digital Listing Declarations',
        ruleClause: 'Incomplete Digital Listing Declarations',
        category: 'ecommerce_compliance',
        status: 'FAIL',
        legalCitation: 'Rule 6(10) (2017 Amendment)',
        description: `E-commerce product page is missing mandatory digital declarations: ${missingList.join(', ')}.`,
        extractedValue: `Missing: ${missingList.join(', ')}`,
        expectedFormat: 'Marketplace listing must declare Manufacturer, Country of Origin, Net Qty, MRP, USP, Consumer Care.',
        deficiencyReason: 'Under Rule 6(10), e-commerce platforms must display all mandatory declarations before checkout.',
        recommendation: `Update marketplace listing backend to display ${missingList.join(', ')}.`,
        penaltyClause: 'Section 36(1) & Section 49 Legal Metrology Act, 2009',
        penaltyAmountMin: 25000,
        penaltyAmountMax: 50000,
        isCritical: true
      });
      summaryNotes.push(`E-commerce listing missing mandatory digital declarations: ${missingList.join(', ')} under Rule 6(10).`);
    }
  }

  // Calculate Overall Scoring
  const applicableRules = ruleResults.filter(r => r.status !== 'NOT_APPLICABLE');
  const passedRules = applicableRules.filter(r => r.status === 'PASS').length;
  const failedRules = applicableRules.filter(r => r.status === 'FAIL').length;
  const warningRules = applicableRules.filter(r => r.status === 'WARNING').length;
  const criticalViolations = applicableRules.filter(r => r.status === 'FAIL' && r.isCritical).length;

  const totalPointsPossible = applicableRules.reduce((acc, r) => acc + (r.isCritical ? 20 : 10), 0);
  const earnedPoints = applicableRules.reduce((acc, r) => {
    if (r.status === 'PASS') return acc + (r.isCritical ? 20 : 10);
    if (r.status === 'WARNING') return acc + (r.isCritical ? 10 : 5);
    return acc;
  }, 0);

  let overallScore = totalPointsPossible > 0 ? Math.round((earnedPoints / totalPointsPossible) * 100) : 100;

  let overallStatus: OverallComplianceStatus = 'COMPLIANT';
  if (failedRules > 0 || criticalViolations > 0) {
    overallStatus = 'NON_COMPLIANT';
  } else if (warningRules > 0) {
    overallStatus = 'WARNING';
  }

  // AI-Based Tampering & Anomaly Detection
  const tamperReport = detectLabelTampering(declarations, labelImages, input.tamperDefaults);
  if (tamperReport.isTampered) {
    overallStatus = 'NON_COMPLIANT';
    overallScore = Math.min(overallScore, Math.max(15, 100 - tamperReport.tamperRiskScore));
    summaryNotes.unshift(`⚠️ ${tamperReport.summary}`);
  }

  // Penalty Estimate under Section 36
  const penaltyEstimate: PenaltyEstimate = {
    section: 'Section 36 of Legal Metrology Act, 2009',
    firstOffenseMinFine: failedRules > 0 || tamperReport.isTampered ? 25000 : 0,
    firstOffenseMaxFine: failedRules > 0 || tamperReport.isTampered ? 25000 * Math.max(1, Math.min(failedRules + (tamperReport.isTampered ? 2 : 0), 4)) : 0,
    secondOffenseMaxFine: 50000,
    subsequentOffenseMaxFine: 100000,
    imprisonmentMonthsMax: 12,
    compoundingPossible: failedRules > 0 || tamperReport.isTampered,
    legalSummary: failedRules > 0 || tamperReport.isTampered
      ? `Violation of Legal Metrology (Packaged Commodities) Rules, 2011 renders the manufacturer/packer/importer liable under Section 36(1) of the Act. First offence fine is ₹25,000; second offence is ₹50,000; repeat offences attract ₹1,00,000 fine and/or imprisonment up to 1 year.`
      : 'Full statutory compliance observed under Legal Metrology (Packaged Commodities) Rules, 2011.'
  };

  // Enforcement Officer Priority Triage
  const inspectorTriage = calculatePriorityTriage(overallStatus, ruleResults, tamperReport, penaltyEstimate);

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return {
    inspectionId: productId,
    inspectionDate: todayStr,
    inspectorName: 'Legal Metrology Compliance Inspector',
    productName,
    brandName,
    categoryName,
    productSku,
    overallScore,
    overallStatus,
    totalRulesChecked: applicableRules.length,
    passedRulesCount: passedRules,
    failedRulesCount: failedRules,
    warningRulesCount: warningRules,
    criticalViolationsCount: criticalViolations + (tamperReport.isTampered ? 1 : 0),
    declarations,
    ruleResults,
    pdpCalculation: pdpCalc,
    penaltyEstimate,
    labelImages,
    activeImageId,
    ecommerceData,
    summaryNotes: summaryNotes.length > 0 ? summaryNotes : ['All mandatory Legal Metrology statutory declarations verified and compliant.'],
    tamperReport,
    inspectorTriage
  };
}