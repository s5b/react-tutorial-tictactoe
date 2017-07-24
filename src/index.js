import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinningSquares(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    const winningSquares = new Map();
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            const previousWinners = winningSquares.get(squares[a]) || [];
            winningSquares.set(squares[a], new Set([...previousWinners, ...lines[i]]));
        }
    }
    return winningSquares;
}

function Square(props) {
    const classes = `square${props.winner ? ' winner' : ''}`;
    return (
        <button className={classes} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i, winningSquares) {
        const winner = winningSquares.has(i);
        return (
            <Square
                identity={i}
                winner={winner}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const winningSquares = this.props.winningSquares;
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0, winningSquares)}
                    {this.renderSquare(1, winningSquares)}
                    {this.renderSquare(2, winningSquares)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3, winningSquares)}
                    {this.renderSquare(4, winningSquares)}
                    {this.renderSquare(5, winningSquares)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6, winningSquares)}
                    {this.renderSquare(7, winningSquares)}
                    {this.renderSquare(8, winningSquares)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor() {
        super();
        this.state = {
            history: [{
                squares: new Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = {...current.squares};
        if (calculateWinningSquares(squares).size > 0 || squares[i]) {
            return;
        }
        squares[i] =  this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext});
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerCalculation = calculateWinningSquares(current.squares);

        const [status, winningSquares] = winnerCalculation.size > 0 ?
            [`Winner is ${winnerCalculation.keys().next().value}`, winnerCalculation.values().next().value] :
            [`Next player is: ${this.state.xIsNext ? 'X' : 'O'}`, new Set()];

        const moves = history.map((step, move) => {
            const desc = move ? `Move #${move}` : 'Game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        });

        // const status = winner ? `Winner is ${winner}` : `Next player is: ${this.state.xIsNext ? 'X' : 'O'}`;

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
                           winningSquares={winningSquares}
                           onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
