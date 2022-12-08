import React from "react";
import Cell from "./Cell";

const Board = (props) => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
        }}>
        <Cell
          nextContext={props.next}
          setNextcon={props.setNext}
          update={props.setBoard}
          boradVals={props.borad}
          id={0}/>
        <Cell
          nextContext={props.next}
          setNextcon={props.setNext}
          update={props.setBoard}
          boradVals={props.borad}
          id={1}/>
        <Cell
          nextContext={props.next}
          setNextcon={props.setNext}
          update={props.setBoard}
          boradVals={props.borad}
          id={2}/>
      </div>
      <div
        style={{
          display: 'flex',
        }}>
        <Cell
          nextContext={props.next}
          setNextcon={props.setNext}
          update={props.setBoard}
          boradVals={props.borad}
          id={3}/>
        <Cell
          nextContext={props.next}
          setNextcon={props.setNext}
          update={props.setBoard}
          boradVals={props.borad}
          id={4}/>
        <Cell
          nextContext={props.next}
          setNextcon={props.setNext}
          update={props.setBoard}
          boradVals={props.borad}
          id={5}/>
      </div>
      <div
        style={{
          display: 'flex',
        }}>
        <Cell
          nextContext={props.next}
          setNextcon={props.setNext}
          update={props.setBoard}
          boradVals={props.borad}
          id={6}/>
        <Cell
          nextContext={props.next}
          setNextcon={props.setNext}
          update={props.setBoard}
          boradVals={props.borad}
          id={7}/>
        <Cell
          nextContext={props.next}
          setNextcon={props.setNext}
          update={props.setBoard}
          boradVals={props.borad}
          id={8}/>
      </div>
    </div>
  );
}

export default Board;