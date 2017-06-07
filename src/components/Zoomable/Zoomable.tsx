import * as React from 'react';
import * as cx from 'classnames';
import round from 'lodash/round';
import {
  applyToPoint,
  inverse,
  scale,
  toCSS,
  transform,
  translate,
} from 'transformation-matrix';


import * as classNames from './Zoomable.css';

type Coords = { x: number, y: number };

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The x-axis value of the zoom origin, which corresponds to the mouse pointer
   * location relative to the wrapped element without the zoom applied
   */
  originX: number;
  /** The y-axis value of the zoom origin, which corresponds to the mouse pointer
   * location relative to the wrapped element without the zoom applied
   */
  originY: number;
  /** The zoom level */
  scaleFactor: number;
  /** Maximum zoom level */
  maxScale?: number;
  /** Minimum zoom level */
  minScale?: number;
  /**
   * The zoom change handler for controlled components.
   * It should update the other props in order to reflect the zoom change.
   */
  onZoom(scale: number, translateX: number, translateY: number): void;
}

interface State {
  matrix: Matrix;
}

function getMatrixFromProps({ originX, originY, scaleFactor }: Props): Matrix {
  return transform(
    translate(originX, originY),
    scale(scaleFactor, scaleFactor),
    translate(-originX, -originY),
  );
}

/** A Zoomable component wraps any DOM element and provides mouse-based
 * zooming capabilities. Support for touch gestures is planned soon.
 */
export class Zoomable extends React.PureComponent<Props, State> {
  static defaultProps: Partial<Props> = {
    scaleFactor: 1,
    originX: 0,
    originY: 0,
    minScale: 1,
    maxScale: 5,
  };

  state: State = {
    matrix: getMatrixFromProps(this.props),
  };

  viewer: HTMLDivElement;
  setViewer = (node: HTMLDivElement) => this.viewer = node;

  applyZoom(f: number, e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const { x: mouseX, y: mouseY }: Coords = this.getMouseCoords(e);
    const { scaleFactor, minScale, maxScale } = this.props;
    const newScaleFactor = round(scaleFactor * f, 1);
    // tslint:disable-next-line no-non-null-assertion
    if (newScaleFactor > minScale! && newScaleFactor < maxScale!) {
      this.props.onZoom(newScaleFactor, mouseX, mouseY);
      e.preventDefault();
    }
  }

  applyPan() {
    // @TODO
  }

  /**
   * Gets the original mouse position relative to the element
   * as if the coordinates were on the element without the transformations
   * applied to it.
   */
  getMouseCoords(ev: React.MouseEvent<HTMLDivElement>) {
    const { top, left } = this.viewer.getBoundingClientRect();
    // The mouse coordinates do not include the translation of the element,
    // so we reapply the translation manually.
    const matrix = this.state.matrix;
    const x = ev.clientX - left;
    const y = ev.clientY - top;
    // Now we have the mouse position applied correctly to the transormation
    // matrix, we inverse the matrix to get the original point on the element
    // with no transformations applied.
    const inverseMatrix = inverse(matrix);

    return applyToPoint(inverseMatrix, { x, y });
  }

  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.applyZoom(e.button === 2 ? 0.9 :  1.1, e);
  }

  handleMouseWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const delta = e.deltaY;
    this.applyZoom(delta > 0 ? 0.9 : 1.1, e);
  }

  handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      matrix: getMatrixFromProps(newProps),
    });
  }

  render() {
    const {
      style, className,
      children, scaleFactor,
      onZoom, originX, originY,
      ...rest,
    } = this.props;

    return (
      <div
        ref={this.setViewer}
        className={cx(classNames.viewer, className)}
      >
        <div
          {...rest}
          onContextMenu={this.handleContextMenu}
          onMouseDown={this.handleMouseDown}
          onWheel={this.handleMouseWheel}
          role="presentation"
          className={classNames.zoomable}
          style={{
            ...style,
            transform: toCSS(this.state.matrix),
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default Zoomable;
