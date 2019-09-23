import * as React from "react";
import initialProps from './initialProps';
import "./style.css";
import { hasAxis } from './utils/assertions';
import { get, getClientPos, getInitialPos, getLeftButtonState, getPosCalcAsPx, getTranslates } from './utils/getters';
import { onClickHandler, onMoveHandler, onStartStopHandler } from './utils/handlers';
import { ISlidifyOptions } from "./utils/interfaces";

class Slidify extends React.Component<ISlidifyOptions, any> {
  protected cursorEl: React.RefObject<HTMLDivElement> = React.createRef();
  protected wrapperEl: React.RefObject<HTMLDivElement> = React.createRef();
  private startHandlerTimeout: any;

  constructor(props: ISlidifyOptions) {
    super(props);
  }

  public componentDidUpdate(prevProps: ISlidifyOptions) {
    let coords = {};

    if (this.hasX && prevProps.x !== this.props.x) {
      if (this.props.unit === 'percent') {
        const clientX = getPosCalcAsPx(this.state.sizes.container.width, this.xHalf, this.props.x || 0);
        coords = {...coords, clientX};
      }
    }
    if (this.hasY && prevProps.y !== this.props.y) {
      if (this.props.unit === 'percent') {
        const clientY = getPosCalcAsPx(this.state.sizes.container.height, this.yHalf, this.props.y || 0);
        coords = {...coords, clientY};
      }
    }
    if (Object.keys(coords).length > 0) {
      this.update(coords);
    }
  }

  public componentDidMount() {
    const el = this.wrapperEl.current as HTMLDivElement;
    const domRect = el.getBoundingClientRect();
    const cursor = this.cursorEl.current as HTMLDivElement;

    const offsetWidth = get("offsetWidth", cursor, 0);
    const offsetHeight = get("offsetHeight", cursor, 0);

    const clientWidth = get("clientWidth", el, 0);
    const clientHeight = get("clientHeight", el, 0);

    this.setState({
      options: this.getProps(),
      sizes: {
        container: {
          height: clientHeight,
          width: clientWidth,
        },
        cursor: {
          height: offsetHeight,
          width: offsetWidth,
        }
      },
      ...this.getTranslatesWrapper(this.cursorEl.current) || {},
      screen: {
        left: domRect.left,
        top: domRect.top
      },
      translateX: this.state.hasX ? getInitialPos(clientWidth, offsetWidth, this.prop('x') || 0) : 0,
      translateY: this.state.hasY ? getInitialPos(clientHeight, offsetHeight, this.prop('y') || 0) : 0,
    });
  }

  public componentWillMount() {
    const axis = this.prop('axis').split("");
    const hasX = hasAxis("x", axis);
    const hasY = hasAxis("y", axis);

    this.setState({
      hasX,
      hasY,
      isFinish: false,
      isMovable: false,
      screen: {
        left: 0,
        top: 0
      },
      setFinish: (isFinish: boolean ) => this.setState({ isFinish }),
      setIsMovable: (isMovable: boolean) => this.setState({ isMovable }),
      setTranslateX: (translateX: number ) => this.setState({ translateX }),
      setTranslateY: (translateY: number ) => this.setState({ translateY }),
      sizes: {
        container: {
          height: 0,
          width: 0,
        },
        cursor: {
          height: 0,
          width: 0,
        }
      },
      translateX: 0,
      translateY: 0,
    });
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
            height: `calc(100% - ${this.yHalf}px`,
            margin: `${this.yHalf}px ${this.xHalf}px`,
            width: `calc(100% - ${this.xHalf}px`
          }}
        >
          <div
            ref={this.cursorEl}
            className="rs-cursor"
            onTouchStart={this.moveStartHandler}
            onTouchEnd={this.moveEndHandler}
            onMouseUp={this.moveEndHandler}
            onMouseDown={this.moveStartHandler}
            style={{
              transform: `translate3d(${this.state.translateX + 0}px, ${this.state.translateY + 0}px, 0)`
            }}
          />
        </div>
      </div>
    );
  }

  private get yHalf() {
    return this.hasY ? this.state.sizes.cursor.height / 2 : 0
  }

  private get xHalf() {
    return this.hasX ? this.state.sizes.cursor.width / 2 : 0
  }

  private get hasX(): boolean {
    return this.state.hasX;
  }

  private get hasY(): boolean {
    return this.state.hasY;
  }

  private update(params: Record<string, any> = {}) {
    setTimeout(onClickHandler({...this.state, ...params, isMovable: true}), 5);
  }

  private prop<K extends keyof ISlidifyOptions>(name: K) {
    return this.getProps()[name];
  }

  private getProps() {
    return { ...initialProps, ...this.props };
  }

  private clickHandler = (e: any) => {
    e.stopPropagation();

    if (this.prop('multiple') === true) {
      return;
    }

    this.moveStartHandler(e);

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

    onMoveHandler({
      ...this.state,
      buttonState,
      clientX: (clientX - this.state.screen.left),
      clientY: (clientY - this.state.screen.top),
    })();
  };

  private moveStartHandler = (e: any) => {
    e.stopPropagation();
    clearTimeout(this.startHandlerTimeout);
    this.startHandlerTimeout = setTimeout(() => {
      onStartStopHandler({...this.state}, true, 'onStart')(e);
    }, 50);
  }

  private moveEndHandler = (e: any) => onStartStopHandler({...this.state}, false, 'onStop')(e);
  private getTranslatesWrapper = (el: HTMLDivElement | null) => el ? getTranslates(el) : {};
}

export default Slidify;
