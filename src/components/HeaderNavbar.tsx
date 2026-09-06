import React from 'react';
import { 
  Eye, 
  Activity, 
  Cpu, 
  Layers, 
  FileText, 
  BarChart2, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertTriangle,
  MapPin,
  Stethoscope
} from 'lucide-react';
import { RetinalAnalysisResult } from '../types';
import { ICDR_GRADES } from '../data/patientCases';

interface HeaderNavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cases: RetinalAnalysisResult[];
  selectedCase: RetinalAnalysisResult;
  setSelectedCase: (c: RetinalAnalysisResult) => void;
  onOpenReportModal: () => void;
  onOpenAshaModal: () => void;
  onUploadClick: () => void;
}

export default function HeaderNavbar({
  currentTab,
  setCurrentTab,
  cases,
  selectedCase,
  setSelectedCase,
  onOpenReportModal,
  onOpenAshaModal,
  onUploadClick
}: HeaderNavbarProps) {
  const gradeInfo = ICDR_GRADES[selectedCase.icdrGrade];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      {/* Top Banner: MathWorks Brand + National Blindness Control Programme Context */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-2.5 py-1 rounded shadow-sm text-xs tracking-wide">
            <span>MATLAB</span>
            <span className="text-orange-200">|</span>
            <span>Simulink</span>
          </div>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">AI-Assisted Rural Diabetic Retinopathy Screening Pipeline</span>
            <span className="sm:hidden font-semibold">MATLAB DR Screening</span>
          </div>
          <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded text-[11px] font-mono hidden md:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Rural PHC Tele-Ophthalmology
          </span>
        </div>

        {/* Quick Toolbox Status Indicators */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-300 font-medium">{selectedCase.patient.district}</span>
          </div>

          <button
            id="btn-upload-fundus"
            onClick={onUploadClick}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700 transition cursor-pointer text-[11px]"
            title="Upload custom patient fundus image"
          >
            <Upload className="w-3 h-3 text-cyan-400" />
            <span>Upload Image</span>
          </button>

          <button
            id="btn-asha-counseling"
            onClick={onOpenAshaModal}
            className="flex items-center gap-1.5 bg-cyan-900/40 hover:bg-cyan-900/60 text-cyan-300 px-2.5 py-1 rounded border border-cyan-700/60 transition cursor-pointer text-[11px]"
            title="AI Clinical Second Opinion & Rural ASHA Worker Counseling Script"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>ASHA AI Script</span>
          </button>

          <button
            id="btn-quick-report"
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-2.5 py-1 rounded shadow transition cursor-pointer text-[11px]"
          >
            <FileText className="w-3 h-3" />
            <span>Clinical PDF Report</span>
          </button>
        </div>
      </div>

      {/* Main Bar: Patient Case Selector & Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Case Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-300 text-xs">
            <Stethoscope className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-semibold text-slate-400 hidden sm:inline">Active Case:</span>
            <select
              id="select-patient-case"
              value={selectedCase.patient.id}
              onChange={(e) => {
                const found = cases.find(c => c.patient.id === e.target.value);
                if (found) setSelectedCase(found);
              }}
              className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-cyan-500 max-w-[280px] sm:max-w-[340px]"
            >
              {cases.map(c => (
                <option key={c.patient.id} value={c.patient.id}>
                  {c.patient.id} • {c.patient.name} ({c.patient.age}y {c.patient.gender}) - Level {c.icdrGrade} {c.imageQuality.status !== 'gradeable' ? `[${c.imageQuality.status.toUpperCase()}]` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* ICDR Badge */}
          <div className="flex items-center gap-2">
            <span 
              className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5"
              style={{
                backgroundColor: `${gradeInfo.color}20`,
                borderColor: gradeInfo.color,
                color: gradeInfo.color
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gradeInfo.color }} />
              ICDR {selectedCase.icdrGrade}: {gradeInfo.name}
            </span>

            {gradeInfo.isReferable && (
              <span className="bg-red-950/80 text-red-400 border border-red-800 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Referable DR
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          <button
            id="tab-btn-overview"
            onClick={() => setCurrentTab('overview')}
            className={`px-3 py-1.5 rounded font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'overview'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>30s Clinical Triage</span>
          </button>

          <button
            id="tab-btn-quality"
            onClick={() => setCurrentTab('quality')}
            className={`px-3 py-1.5 rounded font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'quality'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1. Image Quality (IQA)</span>
          </button>

          <button
            id="tab-btn-segmentation"
            onClick={() => setCurrentTab('segmentation')}
            className={`px-3 py-1.5 rounded font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'segmentation'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Structure Segmentation</span>
          </button>

          <button
            id="tab-btn-explainability"
            onClick={() => setCurrentTab('explainability')}
            className={`px-3 py-1.5 rounded font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'explainability'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Grad-CAM Explainability</span>
          </button>

          <button
            id="tab-btn-simulink"
            onClick={() => setCurrentTab('simulink')}
            className={`px-3 py-1.5 rounded font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'simulink'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>4. Simulink Telemed (100k+)</span>
          </button>

          <button
            id="tab-btn-vault"
            onClick={() => setCurrentTab('vault')}
            className={`px-3 py-1.5 rounded font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'vault'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>5. MATLAB Vault & Benchmarks</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
