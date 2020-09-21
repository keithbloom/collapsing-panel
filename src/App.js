import React, { useState, useCallback, useMemo, useEffect } from 'react';
import './App.css';
import Measure from 'react-measure';

function ToolbarItem({ id, onSizeChange, children }) {
  const handleSizeChange = (contentRect) => {
    console.log(`Item resize id: ${id}`);
    console.log(contentRect);
    onSizeChange(id, contentRect);
  };
  return (
    <Measure bounds onResize={handleSizeChange}>
      {({ measureRef }) => <div ref={measureRef}>{children}</div>}
    </Measure>
  );
}

function Toolbar({ children }) {
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
      currentTotalWidth = currentTotalWidth + value;
      if (currentTotalWidth >= mainDivSize) {
        console.log('Should stop now');
        break;
      }
      console.log(`currentTotalWidth: ${currentTotalWidth} value: ${value}`);
      console.log(`currentTotalWidth: ${currentTotalWidth}`);
      itemsForToolbar = {
        ...itemsForToolbar,
        [key]: children[key],
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
            {children.map((x, index) => (
              <div style={{ marginLeft: '-9999px' }}>
                <ToolbarItem key={index} id={index} onSizeChange={onSizeChange}>
                  {x}
                </ToolbarItem>
              </div>
            ))}
          </div>
        )}
      </Measure>

      <div style={{ display: 'flex', border: '1px dashed blue' }}>
        {Object.entries(toolbarItemsToRender).map(([key, value]) => value)}
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
        <Toolbar>
          <div style={{ margin: '20px', border: '1px solid green' }}>Hello</div>
          <div style={{ widht: '30px', border: '2px solid orange' }}>World</div>
          <div style={{ margin: '20px', border: '1px solid green' }}>Hello</div>
          <div style={{ widht: '30px', border: '2px solid orange' }}>World</div>
          <div style={{ margin: '20px', border: '1px solid green' }}>Hello</div>
          <div style={{ widht: '30px', border: '2px solid orange' }}>World</div>
          <div style={{ margin: '20px', border: '1px solid green' }}>Hello</div>
          <div style={{ widht: '30px', border: '2px solid orange' }}>World</div>
        </Toolbar>
      </div>
    </div>
  );
}

export default App;
