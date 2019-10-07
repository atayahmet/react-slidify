 [![npm version](https://badge.fury.io/js/%40atayahmet%2Freact-slidify.svg)](https://badge.fury.io/js/%40atayahmet%2Freact-slidify)

# React Slidify

React Slidify is a component that transmits position coordinates with callbacks at each step of an object that you can advance by dragging within a field. The component can be use as volume control, music player timeline etc.

## Installation

Use the package manager [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com) to install `react-slidify`.

```bash
npm i @atayahmet/react-slidify --save
```

```bash
yarn add @atayahmet/react-slidify
```

## Usage

```jsx
import Slidify from '@atayahmet/react-slidify';

<Slidify
  width="250px"
  height="250px"
  points={[
    {
      x={10}
      y={300}
      width={20}
      height={20}
    }
  ]}
  axis="xy"
  onSlide={callback}
/> 
```

## Props 

### ISlidifyOptions

| name     |                    type                  | default| description          |
|----------|:-----------------------------------------|-------:|:---------------------|
| width    | string                                   | 100%   | Width of the field.  |
| height   | string                                   | 100%   | Height of the field. |
| points   | [IPoint[]](#ipoint)                      | []     |                      |
| multiple | boolean                                  | false  | Multiple points.     |
| axis     | string                                   | xy     | Available axes.      |
| onStart  | [onStartHandlerArgs](#onStartHandlerArgs)| -      | First move event.    |
| onStop   | [onStopHandlerArgs](#onStopHandlerArgs)  | -      | Last move event.     |
| onSlide  | [onSlideHandlerArgs](#onSlideHandlerArgs)| -      | Active slide event.  |
| onReach  | [onReachHandlerArgs](#onReachHandlerArgs)| -      |Reach point event.    |

### IPoint

| name     | type                | default     | description          |
|----------|:--------------------|-------------|:---------------------|
| x        | number              | -           | Left position `px` value. |
| y        | number              | -           | Top position `px` value.  |
| width    | number              | innerWidth  | Width of the point in `px`. |
| height   | number              | innerHeight | Height of the point in `px`.|
| className| string `(optional)` | -           | Custom class name.   |
| style    | [React.CSSProperties](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e434515761b36830c3e58a970abf5186f005adac/types/react/index.d.ts#L794) `(optional)` | -            | Css properties. |

## Events

| name     | arguments                                   | description         |
|----------|:--------------------------------------------|---------------------|
| onStart  | [onStartHandlerArgs](#onStartHandlerArgs)   | First move event.   | 
| onStop   | [onStopHandlerArgs](#onStopHandlerArgs)     | Last move event.    |
| onSlide  | [onSlideHandlerArgs](#onSlideHandlerArgs)   | Active slide event. |
| onReach  | [onReachHandlerArgs](#onReachHandlerArgs)   | Reach point event.  |

## Types

### onStartHandlerArgs 
`(xPercent: number, yPercent: number, point: IPoint) => any`

### onStopHandlerArgs 
`(xPercent: number, yPercent: number, point: IPoint) => any`

### onSlideHandlerArgs
`(xPercent: number, yPercent: number, point: IPoint) => any`

### onReachHandlerArgs
`(xPercent: number, yPercent: number, axis: string, point: IPoint, at: ReachPoint) => any`

### ReachPoint
`'start-point' | 'end-point'`

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)