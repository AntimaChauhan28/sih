import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Edit3, 
  Send, 
  Sparkles, 
  MapPin, 
  Activity, 
  User, 
  TrendingUp,
  Info
} from 'lucide-react';
import { RetinalAnalysisResult, ICDRLevel } from '../types';
import { ICDR_GRADES } from '../data/patientCases';
import FundusViewer from './FundusViewer';

interface PipelineOverviewTabProps {
  caseData: RetinalAnalysisResult;
  onValidateCase: (status: 'approved' | 'overruled' | 'flagged', notes?: string, overruledGrade?: ICDRLevel) => void;
  onOpenReportModal: () => void;
  onOpenAshaModal: () => void;
}

export default function PipelineOverviewTab({
  caseData,
  onValidateCase,
  onOpenReportModal,
  onOpenAshaModal
}: PipelineOverviewTabProps) {
  const gradeInfo = ICDR_GRADES[caseData.icdrGrade];
  const [selectedOverruleGrade, setSelectedOverruleGrade] = useState<ICDRLevel>(caseData.icdrGrade);
  const [reviewNotes, setReviewNotes] = useState<string>(caseData.reviewNotes || '');
  const [isEditingGrade, setIsEditingGrade] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleApprove = () => {
    onValidateCase('approved', reviewNotes || 'Clinically verified via 30-sec explainability protocol.');
    setActionSuccess('AI Staging Approved by Ophthalmologist');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleOverrule = () => {
    onValidateCase('overruled', reviewNotes || `Overruled to Level ${selectedOverruleGrade}`, selectedOverruleGrade);
    setIsEditingGrade(false);
    setActionSuccess(`Staging Overruled to Level ${selectedOverruleGrade}`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleFlagUrgent = () => {
    onValidateCase('flagged', reviewNotes || 'Urgent Vitreoretinal Referral Required.');
    setActionSuccess('Patient Flagged for Urgent Vitreoretinal Transfer');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Action Notification Banner */}
      {actionSuccess && (
        <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg shadow-lg flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">{actionSuccess}</span>
          </div>
          <span className="text-xs text-emerald-400 font-mono">Synced to District Registry</span>
        </div>
      )}

      {/* Main Grid: Left Viewer (Canvas) + Right Clinical Triage Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Interactive High-Res Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <FundusViewer 
            caseData={caseData} 
            showControlPanel={true}
          />

          {/* Quick Guidance Box for 30-Second Protocol */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-start gap-3 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">MathWorks 30-Second Human-in-the-Loop Protocol:</span>
              <p className="mt-0.5 leading-relaxed">
                1. Inspect Grad-CAM attention heatmap to confirm model focus on actual microvascular lesions.
                2. Verify sub-pixel microaneurysms and 4-2-1 Rule quadrant hemorrhage tally.
                3. Click <strong className="text-emerald-400">Approve AI Diagnosis</strong> or adjust staging below.
              </p>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Diagnostic Evidence & Validation Station */}
        <div className="lg:col-span-5 space-y-4">
          {/* Patient Demographic Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-slate-200">{caseData.patient.name}</span>
                <span className="text-slate-400 text-xs">({caseData.patient.age}y, {caseData.patient.gender})</span>
              </div>
              <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {caseData.patient.patientId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Location / PHC:</span>
                <span className="font-medium text-slate-200 truncate block">{caseData.patient.phcCenter}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Diabetes Duration:</span>
                <span className="font-medium text-slate-200">{caseData.patient.diabetesDurationYears} Years</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Glycemic Control (HbA1c):</span>
                <span className={`font-mono font-bold ${caseData.patient.hba1c > 8.0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {caseData.patient.hba1c}%
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Blood Pressure:</span>
                <span className="font-mono text-slate-200">{caseData.patient.systolicBp}/{caseData.patient.diastolicBp} mmHg</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Visual Acuity (OD / OS):</span>
                <span className="font-mono text-cyan-300">{caseData.patient.visualAcuityOD} / {caseData.patient.visualAcuityOS}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Examined Eye:</span>
                <span className="font-bold text-amber-400 font-mono">{caseData.patient.examinedEye} (Right Eye)</span>
              </div>
            </div>
          </div>

          {/* ICDR Severity Grading & Calibrated Confidence */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Automated ICDR Grading
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Conf: <strong className="text-emerald-400 font-bold">{caseData.confidence.toFixed(1)}%</strong>
                <span className="text-[10px] text-slate-500"> (±{caseData.uncertaintyStd.toFixed(1)}%)</span>
              </span>
            </div>

            {/* Severity Gauge Banner */}
            <div 
              className="p-3.5 rounded-lg border flex items-start gap-3"
              style={{
                backgroundColor: `${gradeInfo.color}15`,
                borderColor: `${gradeInfo.color}60`
              }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg text-white shrink-0 shadow"
                style={{ backgroundColor: gradeInfo.color }}
              >
                L{caseData.icdrGrade}
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm text-slate-100 flex items-center justify-between">
                  <span>{gradeInfo.name}</span>
                  {gradeInfo.isReferable && (
                    <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                      Referable DR
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-normal">
                  {gradeInfo.clinicalCriteria}
                </p>
              </div>
            </div>

            {/* 5-Step ICDR Visual Level Bar */}
            <div className="grid grid-cols-5 gap-1 pt-1">
              {[0, 1, 2, 3, 4].map((lvl) => {
                const info = ICDR_GRADES[lvl];
                const isActive = caseData.icdrGrade === lvl;
                return (
                  <div 
                    key={lvl}
                    className={`py-1 px-1 rounded text-center text-[10px] font-bold border transition ${
                      isActive 
                        ? 'border-white text-white shadow-md'
                        : 'border-slate-800 text-slate-500 bg-slate-950'
                    }`}
                    style={isActive ? { backgroundColor: info.color } : {}}
                  >
                    Lvl {lvl}
                  </div>
                );
              })}
            </div>

            {/* Macular Edema (DME) Assessment */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Macular Edema (DME) Risk:</span>
                <span className={`font-bold capitalize ${
                  caseData.dmeRisk.riskLevel === 'center_involving' ? 'text-red-400' :
                  caseData.dmeRisk.riskLevel === 'non_center_involving' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {caseData.dmeRisk.riskLevel.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Fovea Distance:</span>
                <span className="font-mono text-slate-200">{caseData.dmeRisk.minDistanceToFoveaMicrons} µm</span>
              </div>
            </div>

            {/* The 4-2-1 Rule Quadrant Evidence */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-slate-300">
                <span>The International 4-2-1 Rule Staging:</span>
                <span className={`font-mono px-1.5 py-0.5 rounded text-[10px] ${
                  caseData.rule421.ruleSatisfied ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {caseData.rule421.ruleSatisfied ? 'CRITERIA MET (Severe NPDR)' : 'Criteria Not Met'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div>
                  • 4-Quadrant Hemorrhages: <strong className={caseData.rule421.hemorrhagesAll4Quadrants ? 'text-red-400' : 'text-slate-300'}>
                    {caseData.rule421.hemorrhagesAll4Quadrants ? 'YES (>20/quadrant)' : 'No'}
                  </strong>
                </div>
                <div>
                  • Venous Beading (2+ quad): <strong className={caseData.rule421.venousBeading2PlusQuadrants ? 'text-red-400' : 'text-slate-300'}>
                    {caseData.rule421.venousBeading2PlusQuadrants ? 'Detected' : 'None'}
                  </strong>
                </div>
                <div>
                  • IRMA (1+ quadrant): <strong className={caseData.rule421.irma1PlusQuadrant ? 'text-red-400' : 'text-slate-300'}>
                    {caseData.rule421.irma1PlusQuadrant ? 'Present' : 'None'}
                  </strong>
                </div>
                <div>
                  • Neovascularization (PDR): <strong className={caseData.rule421.neovascularizationDetected ? 'text-red-400' : 'text-slate-300'}>
                    {caseData.rule421.neovascularizationDetected ? 'Detected (NVD/NVE)' : 'None'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Ophthalmologist Validation Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ophthalmologist Validation Status</span>
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded capitalize ${
                caseData.validationStatus === 'approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                caseData.validationStatus === 'flagged' ? 'bg-red-950 text-red-300 border border-red-800' :
                'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {caseData.validationStatus}
              </span>
            </div>

            {/* Reviewer Notes Field */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Clinical Verification Notes:</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter clinical observations or overrule justification..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 h-16 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                id="btn-approve-staging"
                onClick={handleApprove}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Approve AI Staging</span>
              </button>

              <button
                id="btn-flag-urgent"
                onClick={handleFlagUrgent}
                className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Urgent VR Referral</span>
              </button>
            </div>

            {/* Overrule Staging Option */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              {!isEditingGrade ? (
                <button
                  onClick={() => setIsEditingGrade(true)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer text-xs"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Manual Grade Overrule...</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <select
                    value={selectedOverruleGrade}
                    onChange={(e) => setSelectedOverruleGrade(Number(e.target.value) as ICDRLevel)}
                    className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 flex-1"
                  >
                    {[0, 1, 2, 3, 4].map(l => (
                      <option key={l} value={l}>Level {l}: {ICDR_GRADES[l].name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleOverrule}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-2.5 py-1 rounded text-xs cursor-pointer font-medium"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setIsEditingGrade(false)}
                    className="text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <button
                onClick={onOpenReportModal}
                className="text-slate-300 hover:text-white flex items-center gap-1 text-xs cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Full Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
