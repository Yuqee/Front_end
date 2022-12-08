import React, { useState, useEffect } from "react";

const Cell = (props) => {
  const [context, setContext] = useState('');
  const [disabled, setDisable] = useState(false);
  let COUNT = 0;
  const ClickHandler = (event) => {
    if (context === '') {
      if (props.nextContext%2 === 0) {
        setContext('X');
      } else {
        setContext('O');
      }
      props.setNextcon(props.nextContext+1);
      setDisable(true);
    }
  }

  useEffect(() => {
    // let temp = props.boradVals;
    // temp[props.id] = context;
    const temp = props.boradVals.map((c, i) => {
      if (i === props.id) {
        // Increment the clicked counter
        return context;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    props.update(temp);
  }, [context]);

  return (
    <div
      style={{
        borderStyle: 'solid',
        height: '10vh',
        width: '10vh',
        cursor: 'pointer',
      }}
      onClick={ClickHandler}
      disabled={disabled}>
      {context}
    </div>
  ); 
}

export default Cell;