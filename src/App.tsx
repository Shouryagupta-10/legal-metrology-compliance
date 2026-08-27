import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';

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

import { BaselineLoader } from './components/Loader/BaselineLoader';
import { BaselineHero } from './components/Hero/BaselineHero';
import { FullscreenMenu } from './components/Navigation/FullscreenMenu';
import { BaselineTrustSection } from './components/Sections/BaselineTrustSection';
import { BaselineStatsSection } from './components/Sections/BaselineStatsSection';
import { BaselineTestimonialsSection } from './components/Sections/BaselineTestimonialsSection';
import { BaselineFooter } from './components/Footer/BaselineFooter';

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
import { AuditReportView } from './components/Reports/AuditReportView';
import { BatchAuditModal } from './components/Batch/BatchAuditModal';
import { RulebookModal } from './components/Handbook/RulebookModal';
import { LegalOfficerChat } from './components/Assistant/LegalOfficerChat';

export const App: React.FC = () => {
  // Theme State: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [currentSample, setCurrentSample] = useState<SampleProduct>(SAMPLE_PRODUCTS[0]);
  const [currentReport, setCurrentReport] = useState<ComplianceReport | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'ecommerce' | 'batch' | 'handbook'>('audit');

  const [isLoaderReady, setIsLoaderReady] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Theme Sync effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initialize Lenis & Adaptive Scale-up Grid
  useEffect(() => {
    // 1. Adaptive Rem Grid Scale-up for screens > 1920px
    const FONT_BASE = 16, BASE_W = 1920, COEF = 0.6666;
    const handleResize = () => {
      const reduction = ((BASE_W - window.innerWidth) / BASE_W) * 100 * COEF;
      const size = FONT_BASE - (FONT_BASE * reduction) / 100;
      if (size > FONT_BASE) {
        document.documentElement.style.fontSize = size + "px";
      } else {
        document.documentElement.style.removeProperty("font-size");
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // 2. Lenis Smooth Scroll
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
    };
  }, []);

  // Initialize report on mount or sample switch
  useEffect(() => {
    setIsFixApplied(false);
    loadSampleReport(currentSample, false);
  }, [currentSample]);

  const loadSampleReport = (sample: SampleProduct, fixMode: boolean = false) => {
    let decls = { ...sample.declarations };

    if (fixMode) {
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

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[var(--brand)] selection:text-white transition-colors duration-300">
      {/* 1. Opening Intro Loader */}
      <BaselineLoader onReady={() => setIsLoaderReady(true)} />

      {/* 2. Fullscreen Menu Overlay */}
      <FullscreenMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectTab={setActiveTab}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Inset Main Frame (0.5rem - 0.75rem padding) */}
      <main className="baseline-page-frame space-y-3">
        {/* 3. Hero Section (Deep Navy Card) */}
        <BaselineHero
          currentSample={currentSample}
          onSelectSample={sample => {
            sounds.playClick();
            setCurrentSample(sample);
          }}
          report={currentReport}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenHandbook={() => setIsHandbookOpen(true)}
          onOpenBatchModal={() => setIsBatchModalOpen(true)}
          isReady={isLoaderReady}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* 4. Trust & Enforcement Section with PURPLE Ghost Typography */}
        <BaselineTrustSection
          onSelectSample={sample => {
            sounds.playClick();
            setCurrentSample(sample);
          }}
        />

        {/* 5. Main Packaging Inspection Studio */}
        <section id="studio" className="bg-[var(--surface)] rounded-[var(--radius-card-lg)] p-4 sm:p-8 lg:p-10 border border-[var(--hairline)] shadow-sm space-y-8 transition-colors duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--hairline)] pb-6">
            <div>
              <div className="baseline-eyebrow tone-dark mb-2">
                <span className="eyebrow-dot" />
                <span>Statutory Verification Studio</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-medium uppercase tracking-tight text-[var(--ink)]">
                Packaging Proofing &amp; Vision Audit
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFieldEditorOpen(true)}
                className="px-4 py-2 rounded-full border border-[var(--hairline)] bg-[var(--surface-card)] text-xs font-medium uppercase tracking-wider text-[var(--ink)] hover:bg-[var(--surface)] transition-all btn-tactile shadow-xs"
              >
                Edit Extracted Fields
              </button>
              <button
                onClick={() => setIsPDPToolOpen(true)}
                className="px-4 py-2 rounded-full bg-[var(--brand)] text-white text-xs font-medium uppercase tracking-wider hover:bg-[var(--brand-deep)] transition-all btn-tactile shadow-md"
              >
                PDP Geometry Tool
              </button>
            </div>
          </div>

          {/* Sample Selector / Dropzone */}
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
              {/* Score & Alerts Summary */}
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

              {/* Studio Canvas + Statutory Checklist */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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

                <div id="checklist" className="lg:col-span-7 space-y-6">
                  <RuleChecklist
                    ruleResults={currentReport.ruleResults}
                    activeRuleId={activeRuleId}
                    onSelectRule={handleSelectRule}
                  />
                  <USPCalculator />
                </div>
              </div>

              {/* Inspection Notice Document */}
              <div className="pt-4">
                <AuditReportView report={currentReport} />
              </div>
            </>
          )}
        </section>

        {/* 6. Stats & Penalties Band */}
        <div id="analytics">
          <BaselineStatsSection />
        </div>

        {/* 7. Statutory Testimonials & Case Studies */}
        <BaselineTestimonialsSection />

        {/* 8. Luxury Navy Footer */}
        <BaselineFooter
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenHandbook={() => setIsHandbookOpen(true)}
        />
      </main>

      {/* AI Assistant Drawer */}
      <LegalOfficerChat
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Modals */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={url => handleImageUploaded(url, 'Camera Capture')}
      />

      <EcommerceScraperModal
        isOpen={isEcomModalOpen}
        onClose={() => setIsEcomModalOpen(false)}
        onAuditListing={(decls, ecomData, pName, bName, cName) => {
          const rep = evaluateCompliance({
            productName: pName,
            brandName: bName,
            categoryName: cName,
            declarations: decls,
            ecommerceData: ecomData,
            isEcommerceMode: true,
            labelImages: currentSample.labelImages
          });
          setCurrentReport(rep);
          setActiveTab('audit');
        }}
      />

      <BatchAuditModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSelectSingleReport={s => {
          sounds.playClick();
          setCurrentSample(s);
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
            onSavePDP={pdp => {
              const updated = evaluateCompliance({
                productName: currentReport.productName,
                brandName: currentReport.brandName,
                categoryName: currentReport.categoryName,
                declarations: currentReport.declarations,
                pdpInput: {
                  packageShape: pdp.packageShape,
                  heightMm: pdp.heightMm,
                  widthMm: pdp.widthMm,
                  depthMm: pdp.depthMm,
                  diameterMm: pdp.diameterMm,
                  measuredNumeralHeightMm: pdp.measuredNumeralHeightMm
                },
                labelImages: currentReport.labelImages
              });
              setCurrentReport(updated);
            }}
          />

          <FieldEditorModal
            isOpen={isFieldEditorOpen}
            onClose={() => setIsFieldEditorOpen(false)}
            declarations={currentReport.declarations}
            onSaveDeclarations={decls => {
              const updated = evaluateCompliance({
                productName: decls.commodityName || currentReport.productName,
                brandName: currentReport.brandName,
                categoryName: currentReport.categoryName,
                declarations: decls,
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
            }}
          />
        </>
      )}
    </div>
  );
};
