import { ExtractedDeclarations, BoundingBox } from '../types/compliance';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh',
  'Puducherry', 'Jammu & Kashmir', 'Ladakh'
];

/**
 * Parses raw OCR text and bounding boxes into structured Legal Metrology declarations.
 */
export function extractDeclarationsFromText(rawText: string, existingBoxes: BoundingBox[] = []): ExtractedDeclarations {
  const text = rawText || '';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const result: ExtractedDeclarations = {};

  // 1. PIN Code & Indian State
  const pinMatch = text.match(/\b([1-9][0-9]{5})\b/);
  if (pinMatch) {
    result.manufacturerPin = pinMatch[1];
  }

  for (const state of INDIAN_STATES) {
    if (new RegExp(`\\b${state}\\b`, 'i').test(text)) {
      result.manufacturerState = state;
      break;
    }
  }

  // 2. Manufacturer / Packer / Importer Name & Address
  const mfgRegex = /(?:Manufactured|Mfg|Mfd|Packed|Pkd|Imported|Marketed)\s*(?:by|at|for)?[:\s]+([^\n]+(?:\n[^\n]+)?)/i;
  const mfgMatch = text.match(mfgRegex);
  if (mfgMatch) {
    const rawMfg = mfgMatch[1].trim();
    result.manufacturerName = rawMfg.split(',')[0].trim();
    result.manufacturerAddress = rawMfg;
  }

  // Packer check
  const pkdRegex = /(?:Packed|Pkd|Pre-packed)\s*by[:\s]+([^\n]+)/i;
  const pkdMatch = text.match(pkdRegex);
  if (pkdMatch) {
    result.packerName = pkdMatch[1].split(',')[0].trim();
    result.packerAddress = pkdMatch[1].trim();
  }

  // Importer check
  const impRegex = /(?:Imported\s*by|Importer)[:\s]+([^\n]+)/i;
  const impMatch = text.match(impRegex);
  if (impMatch) {
    result.importerName = impMatch[1].split(',')[0].trim();
    result.importerAddress = impMatch[1].trim();
    result.isImported = true;
  }

  // 3. Commodity / Generic Name
  const commRegex = /(?:Generic\s*Name|Common\s*Name|Commodity|Product\s*Name|Product)[:\s]+([^\n]+)/i;
  const commMatch = text.match(commRegex);
  if (commMatch) {
    result.commodityName = commMatch[1].trim();
    result.commonOrGenericName = commMatch[1].trim();
  } else if (lines.length > 0) {
    // If first line looks like a product title
    const potentialTitle = lines.find(l => l.length > 3 && l.length < 50 && !l.includes('MRP') && !l.includes('Mfg'));
    if (potentialTitle) {
      result.commodityName = potentialTitle;
    }
  }

  // 4. Net Quantity & Unit
  const netQtyRegex = /(?:Net\s*(?:Quantity|Qty|Weight|Wt|Volume|Vol|Content)|Qty|N\.W\.)[:\s]*([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z\.]+)/i;
  const netQtyMatch = text.match(netQtyRegex);
  if (netQtyMatch) {
    result.netQuantityValue = parseFloat(netQtyMatch[1]);
    result.netQuantityUnit = netQtyMatch[2].trim();
    result.rawNetQuantityText = netQtyMatch[0];
  } else {
    // Fallback search for standalone weight patterns (e.g., "500 g", "1 kg", "750 ml", "100 gms")
    const standaloneMatch = text.match(/\b([0-9]+(?:\.[0-9]+)?)\s*(kg|kgs|g|gm|gms|ml|ml\.|mL|l|L|m|cm|mm|N|U)\b/i);
    if (standaloneMatch) {
      result.netQuantityValue = parseFloat(standaloneMatch[1]);
      result.netQuantityUnit = standaloneMatch[2].trim();
      result.rawNetQuantityText = standaloneMatch[0];
    }
  }

  // Check validity of net quantity unit
  if (result.netQuantityUnit) {
    const validUnits = ['g', 'kg', 'ml', 'mL', 'l', 'L', 'm', 'cm', 'mm', 'N', 'U'];
    result.netQuantitySymbolValid = validUnits.includes(result.netQuantityUnit);
  }

  // 5. Month & Year of Manufacture / Packing
  const mfgDateRegex = /(?:Mfg|Date\s*of\s*Mfg|Mfd|Packed|Date\s*of\s*Packing|Pkd|Pkd\s*Date|Import\s*Date)[:\s]*([0-1]?[0-9][\/\.-][1-2][0-9]{3}|[A-Za-z]{3,9}\s+[1-2][0-9]{3}|[0-1]?[0-9][\/\.-][0-9]{2})/i;
  const mfgDateMatch = text.match(mfgDateRegex);
  if (mfgDateMatch) {
    result.rawMfgDateText = mfgDateMatch[0];
    const dateStr = mfgDateMatch[1];
    const parts = dateStr.split(/[\/\.-]/);
    if (parts.length === 2) {
      result.mfgMonth = parseInt(parts[0], 10);
      result.mfgYear = parseInt(parts[1].length === 2 ? `20${parts[1]}` : parts[1], 10);
    }
  }

  // Expiry / Best Before
  const expRegex = /(?:Best\s*Before|Expiry|Exp\s*Date|Use\s*By)[:\s]*([^\n]+)/i;
  const expMatch = text.match(expRegex);
  if (expMatch) {
    result.expiryDate = expMatch[1].trim();
    result.bestBeforePeriod = expMatch[1].trim();
  }

  // 6. Maximum Retail Price (MRP) & Tax Declaration
  const mrpRegex = /(?:MRP|Maximum\s*Retail\s*Price|M\.R\.P\.)[:\s]*(?:₹|Rs\.?|INR)?\s*([0-9,]+(?:\.[0-9]{2})?)/i;
  const mrpMatch = text.match(mrpRegex);
  if (mrpMatch) {
    result.mrpValue = parseFloat(mrpMatch[1].replace(/,/g, ''));
    result.rawMrpText = mrpMatch[0];
  }

  // Check if "inclusive of all taxes" is declared
  const taxInclusiveRegex = /(?:inclusive\s*of\s*all\s*taxes|incl\.?\s*of\s*all\s*taxes|incl\.?\s*all\s*taxes|inclusive\s*of\s*taxes|incl\.?\s*of\s*taxes)/i;
  result.isTaxesInclusiveDeclared = taxInclusiveRegex.test(text);
  if (result.isTaxesInclusiveDeclared) {
    const taxMatch = text.match(taxInclusiveRegex);
    result.rawTaxDeclarationText = taxMatch ? taxMatch[0] : 'inclusive of all taxes';
  }

  // 7. Unit Sale Price (USP)
  const uspRegex = /(?:Unit\s*Sale\s*Price|USP|Unit\s*Price)[:\s]*(?:₹|Rs\.?|INR)?\s*([0-9,]+(?:\.[0-9]{2})?)\s*(?:\/|per)\s*([a-zA-Z]+)/i;
  const uspMatch = text.match(uspRegex);
  if (uspMatch) {
    result.declaredUspValue = parseFloat(uspMatch[1].replace(/,/g, ''));
    result.declaredUspUnit = uspMatch[2].trim();
    result.rawUspText = uspMatch[0];
  }

  // Calculate expected USP if Net Qty and MRP exist
  if (result.mrpValue && result.netQuantityValue && result.netQuantityValue > 0) {
    let normalizedQty = result.netQuantityValue;
    const unit = (result.netQuantityUnit || '').toLowerCase();
    
    if (unit === 'kg' || unit === 'kgs' || unit === 'l' || unit === 'litre') {
      result.calculatedUspValue = parseFloat((result.mrpValue / normalizedQty).toFixed(2));
    } else if (unit === 'g' || unit === 'gm' || unit === 'gms' || unit === 'ml' || unit === 'ml.') {
      if (normalizedQty > 1000) {
        result.calculatedUspValue = parseFloat((result.mrpValue / (normalizedQty / 1000)).toFixed(2));
      } else {
        result.calculatedUspValue = parseFloat((result.mrpValue / normalizedQty).toFixed(2));
      }
    } else {
      result.calculatedUspValue = parseFloat((result.mrpValue / normalizedQty).toFixed(2));
    }

    if (result.declaredUspValue && result.calculatedUspValue) {
      const diff = Math.abs(result.declaredUspValue - result.calculatedUspValue);
      result.uspDiscrepancy = diff > 0.5;
    }
  }

  // 8. Dimensions
  const dimRegex = /([0-9]+(?:\.[0-9]+)?\s*(?:cm|mm|m|inch)\s*(?:[xX*×]|by)\s*[0-9]+(?:\.[0-9]+)?\s*(?:cm|mm|m|inch)(?:\s*(?:[xX*×]|by)\s*[0-9]+(?:\.[0-9]+)?\s*(?:cm|mm|m|inch))?)/i;
  const dimMatch = text.match(dimRegex);
  if (dimMatch) {
    result.dimensions = dimMatch[1].trim();
  }

  // 9. Consumer Care Details
  // Email
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    result.consumerCareEmail = emailMatch[1].trim();
  }

  // Phone / Toll Free
  const phoneRegex = /(?:Toll\s*Free|Phone|Tel|Customer\s*Care|Contact|Mobile|Helpline)[:\s]*([+]?[0-9\s-]{8,15})/i;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    result.consumerCarePhone = phoneMatch[1].trim();
  } else {
    // 1800 toll free regex
    const tollFree = text.match(/\b(1800[-\s]?[0-9]{3}[-\s]?[0-9]{4})\b/);
    if (tollFree) {
      result.consumerCarePhone = tollFree[1].trim();
    }
  }

  // Consumer care cell / manager title
  const careCellRegex = /(?:Consumer\s*Care\s*(?:Cell|Manager|Officer|Executive)|Customer\s*Care\s*Desk)[:\s]*([^\n]+)/i;
  const careCellMatch = text.match(careCellRegex);
  if (careCellMatch) {
    result.consumerCareName = careCellMatch[0].trim();
    result.consumerCareAddress = careCellMatch[1].trim();
  }

  // 10. Country of Origin
  const originRegex = /(?:Country\s*of\s*Origin|Made\s*in|Product\s*of|Country\s*of\s*Manufacture)[:\s]+([a-zA-Z\s]+)/i;
  const originMatch = text.match(originRegex);
  if (originMatch) {
    result.countryOfOrigin = originMatch[1].trim().replace(/[\n\r]/g, '');
  } else if (/made in india/i.test(text) || /product of india/i.test(text)) {
    result.countryOfOrigin = 'India';
  }

  // 11. Regulatory Licences (FSSAI, LMPC, Barcode)
  const fssaiMatch = text.match(/(?:FSSAI|Lic\.?\s*No\.?)[:\s]*([0-9]{14})/i);
  if (fssaiMatch) {
    result.fssaiNumber = fssaiMatch[1];
  }

  const barcodeMatch = text.match(/\b([0-9]{12,13})\b/);
  if (barcodeMatch) {
    result.barcode = barcodeMatch[1];
  }

  return result;
}
