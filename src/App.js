import React, { useState, useCallback, useMemo, useEffect } from 'react';
import './App.css';
import Measure from 'react-measure';

function ToolbarItem({ value, onSizeChange, Element }) {
  const handleSizeChange = (contentRect) => {
    console.log(`Item resize ${value}`);
    console.log(contentRect);
    onSizeChange(value, contentRect);
  };
  return (
    <Measure bounds onResize={handleSizeChange}>
      {({ measureRef }) => (
        <div ref={measureRef} style={{ padding: '5px', width: `${10 * value}px`, border: '1px solid green' }}>
          Name: {value}
        </div>
      )}
    </Measure>
  );
}

function Toolbar() {
  const items = Array.from(Array(10).keys());
  const [toolbarItemWidth, setToolbarItemWidth] = useState({});
  const [mainDivSize, setMainDivSize] = useState();
  const [toolbarItemsToRender, setToolbarItemsToRender] = useState({});
  const [hasUpdated, setHasUpdated] = useState(false);

  const onSizeChange = useCallback(
    (value, contentRect) => {
      setToolbarItemWidth({
        ...toolbarItemWidth,
        [value]: contentRect.bounds.width,
      });
      setHasUpdated(false);
    },
    [toolbarItemWidth, setHasUpdated],
  );

  const handleResize = useCallback(
    ({ bounds: { width } }) => {
      setMainDivSize(width);
      setHasUpdated(false);
    },
    [setHasUpdated],
  );

  const allItemsWidths = useMemo(() => Object.values(toolbarItemWidth).reduce((acc, item) => acc + item, 0), [
    toolbarItemWidth,
  ]);

  useEffect(() => {
    if (hasUpdated) {
      return;
    }
    let itemsForToolbar = {};
    let currentTotalWidth = 0;
    for (const [key, value] of Object.entries(toolbarItemWidth)) {
      if (currentTotalWidth >= mainDivSize) {
        console.log('Should stop now');
        break;
      }
      console.log(`currentTotalWidth: ${currentTotalWidth} value: ${value}`);
      currentTotalWidth = currentTotalWidth + value;
      console.log(`currentTotalWidth: ${currentTotalWidth}`);
      itemsForToolbar = {
        ...itemsForToolbar,
        [key]: value,
      };
    }
    console.log(`Items for toolbar`);
    console.log(itemsForToolbar);

    setHasUpdated(true);
    setToolbarItemsToRender(itemsForToolbar);
  }, [toolbarItemWidth, mainDivSize, items, hasUpdated]);

  return (
    <>
      <Measure bounds onResize={handleResize}>
        {({ measureRef }) => (
          <div ref={measureRef} style={{ display: 'flex', border: '1px dashed yellow' }}>
            {items.map((x) => (
              <ToolbarItem key={x} value={x} onSizeChange={onSizeChange} />
            ))}
          </div>
        )}
      </Measure>
      <div style={{ display: 'flex', border: '1px dashed blue' }}>
        {Object.entries(toolbarItemsToRender).map(([key, value]) => (
          <div key={key} value={key} style={{ padding: '5px', width: `${value}px`, border: '1px solid grey' }}>
            Name: {key}
          </div>
        ))}
      </div>

      <div>
        <div>Width of all items: {allItemsWidths} </div>
        <div>Width of Toolbar container: {mainDivSize}</div>
        <div>Is overflowing? {allItemsWidths > mainDivSize ? 'Yes' : 'No'}</div>
      </div>
    </>
  );
}

function App() {
  const [mainBoxWidth, setMainBoxWidth] = useState('200');
  const onWidthChange = (e) => setMainBoxWidth(e.target.value);

  return (
    <div className="App">
      <div>
        <input type="range" id="box" value={mainBoxWidth} min="20" max="600" onChange={onWidthChange} />
        <label htmlFor="box">Box width</label>
      </div>
      <div style={{ width: `${mainBoxWidth}px`, height: '300px', border: '1px solid red' }}>
        <Toolbar />
      </div>
    </div>
  );
}

export default App;
