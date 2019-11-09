import get from '@util-funcs/object-get';
import elementResizeEvent from "element-resize-event";
import isNumber from "is-number";
import * as React from "react";
import initialProps from "./initialProps";
import Point from "./Point";
import { isStyleEqualWith } from "./utils/assertions";
import { ON_START, ON_STOP, PERCENT } from "./utils/contants";
import {
  getButtonState,
  getClientPos,
  getClientRects,
  getInitialPos,
  getPosCalc
} from "./utils/getters";
import {
  pointClickHandler,
  pointMovablityHandler,
  pointMoveHandler,
} from "./utils/handlers";
import {
  IInternalPointProps,
  IPoint,
  ISlidifyOptions
} from "./utils/interfaces";

class Slidify extends React.Component<ISlidifyOptions, any> {
  public state: Readonly<any> = {};
  protected containerEl: React.RefObject<HTMLDivElement> = React.createRef();
  private currentIndex: number | null = null;
  private startHandlerTimeout: any;
  private updateTimeout: any;
  private resizeTimeout: any;
  private clickClientY: number = 0;
  private clickClientX: number = 0;

  constructor(props: ISlidifyOptions) {
    super(props);
    const points = this.setTranslates(props.points);
    this.state = { points };
  }

  public componentDidUpdate(prevProps: ISlidifyOptions) {
    const points = this.setRequiredProps(this.points);

    if (prevProps.axis !== this.props.axis) {
      // this update state that without render.
      this.updateAxes();
    }

    // update positions of the all points.
    const coords = this.updatePoints(points, prevProps) || [];

    // if any updated point, render.
    if (coords.length > 0) {
      this.update([...coords], points);
    }
  }

  public componentDidMount() {
    this.setState(
      {
        options: this.getProps(),
        ...this.getSizes(),
        render: true
      },
      () => {
        if (this.containerEl.current) {
          this.resizeHandler();
          elementResizeEvent(this.containerEl.current, this.resizeHandler);
        }
      }
    );
  }

  public UNSAFE_componentWillMount() {
    const points = this.setRequiredProps(this.points);

    this.setState({
      container: {
        height: 0,
        width: 0
      },
      hasX: this.prop('axis').includes('x'),
      hasY: this.prop('axis').includes('y'),
      isFinish: false,
      isMovable: false,
      points,
      render: false,
      setFinish: (isFinish: boolean, finishedAxis: string) =>
        this.setState({ isFinish, finishedAxis }),
      setIsMovable: (isMovable: boolean) => this.setState({ isMovable }),
      setTranslates: (...args: any[]) => this.setTrans.call(this, ...args)
    });
  }

  public shouldComponentUpdate(
    nextProps: ISlidifyOptions,
    nextState: Record<string, any>
  ) {
    return nextState.render !== false;
  }

  public render() {
    return (
      <div
        ref={this.containerEl}
        className="rs-container"
        style={{
          height: this.prop("height"),
          position: "relative",
          width: this.prop("width"),
        }}
      >
        <div
          className="rs-cursor-wrapper"
          onTouchMoveCapture={this.moveHandler}
          onMouseMoveCapture={this.moveHandler}
          onMouseDownCapture={this.clickHandler}
          onTouchStartCapture={this.clickHandler}
          style={{
            height: "100%",
            width: `100%`
          }}
        >
          {this.populate([...this.getPointsViaSwitcher()])}
        </div>
      </div>
    );
  }

  private get unit() {
    return this.prop("unit") === PERCENT ? "%" : "px";
  }

  private get hasX(): boolean {
    return this.state.hasX;
  }

  private get hasY(): boolean {
    return this.state.hasY;
  }

  private get rect(): ClientRect {
    const el = this.containerEl.current as HTMLDivElement;
    return el.getBoundingClientRect();
  }

  private get clientWidth(): number {
    const el = this.containerEl.current as HTMLDivElement;
    return get("clientWidth", el, 0);
  }

  private get clientHeight(): number {
    const el = this.containerEl.current as HTMLDivElement;
    return get("clientHeight", el, 0);
  }

  private get points(): IPoint[] {
    return this.props.points || [];
  }

  private populate(points: IInternalPointProps[]): JSX.Element[] {
    const elements = [] as any[];
    let index = 0;
    while (Boolean(points[index])) {
      if (
        isNumber(points[index].translateX) &&
        isNumber(points[index].translateY)
      ) {
        elements.push(
          <Point
            key={index}
            index={index}
            unit={this.unit}
            moveEndHandler={this.movabilityStopHandler}
            moveStartHandler={this.movabilityStartHandler}
            point={points[index] as IInternalPointProps}
          />
        );
      }
      index++;
    }
    return elements;
  }

  private setTranslates(points: IPoint[] = []): IInternalPointProps[] {
    return points.map((point: IPoint) => {
      return {
        ...point,
        translateX: this.hasX
          ? getInitialPos(this.clientWidth, point.width, point.x)
          : 0,
        translateY: this.hasY
          ? getInitialPos(this.clientHeight, point.height, point.y)
          : 0
      };
    });
  }

  private setTrans = (...args: any[]) => {
    const value = args.shift();
    const index = args.shift();
    const { points } = this.state;
    points[index] = { ...points[index], ...value };
    this.setState({ render: true, points: [...points] });
  };

  private setRequiredProps(points: IPoint[] = []): IInternalPointProps[] {
    return points.map((point: IPoint) => {
      return {
        ...point,
        ref: React.createRef(),
        xHalf: point.width / 2,
        yHalf: point.height / 2
      };
    });
  }

  private update(
    coords: Array<Record<string, any>> = [],
    points: IInternalPointProps[]
  ) {
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => {
      this.setState({ render: false, points: [...points] });
      let index = 0;
      while (coords.length > 0) {
        setTimeout(
          pointClickHandler({
            ...this.state,
            ...coords.shift(),
            index,
            isMovable: true,
            points: [...points],
            render: true
          }),
          2
        );
        index++;
      }
    }, 5);
  }

  private updateAxes(props: ISlidifyOptions = this.props, render: boolean = false) {
    const { axis = '' } = props;
    this.setState({ hasX: axis.includes('x'), hasY: axis.includes('y'), render });
  }

  private updatePoints(points: IPoint[], prevProps: ISlidifyOptions) {
    const coords = [] as any[];
    const { container } = this.state;
    let index = 0;

    while (Boolean(points[index])) {
      const point = points[index] as IInternalPointProps;

      if (!Boolean(point)) {
        return;
      }

      let coord = {};

      const clientX = getPosCalc(
        container.width,
        point.width,
        point.x,
        this.prop("unit")
      );

      const clientY = getPosCalc(
        container.height,
        point.height,
        point.y,
        this.prop("unit")
      );

      const pointsLength = Object.keys(this.points).length;
      const prevPointsLength = Object.keys(prevProps.points).length;

      if (pointsLength === prevPointsLength) {
        const isStyleEqual = isStyleEqualWith(prevProps.points[index], point);

        if (this.hasX && prevProps.points[index].x !== point.x) {
          coord = { ...coord, clientX };
        }

        if (this.hasY && prevProps.points[index].y !== point.y) {
          coord = { ...coord, clientY };
        }

        if (!isStyleEqual) {
          coord = { ...coord, style: point.style, clientX, clientY };
        }
      } else {
        coord = { ...coord, style: point.style, clientX, clientY };
      }

      if (Object.keys(coord).length > 0) {
        coords.push(coord);
      }

      index++;
    }

    return coords;
  }

  private prop<K extends keyof ISlidifyOptions>(name: K) {
    return this.getProps()[name];
  }

  private getProps() {
    return { ...initialProps, ...this.props };
  }

  private getSizes() {
    const el = this.containerEl.current as HTMLDivElement;
    const clientWidth = get("clientWidth", el, this.prop('width'));
    const clientHeight = get("clientHeight", el, this.prop('height'));

    return {
      container: {
        height: clientHeight,
        width: clientWidth
      }
    };
  }

  private getPointsViaSwitcher() {
    return this.props.multiple === true
      ? this.state.points
      : [this.state.points[0]];
  }

  private resizeHandler = () => {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.setState({
        ...this.state,
        ...this.getSizes(),
        points: this.setTranslates(this.state.points)
      });
    }, 10);
  };

  private clickHandler = (e: any) => {
    if (this.prop("multiple") === true) {
      return;
    }

    const { clientX, clientY } = getClientPos(e);
    const { left, top } = this.rect;

    setTimeout(() => {
      const { xHalf = 0, yHalf = 0 } = this
        .state.isMovable
        ? {}
        : this.state.points[0];

      pointMoveHandler({
        ...this.state,
        clientX: clientX - left - xHalf,
        clientY: clientY - top - yHalf,
        index: 0,
        isMovable: this.prop("movable")
      })();
    }, 2);
  };

  private moveHandler = (e: any) => {
    e.stopPropagation();

    const buttonState = getButtonState(e);
    const { clientX, clientY } = getClientPos(e);
    const { left, top } = this.rect;

    setTimeout(() => {
      pointMoveHandler({
        ...this.state,
        buttonState,
        clientX: clientX - left - this.clickClientX,
        clientY: clientY - top - this.clickClientY,
        index: this.currentIndex
      })();
    }, 2);
  };

  private movabilityStartHandler = (e: any, index: number) => {
    e.stopPropagation();
    const { top = 0, left = 0 } = getClientRects(e);
    this.clickClientY = e.clientY - top;
    this.clickClientX = e.clientX - left;
    this.currentIndex = index;
    clearTimeout(this.startHandlerTimeout);
    this.startHandlerTimeout = setTimeout(
      () =>
        pointMovablityHandler(
          { ...this.state, index },
          this.prop("movable"),
          ON_START
        )(e),
      1
    );
  };

  private movabilityStopHandler = (e: any, index: number) => {
    this.currentIndex = null;
    pointMovablityHandler({ ...this.state, index }, false, ON_STOP)(e);
  };
}

export default Slidify;
