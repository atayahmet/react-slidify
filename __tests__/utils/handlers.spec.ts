import { pointMovablityHandler, pointClickHandler, pointMoveHandler, actionMove } from './../../src/utils/handlers';
import { IEventPoint } from '../../src/utils/interfaces';
import { ON_START, ON_STOP } from '../../src/utils/contants';
import { JSDOM } from 'jsdom';

describe('Handlers tests', () => {
  let point: IEventPoint;
  let dom: JSDOM;

  beforeEach(() => {
    point = {
      x: 60,
      y: 60,
      axis: 'x',
      width: 40,
      height: 40,
      percent: {
        x: 30,
        y: 60,
      },
      translateX: 60,
      translateY: 60,
      xHalf: 20,
      yHalf: 20,
    } as IEventPoint;

    dom = new JSDOM(`<!DOCTYPE html>`);
    dom.window.requestAnimationFrame = (fn: CallableFunction) => fn();
  });
  it('pointMovablityHandler', () => {
    const setIsMovable = jest.fn();
    const eventTrigger = jest.fn();
    const container = { width: 200, height: 100 };

    pointMovablityHandler(
      {
        setIsMovable,
        container,
        points: [point],
        index: 0,
        eventTrigger,
      },
      true,
      ON_START,
    )();

    expect(setIsMovable).toBeCalledWith(true);
    expect(eventTrigger).toBeCalledWith(ON_START, [
      {
        axis: 'x',
        height: 40,
        percent: { x: 30, y: 60 },
        translateX: 60,
        translateY: 60,
        width: 40,
        x: 60,
        xHalf: 20,
        y: 60,
        yHalf: 20,
      },
      0,
      {},
    ]);

    pointMovablityHandler(
      {
        setIsMovable,
        container,
        points: [point],
        index: 0,
        eventTrigger,
      },
      false,
      ON_STOP,
    )();

    expect(setIsMovable).toBeCalledWith(false);
    expect(eventTrigger).toBeCalledWith(ON_STOP, [
      {
        axis: 'x',
        height: 40,
        percent: { x: 30, y: 60 },
        translateX: 60,
        translateY: 60,
        width: 40,
        x: 60,
        xHalf: 20,
        y: 60,
        yHalf: 20,
      },
      0,
      {},
    ]);
  });

  it('pointClickHandler', () => {
    const setTranslates = jest.fn();
    pointClickHandler({ setTranslates, clientX: 20, clientY: 60, hasX: true, hasY: true, index: 0, win: dom.window })();
    expect(setTranslates).toBeCalledTimes(1);
    expect(setTranslates).toBeCalledWith({ translateX: 20, translateY: 60 }, 0);

    pointClickHandler({ setTranslates, clientX: 20, hasX: true, hasY: false, index: 0, win: dom.window })();
    expect(setTranslates).toBeCalledTimes(2);
    expect(setTranslates).toBeCalledWith({ translateX: 20 }, 0);

    pointClickHandler({ setTranslates, clientY: 30, hasX: false, hasY: true, index: 0, win: dom.window })();
    expect(setTranslates).toBeCalledWith({ translateY: 30 }, 0);
  });

  it('pointMoveHandler: Non action', () => {
    const setTranslates = jest.fn();
    pointMoveHandler({
      buttonState: 0,
      isMovable: false,
      testMobile: jest.fn(() => false),
      setTranslates,
    });

    expect(setTranslates).toBeCalledTimes(0);
  });

  it('pointMoveHandler: Action', () => {
    const setTranslates = jest.fn();
    const eventTrigger = jest.fn();

    pointMoveHandler({
      eventTrigger,
      setTranslates,
      buttonState: 1,
      isMovable: true,
      container: { width: 200, height: 100 },
      options: {},
      index: 0,
      points: [point],
      clientX: 52.5,
      clientY: 31,
      hasX: true,
      hasY: true,
      win: dom.window,
    })();

    expect(setTranslates).toBeCalledTimes(1);
    expect(setTranslates).toBeCalledWith({ translateX: 52.5, translateY: 31 }, 0);
    expect(eventTrigger).toBeCalledTimes(1);
    expect(eventTrigger).toBeCalledWith('onSlide', [
      {
        axis: 'x',
        height: 40,
        percent: { x: (60 / (200 - 40)) * 100, y: (60 / (100 - 40)) * 100 },
        translateX: 60,
        translateY: 60,
        width: 40,
        x: 52.5,
        xHalf: 20,
        y: 31,
        yHalf: 20,
      },
      0,
      {},
    ]);
  });

  it('actionMove', () => {
    expect(actionMove({
        clientDistance: -10, 
        distance: 70, 
        pointSize: 46, 
        area: 200, 
        half: 23
    })).toEqual(0);

    expect(actionMove({
        clientDistance: 10, 
        distance: 70, 
        pointSize: 46, 
        area: 200, 
        half: 23
    })).toEqual(10);

    expect(actionMove({
        clientDistance: 10, 
        distance: 270, 
        pointSize: 46, 
        area: 200, 
        half: 23
    })).toEqual(200);

    expect(actionMove({
        clientDistance: 10, 
        distance: 270, 
        pointSize: 46, 
        area: 180, 
        half: 23
    })).toEqual(180);
  });
});
