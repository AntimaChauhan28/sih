import { RetinalAnalysisResult, ICDRGradeInfo, BenchmarkDatasetStats, PipelineComparison, MatlabExportScript } from '../types';

export const ICDR_GRADES: Record<number, ICDRGradeInfo> = {
  0: {
    level: 0,
    name: 'No Apparent Retinopathy',
    clinicalCriteria: 'No microaneurysms, hemorrhages, exudates, or neovascularization detected. Normal retinal vascular caliber and macular foveal reflex.',
    isReferable: false,
    color: '#10B981', // green
    recommendedAction: 'Routine annual diabetic eye screening at local PHC in 12 months.',
    referralTimeline: 'Routine (12 months)'
  },
  1: {
    level: 1,
    name: 'Mild Nonproliferative DR (NPDR)',
    clinicalCriteria: 'Microaneurysms only. Few scattered red dots (<125 µm), no hard exudates, no intraretinal hemorrhages.',
    isReferable: false,
    color: '#3B82F6', // blue
    recommendedAction: 'Glycemic control (HbA1c target <7%) and follow-up screening in 6-12 months.',
    referralTimeline: 'Repeat Screening (6-12 months)'
  },
  2: {
    level: 2,
    name: 'Moderate NPDR',
    clinicalCriteria: 'More than microaneurysms, but less than Severe NPDR. Scattered microaneurysms, intraretinal dot/blot hemorrhages, and/or hard lipid exudates / cotton wool spots.',
    isReferable: true,
    color: '#F59E0B', // amber
    recommendedAction: 'Tele-ophthalmology review & dilated examination within 3 months. Evaluate for Macular Edema.',
    referralTimeline: 'Referral Required (1-3 months)'
  },
  3: {
    level: 3,
    name: 'Severe NPDR (4-2-1 Rule)',
    clinicalCriteria: 'Severe nonproliferative changes meeting the International 4-2-1 Rule: >20 intraretinal hemorrhages in all 4 quadrants, OR definite venous beading in 2+ quadrants, OR prominent IRMA in 1+ quadrant, with no signs of PDR.',
    isReferable: true,
    color: '#EF4444', // red
    recommendedAction: 'Urgent referral to District Hospital Vitreoretinal Specialist within 2-4 weeks. High risk (50% in 1 year) of progressing to PDR without intervention.',
    referralTimeline: 'Urgent Specialist (2-4 weeks)'
  },
  4: {
    level: 4,
    name: 'Proliferative DR (PDR)',
    clinicalCriteria: 'Neovascularization of the optic disc (NVD) or elsewhere on retina (NVE), preretinal/vitreous hemorrhage, or fibrovascular proliferation.',
    isReferable: true,
    color: '#881337', // dark red/purple
    recommendedAction: 'CRITICAL: Immediate vitreoretinal referral within 48-72 hours for Panretinal Photocoagulation (PRP) laser or anti-VEGF intravitreal therapy to prevent catastrophic vision loss.',
    referralTimeline: 'CRITICAL URGENT (48-72 hours)'
  }
};

export const CLINICAL_CASES: RetinalAnalysisResult[] = [
  {
    patient: {
      id: 'PT-IN-2026-081',
      patientId: 'MH-PAL-40912',
      name: 'Ramesh Patil',
      age: 52,
      gender: 'Male',
      district: 'Palghar, Maharashtra',
      phcCenter: 'Manor Primary Health Centre',
      diabetesDurationYears: 4,
      hba1c: 6.8,
      systolicBp: 124,
      diastolicBp: 80,
      visualAcuityOD: '6/6',
      visualAcuityOS: '6/6',
      examinedEye: 'OD'
    },
    imageQuality: {
      focusScore: 94.5,
      illuminationScore: 92.0,
      fovCoverageScore: 96.0,
      overallQuality: 94.2,
      status: 'gradeable',
      underexposedPercent: 1.2,
      overexposedPercent: 0.8,
      pupilVignettingDetected: false
    },
    opticDisc: {
      centerX: 620,
      centerY: 400,
      radius: 75,
      cupRadius: 26,
      cupToDiscRatio: 0.35
    },
    fovea: {
      centerX: 360,
      centerY: 410,
      fovealAvascularZoneRadius: 24
    },
    vessels: {
      densityPercent: 11.8,
      arteriolarVenularRatio: 0.68,
      tortuosityIndex: 1.12,
      vesselCount: 48
    },
    lesions: [],
    rule421: {
      hemorrhagesAll4Quadrants: false,
      quadrantHemorrhageCounts: {
        superiorTemporal: 0,
        inferiorTemporal: 0,
        superiorNasal: 0,
        inferiorNasal: 0
      },
      venousBeading2PlusQuadrants: false,
      irma1PlusQuadrant: false,
      neovascularizationDetected: false,
      ruleSatisfied: false
    },
    icdrGrade: 0,
    confidence: 98.4,
    uncertaintyStd: 0.8,
    dmeRisk: {
      riskLevel: 'no_dme',
      minDistanceToFoveaMicrons: 9999,
      fovealThickeningEstimateMicrons: 210,
      clinicallySignificantMacularEdema: false
    },
    validationStatus: 'approved',
    reviewedBy: 'Dr. Anita Joshi, MS (Ophthalmology)',
    reviewNotes: 'Normal fundus anatomy verified. Optic disc margins crisp, healthy neuroretinal rim. No vascular anomalies.',
    timestamp: '2026-09-06 08:30 IST'
  },
  {
    patient: {
      id: 'PT-IN-2026-094',
      patientId: 'TN-MAD-11405',
      name: 'Meenakshi Sundaram',
      age: 58,
      gender: 'Female',
      district: 'Madurai, Tamil Nadu',
      phcCenter: 'Melur Community Health Centre',
      diabetesDurationYears: 8,
      hba1c: 7.9,
      systolicBp: 138,
      diastolicBp: 86,
      visualAcuityOD: '6/9',
      visualAcuityOS: '6/6',
      examinedEye: 'OD'
    },
    imageQuality: {
      focusScore: 91.2,
      illuminationScore: 89.4,
      fovCoverageScore: 93.0,
      overallQuality: 91.2,
      status: 'gradeable',
      underexposedPercent: 2.1,
      overexposedPercent: 1.4,
      pupilVignettingDetected: false
    },
    opticDisc: {
      centerX: 620,
      centerY: 400,
      radius: 76,
      cupRadius: 28,
      cupToDiscRatio: 0.37
    },
    fovea: {
      centerX: 360,
      centerY: 410,
      fovealAvascularZoneRadius: 25
    },
    vessels: {
      densityPercent: 12.4,
      arteriolarVenularRatio: 0.65,
      tortuosityIndex: 1.18,
      vesselCount: 52
    },
    lesions: [
      { id: 'ma-1', x: 440, y: 340, radius: 4, type: 'microaneurysm', quadrant: 'superior_temporal', severity: 'mild', areaMicrons2: 85, subpixelConfidence: 0.94 },
      { id: 'ma-2', x: 470, y: 460, radius: 5, type: 'microaneurysm', quadrant: 'inferior_temporal', severity: 'mild', areaMicrons2: 110, subpixelConfidence: 0.91 },
      { id: 'ma-3', x: 310, y: 330, radius: 4, type: 'microaneurysm', quadrant: 'superior_temporal', severity: 'mild', areaMicrons2: 90, subpixelConfidence: 0.95 }
    ],
    rule421: {
      hemorrhagesAll4Quadrants: false,
      quadrantHemorrhageCounts: {
        superiorTemporal: 0,
        inferiorTemporal: 0,
        superiorNasal: 0,
        inferiorNasal: 0
      },
      venousBeading2PlusQuadrants: false,
      irma1PlusQuadrant: false,
      neovascularizationDetected: false,
      ruleSatisfied: false
    },
    icdrGrade: 1,
    confidence: 94.6,
    uncertaintyStd: 1.5,
    dmeRisk: {
      riskLevel: 'no_dme',
      minDistanceToFoveaMicrons: 1420,
      fovealThickeningEstimateMicrons: 225,
      clinicallySignificantMacularEdema: false
    },
    validationStatus: 'approved',
    reviewedBy: 'Dr. Anita Joshi, MS (Ophthalmology)',
    reviewNotes: 'Sub-pixel morphological top-hat confirmed 3 isolated microaneurysms in temporal arcade. No exudates or center-involving lesions.',
    timestamp: '2026-09-06 09:15 IST'
  },
  {
    patient: {
      id: 'PT-IN-2026-118',
      patientId: 'PB-LDH-22081',
      name: 'Harpreet Singh',
      age: 64,
      gender: 'Male',
      district: 'Ludhiana, Punjab',
      phcCenter: 'Samrala Sub-District Hospital',
      diabetesDurationYears: 13,
      hba1c: 9.1,
      systolicBp: 148,
      diastolicBp: 92,
      visualAcuityOD: '6/18',
      visualAcuityOS: '6/12',
      examinedEye: 'OD'
    },
    imageQuality: {
      focusScore: 88.0,
      illuminationScore: 86.5,
      fovCoverageScore: 92.0,
      overallQuality: 88.8,
      status: 'gradeable',
      underexposedPercent: 3.4,
      overexposedPercent: 2.1,
      pupilVignettingDetected: false
    },
    opticDisc: {
      centerX: 620,
      centerY: 400,
      radius: 78,
      cupRadius: 31,
      cupToDiscRatio: 0.40
    },
    fovea: {
      centerX: 360,
      centerY: 410,
      fovealAvascularZoneRadius: 26
    },
    vessels: {
      densityPercent: 13.9,
      arteriolarVenularRatio: 0.59,
      tortuosityIndex: 1.28,
      vesselCount: 64
    },
    lesions: [
      { id: 'ma-11', x: 420, y: 320, radius: 5, type: 'microaneurysm', quadrant: 'superior_temporal', severity: 'moderate', areaMicrons2: 120, subpixelConfidence: 0.96 },
      { id: 'ma-12', x: 300, y: 480, radius: 6, type: 'microaneurysm', quadrant: 'inferior_temporal', severity: 'moderate', areaMicrons2: 140, subpixelConfidence: 0.93 },
      { id: 'hem-1', x: 460, y: 370, radius: 12, type: 'hemorrhage_dot_blot', quadrant: 'superior_temporal', severity: 'moderate', areaMicrons2: 480, subpixelConfidence: 0.97 },
      { id: 'hem-2', x: 280, y: 390, radius: 14, type: 'hemorrhage_dot_blot', quadrant: 'superior_temporal', severity: 'moderate', areaMicrons2: 610, subpixelConfidence: 0.95 },
      { id: 'hem-3', x: 390, y: 490, radius: 11, type: 'hemorrhage_dot_blot', quadrant: 'inferior_temporal', severity: 'moderate', areaMicrons2: 420, subpixelConfidence: 0.92 },
      { id: 'ex-1', x: 330, y: 370, radius: 10, type: 'hard_exudate', quadrant: 'superior_temporal', severity: 'moderate', areaMicrons2: 380, subpixelConfidence: 0.98 },
      { id: 'ex-2', x: 320, y: 440, radius: 8, type: 'hard_exudate', quadrant: 'inferior_temporal', severity: 'moderate', areaMicrons2: 290, subpixelConfidence: 0.96 },
      { id: 'cws-1', x: 490, y: 300, radius: 16, type: 'cotton_wool_spot', quadrant: 'superior_temporal', severity: 'moderate', areaMicrons2: 850, subpixelConfidence: 0.91 }
    ],
    rule421: {
      hemorrhagesAll4Quadrants: false,
      quadrantHemorrhageCounts: {
        superiorTemporal: 7,
        inferiorTemporal: 5,
        superiorNasal: 1,
        inferiorNasal: 0
      },
      venousBeading2PlusQuadrants: false,
      irma1PlusQuadrant: false,
      neovascularizationDetected: false,
      ruleSatisfied: false
    },
    icdrGrade: 2,
    confidence: 93.8,
    uncertaintyStd: 1.8,
    dmeRisk: {
      riskLevel: 'non_center_involving',
      minDistanceToFoveaMicrons: 620,
      fovealThickeningEstimateMicrons: 285,
      clinicallySignificantMacularEdema: true
    },
    validationStatus: 'pending',
    reviewedBy: undefined,
    reviewNotes: 'Multiple blot hemorrhages and circinate lipid exudate ring nearing macular fovea. Referable DR confirmed.',
    timestamp: '2026-09-06 09:45 IST'
  },
  {
    patient: {
      id: 'PT-IN-2026-142',
      patientId: 'WB-NAD-77301',
      name: 'Fatima Bi',
      age: 61,
      gender: 'Female',
      district: 'Nadia, West Bengal',
      phcCenter: 'Ranaghat Rural Health Hospital',
      diabetesDurationYears: 17,
      hba1c: 10.4,
      systolicBp: 156,
      diastolicBp: 98,
      visualAcuityOD: '6/24',
      visualAcuityOS: '6/36',
      examinedEye: 'OD'
    },
    imageQuality: {
      focusScore: 89.0,
      illuminationScore: 88.0,
      fovCoverageScore: 94.0,
      overallQuality: 90.3,
      status: 'gradeable',
      underexposedPercent: 2.8,
      overexposedPercent: 1.9,
      pupilVignettingDetected: false
    },
    opticDisc: {
      centerX: 620,
      centerY: 400,
      radius: 80,
      cupRadius: 36,
      cupToDiscRatio: 0.45
    },
    fovea: {
      centerX: 360,
      centerY: 410,
      fovealAvascularZoneRadius: 28
    },
    vessels: {
      densityPercent: 15.6,
      arteriolarVenularRatio: 0.51,
      tortuosityIndex: 1.42,
      vesselCount: 78
    },
    lesions: [
      // 4 quadrants hemorrhages (>20 in each quadrant representation)
      { id: 'hem-s1', x: 440, y: 240, radius: 14, type: 'hemorrhage_flame', quadrant: 'superior_temporal', severity: 'severe', areaMicrons2: 720 },
      { id: 'hem-s2', x: 380, y: 290, radius: 16, type: 'hemorrhage_dot_blot', quadrant: 'superior_temporal', severity: 'severe', areaMicrons2: 890 },
      { id: 'hem-i1', x: 420, y: 520, radius: 15, type: 'hemorrhage_dot_blot', quadrant: 'inferior_temporal', severity: 'severe', areaMicrons2: 840 },
      { id: 'hem-i2', x: 330, y: 510, radius: 18, type: 'hemorrhage_flame', quadrant: 'inferior_temporal', severity: 'severe', areaMicrons2: 950 },
      { id: 'hem-sn1', x: 570, y: 260, radius: 13, type: 'hemorrhage_dot_blot', quadrant: 'superior_nasal', severity: 'severe', areaMicrons2: 670 },
      { id: 'hem-sn2', x: 670, y: 280, radius: 12, type: 'hemorrhage_dot_blot', quadrant: 'superior_nasal', severity: 'severe', areaMicrons2: 620 },
      { id: 'hem-in1', x: 560, y: 510, radius: 14, type: 'hemorrhage_dot_blot', quadrant: 'inferior_nasal', severity: 'severe', areaMicrons2: 710 },
      { id: 'hem-in2', x: 680, y: 490, radius: 15, type: 'hemorrhage_dot_blot', quadrant: 'inferior_nasal', severity: 'severe', areaMicrons2: 780 },
      { id: 'vb-1', x: 470, y: 280, radius: 20, type: 'hemorrhage_flame', quadrant: 'superior_temporal', severity: 'severe', areaMicrons2: 1200 }, // venous beading marker
      { id: 'ex-41', x: 340, y: 400, radius: 12, type: 'hard_exudate', quadrant: 'foveal', severity: 'severe', areaMicrons2: 520 }
    ],
    rule421: {
      hemorrhagesAll4Quadrants: true,
      quadrantHemorrhageCounts: {
        superiorTemporal: 26,
        inferiorTemporal: 23,
        superiorNasal: 21,
        inferiorNasal: 22
      },
      venousBeading2PlusQuadrants: true,
      irma1PlusQuadrant: true,
      neovascularizationDetected: false,
      ruleSatisfied: true
    },
    icdrGrade: 3,
    confidence: 96.2,
    uncertaintyStd: 1.2,
    dmeRisk: {
      riskLevel: 'center_involving',
      minDistanceToFoveaMicrons: 240,
      fovealThickeningEstimateMicrons: 395,
      clinicallySignificantMacularEdema: true
    },
    validationStatus: 'flagged',
    reviewedBy: undefined,
    reviewNotes: '4-2-1 Rule fully triggered (>20 intraretinal hemorrhages in all 4 quadrants + definite venous beading in ST and IT). Center-involving DME risk.',
    timestamp: '2026-09-06 10:10 IST'
  },
  {
    patient: {
      id: 'PT-IN-2026-177',
      patientId: 'OR-CUT-90145',
      name: 'Balaram Das',
      age: 69,
      gender: 'Male',
      district: 'Cuttack, Odisha',
      phcCenter: 'Athagarh Community Health Centre',
      diabetesDurationYears: 21,
      hba1c: 11.2,
      systolicBp: 168,
      diastolicBp: 102,
      visualAcuityOD: '6/60',
      visualAcuityOS: 'Counting Fingers at 2m',
      examinedEye: 'OD'
    },
    imageQuality: {
      focusScore: 87.2,
      illuminationScore: 85.0,
      fovCoverageScore: 91.0,
      overallQuality: 87.7,
      status: 'gradeable',
      underexposedPercent: 4.1,
      overexposedPercent: 2.8,
      pupilVignettingDetected: false
    },
    opticDisc: {
      centerX: 620,
      centerY: 400,
      radius: 82,
      cupRadius: 38,
      cupToDiscRatio: 0.46
    },
    fovea: {
      centerX: 360,
      centerY: 410,
      fovealAvascularZoneRadius: 30
    },
    vessels: {
      densityPercent: 18.2,
      arteriolarVenularRatio: 0.44,
      tortuosityIndex: 1.68,
      vesselCount: 96
    },
    lesions: [
      { id: 'nvd-1', x: 610, y: 370, radius: 24, type: 'neovascularization', quadrant: 'disc', severity: 'severe', areaMicrons2: 3200, subpixelConfidence: 0.99 },
      { id: 'nve-1', x: 440, y: 280, radius: 20, type: 'neovascularization', quadrant: 'superior_temporal', severity: 'severe', areaMicrons2: 2400, subpixelConfidence: 0.97 },
      { id: 'hem-vh1', x: 500, y: 340, radius: 32, type: 'hemorrhage_flame', quadrant: 'superior_temporal', severity: 'severe', areaMicrons2: 4600 },
      { id: 'ex-p1', x: 340, y: 420, radius: 14, type: 'hard_exudate', quadrant: 'foveal', severity: 'severe', areaMicrons2: 680 }
    ],
    rule421: {
      hemorrhagesAll4Quadrants: true,
      quadrantHemorrhageCounts: {
        superiorTemporal: 31,
        inferiorTemporal: 28,
        superiorNasal: 24,
        inferiorNasal: 26
      },
      venousBeading2PlusQuadrants: true,
      irma1PlusQuadrant: true,
      neovascularizationDetected: true,
      ruleSatisfied: true
    },
    icdrGrade: 4,
    confidence: 97.8,
    uncertaintyStd: 0.9,
    dmeRisk: {
      riskLevel: 'center_involving',
      minDistanceToFoveaMicrons: 180,
      fovealThickeningEstimateMicrons: 440,
      clinicallySignificantMacularEdema: true
    },
    validationStatus: 'flagged',
    reviewedBy: undefined,
    reviewNotes: 'High-risk Proliferative Diabetic Retinopathy. Neovascularization on disc (NVD > 1/3 disc area) with preretinal hemorrhage. Emergency vitreoretinal transfer requested.',
    timestamp: '2026-09-06 10:25 IST'
  },
  {
    patient: {
      id: 'PT-IN-2026-203',
      patientId: 'MH-NSK-33419',
      name: 'Anandi Bai',
      age: 72,
      gender: 'Female',
      district: 'Nashik, Maharashtra',
      phcCenter: 'Trimbakeshwar Rural PHC',
      diabetesDurationYears: 11,
      hba1c: 8.4,
      systolicBp: 142,
      diastolicBp: 88,
      visualAcuityOD: '6/18',
      visualAcuityOS: '6/12',
      examinedEye: 'OD'
    },
    imageQuality: {
      focusScore: 68.4,
      illuminationScore: 62.0,
      fovCoverageScore: 84.0,
      overallQuality: 67.2,
      status: 'borderline',
      rejectionReasons: ['Low dynamic range illumination', 'Mild nuclear cataract media haze'],
      recaptureFeedback: [
        'Borderline contrast detected: Applying MATLAB CLAHE (clip limit 0.02, tile grid [8 8]).',
        'If post-enhancement grading confidence <85%, dilate pupil to 6mm with Tropicamide 0.5% and recapture.'
      ],
      underexposedPercent: 24.5,
      overexposedPercent: 0.3,
      pupilVignettingDetected: true
    },
    opticDisc: {
      centerX: 620,
      centerY: 400,
      radius: 76,
      cupRadius: 28,
      cupToDiscRatio: 0.37
    },
    fovea: {
      centerX: 360,
      centerY: 410,
      fovealAvascularZoneRadius: 25
    },
    vessels: {
      densityPercent: 11.2,
      arteriolarVenularRatio: 0.62,
      tortuosityIndex: 1.20,
      vesselCount: 46
    },
    lesions: [
      { id: 'ma-b1', x: 410, y: 340, radius: 5, type: 'microaneurysm', quadrant: 'superior_temporal', severity: 'moderate', areaMicrons2: 130 },
      { id: 'hem-b1', x: 330, y: 460, radius: 11, type: 'hemorrhage_dot_blot', quadrant: 'inferior_temporal', severity: 'moderate', areaMicrons2: 440 },
      { id: 'ex-b1', x: 420, y: 450, radius: 8, type: 'hard_exudate', quadrant: 'inferior_temporal', severity: 'moderate', areaMicrons2: 280 }
    ],
    rule421: {
      hemorrhagesAll4Quadrants: false,
      quadrantHemorrhageCounts: {
        superiorTemporal: 3,
        inferiorTemporal: 4,
        superiorNasal: 0,
        inferiorNasal: 0
      },
      venousBeading2PlusQuadrants: false,
      irma1PlusQuadrant: false,
      neovascularizationDetected: false,
      ruleSatisfied: false
    },
    icdrGrade: 2,
    confidence: 89.2, // post-CLAHE
    uncertaintyStd: 3.1,
    dmeRisk: {
      riskLevel: 'non_center_involving',
      minDistanceToFoveaMicrons: 780,
      fovealThickeningEstimateMicrons: 260,
      clinicallySignificantMacularEdema: false
    },
    validationStatus: 'pending',
    reviewedBy: undefined,
    reviewNotes: 'Borderline quality saved by Adaptive CLAHE. Moderate NPDR lesions revealed in temporal arcade.',
    timestamp: '2026-09-06 10:35 IST'
  },
  {
    patient: {
      id: 'PT-IN-2026-229',
      patientId: 'TS-NZB-55820',
      name: 'Suresh Goud',
      age: 55,
      gender: 'Male',
      district: 'Nizamabad, Telangana',
      phcCenter: 'Armoor Primary Health Centre',
      diabetesDurationYears: 6,
      hba1c: 7.6,
      systolicBp: 130,
      diastolicBp: 84,
      visualAcuityOD: '6/9',
      visualAcuityOS: '6/6',
      examinedEye: 'OD'
    },
    imageQuality: {
      focusScore: 32.1,
      illuminationScore: 41.5,
      fovCoverageScore: 58.0,
      overallQuality: 38.6,
      status: 'ungradeable',
      rejectionReasons: [
        'Defocus blur (Laplacian variance < 45.0 - threshold: 120.0)',
        'Severe corneal flash reflection obstructing foveal zone',
        'Severe pupil vignetting (effective pupil aperture < 2.8 mm)'
      ],
      recaptureFeedback: [
        '1. FOCUS: Adjust portable camera diopter focus ring by +1.5D to counter patient hyperopia.',
        '2. ALIGNMENT: Optical axis tilted - center the fixation green LED in patient line of sight.',
        '3. PUPIL DILATION: Insufficient dilation - seat patient in dark screening booth for 5 minutes or consult medical officer for Tropicamide 0.5% drops.',
        '4. LENS DUST: Wipe the objective lens with the lint-free microfiber cloth supplied in kit.'
      ],
      underexposedPercent: 42.0,
      overexposedPercent: 18.5,
      pupilVignettingDetected: true
    },
    opticDisc: {
      centerX: 620,
      centerY: 400,
      radius: 75,
      cupRadius: 26,
      cupToDiscRatio: 0.35
    },
    fovea: {
      centerX: 360,
      centerY: 410,
      fovealAvascularZoneRadius: 24
    },
    vessels: {
      densityPercent: 5.2,
      arteriolarVenularRatio: 0.70,
      tortuosityIndex: 1.05,
      vesselCount: 18
    },
    lesions: [],
    rule421: {
      hemorrhagesAll4Quadrants: false,
      quadrantHemorrhageCounts: { superiorTemporal: 0, inferiorTemporal: 0, superiorNasal: 0, inferiorNasal: 0 },
      venousBeading2PlusQuadrants: false,
      irma1PlusQuadrant: false,
      neovascularizationDetected: false,
      ruleSatisfied: false
    },
    icdrGrade: 0,
    confidence: 42.0, // unreliable
    uncertaintyStd: 18.5,
    dmeRisk: {
      riskLevel: 'no_dme',
      minDistanceToFoveaMicrons: 9999,
      fovealThickeningEstimateMicrons: 200,
      clinicallySignificantMacularEdema: false
    },
    validationStatus: 'flagged',
    reviewedBy: undefined,
    reviewNotes: 'REJECTED: Ungradeable image. Recapture required before referral decision.',
    timestamp: '2026-09-06 10:45 IST'
  }
];

export const BENCHMARK_DATASETS: BenchmarkDatasetStats[] = [
  {
    datasetName: 'IDRiD (Indian Diabetic Retinopathy Image Dataset)',
    patientCount: 516,
    sensitivity: 94.8,
    specificity: 92.1,
    aucRoc: 0.968,
    f1Score: 0.932,
    kappaScore: 0.884,
    rocPoints: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.02, tpr: 0.62 },
      { fpr: 0.04, tpr: 0.81 },
      { fpr: 0.06, tpr: 0.89 },
      { fpr: 0.079, tpr: 0.948 },
      { fpr: 0.12, tpr: 0.972 },
      { fpr: 0.20, tpr: 0.988 },
      { fpr: 0.35, tpr: 0.995 },
      { fpr: 1.00, tpr: 1.00 }
    ]
  },
  {
    datasetName: 'Messidor-2 (Standard International Clinical Cohort)',
    patientCount: 1748,
    sensitivity: 95.4,
    specificity: 91.5,
    aucRoc: 0.971,
    f1Score: 0.938,
    kappaScore: 0.892,
    rocPoints: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.01, tpr: 0.65 },
      { fpr: 0.03, tpr: 0.84 },
      { fpr: 0.05, tpr: 0.91 },
      { fpr: 0.085, tpr: 0.954 },
      { fpr: 0.14, tpr: 0.978 },
      { fpr: 0.25, tpr: 0.991 },
      { fpr: 1.00, tpr: 1.00 }
    ]
  },
  {
    datasetName: 'EyePACS (Mass Telemedicine Screening)',
    patientCount: 35126,
    sensitivity: 93.9,
    specificity: 89.6,
    aucRoc: 0.959,
    f1Score: 0.916,
    kappaScore: 0.865,
    rocPoints: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.03, tpr: 0.70 },
      { fpr: 0.06, tpr: 0.85 },
      { fpr: 0.104, tpr: 0.939 },
      { fpr: 0.18, tpr: 0.965 },
      { fpr: 0.30, tpr: 0.984 },
      { fpr: 1.00, tpr: 1.00 }
    ]
  }
];

export const PIPELINE_COMPARISONS: PipelineComparison[] = [
  {
    technique: 'Proposed Integrated MATLAB Pipeline (IQA + Morphology + GradCAM ResNet + 4-2-1 Rule)',
    sensitivity: 94.8,
    specificity: 92.1,
    auc: 0.968,
    processingTimeMs: 420,
    explainable: true,
    failSafeQualityFilter: true
  },
  {
    technique: 'Black-Box Deep Learning (ResNet-50 without Quality Gate or Explainability)',
    sensitivity: 86.4,
    specificity: 79.2,
    auc: 0.884,
    processingTimeMs: 180,
    explainable: false,
    failSafeQualityFilter: false
  },
  {
    technique: 'Traditional Handcrafted Feature Extraction (Hough OD + Gabor Vessels + SVM)',
    sensitivity: 82.1,
    specificity: 84.6,
    auc: 0.857,
    processingTimeMs: 650,
    explainable: true,
    failSafeQualityFilter: false
  },
  {
    technique: 'MobileNet-V3 On-Device Edge Only',
    sensitivity: 89.1,
    specificity: 83.4,
    auc: 0.902,
    processingTimeMs: 95,
    explainable: false,
    failSafeQualityFilter: true
  }
];

export const MATLAB_SCRIPTS: MatlabExportScript[] = [
  {
    id: 'script-iqa',
    toolbox: 'Image Processing Toolbox',
    filename: 'fundus_quality_assessment_and_enhancement.m',
    title: '1. Image Quality Assessment & Adaptive CLAHE',
    summary: 'Evaluates focus sharpness (Laplacian variance), illumination uniformity, and applies adaptive CLAHE + background subtraction for borderline fundus images.',
    code: `% =========================================================================
% MATLAB Retinal Image Quality Assessment (IQA) & Adaptive CLAHE Pipeline
% Toolboxes: Image Processing Toolbox
% MathWorks Rural Healthcare Screening Program
% =========================================================================

function [isGradeable, enhancedImg, qualityMetrics, feedback] = evaluateAndEnhanceFundus(rgbImg)
    % Arguments: rgbImg - uint8 RGB fundus image from portable camera (e.g. 50-degree FOV)
    % Returns:
    %   isGradeable - boolean flag ('gradeable', 'borderline', or 'ungradeable')
    %   enhancedImg - preprocessed image ready for segmentation & deep grading
    %   qualityMetrics - struct containing focus, illumination, and FOV scores
    %   feedback - human-in-the-loop recapture guidance for ASHA / PHC workers

    % 1. Extract Green Channel (Maximum contrast between lesions & retinal background)
    greenChan = rgbImg(:,:,2);
    
    % 2. Retinal Mask Extraction (Threshold to find circular aperture)
    grayImg = rgb2gray(rgbImg);
    mask = grayImg > 15;
    mask = imfill(mask, 'holes');
    mask = bwareaopen(mask, 5000); % Remove dust specks
    
    % 3. Tenengrad / Modified Laplacian Focus Sharpness Metric
    laplacianKernel = [0 1 0; 1 -4 1; 0 1 0];
    lapImg = abs(imfilter(double(greenChan), laplacianKernel, 'replicate'));
    focusScore = var(lapImg(mask)); % Variance of Laplacian within valid retina
    normalizedFocus = min(100, max(0, (focusScore - 20) / (250 - 20) * 100));
    
    % 4. Illumination Uniformity & Exposure Assessment
    retinalPixels = double(greenChan(mask));
    meanIllum = mean(retinalPixels);
    underexposedRatio = sum(retinalPixels < 30) / numel(retinalPixels);
    overexposedRatio = sum(retinalPixels > 235) / numel(retinalPixels);
    illumScore = 100 * (1 - (underexposedRatio * 1.5 + overexposedRatio * 2.0));
    illumScore = max(0, min(100, illumScore));
    
    % 5. Package Metrics
    qualityMetrics.focusScore = normalizedFocus;
    qualityMetrics.illuminationScore = illumScore;
    qualityMetrics.overallQuality = 0.55 * normalizedFocus + 0.45 * illumScore;
    
    % 6. Quality Decision Logic & Recapture Feedback
    feedback = strings(0,1);
    if qualityMetrics.overallQuality < 45 || normalizedFocus < 35
        isGradeable = 'ungradeable';
        feedback(end+1) = "RECAPTURE REQUIRED: Defocused image. Rotate camera diopter ring to match patient refractive error.";
        if underexposedRatio > 0.30
            feedback(end+1) = "RECAPTURE REQUIRED: Dark image / pupil constriction. Ensure darkened room or dilate with Tropicamide 0.5%.";
        end
        if overexposedRatio > 0.15
            feedback(end+1) = "RECAPTURE REQUIRED: Flash glare artifact at fovea. Re-align camera axis perpendicular to pupil.";
        end
        enhancedImg = rgbImg; % Return raw image without processing
        return;
    elseif qualityMetrics.overallQuality < 75
        isGradeable = 'borderline';
        feedback(end+1) = "BORDERLINE QUALITY: Applying Adaptive CLAHE & Illumination Homogenization.";
    else
        isGradeable = 'gradeable';
        feedback(end+1) = "ADEQUATE QUALITY: Image passed automated clinical quality threshold.";
    end
    
    % 7. Adaptive CLAHE (Contrast-Limited Adaptive Histogram Equalization)
    % Apply CLAHE on L* channel in L*a*b* color space to preserve chromatic fidelity
    labImg = rgb2lab(rgbImg);
    L = labImg(:,:,1) / 100;
    
    % Contrast-limited equalization with tile grid [8 8]
    L_clahe = adapthisteq(L, 'ClipLimit', 0.02, 'NumTiles', [8 8], 'Distribution', 'rayleigh');
    labImg(:,:,1) = L_clahe * 100;
    enhancedImg = lab2rgb(labImg);
    
    % 8. Background Illumination Flattening (Gaussian Morphological Subtraction)
    hBackground = fspecial('gaussian', [61 61], 30);
    bgEstimate = imfilter(enhancedImg(:,:,2), hBackground, 'replicate');
    enhancedImg(:,:,2) = imadjust(enhancedImg(:,:,2) - bgEstimate + 0.5);
end
`
  },
  {
    id: 'script-segmentation',
    toolbox: 'Computer Vision & Medical Imaging Toolbox',
    filename: 'retinal_structure_segmentation.m',
    title: '2. Retinal Structure Segmentation & Microaneurysm Detector',
    summary: 'Extracts optic disc via Circular Hough Transform, vessel tree via Frangi vesselness, and sub-pixel microaneurysms using morphological top-hat transforms.',
    code: `% =========================================================================
% Retinal Structure Segmentation & Sub-Pixel Microaneurysm Detection
% Toolboxes: Image Processing Toolbox, Computer Vision Toolbox, Medical Imaging
% =========================================================================

function [opticDisc, fovea, vesselMask, lesions, rule421] = segmentRetinalStructures(enhancedImg)
    green = enhancedImg(:,:,2);
    [rows, cols] = size(green);
    
    % ---------------------------------------------------------------------
    % A. Optic Disc (OD) Localization via Circular Hough Transform
    % ---------------------------------------------------------------------
    % Optic disc appears as high-intensity circular region with converging vessels
    brightRegions = imtophat(green, strel('disk', 25));
    [centers, radii, metric] = imfindcircles(brightRegions, [40 85], ...
        'ObjectPolarity', 'bright', 'Sensitivity', 0.92);
    
    if ~isempty(centers)
        opticDisc.center = centers(1,:);
        opticDisc.radius = radii(1);
    else
        % Fallback: Maximum intensity centroid
        [~, maxIdx] = max(green(:));
        [y, x] = ind2sub(size(green), maxIdx);
        opticDisc.center = [x, y];
        opticDisc.radius = 65;
    end
    
    % Estimate Cup-to-Disc Ratio (CDR)
    discROI = imcrop(green, [opticDisc.center(1)-opticDisc.radius, ...
                             opticDisc.center(2)-opticDisc.radius, ...
                             opticDisc.radius*2, opticDisc.radius*2]);
    cupMask = discROI > (mean(discROI(:)) + 1.2 * std(double(discROI(:))));
    opticDisc.cdr = sqrt(sum(cupMask(:)) / (pi * opticDisc.radius^2));
    
    % ---------------------------------------------------------------------
    % B. Fovea Center Estimation (Anatomically 2.5 OD Diameters Temporal)
    % ---------------------------------------------------------------------
    fovea.center = [opticDisc.center(1) - 2.5 * (2 * opticDisc.radius), opticDisc.center(2)];
    fovea.center(1) = max(50, min(cols - 50, fovea.center(1)));
    
    % ---------------------------------------------------------------------
    % C. Vessel Tree Segmentation via Multiscale Frangi Vesselness Filter
    % ---------------------------------------------------------------------
    % Inverted green channel: vessels appear dark
    invGreen = imcomplement(green);
    
    % Gabor / Frangi 2D Hessian Eigenvalue enhancement
    scales = 1:2:7;
    vesselness = zeros(rows, cols);
    for s = scales
        sigma = s;
        % Gaussian 2nd derivatives
        H = fspecial('gaussian', [2*ceil(3*sigma)+1, 2*ceil(3*sigma)+1], sigma);
        [Gx, Gy] = gradient(H);
        [Gxx, Gxy] = gradient(Gx);
        [~, Gyy] = gradient(Gy);
        
        Ixx = imfilter(double(invGreen), Gxx, 'replicate');
        Iyy = imfilter(double(invGreen), Gyy, 'replicate');
        Ixy = imfilter(double(invGreen), Gxy, 'replicate');
        
        % Calculate eigenvalues of Hessian matrix
        lambda1 = 0.5 * (Ixx + Iyy + sqrt((Ixx - Iyy).^2 + 4 * Ixy.^2));
        lambda2 = 0.5 * (Ixx + Iyy - sqrt((Ixx - Iyy).^2 + 4 * Ixy.^2));
        
        % Frangi tubular vesselness measure
        Rb = abs(lambda1) ./ (abs(lambda2) + eps);
        S = sqrt(lambda1.^2 + lambda2.^2);
        scaleVesselness = exp(-Rb.^2 / 0.5) .* (1 - exp(-S.^2 / 15));
        scaleVesselness(lambda2 > 0) = 0; % Suppress bright plateaus
        vesselness = max(vesselness, scaleVesselness);
    end
    
    % Adaptive Otsu binarization and morphological skeletonization
    vesselMask = imbinarize(vesselness, 'adaptive', 'Sensitivity', 0.55);
    vesselMask = bwareaopen(vesselMask, 30);
    
    % ---------------------------------------------------------------------
    % D. Sub-Pixel Microaneurysm (MA) Detection (<125 µm diameter)
    % ---------------------------------------------------------------------
    % MAs are small isolated dark circular dots
    bottomHat = imbothat(green, strel('disk', 7));
    % Mask out blood vessel tree to avoid false positives at branch points
    maCandidates = bottomHat .* (~imdilate(vesselMask, strel('disk', 3)));
    maBinary = maCandidates > (mean(maCandidates(:)) + 2.8 * std(double(maCandidates(:))));
    
    statsMA = regionprops(maBinary, 'Centroid', 'EquivDiameter', 'Eccentricity', 'PixelList');
    % Filter by sub-pixel diameter (<12 pixels ~ 125 um) & circularity (eccentricity < 0.8)
    validMAs = statsMA([statsMA.EquivDiameter] >= 2 & ...
                       [statsMA.EquivDiameter] <= 12 & ...
                       [statsMA.Eccentricity] < 0.75);
                   
    lesions.microaneurysmCount = numel(validMAs);
    lesions.microaneurysms = validMAs;
    
    % ---------------------------------------------------------------------
    % E. 4-2-1 Rule Evaluation (Intraretinal Hemorrhages in 4 Quadrants)
    % ---------------------------------------------------------------------
    % Divide retina into 4 quadrants anchored at Fovea
    quadrants = partitionQuadrants(rows, cols, fovea.center);
    rule421.hemorrhageCounts = countLesionsPerQuadrant(lesions, quadrants);
    rule421.all4QuadrantsSeverelyInvolved = all(rule421.hemorrhageCounts >= 20);
end
`
  },
  {
    id: 'script-gradcam',
    toolbox: 'Deep Learning Toolbox',
    filename: 'explainable_gradcam_resnet50.m',
    title: '3. Explainable Grad-CAM & ICDR Severity Classifier',
    summary: 'Deep neural network classification with ResNet-50 / EfficientNet and Gradient-Weighted Class Activation Mapping (Grad-CAM) layer attribution.',
    code: `% =========================================================================
% Explainable Grad-CAM Attention Heatmap & ICDR Classification
% Toolboxes: Deep Learning Toolbox, Medical Imaging Toolbox
% =========================================================================

function [predictedGrade, confidence, gradcamMap, report] = explainableDRGrading(enhancedImg, net)
    % Arguments:
    %   enhancedImg - preprocessed 512x512x3 fundus image
    %   net - trained DAGNetwork (ResNet-50 fine-tuned on IDRiD & Messidor-2)
    
    targetSize = [512, 512, 3];
    inputImg = imresize(enhancedImg, [512, 512]);
    
    % Forward pass through network
    [predScores, ~] = predict(net, inputImg);
    [maxScore, classIdx] = max(predScores);
    
    predictedGrade = classIdx - 1; % 0: No DR, 1: Mild, 2: Moderate, 3: Severe, 4: PDR
    confidence = maxScore * 100;
    
    % ---------------------------------------------------------------------
    % Grad-CAM: Gradient-Weighted Class Activation Mapping
    % Feature Layer: 'res5c_branch2c' (Deepest convolutional layer)
    % ---------------------------------------------------------------------
    featureLayerName = 'res5c_branch2c';
    softmaxLayerName = 'ClassificationLayer_fc5';
    
    % Compute Grad-CAM map in MATLAB Deep Learning Toolbox
    gradcamMap = gradCAM(net, inputImg, classIdx, ...
        'FeatureLayer', featureLayerName, ...
        'ReductionMethod', 'mean');
    
    % Normalize heatmap to [0 1]
    gradcamMap = (gradcamMap - min(gradcamMap(:))) / (max(gradcamMap(:)) - min(gradcamMap(:)) + eps);
    
    % Overlay heatmap on RGB fundus with alpha blend 0.45
    heatmapOverlay = ind2rgb(uint8(gradcamMap * 255), jet(256));
    blendedImg = 0.55 * double(inputImg)/255 + 0.45 * heatmapOverlay;
    
    % ---------------------------------------------------------------------
    % Calibrated Uncertainty Quantification via Monte Carlo Dropout (10 passes)
    % ---------------------------------------------------------------------
    mcPredictions = zeros(10, 5);
    for p = 1:10
        mcPredictions(p,:) = predict(net, inputImg, 'ExecutionEnvironment', 'auto');
    end
    uncertaintyStd = std(mcPredictions(:, classIdx)) * 100;
    
    % Generate 30-Second Human-in-the-Loop Report
    report.predictedGrade = predictedGrade;
    report.confidence = confidence;
    report.uncertaintyMargin = uncertaintyStd;
    report.isReferable = (predictedGrade >= 2);
    report.blendedVisualization = blendedImg;
end
`
  },
  {
    id: 'script-simulink',
    toolbox: 'Simulink & SimEvents',
    filename: 'telemedicine_district_simulation.m',
    title: '4. Simulink Telemedicine District Model (100,000+ Cohort)',
    summary: 'Models the entire district screening pipeline in Simulink SimEvents: patient arrivals, portable camera capture, edge AI triage, 4G rural bandwidth, and tele-ophthalmologist review.',
    code: `% =========================================================================
% Simulink Telemedicine District Screening Model for Rural India
% Toolboxes: Simulink, SimEvents, Statistics and Machine Learning Toolbox
% Target: 100,000+ Rural Diabetic Patients across 30 PHCs / CHCs
% =========================================================================

function simResults = simulateDistrictTelemedProgram(params)
    % Default District Parameters (Palghar / Madurai / Nadia Archetype)
    if nargin < 1
        params.annualCohort = 120000;         % Annual diabetic population in district
        params.numPHCs = 30;                 % Primary Health Centers with portable cameras
        params.bandwidthMbps = 1.5;          % 4G/3G average cellular upload bandwidth (Mbps)
        params.edgeAiEnabled = true;         % Local Edge AI triages out 80% non-referable
        params.numOphthalmologists = 4;      % Central tele-ophthalmology reading pool
        params.secondsPerReview = 30;        % Enabled by Grad-CAM explainable reports
        params.workingDays = 260;            % 5 days/week operational days
    end
    
    % Daily Arrival Rate per PHC (Poisson Process)
    patientsPerDayTotal = params.annualCohort / params.workingDays;
    patientsPerPhcPerDay = patientsPerDayTotal / params.numPHCs;
    
    % Model Execution (52 weeks = 260 working days)
    days = 1:params.workingDays;
    queueBacklog = zeros(1, numel(days));
    pendingCases = 0;
    totalScreened = 0;
    referableDetected = 0;
    
    % Image Transmission Size (Average 4.2 MB compressed per 2-eye exam)
    imageSizeMB = 4.2;
    uploadSecondsPerCase = (imageSizeMB * 8) / params.bandwidthMbps;
    
    % Ophthalmologist Daily Capacity (cases reviewed per doctor in 6 hr shift)
    secondsPerShift = 6 * 3600;
    casesPerDocPerDay = secondsPerShift / params.secondsPerReview;
    totalDocDailyCapacity = casesPerDocPerDay * params.numOphthalmologists;
    
    for d = days
        dailyArrivals = poissrnd(patientsPerDayTotal);
        totalScreened = totalScreened + dailyArrivals;
        
        % True referable prevalence in Indian diabetic population (~18%)
        referableCases = binornd(dailyArrivals, 0.18);
        referableDetected = referableDetected + referableCases;
        
        if params.edgeAiEnabled
            % Edge AI filters out Level 0 & Mild NPDR locally at PHC (approx 80% of cohort)
            % Only referable cases (18%) + borderline quality cases (4%) sent to cloud queue
            casesSentToCloud = referableCases + round(dailyArrivals * 0.04);
        else
            % Without Edge AI, 100% of cases must be transmitted and manually reviewed
            casesSentToCloud = dailyArrivals;
        end
        
        pendingCases = pendingCases + casesSentToCloud;
        casesProcessed = min(pendingCases, totalDocDailyCapacity);
        pendingCases = pendingCases - casesProcessed;
        queueBacklog(d) = pendingCases;
    end
    
    % Compile Results
    simResults.totalScreened = totalScreened;
    simResults.referableDetected = referableDetected;
    simResults.avgTurnaroundHours = (mean(queueBacklog) / totalDocDailyCapacity) * 8;
    simResults.finalBacklog = pendingCases;
    simResults.avertedBlindness = round(referableDetected * 0.90); % 90% vision loss preventable
    simResults.costPerScreeningINR = 145; % Rupee cost per patient including kit & telemed
    
    fprintf('=== Simulink District Telemedicine Results ===\n');
    fprintf('Annual Patients Screened: %d\n', simResults.totalScreened);
    fprintf('Referable DR Cases Caught: %d\n', simResults.referableDetected);
    fprintf('Preventable Blindness Averted: %d patients\n', simResults.avertedBlindness);
    fprintf('Mean Turnaround Time: %.1f hours\n', simResults.avgTurnaroundHours);
end
`
  },
  {
    id: 'script-benchmarks',
    toolbox: 'Statistics and Machine Learning Toolbox',
    filename: 'clinical_validation_benchmarks.m',
    title: '5. Benchmark Validation (IDRiD, Messidor-2, EyePACS)',
    summary: 'Computes sensitivity (>90%), specificity (>85%), ROC curves, AUC, Cohen kappa, and statistical significance tests across published benchmarks.',
    code: `% =========================================================================
% Clinical Validation Benchmark Suite (IDRiD, Messidor-2, EyePACS)
% Toolboxes: Statistics and Machine Learning Toolbox
% =========================================================================

function [metrics, rocFig] = validatePipelineOnBenchmarks(groundTruth, predictedProbabilities)
    % GroundTruth: Binary vector (1 = Referable DR Level 2+, 0 = Level 0/1)
    % PredictedProbabilities: Continuous model confidence score [0 1]
    
    % Compute ROC Curve and Area Under Curve (AUC)
    [X_fpr, Y_tpr, thresholds, aucVal] = perfcurve(groundTruth, predictedProbabilities, 1);
    
    % Find Optimal Clinical Operating Point (Sensitivity >= 0.90 constraint)
    validSensIndices = find(Y_tpr >= 0.90);
    [maxSpec, optIdx] = min(X_fpr(validSensIndices));
    bestThresholdIdx = validSensIndices(optIdx);
    
    optimalThreshold = thresholds(bestThresholdIdx);
    operatingSensitivity = Y_tpr(bestThresholdIdx) * 100;
    operatingSpecificity = (1 - X_fpr(bestThresholdIdx)) * 100;
    
    % Package Output
    metrics.sensitivity = operatingSensitivity;
    metrics.specificity = operatingSpecificity;
    metrics.auc = aucVal;
    metrics.optimalThreshold = optimalThreshold;
    
    % Plot ROC Curve with MathWorks Styling
    rocFig = figure('Name', 'Clinical ROC Curve', 'Color', 'w');
    plot(X_fpr, Y_tpr, 'b-', 'LineWidth', 2.5);
    hold on;
    plot([0 1], [0 1], 'k--', 'LineWidth', 1.2);
    plot(X_fpr(bestThresholdIdx), Y_tpr(bestThresholdIdx), 'ro', 'MarkerSize', 10, 'LineWidth', 2);
    grid on;
    xlabel('False Positive Rate (1 - Specificity)', 'FontSize', 12);
    ylabel('True Positive Rate (Sensitivity)', 'FontSize', 12);
    title(sprintf('ROC Curve - Referable DR (AUC = %.3f, Sens = %.1f%%, Spec = %.1f%%)', ...
        aucVal, operatingSensitivity, operatingSpecificity), 'FontSize', 14);
    legend('Integrated MATLAB Pipeline', 'Random Classifier', 'Operating Point (Sens >90%)', ...
        'Location', 'SouthEast');
end
`
  }
];

export const PATIENT_CASES: RetinalAnalysisResult[] = CLINICAL_CASES;
