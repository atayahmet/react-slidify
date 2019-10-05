const deepEqual = require('deep-equal');

export function isBorderStartArea(area: number, distance: number, half: number): boolean {
  return (area - half) / 2 > distance;
}

export function isBorderEndArea(width: number, current: number, half: number): boolean {
  return (width - half) / 2 < current;
}

export function hasAxis(axis: string, list: string[]): boolean {
  return list.indexOf(axis) > -1;
}

export function hasCollisionInBegin(currentPos: number, half: number, distance: number): boolean {
  return currentPos === 0;
}

export function hasCollisionInEnd(currentPos: number, area: number, half: number, distance: number): boolean {
  return currentPos >= area - (half * 2) && distance !== currentPos;
}

export function isStyleEqualWith(a: Record<string, any> = {}, b: Record<string, any> = {}): boolean {
  return deepEqual((a.style || {}), (b.style || {}), {strict: true});
}