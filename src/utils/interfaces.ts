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

export type SliderEventHandlerArgs = (xPercent: number, yPercent: number, axis: string | null, options: ISliderOptions) => any;

export interface ISliderOptions {
  x: number;
  y: number;
  multiple?: boolean;
  axis?: 'x' | 'y' | 'xy';
  width?: number | string;
  unit: 'percent' | 'step';
  height?: number | string;
  cursorPoint?: 'center' | 'side';
  onStart?: SliderEventHandlerArgs;
  onSlide?: SliderEventHandlerArgs;
  onStop?: SliderEventHandlerArgs;
  onFinish?: SliderEventHandlerArgs;
  onBegin?: SliderEventHandlerArgs;
}
