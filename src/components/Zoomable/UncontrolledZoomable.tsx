import * as React from 'react';
import { Zoomable, Props as AllProps } from 'components/Zoomable/Zoomable';

type Props = Pick<AllProps, 'minScale' | 'maxScale'> & React.HTMLAttributes<Element>;
type State = Pick<AllProps, 'scaleFactor' | 'originX' | 'originY'>;

export { Props };

/**
 * A stateful `Zoomable` instance, the `onZoom` is handled internally.
 */
export class UncontrolledZoomable extends React.Component<Props, State> {
  state = {
    scaleFactor: 1,
    originX: 0,
    originY: 0,
  };

  handleOnZoom: AllProps['onZoom'] = (scaleFactor, originX, originY) => {
    this.setState({ scaleFactor, originX, originY });
  };

  render() {
    return (
      <Zoomable {...this.props} {...this.state} onZoom={this.handleOnZoom}>
        {this.props.children}
      </Zoomable>
    );
  }
}

export default UncontrolledZoomable;
