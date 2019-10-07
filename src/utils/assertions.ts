import deepEqual from 'deep-equal';

export function isBorderStartArea(area: number, distance: number, half: number): boolean {
  return (area - half) / 2 > distance;
}

export function isBorderEndArea(width: number, current: number, half: number): boolean {
  return (width - half) / 2 < current;
}

export function hasAxis(axis: string, list: string[]): boolean {
  return list.indexOf(axis) > -1;
}

export function isStyleEqualWith(a: Record<string, any> = {}, b: Record<string, any> = {}): boolean {
  return deepEqual((a.style || {}), (b.style || {}), {strict: true});
}