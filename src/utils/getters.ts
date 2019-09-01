import { ITranslate } from './interfaces';

export function getTranslates(el: HTMLDivElement): ITranslate | void {
  if (Boolean(el) && el.style.transform !== null) {
    const matches = el.style.transform.match(/translate3d\(([0-9]+)px,\s([0-9]+)px.*$/) || [];
    const [, translateX = 0, translateY = 0] = matches.filter(Number).map(item => Number(item));
    return { translateX, translateY };
  }
}

export function getPosition(distance: number, cursorWidth: number): number {
  const cursorHalf = cursorWidth / 2;
  const left = distance - cursorHalf;
  return left < 0 ? distance - cursorWidth : left - cursorHalf;
}

export function getStartBorderValue(distance: number, cursorWidth: number): number {
  const cursorHalf = cursorWidth / 2;
  const left = distance - cursorHalf;
  return left < -cursorHalf ? -cursorWidth : left - cursorHalf;
}

export function getEndBorderValue(distance: number, cursorWidth: number, transX: number, areaWidth: number): number {
  const cursorHalf = cursorWidth / 2;
  const left = transX > areaWidth + cursorHalf ? areaWidth : distance;
  return left > areaWidth - cursorHalf ? areaWidth - cursorWidth : left - cursorHalf;
}

export function getLeftButtonState(e: MouseEvent) {
  const event = { ...e };
  return event.buttons === undefined ? event.which : event.buttons;
}

export function getPosCalcAsPx(size: number, half: number, distancePercent: number): number {
  const areaSize = size - half * 2;
  const distance = (areaSize / 100) * distancePercent;
  return distance > areaSize ? areaSize : distance;
}

export function getPosCalcAsPercent(size: number, cursor: number, distance: number): number {
  const newSize = size - cursor * 2;
  const percent = (distance / newSize) * 100;
  return percent > 100 || percent < 1 ? Math.round(percent) : percent;
}

export function get(path: string, data: object, defaultData?: any): any {
  return !Boolean(path)
    ? defaultData
    : path
        .split('.')
        .reduce(
          (result: Record<string, any>, key: string) =>
            Boolean(result) && Boolean(result[key]) && typeof result[key] !== 'object' ? result[key] : defaultData,
          data,
        );
}

export function getClientPos(e: any): Record<string, number> {
  return Boolean(e.changedTouches) ? e.changedTouches[0] : e;
}
