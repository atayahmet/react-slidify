import * as React from "react";
import initialProps from './initialProps'
import "./style.css";
import { hasAxis } from './utils/assertions';
import { get, getClientPos, getLeftButtonState, getPosCalcAsPx, getTranslates } from "./utils/getters";
import { onClickHandler, onMoveHandler, onStartStopHandler } from './utils/handlers';
import { IRange } from "./utils/interfaces";

class RangeInput extends React.Component<IRange, any> {
  protected cursorEl: React.RefObject<HTMLDivElement> = React.createRef();
  protected containerEl: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: IRange) {
    super(props);
  }

  public componentDidUpdate(prevProps: IRange) {
    let coords = {};

    if (this.hasX && prevProps.x !== this.props.x) {
      if (this.props.unit === 'percent') {
        const clientX = getPosCalcAsPx(this.state.sizes.container.width, this.xHalf, this.props.x);
        coords = {...coords, clientX};
      }
    }
    if (this.hasY && prevProps.y !== this.props.y) {
      if (this.props.unit === 'percent') {
        const clientY = getPosCalcAsPx(this.state.sizes.container.height, this.yHalf, this.props.y);
        coords = {...coords, clientY};
      }
    }
    if (Object.keys(coords).length > 0) {
      this.update(coords);
    }
  }

  public componentDidMount() {
    const el = this.containerEl.current as HTMLDivElement;
    const cursor = this.cursorEl.current as HTMLDivElement;
    const offsetWidth = get("offsetWidth", cursor, 0);
    const offsetHeight = get("offsetHeight", cursor, 0);
    this.setState({
      options: this.getProps(),
      sizes: {
        container: {
          height: get("clientHeight", el, 0),
          width: get("clientWidth", el, 0),
        },
        cursor: {
          height: offsetHeight,
          width: offsetWidth,
        }
      },
      ...this.getTranslatesWrapper(this.cursorEl.current) || {},
      translateX: this.state.hasX ? -(offsetWidth / 2) + this.prop('x') : 0,
      translateY: this.state.hasY ? -(offsetHeight / 2) + this.prop('y') : 0
    })
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
      <div className="rs-container" style={{border: 'solid 1px #ccc', height: this.prop("height"), width: this.prop('width'), position: 'relative'}}>
        <div
          ref={this.containerEl}
          className="rs-cursor-wrapper"
          onTouchMove={this.moveHandler}
          onMouseMove={this.moveHandler}
          onMouseDown={this.clickHandler}
          onTouchStart={this.clickHandler}
          style={{
            height: `calc(100% - ${this.state.sizes.cursor.height}px)`,
            margin: `${this.yHalf}px ${this.xHalf}px`,
            width: `calc(100% - ${this.state.sizes.cursor.width}px)`,
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

  private prop<K extends keyof IRange>(name: K) {
    return this.getProps()[name];
  }

  private getProps() {
    return { ...initialProps, ...this.props };
  }

  private clickHandler = (e: any) => {
    if (this.prop('multiple') === true) {
      return;
    }

    this.moveStartHandler(e);
    const { clientX, clientY } = getClientPos(e);
    onMoveHandler({...this.state, clientX, clientY, isMovable: true})();
  }

  private moveHandler = (e: any) => {
    const { clientX, clientY } = getClientPos(e);
    const buttonState = getLeftButtonState(e);
    onMoveHandler({...this.state, buttonState, clientX, clientY})();
  };

  private moveEndHandler = (e: any) => onStartStopHandler({...this.state}, false, 'onStop')(e);
  private moveStartHandler = (e: any) => onStartStopHandler({...this.state}, true, 'onStart')(e);
  private getTranslatesWrapper = (el: HTMLDivElement | null) => el ? getTranslates(el) : {};
}

export default RangeInput;
