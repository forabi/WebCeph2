import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { UncontrolledZoomable } from 'components/Zoomable/UncontrolledZoomable';

storiesOf(UncontrolledZoomable.name, module).add('with text', () =>
  <div style={{ overflow: 'auto', height: 500 }}>
    <UncontrolledZoomable minScale={1} maxScale={Infinity}>
      <img
        style={{ height: 250 }}
        alt="Cephalometric radiograph"
        src="https://upload.wikimedia.org/wikipedia/commons/6/66/Cephalometric_radiograph.JPG"
      />
    </UncontrolledZoomable>
  </div>,
);
