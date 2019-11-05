import React from 'react';
import TestRenderer from 'react-test-renderer';

import Slidify from './../src/Slidify';
import { JSDOM } from 'jsdom';

describe('Slidify integration test', () => {
  let dom: JSDOM;

  // set the common props which will be use on all test case.
  const commonProps = {
    width: 300,
    height: 200,
    axis: 'xy'
  } as any;

  // set the common point props which will be use on all test case.
  const commonPointProps = {
    width: 5,
    height: 5,
    xHalf: 2.5,
    yHalf: 2.5,
  };

  const commonMouseEventParams = {
    stopPropagation: () => null,
    buttons: 1,
    bubbles: true,
    cancelable: true,
  };

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'http://test/'
    });
  });

  it('should move the point to destination where from second half area to the first.', (done) => {
    // STEP: 1
    // Initial render.
    const slidify = TestRenderer.create(
      <Slidify
        {...commonProps}
        points={[{
          ...commonPointProps,
          x: 294,
          y: 180,
          translateX: 294,
          translateY: 180,
        }]}
      />
    );

    const instance = (slidify.getInstance() as any);
    instance.currentIndex = 0;
    instance.containerEl.current = {
      clientWidth: 300,
      clientHeight: 200,
      getBoundingClientRect: () => ({ left: 0, top: 0 })
    };

    expect(instance.state.points[0]).toEqual({
      x: 294,
      y: 180,
      ...commonPointProps,
      ref: { current: null },
      translateX: 294,
      translateY: 180,
    });

    expect(instance.state.points[0].translateX).toEqual(expect.any(Number));
    expect(instance.state.points[0].translateY).toEqual(expect.any(Number));

    // STEP: 2
    // move mouse to next position by update the props.
    // Positions: x: 120, y: 95
    slidify.update(<Slidify
      {...commonProps}
      points={[{
        ...commonPointProps,
        x: 120,
        y: 95,
        translateX: 120,
        translateY: 95,
      }]}
    />);

    instance.setState({ isMovable: true }, () => {
      const e = new dom.window.MouseEvent("mousemove", {
        ...commonMouseEventParams,
        bubbles: true,
        cancelable: true,
        clientX: 120,
        clientY: 95
      });
      instance.moveHandler(e);

      setTimeout(() => {
        expect(instance.state.points[0]).toEqual(expect.objectContaining({
          translateX: 120,
          translateY: 95
        }));

        // STEP: 3
        // move mouse to next position by update the props.
        // Positions: x: 0, y: 0
        slidify.update(<Slidify
          {...commonProps}
          points={[{
            ...commonPointProps,
            x: 0,
            y: 0,
            translateX: 0,
            translateY: 0,
          }]}
        />);

        // create new mouse event for new positions.
        const e = new dom.window.MouseEvent("mousemove", {
          ...commonMouseEventParams,
          bubbles: true,
          cancelable: true,
          clientX: 0,
          clientY: 0
        });
        instance.moveHandler(e);
      }, 100);

      setTimeout(() => {
        // check new positions.
        expect(instance.state.points[0]).toEqual(expect.objectContaining({
          ...commonPointProps,
          x: 0,
          y: 0,
        }));

        // STEP: 4 (final)
        // move mouse to next position by update the props.
        // Positions: x: 0, y: 0
        slidify.update(<Slidify
          {...commonProps}
          points={[{
            ...commonPointProps,
            x: -11,
            y: -11,
            translateX: -11,
            translateY: -11,
          }]}
        />);

        // create new mouse event for new positions.
        const e = new dom.window.MouseEvent("mousemove", {
          ...commonMouseEventParams,
          bubbles: true,
          cancelable: true,
          clientX: -11,
          clientY: -11
        });
        instance.moveHandler(e);
      }, 120);

      setTimeout(() => {
        // check new positions.
        expect(instance.state.points[0]).toEqual(expect.objectContaining({
          ...commonPointProps,
          translateX: 0,
          translateY: 0,
        }));
        done();
      }, 150);
    });
  });

  it('should move the point to destination where from frist half area to the second.', (done) => {
    // STEP: 1
    // Initial render.
    const slidify = TestRenderer.create(
      <Slidify
        {...commonProps}
        points={[{
          ...commonPointProps,
          x: 1,
          y: 2,
          translateX: 1,
          translateY: 2,
        }]}
      />
    );

    const event = new dom.window.MouseEvent("mousemove", {
      ...commonMouseEventParams,
      bubbles: true,
      cancelable: true,
      clientX: 110,
      clientY: 20
    });

    const instance = (slidify.getInstance() as any);

    expect(instance.state.points[0]).toEqual({
      x: 1,
      y: 2,
      ...commonPointProps,
      ref: { current: null },
      translateX: 1,
      translateY: 2,
    });

    expect(instance.state.points[0].translateX).toEqual(expect.any(Number));
    expect(instance.state.points[0].translateY).toEqual(expect.any(Number));

    // STEP: 2
    // move mouse to next position by update the props.
    // Positions: x: 110, y: 20
    slidify.update(<Slidify
      {...commonProps}
      points={[{
        ...commonPointProps,
        x: 110,
        y: 20,
        translateX: 110,
        translateY: 20,
      }]}
    />);

    instance.currentIndex = 0;
    instance.containerEl.current = {
      clientWidth: 300,
      clientHeight: 200,
      getBoundingClientRect: () => ({ left: 0, top: 0 })
    };

    instance.setState({ isMovable: true }, () => {
      instance.moveHandler(event);

      setTimeout(() => {
        expect(instance.state.points[0]).toEqual(expect.objectContaining({
          translateX: 110,
          translateY: 20
        }));

        // STEP: 3
        // move mouse to next position by update the props.
        // Positions: x: 300, y: 83
        slidify.update(<Slidify
          {...commonProps}
          points={[{
            ...commonPointProps,
            x: 300,
            y: 83,
            translateX: 300,
            translateY: 83,
          }]}
        />);

        // create new mouse event for new positions.
        const event = new dom.window.MouseEvent("mousemove", {
          ...commonMouseEventParams,
          bubbles: true,
          cancelable: true,
          clientX: 300,
          clientY: 83
        });
        instance.moveHandler(event);
      }, 130);

      setTimeout(() => {
        // check new positions.
        expect(instance.state.points[0]).toEqual(expect.objectContaining({
          ...commonPointProps,
          x: 300,
          y: 83,
        }));

        // STEP: 4 (final)
        // move mouse to next position by update the props.
        // Positions: x: 310, y: 83
        slidify.update(<Slidify
          {...commonProps}
          points={[{
            ...commonPointProps,
            x: 310,
            y: 83,
            translateX: 310,
            translateY: 83,
          }]}
        />);

        // create new mouse event for new positions.
        const event = new dom.window.MouseEvent("mousemove", {
          ...commonMouseEventParams,
          bubbles: true,
          cancelable: true,
          clientX: 310,
          clientY: 83
        });
        instance.moveHandler(event);
      }, 170);

      setTimeout(() => {
        // check new positions.
        expect(instance.state.points[0]).toEqual(expect.objectContaining({
          ...commonPointProps,
          translateX: 295,
          translateY: 83,
        }));
        done();
      }, 200);
    });
  });

  it('if multiple points true, should move the point to clicked position', (done) => {
    // STEP: 1
    // Initial render.
    const slidify = TestRenderer.create(
      <Slidify
        {...commonProps}
        points={[{
          ...commonPointProps,
          x: 1,
          y: 2,
          translateX: 1,
          translateY: 2,
        }]}
      />
    );

    const instance = slidify.getInstance() as any;
    instance.currentIndex = 0;
    instance.containerEl.current = {
      clientWidth: 300,
      clientHeight: 200,
      getBoundingClientRect: () => ({ left: 0, top: 0 })
    };

    instance.setState({ isMovable: true }, () => {
      const event = new dom.window.MouseEvent('click', {
        ...commonMouseEventParams,
        clientX: 120,
        clientY: 95
      } as any);

      // STEP: 2
      // move point to next position by update the props.
      // Positions: x: 110, y: 20
      instance.clickHandler(event);

      setTimeout(() => {
        expect(instance.state.points[0]).toEqual(expect.objectContaining({
          ...commonPointProps,
          translateX: 120,
          translateY: 95,
        }));

        const event = new dom.window.MouseEvent('click', {
          ...commonMouseEventParams,
          clientX: 131,
          clientY: 101
        } as any);

        instance.clickHandler(event);
      }, 50);

      setTimeout(() => {
        expect(instance.state.points[0]).toEqual(expect.objectContaining({
          ...commonPointProps,
          translateX: 131,
          translateY: 101,
        }));

        // STEP: 3 (final)
        // The enable multiple points to prevent the click move.
        // Positions: x: 300, y: 83
        slidify.update(<Slidify
          {...commonProps}
          multiple={true}
        />);

        const event = new dom.window.MouseEvent('click', {
          ...commonMouseEventParams,
          clientX: 141,
          clientY: 111
        } as any);

        instance.clickHandler(event);
      }, 100);

      setTimeout(() => {
        expect(instance.state.points[0]).toEqual(expect.objectContaining({
          ...commonPointProps,
          translateX: 131,
          translateY: 101,
        }));
        done();
      }, 150);
    });
  });

  it('Re-render component when container was resize.', (done) => {
    // STEP: 1
    // Initial render.
    const slidify = TestRenderer.create(
      <Slidify
        {...commonProps}
        points={[{
          ...commonPointProps,
          x: 1,
          y: 2,
          translateX: 1,
          translateY: 2,
        }]}
      />
    );

    const instance = slidify.getInstance() as any;

    expect(instance.state.container).toEqual(expect.objectContaining({ width: 300, height: 200 }));

    // STEP: 2 (final)
    // UPdate container size to 100x50.
    slidify.update(<Slidify
      {...commonProps}
      width={100}
      height={50}
    />);


    instance.resizeHandler();

    setTimeout(() => {
      expect(instance.state.container).toEqual(expect.objectContaining({ width: 100, height: 50 }));
      done();
    }, 100);
  });

  it('Activate point movability', (done) => {
    // STEP: 1
    // Initial render.
    const slidify = TestRenderer.create(
      <Slidify
        {...commonProps}
        points={[{
          ...commonPointProps,
          x: 1,
          y: 2,
          translateX: 1,
          translateY: 2,
        }]}
      />
    );

    const instance = slidify.getInstance() as any;
    instance.currentIndex = 0;
    instance.containerEl.current = {
      clientWidth: 300,
      clientHeight: 200,
      getBoundingClientRect: () => ({ left: 0, top: 0 })
    };

    const event = new dom.window.MouseEvent('click', {
      ...commonMouseEventParams,
      clientX: 120,
      clientY: 95
    } as any);

    // STEP: 2
    // Should not move the point.
    instance.clickHandler(event);

    setTimeout(() => {
      expect(instance.state.points[0]).toEqual(expect.objectContaining({
        ...commonPointProps,
        x: 1,
        y: 2,
      }));

      const event = {
        ...commonMouseEventParams,
        clientX: 120,
        clientY: 95,
        target: {
          getClientRects: () => [{ left: 0, top: 0 }]
        }
      } as any;

      // STEP: 3
      // Activate point movability.
      instance.movabilityStartHandler(event, 0);
    }, 100);

    setTimeout(() => {
      expect(instance.state.isMovable).toBeTruthy();

      const event = new dom.window.MouseEvent('click', {
        ...commonMouseEventParams,
        clientX: 23,
        clientY: 51
      } as any);

      // STEP: 4
      // move mouse to next position by update the props.
      // Positions: translateX: 23, translateY: 51
      instance.clickHandler(event);
    }, 150);

    setTimeout(() => {
      expect(instance.state.points[0]).toEqual(expect.objectContaining({
        ...commonPointProps,
        translateX: 23,
        translateY: 51,
      }));

      const event = {
        ...commonMouseEventParams,
      } as any;

      // STEP: 5 (final)
      // Deactivate point movability.
      instance.movabilityStopHandler(event, 0);
    }, 200);

    setTimeout(() => {
      expect(instance.state.isMovable).toBeFalsy();
      expect(instance.currentIndex).toBeNull();
      done();
    }, 250)
  });

  it('Test axis activity: x/y', (done) => {
    // STEP: 1
    // Initial render.
    const slidify = TestRenderer.create(
      <Slidify
        {...commonProps}
        axis="xy"
        points={[{
          ...commonPointProps,
          x: 1,
          y: 2,
          translateX: 1,
          translateY: 2,
        }]}
      />
    );

    const instance = slidify.getInstance() as any;
    instance.currentIndex = 0;
    instance.containerEl.current = {
      clientWidth: 300,
      clientHeight: 200,
      getBoundingClientRect: () => ({ left: 0, top: 0 })
    };

    expect(instance.props.axis).toEqual('xy');

    const event = {
      ...commonMouseEventParams,
      clientX: 120,
      clientY: 95,
      target: {
        getClientRects: () => [{ left: 0, top: 0 }],
      }
    } as any;

    // STEP: 2
    // Activate point movability.
    instance.movabilityStartHandler(event, 0);

    setTimeout(() => {
      instance.clickHandler(event);
    }, 100);

    setTimeout(() => {
      expect(instance.state.points[0]).toEqual(expect.objectContaining({
        translateX: 120,
        translateY: 95,
      }));

      // STEP: 3 (final)
      // Activate x axis only.
      slidify.update(<Slidify
        {...commonProps}
        axis="x"
      />);

      const event = {
        ...commonMouseEventParams,
        clientX: 221,
        clientY: 14,
        target: {
          getClientRects: () => [{ left: 0, top: 0 }],
        }
      } as any;
      
      instance.clickHandler(event);
    }, 150);

    setTimeout(() => {
      expect(instance.state.points[0]).toEqual(expect.objectContaining({
        translateX: 221,
        translateY: 95,
      }));
      expect(instance.props.axis).toEqual('x');
      done();
    }, 200);
  });

  it('Test `movable` option', (done) => {
    // STEP: 1
    // Initial render.
    const slidify = TestRenderer.create(
      <Slidify
        {...commonProps}
        points={[{
          ...commonPointProps,
          x: 1,
          y: 2,
          translateX: 1,
          translateY: 2,
        }]}
      />
    );

    const instance = slidify.getInstance() as any;
    instance.currentIndex = 0;
    instance.containerEl.current = {
      clientWidth: 300,
      clientHeight: 200,
      getBoundingClientRect: () => ({ left: 0, top: 0 })
    };

    expect(instance.state.options.movable).toBeTruthy();

    const event = {
      ...commonMouseEventParams,
      clientX: 120,
      clientY: 95,
      target: {
        getClientRects: () => [{ left: 0, top: 0 }],
      }
    } as any;

    // STEP: 2
    // Start point movability.
    instance.movabilityStartHandler(event, 0);

    setTimeout(() => {
      instance.clickHandler(event);
    }, 100);

    setTimeout(() => {
      expect(instance.state.points[0]).toEqual(expect.objectContaining({
        translateX: 120,
        translateY: 95,
      }));

       // STEP: 3 (final)
      // Close movability of points.
      slidify.update(<Slidify
        {...commonProps}
        movable={false}
      />);

      const event = {
        ...commonMouseEventParams,
        clientX: 221,
        clientY: 14,
        target: {
          getClientRects: () => [{ left: 0, top: 0 }],
        }
      } as any;
      
      instance.clickHandler(event);
    }, 150);

    setTimeout(() => {
      expect(instance.props.movable).toBeFalsy();
      expect(instance.state.points[0]).toEqual(expect.objectContaining({
        translateX: 120,
        translateY: 95,
      }));
      done();
    }, 200);
  });
});