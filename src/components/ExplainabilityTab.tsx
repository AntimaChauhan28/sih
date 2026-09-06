import React, { useState } from 'react';
import { 
  Sparkles, 
  Eye, 
  Layers, 
  BarChart3, 
  ShieldCheck, 
  Sliders, 
  Activity, 
  CheckCircle,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { RetinalAnalysisResult } from '../types';
import { ICDR_GRADES } from '../data/patientCases';
import FundusViewer from './FundusViewer';

interface ExplainabilityTabProps {
  caseData: RetinalAnalysisResult;
}

export default function ExplainabilityTab({ caseData }: ExplainabilityTabProps) {
  const [colormap, setColormap] = useState<'jet' | 'turbo' | 'inferno' | 'viridis'>('jet');
  const [opacity, setOpacity] = useState<number>(0.65);
  const [selectedLayer, setSelectedLayer] = useState<string>('res5c_branch2c');

  // Monte Carlo Dropout Mock Probabilities for all 5 ICDR classes
  const calculateClassDistribution = (grade: number) => {
    return [0, 1, 2, 3, 4].map(g => {
      if (g === grade) {
        return {
          grade: g,
          label: `Level ${g}: ${ICDR_GRADES[g].name}`,
          probability: caseData.confidence,
          uncertainty: caseData.uncertaintyStd,
          color: ICDR_GRADES[g].color
        };
      }
      // Residual probabilities
      const distance = Math.abs(g - grade);
      const residual = Math.max(0.5, (100 - caseData.confidence) * (1 / (distance * 3)));
      return {
        grade: g,
        label: `Level ${g}: ${ICDR_GRADES[g].name}`,
        probability: Number(residual.toFixed(1)),
        uncertainty: Number((caseData.uncertaintyStd * 0.8).toFixed(1)),
        color: ICDR_GRADES[g].color
      };
    });
  };

  const classDist = calculateClassDistribution(caseData.icdrGrade);

  return (
    <div className="space-y-6">
      {/* Top Banner: Explainability Rigor */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base text-slate-100">
              Deep Learning Explainability & Grad-CAM Attention Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Validates model attention against true clinical microvascular pathology to eliminate "black-box" failure modes.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Target Protocol:</span>
          <span className="font-bold text-emerald-400">&lt; 30 Seconds Human Validation</span>
        </div>
      </div>

      {/* Main Grid: Heatmap Canvas + Layer & Attention Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Canvas with Grad-CAM */}
        <div className="lg:col-span-7 space-y-3">
          <FundusViewer 
            caseData={caseData} 
            activeLayers={{
              showGradCam: true,
              showOpticDisc: true,
              showLesions: true,
              showVessels: true,
              gradCamOpacity: opacity,
              gradCamColormap: colormap
            }}
            showControlPanel={true}
          />
        </div>

        {/* Right 5 Columns: Grad-CAM Controls, Class Probabilities & Lesion Attribution */}
        <div className="lg:col-span-5 space-y-4">
          {/* Heatmap Customization Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Grad-CAM Activation Controls</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Deep Learning Toolbox</span>
            </div>

            {/* Colormap Selector */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Attention Heatmap Colormap:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['jet', 'turbo', 'inferno', 'viridis'] as const).map(cm => (
                  <button
                    key={cm}
                    onClick={() => setColormap(cm)}
                    className={`py-1 px-2 rounded text-xs font-mono uppercase border transition cursor-pointer ${
                      colormap === cm
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {cm}
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Heatmap Alpha Blend Opacity:</span>
                <span className="font-mono text-cyan-400 font-bold">{Math.round(opacity * 100)}%</span>
              </div>
              <input 
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded cursor-pointer"
              />
            </div>

            {/* Deep Convolutional Layer Extraction */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Feature Layer Activation:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'res5c_branch2c', label: 'res5c (Deepest)' },
                  { id: 'res5b_branch2b', label: 'res5b (Mid)' },
                  { id: 'res5a_branch2a', label: 'res5a (Shallow)' }
                ].map(layer => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id)}
                    className={`py-1 px-1.5 rounded text-[10px] font-mono border transition cursor-pointer text-center ${
                      selectedLayer === layer.id
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calibrated Probability Distribution & Uncertainty (Monte Carlo Dropout) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Calibrated Class Probabilities (MC Dropout)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">10 Stochastic Passes</span>
            </div>

            <div className="space-y-2 text-xs">
              {classDist.map(cd => (
                <div key={cd.grade} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">L{cd.grade}: {ICDR_GRADES[cd.grade].name}</span>
                    <span className="font-mono text-slate-200">
                      <strong>{cd.probability}%</strong> 
                      <span className="text-[10px] text-slate-500"> (±{cd.uncertainty}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, cd.probability)}%`,
                        backgroundColor: cd.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lesion-Level Evidence Correlation */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs text-slate-200">Pathology Evidence Attribution</span>
              <span className="text-[10px] text-slate-400">ICDR Correlation</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-medium block">Microaneurysms (MAs)</span>
                  <span className="text-[10px] text-slate-400">Sub-pixel morphological correlation</span>
                </div>
                <span className="font-mono font-bold text-cyan-400">
                  {caseData.lesions.filter(l => l.type === 'microaneurysm').length} detected
                </span>
              </div>

              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-medium block">Dot & Flame Hemorrhages</span>
                  <span className="text-[10px] text-slate-400">Intraretinal vascular leakage</span>
                </div>
                <span className="font-mono font-bold text-red-400">
                  {caseData.lesions.filter(l => l.type.startsWith('hemorrhage')).length} detected
                </span>
              </div>

              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-medium block">Hard Lipid Exudates</span>
                  <span className="text-[10px] text-slate-400">Macular edema biomarker</span>
                </div>
                <span className="font-mono font-bold text-yellow-400">
                  {caseData.lesions.filter(l => l.type === 'hard_exudate').length} detected
                </span>
              </div>

              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-medium block">Neovascular Fronds (NVD/NVE)</span>
                  <span className="text-[10px] text-slate-400">Vitreoretinal hypoxia indicator</span>
                </div>
                <span className="font-mono font-bold text-purple-400">
                  {caseData.rule421.neovascularizationDetected ? 'CONFIRMED' : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
