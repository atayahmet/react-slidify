import { collision, firstArea, secondArea } from './../../src/utils/collisions';
import { AREA_FIRST, AREA_SECOND } from '../../src/utils/contants';
import { IEventPoint } from '../../src/utils/interfaces';

describe('Collisions tests', () => {
  let point: IEventPoint;
  const common = {
    half: 20,
    area: 250,
    options: {},
    distance: 210,
    isFinish: false,
    clientDistance: 100,
    finishedAxis: 'y',
  };

  beforeAll(() => {
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
    } as IEventPoint;
  });

  it('border', () => {
    expect(collision.border(AREA_FIRST, 0)).toBeTruthy();
    expect(collision.border(AREA_FIRST, 1)).toBeFalsy();
    expect(collision.border(AREA_SECOND, 100, 120, 10, 100)).toBeFalsy();
    expect(collision.border(AREA_SECOND, 101, 120, 10, 100)).toBeTruthy();
    expect(collision.border(AREA_SECOND, 99, 120, 10, 100)).toBeFalsy();
  });

  it('borderEventTrigger: Check collisions in x axis and on `start-point` that with 0', () => {
    const setFinish = jest.fn();
    const eventTrigger = jest.fn();
    const currentPoint = { ...point };

    collision.trigger.border({
      value: 0,
      ...common,
      setFinish,
      eventTrigger,
      axis: currentPoint.axis,
      eventDeps: [currentPoint, 0],
    });

    expect(setFinish).toBeCalledWith(true, 'x');
    expect(setFinish).toBeCalledTimes(1);
  });

  it('borderEventTrigger: Check collisions in x axis and on `start-point` that with 20', () => {
    const setFinish = jest.fn();
    const eventTrigger = jest.fn();
    const currentPoint = { ...point };
    const params = {
      value: 20,
      ...common,
      setFinish,
      eventTrigger,
      axis: currentPoint.axis,
      eventDeps: [currentPoint, 0],
    };

    collision.trigger.border(params);
    expect(eventTrigger).toBeCalledTimes(0);

    collision.trigger.border({ ...params, value: 0 });
    expect(eventTrigger).toBeCalledTimes(1);
    expect(eventTrigger).toBeCalledWith('onReach', [
      { axis: 'x', height: 40, percent: { x: 30, y: 60 }, width: 40, x: 60, y: 60 },
      0,
      'start-point',
      {},
    ]);
  });

  it('borderEventTrigger: Check collisions with x axis on `end-point`', () => {
    const setFinish = jest.fn();
    const eventTrigger = jest.fn();
    const currentPoint = { ...point };

    const params = {
      value: 211,
      ...common,
      setFinish,
      eventTrigger,
      axis: currentPoint.axis,
      eventDeps: [currentPoint, 2],
    };

    collision.trigger.border(params);

    expect(setFinish).toBeCalledTimes(1);
    expect(setFinish).toBeCalledWith(true, 'x');

    expect(eventTrigger).toBeCalledTimes(1);
    expect(eventTrigger).toBeCalledWith('onReach', [
      { axis: 'x', height: 40, percent: { x: 30, y: 60 }, width: 40, x: 60, y: 60 },
      2,
      'end-point',
      {},
    ]);
  });

  it('borderEventTrigger: Set to false that last collide axis for new collision', () => {
    const setFinish = jest.fn();
    const eventTrigger = jest.fn();
    const currentPoint = { ...point };
    const params = {
      value: 2,
      ...common,
      isFinish: true,
      finishedAxis: 'x',
      axis: 'x',
      setFinish,
      eventTrigger,
      eventDeps: [currentPoint, 2],
    };

    collision.trigger.border(params);
    expect(setFinish).toBeCalledTimes(1);
    expect(setFinish).toBeCalledWith(false, null);
  });

  it('firstArea', () => {
    expect(firstArea(0)).toBeTruthy();
  });

  it('secondArea: Should be return true boolean (collision realized)', () => {
    expect(secondArea(1201, 1250, 50, 1200)).toBeTruthy();
  });

  it('secondArea: Should be return false boolean (collision not realized)', () => {
    expect(secondArea(1200, 1250, 50, 1200)).toBeFalsy();
  });
});
