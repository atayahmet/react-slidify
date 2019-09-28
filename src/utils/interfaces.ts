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

export interface ICursor {
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
}

export interface ISlidifyOptions {
  x?: number;
  y?: number;
  multiple?: boolean;
  axis?: 'x' | 'y' | 'xy';
  width?: number | string;
  unit?: 'percent' | 'step';
  height?: number | string;
  cursor?: ICursor;
  onStart?: EventHandlerArgs;
  onSlide?: EventHandlerArgs;
  onStop?: EventHandlerArgs;
  onReach?: onReachHandlerArgs;
}
