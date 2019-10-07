import { AREA_FIRST, AREA_SECOND, END_POINT, ON_REACH, START_POINT } from './contants';
import { IBorderEvent } from './interfaces';
import trigger from './trigger';

function hasBorderCollision(...args: any[]) {
  return args.shift() === AREA_FIRST ? firstArea.call(null, ...args) : secondArea.call(null, ...args);
}

function borderEventTrigger({ value, isFinish, half, setFinish, finishedAxis, axis, distance, options, eventDeps, area, clientDistance}: IBorderEvent) {
  if (collision.border(AREA_FIRST, value) && !isFinish && finishedAxis !== axis) {
    setFinish(true, axis);
    trigger(ON_REACH, [...eventDeps, START_POINT, options]);
  } else if (collision.border(AREA_SECOND, value, area, half, distance) && !isFinish && finishedAxis !== axis) {
    setFinish(true, axis);
    trigger(ON_REACH, [...eventDeps, END_POINT, options]);
  } else if (value > 1 && clientDistance && isFinish && finishedAxis === axis) {
    setFinish(false, null);
  }
}

export function firstArea(...args: any[]): boolean {
  return args.shift() === 0;
}

export function secondArea(...args: any[]): boolean {
  const currentPos: number = args.shift();
  const area: number = args.shift();
  const half: number = args.shift();
  const distance: number = args.shift();
  return currentPos >= area - (half * 2) && distance !== currentPos;
}

export const collision = {
  border: hasBorderCollision,
  trigger:  {
    border: borderEventTrigger
  }
};