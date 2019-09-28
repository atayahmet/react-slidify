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
  x={0}
  y={0}
  axis="xy"
  onSlide={callback}
/> 
```

## Props 

### ISlidifyOptions

| name     |                    type                  | default| description |
|----------|:-----------------------------------------|-------:|:------------|
| width    | string                                   | 100%   | Width of the field. |
| height   | string                                   | 100%   | Height of the field. |
| x        | number                                   | 0      | Initial position of x axis.|
| y        | number                                   | 0      | Initial position of y axis.|
|cursor    | [ICursor](#icursor)                      | {}     | |
| axis     | string                                   | xy     | Available axes.
| onStart  | [EventHandlerArgs](#EventHandlerArgs)    | -      | The event that triggered when slide start. |
| onStop   | [EventHandlerArgs](#EventHandlerArgs)    | -      | The event that triggered when slide stop. |
| onSlide  | [EventHandlerArgs](#EventHandlerArgs)    | -      | The event that triggered when sliding.
| onReach  | [onReachHandlerArgs](#onReachHandlerArgs)| -      ||

### ICursor

| name     |             type                 | default     | description         |
|----------|:---------------------------------|-------------|:--------------------|
| width    | number `(optional)`              | innerWidth   | Width of the cursor. |
| height   | number `(optional)`              | innerHeight  | Height of the cursor. |
| className| string `(optional)`              | -            | Custom class name. |
| className| [React.CSSProperties](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e434515761b36830c3e58a970abf5186f005adac/types/react/index.d.ts#L794) `(optional)` | -            | Custom class name. |

## Events

### onStart(x, y, axis, options)
### onStop(x, y, axis, options)
### onSlide(x, y, axis, options)
### onReach(x, y, axis, point, options)

| name     | type    |  description |
|----------|:------- |:-------------|
| x        | number  | The value of x axis based percent. |
| y        | number  | The value of y axis based percent. |
| axis     | string  | Current axis. |
| point     | string  | The key of current point. `start-point`, `end-point` |
| options  | [ISlidifyOptions](#ISlidifyOptions) | Props. |

## Types

### EventHandlerArgs 
`(xPercent: number, yPercent: number, axis: string | null) => any`

### onReachHandlerArgs
`(xPercent: number, yPercent: number, axis: string | null, point: Point) => any`

### Point
`'start-point' | 'end-point'`


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)