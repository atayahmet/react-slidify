import deepEqual from 'deep-equal';

export function isBorderStartArea(area: number, distance: number, half: number): boolean {
  return (area - half) / 2 > distance;
}

export function isStyleEqualWith(a: Record<string, any> = {}, b: Record<string, any> = {}): boolean {
  return deepEqual((a.style || {}), (b.style || {}), {strict: true});
}