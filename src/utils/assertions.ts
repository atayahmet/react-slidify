export function isBorderStartArea(area: number, current: number, half: number): boolean {
  return (area - half) / 2 > current;
}

export function isBorderEndArea(width: number, current: number, half: number): boolean {
  return (width - half) / 2 < current;
}

export function hasAxis(axis: string, list: string[]): boolean {
  return list.indexOf(axis) > -1;
}

export function hasCollisionInBegin(currentPos: number, half: number, distance: number): boolean {
  return currentPos === -half && Math.ceil(Math.abs(distance)) !== half;
}

export function hasCollisionInEnd(currentPos: number, area: number, half: number, distance: number): boolean {
  return currentPos >= area - half * 3 && distance !== currentPos + 0.001;
}

export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
