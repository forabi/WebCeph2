import * as React from 'react';
import expect from 'expect';
import Zoomable from 'components/Zoomable/Zoomable';
import UncontrolledZoomable from 'components/Zoomable/UncontrolledZoomable';
import noop from 'lodash/noop';

it('Test 1', () => {
  expect(1).toEqual(1);
  expect(
    <Zoomable originX={0} originY={0} scaleFactor={1} onZoom={noop} />,
  ).toExist();
  expect(<UncontrolledZoomable />).toExist();
});

it('Test 2', () => {
  expect(1).toEqual(1);
});
