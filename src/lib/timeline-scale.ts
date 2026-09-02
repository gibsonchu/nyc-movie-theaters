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
