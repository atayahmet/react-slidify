import { isMobile } from 'is-mobile';
import { isBorderStartArea } from './assertions';
import { collision } from './collisions';
import { AXIS_X, AXIS_Y, ON_SLIDE } from './contants';
import { get, getEndBorderValue, getPosCalcAsPercent, getStartBorderValue } from './getters';
import trigger from './trigger';

export const onStartStopHandler = (
  params = {} as Record<string, any>,
  value: boolean,
  eventName: string,
): any => () => {
  const { setIsMovable, container, points, index } = params;
  const { xHalf, yHalf, translateX, translateY } = points[index];
  
  const xPos = Math.floor(translateX + xHalf);
  const yPos = Math.floor(translateY + yHalf);

  const xPercent = getPosCalcAsPercent(container.width, xHalf, xPos);
  const yPercent = getPosCalcAsPercent(container.height, yHalf, yPos);

  trigger(eventName, [xPercent, yPercent, {...points[index]}, { ...params.options }]);

  setIsMovable(value);
};

export const onClickHandler = (params: Record<string, any> = {}) => {
  return () => {
    let axis = {};
    const setTranslates = get('setTranslates', params);
    const { clientX = null, clientY = null, hasX, hasY, index } = params;

    if (hasX && Boolean(clientX)) {
      axis = {...axis, translateX: clientX};
    }
    if (hasY && Boolean(clientY)) {
      axis = {...axis, translateY: clientY};
    }

    window.requestAnimationFrame(() => setTranslates({ ...axis }, index));
  };
};

export const onMoveHandler = (params: Record<string, any> = {}) => {
  return () => {
    const { buttonState = 1, isMovable } = params;

    if (!isMovable || (buttonState !== 1 && !isMobile())) {
      return;
    }

    const {
      setTranslates,
      container,
      options,
      index,
      points,
      clientX,
      clientY,
      hasX,
      hasY,
    } = params;

    const { xHalf, yHalf, width, height, translateX, translateY} = points[index];
    const xPercent = getPosCalcAsPercent(container.width, xHalf, translateX);
    const yPercent = getPosCalcAsPercent(container.height, yHalf, translateY);
    let translates = {} as Record<string, any>;

    // X position half left area.
    if (hasX) {
      const axisParams = {
        ...params, 
        area: container.width, 
        clientDistance: clientX, 
        distance: translateX, 
        half: xHalf, 
        pointSize: width
      };

      translates = {...translates, translateX: actionMove({...axisParams})};

      collision.trigger.border({
        ...axisParams,
        axis: AXIS_X,
        eventDeps: [xPercent, yPercent, AXIS_X, {...points[index]}],
        value: translates.translateX
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

      translates = {...translates, translateY: actionMove({...axisParams})};

      collision.trigger.border({
        ...axisParams, 
        axis: AXIS_Y,
        eventDeps: [xPercent, yPercent, AXIS_Y, {...points[index]}],
        value: translates.translateY
      } as any);
    }

    window.requestAnimationFrame(() => setTranslates(translates, index));

    trigger(ON_SLIDE, [xPercent, yPercent, {...points[index]}, options]);
  };
};

export function actionMove(params: Record<string, any>) {
  const { clientDistance, distance, pointSize, area, half } = params;
  return isBorderStartArea(area, distance, half) 
    ? getStartBorderValue(clientDistance, pointSize) 
    : getEndBorderValue(clientDistance, pointSize, distance, area);
}
