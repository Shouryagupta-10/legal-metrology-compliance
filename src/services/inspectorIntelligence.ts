import {
  RuleResult,
  OverallComplianceStatus,
  TamperAnomalyReport,
  PenaltyEstimate,
  InspectorPriorityTriage,
  GeospatialHotspotData,
  ManufacturerTrendData
} from '../types/compliance';

/**
 * Calculates Enforcement Officer Priority Triage for an inspected SKU.
 * Ranks cases into actionable tiers so inspectors can prioritize physical seizure
 * and formal summons over minor technical warnings.
 */
export function calculatePriorityTriage(
  overallStatus: OverallComplianceStatus,
  ruleResults: RuleResult[],
  tamperReport: TamperAnomalyReport,
  penaltyEstimate: PenaltyEstimate
): InspectorPriorityTriage {
  const failedRules = ruleResults.filter(r => r.status === 'FAIL');
  const hasCriticalRuleFailure = failedRules.some(r => r.isCritical);
  const hasTampering = tamperReport.isTampered || tamperReport.tamperRiskScore >= 45;

  // Tier 1: CRITICAL SEIZURE
  if (hasTampering || failedRules.some(r => r.ruleId === 'rule_6_1_c_net_qty' && r.status === 'FAIL' && r.deficiencyReason?.includes('Missing'))) {
    return {
      tier: 'CRITICAL_SEIZURE',
      priorityRank: 1,
      title: 'Priority 1: Immediate Product Seizure & Investigation',
      badgeColor: 'bg-rose-500 text-white shadow-rose-500/50',
      statutorySection: 'Section 15 & Section 36(1) of Legal Metrology Act, 2009',
      recommendedAction: 'Execute physical seizure of stock from retail shelves. Issue seizure memo under Form V and file police complaint/FIR for price manipulation.',
      urgencyHours: 24,
      isSeizureRecommended: true,
      actionChecklist: [
        'Issue seizure memo under Section 15(1) of Legal Metrology Act, 2009',
        'Collect 3 sealed samples from retailer inventory for government laboratory verification',
        'Serve formal Section 36(1) prosecution notice to manufacturer / packer',
        'Record retailer invoice to determine illicit margin gained through altered MRP'
      ]
    };
  }

  // Tier 2: SHOW CAUSE NOTICE
  if (overallStatus === 'NON_COMPLIANT' && hasCriticalRuleFailure) {
    return {
      tier: 'SHOW_CAUSE_NOTICE',
      priorityRank: 2,
      title: 'Priority 2: Statutory Show-Cause Notice Required',
      badgeColor: 'bg-amber-500 text-black shadow-amber-500/50',
      statutorySection: 'Section 36(1) & Rule 6(1) of Legal Metrology Rules, 2011',
      recommendedAction: 'Serve 7-day Statutory Show-Cause Notice demanding written justification and proof of mandatory declarations.',
      urgencyHours: 72,
      isSeizureRecommended: false,
      actionChecklist: [
        'Dispatch formal Show-Cause Notice via registered speed post / official portal',
        'Demand manufacturer batch records and cylinder printing proofs within 7 working days',
        'Freeze online e-commerce marketplace listings pending physical compliance clearance',
        'Initiate compounding assessment under Section 48 if manufacturer submits voluntary plea'
      ]
    };
  }

  // Tier 3: TECHNICAL RECTIFICATION
  if (overallStatus === 'WARNING' || failedRules.length > 0) {
    return {
      tier: 'TECHNICAL_RECTIFICATION',
      priorityRank: 3,
      title: 'Priority 3: 15-Day Compounding & Rectification Notice',
      badgeColor: 'bg-sky-500 text-white shadow-sky-500/50',
      statutorySection: 'Section 48 (Compounding) & Rule 7 Schedule II Tables',
      recommendedAction: 'Allow 15-day rectification window for typography/font-size deficit with standard compounding fee.',
      urgencyHours: 360,
      isSeizureRecommended: false,
      actionChecklist: [
        'Serve 15-day technical rectification notice citing Schedule II numeral height deficiencies',
        'Provide manufacturer with calibrated PDP dimension requirements',
        'Allow voluntary compounding fee of ₹25,000 per parameter under Section 48',
        'Schedule follow-up audit for subsequent production batches'
      ]
    };
  }

  // Tier 4: CLEARED
  return {
    tier: 'CLEARED',
    priorityRank: 4,
    title: 'Priority 4: Formally Cleared — 100% Statutory Adherence',
    badgeColor: 'bg-emerald-500 text-white shadow-emerald-500/50',
    statutorySection: 'LMPC Rules 2011 / 2024 Harmonized Standards',
    recommendedAction: 'Issue digital Certificate of Metrological Compliance. No further officer intervention needed.',
    urgencyHours: 0,
    isSeizureRecommended: false,
    actionChecklist: [
      'Generate verifiable digital compliance QR stamp',
      'Record clean inspection score in National Metrology Registry',
      'Exempt SKU from random retail audit for 180 days'
    ]
  };
}

/**
 * Preloaded National Hotspot Enforcement Data across Indian States & Zones
 */
export const NATIONAL_HOTSPOTS_DATA: GeospatialHotspotData[] = [
  {
    stateCode: 'DL',
    stateName: 'Delhi-NCR',
    totalInspections: 12480,
    nonComplianceRate: 34.2,
    criticalViolationsCount: 1840,
    tamperingCasesCount: 420,
    topViolatedRule: 'Rule 6(1)(e) Dual MRP & Sticker Overlay',
    riskIndex: 'HIGH',
    districts: [
      { name: 'Central Delhi', rate: 41.5, inspections: 3200 },
      { name: 'South Delhi', rate: 28.1, inspections: 2900 },
      { name: 'East Delhi', rate: 38.6, inspections: 3100 },
      { name: 'North West Delhi', rate: 32.4, inspections: 3280 }
    ]
  },
  {
    stateCode: 'MH',
    stateName: 'Maharashtra',
    totalInspections: 18950,
    nonComplianceRate: 29.8,
    criticalViolationsCount: 2310,
    tamperingCasesCount: 510,
    topViolatedRule: 'Rule 6(1)(n) 2021 USP Omission',
    riskIndex: 'HIGH',
    districts: [
      { name: 'Mumbai Suburban', rate: 33.2, inspections: 6400 },
      { name: 'Pune', rate: 26.5, inspections: 4900 },
      { name: 'Nagpur', rate: 31.8, inspections: 3850 },
      { name: 'Thane', rate: 28.9, inspections: 3800 }
    ]
  },
  {
    stateCode: 'KA',
    stateName: 'Karnataka',
    totalInspections: 11200,
    nonComplianceRate: 22.4,
    criticalViolationsCount: 890,
    tamperingCasesCount: 180,
    topViolatedRule: 'Rule 7 Schedule II Numeral Height',
    riskIndex: 'MEDIUM',
    districts: [
      { name: 'Bengaluru Urban', rate: 24.1, inspections: 5200 },
      { name: 'Mysuru', rate: 19.8, inspections: 2400 },
      { name: 'Hubballi-Dharwad', rate: 21.6, inspections: 1900 },
      { name: 'Mangaluru', rate: 20.2, inspections: 1700 }
    ]
  },
  {
    stateCode: 'GJ',
    stateName: 'Gujarat',
    totalInspections: 14300,
    nonComplianceRate: 26.7,
    criticalViolationsCount: 1420,
    tamperingCasesCount: 340,
    topViolatedRule: 'Rule 6(1)(c) Non-Standard Unit Syntax',
    riskIndex: 'MEDIUM',
    districts: [
      { name: 'Ahmedabad', rate: 30.5, inspections: 4800 },
      { name: 'Surat', rate: 27.2, inspections: 4100 },
      { name: 'Vadodara', rate: 23.9, inspections: 2900 },
      { name: 'Rajkot', rate: 22.1, inspections: 2500 }
    ]
  },
  {
    stateCode: 'TN',
    stateName: 'Tamil Nadu',
    totalInspections: 13800,
    nonComplianceRate: 18.9,
    criticalViolationsCount: 780,
    tamperingCasesCount: 120,
    topViolatedRule: 'Rule 6(1)(d) Best Before Period Missing',
    riskIndex: 'LOW',
    districts: [
      { name: 'Chennai', rate: 21.4, inspections: 5100 },
      { name: 'Coimbatore', rate: 17.5, inspections: 3600 },
      { name: 'Madurai', rate: 18.2, inspections: 2700 },
      { name: 'Tiruchirappalli', rate: 16.1, inspections: 2400 }
    ]
  },
  {
    stateCode: 'UP',
    stateName: 'Uttar Pradesh',
    totalInspections: 22400,
    nonComplianceRate: 38.6,
    criticalViolationsCount: 3950,
    tamperingCasesCount: 890,
    topViolatedRule: 'Rule 6(1)(e) Dual MRP & Omitted Taxes',
    riskIndex: 'HIGH',
    districts: [
      { name: 'Lucknow', rate: 36.2, inspections: 5800 },
      { name: 'Kanpur Nagar', rate: 42.1, inspections: 5400 },
      { name: 'Gautam Buddha Nagar (Noida)', rate: 31.8, inspections: 6100 },
      { name: 'Varanasi', rate: 41.5, inspections: 5100 }
    ]
  }
];

/**
 * Preloaded Manufacturer Compliance & Repeat Offender Registry
 */
export const MANUFACTURER_REGISTRY_DATA: ManufacturerTrendData[] = [
  {
    id: 'mfr-1',
    brandName: 'Royal Heritage Foods',
    manufacturerName: 'HERITAGE FOODS PVT. LTD.',
    category: 'Grains & Staples',
    totalAudited: 48,
    compliantCount: 47,
    tamperedCount: 0,
    complianceScoreAvg: 98.4,
    repeatOffender: false,
    riskGrade: 'A+',
    lastInspectionDate: '2026-08-24'
  },
  {
    id: 'mfr-2',
    brandName: 'Crunchies Snack Foods',
    manufacturerName: 'CRUNCHIES SNACK FOODS LTD.',
    category: 'Packaged Snacks',
    totalAudited: 34,
    compliantCount: 18,
    tamperedCount: 2,
    complianceScoreAvg: 74.2,
    repeatOffender: true,
    riskGrade: 'C',
    lastInspectionDate: '2026-08-19'
  },
  {
    id: 'mfr-3',
    brandName: 'Aura Glow Labs',
    manufacturerName: 'AURA GLOW LABS INC.',
    category: 'Cosmetics & Personal Care',
    totalAudited: 26,
    compliantCount: 14,
    tamperedCount: 1,
    complianceScoreAvg: 71.8,
    repeatOffender: true,
    riskGrade: 'C',
    lastInspectionDate: '2026-08-12'
  },
  {
    id: 'mfr-4',
    brandName: 'Sunpure Oils',
    manufacturerName: 'SUNPURE AGRO OILS PVT. LTD.',
    category: 'Edible Oils & Fats',
    totalAudited: 42,
    compliantCount: 36,
    tamperedCount: 0,
    complianceScoreAvg: 89.1,
    repeatOffender: false,
    riskGrade: 'B',
    lastInspectionDate: '2026-08-22'
  },
  {
    id: 'mfr-5',
    brandName: 'Shree Agro Foods (Suspect)',
    manufacturerName: 'SHREE AGRO DISTRIBUTORS',
    category: 'Dairy & Ghee',
    totalAudited: 19,
    compliantCount: 3,
    tamperedCount: 9,
    complianceScoreAvg: 38.6,
    repeatOffender: true,
    riskGrade: 'HIGH_RISK',
    lastInspectionDate: '2026-08-27'
  }
];
