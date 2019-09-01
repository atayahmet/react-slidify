export interface ITranslate {
  translateX: number;
  translateY: number;
}

export interface ISizes {
  container: {
    width: number;
    height: number;
  };
  cursor: {
    width: number;
    height: number;
  };
}

type EventHandlerArgs = (xPercent: number, yPercent: number, axis: string | null, options: IRange) => any;

export interface IRange {
  x: number;
  y: number;
  multiple?: boolean;
  axis?: 'x' | 'y' | 'xy';
  width?: number | string;
  unit: 'percent' | 'step';
  height?: number | string;
  cursorPoint?: 'center' | 'side';
  onStart?: EventHandlerArgs;
  onSlide?: EventHandlerArgs;
  onStop?: EventHandlerArgs;
  onFinish?: EventHandlerArgs;
  onBegin?: EventHandlerArgs;
}
