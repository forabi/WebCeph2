This is a controlled zoomable component, the `onZoom` handler dispatches zoom changes so that the changes are handled outside the component:

```
initialState = { scaleFactor: 1, originX: 0, originY: 0 };

<Zoomable
  {...state}
  onZoom={(scaleFactor, originX, originY) => setState({ scaleFactor, originX, originY })}
>
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
    {state.scaleFactor}x ({Math.round(state.originX)}, {Math.round(state.originY)})
  </div>
</Zoomable>

```
