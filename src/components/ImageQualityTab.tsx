import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertOctagon, 
  Sliders, 
  Sun, 
  Focus, 
  Maximize, 
  RefreshCw, 
  Eye, 
  RotateCcw,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { RetinalAnalysisResult } from '../types';
import FundusViewer from './FundusViewer';
import { ImageEnhancementOptions } from '../utils/matlabAlgorithms';

interface ImageQualityTabProps {
  caseData: RetinalAnalysisResult;
}

export default function ImageQualityTab({ caseData }: ImageQualityTabProps) {
  const [enhancement, setEnhancement] = useState<ImageEnhancementOptions>({
    claheClipLimit: 0.025,
    tileGridSize: 8,
    illuminationNormalization: true,
    denoiseStrength: 2,
    colorChannel: 'rgb',
    brightness: 0,
    contrast: 1.0
  });

  const { imageQuality } = caseData;

  const resetEnhancements = () => {
    setEnhancement({
      claheClipLimit: 0.025,
      tileGridSize: 8,
      illuminationNormalization: true,
      denoiseStrength: 2,
      colorChannel: 'rgb',
      brightness: 0,
      contrast: 1.0
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Quality Evaluation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Quality Card */}
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow ${
          imageQuality.status === 'gradeable' ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200' :
          imageQuality.status === 'borderline' ? 'bg-amber-950/40 border-amber-800/80 text-amber-200' :
          'bg-red-950/40 border-red-800/80 text-red-200'
        }`}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider block opacity-80">IQA Triage Status</span>
            <span className="text-xl font-bold capitalize mt-0.5 block">
              {imageQuality.status === 'gradeable' ? 'Gradeable (Adequate)' :
               imageQuality.status === 'borderline' ? 'Borderline (Adaptive CLAHE)' : 'Ungradeable (Rejected)'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono">{imageQuality.overallQuality.toFixed(1)}</span>
            <span className="text-xs block opacity-70">/ 100</span>
          </div>
        </div>

        {/* Focus Sharpness */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Focus className="w-4 h-4 text-cyan-400" />
              Focus Sharpness
            </span>
            <span className="font-mono font-bold text-slate-200">{imageQuality.focusScore.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className={`h-full rounded-full transition-all ${
                imageQuality.focusScore > 75 ? 'bg-cyan-400' : imageQuality.focusScore > 50 ? 'bg-amber-400' : 'bg-red-500'
              }`}
              style={{ width: `${imageQuality.focusScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block">Modified Laplacian variance</span>
        </div>

        {/* Illumination & Dynamic Range */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Sun className="w-4 h-4 text-amber-400" />
              Illumination Uniformity
            </span>
            <span className="font-mono font-bold text-slate-200">{imageQuality.illuminationScore.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className={`h-full rounded-full transition-all ${
                imageQuality.illuminationScore > 75 ? 'bg-emerald-400' : imageQuality.illuminationScore > 50 ? 'bg-amber-400' : 'bg-red-500'
              }`}
              style={{ width: `${imageQuality.illuminationScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block">
            Underexposed: {imageQuality.underexposedPercent}% | Overexposed: {imageQuality.overexposedPercent}%
          </span>
        </div>

        {/* Field of View (FOV) Coverage */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Maximize className="w-4 h-4 text-purple-400" />
              FOV Adequacy
            </span>
            <span className="font-mono font-bold text-slate-200">{imageQuality.fovCoverageScore.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="h-full rounded-full bg-purple-500 transition-all"
              style={{ width: `${imageQuality.fovCoverageScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block">
            45° Centration • {imageQuality.pupilVignettingDetected ? 'Pupil Vignette Flagged' : 'Full Pupil Aperture'}
          </span>
        </div>
      </div>

      {/* Main Grid: Fundus Inspection with Enhancement Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Canvas Inspector */}
        <div className="lg:col-span-7 space-y-3">
          <FundusViewer 
            caseData={caseData} 
            enhancementOptions={enhancement}
            activeLayers={{
              showGradCam: false,
              showEnhanced: true
            }}
            showControlPanel={true}
          />
        </div>

        {/* Right 5 Columns: MATLAB Adaptive CLAHE & Feedback Console */}
        <div className="lg:col-span-5 space-y-4">
          {/* MATLAB Image Enhancement Interactive Laboratory */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>MATLAB Image Processing Enhancement Lab</span>
              </span>
              <button
                onClick={resetEnhancements}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Color Channel Isolation */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Color Spectral Band:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['rgb', 'green', 'red', 'blue'] as const).map(chan => (
                  <button
                    key={chan}
                    onClick={() => setEnhancement({ ...enhancement, colorChannel: chan })}
                    className={`py-1 px-2 rounded text-[11px] font-medium uppercase border transition cursor-pointer ${
                      enhancement.colorChannel === chan
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {chan === 'green' ? 'Green (Peak Contrast)' : chan}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                *Green channel (540nm) provides optimal absorption contrast for hemoglobin microaneurysms.
              </span>
            </div>

            {/* CLAHE Clip Limit Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>CLAHE Clip Limit:</span>
                <span className="font-mono text-cyan-400 font-bold">{enhancement.claheClipLimit.toFixed(3)}</span>
              </div>
              <input 
                type="range"
                min="0.005"
                max="0.050"
                step="0.005"
                value={enhancement.claheClipLimit}
                onChange={(e) => setEnhancement({ ...enhancement, claheClipLimit: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.005 (Subtle)</span>
                <span>0.020 (Clinical Standard)</span>
                <span>0.050 (High Contrast)</span>
              </div>
            </div>

            {/* Tile Grid Size */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">NumTiles Context Grid:</label>
              <div className="grid grid-cols-3 gap-2">
                {[4, 8, 16].map(size => (
                  <button
                    key={size}
                    onClick={() => setEnhancement({ ...enhancement, tileGridSize: size })}
                    className={`py-1 px-2 rounded text-xs font-mono border transition cursor-pointer ${
                      enhancement.tileGridSize === size
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    [{size} × {size}]
                  </button>
                ))}
              </div>
            </div>

            {/* Illumination Normalization & Background Subtraction */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-xs font-medium text-slate-200 block">Homomorphic Illumination Flattening</span>
                <span className="text-[10px] text-slate-500">Gaussian spatial background normalization</span>
              </div>
              <input 
                type="checkbox"
                checked={enhancement.illuminationNormalization}
                onChange={(e) => setEnhancement({ ...enhancement, illuminationNormalization: e.target.checked })}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Actionable Recapture Feedback for Rural Health Workers */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>PHC Operator Recapture & Triage Feedback</span>
            </div>

            {imageQuality.status === 'ungradeable' ? (
              <div className="space-y-2">
                <div className="bg-red-950/60 border border-red-800 p-2.5 rounded text-xs text-red-200">
                  <span className="font-bold block">RECAPTURE REQUIRED - Reject from Grading Pipeline</span>
                  <ul className="list-disc list-inside text-[11px] text-red-300 mt-1 space-y-0.5">
                    {imageQuality.rejectionReasons?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs space-y-1">
                  <span className="font-semibold text-cyan-400 block text-[11px]">Field Correction Checklist:</span>
                  {imageQuality.recaptureFeedback?.map((fb, i) => (
                    <div key={i} className="text-[11px] text-slate-300 leading-tight">
                      • {fb}
                    </div>
                  ))}
                </div>
              </div>
            ) : imageQuality.status === 'borderline' ? (
              <div className="bg-amber-950/40 border border-amber-800/80 p-3 rounded text-xs text-amber-200 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  Borderline Quality Successfully Rescued
                </span>
                <p className="text-[11px] text-amber-300/80">
                  The automated pipeline detected mild cataract media opacity or low dynamic range. MATLAB adaptive CLAHE restored diagnostic gradeability for microaneurysm detection.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-950/40 border border-emerald-800/80 p-3 rounded text-xs text-emerald-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Optimal Clinical Acquisition
                </span>
                <p className="text-[11px] text-emerald-300/80">
                  Image sharpness exceeds 90% threshold. Vessel bifurcation and foveal avascular zone are clearly delineated. Proceeding to segmentation and grading.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
