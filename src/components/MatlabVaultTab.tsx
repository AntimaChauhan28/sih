import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  BarChart2, 
  Layers, 
  TrendingUp, 
  FileCode, 
  ShieldCheck, 
  Award,
  BookOpen
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { MATLAB_SCRIPTS, BENCHMARK_DATASETS, PIPELINE_COMPARISONS } from '../data/patientCases';

export default function MatlabVaultTab() {
  const [selectedScriptId, setSelectedScriptId] = useState<string>(MATLAB_SCRIPTS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedBenchmarkIndex, setSelectedBenchmarkIndex] = useState<number>(0);

  const activeScript = MATLAB_SCRIPTS.find(s => s.id === selectedScriptId) || MATLAB_SCRIPTS[0];
  const activeBenchmark = BENCHMARK_DATASETS[selectedBenchmarkIndex];

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadScript = (script: typeof activeScript) => {
    const blob = new Blob([script.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = script.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: MathWorks Engineering & Published Clinical Rigor */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-950 border border-orange-700 text-orange-400 rounded-lg">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <span>MATLAB Toolboxes &amp; Clinical Validation Benchmarks</span>
                <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Target: Sens &gt;90% • Spec &gt;85%
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Executable algorithms spanning Image Processing, Computer Vision, Deep Learning, Medical Imaging, Simulink, and Statistics.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadScript(activeScript)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 text-xs flex items-center gap-1.5 transition cursor-pointer font-medium"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download .m File</span>
          </button>

          <button
            onClick={() => handleCopyCode(activeScript.code, activeScript.id)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow transition cursor-pointer font-semibold"
          >
            {copiedId === activeScript.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId === activeScript.id ? 'Copied to Clipboard' : 'Copy MATLAB Code'}</span>
          </button>
        </div>
      </div>

      {/* Benchmark Validation Section (IDRiD, Messidor-2, EyePACS) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Published Dataset Validation (Sensitivity &gt;90%, Specificity &gt;85%)
            </h3>
          </div>

          {/* Dataset Switcher */}
          <div className="flex items-center gap-1.5">
            {BENCHMARK_DATASETS.map((ds, idx) => (
              <button
                key={ds.datasetName}
                onClick={() => setSelectedBenchmarkIndex(idx)}
                className={`px-3 py-1 rounded text-xs font-medium border transition cursor-pointer ${
                  selectedBenchmarkIndex === idx
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {ds.datasetName.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Dataset Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cohort Size</span>
            <span className="text-xl font-bold font-mono text-slate-100 mt-0.5 block">
              {activeBenchmark.patientCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500">Fundus exams</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Clinical Sensitivity</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
              {activeBenchmark.sensitivity}%
            </span>
            <span className="text-[10px] text-emerald-400">Target: &gt;90% (PASSED)</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Clinical Specificity</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
              {activeBenchmark.specificity}%
            </span>
            <span className="text-[10px] text-emerald-400">Target: &gt;85% (PASSED)</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">ROC Area (AUC)</span>
            <span className="text-xl font-bold font-mono text-cyan-400 mt-0.5 block">
              {activeBenchmark.aucRoc}
            </span>
            <span className="text-[10px] text-cyan-400">Excellent discrimination</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cohen's Kappa (κ)</span>
            <span className="text-xl font-bold font-mono text-purple-400 mt-0.5 block">
              {activeBenchmark.kappaScore}
            </span>
            <span className="text-[10px] text-slate-500">Strong clinical agreement</span>
          </div>
        </div>

        {/* ROC Curve Graph & Pipeline Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Left 6 Columns: ROC Curve */}
          <div className="lg:col-span-6 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">
                Receiver Operating Characteristic (ROC) - {activeBenchmark.datasetName}
              </span>
              <span className="font-mono text-cyan-400 font-semibold">AUC = {activeBenchmark.aucRoc}</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeBenchmark.rocPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="fpr" stroke="#64748b" label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis stroke="#64748b" label={{ value: 'True Positive Rate (Sensitivity)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                    formatter={(val: any) => [`${(Number(val) * 100).toFixed(1)}%`, 'Rate']}
                  />
                  <Line type="monotone" dataKey="tpr" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4, fill: '#06b6d4' }} name="Integrated MATLAB Pipeline" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right 6 Columns: Integrated Pipeline vs Single Technique Benchmarking */}
          <div className="lg:col-span-6 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Integrated Pipeline vs. Single-Technique Approaches</span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">Outperforms Single Models</span>
            </div>

            <div className="space-y-2 text-xs">
              {PIPELINE_COMPARISONS.map((p, idx) => (
                <div 
                  key={p.technique}
                  className={`p-2.5 rounded border transition ${
                    idx === 0 
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md' 
                      : 'bg-slate-900 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span className="truncate pr-2">{p.technique}</span>
                    <span className="font-mono text-cyan-400 shrink-0">AUC: {p.auc}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Sens: <strong className={p.sensitivity >= 90 ? 'text-emerald-400' : 'text-slate-300'}>{p.sensitivity}%</strong></span>
                    <span>Spec: <strong className={p.specificity >= 85 ? 'text-emerald-400' : 'text-slate-300'}>{p.specificity}%</strong></span>
                    <span>Time: <strong className="font-mono text-slate-300">{p.processingTimeMs}ms</strong></span>
                    <span>Explainable: <strong className={p.explainable ? 'text-emerald-400' : 'text-red-400'}>{p.explainable ? 'YES' : 'NO'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MATLAB Code Generator Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Columns: Script Navigation */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>MathWorks Toolboxes Modules</span>
          </div>

          <div className="space-y-1.5">
            {MATLAB_SCRIPTS.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedScriptId(s.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition cursor-pointer text-xs ${
                  selectedScriptId === s.id
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-slate-200 truncate">{s.title}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.toolbox}</div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{s.summary}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 8 Columns: Code Viewer with Syntax Styling */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          {/* Header */}
          <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-orange-400" />
              <span className="font-mono font-bold text-slate-200">{activeScript.filename}</span>
              <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                {activeScript.toolbox}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyCode(activeScript.code, activeScript.id)}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer text-xs"
              >
                {copiedId === activeScript.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === activeScript.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Code Content */}
          <div className="p-4 bg-slate-950/95 overflow-x-auto max-h-[500px] font-mono text-xs text-slate-200 leading-relaxed scrollbar-thin">
            <pre>
              <code>{activeScript.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
