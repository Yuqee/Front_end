import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import Player from './components/Player';

function App() {
  const [COUNT, setCOUNT] = useState(0);
  const [values, setVales] = useState(['','','','','','','','','']);
  const [res, setRes] = useState('');
  let num = 0;
  useEffect(() => {
      if (values[0] === values[1] && values[1] === values[2] && values[0] !== '') {
        setRes(`${values[0]} wins`);
      } else if (values[3] === values[4] && values[3] === values[5] && values[3] !== '') {
        setRes(`${values[3]} wins`);
      } else if (values[6] === values[7] && values[6] === values[8] && values[6] !== '') {
        setRes(`${values[6]} wins`);
      } else if (values[6] === values[7] && values[6] === values[8] && values[7] !== '') {
        setRes(`${values[6]} wins`);
      } else if (values[0] === values[3] && values[0] === values[6] && values[0] !== '') {
        setRes(`${values[0]} wins`);
      } else if (values[1] === values[4] && values[1] === values[7] && values[1] !== '') {
        setRes(`${values[1]} wins`);
      } else if (values[2] === values[5] && values[2] === values[8] && values[2] !== '') {
        setRes(`${values[2]} wins`);
      } else if (values[0] === values[4] && values[0] === values[8] && values[0] !== '') {
        setRes(`${values[0]} wins`);
      } else if (values[2] === values[4] && values[2] === values[6] && values[2] !== '') {
        setRes(`${values[2]} wins`);
      } else {
        if (values.every((ele) => {
          return ele !=='';
        })) {
          setRes('Tie');
        }
      }
    
  }, [values]);
  
  return (
    <>
      <Player id='O'/>
      <Player id='X'/>
      <Board
        next={COUNT}
        setNext={setCOUNT}
        setBoard={setVales}
        borad={values}/>
      <p>{res}</p>
    </>
  );
}

export default App;
