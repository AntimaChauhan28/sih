import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  CheckCircle, 
  Image as ImageIcon, 
  Sparkles, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { RetinalAnalysisResult, ICDRLevel } from '../types';

interface UploadFundusModalProps {
  onClose: () => void;
  onImageUploaded: (newCase: RetinalAnalysisResult) => void;
}

export default function UploadFundusModal({ onClose, onImageUploaded }: UploadFundusModalProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [patientName, setPatientName] = useState<string>('Rameshwar Rao');
  const [patientAge, setPatientAge] = useState<number>(56);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [examinedEye, setExaminedEye] = useState<'OD' | 'OS'>('OD');
  const [district, setDistrict] = useState<string>('Warangal, Telangana');
  const [phcCenter, setPhcCenter] = useState<string>('Narsampet PHC');
  const [hba1c, setHba1c] = useState<number>(8.9);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const processFundusImage = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Create new case from simulated upload
      const caseId = `upload-${Date.now()}`;
      const newCase: RetinalAnalysisResult = {
        id: caseId,
        patient: {
          id: `CASE-UP-${Math.floor(1000 + Math.random() * 9000)}`,
          name: patientName,
          age: patientAge,
          gender: gender,
          patientId: `IND-TG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          district: district,
          phcCenter: phcCenter,
          screeningTimestamp: new Date().toISOString(),
          examinedEye: examinedEye,
          diabetesDurationYears: 8,
          hba1c: hba1c,
          systolicBp: 142,
          diastolicBp: 90,
          visualAcuityOD: '6/12',
          visualAcuityOS: '6/9',
          notes: 'Uploaded via rural field screening camera portal.'
        },
        imageQuality: {
          status: 'gradeable',
          overallQuality: 92.5,
          focusScore: 91.2,
          illuminationScore: 93.8,
          fovCoverageScore: 94.0,
          overexposedPercent: 1.5,
          underexposedPercent: 3.2,
          pupilVignettingDetected: false
        },
        icdrGrade: 2 as ICDRLevel, // Moderate NPDR
        confidence: 94.7,
        uncertaintyStd: 1.8,
        validationStatus: 'pending',
        timestamp: new Date().toISOString(),
        opticDisc: {
          centerX: 240,
          centerY: 400,
          radius: 76,
          cupRadius: 32,
          cupToDiscRatio: 0.42
        },
        fovea: {
          centerX: 560,
          centerY: 405,
          fovealAvascularZoneRadius: 16
        },
        vessels: {
          densityPercent: 14.8,
          arteriolarVenularRatio: 0.65,
          tortuosityIndex: 1.22,
          vesselCount: 88
        },
        lesions: [
          { id: 'upl-1', type: 'microaneurysm', x: 510, y: 380, radius: 4, areaMicrons2: 48, quadrant: 'superior_temporal', severity: 'moderate', subpixelConfidence: 0.96 },
          { id: 'upl-2', type: 'microaneurysm', x: 535, y: 445, radius: 3, areaMicrons2: 36, quadrant: 'inferior_temporal', severity: 'moderate', subpixelConfidence: 0.93 },
          { id: 'upl-3', type: 'hemorrhage_dot_blot', x: 440, y: 330, radius: 8, areaMicrons2: 120, quadrant: 'superior_nasal', severity: 'moderate', subpixelConfidence: 0.91 },
          { id: 'upl-4', type: 'hard_exudate', x: 580, y: 370, radius: 6, areaMicrons2: 85, quadrant: 'superior_temporal', severity: 'moderate', subpixelConfidence: 0.94 }
        ],
        dmeRisk: {
          riskLevel: 'non_center_involving',
          minDistanceToFoveaMicrons: 480,
          fovealThickeningEstimateMicrons: 285,
          clinicallySignificantMacularEdema: false
        },
        rule421: {
          ruleSatisfied: false,
          quadrantHemorrhageCounts: { superiorTemporal: 6, superiorNasal: 4, inferiorTemporal: 8, inferiorNasal: 2 },
          hemorrhagesAll4Quadrants: false,
          venousBeading2PlusQuadrants: false,
          irma1PlusQuadrant: false,
          neovascularizationDetected: false
        },
        gradCamHeatmapUrl: '/heatmaps/uploaded.png'
      };

      setIsProcessing(false);
      onImageUploaded(newCase);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-slate-100">
              Ingest Fundus Retinal Examination
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
              dragActive 
                ? 'border-cyan-400 bg-cyan-950/20' 
                : 'border-slate-700 hover:border-cyan-500/60 bg-slate-950/50'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*,.dcm,.mat" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFiles(e.target.files[0]);
                }
              }}
            />

            {previewUrl ? (
              <div className="space-y-2 flex flex-col items-center">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-28 h-28 object-cover rounded-full border-2 border-cyan-400 shadow-md"
                />
                <span className="font-mono text-cyan-300 font-semibold">{selectedFile?.name}</span>
                <span className="text-slate-400 text-[11px]">Click or drop another file to replace</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-full w-fit mx-auto text-cyan-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200 text-sm block">
                    Drop portable fundus capture here, or <span className="text-cyan-400 underline">browse</span>
                  </span>
                  <span className="text-slate-500 text-[11px] mt-1 block">
                    Supports 45° DICOM, JPEG, PNG, or MATLAB `.mat` workspace files
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Patient Meta Input Fields */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-slate-400 block mb-1">Patient Name:</label>
              <input 
                type="text" 
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Age &amp; Gender:</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-20 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Examined Eye:</label>
              <select
                value={examinedEye}
                onChange={(e) => setExaminedEye(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="OD">Right Eye (OD)</option>
                <option value="OS">Left Eye (OS)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Glycemic Level (HbA1c %):</label>
              <input 
                type="number" 
                step="0.1"
                value={hba1c}
                onChange={(e) => setHba1c(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="text-slate-400 block mb-1">District / PHC Unit:</label>
              <input 
                type="text" 
                value={`${phcCenter}, ${district}`}
                onChange={(e) => setPhcCenter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="btn-confirm-upload-process"
            onClick={processFundusImage}
            disabled={isProcessing}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Executing MATLAB Pipeline...' : 'Run Automated DR Analysis'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
