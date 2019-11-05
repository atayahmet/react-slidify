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
export declare type ReachPoint = 'start-point' | 'end-point';
export declare type GenericHandlerArgs = (point: IEventPoint, index: number) => any;
export declare type onSlideHandlerArgs = GenericHandlerArgs;
export declare type onStartHandlerArgs = GenericHandlerArgs;
export declare type onStopHandlerArgs = GenericHandlerArgs;
export declare type onReachHandlerArgs = (point: IEventPoint, index: number, at: ReachPoint) => any;
export interface IEventPoint {
  x: number;
  y: number;
  width: number;
  height: number;
  axis: 'x' | 'y';
  percent: IPercent;
}
export interface IPercent {
  x: number;
  y: number;
}
export interface IPoint {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: CSSProperties;
  className?: string;
  children?: JSX.Element;
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
  movable?: boolean;
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

export interface ITriggerEvent {
  eventTrigger?: CallableFunction;
}