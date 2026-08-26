import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

import {
  SampleProduct,
  ComplianceReport,
  ExtractedDeclarations,
  PrincipalDisplayPanelCalculation,
  EcommerceListingData,
  LabelImageRecord
} from './types/compliance';

import { SAMPLE_PRODUCTS } from './services/sampleData';
import { evaluateCompliance } from './services/ruleEngine';
import { performOcr } from './services/clientOcr';
import { sounds } from './services/soundEffects';

import { Navbar } from './components/Navbar';
import { MultiImageUploader } from './components/Scanner/MultiImageUploader';
import { CameraModal } from './components/Scanner/CameraModal';
import { EcommerceScraperModal } from './components/Scanner/EcommerceScraperModal';
import { InteractiveStudioCanvas } from './components/Inspector/InteractiveStudioCanvas';
import { PDPMeasurementTool } from './components/Inspector/PDPMeasurementTool';
import { FieldEditorModal } from './components/Inspector/FieldEditorModal';
import { ComplianceScoreCard } from './components/Compliance/ComplianceScoreCard';
import { ViolationAlerts } from './components/Compliance/ViolationAlerts';
import { RuleChecklist } from './components/Compliance/RuleChecklist';
import { USPCalculator } from './components/Compliance/USPCalculator';
import { CompoundingSimulator } from './components/Compliance/CompoundingSimulator';
import { AuditReportView } from './components/Reports/AuditReportView';
import { BatchAuditModal } from './components/Batch/BatchAuditModal';
import { RulebookModal } from './components/Handbook/RulebookModal';
import { LegalOfficerChat } from './components/Assistant/LegalOfficerChat';

export const App: React.FC = () => {
  const [currentSample, setCurrentSample] = useState<SampleProduct>(SAMPLE_PRODUCTS[0]);
  const [currentReport, setCurrentReport] = useState<ComplianceReport | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'ecommerce' | 'batch' | 'handbook'>('audit');

  // Interactive 1-Click Artwork Fix state
  const [isFixApplied, setIsFixApplied] = useState<boolean>(false);

  // Scanner state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatusText, setScanStatusText] = useState<string>('');

  // Interactive focus state between canvas & checklist
  const [activeBoundingBoxId, setActiveBoundingBoxId] = useState<string | undefined>('b3');
  const [activeRuleId, setActiveRuleId] = useState<string | undefined>('rule_6_1_c_net_qty');

  // Modals & Drawers
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isEcomModalOpen, setIsEcomModalOpen] = useState<boolean>(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState<boolean>(false);
  const [isPDPToolOpen, setIsPDPToolOpen] = useState<boolean>(false);
  const [isFieldEditorOpen, setIsFieldEditorOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);

  // Initialize report on mount or sample switch
  useEffect(() => {
    setIsFixApplied(false);
    loadSampleReport(currentSample, false);
  }, [currentSample]);

  const loadSampleReport = (sample: SampleProduct, fixMode: boolean = false) => {
    let decls = { ...sample.declarations };

    if (fixMode) {
      // Auto-fix any defective declarations to 100% compliant standards
      if (decls.netQuantityUnit === 'gms') decls.netQuantityUnit = 'g';
      decls.isTaxesInclusiveDeclared = true;
      decls.rawTaxDeclarationText = 'Inclusive of all taxes';
      if (!decls.consumerCareEmail) decls.consumerCareEmail = 'care@brand.in';
      if (!decls.manufacturerPin) decls.manufacturerPin = '380015';
      if (!decls.declaredUspValue && decls.mrpValue && decls.netQuantityValue) {
        decls.declaredUspValue = parseFloat((decls.mrpValue / decls.netQuantityValue).toFixed(2));
        decls.declaredUspUnit = decls.netQuantityUnit;
      }
    }

    const report = evaluateCompliance({
      productName: sample.name,
      brandName: sample.brand,
      categoryName: sample.category,
      declarations: decls,
      pdpInput: {
        packageShape: sample.pdpDefaults.shape,
        heightMm: sample.pdpDefaults.heightMm,
        widthMm: sample.pdpDefaults.widthMm,
        depthMm: sample.pdpDefaults.depthMm,
        measuredNumeralHeightMm: sample.pdpDefaults.measuredFontHeightMm
      },
      labelImages: sample.labelImages
    });

    setCurrentReport(report);

    if (report.overallStatus === 'COMPLIANT' && fixMode) {
      sounds.playSuccess();
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.8 }
        });
      } catch (e) {}
    }
  };

  const handleToggleAutoFix = () => {
    const nextState = !isFixApplied;
    setIsFixApplied(nextState);
    loadSampleReport(currentSample, nextState);
  };

  // Image Upload handler with OCR
  const handleImageUploaded = async (imageDataUrl: string, fileName: string) => {
    setIsScanning(true);
    setScanProgress(10);
    setScanStatusText('Analyzing image resolution & contrast...');

    try {
      const ocrRes = await performOcr(imageDataUrl, (progress, status) => {
        setScanProgress(progress);
        setScanStatusText(status);
      });

      const newImageRecord: LabelImageRecord = {
        id: `upload-${Date.now()}`,
        viewType: 'front',
        name: fileName || 'Uploaded Label',
        url: imageDataUrl,
        rawOcrText: ocrRes.text,
        boundingBoxes: ocrRes.boundingBoxes
      };

      const customSample: SampleProduct = {
        id: `custom-${Date.now()}`,
        name: ocrRes.declarations.commodityName || 'Custom Packaged Commodity',
        brand: ocrRes.declarations.manufacturerName?.split(' ')[0] || 'Packaged Brand',
        category: 'Food & Packaged Goods',
        thumbnail: imageDataUrl,
        labelImages: [newImageRecord],
        declarations: ocrRes.declarations,
        pdpDefaults: {
          shape: 'rectangular',
          heightMm: 200,
          widthMm: 140,
          depthMm: 50,
          measuredFontHeightMm: 4.0
        },
        expectedCompliance: 'COMPLIANT',
        scenarioDescription: 'User-scanned packaging label evaluated in real-time.',
        tags: ['Custom Upload', 'Live OCR']
      };

      setCurrentSample(customSample);
    } catch (err) {
      console.error('Error during OCR processing:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Live Camera snapshot handler
  const handleCameraCapture = (imageDataUrl: string) => {
    handleImageUploaded(imageDataUrl, 'Live Camera Snapshot');
  };

  // E-commerce listing audit handler
  const handleEcommerceAudit = (
    declarations: ExtractedDeclarations,
    ecomData: EcommerceListingData,
    productName: string,
    brandName: string,
    categoryName: string
  ) => {
    const report = evaluateCompliance({
      productName,
      brandName,
      categoryName,
      declarations,
      ecommerceData: ecomData,
      isEcommerceMode: true,
      labelImages: currentSample.labelImages
    });

    setCurrentReport(report);
    setActiveTab('audit');
  };

  // Synchronized Selection: User clicks a bounding box on the image
  const handleSelectBoundingBox = (boxId: string) => {
    setActiveBoundingBoxId(boxId);
    const box = currentSample.labelImages[0]?.boundingBoxes.find(b => b.id === boxId);
    if (box) {
      if (box.field === 'netQuantity') setActiveRuleId('rule_6_1_c_net_qty');
      else if (box.field === 'mrp') setActiveRuleId('rule_6_1_e_mrp');
      else if (box.field === 'usp') setActiveRuleId('rule_6_1_e_usp');
      else if (box.field === 'mfgDate') setActiveRuleId('rule_6_1_d_mfg_date');
      else if (box.field === 'manufacturer') setActiveRuleId('rule_6_1_a_mfg');
      else if (box.field === 'commodityName') setActiveRuleId('rule_6_1_b_commodity');
      else if (box.field === 'consumerCare') setActiveRuleId('rule_6_1_n_consumer_care');
      else if (box.field === 'countryOfOrigin') setActiveRuleId('rule_country_of_origin');
      else if (box.field === 'dimensions') setActiveRuleId('rule_6_1_f_dimensions');
    }
  };

  // Synchronized Selection: User clicks a rule in the checklist
  const handleSelectRule = (ruleId: string) => {
    sounds.playClick();
    setActiveRuleId(ruleId);
    if (!currentReport) return;

    let fieldKey = '';
    if (ruleId === 'rule_6_1_c_net_qty') fieldKey = 'netQuantity';
    else if (ruleId === 'rule_6_1_e_mrp') fieldKey = 'mrp';
    else if (ruleId === 'rule_6_1_e_usp') fieldKey = 'usp';
    else if (ruleId === 'rule_6_1_d_mfg_date') fieldKey = 'mfgDate';
    else if (ruleId === 'rule_6_1_a_mfg') fieldKey = 'manufacturer';
    else if (ruleId === 'rule_6_1_b_commodity') fieldKey = 'commodityName';
    else if (ruleId === 'rule_6_1_n_consumer_care') fieldKey = 'consumerCare';
    else if (ruleId === 'rule_country_of_origin') fieldKey = 'countryOfOrigin';
    else if (ruleId === 'rule_6_1_f_dimensions') fieldKey = 'dimensions';

    const matchBox = currentSample.labelImages[0]?.boundingBoxes.find(b => b.field === fieldKey);
    if (matchBox) {
      setActiveBoundingBoxId(matchBox.id);
    }
  };

  // PDP calculation update
  const handleSavePDP = (pdpResult: PrincipalDisplayPanelCalculation) => {
    if (!currentReport) return;
    sounds.playSuccess();
    const updated = evaluateCompliance({
      productName: currentReport.productName,
      brandName: currentReport.brandName,
      categoryName: currentReport.categoryName,
      declarations: currentReport.declarations,
      pdpInput: {
        packageShape: pdpResult.packageShape,
        heightMm: pdpResult.heightMm,
        widthMm: pdpResult.widthMm,
        depthMm: pdpResult.depthMm,
        diameterMm: pdpResult.diameterMm,
        measuredNumeralHeightMm: pdpResult.measuredNumeralHeightMm
      },
      labelImages: currentReport.labelImages
    });
    setCurrentReport(updated);
  };

  // Human-in-the-loop manual declaration correction
  const handleSaveDeclarations = (updatedDeclarations: ExtractedDeclarations) => {
    if (!currentReport) return;
    sounds.playSuccess();
    const updated = evaluateCompliance({
      productName: updatedDeclarations.commodityName || currentReport.productName,
      brandName: currentReport.brandName,
      categoryName: currentReport.categoryName,
      declarations: updatedDeclarations,
      pdpInput: {
        packageShape: currentReport.pdpCalculation.packageShape,
        heightMm: currentReport.pdpCalculation.heightMm,
        widthMm: currentReport.pdpCalculation.widthMm,
        depthMm: currentReport.pdpCalculation.depthMm,
        diameterMm: currentReport.pdpCalculation.diameterMm,
        measuredNumeralHeightMm: currentReport.pdpCalculation.measuredNumeralHeightMm
      },
      labelImages: currentReport.labelImages
    });
    setCurrentReport(updated);
  };

  const handleReset = () => {
    setIsFixApplied(false);
    setCurrentSample(SAMPLE_PRODUCTS[0]);
    setActiveTab('audit');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        report={currentReport}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHandbook={() => setIsHandbookOpen(true)}
        onReset={handleReset}
        onOpenBatchModal={() => setIsBatchModalOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Multi-Image Uploader & Sample Gallery */}
        <MultiImageUploader
          onImageSelected={handleImageUploaded}
          onSelectSample={sample => {
            sounds.playClick();
            setCurrentSample(sample);
          }}
          onOpenLiveCamera={() => setIsCameraOpen(true)}
          onOpenEcommerceModal={() => setIsEcomModalOpen(true)}
          isScanning={isScanning}
          scanProgress={scanProgress}
          scanStatusText={scanStatusText}
          activeSampleId={currentSample.id}
        />

        {currentReport && (
          <>
            {/* Upper Section: Compliance Score & Section 36 Warnings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ComplianceScoreCard report={currentReport} />
              </div>
              <div>
                <ViolationAlerts
                  report={currentReport}
                  onFocusRule={handleSelectRule}
                />
              </div>
            </div>

            {/* Middle Section: Interactive Studio Canvas + Rule Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Studio Canvas */}
              <div className="lg:col-span-5 h-[640px]">
                <InteractiveStudioCanvas
                  imageRecord={currentSample.labelImages[0]}
                  activeBoundingBoxId={activeBoundingBoxId}
                  onSelectBoundingBox={handleSelectBoundingBox}
                  onOpenPDPTool={() => setIsPDPToolOpen(true)}
                  onOpenFieldEditor={() => setIsFieldEditorOpen(true)}
                  isFixApplied={isFixApplied}
                  onToggleAutoFix={
                    currentReport.overallStatus === 'NON_COMPLIANT' || isFixApplied
                      ? handleToggleAutoFix
                      : undefined
                  }
                />
              </div>

              {/* Right Column: Statutory Rule-by-Rule Checklist & Interactive Tools */}
              <div className="lg:col-span-7 space-y-6">
                <RuleChecklist
                  ruleResults={currentReport.ruleResults}
                  activeRuleId={activeRuleId}
                  onSelectRule={handleSelectRule}
                />

                {/* Interactive Section 36 Liability & Compounding Simulator */}
                <CompoundingSimulator />

                {/* Live Unit Sale Price (USP) Sandbox */}
                <USPCalculator />
              </div>
            </div>

            {/* Official Inspection Certificate View */}
            <div className="pt-4">
              <AuditReportView report={currentReport} />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            MetrologyGuard AI &copy; 2026 &bull; Legal Metrology (Packaged Commodities) Compliance System
          </span>
          <span className="text-[11px] text-slate-600 font-mono">
            Standard: LMPC Rules 2011 &bull; 2021 USP Amendment &bull; Section 36 Legal Metrology Act, 2009
          </span>
        </div>
      </footer>

      {/* Interactive AI Legal Metrology Officer Drawer */}
      <LegalOfficerChat
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Modals */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      <EcommerceScraperModal
        isOpen={isEcomModalOpen}
        onClose={() => setIsEcomModalOpen(false)}
        onAuditListing={handleEcommerceAudit}
      />

      <BatchAuditModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSelectSingleReport={sample => {
          sounds.playClick();
          setCurrentSample(sample);
        }}
      />

      <RulebookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      {currentReport && (
        <>
          <PDPMeasurementTool
            isOpen={isPDPToolOpen}
            onClose={() => setIsPDPToolOpen(false)}
            initialShape={currentReport.pdpCalculation.packageShape}
            netQtyValue={currentReport.declarations.netQuantityValue || 500}
            netQtyUnit={currentReport.declarations.netQuantityUnit || 'g'}
            onSavePDP={handleSavePDP}
          />

          <FieldEditorModal
            isOpen={isFieldEditorOpen}
            onClose={() => setIsFieldEditorOpen(false)}
            declarations={currentReport.declarations}
            onSaveDeclarations={handleSaveDeclarations}
          />
        </>
      )}
    </div>
  );
};
