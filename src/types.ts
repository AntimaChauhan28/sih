// TypeScript interfaces for the MATLAB Retinal Image Analysis & DR Screening Pipeline

export type ICDRLevel = 0 | 1 | 2 | 3 | 4;

export interface ICDRGradeInfo {
  level: ICDRLevel;
  name: string;
  clinicalCriteria: string;
  isReferable: boolean;
  color: string;
  recommendedAction: string;
  referralTimeline: string;
}

export interface PatientProfile {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  district: string;
  phcCenter: string;
  diabetesDurationYears: number;
  hba1c: number;
  systolicBp: number;
  diastolicBp: number;
  visualAcuityOD: string;
  visualAcuityOS: string;
  examinedEye: 'OD' | 'OS';
  screeningTimestamp?: string;
  notes?: string;
}

export type QualityStatus = 'gradeable' | 'borderline' | 'ungradeable';

export interface ImageQualityMetrics {
  focusScore: number; // 0 - 100 (Tenengrad / Laplacian variance)
  illuminationScore: number; // 0 - 100
  fovCoverageScore: number; // 0 - 100 (45-degree coverage & centration)
  overallQuality: number; // 0 - 100
  status: QualityStatus;
  rejectionReasons?: string[];
  recaptureFeedback?: string[];
  underexposedPercent: number;
  overexposedPercent: number;
  pupilVignettingDetected: boolean;
}

export interface OpticDiscStructure {
  centerX: number;
  centerY: number;
  radius: number;
  cupRadius: number;
  cupToDiscRatio: number; // CDR (e.g. 0.35)
}

export interface FoveaStructure {
  centerX: number;
  centerY: number;
  fovealAvascularZoneRadius: number;
}

export interface VesselMetrics {
  densityPercent: number; // e.g. 11.4%
  arteriolarVenularRatio: number; // AVR (normal ~ 0.67)
  tortuosityIndex: number; // Curvature / chord ratio
  vesselCount: number;
}

export interface LesionItem {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'microaneurysm' | 'hemorrhage_dot_blot' | 'hemorrhage_flame' | 'hard_exudate' | 'cotton_wool_spot' | 'neovascularization';
  quadrant: 'superior_temporal' | 'inferior_temporal' | 'superior_nasal' | 'inferior_nasal' | 'foveal' | 'disc';
  severity: 'mild' | 'moderate' | 'severe';
  areaMicrons2: number;
  subpixelConfidence?: number;
}

export interface Rule421Evidence {
  hemorrhagesAll4Quadrants: boolean; // >20 intraretinal hemorrhages in each of 4 quadrants
  quadrantHemorrhageCounts: {
    superiorTemporal: number;
    inferiorTemporal: number;
    superiorNasal: number;
    inferiorNasal: number;
  };
  venousBeading2PlusQuadrants: boolean;
  irma1PlusQuadrant: boolean;
  neovascularizationDetected: boolean;
  ruleSatisfied: boolean;
}

export interface DMERiskAssessment {
  riskLevel: 'no_dme' | 'non_center_involving' | 'center_involving';
  minDistanceToFoveaMicrons: number;
  fovealThickeningEstimateMicrons: number;
  clinicallySignificantMacularEdema: boolean;
}

export interface RetinalAnalysisResult {
  id?: string;
  patient: PatientProfile;
  imageQuality: ImageQualityMetrics;
  opticDisc: OpticDiscStructure;
  fovea: FoveaStructure;
  vessels: VesselMetrics;
  lesions: LesionItem[];
  rule421: Rule421Evidence;
  icdrGrade: ICDRLevel;
  confidence: number; // e.g. 94.2%
  uncertaintyStd: number; // calibrated via Monte Carlo dropout
  dmeRisk: DMERiskAssessment;
  validationStatus: 'pending' | 'approved' | 'overruled' | 'flagged';
  reviewedBy?: string;
  reviewNotes?: string;
  overruledGrade?: ICDRLevel;
  timestamp: string;
  gradCamHeatmapUrl?: string;
}

export interface SimulinkConfig {
  annualCohortSize: number; // e.g. 100,000 to 150,000 patients
  phcCenterCount: number; // e.g. 25 to 50 PHCs
  cameraOperatorsPerPhc: number; // e.g. 1 or 2
  bandwidthMbps: number; // e.g. 0.5 to 10 Mbps (rural cellular)
  useEdgeAiTriage: boolean; // Triage 80% non-referable locally
  teleOphthalmologistCount: number; // e.g. 2 to 8 specialists
  targetSensitivityThreshold: number; // e.g. 92%
  maxReviewTimeSecPerCase: number; // e.g. 30 sec with Explainability
  workingDaysPerYear: number; // e.g. 260
}

export interface SimulinkRunResult {
  totalPatientsScreened: number;
  totalReferableIdentified: number;
  falseNegativesAvoided: number;
  avertedBlindnessCases: number;
  avgTurnaroundTimeHours: number;
  edgeAiProcessedPercent: number;
  doctorDailyWorkloadHours: number;
  isDoctorBurnoutRisk: boolean;
  costPerPatientRupees: number;
  totalAnnualBudgetRupees: number;
  bandwidthThrottledDays: number;
  queueBacklogOverTime: Array<{
    week: number;
    newArrivals: number;
    processedCases: number;
    pendingQueue: number;
    avgWaitHours: number;
  }>;
  resourceBottleneck: 'network_bandwidth' | 'ophthalmologist_capacity' | 'phc_camera_throughput' | 'optimal';
}

export interface BenchmarkDatasetStats {
  datasetName: string;
  patientCount: number;
  sensitivity: number;
  specificity: number;
  aucRoc: number;
  f1Score: number;
  kappaScore: number;
  rocPoints: Array<{ fpr: number; tpr: number }>;
}

export interface PipelineComparison {
  technique: string;
  sensitivity: number;
  specificity: number;
  auc: number;
  processingTimeMs: number;
  explainable: boolean;
  failSafeQualityFilter: boolean;
}

export interface MatlabExportScript {
  id: string;
  toolbox: string;
  filename: string;
  title: string;
  summary: string;
  code: string;
}
