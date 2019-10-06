import { CSSProperties } from 'react';

export interface ITranslate {
  translateX: number;
  translateY: number;
}

export interface ISizes {
  container: {
    width: number;
    height: number;
  };
}

export type ReachPoint = 'start-point' | 'end-point';
export type onSlideHandlerArgs = (xPercent: number, yPercent: number) => any;
export type EventHandlerArgs = (xPercent: number, yPercent: number, axis: string | null) => any;
export type onReachHandlerArgs = (xPercent: number, yPercent: number, axis: string | null, point: ReachPoint) => any;

export interface IPoint {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: CSSProperties;
}

export interface IInternalPointProps extends IPoint {
  ref?: React.RefObject<any>;
  translateX?: number | null;
  translateY?: number | null;
  xHalf?: number;
  yHalf?: number;
}

export interface ISlidifyOptions {
  x?: number;
  y?: number;
  points: IPoint[];
  multiple?: boolean;
  axis?: 'x' | 'y' | 'xy';
  width?: number | string;
  unit?: 'percent' | 'px';
  height?: number | string;
  onStart?: EventHandlerArgs;
  onSlide?: onSlideHandlerArgs;
  onStop?: EventHandlerArgs;
  onReach?: onReachHandlerArgs;
}

export interface IBorderEvent { 
  value: number;
  isFinish: boolean;
  half: number;
  setFinish: CallableFunction;
  finishedAxis: string;
  axis: string;
  distance: number;
  options: any;
  eventDeps: any;
  area: number;
  clientDistance: number;
}