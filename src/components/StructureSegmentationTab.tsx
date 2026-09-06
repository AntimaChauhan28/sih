import React, { useState } from 'react';
import { 
  Layers, 
  CircleDot, 
  Target, 
  Activity, 
  AlertTriangle, 
  Filter,
  CheckCircle,
  Eye,
  Info
} from 'lucide-react';
import { RetinalAnalysisResult } from '../types';
import FundusViewer from './FundusViewer';

interface StructureSegmentationTabProps {
  caseData: RetinalAnalysisResult;
}

export default function StructureSegmentationTab({ caseData }: StructureSegmentationTabProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { opticDisc, fovea, vessels, lesions, rule421 } = caseData;

  const filteredLesions = lesions.filter(l => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'microaneurysm') return l.type === 'microaneurysm';
    if (activeFilter === 'hemorrhage') return l.type.startsWith('hemorrhage');
    if (activeFilter === 'exudate') return l.type === 'hard_exudate' || l.type === 'cotton_wool_spot';
    if (activeFilter === 'neovascularization') return l.type === 'neovascularization';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Metric Cards: Anatomical Landmarks & Quantitative Calibers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Optic Disc & Cup-to-Disc Ratio */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-semibold text-cyan-400">
              <CircleDot className="w-4 h-4" />
              Optic Disc & Cup
            </span>
            <span className="font-mono text-slate-400">Hough Transform</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-2xl font-black text-slate-100 font-mono">{opticDisc.cupToDiscRatio.toFixed(2)}</span>
              <span className="text-xs text-slate-400 ml-1">CDR</span>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
              opticDisc.cupToDiscRatio > 0.6 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300'
            }`}>
              {opticDisc.cupToDiscRatio > 0.6 ? 'High Glaucoma Risk' : 'Normal Neuroretinal Rim'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            OD Radius: {opticDisc.radius}px (~1500 µm) • Cup: {opticDisc.cupRadius}px
          </span>
        </div>

        {/* Macula & Foveal Center */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-semibold text-amber-400">
              <Target className="w-4 h-4" />
              Foveal Avascular Zone
            </span>
            <span className="font-mono text-slate-400">2.5 DD Temporal</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-2xl font-black text-slate-100 font-mono">
                {caseData.dmeRisk.minDistanceToFoveaMicrons}
              </span>
              <span className="text-xs text-slate-400 ml-1">µm</span>
            </div>
            <span className="text-[11px] font-semibold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              Nearest Lesion
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            FAZ Radius: {fovea.fovealAvascularZoneRadius * 10} µm • Retinal Thickness: ~{caseData.dmeRisk.fovealThickeningEstimateMicrons} µm
          </span>
        </div>

        {/* Retinal Vascular Tree Caliber */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <Activity className="w-4 h-4" />
              Vessel Architecture
            </span>
            <span className="font-mono text-slate-400">Frangi Vesselness</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-2xl font-black text-slate-100 font-mono">{vessels.densityPercent}%</span>
              <span className="text-xs text-slate-400 ml-1">Vessel Density</span>
            </div>
            <span className="text-[11px] font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              AVR: {vessels.arteriolarVenularRatio.toFixed(2)}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Tortuosity Index: {vessels.tortuosityIndex.toFixed(2)} • Segmented Branches: {vessels.vesselCount}
          </span>
        </div>

        {/* Microaneurysm & Lesion Tally */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-semibold text-red-400">
              <AlertTriangle className="w-4 h-4" />
              Microvascular Lesions
            </span>
            <span className="font-mono text-slate-400">Sub-pixel Top-Hat</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-2xl font-black text-red-400 font-mono">{lesions.length}</span>
              <span className="text-xs text-slate-400 ml-1">Detected</span>
            </div>
            <span className="text-[11px] font-mono text-red-300 bg-red-950 px-2 py-0.5 rounded border border-red-800">
              {caseData.rule421.neovascularizationDetected ? 'PDR Fronds Detected' : 'NPDR Stage'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            MAs: {lesions.filter(l => l.type === 'microaneurysm').length} • Hemorrhages: {lesions.filter(l => l.type.startsWith('hemorrhage')).length} • Exudates: {lesions.filter(l => l.type === 'hard_exudate').length}
          </span>
        </div>
      </div>

      {/* Main Grid: Canvas Viewer + 4-2-1 Rule Matrix & Lesion Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Canvas Segmentation */}
        <div className="lg:col-span-7 space-y-3">
          <FundusViewer 
            caseData={caseData} 
            activeLayers={{
              showRaw: true,
              showOpticDisc: true,
              showFovea: true,
              showVessels: true,
              showLesions: true,
              showQuadrants: true,
              showGradCam: false
            }}
            showControlPanel={true}
          />
        </div>

        {/* Right 5 Columns: 4-2-1 Rule Verification Matrix & Lesion Table */}
        <div className="lg:col-span-5 space-y-4">
          {/* International 4-2-1 Rule Staging Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-xs text-slate-200">The International 4-2-1 Rule Staging</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                rule421.ruleSatisfied ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {rule421.ruleSatisfied ? 'Criteria Met: Severe NPDR' : 'Criteria Not Met'}
              </span>
            </div>

            {/* Quadrant Hemorrhage Counts Breakdown */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Intraretinal Hemorrhages by Quadrant:</span>
                <span className="text-[10px] text-slate-500">(Threshold: &gt;20 in all 4)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Superior Temporal:</span>
                  <span className={`font-bold ${rule421.quadrantHemorrhageCounts.superiorTemporal >= 20 ? 'text-red-400' : 'text-slate-200'}`}>
                    {rule421.quadrantHemorrhageCounts.superiorTemporal}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Superior Nasal:</span>
                  <span className={`font-bold ${rule421.quadrantHemorrhageCounts.superiorNasal >= 20 ? 'text-red-400' : 'text-slate-200'}`}>
                    {rule421.quadrantHemorrhageCounts.superiorNasal}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Inferior Temporal:</span>
                  <span className={`font-bold ${rule421.quadrantHemorrhageCounts.inferiorTemporal >= 20 ? 'text-red-400' : 'text-slate-200'}`}>
                    {rule421.quadrantHemorrhageCounts.inferiorTemporal}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Inferior Nasal:</span>
                  <span className={`font-bold ${rule421.quadrantHemorrhageCounts.inferiorNasal >= 20 ? 'text-red-400' : 'text-slate-200'}`}>
                    {rule421.quadrantHemorrhageCounts.inferiorNasal}
                  </span>
                </div>
              </div>
            </div>

            {/* Venous Beading & IRMA checklist */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Venous Beading in 2+ Quadrants:</span>
                <span className={`font-semibold ${rule421.venousBeading2PlusQuadrants ? 'text-red-400' : 'text-emerald-400'}`}>
                  {rule421.venousBeading2PlusQuadrants ? 'YES (ST & IT detected)' : 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Prominent IRMA in 1+ Quadrant:</span>
                <span className={`font-semibold ${rule421.irma1PlusQuadrant ? 'text-red-400' : 'text-emerald-400'}`}>
                  {rule421.irma1PlusQuadrant ? 'YES (Superior arcade)' : 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Neovascularization (NVD or NVE):</span>
                <span className={`font-semibold ${rule421.neovascularizationDetected ? 'text-purple-400' : 'text-slate-400'}`}>
                  {rule421.neovascularizationDetected ? 'POSITIVE (Proliferative PDR)' : 'Negative'}
                </span>
              </div>
            </div>
          </div>

          {/* Lesion Inventory List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs text-slate-200">Segmented Microvascular Lesions ({filteredLesions.length})</span>
              
              {/* Category Filter */}
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${activeFilter === 'all' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('microaneurysm')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${activeFilter === 'microaneurysm' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  MAs
                </button>
                <button
                  onClick={() => setActiveFilter('hemorrhage')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${activeFilter === 'hemorrhage' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  Hems
                </button>
                <button
                  onClick={() => setActiveFilter('exudate')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${activeFilter === 'exudate' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  Exudates
                </button>
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {filteredLesions.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs">
                  No microvascular lesions detected in this category.
                </div>
              ) : (
                filteredLesions.map(l => (
                  <div 
                    key={l.id}
                    className="bg-slate-950 p-2 rounded border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-200 capitalize flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          l.type === 'microaneurysm' ? 'bg-red-400' :
                          l.type.startsWith('hemorrhage') ? 'bg-red-600' :
                          l.type === 'hard_exudate' ? 'bg-yellow-400' :
                          l.type === 'cotton_wool_spot' ? 'bg-slate-300' : 'bg-purple-400'
                        }`} />
                        <span>{l.type.replace(/_/g, ' ')}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {l.quadrant.replace(/_/g, ' ')} • Area: {l.areaMicrons2} µm²
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-[11px] text-cyan-400 font-bold block">
                        ({l.x}, {l.y})
                      </span>
                      {l.subpixelConfidence && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {(l.subpixelConfidence * 100).toFixed(0)}% conf
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
