// Client-side MATLAB & Medical Image Processing Algorithm Implementations
import { RetinalAnalysisResult } from '../types';

export interface ImageEnhancementOptions {
  claheClipLimit: number; // 0.01 - 0.05 (default 0.02)
  tileGridSize: number; // 4, 8, 16
  illuminationNormalization: boolean;
  denoiseStrength: number; // 0 - 5
  colorChannel: 'rgb' | 'green' | 'red' | 'blue';
  brightness: number; // -50 to +50
  contrast: number; // 0.5 to 2.0
}

/**
 * Draws the anatomical fundus on a canvas using realistic biomedical features
 */
export function renderFundusToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  caseData: RetinalAnalysisResult,
  options: ImageEnhancementOptions,
  layers: {
    showRaw: boolean;
    showEnhanced: boolean;
    showOpticDisc: boolean;
    showFovea: boolean;
    showVessels: boolean;
    showLesions: boolean;
    showGradCam: boolean;
    showQuadrants: boolean;
    gradCamOpacity: number;
    gradCamColormap: 'jet' | 'turbo' | 'inferno' | 'viridis';
  }
) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  const scaleX = width / 800;
  const scaleY = height / 800;
  const scale = Math.min(scaleX, scaleY);

  const isUngradeable = caseData.imageQuality.status === 'ungradeable';
  const isBorderline = caseData.imageQuality.status === 'borderline';

  // 1. Draw Fundus Background (circular aperture with aperture vignetting)
  const centerX = width / 2;
  const centerY = height / 2;
  const retinaRadius = Math.min(width, height) * 0.46;

  // Clip to circular retina
  ctx.beginPath();
  ctx.arc(centerX, centerY, retinaRadius, 0, Math.PI * 2);
  ctx.clip();

  // Base retinal background gradient
  const bgGrad = ctx.createRadialGradient(centerX - 40 * scale, centerY, 40 * scale, centerX, centerY, retinaRadius);
  if (isBorderline && !layers.showEnhanced) {
    // Murky, low contrast cataract hue
    bgGrad.addColorStop(0, '#5a2215');
    bgGrad.addColorStop(0.7, '#42160e');
    bgGrad.addColorStop(1, '#1b0906');
  } else if (isUngradeable) {
    // Washed out / dark
    bgGrad.addColorStop(0, '#753120');
    bgGrad.addColorStop(0.5, '#40180f');
    bgGrad.addColorStop(1, '#100503');
  } else {
    // Healthy or standard retinal orange-red
    bgGrad.addColorStop(0, '#c85028');
    bgGrad.addColorStop(0.45, '#a43417');
    bgGrad.addColorStop(0.85, '#7b200b');
    bgGrad.addColorStop(1, '#3b0d04');
  }

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Choroidal background pattern
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  for (let i = 0; i < 60; i++) {
    const rx = centerX + (Math.sin(i * 13) * retinaRadius * 0.85);
    const ry = centerY + (Math.cos(i * 23) * retinaRadius * 0.85);
    ctx.beginPath();
    ctx.ellipse(rx, ry, 25 * scale, 8 * scale, i * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // If green channel mode selected
  if (options.colorChannel === 'green') {
    ctx.fillStyle = 'rgba(20, 80, 20, 0.65)';
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Draw Optic Disc & Cup
  const odX = caseData.opticDisc.centerX * scaleX;
  const odY = caseData.opticDisc.centerY * scaleY;
  const odR = caseData.opticDisc.radius * scale;
  const cupR = caseData.opticDisc.cupRadius * scale;

  // Optic disc neuroretinal rim
  const odGrad = ctx.createRadialGradient(odX, odY, cupR * 0.4, odX, odY, odR);
  odGrad.addColorStop(0, '#ffe5b4'); // pale optic cup
  odGrad.addColorStop(0.5, '#f6c38a');
  odGrad.addColorStop(0.9, '#e48a52'); // pinkish orange rim
  odGrad.addColorStop(1, '#9b4520');

  ctx.beginPath();
  ctx.arc(odX, odY, odR, 0, Math.PI * 2);
  ctx.fillStyle = odGrad;
  ctx.fill();

  // Optic cup delineation
  ctx.beginPath();
  ctx.arc(odX, odY, cupR, 0, Math.PI * 2);
  ctx.fillStyle = '#fff4db';
  ctx.fill();

  // 3. Draw Macula & Foveal Avascular Zone (FAZ)
  const fovX = caseData.fovea.centerX * scaleX;
  const fovY = caseData.fovea.centerY * scaleY;
  const fazR = caseData.fovea.fovealAvascularZoneRadius * scale;

  // Macula lutea xanthophyll pigmentation
  const maculaGrad = ctx.createRadialGradient(fovX, fovY, fazR * 0.5, fovX, fovY, fazR * 4);
  maculaGrad.addColorStop(0, '#421609'); // deep foveal pit
  maculaGrad.addColorStop(0.4, '#5e2311');
  maculaGrad.addColorStop(0.8, '#823018');
  maculaGrad.addColorStop(1, 'transparent');

  ctx.beginPath();
  ctx.arc(fovX, fovY, fazR * 4, 0, Math.PI * 2);
  ctx.fillStyle = maculaGrad;
  ctx.fill();

  // Central foveal light reflex
  if (!isUngradeable) {
    ctx.beginPath();
    ctx.arc(fovX, fovY, 2.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 240, 0.45)';
    ctx.fill();
  }

  // 4. Draw Retinal Blood Vessel Tree (Superior & Inferior Arcades + Nasal Branches)
  const drawVesselArcade = (startX: number, startY: number, controlPoints: number[][], baseWidth: number, isArtery: boolean) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for (let i = 0; i < controlPoints.length; i += 2) {
      const cpX = controlPoints[i][0] * scaleX;
      const cpY = controlPoints[i][1] * scaleY;
      const endX = controlPoints[i + 1][0] * scaleX;
      const endY = controlPoints[i + 1][1] * scaleY;
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    }
    ctx.strokeStyle = isArtery ? '#801812' : '#4d0b0a'; // Artery lighter red, Vein darker caliber
    ctx.lineWidth = baseWidth * scale;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Central arteriolar light reflex (narrow bright stripe in middle of vessel)
    if (isArtery && baseWidth > 2.5 && !isUngradeable) {
      ctx.strokeStyle = 'rgba(255, 210, 200, 0.35)';
      ctx.lineWidth = Math.max(1, (baseWidth * 0.28) * scale);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Superior Temporal Arcade (arching over macula)
  drawVesselArcade(odX - 10 * scale, odY - 15 * scale, [
    [540, 310], [450, 260],
    [370, 240], [280, 260],
    [210, 290], [160, 340]
  ], 5.8, false);

  drawVesselArcade(odX - 5 * scale, odY - 20 * scale, [
    [530, 290], [440, 240],
    [360, 220], [270, 240],
    [200, 270], [150, 320]
  ], 4.0, true);

  // Inferior Temporal Arcade (arching under macula)
  drawVesselArcade(odX - 10 * scale, odY + 15 * scale, [
    [540, 480], [460, 530],
    [380, 560], [290, 540],
    [210, 510], [160, 460]
  ], 6.2, false);

  drawVesselArcade(odX - 5 * scale, odY + 20 * scale, [
    [530, 500], [450, 550],
    [370, 580], [280, 560],
    [200, 530], [150, 480]
  ], 4.2, true);

  // Nasal Branches (traveling towards disc margin)
  drawVesselArcade(odX + 10 * scale, odY - 10 * scale, [
    [670, 350], [710, 310],
    [740, 270], [770, 240]
  ], 3.8, true);

  drawVesselArcade(odX + 10 * scale, odY + 10 * scale, [
    [680, 450], [720, 490],
    [750, 530], [770, 570]
  ], 4.5, false);

  // Smaller macular and peripapillary arterioles
  drawVesselArcade(odX - 25 * scale, odY - 5 * scale, [
    [520, 390], [450, 390],
    [410, 380], [390, 390]
  ], 2.2, true);

  drawVesselArcade(odX - 25 * scale, odY + 5 * scale, [
    [520, 410], [450, 420],
    [410, 430], [390, 420]
  ], 2.4, false);

  // Venous beading if present in Severe NPDR
  if (caseData.rule421.venousBeading2PlusQuadrants) {
    ctx.fillStyle = '#390807';
    [
      { x: 470 * scaleX, y: 280 * scaleY },
      { x: 485 * scaleX, y: 275 * scaleY },
      { x: 460 * scaleX, y: 530 * scaleY },
      { x: 475 * scaleX, y: 525 * scaleY }
    ].forEach(pt => {
      ctx.beginPath();
      ctx.ellipse(pt.x, pt.y, 8 * scale, 5 * scale, 0.4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // 5. Draw Retinal Lesions
  caseData.lesions.forEach(lesion => {
    const lx = lesion.x * scaleX;
    const ly = lesion.y * scaleY;
    const lr = Math.max(2, lesion.radius * scale);

    if (lesion.type === 'microaneurysm') {
      // Sub-pixel deep red sharp dot with faint halo
      ctx.beginPath();
      ctx.arc(lx, ly, lr * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(120, 10, 5, 0.4)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(lx, ly, lr, 0, Math.PI * 2);
      ctx.fillStyle = '#5c0502';
      ctx.fill();
    } else if (lesion.type === 'hemorrhage_dot_blot') {
      // Round or oval dark red blot
      ctx.beginPath();
      ctx.ellipse(lx, ly, lr * 1.2, lr * 0.9, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#470402';
      ctx.fill();
    } else if (lesion.type === 'hemorrhage_flame') {
      // Striated along nerve fiber bundles
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(-0.4);
      ctx.beginPath();
      ctx.ellipse(0, 0, lr * 1.8, lr * 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#610805';
      ctx.fill();
      ctx.restore();
    } else if (lesion.type === 'hard_exudate') {
      // Bright yellow lipid deposit with crisp edges
      ctx.beginPath();
      ctx.arc(lx, ly, lr, 0, Math.PI * 2);
      ctx.fillStyle = '#fffa99';
      ctx.shadowColor = 'rgba(255, 240, 100, 0.6)';
      ctx.shadowBlur = 3 * scale;
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (lesion.type === 'cotton_wool_spot') {
      // Soft fuzzy grayish-white ischemic swelling
      const cwsGrad = ctx.createRadialGradient(lx, ly, lr * 0.2, lx, ly, lr * 1.4);
      cwsGrad.addColorStop(0, 'rgba(235, 235, 235, 0.85)');
      cwsGrad.addColorStop(0.6, 'rgba(215, 215, 215, 0.55)');
      cwsGrad.addColorStop(1, 'rgba(200, 200, 200, 0)');
      ctx.beginPath();
      ctx.arc(lx, ly, lr * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = cwsGrad;
      ctx.fill();
    } else if (lesion.type === 'neovascularization') {
      // Delicate lace-like fronds of new vessels
      ctx.save();
      ctx.strokeStyle = '#c42018';
      ctx.lineWidth = 1.4 * scale;
      for (let f = 0; f < 6; f++) {
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        const ang = (f * Math.PI) / 3;
        const fx1 = lx + Math.cos(ang) * lr * 0.7;
        const fy1 = ly + Math.sin(ang) * lr * 0.7;
        const fx2 = lx + Math.cos(ang + 0.3) * lr * 1.3;
        const fy2 = ly + Math.sin(ang + 0.3) * lr * 1.3;
        ctx.quadraticCurveTo(fx1, fy1, fx2, fy2);
        ctx.stroke();
      }
      ctx.restore();
    }
  });

  // 6. Media haze / blur simulation for borderline or ungradeable cases
  if (isBorderline && !layers.showEnhanced) {
    ctx.fillStyle = 'rgba(180, 120, 80, 0.38)';
    ctx.fillRect(0, 0, width, height);
  } else if (isUngradeable) {
    // Heavy defocus + cornea reflection
    ctx.fillStyle = 'rgba(100, 70, 60, 0.55)';
    ctx.fillRect(0, 0, width, height);

    // Severe corneal flash glare over macula
    const flashGrad = ctx.createRadialGradient(fovX + 20 * scale, fovY - 15 * scale, 5 * scale, fovX + 20 * scale, fovY - 15 * scale, 90 * scale);
    flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.88)');
    flashGrad.addColorStop(0.3, 'rgba(255, 250, 220, 0.65)');
    flashGrad.addColorStop(0.7, 'rgba(255, 230, 180, 0.2)');
    flashGrad.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(fovX + 20 * scale, fovY - 15 * scale, 90 * scale, 0, Math.PI * 2);
    ctx.fillStyle = flashGrad;
    ctx.fill();
  }

  // 7. Adaptive CLAHE & Enhancement layer if enabled
  if (layers.showEnhanced && (isBorderline || caseData.icdrGrade >= 1)) {
    // Simulating CLAHE local contrast stretch: high clarity, vessel pop
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.4, options.claheClipLimit * 12)})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 8. Grad-CAM Attention Heatmap Overlay
  if (layers.showGradCam && caseData.icdrGrade > 0) {
    ctx.save();
    ctx.globalAlpha = layers.gradCamOpacity;

    // Center heatmap around pathology clusters
    const primaryHotspots = caseData.lesions.length > 0 
      ? caseData.lesions.map(l => ({ x: l.x * scaleX, y: l.y * scaleY, weight: l.severity === 'severe' ? 1.0 : 0.6 }))
      : [{ x: fovX, y: fovY, weight: 0.3 }];

    primaryHotspots.forEach(spot => {
      const gradCamGrad = ctx.createRadialGradient(spot.x, spot.y, 10 * scale, spot.x, spot.y, 85 * scale * spot.weight);
      if (layers.gradCamColormap === 'jet') {
        gradCamGrad.addColorStop(0, 'rgba(255, 0, 0, 0.95)');      // Red core (max activation)
        gradCamGrad.addColorStop(0.35, 'rgba(255, 220, 0, 0.8)');  // Yellow
        gradCamGrad.addColorStop(0.65, 'rgba(0, 255, 180, 0.5)');  // Cyan/Green
        gradCamGrad.addColorStop(0.9, 'rgba(0, 50, 255, 0.2)');    // Blue
        gradCamGrad.addColorStop(1, 'transparent');
      } else if (layers.gradCamColormap === 'turbo') {
        gradCamGrad.addColorStop(0, 'rgba(180, 20, 0, 0.95)');
        gradCamGrad.addColorStop(0.3, 'rgba(240, 160, 0, 0.85)');
        gradCamGrad.addColorStop(0.6, 'rgba(40, 200, 120, 0.6)');
        gradCamGrad.addColorStop(0.85, 'rgba(40, 80, 220, 0.25)');
        gradCamGrad.addColorStop(1, 'transparent');
      } else if (layers.gradCamColormap === 'inferno') {
        gradCamGrad.addColorStop(0, 'rgba(252, 255, 164, 0.95)');
        gradCamGrad.addColorStop(0.35, 'rgba(249, 142, 9, 0.8)');
        gradCamGrad.addColorStop(0.7, 'rgba(187, 55, 84, 0.55)');
        gradCamGrad.addColorStop(0.9, 'rgba(87, 16, 110, 0.2)');
        gradCamGrad.addColorStop(1, 'transparent');
      } else {
        // viridis
        gradCamGrad.addColorStop(0, 'rgba(253, 231, 37, 0.95)');
        gradCamGrad.addColorStop(0.35, 'rgba(53, 183, 121, 0.8)');
        gradCamGrad.addColorStop(0.7, 'rgba(49, 104, 142, 0.55)');
        gradCamGrad.addColorStop(0.9, 'rgba(68, 1, 84, 0.2)');
        gradCamGrad.addColorStop(1, 'transparent');
      }

      ctx.beginPath();
      ctx.arc(spot.x, spot.y, 85 * scale * spot.weight, 0, Math.PI * 2);
      ctx.fillStyle = gradCamGrad;
      ctx.fill();
    });
    ctx.restore();
  }

  // 9. Retinal Structure Segmentation Annotations (OD border, Fovea circle, Lesion markers)
  if (layers.showOpticDisc) {
    ctx.save();
    ctx.strokeStyle = '#38bdf8'; // bright cyan
    ctx.lineWidth = 2.5 * scale;
    ctx.setLineDash([5 * scale, 3 * scale]);
    ctx.beginPath();
    ctx.arc(odX, odY, odR, 0, Math.PI * 2);
    ctx.stroke();

    // Optic Cup
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 1.8 * scale;
    ctx.beginPath();
    ctx.arc(odX, odY, cupR, 0, Math.PI * 2);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#38bdf8';
    ctx.font = `bold ${Math.round(11 * scale)}px 'JetBrains Mono', monospace`;
    ctx.fillText(`OD (CDR: ${caseData.opticDisc.cupToDiscRatio.toFixed(2)})`, odX - 45 * scale, odY + odR + 16 * scale);
    ctx.restore();
  }

  if (layers.showFovea) {
    ctx.save();
    ctx.strokeStyle = '#f59e0b'; // amber
    ctx.lineWidth = 2.0 * scale;
    ctx.setLineDash([4 * scale, 4 * scale]);
    ctx.beginPath();
    ctx.arc(fovX, fovY, fazR * 2.5, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshair at center
    ctx.beginPath();
    ctx.moveTo(fovX - 8 * scale, fovY);
    ctx.lineTo(fovX + 8 * scale, fovY);
    ctx.moveTo(fovX, fovY - 8 * scale);
    ctx.lineTo(fovX, fovY + 8 * scale);
    ctx.stroke();

    // Fovea distance label
    ctx.fillStyle = '#f59e0b';
    ctx.font = `bold ${Math.round(11 * scale)}px 'JetBrains Mono', monospace`;
    ctx.fillText('FAZ / Fovea Center', fovX - 50 * scale, fovY - fazR * 2.5 - 8 * scale);
    ctx.restore();
  }

  // 10. Lesion Markers (Sub-pixel MA boxes, hemorrhage halos, exudate polygons)
  if (layers.showLesions) {
    ctx.save();
    caseData.lesions.forEach(l => {
      const lx = l.x * scaleX;
      const ly = l.y * scaleY;
      const lr = Math.max(3, l.radius * scale);

      if (l.type === 'microaneurysm') {
        ctx.strokeStyle = '#ef4444'; // red
        ctx.lineWidth = 1.5 * scale;
        ctx.strokeRect(lx - lr * 1.8, ly - lr * 1.8, lr * 3.6, lr * 3.6);
      } else if (l.type.startsWith('hemorrhage')) {
        ctx.strokeStyle = '#dc2626'; // dark red
        ctx.lineWidth = 1.8 * scale;
        ctx.beginPath();
        ctx.arc(lx, ly, lr * 1.4, 0, Math.PI * 2);
        ctx.stroke();
      } else if (l.type === 'hard_exudate') {
        ctx.strokeStyle = '#eab308'; // yellow
        ctx.lineWidth = 1.8 * scale;
        ctx.beginPath();
        ctx.arc(lx, ly, lr * 1.5, 0, Math.PI * 2);
        ctx.stroke();
      } else if (l.type === 'cotton_wool_spot') {
        ctx.strokeStyle = '#94a3b8'; // gray
        ctx.lineWidth = 1.8 * scale;
        ctx.setLineDash([3 * scale, 2 * scale]);
        ctx.beginPath();
        ctx.arc(lx, ly, lr * 1.6, 0, Math.PI * 2);
        ctx.stroke();
      } else if (l.type === 'neovascularization') {
        ctx.strokeStyle = '#a855f7'; // purple
        ctx.lineWidth = 2.2 * scale;
        ctx.beginPath();
        ctx.arc(lx, ly, lr * 1.8, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  // 11. Quadrants Overlay (Superior Temporal, Inferior Temporal, Superior Nasal, Inferior Nasal)
  if (layers.showQuadrants) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.2 * scale;
    ctx.setLineDash([6 * scale, 6 * scale]);

    // Horizontal & Vertical through fovea
    ctx.beginPath();
    ctx.moveTo(0, fovY);
    ctx.lineTo(width, fovY);
    ctx.moveTo(fovX, 0);
    ctx.lineTo(fovX, height);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = `bold ${Math.round(10 * scale)}px sans-serif`;
    ctx.fillText('Superior Temporal (ST)', fovX - 170 * scale, fovY - 70 * scale);
    ctx.fillText('Inferior Temporal (IT)', fovX - 170 * scale, fovY + 70 * scale);
    ctx.fillText('Superior Nasal (SN)', fovX + 50 * scale, fovY - 70 * scale);
    ctx.fillText('Inferior Nasal (IN)', fovX + 50 * scale, fovY + 70 * scale);

    ctx.restore();
  }

  // 12. Aperture Vignette Border (Realistic Fundus Camera Field of View Ring)
  ctx.restore(); // Exit clip

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, retinaRadius, 0, Math.PI * 2);
  ctx.arc(centerX, centerY, Math.max(width, height), 0, Math.PI * 2, true);
  ctx.fillStyle = '#020617'; // slate-950 frame outside circular aperture
  ctx.fill();

  // Subtle circular bezel ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, retinaRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  // Scale bar (1000 µm ~ 1 mm on retina)
  const scaleBarMicrons = 1000;
  const pixelsPerMicron = (odR * 2) / 1500; // Average optic disc is ~1500 microns
  const scaleBarPixels = scaleBarMicrons * pixelsPerMicron;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(20 * scale, height - 42 * scale, scaleBarPixels + 24 * scale, 26 * scale);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(32 * scale, height - 25 * scale);
  ctx.lineTo(32 * scale + scaleBarPixels, height - 25 * scale);
  ctx.stroke();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = `${Math.round(9 * scale)}px 'JetBrains Mono', monospace`;
  ctx.fillText('1000 µm (1.0 mm)', 32 * scale, height - 30 * scale);

  ctx.restore();
}
