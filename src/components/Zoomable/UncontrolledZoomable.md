This is a stateful zoomable component, with a maximum zoom level of 2, the `onZoom` handler updates the state internally:

```
<UncontrolledZoomable minScale={1} maxScale={2}>
  <div
    style={{
      width: 200,
      height: 200,
      background: 'lightblue',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    TEXT
  </div>
</UncontrolledZoomable>
```

This is another stateful zoomable component, wrapped in a scrollable container:

```
<div style={{ overflow: 'auto', height: 300, width: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <UncontrolledZoomable minScale={1} maxScale={Infinity}>
    <img
      style={{ height: 250 }} 
      src="https://upload.wikimedia.org/wikipedia/commons/6/66/Cephalometric_radiograph.JPG"
    />
  </UncontrolledZoomable>
</div>
```

This is another stateful zoomable component, wrapped in a scrollable container which has `direction: rtl`, just to make sure it works with RTL layouts:

```
<div style={{ overflow: 'auto', height: 300, width: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
  <UncontrolledZoomable minScale={1} maxScale={Infinity}>
    <img
      style={{ height: 250 }} 
      src="https://upload.wikimedia.org/wikipedia/commons/6/66/Cephalometric_radiograph.JPG"
    />
  </UncontrolledZoomable>
</div>
```