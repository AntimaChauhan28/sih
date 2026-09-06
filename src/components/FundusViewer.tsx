import React, { useRef, useEffect, useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Eye, 
  Split, 
  Ruler, 
  Maximize2, 
  Info
} from 'lucide-react';
import { RetinalAnalysisResult } from '../types';
import { renderFundusToCanvas, ImageEnhancementOptions } from '../utils/matlabAlgorithms';

interface FundusViewerProps {
  caseData: RetinalAnalysisResult;
  enhancementOptions?: Partial<ImageEnhancementOptions>;
  activeLayers?: {
    showRaw?: boolean;
    showEnhanced?: boolean;
    showOpticDisc?: boolean;
    showFovea?: boolean;
    showVessels?: boolean;
    showLesions?: boolean;
    showGradCam?: boolean;
    showQuadrants?: boolean;
    gradCamOpacity?: number;
    gradCamColormap?: 'jet' | 'turbo' | 'inferno' | 'viridis';
  };
  onLayerChange?: (layers: any) => void;
  showControlPanel?: boolean;
}

export default function FundusViewer({
  caseData,
  enhancementOptions = {},
  activeLayers = {},
  onLayerChange,
  showControlPanel = true
}: FundusViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Viewport State
  const [zoom, setZoom] = useState<number>(1.0);
  const [splitMode, setSplitMode] = useState<boolean>(false);
  const [splitPosition, setSplitPosition] = useState<number>(50); // percentage
  const [isRulerActive, setIsRulerActive] = useState<boolean>(false);
  const [rulerPoints, setRulerPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [hoveredLesion, setHoveredLesion] = useState<any | null>(null);

  // Local layer toggles
  const [layers, setLayers] = useState({
    showRaw: true,
    showEnhanced: true,
    showOpticDisc: true,
    showFovea: true,
    showVessels: true,
    showLesions: true,
    showGradCam: activeLayers.showGradCam ?? true,
    showQuadrants: false,
    gradCamOpacity: activeLayers.gradCamOpacity ?? 0.60,
    gradCamColormap: activeLayers.gradCamColormap ?? 'jet',
    ...activeLayers
  });

  const fullEnhancement: ImageEnhancementOptions = {
    claheClipLimit: 0.025,
    tileGridSize: 8,
    illuminationNormalization: true,
    denoiseStrength: 2,
    colorChannel: 'rgb',
    brightness: 0,
    contrast: 1.0,
    ...enhancementOptions
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderFundusToCanvas(ctx, canvas.width, canvas.height, caseData, fullEnhancement, layers);

    // If ruler is active and has 2 points, draw measurement line
    if (rulerPoints.length === 2) {
      const p1 = rulerPoints[0];
      const p2 = rulerPoints[1];
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Draw endpoints
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 4, 0, Math.PI * 2);
      ctx.arc(p2.x, p2.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Calculate distance in microns
      // Scale: 75px OD radius = 1500um OD diameter => 150px = 1500um => 1px = 10um
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const pixelDist = Math.sqrt(dx * dx + dy * dy);
      const microns = Math.round(pixelDist * 10);
      const odDiameters = (microns / 1500).toFixed(2);

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(midX - 50, midY - 22, 100, 20);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(midX - 50, midY - 22, 100, 20);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`${microns} µm (${odDiameters} DD)`, midX - 44, midY - 8);

      ctx.restore();
    }
  }, [caseData, fullEnhancement, layers, rulerPoints]);

  // Handle canvas click for ruler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isRulerActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (rulerPoints.length >= 2) {
      setRulerPoints([{ x, y }]);
    } else {
      setRulerPoints([...rulerPoints, { x, y }]);
    }
  };

  // Handle hover over lesions
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Check distance to lesions
    const found = caseData.lesions.find(l => {
      const lx = (l.x / 800) * canvas.width;
      const ly = (l.y / 800) * canvas.height;
      const dist = Math.sqrt((mouseX - lx) ** 2 + (mouseY - ly) ** 2);
      return dist <= Math.max(12, l.radius * 2);
    });

    setHoveredLesion(found || null);
  };

  const toggleLayer = (key: string) => {
    const updated = { ...layers, [key]: !(layers as any)[key] };
    setLayers(updated);
    if (onLayerChange) onLayerChange(updated);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
      {/* Top Toolbar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Fundus Inspector</span>
          </span>
          <span className="text-slate-500 font-mono">[{caseData.patient.examinedEye} Eye • 45° FOV]</span>
        </div>

        {/* Viewport & Measurement Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-ruler-tool"
            onClick={() => {
              setIsRulerActive(!isRulerActive);
              if (isRulerActive) setRulerPoints([]);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition text-[11px] cursor-pointer ${
              isRulerActive 
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Measure retinal distances in micrometers and Disc Diameters (DD)"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>{isRulerActive ? 'Measuring...' : 'Ruler (µm)'}</span>
          </button>

          <div className="flex items-center bg-slate-800 rounded border border-slate-700 p-0.5">
            <button
              onClick={() => setZoom(Math.max(0.75, zoom - 0.15))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-200">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(2.0, zoom + 0.15))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoom(1.0); setRulerPoints([]); }}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 ml-1 cursor-pointer"
              title="Reset view"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative bg-slate-950 flex items-center justify-center p-4 min-h-[440px] overflow-hidden">
        <div 
          className="relative transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          <canvas
            ref={canvasRef}
            id="fundus-render-canvas"
            width={720}
            height={720}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={() => setHoveredLesion(null)}
            className="w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] md:w-[540px] md:h-[540px] rounded-full shadow-2xl cursor-crosshair border border-slate-800 bg-slate-950"
          />

          {/* Hovered Lesion Tooltip */}
          {hoveredLesion && (
            <div 
              className="absolute bg-slate-900/95 border border-cyan-500/60 p-2.5 rounded-lg shadow-xl text-xs pointer-events-none z-30 max-w-[200px]"
              style={{
                left: `${(hoveredLesion.x / 800) * 100}%`,
                top: `${(hoveredLesion.y / 800) * 100}%`,
                transform: 'translate(-50%, -120%)'
              }}
            >
              <div className="font-bold text-cyan-400 capitalize">
                {hoveredLesion.type.replace(/_/g, ' ')}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Quadrant: <span className="font-semibold text-slate-200">{hoveredLesion.quadrant.replace(/_/g, ' ')}</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Area: <span className="font-mono text-amber-400">{hoveredLesion.areaMicrons2} µm²</span>
              </div>
              {hoveredLesion.subpixelConfidence && (
                <div className="text-[11px] text-slate-400">
                  Sub-pixel Conf: <span className="text-emerald-400 font-mono">{(hoveredLesion.subpixelConfidence * 100).toFixed(0)}%</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quality Flag Warning if Ungradeable or Borderline */}
        {caseData.imageQuality.status === 'ungradeable' && (
          <div className="absolute top-4 left-4 bg-red-950/90 border border-red-700 text-red-200 px-3 py-2 rounded-lg text-xs max-w-xs shadow-lg backdrop-blur">
            <div className="font-bold flex items-center gap-1.5 text-red-400">
              <Info className="w-4 h-4" />
              <span>Ungradeable Image (Defocus & Glare)</span>
            </div>
            <p className="text-[11px] text-red-300/90 mt-1">
              Automated IQA rejected this capture. Recapture recommended before ophthalmologist review.
            </p>
          </div>
        )}

        {caseData.imageQuality.status === 'borderline' && (
          <div className="absolute top-4 left-4 bg-amber-950/90 border border-amber-700 text-amber-200 px-3 py-2 rounded-lg text-xs max-w-xs shadow-lg backdrop-blur">
            <div className="font-bold flex items-center gap-1.5 text-amber-400">
              <Info className="w-4 h-4" />
              <span>Borderline Quality: CLAHE Applied</span>
            </div>
            <p className="text-[11px] text-amber-300/90 mt-1">
              Dynamic range equalized with adaptive CLAHE (clip 0.02, tiles [8 8]).
            </p>
          </div>
        )}
      </div>

      {/* Layer Toggles & Segmentation Legend */}
      {showControlPanel && (
        <div className="bg-slate-950/95 border-t border-slate-800 p-3 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-400">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Segmentation Layers:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="layer-opt-disc"
              onClick={() => toggleLayer('showOpticDisc')}
              className={`px-2 py-1 rounded border text-[11px] transition cursor-pointer flex items-center gap-1 ${
                layers.showOpticDisc
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Optic Disc & CDR</span>
            </button>

            <button
              id="layer-fovea"
              onClick={() => toggleLayer('showFovea')}
              className={`px-2 py-1 rounded border text-[11px] transition cursor-pointer flex items-center gap-1 ${
                layers.showFovea
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Fovea / FAZ</span>
            </button>

            <button
              id="layer-lesions"
              onClick={() => toggleLayer('showLesions')}
              className={`px-2 py-1 rounded border text-[11px] transition cursor-pointer flex items-center gap-1 ${
                layers.showLesions
                  ? 'bg-red-950/80 border-red-500 text-red-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>Lesions ({caseData.lesions.length})</span>
            </button>

            <button
              id="layer-gradcam"
              onClick={() => toggleLayer('showGradCam')}
              className={`px-2 py-1 rounded border text-[11px] transition cursor-pointer flex items-center gap-1 ${
                layers.showGradCam
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Grad-CAM Heatmap</span>
            </button>

            <button
              id="layer-quadrants"
              onClick={() => toggleLayer('showQuadrants')}
              className={`px-2 py-1 rounded border text-[11px] transition cursor-pointer flex items-center gap-1 ${
                layers.showQuadrants
                  ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>4-2-1 Quadrants</span>
            </button>

            <button
              id="layer-clahe"
              onClick={() => toggleLayer('showEnhanced')}
              className={`px-2 py-1 rounded border text-[11px] transition cursor-pointer flex items-center gap-1 ${
                layers.showEnhanced
                  ? 'bg-blue-950/80 border-blue-500 text-blue-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>CLAHE Enhancement</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
