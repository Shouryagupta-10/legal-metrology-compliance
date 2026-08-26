import { evaluateCompliance } from '../src/services/ruleEngine';
import { calculatePDP } from '../src/services/pdpCalculator';
import { extractDeclarationsFromText } from '../src/services/extractorService';
import { SAMPLE_PRODUCTS } from '../src/services/sampleData';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('=== LEGAL METROLOGY COMPLIANCE SUITE TESTS ===\n');

// Test 1: Compliant Basmati Rice (5 kg)
console.log('--- Test 1: Heritage Basmati Rice (5 kg) ---');
const sample1 = SAMPLE_PRODUCTS[0];
const report1 = evaluateCompliance({
  productName: sample1.name,
  brandName: sample1.brand,
  categoryName: sample1.category,
  declarations: sample1.declarations,
  pdpInput: {
    packageShape: sample1.pdpDefaults.shape,
    heightMm: sample1.pdpDefaults.heightMm,
    widthMm: sample1.pdpDefaults.widthMm,
    depthMm: sample1.pdpDefaults.depthMm,
    measuredNumeralHeightMm: sample1.pdpDefaults.measuredFontHeightMm
  }
});
assert(report1.overallStatus === 'COMPLIANT', 'Sample 1 must be COMPLIANT');
assert(report1.overallScore === 100, 'Sample 1 score must be 100%');
assert(report1.failedRulesCount === 0, 'Sample 1 must have 0 violations');

// Test 2: Prohibited Unit "gms" on Chips
console.log('\n--- Test 2: Illegal Unit "gms" on Potato Chips ---');
const sample2 = SAMPLE_PRODUCTS[1];
const report2 = evaluateCompliance({
  productName: sample2.name,
  brandName: sample2.brand,
  categoryName: sample2.category,
  declarations: sample2.declarations
});
assert(report2.overallStatus === 'NON_COMPLIANT', 'Sample 2 must be NON_COMPLIANT');
const netQtyRule = report2.ruleResults.find(r => r.ruleId === 'rule_6_1_c_net_qty');
assert(netQtyRule?.status === 'FAIL', 'Rule 6(1)(c) must FAIL on "gms"');

// Test 3: Missing "inclusive of all taxes" on MRP
console.log('\n--- Test 3: Missing "inclusive of all taxes" ---');
const sample3 = SAMPLE_PRODUCTS[2];
const report3 = evaluateCompliance({
  productName: sample3.name,
  brandName: sample3.brand,
  categoryName: sample3.category,
  declarations: sample3.declarations
});
assert(report3.overallStatus === 'NON_COMPLIANT', 'Sample 3 must be NON_COMPLIANT');
const mrpRule = report3.ruleResults.find(r => r.ruleId === 'rule_6_1_e_mrp');
assert(mrpRule?.status === 'FAIL', 'Rule 6(1)(e) must FAIL when tax inclusive phrase is omitted');

// Test 4: Missing Unit Sale Price (USP) on > 1 L
console.log('\n--- Test 4: Missing Mandatory USP on 2 L Oil Pack ---');
const sample4 = SAMPLE_PRODUCTS[3];
const report4 = evaluateCompliance({
  productName: sample4.name,
  brandName: sample4.brand,
  categoryName: sample4.category,
  declarations: sample4.declarations
});
const uspRule = report4.ruleResults.find(r => r.ruleId === 'rule_6_1_e_usp');
assert(uspRule?.status === 'FAIL', 'USP Rule must FAIL on 2 L pack with no declared USP');

// Test 5: Principal Display Panel (PDP) & Font Height under Rule 7
console.log('\n--- Test 5: Rule 7 PDP & Table 1 Font Height Calculation ---');
const pdpSmall = calculatePDP({
  packageShape: 'rectangular',
  heightMm: 100,
  widthMm: 50,
  depthMm: 20,
  netQuantityValue: 40,
  netQuantityUnit: 'g',
  measuredNumeralHeightMm: 1.6
});
assert(pdpSmall.requiredMinNumeralHeightMm === 1.5, 'Net Qty 40g requires min 1.5 mm numeral height');
assert(pdpSmall.isNumeralHeightCompliant === true, '1.6 mm measured height >= 1.5 mm required');

const pdpLarge = calculatePDP({
  packageShape: 'rectangular',
  heightMm: 300,
  widthMm: 200,
  depthMm: 80,
  netQuantityValue: 2000,
  netQuantityUnit: 'g',
  measuredNumeralHeightMm: 3.5 // Violates 6.0 mm required
});
assert(pdpLarge.requiredMinNumeralHeightMm === 6.0, 'Net Qty 2000g (>1kg) requires min 6.0 mm numeral height');
assert(pdpLarge.isNumeralHeightCompliant === false, '3.5 mm measured height < 6.0 mm required');

// Test 6: Text Parser Heuristics
console.log('\n--- Test 6: OCR Extraction Heuristics ---');
const parsed = extractDeclarationsFromText(`
  Premium Coffee Beans
  Net Weight: 1 kg
  MRP Rs. 550.00 (inclusive of all taxes)
  Unit Sale Price: Rs. 550.00 / kg
  Mfg Date: 08/2026
  Mfg by: Blue Hills Coffee Estate, Chikmagalur, Karnataka - 577101
  Consumer Care: care@bluehills.in | 1800-425-0011
  Country of Origin: India
`);
assert(parsed.netQuantityValue === 1, 'Extracted Net Qty value must be 1');
assert(parsed.netQuantityUnit === 'kg', 'Extracted Net Qty unit must be kg');
assert(parsed.mrpValue === 550, 'Extracted MRP must be 550');
assert(parsed.isTaxesInclusiveDeclared === true, 'Extracted tax inclusivity must be true');
assert(parsed.manufacturerPin === '577101', 'Extracted PIN code must be 577101');
assert(parsed.countryOfOrigin === 'India', 'Extracted country of origin must be India');

console.log('\n🎉 ALL 6 TEST SCENARIOS PASSED WITH ZERO REGRESSIONS!');
