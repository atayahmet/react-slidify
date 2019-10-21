import { isBorderStartArea } from './assertions';
import { PERCENT } from './contants';
import { ITranslate } from './interfaces';

export function getTranslates(el: HTMLDivElement): ITranslate | void {
  if (Boolean(el) && el.style.transform !== null) {
    const matches = el.style.transform.match(/translate3d\(([0-9]+)px,\s([0-9]+)px.*$/) || [];
    const [, translateX = 0, translateY = 0] = matches.filter(Number).map(item => Number(item));
    return { translateX, translateY };
  }
}

export function getStartBorderValue(distance: number, cursorWidth: number): number {
  return distance < 0 ? 0 : distance;
}

export function getEndBorderValue(distance: number, cursorWidth: number, transX: number, areaWidth: number): number {
  const cursorHalf = cursorWidth / 2;
  const left = transX > areaWidth + cursorHalf ? areaWidth : distance;
  return distance + cursorWidth > areaWidth ? areaWidth - cursorWidth : left;
}

export function getLeftButtonState(e: MouseEvent) {
  const event = { ...e };
  return event.buttons === undefined ? event.which : event.buttons;
}

export function getPosCalc(size: number, point: number = 0, distance: number = 0, unit: string) {
  switch (unit) {
    case PERCENT: {
      return getPosCalcAsPercent(size, point, distance);
    }
    default:
      return getPosCalcAsPx(size, point, distance);
  }
}

export function getPosCalcAsPx(size: number, point: number, distance: number): number {
  const areaSize = size - point;
  const percent = distance / size * 100
  const targetDistance = size / 100 * percent;
  return targetDistance > areaSize ? areaSize : targetDistance;
}

export function getPosCalcAsPercent(size: number, point: number, distance: number): number {
  const newSize = size - point * 2;
  const percent = (distance / newSize) * 100;
  return percent > 100 ? 100 : percent;
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

export function getClientRects(e: Record<string, any>) {
  const rects = ({...e}).target.getClientRects();
  return rects[0] || {};
}

export function getInitialPos(area: number, cursor: number, initialDistance: number = 0): number {
  const hasIn = isBorderStartArea(area, initialDistance, (area / 2));
  const startArea = getStartBorderValue(initialDistance, cursor);
  const endArea = getEndBorderValue(initialDistance, cursor, initialDistance, area);
  return hasIn ? startArea : endArea;
}