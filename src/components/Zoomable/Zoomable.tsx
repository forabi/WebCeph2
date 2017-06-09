import * as React from 'react';
import * as cx from 'classnames';
import * as bindClassnames from 'classnames/bind';
import round from 'lodash/round';
import clamp from 'lodash/clamp';
import { applyToPoint } from 'transformation-matrix/applyToPoint';
import { inverse } from 'transformation-matrix/inverse';
import { scale } from 'transformation-matrix/scale';
import { toCSS } from 'transformation-matrix/toString';
import { transform } from 'transformation-matrix/transform';
import { translate } from 'transformation-matrix/translate';

import * as classNames from './Zoomable.module.css';

const cxm = bindClassnames.bind(classNames);

type Coords = { x: number; y: number };

export interface Props extends React.HTMLAttributes<Element> {
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
  onZoom(
    scale: number,
    translateX: number,
    translateY: number,
  ): void;
}

interface State {
  matrix: Matrix;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

function getMatrixFromProps({ originX, originY, scaleFactor }: Props): Matrix {
  return transform(
    translate(originX, originY),
    scale(scaleFactor, scaleFactor),
    translate(-originX, -originY),
  );
}

function getCanZoomIn({ maxScale = Infinity, scaleFactor }: Props): boolean {
  return scaleFactor < maxScale;
}

function getCanZoomOut({ minScale = Infinity, scaleFactor }: Props): boolean {
  return scaleFactor > minScale;
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
    canZoomIn: getCanZoomIn(this.props),
    canZoomOut: getCanZoomOut(this.props),
  };

  viewer: Element;
  setViewer = (node: Element) => (this.viewer = node);

  applyZoom(f: number, e: React.MouseEvent<Element>) {
    const { x: mouseX, y: mouseY }: Coords = this.getMouseCoords(e);
    if ((this.state.canZoomIn && f > 1) || (this.state.canZoomOut && f < 1)) {
      const newScaleFactor = round(this.props.scaleFactor * f, 1);
      this.props.onZoom(newScaleFactor, mouseX, mouseY);
      e.preventDefault();
    }
  }

  /**
   * Gets the original mouse position relative to the element
   * as if the coordinates were on the element without the transformations
   * applied to it.
   */
  getMouseCoords(ev: React.MouseEvent<Element>) {
    const { top, left, width, height } = this.viewer.getBoundingClientRect();
    const x = clamp(Math.round(ev.clientX - left), 0, width);
    const y = clamp(Math.round(ev.clientY - top), 0, height);
    // Now we have the mouse position applied correctly to the transormation
    // matrix, we inverse the matrix to get the original point on the element
    // with no transformations applied.
    const matrix = this.state.matrix;
    const inverseMatrix = inverse(matrix);

    return applyToPoint(inverseMatrix, { x, y });
  }

  handleMouseDown = (e: React.MouseEvent<Element>) => {
    this.applyZoom(e.button === 2 ? 0.9 : 1.1, e);
  };

  handleMouseWheel = (e: React.WheelEvent<Element>) => {
    const delta = e.deltaY;
    this.applyZoom(delta > 0 ? 0.9 : 1.1, e);
  };

  handleContextMenu = (e: React.MouseEvent<Element>) => {
    e.preventDefault();
  };

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      matrix: getMatrixFromProps(newProps),
      canZoomIn: getCanZoomIn(newProps),
      canZoomOut: getCanZoomOut(newProps),
    });
  }

  render() {
    const {
      style,
      className,
      children,
      scaleFactor,
      onZoom,
      minScale,
      maxScale,
      originX,
      originY,
      ...rest,
    } = this.props;
    const { canZoomIn, canZoomOut } = this.state;

    return (
      <div ref={this.setViewer} className={cx(classNames.viewer, className)}>
        <div
          {...rest}
          onContextMenu={this.handleContextMenu}
          onMouseDown={this.handleMouseDown}
          onWheel={this.handleMouseWheel}
          className={cxm('zoomable', { canZoomIn, canZoomOut })}
          role="presentation"
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
