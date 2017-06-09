import * as React from 'react';
import { render } from 'react-dom';

import UncontrolledZoomable from 'components/Zoomable/UncontrolledZoomable';

const app = document.getElementById('app');

render(
  <div style={{ overflow: 'auto', height: 500 }}>
    <UncontrolledZoomable minScale={1} maxScale={Infinity}>
      <img
        style={{ height: 250 }}
        alt="Cephalometric radiograph"
        src="https://upload.wikimedia.org/wikipedia/commons/6/66/Cephalometric_radiograph.JPG"
      />
    </UncontrolledZoomable>
  </div>,
  app,
);

