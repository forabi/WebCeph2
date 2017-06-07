import * as React from 'react';
import { Zoomable, Props } from 'components/Zoomable/Zoomable';

export { Props };

type State = Pick<Props, 'scaleFactor' | 'originX' | 'originY'>;

/**
 * A stateful `Zoomable` instance, the `onZoom` is handled internally.
 */
export class UncontrolledZoomable extends React.Component<Props, State> {
  state = {
    scaleFactor: 1,
    originX: 0,
    originY: 0,
  };

  handleOnZoom: Props['onZoom'] = (scaleFactor, originX, originY) => {
    this.setState({ scaleFactor, originX, originY });
  }

  render() {
    return (
      <Zoomable {...this.props} {...this.state} onZoom={this.handleOnZoom}>
        {this.props.children}
      </Zoomable>
    );
  }
}

export default UncontrolledZoomable;
