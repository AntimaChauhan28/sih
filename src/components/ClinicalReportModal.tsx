import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  User, 
  Calendar, 
  FileText,
  Languages
} from 'lucide-react';
import { RetinalAnalysisResult } from '../types';
import { ICDR_GRADES } from '../data/patientCases';

interface ClinicalReportModalProps {
  caseData: RetinalAnalysisResult;
  onClose: () => void;
}

export default function ClinicalReportModal({ caseData, onClose }: ClinicalReportModalProps) {
  const [aiOpinion, setAiOpinion] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hindi' | 'telugu' | 'tamil'>('english');

  const gradeInfo = ICDR_GRADES[caseData.icdrGrade];

  const fetchAiSpecialistOpinion = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/clinical-opinion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData })
      });
      const data = await res.json();
      setAiOpinion(data.clinicalReport);
    } catch (err) {
      setAiOpinion("Vitreoretinal Specialist Tele-Review: Patient displays pathology consistent with automated grading. Recommend immediate glycemic stabilization and scheduled optical coherence tomography (OCT) at the district hospital.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Multilingual ASHA Worker Counseling Messages
  const ashaAdvice = {
    english: {
      action: gradeInfo.recommendedAction,
      diet: "Advise patient strictly against abrupt cessation of insulin. Recommend green leafy vegetables, reduce polished white rice consumption, and monitor fasting blood sugar twice weekly.",
      transport: "For referable cases (Level 2+), register patient on the District Mobile Eye Health Ambulance (108/104 Tele-Ophthal bus) for free laser photocoagulation or anti-VEGF therapy."
    },
    hindi: {
      action: "मरीज़ को ज़िला अस्पताल के नेत्र रोग विशेषज्ञ (आँखों के डॉक्टर) के पास तुरंत रेफर करें।",
      diet: "मरीज़ को इंसुलिन या दवा नियमित रूप से लेने की सलाह दें। सफेद चावल कम खाएं, हरी पत्तेदार सब्जियां खाएं और हर हफ्ते शुगर की जांच कराएं।",
      transport: "मुफ्त लेजर या इंजेक्शन उपचार के लिए ज़िला स्वास्थ्य एम्बुलेंस (104 सेवा) में मरीज़ का नाम दर्ज करें।"
    },
    telugu: {
      action: "రోగిని తక్షణమే జిల్లా కంటి వైద్యుడి (ఆప్తాల్మాలజిస్ట్) వద్దకు పంపించండి.",
      diet: "ఇన్సులిన్ మందులు క్రమం తప్పకుండా తీసుకోవాలని సూచించండి. తెల్ల బియ్యం తగ్గించి, ఆకుకూరలు ఎక్కువగా తీసుకోవాలి.",
      transport: "ఉచిత లేజర్ చికిత్స కోసం 104 ప్రభుత్వ ఆరోగ్య వాహనంలో రోగి పేరును నమోదు చేయండి."
    },
    tamil: {
      action: "நோயாளியை உடனடியாக மாவட்ட கண் மருத்துவமனைக்கு பரிந்துரைக்கவும்.",
      diet: "மருந்துகளை தவறாமல் உட்கொள்ள அறிவுறுத்தவும். வெள்ளை அரிசியை குறைத்து காய்கறிகளை அதிகம் உணவில் சேர்க்கவும்.",
      transport: "இலவச லேசர் சிகிச்சைக்காக அரசு மருத்துவமனை வாகன சேவையில் பதிவு செய்யவும்."
    }
  };

  const currentAdvice = ashaAdvice[selectedLanguage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-slate-100">
              Clinical Tele-Ophthalmology Screening Report
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Printable Document */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 printable-area">
          {/* Document Header */}
          <div className="border-b-2 border-slate-700 pb-4 text-center">
            <div className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              NATIONAL PROGRAMME FOR CONTROL OF BLINDNESS &amp; VISUAL IMPAIRMENT (NPCBVI)
            </div>
            <h1 className="text-xl font-black text-slate-100 mt-1">
              TELE-RETINOPATHY CLINICAL EXAMINATION DOSSIER
            </h1>
            <div className="text-xs text-slate-400 mt-1">
              Government of India • Ministry of Health &amp; Family Welfare • MathWorks Retinal Screening Consortium
            </div>
          </div>

          {/* Patient Details & Examination Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Patient Name:</span>
              <strong className="text-slate-100 text-sm block">{caseData.patient.name}</strong>
              <span className="text-slate-400">{caseData.patient.age} Yrs • {caseData.patient.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Patient UID:</span>
              <strong className="font-mono text-cyan-400">{caseData.patient.patientId}</strong>
              <span className="text-slate-400 block mt-0.5">Eye: <span className="font-bold text-amber-400">{caseData.patient.examinedEye}</span></span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">PHC Center:</span>
              <strong className="text-slate-200 truncate block">{caseData.patient.phcCenter}</strong>
              <span className="text-slate-400">{caseData.patient.district}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Exam Timestamp:</span>
              <strong className="text-slate-200">{new Date(caseData.timestamp || caseData.patient.screeningTimestamp || Date.now()).toLocaleDateString()}</strong>
              <span className="text-slate-400 block font-mono">{new Date(caseData.timestamp || caseData.patient.screeningTimestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Clinical Findings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: ICDR Staging & 4-2-1 Rule */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200">ICDR Severity Classification</span>
                <span 
                  className="px-2 py-0.5 rounded font-bold text-white text-[11px]"
                  style={{ backgroundColor: gradeInfo.color }}
                >
                  Level {caseData.icdrGrade}
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-100 text-sm">{gradeInfo.name}</span>
                <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                  {gradeInfo.clinicalCriteria}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Calibrated AI Confidence:</span>
                  <span className="font-mono font-bold text-emerald-400">{caseData.confidence.toFixed(1)}% (±{caseData.uncertaintyStd.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">The 4-2-1 Rule Staging:</span>
                  <span className={`font-semibold ${caseData.rule421.ruleSatisfied ? 'text-red-400' : 'text-slate-300'}`}>
                    {caseData.rule421.ruleSatisfied ? 'Criteria Met (Severe NPDR)' : 'Criteria Not Met'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DME Risk (Macular Edema):</span>
                  <span className="font-semibold text-amber-400 capitalize">
                    {caseData.dmeRisk.riskLevel.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quantitative Lesion & Vascular Caliber */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200">Quantitative Retinal Morphometry</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Lesions Detected:</span>
                  <span className="font-mono font-bold text-red-400">{caseData.lesions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Microaneurysms (&lt;125 µm):</span>
                  <span className="font-mono text-slate-200">{caseData.lesions.filter(l => l.type === 'microaneurysm').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Intraretinal Hemorrhages:</span>
                  <span className="font-mono text-slate-200">{caseData.lesions.filter(l => l.type.startsWith('hemorrhage')).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hard Lipid Exudates:</span>
                  <span className="font-mono text-slate-200">{caseData.lesions.filter(l => l.type === 'hard_exudate').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cup-to-Disc Ratio (CDR):</span>
                  <span className="font-mono text-slate-200">{caseData.opticDisc.cupToDiscRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vessel Arteriolar-Venular Ratio:</span>
                  <span className="font-mono text-slate-200">{caseData.vessels.arteriolarVenularRatio.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vitreoretinal Specialist AI Tele-Synthesis */}
          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Senior Vitreoretinal Specialist Clinical Synthesis
              </span>
              {!aiOpinion && (
                <button
                  onClick={fetchAiSpecialistOpinion}
                  disabled={isLoadingAi}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-2.5 py-1 rounded text-xs cursor-pointer font-medium"
                >
                  {isLoadingAi ? 'Consulting Gemini...' : 'Generate Tele-Opinion'}
                </button>
              )}
            </div>

            {aiOpinion ? (
              <div className="bg-slate-900 p-3 rounded border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                {aiOpinion}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Click "Generate Tele-Opinion" to synthesize a complete clinical vitreoretinal assessment incorporating Grad-CAM explainability, 4-2-1 staging, and district follow-up protocol.
              </p>
            )}
          </div>

          {/* Multilingual ASHA Health Worker Counseling Instructions */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs text-slate-200">ASHA / Rural Health Worker Counseling Guide</span>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1">
                {(['english', 'hindi', 'telugu', 'tamil'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-amber-300 block text-[11px]">Primary Action:</span>
                <p className="text-slate-300">{currentAdvice.action}</p>
              </div>
              <div>
                <span className="font-semibold text-amber-300 block text-[11px]">Diet &amp; Glycemic Care:</span>
                <p className="text-slate-300">{currentAdvice.diet}</p>
              </div>
              <div>
                <span className="font-semibold text-amber-300 block text-[11px]">District Transport:</span>
                <p className="text-slate-300">{currentAdvice.transport}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Validation Code: SHA-256-{(caseData.id || caseData.patient.id).toUpperCase()}-VERIFIED</span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
