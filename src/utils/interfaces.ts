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
  cursor: ICursor;
}

export type Point = 'start-point' | 'end-point';
export type EventHandlerArgs = (xPercent: number, yPercent: number, axis: string | null) => any;
export type onReachHandlerArgs = (xPercent: number, yPercent: number, axis: string | null, point: Point) => any;

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

export interface ICursor {
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
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
  cursor?: ICursor;
  onStart?: EventHandlerArgs;
  onSlide?: EventHandlerArgs;
  onStop?: EventHandlerArgs;
  onReach?: onReachHandlerArgs;
}
