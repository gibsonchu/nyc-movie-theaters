import { MAX_YEAR, MIN_YEAR, clampYear } from "./timeline";

export function yearToPercent(year: number): number {
  return ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
}

export function percentToYear(percent: number): number {
  const year = MIN_YEAR + (percent / 100) * (MAX_YEAR - MIN_YEAR);
  return clampYear(year);
}

export function decadeTicks(): number[] {
  const ticks: number[] = [];
  const start = Math.ceil(MIN_YEAR / 10) * 10;
  for (let y = start; y <= MAX_YEAR; y += 10) {
    ticks.push(y);
  }
  if (ticks[0] !== MIN_YEAR) ticks.unshift(MIN_YEAR);
  if (ticks[ticks.length - 1] !== MAX_YEAR) ticks.push(MAX_YEAR);
  return ticks;
}

/** A handful of evenly-spaced year labels — for narrow tracks where every decade would overlap. */
export function sparseTicks(count: number): number[] {
  if (count <= 1) return [MIN_YEAR];
  const ticks: number[] = [];
  for (let i = 0; i < count; i++) {
    ticks.push(Math.round(MIN_YEAR + (i / (count - 1)) * (MAX_YEAR - MIN_YEAR)));
  }
  return ticks;
}
