import { hasCollisionInBegin, hasCollisionInEnd, isBorderStartArea } from './assertions';
import { END_POINT, ON_REACH, ON_SLIDE, START_POINT } from './contants';
import { get, getEndBorderValue, getPosCalcAsPercent, getStartBorderValue } from './getters';
import trigger from './trigger';
import { isMobile } from 'is-mobile';

export const onStartStopHandler = (
  params = {} as Record<string, any>,
  value: boolean,
  eventName: string,
): any => () => {
  const { setIsMovable, translateX, translateY, container, points, index } = params;
  const { xHalf, yHalf } = points[index];
  const xPos = Math.floor(translateX + xHalf);
  const yPos = Math.floor(translateY + yHalf);

  const xPercent = getPosCalcAsPercent(container.width, xHalf, xPos);
  const yPercent = getPosCalcAsPercent(container.height, yHalf, yPos);

  trigger(eventName, [xPercent, yPercent, null, { ...params.options }]);
  setIsMovable(value);
};

export const onClickHandler = (params: Record<string, any> = {}) => {
  return () => {
    const { clientX = null, clientY = null, hasX, hasY, index } = params;
    const setTranslateX = get('setTranslateX', params);
    const setTranslateY = get('setTranslateY', params);

    if (hasX && Boolean(clientX)) {
      setTranslateX(clientX, index);
    }
    if (hasY && Boolean(clientY)) {
      setTranslateY(clientY, index);
    }
  };
};

export const onMoveHandler = (params: Record<string, any> = {}) => {
  return () => {
    const { buttonState = 1, isMovable } = params;

    if (!isMovable || (buttonState !== 1 && !isMobile())) {
      return;
    }

    const {
      setTranslateX,
      setTranslateY,
      container,
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

    // X position half left area.
    if (hasX) {
      actionMoveHandler({
        ...params,
        area: container.width,
        axis: 'x',
        clientDistance: clientX,
        distance: translateX,
        half: xHalf,
        pointSize: width,
        setter: setTranslateX,
        xPercent,
        yPercent,
      });
    }

    // Y position half top area.
    if (hasY) {
      actionMoveHandler({
        ...params,
        area: container.height,
        axis: 'y',
        clientDistance: clientY,
        distance: translateY,
        half: yHalf,
        pointSize: height,
        setter: setTranslateY,
        xPercent,
        yPercent,
      });
    }
  };
};

export function actionMoveHandler(params: Record<string, any>) {
  const {
    clientDistance,
    setFinish,
    xPercent,
    yPercent,
    distance,
    pointSize,
    finishedAxis,
    isFinish,
    options,
    setter,
    index,
    area,
    axis,
    half,
  } = params;

  const hasIn = isBorderStartArea(area, distance, half);
  const startArea = getStartBorderValue(clientDistance, pointSize);
  const endArea = getEndBorderValue(clientDistance, pointSize, distance, area);
  const value = hasIn ? startArea : endArea;
  const eventDeps = [xPercent, yPercent, axis];

  setter(value, index);

  if (hasCollisionInBegin(value, half, distance) && hasIn && !isFinish && finishedAxis !== axis) {
    setFinish(true, axis);
    trigger(ON_REACH, [...eventDeps, START_POINT, options]);
  } else if (hasCollisionInEnd(value, area, half, distance) && !hasIn && !isFinish && finishedAxis !== axis) {
    setFinish(true, axis);
    trigger(ON_REACH, [...eventDeps, END_POINT, options]);
  } else if (value > 1 && clientDistance && isFinish && finishedAxis === axis) {
    setFinish(false, null);
  }

  trigger(ON_SLIDE, [...eventDeps, options]);
}
