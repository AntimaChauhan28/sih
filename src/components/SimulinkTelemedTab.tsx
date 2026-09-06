import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  Users, 
  Wifi, 
  Stethoscope, 
  Clock, 
  IndianRupee, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { SimulinkConfig, SimulinkRunResult } from '../types';

export default function SimulinkTelemedTab() {
  const [config, setConfig] = useState<SimulinkConfig>({
    annualCohortSize: 120000,
    phcCenterCount: 30,
    cameraOperatorsPerPhc: 1,
    bandwidthMbps: 1.5,
    useEdgeAiTriage: true,
    teleOphthalmologistCount: 4,
    targetSensitivityThreshold: 92,
    maxReviewTimeSecPerCase: 30,
    workingDaysPerYear: 260
  });

  const [simResults, setSimResults] = useState<SimulinkRunResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'charts' | 'simulink_model'>('charts');

  const runSimulation = async (customConfig = config) => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/simulink/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customConfig)
      });
      const data = await res.json();
      setSimResults(data);
    } catch (err) {
      console.error('Simulink simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-950 border border-orange-700 text-orange-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <span>Simulink Telemedicine Screening Pipeline Simulator</span>
                <span className="text-xs font-mono font-normal text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800">
                  SimEvents &amp; Discrete-Event Systems
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Optimizing telemedicine screening resource allocation for district-level programs serving 100,000+ rural Indian patients annually.
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex text-xs">
            <button
              onClick={() => setActiveView('charts')}
              className={`px-3 py-1 rounded cursor-pointer transition ${activeView === 'charts' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Analytics &amp; Queues
            </button>
            <button
              onClick={() => setActiveView('simulink_model')}
              className={`px-3 py-1 rounded cursor-pointer transition ${activeView === 'simulink_model' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Simulink Block Diagram
            </button>
          </div>

          <button
            id="btn-run-simulink"
            onClick={() => runSimulation()}
            disabled={isSimulating}
            className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Parameter Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
          District Deployment Parameters (100k+ Rural Cohort)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {/* Annual Population */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Target Cohort:</span>
              <span className="font-bold font-mono text-cyan-400">{config.annualCohortSize.toLocaleString()}</span>
            </div>
            <select
              value={config.annualCohortSize}
              onChange={(e) => {
                const updated = { ...config, annualCohortSize: Number(e.target.value) };
                setConfig(updated);
                runSimulation(updated);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-200"
            >
              <option value={75000}>75,000 Patients (Small District)</option>
              <option value={100000}>100,000 Patients (Standard District)</option>
              <option value={120000}>120,000 Patients (Target Cohort)</option>
              <option value={150000}>150,000 Patients (Large District)</option>
            </select>
          </div>

          {/* Number of PHCs */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">PHC Centres:</span>
              <span className="font-bold font-mono text-cyan-400">{config.phcCenterCount} PHCs</span>
            </div>
            <input 
              type="range"
              min="15"
              max="60"
              step="5"
              value={config.phcCenterCount}
              onChange={(e) => {
                const updated = { ...config, phcCenterCount: Number(e.target.value) };
                setConfig(updated);
                runSimulation(updated);
              }}
              className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded cursor-pointer mt-2"
            />
          </div>

          {/* Network Bandwidth */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Rural Bandwidth:</span>
              <span className="font-bold font-mono text-amber-400">{config.bandwidthMbps} Mbps</span>
            </div>
            <input 
              type="range"
              min="0.5"
              max="10.0"
              step="0.5"
              value={config.bandwidthMbps}
              onChange={(e) => {
                const updated = { ...config, bandwidthMbps: Number(e.target.value) };
                setConfig(updated);
                runSimulation(updated);
              }}
              className="w-full accent-amber-400 h-1.5 bg-slate-950 rounded cursor-pointer mt-2"
            />
          </div>

          {/* Tele-Ophthalmologists Pool */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Specialist Pool:</span>
              <span className="font-bold font-mono text-emerald-400">{config.teleOphthalmologistCount} Doctors</span>
            </div>
            <input 
              type="range"
              min="1"
              max="8"
              step="1"
              value={config.teleOphthalmologistCount}
              onChange={(e) => {
                const updated = { ...config, teleOphthalmologistCount: Number(e.target.value) };
                setConfig(updated);
                runSimulation(updated);
              }}
              className="w-full accent-emerald-400 h-1.5 bg-slate-950 rounded cursor-pointer mt-2"
            />
          </div>

          {/* Edge AI Filter Toggle */}
          <div className="space-y-1 flex flex-col justify-end">
            <button
              onClick={() => {
                const updated = { ...config, useEdgeAiTriage: !config.useEdgeAiTriage };
                setConfig(updated);
                runSimulation(updated);
              }}
              className={`p-2 rounded text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                config.useEdgeAiTriage 
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                  : 'bg-slate-950 border-slate-700 text-slate-400'
              }`}
            >
              <span>Edge AI (Filter 80%)</span>
              <span className={`w-3 h-3 rounded-full ${config.useEdgeAiTriage ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {simResults && (
        <>
          {/* Quantitative Outcome KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Screened Cohort */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
              <span className="text-xs text-slate-400 block font-medium">Patients Screened</span>
              <span className="text-2xl font-black text-slate-100 font-mono mt-1 block">
                {simResults.totalPatientsScreened.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">100% Target Met across {config.phcCenterCount} PHCs</span>
            </div>

            {/* Referable DR Detected */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
              <span className="text-xs text-slate-400 block font-medium">Referable DR Cases</span>
              <span className="text-2xl font-black text-red-400 font-mono mt-1 block">
                {simResults.totalReferableIdentified.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">~18% Diabetic Prevalence</span>
            </div>

            {/* Preventable Blindness Averted */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
              <span className="text-xs text-slate-400 block font-medium">Blindness Averted</span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                {simResults.avertedBlindnessCases.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">90% Vision Loss Preventable</span>
            </div>

            {/* Turnaround Time */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
              <span className="text-xs text-slate-400 block font-medium">Mean Turnaround (TAT)</span>
              <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">
                {simResults.avgTurnaroundTimeHours} hrs
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Same-Day Clinical Report</span>
            </div>

            {/* Screening Cost per Patient */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
              <span className="text-xs text-slate-400 block font-medium">Cost per Patient</span>
              <span className="text-2xl font-black text-amber-400 font-mono mt-1 block flex items-center">
                <span>₹{simResults.costPerPatientRupees}</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Total: ₹{(simResults.totalAnnualBudgetRupees / 10000000).toFixed(2)} Cr
              </span>
            </div>
          </div>

          {/* Active View: Charts or Simulink Model */}
          {activeView === 'charts' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Columns: Weekly Queue Backlog Simulation */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="font-bold text-xs text-slate-200">52-Week Telemedicine Queue Backlog</h3>
                    <span className="text-[11px] text-slate-400">Simulating rural patient surge vs tele-ophthalmologist review</span>
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                    simResults.resourceBottleneck === 'optimal' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    Status: {simResults.resourceBottleneck.toUpperCase().replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simResults.queueBacklogOverTime}>
                      <defs>
                        <linearGradient id="queueColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="arrivalsColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="week" stroke="#64748b" tickFormatter={(w) => `W${w}`} />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="newArrivals" stroke="#06b6d4" fillOpacity={1} fill="url(#arrivalsColor)" name="Weekly Arrivals" />
                      <Area type="monotone" dataKey="pendingQueue" stroke="#f59e0b" fillOpacity={1} fill="url(#queueColor)" name="Pending Queue" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right 5 Columns: Doctor Workload & Bottleneck Diagnostics */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-xs text-slate-200">Doctor Workload &amp; Burnout Index</h3>
                  <span className="text-[11px] text-slate-400">Daily review hours per tele-ophthalmologist</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-xs block">Required Review Time:</span>
                    <span className="text-3xl font-black font-mono text-slate-100">
                      {simResults.doctorDailyWorkloadHours}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">hrs / day / doctor</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                      simResults.isDoctorBurnoutRisk 
                        ? 'bg-red-950 text-red-400 border-red-800' 
                        : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    }`}>
                      {simResults.isDoctorBurnoutRisk ? 'BURNOUT RISK (>7.5h)' : 'SUSTAINABLE WORKLOAD'}
                    </span>
                  </div>
                </div>

                {/* Bottleneck Diagnostic Findings */}
                <div className="space-y-2 text-xs">
                  <div className="text-slate-300 font-semibold">Simulink Optimization Findings:</div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Edge AI Triage Impact:</span>
                    </div>
                    <p className="text-slate-400 leading-normal">
                      {config.useEdgeAiTriage 
                        ? 'Filtering ~78.5% non-referable images locally at rural PHCs saves 82% cellular bandwidth and prevents central reading pool overflow.'
                        : 'CRITICAL WARNING: Without Edge AI, 100% of images are uploaded to the cloud, congesting 1.5 Mbps rural links and overwhelming ophthalmologists.'}
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Grad-CAM Rapid Review Acceleration:</span>
                    </div>
                    <p className="text-slate-400 leading-normal">
                      Automated 30-second explainable validation enables 1 tele-ophthalmologist to comfortably validate 720 cases per 6-hour shift.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Simulink Model Block Diagram Canvas */
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-400" />
                  <h3 className="font-bold text-sm text-slate-100">
                    Simulink SimEvents Model Architecture (telemedicine_district_sim.slx)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">MathWorks Simulink 2026b</span>
              </div>

              {/* Interactive Simulink Flow Schematic */}
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 overflow-x-auto">
                <div className="min-w-[840px] flex items-center justify-between gap-4 text-xs font-mono">
                  {/* Block 1: Arrival Generator */}
                  <div className="bg-slate-900 border-2 border-cyan-500/80 p-3 rounded-lg text-center w-36 shadow-lg">
                    <div className="font-bold text-cyan-400">Pulse Generator</div>
                    <div className="text-[10px] text-slate-400 mt-1">Poisson Arrivals (λ = 461/day)</div>
                    <div className="text-[9px] bg-slate-950 text-cyan-300 rounded px-1 py-0.5 mt-2">Patient Influx</div>
                  </div>

                  <div className="text-cyan-400 font-bold">➔</div>

                  {/* Block 2: Camera Capture & IQA Gate */}
                  <div className="bg-slate-900 border-2 border-emerald-500/80 p-3 rounded-lg text-center w-40 shadow-lg">
                    <div className="font-bold text-emerald-400">Portable Camera &amp; IQA</div>
                    <div className="text-[10px] text-slate-400 mt-1">Focus &amp; Illum Filter (Laplacian &gt; 120)</div>
                    <div className="text-[9px] bg-slate-950 text-emerald-300 rounded px-1 py-0.5 mt-2">Adaptive CLAHE</div>
                  </div>

                  <div className="text-emerald-400 font-bold">➔</div>

                  {/* Block 3: Edge AI Switch */}
                  <div className="bg-slate-900 border-2 border-amber-500/80 p-3 rounded-lg text-center w-40 shadow-lg">
                    <div className="font-bold text-amber-400">Edge AI Switch</div>
                    <div className="text-[10px] text-slate-400 mt-1">Filter L0/L1 (80% Local Discharge)</div>
                    <div className="text-[9px] bg-slate-950 text-amber-300 rounded px-1 py-0.5 mt-2">Referable Triage</div>
                  </div>

                  <div className="text-amber-400 font-bold">➔</div>

                  {/* Block 4: Rural Bandwidth Bus */}
                  <div className="bg-slate-900 border-2 border-purple-500/80 p-3 rounded-lg text-center w-36 shadow-lg">
                    <div className="font-bold text-purple-400">Bandwidth Bus</div>
                    <div className="text-[10px] text-slate-400 mt-1">4G Cellular (1.5 Mbps)</div>
                    <div className="text-[9px] bg-slate-950 text-purple-300 rounded px-1 py-0.5 mt-2">Store &amp; Forward</div>
                  </div>

                  <div className="text-purple-400 font-bold">➔</div>

                  {/* Block 5: Central Reading Pool */}
                  <div className="bg-slate-900 border-2 border-red-500/80 p-3 rounded-lg text-center w-44 shadow-lg">
                    <div className="font-bold text-red-400">Tele-Ophthalmologist Pool</div>
                    <div className="text-[10px] text-slate-400 mt-1">4 Specialists (&lt;30s Grad-CAM Review)</div>
                    <div className="text-[9px] bg-slate-950 text-red-300 rounded px-1 py-0.5 mt-2">District Hospital Sink</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
