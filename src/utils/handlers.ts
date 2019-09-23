import { hasCollisionInBegin, hasCollisionInEnd, isBorderStartArea, isMobile } from './assertions';
import { get, getEndBorderValue, getPosCalcAsPercent, getPosition, getStartBorderValue } from './getters';
import trigger from './trigger';

export const onStartStopHandler = (
  params = {} as Record<string, any>,
  value: boolean,
  eventName: string,
): any => () => {
  const { setIsMovable, translateX, translateY, sizes } = params;
  const { width = 0, height = 0 } = sizes.cursor;
  const xHalf = width / 2;
  const yHalf = height / 2;
  const xPos = Math.floor(translateX + xHalf);
  const yPos = Math.floor(translateY + yHalf);

  const xPercent = getPosCalcAsPercent(sizes.container.width, xHalf, xPos);
  const yPercent = getPosCalcAsPercent(sizes.container.height, yHalf, yPos);

  trigger(eventName, [xPercent, yPercent, null, { ...params.options }]);
  setIsMovable(value);
};

export const onClickHandler = (params: Record<string, any> = {}) => {
  return () => {
    const { clientX = 0, clientY = 0, sizes, hasX, hasY } = params;
    const { cursor } = sizes;
    const xHalf = cursor.width / 2;
    const yHalf = cursor.height / 2;

    const setTranslateX = get('setTranslateX', params);
    const setTranslateY = get('setTranslateY', params);

    if (hasX) {
      const xStart = getPosition(clientX, cursor.width);
      setTranslateX(xStart + xHalf);
    }
    if (hasY) {
      const yStart = getPosition(clientY, cursor.height);
      setTranslateY(yStart + yHalf);
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
      translateX = 0,
      translateY = 0,
      setTranslateX,
      setTranslateY,
      clientX,
      clientY,
      sizes,
      hasX,
      hasY,
    } = params;

    const { cursor, container } = sizes;
    const xHalf = cursor.width / 2;
    const yHalf = cursor.height / 2;
    const xPercent = getPosCalcAsPercent(sizes.container.width, xHalf, translateX + xHalf);
    const yPercent = getPosCalcAsPercent(sizes.container.height, yHalf, translateY + yHalf);

    // X position half left area.
    if (hasX) {
      actionMoveHandler({
        ...params,
        area: container.width,
        axis: 'x',
        clientDistance: clientX,
        distance: translateX,
        half: xHalf,
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
    isFinish,
    options,
    setter,
    area,
    axis,
    half,
  } = params;

  const cursorSize = half * 2;
  const hasIn = isBorderStartArea(area, distance, half);
  const startArea = getStartBorderValue(clientDistance - half, cursorSize);
  const endArea = getEndBorderValue(clientDistance, cursorSize, distance, area);
  const value = hasIn ? startArea + half : endArea - half;
  const eventDeps = [xPercent, yPercent, axis, options];

  setter(value + 0.001);

  if (hasCollisionInBegin(value, half, distance) && !isFinish) {
    setFinish(true);
    trigger('onBegin', eventDeps);
  } else if (hasCollisionInEnd(value, area, half, distance) && !isFinish) {
    setFinish(true);
    trigger('onFinish', eventDeps);
  } else if (value > 0 && distance > 0.001 && isFinish) {
    setFinish(false);
  }

  trigger('onSlide', eventDeps);
}
