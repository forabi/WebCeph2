import * as React from 'react';
import { UncontrolledZoomable } from 'components/Zoomable/UncontrolledZoomable';

// tslint:disable-next-line no-require-imports no-var-requires
const { storiesOf } = require('@storybook/react');

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
