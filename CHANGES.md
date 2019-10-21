# Release Notes:

## Changes for v1.0.0-alpa.3:

- The style.css will move to lib directory after build process.
- If container border is none, the container slide down.
- Add stopPropagation() to onSlide event.
- Initial position (x, y) overflow.
- Component name will change to as Slidify.

## Changes for v1.0.0-alpa.4:

- The interfaces exported via index.ts .
- Cursor size options added to prop list.
- Added ability to add class and style.
- Collision callback name changed to as onReach and merged to onBegin and onFinish.

## Changes for v1.0.0-alpa.5:

- Documentation has been improvement a little more.
- Fixed onSlide event that missing parameter passed.
- Array destruct changed to as take last item.
- All event name that added hard coded has been changed to as constant.

## Changes for v1.0.0-alpha.8:

- Added version badge.
- Added multiple point support.
- Added element resize detection.

## Changes for v1.0.0-alpha.11:

- Added scroll position to moveHandler and clickHandler.
- Some type declaration conflicts fixed.

## Changes for v1.0.0-alpha.12:

// ------------

## Changes for v1.0.0-alpha.13:

- [BUG FIX] Container `display` changed from `inline-block` to `block`.
- Added point index number to all triggered events.
- The `defaultBackgroundColorOfPoint`  added to initial props.
- `yarn.lock` file added to .gitignore.

## Changes for v1.0.0-alpha.14:
- The `movable` option has been added to props.
- [BUG FIX] If the remaining value less than 1, does not show the decimal value.
- [BUG FIX] X and Y positions not updated when pass point data by triggered event.
- All events output data has been collected in an object that named as [IEventPoint](https://github.com/atayahmet/react-slidify#IEventPoint) .
- Pass jsx element to points in named as children.

## Changes for v1.0.0-alpha.15:
- [BUG FIX] The arguments types of event handler has been fixed.
- Added gif example.