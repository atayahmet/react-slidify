import { JSDOM } from 'jsdom';
import {
  getTranslates,
  getStartBorderValue,
  getEndBorderValue,
  getButtonState,
  getPosCalc,
  getPosCalcAsPx,
  getPosCalcAsPercent,
  getClientPos,
  getClientRects,
  getInitialPos,
} from './../../src/utils/getters';
import { PERCENT, PIXEL } from '../../src/utils/contants';

describe('Getters tests', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><div style="transform: translate3d(10px, 20px)" id="container">Hello world</div>`);
  });

  it('getTranslates', () => {
    const el = dom.window.document.querySelector('div#container') as HTMLDivElement;
    expect(el).toBeDefined();
    expect(getTranslates(el)).toEqual({ translateX: 10, translateY: 20 });
    el.style.transform = 'translate3d(34px, 113px)';
    expect(getTranslates(el)).toEqual({ translateX: 34, translateY: 113 });
    expect(getTranslates(null as any)).toBeUndefined();
  });

  it('getStartBorderValue', () => {
    expect(getStartBorderValue(-1)).toEqual(0);
    expect(getStartBorderValue(138)).toEqual(138);
  });

  it('getEndBorderValue', () => {
    expect(getEndBorderValue(400, 40, 400, 390)).toEqual(350);
  });

  it('getButtonState', () => {
    expect(getButtonState({ which: 1 } as any)).toEqual(1);
    expect(getButtonState({ buttons: 0 } as any)).toEqual(0);
  });

  it('getPosCalc: px', () => {
    expect(getPosCalc(200, 50, 15, PIXEL)).toEqual(15);
    expect(getPosCalc(200, 50, 150, PIXEL)).toEqual(150);
    expect(getPosCalc(200, 50, 151, PIXEL)).toEqual(150);
  });

  it('getPosCalc: percent', () => {
    expect(getPosCalc(200, 50, 23, PERCENT)).toEqual(23);
    expect(getPosCalc(200, 50, 230, PERCENT)).toEqual(100);
  });

  it('getPosCalcAsPx', () => {
    expect(getPosCalcAsPx(200, 50, 15)).toEqual(15);
    expect(getPosCalcAsPx(200, 50, 150)).toEqual(150);
    expect(getPosCalcAsPx(200, 50, 151)).toEqual(150);
  });

  it('getPosCalcAsPercent', () => {
    expect(getPosCalcAsPercent(200, 50, 23)).toEqual(23);
    expect(getPosCalcAsPercent(200, 50, 230)).toEqual(100);
  });

  it('getClientPos', () => {
    expect(getClientPos({ changedTouches: ['value'] })).toEqual('value');
    expect(getClientPos({})).toEqual({});
  });

  it('getClientRects', () => {
    expect(getClientRects({ target: { getClientRects: () => [] } })).toEqual({});
    expect(getClientRects({ target: { getClientRects: () => [{ value: 1 }] } })).toEqual({ value: 1 });
  });

  it('getInitialPos', () => {
    expect(getInitialPos(200, 40, 20)).toEqual(20);
    expect(getInitialPos(200, 40, -1)).toEqual(0);
    expect(getInitialPos(200, 40, 140)).toEqual(140);
    expect(getInitialPos(200, 40, 210)).toEqual(160);
  });
});
