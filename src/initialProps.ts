import { ICursor } from './utils/interfaces';

export default {
  axis: 'x',
  cursor: {
    height: 0,
    width: 0
  } as ICursor,
  height: 'auto',
  multiple: false,
  onReach: (e: any) => null,
  onSlide: (e: any) => null,
  onStart: (e: any) => null,
  onStop: (e: any) => null,
  unit: 'percent',
  width: '100%',
  x: 0,
  y: 0,
};
