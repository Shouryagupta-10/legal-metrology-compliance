import { SampleProduct } from '../types/compliance';

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 'sample-1',
    name: 'Royal Heritage Basmati Rice (5 kg)',
    brand: 'Royal Heritage Foods',
    category: 'Grains & Staples (FMCG)',
    thumbnail: '/samples/rice.jpg',
    declarations: {
      manufacturerName: 'HERITAGE FOODS PVT. LTD.',
      manufacturerAddress: 'Survey No. 45/1, Industrial Estate, Patancheru, Sangareddy Dist., Telangana - 502319, INDIA',
      manufacturerPin: '502319',
      manufacturerState: 'Telangana',
      commodityName: 'Premium Long Grain Basmati Rice (Aged)',
      commonOrGenericName: 'Basmati Rice',
      netQuantityValue: 5,
      netQuantityUnit: 'kg',
      rawNetQuantityText: 'NET QUANTITY: 5 kg',
      netQuantitySymbolValid: true,
      mfgMonth: 10,
      mfgYear: 2023,
      rawMfgDateText: 'Packed on: 12 OCT 2023',
      expiryDate: 'Best Before 24 Months from Packaging',
      bestBeforePeriod: '24 Months',
      mrpValue: 650,
      rawMrpText: 'M.R.P. ₹650.00 (Inclusive of all Taxes)',
      isTaxesInclusiveDeclared: true,
      rawTaxDeclarationText: 'Inclusive of all Taxes',
      declaredUspValue: 130,
      declaredUspUnit: 'kg',
      rawUspText: 'UNIT SALE PRICE: ₹130.00 / kg',
      calculatedUspValue: 130,
      uspDiscrepancy: false,
      consumerCareName: 'Consumer Care Cell',
      consumerCareAddress: 'Heritage Foods, Sangareddy Dist., Telangana - 502319',
      consumerCarePhone: '1800-425-1947',
      consumerCareEmail: 'care@heritagefoods.in',
      countryOfOrigin: 'India',
      fssaiNumber: '10014047000109',
      barcode: '8901234567890'
    },
    pdpDefaults: {
      shape: 'packet_pouch',
      heightMm: 360,
      widthMm: 240,
      depthMm: 80,
      measuredFontHeightMm: 6.5
    },
    expectedCompliance: 'COMPLIANT',
    scenarioDescription: '100% Compliant FMCG package: Accurately declares standard unit "5 kg", MRP with taxes inclusive, mandatory Unit Sale Price ₹130/kg, 6-digit PIN 502319, and full consumer care contact.',
    tags: ['100% Compliant', 'FMCG Grain', 'USP Compliant', 'FSSAI Certified'],
    labelImages: [
      {
        id: 'img-s1-1',
        viewType: 'front',
        url: '/samples/rice.jpg',
        name: 'Royal Basmati Rice 5kg Commercial Pack',
        boundingBoxes: [
          { id: 'b1', field: 'brand', text: 'ROYAL BASMATI RICE', x: 38, y: 22, width: 29, height: 8, confidence: 0.99, status: 'valid' },
          { id: 'b2', field: 'commodityName', text: 'PREMIUM LONG GRAIN RICE TRADITIONAL | AGED', x: 35, y: 36, width: 31, height: 5, confidence: 0.98, status: 'valid', ruleCitation: 'Rule 6(1)(b)' },
          { id: 'b3', field: 'netQuantity', text: 'NET QUANTITY: 5 kg', x: 34, y: 41.5, width: 29, height: 4.5, confidence: 0.99, status: 'valid', ruleCitation: 'Rule 6(1)(c)' },
          { id: 'b4', field: 'mrp', text: 'M.R.P. ₹650.00 (Inclusive of all Taxes)', x: 34, y: 46.5, width: 32, height: 4.5, confidence: 0.98, status: 'valid', ruleCitation: 'Rule 6(1)(e)' },
          { id: 'b5', field: 'usp', text: 'UNIT SALE PRICE: ₹130.00 / kg', x: 34, y: 51, width: 33, height: 4, confidence: 0.97, status: 'valid', ruleCitation: 'Rule 6(1)(e) USP' },
          { id: 'b6', field: 'mfgDate', text: 'Packed on: 12 OCT 2023', x: 34, y: 61, width: 25, height: 3.5, confidence: 0.96, status: 'valid', ruleCitation: 'Rule 6(1)(d)' },
          { id: 'b7', field: 'manufacturer', text: 'HERITAGE FOODS PVT. LTD., Telangana - 502319', x: 34, y: 68.5, width: 30, height: 8, confidence: 0.96, status: 'valid', ruleCitation: 'Rule 6(1)(a)' },
          { id: 'b8', field: 'fssai', text: 'FSSAI Lic. No. 10014047000109', x: 34, y: 76.5, width: 28, height: 3, confidence: 0.98, status: 'valid' },
          { id: 'b9', field: 'barcode', text: '8901234567890', x: 35, y: 79.5, width: 20, height: 7.5, confidence: 0.99, status: 'valid' }
        ]
      }
    ]
  },
  {
    id: 'sample-2',
    name: 'Indian Masala Potato Chips (75 g)',
    brand: 'Crunchies Snack Foods',
    category: 'Snacks & Confectionery',
    thumbnail: '/samples/chips.jpg',
    declarations: {
      manufacturerName: 'Crunchies Snack Foods',
      manufacturerAddress: 'Plot No. 42, GIDC, Ahmedabad, Gujarat - 380015, India.',
      manufacturerPin: '380015',
      manufacturerState: 'Gujarat',
      commodityName: 'Indian Masala Potato Chips',
      commonOrGenericName: 'Potato Chips',
      netQuantityValue: 75,
      netQuantityUnit: 'gms', // ILLEGAL PROHIBITED UNIT NOTATION
      rawNetQuantityText: 'Net Wt: 75 gms',
      netQuantitySymbolValid: false,
      mfgMonth: 10,
      mfgYear: 2023,
      rawMfgDateText: 'Mfg. Date: OCT 2023',
      expiryDate: 'Expiry Date: JAN 2024',
      mrpValue: 30,
      rawMrpText: 'M.R.P. ₹30.00 (Inclusive of all taxes)',
      isTaxesInclusiveDeclared: true,
      rawTaxDeclarationText: 'Inclusive of all taxes',
      consumerCarePhone: '+91-79-26561234',
      consumerCareAddress: 'Crunchies Snack Foods, Ahmedabad',
      countryOfOrigin: 'India',
      fssaiNumber: '10719001000789',
      barcode: '8901234567890'
    },
    pdpDefaults: {
      shape: 'packet_pouch',
      heightMm: 220,
      widthMm: 160,
      depthMm: 40,
      measuredFontHeightMm: 2.2
    },
    expectedCompliance: 'NON_COMPLIANT',
    scenarioDescription: 'Statutory Defect: Uses prohibited illegal unit notation "75 gms" instead of standard "75 g" (Rule 11 & 13) and omits mandatory Consumer Care Email ID (Rule 6(1)(n)).',
    tags: ['Statutory Defect', 'Illegal Unit "gms"', 'Rule 11 Violation', 'Snack Pouch'],
    labelImages: [
      {
        id: 'img-s2-1',
        viewType: 'front',
        url: '/samples/chips.jpg',
        name: 'Indian Masala Chips Foil Pack',
        boundingBoxes: [
          { id: 'b1', field: 'commodityName', text: 'Indian Masala Potato Chips', x: 18, y: 22, width: 25, height: 10, confidence: 0.98, status: 'valid', ruleCitation: 'Rule 6(1)(b)' },
          { id: 'b2', field: 'netQuantity', text: 'Net Wt: 75 gms', x: 55, y: 36, width: 25, height: 4.5, confidence: 0.99, status: 'invalid', ruleCitation: 'Rule 6(1)(c) / Rule 11 (PROHIBITED "gms")' },
          { id: 'b3', field: 'mrp', text: 'M.R.P. ₹30.00 (Inclusive of all taxes)', x: 55, y: 40, width: 24, height: 4.5, confidence: 0.97, status: 'valid', ruleCitation: 'Rule 6(1)(e)' },
          { id: 'b4', field: 'mfgDate', text: 'Mfg. Date: OCT 2023', x: 55, y: 44.5, width: 25, height: 3.5, confidence: 0.96, status: 'valid', ruleCitation: 'Rule 6(1)(d)' },
          { id: 'b5', field: 'manufacturer', text: 'Crunchies Snack Foods, Ahmedabad - 380015', x: 54, y: 55, width: 25, height: 11, confidence: 0.95, status: 'valid', ruleCitation: 'Rule 6(1)(a)' },
          { id: 'b6', field: 'consumerCare', text: 'Customer Contact: Phone Only (Email Missing)', x: 18, y: 75, width: 25, height: 8, confidence: 0.94, status: 'invalid', ruleCitation: 'Rule 6(1)(n) (Email Missing)' },
          { id: 'b7', field: 'barcode', text: '8901234567890', x: 57, y: 70, width: 24, height: 11, confidence: 0.99, status: 'valid' }
        ]
      }
    ]
  },
  {
    id: 'sample-3',
    name: 'Luxe Winter Cold Cream (100 ml)',
    brand: 'Aura Glow Labs',
    category: 'Cosmetics & Personal Care',
    thumbnail: '/samples/cream.jpg',
    declarations: {
      manufacturerName: 'Aura Glow Labs Pvt. Ltd.',
      manufacturerAddress: 'Industrial Area, Jaipur, India (PIN Code missing)',
      manufacturerState: 'Rajasthan',
      commodityName: 'Luxe Winter Cold Cream (Hydrating & Nourishing)',
      commonOrGenericName: 'Cold Cream',
      netQuantityValue: 100,
      netQuantityUnit: 'ml',
      rawNetQuantityText: 'Net Vol: 100 ml',
      netQuantitySymbolValid: true,
      mfgMonth: 11,
      mfgYear: 2023,
      rawMfgDateText: 'Mfg: 11/2023',
      expiryDate: 'Exp: 10/2025',
      mrpValue: 199,
      rawMrpText: 'MRP Rs. 199/-',
      isTaxesInclusiveDeclared: false, // VIOLATION: Missing "(inclusive of all taxes)"
      rawTaxDeclarationText: '',
      consumerCarePhone: '1800-444-2211',
      consumerCareEmail: 'care@auraglow.in',
      countryOfOrigin: 'India'
    },
    pdpDefaults: {
      shape: 'cylindrical',
      heightMm: 70,
      widthMm: 65,
      depthMm: 65,
      diameterMm: 65,
      measuredFontHeightMm: 2.0
    },
    expectedCompliance: 'NON_COMPLIANT',
    scenarioDescription: 'Statutory Defect: Declares "MRP Rs. 199/-" omitting mandatory phrase "(inclusive of all taxes)" under Rule 6(1)(e), and manufacturer address is missing mandatory 6-digit PIN code.',
    tags: ['Statutory Defect', 'Missing Tax Declaration', 'Incomplete Address', 'Cosmetics Box'],
    labelImages: [
      {
        id: 'img-s3-1',
        viewType: 'front',
        url: '/samples/cream.jpg',
        name: 'Luxe Cold Cream Jar & Carton',
        boundingBoxes: [
          { id: 'b1', field: 'commodityName', text: 'LUXE WINTER COLD CREAM', x: 30, y: 52, width: 20, height: 7, confidence: 0.98, status: 'valid', ruleCitation: 'Rule 6(1)(b)' },
          { id: 'b2', field: 'netQuantity', text: 'Net Vol: 100 ml', x: 12, y: 61, width: 9, height: 3, confidence: 0.99, status: 'valid', ruleCitation: 'Rule 6(1)(c)' },
          { id: 'b3', field: 'mrp', text: 'MRP Rs. 199/- (Missing Tax Note)', x: 12, y: 63.5, width: 9, height: 2.5, confidence: 0.97, status: 'invalid', ruleCitation: 'Rule 6(1)(e) (Missing "inclusive of all taxes")' },
          { id: 'b4', field: 'manufacturer', text: 'Aura Glow Labs, Jaipur (Missing PIN)', x: 11, y: 65.5, width: 10, height: 4, confidence: 0.94, status: 'invalid', ruleCitation: 'Rule 6(1)(a) (Missing PIN Code)' },
          { id: 'b5', field: 'jarLabel', text: 'Aura Glow Labs 100 ml Jar', x: 58, y: 60, width: 27, height: 15, confidence: 0.98, status: 'valid' }
        ]
      }
    ]
  },
  {
    id: 'sample-4',
    name: 'Sunpure Refined Sunflower Oil (2 L)',
    brand: 'Sunpure Oils',
    category: 'Edible Oils & Fats',
    thumbnail: '/samples/oil.jpg',
    declarations: {
      manufacturerName: 'SUNPURE AGRO OILS LTD.',
      manufacturerAddress: 'Survey No. 45, Bangalore - 560089, India',
      manufacturerPin: '560089',
      manufacturerState: 'Karnataka',
      commodityName: 'Refined Sunflower Cooking Oil',
      commonOrGenericName: 'Sunflower Oil',
      netQuantityValue: 2,
      netQuantityUnit: 'l',
      rawNetQuantityText: 'Net Volume: 2 L',
      netQuantitySymbolValid: true,
      mfgMonth: 8,
      mfgYear: 2023,
      rawMfgDateText: 'Best Before 12 Months',
      expiryDate: 'Best Before 12 Months',
      mrpValue: 380,
      rawMrpText: 'MRP: ₹ 380.00 (Inclusive of all taxes)',
      isTaxesInclusiveDeclared: true,
      rawTaxDeclarationText: 'Inclusive of all taxes',
      // VIOLATION: Net volume > 1 L, but Unit Sale Price (USP) is NOT declared!
      declaredUspValue: undefined,
      declaredUspUnit: undefined,
      rawUspText: undefined,
      calculatedUspValue: 190,
      consumerCarePhone: '1800-111-9988',
      consumerCareEmail: 'care@sunpure.in',
      countryOfOrigin: 'India',
      fssaiNumber: '10023022002345',
      barcode: '8901234567890'
    },
    pdpDefaults: {
      shape: 'cylindrical',
      heightMm: 290,
      widthMm: 130,
      depthMm: 130,
      diameterMm: 130,
      measuredFontHeightMm: 6.2
    },
    expectedCompliance: 'NON_COMPLIANT',
    scenarioDescription: '2021 Second Amendment Violation: Package volume is 2 Litres (exceeding 1 L threshold), but fails to declare mandatory Unit Sale Price (USP) of ₹ 190.00 / L next to MRP.',
    tags: ['Statutory Defect', 'Missing USP', '2021 LMPC Amendment', 'Cooking Oil'],
    labelImages: [
      {
        id: 'img-s4-1',
        viewType: 'front',
        url: '/samples/oil.jpg',
        name: 'Sunpure Sunflower Oil 2L Bottle',
        boundingBoxes: [
          { id: 'b1', field: 'brand', text: 'SUNPURE', x: 16, y: 53, width: 25, height: 7, confidence: 0.99, status: 'valid' },
          { id: 'b2', field: 'commodityName', text: 'REFINED SUNFLOWER COOKING OIL', x: 16, y: 60, width: 15, height: 5, confidence: 0.98, status: 'valid', ruleCitation: 'Rule 6(1)(b)' },
          { id: 'b3', field: 'netQuantity', text: 'Net Volume: 2 L', x: 72, y: 53.5, width: 14, height: 2.5, confidence: 0.99, status: 'valid', ruleCitation: 'Rule 6(1)(c)' },
          { id: 'b4', field: 'mrp', text: 'MRP: ₹ 380.00 (Inclusive of all taxes)', x: 72, y: 56.5, width: 15, height: 3.5, confidence: 0.97, status: 'valid', ruleCitation: 'Rule 6(1)(e)' },
          { id: 'b5', field: 'usp', text: 'USP NOT DECLARED', x: 72, y: 59.5, width: 15, height: 2, confidence: 0.95, status: 'invalid', ruleCitation: 'Rule 6(1)(e) USP (Missing USP on >1L pack)' },
          { id: 'b6', field: 'manufacturer', text: 'SUNPURE AGRO OILS LTD, Bangalore - 560089', x: 72, y: 60.5, width: 14, height: 4, confidence: 0.95, status: 'valid', ruleCitation: 'Rule 6(1)(a)' },
          { id: 'b7', field: 'fssai', text: 'FSSAI Lic. No. 10023022002345', x: 72, y: 64, width: 14, height: 3.5, confidence: 0.98, status: 'valid' },
          { id: 'b8', field: 'barcode', text: '8901234567890', x: 59, y: 68.5, width: 14, height: 5.5, confidence: 0.99, status: 'valid' }
        ]
      }
    ]
  }
];
