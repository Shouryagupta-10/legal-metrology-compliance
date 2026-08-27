import { RuleCategory } from '../types/compliance';

export interface RuleDefinition {
  id: string;
  code: string;
  clause: string;
  category: RuleCategory;
  title: string;
  description: string;
  statutoryReference: string;
  penaltySection: string;
  penaltySummary: string;
  isCritical: boolean;
  guidelines: string[];
}

export const LEGAL_METROLOGY_RULES: RuleDefinition[] = [
  {
    id: 'rule_6_1_a_mfg',
    code: 'Rule 6(1)(a)',
    clause: 'Manufacturer / Packer / Importer Name & Address',
    category: 'mandatory_declarations',
    title: 'Name and Complete Address of Manufacturer / Packer / Importer',
    description: 'Every package shall bear the name and complete address of the manufacturer, or where manufacturer is not the packer, the name and address of the manufacturer and packer. For imported goods, the name and address of the importer shall be declared.',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(a)',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltySummary: 'Fine up to ₹25,000 for first offence, ₹50,000 for second, and up to ₹1,00,000 or imprisonment up to 1 year for subsequent offences.',
    isCritical: true,
    guidelines: [
      'Complete address must include premise name/number, street/area, city/town, state, and 6-digit Indian PIN code.',
      'For imported goods, the country of origin/manufacture and importer registration details must be explicitly mentioned.',
      'Terms like "Mfg by", "Pkd by", or "Imported by" must precede the legal entity name.'
    ]
  },
  {
    id: 'rule_6_1_b_commodity',
    code: 'Rule 6(1)(b)',
    clause: 'Generic / Common Name of Commodity',
    category: 'mandatory_declarations',
    title: 'Generic or Common Name of Commodity',
    description: 'Every package shall bear the generic name or common name of the commodity contained in the package so as to enable consumers to identify what product is being bought.',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(b)',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltySummary: 'Fine up to ₹25,000 for first offence.',
    isCritical: true,
    guidelines: [
      'Must state common/generic name in clear English or Hindi in Devanagari script.',
      'Brand names or fancy names alone (e.g. "Crunchy Delight") without generic description (e.g. "Potato Chips") constitute a violation.'
    ]
  },
  {
    id: 'rule_6_1_c_net_qty',
    code: 'Rule 6(1)(c)',
    clause: 'Net Quantity Declaration & Standard Units',
    category: 'weights_and_measures',
    title: 'Net Quantity in Standard Units of Weight, Measure or Number',
    description: 'Every package shall bear the net quantity in terms of standard unit of weight or measure or number. Standard SI units must be strictly adhered to without prohibited non-standard symbols.',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(c), Rule 11, Rule 12 & Rule 13',
    penaltySection: 'Section 36(1) and Section 39 of Legal Metrology Act, 2009',
    penaltySummary: 'Fine up to ₹25,000 for first offence, ₹50,000 for second.',
    isCritical: true,
    guidelines: [
      'Allowed unit symbols: "g" (gram), "kg" (kilogram), "ml" or "mL" (millilitre), "l" or "L" (litre), "m" (metre), "cm" (centimetre), "mm" (millimetre), "N" or "U" (number/units).',
      'PROHIBITED symbols: "gm", "gms", "g.", "kgs", "KG", "ML", "ml.", "mtr", "mtrs", "nos", "ct", "pkts".',
      'No qualifying terms such as "approximately", "when packed", "jumbo size" are permitted before net quantity.'
    ]
  },
  {
    id: 'rule_6_1_d_mfg_date',
    code: 'Rule 6(1)(d)',
    clause: 'Month and Year of Manufacture / Packing / Import',
    category: 'mandatory_declarations',
    title: 'Month and Year of Manufacture / Packing / Import',
    description: 'Every package shall bear the month and year in which the commodity is manufactured or pre-packed or imported.',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(d)',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltySummary: 'Fine up to ₹25,000 for first offence.',
    isCritical: true,
    guidelines: [
      'Format should be MM/YYYY or Month YYYY (e.g., 08/2026 or August 2026).',
      'For commodities having expiry date or best before period, the date of manufacture/packing must still be clearly identifiable.'
    ]
  },
  {
    id: 'rule_6_1_e_mrp',
    code: 'Rule 6(1)(e)',
    clause: 'Maximum Retail Price (MRP) & Tax Declaration',
    category: 'pricing_and_usp',
    title: 'Maximum Retail Price (MRP) with "Inclusive of all taxes"',
    description: 'Every package shall bear the retail sale price of the package in the format: "Maximum or Max. Retail Price Rs. .... / ₹ .... inclusive of all taxes" or "MRP Rs. / ₹ .... incl. of all taxes".',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(e) & Rule 18',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009 & Rule 18(2)',
    penaltySummary: 'Fine up to ₹25,000 for first offence. Overcharging beyond MRP or dual MRP carries severe compounding penalty.',
    isCritical: true,
    guidelines: [
      'The words "inclusive of all taxes" or "incl. of all taxes" are MANDATORY. Omission is a direct violation under Rule 6(1)(e).',
      'Use Indian Rupee symbol "₹" or "Rs." or "INR".',
      'Dual pricing or smudge-over sticker prices without regulatory notification are illegal.'
    ]
  },
  {
    id: 'rule_6_1_e_usp',
    code: 'Rule 6(1)(e) - 2021 Amendment',
    clause: 'Unit Sale Price (USP) Declaration',
    category: 'pricing_and_usp',
    title: 'Unit Sale Price (USP) for Packages > 1 kg / 1 L / Multi-Item',
    description: 'Under the Legal Metrology (Packaged Commodities) (Second Amendment) Rules, 2021 (mandatory from Dec 2022), every package containing commodities with net quantity exceeding 1 kg or 1 L or 1 m, or sold by count, must declare the Unit Sale Price (USP) in Rupees per g, kg, ml, L, m, or piece/item.',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(e) Proviso (as amended 2021/2022)',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltySummary: 'Fine up to ₹25,000 for first offence.',
    isCritical: true,
    guidelines: [
      'Mandatory for packages > 1 kg (in ₹/g or ₹/kg), > 1 L (in ₹/ml or ₹/L), > 1 m (in ₹/m or ₹/cm), or items sold by number/count (in ₹/piece or ₹/N).',
      'Format: "Unit Sale Price: ₹ X / g" or "USP: ₹ Y / kg" or "₹ Z per ml".',
      'The declared USP must mathematically match (MRP / Net Quantity) rounded to two decimal places.'
    ]
  },
  {
    id: 'rule_6_1_f_dimensions',
    code: 'Rule 6(1)(f)',
    clause: 'Dimensions and Sizes for Applicable Commodities',
    category: 'mandatory_declarations',
    title: 'Sizes and Dimensions of Commodity',
    description: 'Where the commodity is sold by size or dimensions (such as textiles, garments, bedsheets, blankets, towels, pipes, wires), the package shall bear the dimensions (length, breadth, thickness, size).',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(f)',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltySummary: 'Fine up to ₹25,000 for first offence.',
    isCritical: false,
    guidelines: [
      'Dimensions must be in metric units: mm, cm, or m.',
      'For garments: Chest/bust size in cm or international standard with chest/waist measurements in cm.'
    ]
  },
  {
    id: 'rule_6_1_n_consumer_care',
    code: 'Rule 6(1)(n)',
    clause: 'Consumer Care & Grievance Redressal Mechanism',
    category: 'consumer_grievance',
    title: 'Consumer Care Contact Details (Name, Address, Phone & Email)',
    description: 'Every package shall bear the name, address, telephone number, and email address of the person or office which can be contacted in case of consumer complaints.',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(n)',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltySummary: 'Fine up to ₹25,000 for first offence, ₹50,000 for second.',
    isCritical: true,
    guidelines: [
      'MUST include ALL four elements: (1) Contact Designation/Person, (2) Postal Address, (3) Telephone / Toll-Free Number, (4) Email address.',
      'Omitting the email address or telephone number is a frequent ground for statutory compounding notices.'
    ]
  },
  {
    id: 'rule_6_10_ecommerce',
    code: 'Rule 6(10)',
    clause: 'E-Commerce Marketplace Digital Listing Declarations',
    category: 'ecommerce_compliance',
    title: 'E-Commerce Digital Display of Mandatory Declarations',
    description: 'An e-commerce entity shall ensure that the mandatory declarations specified in sub-rule (1) (except month and year of manufacture) are displayed on the digital platform / marketplace product page.',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Amendment Rules, 2017 - Rule 6(10)',
    penaltySection: 'Section 36(1) and Section 49 of Legal Metrology Act, 2009',
    penaltySummary: 'Fine up to ₹25,000 for first offence. Marketplace / Seller liability.',
    isCritical: true,
    guidelines: [
      'Digital product listing must display Manufacturer/Importer name, Country of Origin, Net Qty, MRP, USP, Consumer Care, and Common Name directly on page before purchase.',
      'Images of label panels must be clear and legible.'
    ]
  },
  {
    id: 'rule_7_pdp_font_size',
    code: 'Rule 7 & Table',
    clause: 'Principal Display Panel (PDP) & Minimum Numeral Height',
    category: 'pdp_and_typography',
    title: 'Principal Display Panel Area & Minimum Font / Numeral Height',
    description: 'The height of any numeral and letter in the declaration on the Principal Display Panel shall not be less than the minimum prescribed in the Table under Rule 7, determined by the net quantity of the package.',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 7, Rule 8 & Table 1',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltySummary: 'Fine up to ₹25,000 for first offence.',
    isCritical: false,
    guidelines: [
      'Up to 50 g / 50 ml: Min numeral height 1.5 mm (letter 1.0 mm)',
      '50 g to 200 g / 50 ml to 200 ml: Min numeral height 2.0 mm (letter 1.0 mm)',
      '200 g to 1 kg / 200 ml to 1 L: Min numeral height 4.0 mm (letter 2.0 mm)',
      'Above 1 kg / 1 L: Min numeral height 6.0 mm (letter 3.0 mm)',
      'Rectangular package PDP = at least 40% of height x width of front face. Cylindrical package PDP = at least 20% of total surface area.'
    ]
  },
  {
    id: 'rule_9_manner_of_declaration',
    code: 'Rule 9',
    clause: 'Manner and Prominence of Declarations',
    category: 'pdp_and_typography',
    title: 'Legibility, Contrast and Indelibility of Declarations',
    description: 'Every declaration shall be legible, prominent, definite, plain and unambiguous. Declarations must be made in conspicuous letters with contrasting background colors and indelible ink/print.',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 9',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltySummary: 'Fine up to ₹25,000 for first offence.',
    isCritical: false,
    guidelines: [
      'Declarations shall not be obscured by artwork or other graphics.',
      'High contrast between text and background color required.',
      'Must not be printed in faint, smudged, or erasable ink.'
    ]
  },
  {
    id: 'rule_country_of_origin',
    code: 'Rule 6(1)(a) Proviso',
    clause: 'Country of Origin / Manufacture Declaration',
    category: 'import_and_origin',
    title: 'Country of Origin Declaration for Domestic & Imported Goods',
    description: 'Every package shall prominently state the Country of Origin or Country of Manufacture, enabling transparency regarding where the commodity was produced.',
    statutoryReference: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(a) & 2020 Guidelines',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltySummary: 'Fine up to ₹25,000 for first offence.',
    isCritical: true,
    guidelines: [
      'Format: "Country of Origin: India" or "Made in [Country]" or "Product of [Country]".',
      'Mandatory for all physical packaged goods and e-commerce listings.'
    ]
  }
];