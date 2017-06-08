import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { UncontrolledZoomable } from 'components/Zoomable/UncontrolledZoomable';
import { Props } from 'components/Zoomable/Zoomable';
import Loadable from 'react-loadable';

const { action } = require('@storybook/addon-actions');

storiesOf(UncontrolledZoomable.name, module)
  .add('with text', () =>
    <div style={{ overflow: 'auto', height: 500 }}>
      <UncontrolledZoomable minScale={1} maxScale={Infinity}>
        <img
          style={{ height: 250 }}
          alt="Cephalometric radiograph"
          src="https://upload.wikimedia.org/wikipedia/commons/6/66/Cephalometric_radiograph.JPG"
        />
      </UncontrolledZoomable>
    </div>,
  ).add('stuff', () => {

    const AsyncZoomable = Loadable<Props>({
      loader() {
        return new Promise(resolve => {
          setTimeout(resolve, 5000);
        }).then(() => import('components/Zoomable/Zoomable'));
      },
      LoadingComponent: () => <div>Loading...</div>,
    });

    return (
      <AsyncZoomable originX={0} originY={0} minScale={1} scaleFactor={1} onZoom={action('Zoom')}>
        <img
          style={{ height: 250 }}
          alt="Cephalometric radiograph"
          src="https://upload.wikimedia.org/wikipedia/commons/6/66/Cephalometric_radiograph.JPG"
        />
      </AsyncZoomable>
    );
  });
