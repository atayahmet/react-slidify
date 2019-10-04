import * as React from "react";
import initialProps from './initialProps';
import "./style.css";
import { hasAxis, isStyleEqualWith } from './utils/assertions';
import { ON_START, ON_STOP, PERCENT } from './utils/contants';
import { get, getClientPos, getInitialPos, getLeftButtonState, getPosCalc } from './utils/getters';
import { onClickHandler, onMoveHandler, onStartStopHandler } from './utils/handlers';
import { ISlidifyOptions, IPoint, IInternalPointProps } from './utils/interfaces';
import Point from './Point';

class Slidify extends React.Component<ISlidifyOptions, any> {
  protected wrapperEl: React.RefObject<HTMLDivElement> = React.createRef();
  private currentIndex: number|null = null;
  private startHandlerTimeout: any;
  private updateTimeout: any;
  private clickClientY: number = 0;
  private clickClientX: number = 0;

  constructor(props: ISlidifyOptions) {
    super(props);
    this.state = {
      showPoints: true
    };
  }

  public componentDidUpdate(prevProps: ISlidifyOptions) {
    const coords = [] as any[];
    const points = this.setRequiredProps(this.points);
    const { container } = this.state;
    let index = 0;

    while (Boolean(points[index])) {
      const point = points[index] as IInternalPointProps;

      if (! Boolean(point)) {
        return;
      }

      let coord = {};
      const clientX = getPosCalc(container.width, (point.width || 0), (point.x || 0), this.prop('unit'));
      const clientY = getPosCalc(container.height, (point.height || 0), (point.y || 0), this.prop('unit'));

      const pointsLength = Object.keys(this.points).length;
      const prevPointsLength = Object.keys(prevProps.points).length;

      if (pointsLength === prevPointsLength) {
        const isStyleEqual = isStyleEqualWith(prevProps.points[index], point);

        if (this.hasX && prevProps.points[index].x !== point.x) {
          coord = {...coord, clientX};
        }

        if (this.hasY && prevProps.points[index].y !== point.y) {
          coord = {...coord, clientY};
        }

        if (!isStyleEqual) {
          coord = {...coord, style: point.style, clientX, clientY};
        }
      } else {
        coord = {...coord, style: point.style, clientX, clientY};
      }

      if (Object.keys(coord).length > 0) {
        coords.push(coord);
      }

      index++;
    }

    if (coords.length > 0) {
      this.update([...coords], points);
    }
  }

  public componentDidMount() {
    const el = this.wrapperEl.current as HTMLDivElement;
    const domRect = el.getBoundingClientRect();
    const clientWidth = get("clientWidth", el, 0);
    const clientHeight = get("clientHeight", el, 0);
    const points = this.setTranslates(this.state.points);

    this.setState({
      options: this.getProps(),
      container: {
        height: clientHeight,
        width: clientWidth,
      },
      screen: {
        left: domRect.left,
        top: domRect.top
      },
      points,
      render: true
    });
  }

  public componentWillMount() {
    const axis = this.prop('axis').split("");
    const hasX = hasAxis("x", axis);
    const hasY = hasAxis("y", axis);
    const points = this.setRequiredProps(this.points);

    this.setState({
      hasX,
      hasY,
      isFinish: false,
      isMovable: false,
      screen: {
        left: 0,
        top: 0
      },
      setFinish: (isFinish: boolean, axis: string) => this.setState({ isFinish, finishedAxis: axis }),
      setIsMovable: (isMovable: boolean) => this.setState({ isMovable }),
      setTranslateX: (...args: any[]) => this.setTranslate.call(this, ...args, 'translateX'),
      setTranslateY: (...args: any[]) => this.setTranslate.call(this, ...args, 'translateY'),
      container: {
        height: 0,
        width: 0,
      },
      points,
    });
  }

  public shouldComponentUpdate(nextProps: ISlidifyOptions, nextState: Record<string, any>) {
    return nextState.render !== false;
  }

  public render() {
    return (
      <div className="rs-container" style={{height: this.prop("height"), width: this.prop('width'), display: 'inline-block', position: 'relative'}}>
        <div
          ref={this.wrapperEl}
          className="rs-cursor-wrapper"
          onTouchMoveCapture={this.moveHandler}
          onMouseMoveCapture={this.moveHandler}
          onMouseDownCapture={this.clickHandler}
          onTouchStartCapture={this.clickHandler}
          style={{
            height: '100%',
            width: `100%`
          }}
        >
        {this.populate([...this.state.points])}
        </div>
      </div>
    );
  }

  private get unit() {
    return this.prop('unit') === PERCENT ? '%' : 'px';
  }

  private get hasX(): boolean {
    return this.state.hasX;
  }

  private get hasY(): boolean {
    return this.state.hasY;
  }

  private get clientWidth(): number {
    const el = this.wrapperEl.current as HTMLDivElement;
    return get("clientWidth", el, 0);
  }

  private get clientHeight(): number {
    const el = this.wrapperEl.current as HTMLDivElement;
    return get("clientHeight", el, 0);
  }

  private get points(): IPoint[] {
    return this.props.points || [];
  }

  private populate(points: IInternalPointProps[]): JSX.Element[] {
    const elements = [] as any[];
    let index = 0;
    while (Boolean(points[index])) {
      if (!isNaN(Number(points[index].translateX)) && !isNaN(Number(points[index].translateY))) {
        elements.push(
          <Point
            key={index}
            index={index}
            unit={this.unit}
            moveEndHandler={this.moveEndHandler}
            moveStartHandler={this.moveStartHandler}
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
        translateX: this.hasX ? getInitialPos(this.clientWidth, point.width, point.x || 0) : 0,
        translateY: this.hasY ? getInitialPos(this.clientHeight, point.height, point.y || 0) : 0
      };
    });
  }

  private setTranslate = (...args: any[]) => {
    const value = args.shift();
    const index = args.shift();
    const axis = args.shift();
    const { points } = this.state;
    points[index][axis] = value;
    this.setState({ render: true, showPoints: true, points: [ ...points ]});
  };

  private setRequiredProps(points: IPoint[] = []): IInternalPointProps[] {
    return points.map((point: IPoint) => {
      return {
        ...point,
        ref: React.createRef(),
        xHalf: point.width / 2,
        yHalf: point.height / 2,
      };
    });
  }

  private update(coords: Record<string, any>[] = [], points: IInternalPointProps[]) {
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => {
      this.setState({render: false, points: [...points]});
      let index = 0;
      while (coords.length > 0) {
        setTimeout(onClickHandler({
            ...this.state,
            ...coords.shift(),
            render: true,
            points: [...points],
            isMovable: true,
            index
          }),
        2);
        index++;
      }
    }, 5);
  }

  private prop<K extends keyof ISlidifyOptions>(name: K) {
    return this.getProps()[name];
  }

  private getProps() {
    return { ...initialProps, ...this.props };
  }

  private clickHandler = (e: any) => {
    if (this.prop('multiple') === true) {
      return;
    }

    const { clientX, clientY } = getClientPos(e);

    onMoveHandler({
      ...this.state,
      clientX: (clientX - this.state.screen.left),
      clientY: (clientY - this.state.screen.top),
      isMovable: true
    })();
  }

  private moveHandler = (e: any) => {
    e.stopPropagation();

    const { clientX, clientY } = getClientPos(e);
    const buttonState = getLeftButtonState(e);

    setTimeout(() => {
      onMoveHandler({
        ...this.state,
        buttonState,
        index: this.currentIndex,
        clientX: (clientX - this.state.screen.left) - this.clickClientX,
        clientY: (clientY - this.state.screen.top) - this.clickClientY,
      })();
    }, 2);
  };

  private moveStartHandler = (e: any, index: number) => {
    e.stopPropagation();
    this.clickClientY = e.clientY - ({...e}).target.getClientRects()[0].top;
    this.clickClientX = e.clientX - ({...e}).target.getClientRects()[0].left;
    this.currentIndex = index;
    clearTimeout(this.startHandlerTimeout);
    this.startHandlerTimeout = setTimeout(() => {
      onStartStopHandler({...this.state, index}, true, ON_START)(e);
    }, 1);
  }

  private moveEndHandler = (e: any, index: number) => {
    this.currentIndex = null;
    onStartStopHandler({...this.state, index}, false, ON_STOP)(e);
  };
}

export default Slidify;
