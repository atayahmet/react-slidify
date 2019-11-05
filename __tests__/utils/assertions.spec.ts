import { isBorderStartArea, isStyleEqualWith } from './../../src/utils/assertions';

describe('Assertions tests', () => {
  it('isBorderStartArea', () => {
    expect(isBorderStartArea(200, 89, 20)).toEqual(true);
    expect(isBorderStartArea(200, 0, 20)).toEqual(true);
    expect(isBorderStartArea(200, 91, 20)).toEqual(false);
    expect(isBorderStartArea(200, 200, 20)).toEqual(false);
  });

  it('isStyleEqualWith', () => {
    const object1 = { style: { width: 99 } };
    const object2 = { style: { width: 100 } };
    expect(isStyleEqualWith(object1, object2)).toBeFalsy();
    expect(
      isStyleEqualWith(
        { style: { ...object1.style, width: 100, height: 10 } },
        { style: { ...object2.style, height: 10 } },
      ),
    ).toBeTruthy();
  });
});
