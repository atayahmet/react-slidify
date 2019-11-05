import { isMobile } from 'is-mobile';
import { isBorderStartArea } from './assertions';
import { collision } from './collisions';
import { AXIS_X, AXIS_Y, ON_SLIDE } from './contants';
import { get, getEndBorderValue, getPosCalcAsPercent, getStartBorderValue } from './getters';
import trigger from './trigger';

export const pointMovablityHandler = (
  params = {} as Record<string, any>,
  value: boolean,
  eventName: string,
): any => () => {
  const { setIsMovable, container, points, index, eventTrigger = trigger } = params;
  const { xHalf, yHalf, translateX, translateY } = points[index];

  const xPos = Math.floor(translateX + xHalf);
  const yPos = Math.floor(translateY + yHalf);

  const xPercent = getPosCalcAsPercent(container.width, xHalf, xPos);
  const yPercent = getPosCalcAsPercent(container.height, yHalf, yPos);

  eventTrigger(eventName, [
    {
      percent: { x: xPercent, y: yPercent },
      ...points[index],
      x: translateX,
      y: translateY,
    },
    index,
    { ...params.options },
  ]);

  setIsMovable(value);
};

export const pointClickHandler = (params: Record<string, any> = {}) => {
  return () => {
    let axis = {};
    const setTranslates = get('setTranslates', params);
    const { clientX = null, clientY = null, hasX, hasY, index, win = window } = params;

    if (hasX && Boolean(clientX)) {
      axis = { ...axis, translateX: clientX };
    }
    if (hasY && Boolean(clientY)) {
      axis = { ...axis, translateY: clientY };
    }

    win.requestAnimationFrame(() => setTranslates({ ...axis }, index));
  };
};

export const pointMoveHandler = (params: Record<string, any> = {}) => {
  return () => {
    const { buttonState = 1, isMovable, testMobile = isMobile } = params;

    if (!isMovable || (buttonState !== 1 && !testMobile())) {
      return;
    }
    
    const { setTranslates, eventTrigger = trigger, win = window, container, options, index, points, clientX, clientY, hasX, hasY } = params;
    const { xHalf, yHalf, width, height, translateX = 0, translateY = 0 } = points[index];
    const xPercent = getPosCalcAsPercent(container.width, xHalf, translateX);
    const yPercent = getPosCalcAsPercent(container.height, yHalf, translateY);
    let translates = {} as Record<string, any>;
    let x: number = 0;
    let y: number = 0;

    // X position half left area.
    if (hasX) {
      const axisParams = {
        ...params,
        area: container.width,
        clientDistance: clientX,
        distance: translateX,
        half: xHalf,
        pointSize: width,
      };

      x = actionMove({ ...axisParams });
      translates = { ...translates, translateX: x };

      collision.trigger.border({
        ...axisParams,
        axis: AXIS_X,
        eventDeps: [
          {
            axis: AXIS_X,
            percent: { x: xPercent, y: yPercent },
            ...points[index],
            x,
            y: translateY,
          },
          index,
        ],
        value: translates.translateX,
      } as any);
    }

    // Y position half top area.
    if (hasY) {
      const axisParams = {
        ...params,
        area: container.height,
        clientDistance: clientY,
        distance: translateY,
        half: yHalf,
        pointSize: height,
      };

      y = actionMove({ ...axisParams });
      translates = { ...translates, translateY: y };

      collision.trigger.border({
        ...axisParams,
        axis: AXIS_Y,
        eventDeps: [
          {
            axis: AXIS_Y,
            percent: { x: xPercent, y: yPercent },
            ...points[index],
            x: translateX,
            y,
          },
          index,
        ],
        value: translates.translateY,
      } as any);
    }

    win.requestAnimationFrame(() => setTranslates(translates, index));
    eventTrigger(ON_SLIDE, [{...points[index], percent: { x: xPercent, y: yPercent }, x, y }, index, options]);
  };
};

export function actionMove(params: Record<string, any>) {
  const { clientDistance, distance, pointSize, area, half } = params;
  return isBorderStartArea(area, distance, half)
    ? getStartBorderValue(clientDistance)
    : getEndBorderValue(clientDistance, pointSize, distance, area);
}
