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
export type GenericHandlerArgs = (xPercent: number, yPercent: number, point: IPoint) => any;
export type onSlideHandlerArgs = GenericHandlerArgs;
export type onStartHandlerArgs = GenericHandlerArgs;
export type onStopHandlerArgs = GenericHandlerArgs;
export type onReachHandlerArgs = (xPercent: number, yPercent: number, axis: string, point: IPoint, at: ReachPoint) => any;

export interface IPoint {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: CSSProperties;
  className?: string;
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
  onStart?: onStartHandlerArgs;
  onStop?: onStopHandlerArgs;
  onSlide?: onSlideHandlerArgs;
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