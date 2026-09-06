import React, { useState } from 'react';
import HeaderNavbar from './components/HeaderNavbar';
import PipelineOverviewTab from './components/PipelineOverviewTab';
import ImageQualityTab from './components/ImageQualityTab';
import StructureSegmentationTab from './components/StructureSegmentationTab';
import ExplainabilityTab from './components/ExplainabilityTab';
import SimulinkTelemedTab from './components/SimulinkTelemedTab';
import MatlabVaultTab from './components/MatlabVaultTab';
import ClinicalReportModal from './components/ClinicalReportModal';
import AshaCounselingModal from './components/AshaCounselingModal';
import UploadFundusModal from './components/UploadFundusModal';
import { PATIENT_CASES } from './data/patientCases';
import { RetinalAnalysisResult, ICDRLevel } from './types';

export default function App() {
  const [cases, setCases] = useState<RetinalAnalysisResult[]>(PATIENT_CASES);
  // Default to Case 3 (Kamala Devi - Severe NPDR) which showcases full microaneurysms, hemorrhages, exudates, and 4-2-1 rule
  const [selectedCase, setSelectedCase] = useState<RetinalAnalysisResult>(PATIENT_CASES[2]);
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isAshaModalOpen, setIsAshaModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Handle clinical validation
  const handleValidateCase = async (
    status: 'approved' | 'overruled' | 'flagged',
    notes?: string,
    overruledGrade?: ICDRLevel
  ) => {
    try {
      const payload: any = { status, notes };
      if (overruledGrade !== undefined) {
        payload.overruledGrade = overruledGrade;
      }

      const caseId = selectedCase.id || selectedCase.patient.id;
      const res = await fetch(`/api/cases/${caseId}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const updatedCase = await res.json();
      
      // Update case in state
      setSelectedCase(updatedCase);
      setCases(prev => prev.map(c => (c.id || c.patient.id) === (updatedCase.id || updatedCase.patient.id) ? updatedCase : c));
    } catch (err) {
      console.error('Error validating case:', err);
      // Fallback local update
      const updatedCase: RetinalAnalysisResult = {
        ...selectedCase,
        validationStatus: status,
        reviewNotes: notes || selectedCase.reviewNotes,
        icdrGrade: overruledGrade !== undefined ? overruledGrade : selectedCase.icdrGrade
      };
      setSelectedCase(updatedCase);
      setCases(prev => prev.map(c => (c.id || c.patient.id) === (updatedCase.id || updatedCase.patient.id) ? updatedCase : c));
    }
  };

  const handleImageUploaded = (newCase: RetinalAnalysisResult) => {
    setCases(prev => [newCase, ...prev]);
    setSelectedCase(newCase);
    setCurrentTab('overview');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Navigation Header */}
      <HeaderNavbar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cases={cases}
        selectedCase={selectedCase}
        setSelectedCase={setSelectedCase}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAshaModal={() => setIsAshaModalOpen(true)}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {currentTab === 'overview' && (
          <PipelineOverviewTab 
            caseData={selectedCase}
            onValidateCase={handleValidateCase}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenAshaModal={() => setIsAshaModalOpen(true)}
          />
        )}

        {currentTab === 'quality' && (
          <ImageQualityTab 
            caseData={selectedCase}
          />
        )}

        {currentTab === 'segmentation' && (
          <StructureSegmentationTab 
            caseData={selectedCase}
          />
        )}

        {currentTab === 'explainability' && (
          <ExplainabilityTab 
            caseData={selectedCase}
          />
        )}

        {currentTab === 'simulink' && (
          <SimulinkTelemedTab />
        )}

        {currentTab === 'vault' && (
          <MatlabVaultTab />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">MATLAB Retinal Image Analysis Pipeline for Rural India</span>
          <span>•</span>
          <span>MathWorks DR Screening Consortium</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
          <span>Image Processing • Computer Vision • Deep Learning • Simulink</span>
          <span>Sensitivity &gt;90% • Specificity &gt;85%</span>
        </div>
      </footer>

      {/* Modals */}
      {isReportModalOpen && (
        <ClinicalReportModal 
          caseData={selectedCase}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {isAshaModalOpen && (
        <AshaCounselingModal 
          caseData={selectedCase}
          onClose={() => setIsAshaModalOpen(false)}
        />
      )}

      {isUploadModalOpen && (
        <UploadFundusModal 
          onClose={() => setIsUploadModalOpen(false)}
          onImageUploaded={handleImageUploaded}
        />
      )}
    </div>
  );
}
