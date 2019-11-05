import React from 'react';
import TestRenderer from 'react-test-renderer';

import Point from '../src/Point';
import { IInternalPointProps } from '../src/utils/interfaces';

const TestPoint = (props: any) => {
  const moveEndHandler = jest.fn();
  const moveStartHandler = jest.fn();
  return (<Point
    unit="px"
    index={0}
    point={{} as IInternalPointProps}
    moveEndHandler={moveEndHandler}
    moveStartHandler={moveStartHandler}
    {...props}
  />
  )
};

describe('Point component test', () => {
  it('should be set 0 which width, height and translates as default values.', () => {
    const point = TestRenderer.create(<TestPoint />).toJSON() as Record<string, any>;
    const { width, height, transform } = point.props.style;
    expect(width).toEqual(0);
    expect(height).toEqual(0);
    expect(transform).toEqual('translate3d(0px, 0px, 0)');
  });

  it('should be absolute position of type on every point', () => {
    const point = TestRenderer.create(<TestPoint style={{ position: 'relative' }} />).toJSON() as Record<string, any>;
    expect(point.props.style.position).toEqual('absolute');
  });

  it('should be pass child element to point', () => {
    const point = TestRenderer.create(<TestPoint point={{ children: <span>Hello World!</span> }} />).toJSON() as Record<string, any>;
    expect(point.children.length).toEqual(1);
    expect(point.children[0].type).toEqual('span');
    expect(point.children[0].children.length).toEqual(1);
    expect(point.children[0].children[0]).toEqual('Hello World!');
  });
});
