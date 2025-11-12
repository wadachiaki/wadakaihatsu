// src/lib/myakugaki/drawUtils.ts

export type Point = { x: number; y: number };
export type Dot = { x: number; y: number; rx: number; ry: number };
export type Eye = { dotIndex: number; offsetX: number; offsetY: number };

/**
 * Chaikin スムージング
 */
export function chaikinSmooth(points: Point[], iterations: number): Point[] {
  let pts = points.slice();
  for (let it = 0; it < iterations; it++) {
    const newPts: Point[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      newPts.push({
        x: 0.75 * p0.x + 0.25 * p1.x,
        y: 0.75 * p0.y + 0.25 * p1.y,
      });
      newPts.push({
        x: 0.25 * p0.x + 0.75 * p1.x,
        y: 0.25 * p0.y + 0.75 * p1.y,
      });
    }
    pts = newPts;
  }
  return pts;
}

/**
 * ドットをパス上に配置（サイズランダム・間隔一定）
 */
export function generateDotsAlongPath(pathPoints: Point[], baseRadius: number): { dots: Dot[]; eyes: Eye[] } {
  const segmentLengths: number[] = [];
  let totalLength = 0;
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const dx = pathPoints[i + 1].x - pathPoints[i].x;
    const dy = pathPoints[i + 1].y - pathPoints[i].y;
    const segLen = Math.hypot(dx, dy);
    segmentLengths.push(segLen);
    totalLength += segLen;
  }

  const dotPositions: Dot[] = [];
  const first = pathPoints[0];
  const firstRx = baseRadius * (0.5 + Math.random() * 1.0);
  const firstRy = baseRadius * (0.5 + Math.random() * 1.0);
  dotPositions.push({ x: first.x, y: first.y, rx: firstRx, ry: firstRy });

  let prevEffective = (firstRx + firstRy) / 2;
  let distCursor = 0;
  const overlapRate = 0.8;
  const MAX_STEP = 50;

  while (true) {
    const remain = totalLength - distCursor;
    if (remain < 1) break;

    const currRx = baseRadius * (0.5 + Math.random() * 1.0);
    const currRy = baseRadius * (0.5 + Math.random() * 1.0);

    let estEffective;
    {
      let accu = 0;
      let idx = 0;
      const target = distCursor + 1e-3;
      for (let i = 0; i < segmentLengths.length; i++) {
        accu += segmentLengths[i];
        if (accu >= target) {
          idx = i;
          break;
        }
      }
      const p0 = pathPoints[idx];
      const p1 = pathPoints[idx + 1];
      const segLenE = segmentLengths[idx] || 1;
      const uxE = (p1.x - p0.x) / segLenE;
      const uyE = (p1.y - p0.y) / segLenE;
      estEffective = 1 / Math.sqrt((uxE / currRx) ** 2 + (uyE / currRy) ** 2);
      if (!isFinite(estEffective)) estEffective = (currRx + currRy) / 2;
    }

    let thisStep = (prevEffective + estEffective) * overlapRate;
    if (thisStep > MAX_STEP) thisStep = MAX_STEP;

    const nextDist = distCursor + thisStep;
    if (nextDist > totalLength) break;

    let accu2 = 0;
    let segIndex = 0;
    let segOffset = 0;
    for (let i = 0; i < segmentLengths.length; i++) {
      accu2 += segmentLengths[i];
      if (accu2 >= nextDist) {
        segIndex = i;
        segOffset = nextDist - (accu2 - segmentLengths[i]);
        break;
      }
    }
    const p0 = pathPoints[segIndex];
    const p1 = pathPoints[segIndex + 1];
    const segLen = segmentLengths[segIndex] || 1;
    const r = segOffset / segLen;
    const x = p0.x + (p1.x - p0.x) * r;
    const y = p0.y + (p1.y - p0.y) * r;

    let currEffective = 1 / Math.sqrt(((p1.x - p0.x) / segLen / currRx) ** 2 + ((p1.y - p0.y) / segLen / currRy) ** 2);
    if (!isFinite(currEffective)) currEffective = (currRx + currRy) / 2;

    dotPositions.push({ x, y, rx: currRx, ry: currRy });
    distCursor = nextDist;
    prevEffective = currEffective;
  }

  const dotsCount = dotPositions.length;
let numEyes = 0;
if (dotsCount >= 4) {
  // 通常：2〜4個
  numEyes = Math.floor(Math.random() * 3) + 2; // 2〜4
} else {
  // 少数なら確率的に制限
  const probabilityPerDot = 0.3; // 各ドットに目がつく確率（調整可）
  for (let i = 0; i < dotsCount; i++) {
    if (Math.random() < probabilityPerDot) numEyes++;
  }
  if (numEyes === 0 && dotsCount > 2) {
    // 1個くらいはつけとく
    numEyes = 1;
  }
}

  const shuffled = shuffleArray(dotPositions.map((_, i) => i));
  const eyes: Eye[] = [];
  for (let i = 0; i < numEyes; i++) {
    const idx = shuffled[i];
    const d = dotPositions[idx];
    const avgR = (d.rx + d.ry) / 2;
    const eyeR = avgR * 0.5;
    const offsetX = (Math.random() * 2 - 1) * (eyeR * 0.2);
    const offsetY = (Math.random() * 2 - 1) * (eyeR * 0.2);
    eyes.push({ dotIndex: idx, offsetX, offsetY });
  }

  return { dots: dotPositions, eyes };
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
