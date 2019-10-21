import * as React from "react";
import initialProps from "./initialProps";
import { IInternalPointProps } from "./utils/interfaces";

export default function Point({
  unit,
  point,
  index,
  moveStartHandler,
  moveEndHandler
}: {
  unit: string;
  point: IInternalPointProps;
  index: number;
  moveStartHandler: CallableFunction;
  moveEndHandler: CallableFunction;
}) {
  return (
    <div
      ref={point.ref}
      onTouchStart={e => moveStartHandler(e, index)}
      onTouchEnd={e => moveEndHandler(e, index)}
      onMouseUp={e => moveEndHandler(e, index)}
      onMouseDown={e => moveStartHandler(e, index)}
      style={{
        backgroundColor: initialProps.defaultBackgroundColorOfPoint,
        height: point.height,
        transform: `translate3d(${(point.translateX || 0) +
          0}${unit}, ${(point.translateY || 0) + 0}${unit}, 0)`,
        width: point.width,
        ...(point.style || {}),
        position: "absolute"
      }}
    >
      {point.children || null}
    </div>
  );
}
