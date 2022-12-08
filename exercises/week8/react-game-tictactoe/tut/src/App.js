import './App.css';
import {useState} from 'react';

function App() {
  const emptyBoard = [
    ['','',''],
    ['','',''],
    ['','','']
  ];
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState('X');
  const [winCells, setWinCells] = useState([]);
  const [winner, setWinner] = useState('');

  const clickHandler = (y,x) => {
    if (board[x][y] === '') {
      let newBoard = board;
      newBoard[x][y] = turn;
      setTurn(turn==='X' ? 'O' : 'X');
      setBoard(newBoard);
      check();
    }
  }

  const check = () => {
    for(let i = 0; i < 3; i++) {
      if(board[i][0] !== '' && board[i][1] === board[i][2] && board[i][0] === board[i][2]) {
        setWinCells([[i,0], [i,1], [i,2]]);
        setWinner(board[i][0]);
      }
      console.log(winCells);
    }
  }
  return (
   <div
    className='board'>
    {board.map((row, y) => {
      return (
        <div
          key={`${y}`}
          className='row'
          >
          {
            row.map((col, x) => {
              return (
                <button
                  key={`${x}-${y}`}
                  className='cell'
                  onClick={() => clickHandler(y,x)}>
                  {board[x][y]}
                </button>);
            })
          }
        </div>
      )
    })}
   </div>
  );
}

export default App;
