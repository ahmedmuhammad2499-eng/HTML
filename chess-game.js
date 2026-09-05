// Chess Game Engine
class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.selectedSquare = null;
        this.validMoves = [];
        this.gameState = 'playing'; // playing, checkmate, stalemate, check
        this.whiteKingMoved = false;
        this.blackKingMoved = false;
        this.whiteRookKingMoved = false;
        this.whiteRookQueenMoved = false;
        this.blackRookKingMoved = false;
        this.blackRookQueenMoved = false;
    }

    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Set up white pieces
        board[7][0] = { type: 'rook', color: 'white' };
        board[7][1] = { type: 'knight', color: 'white' };
        board[7][2] = { type: 'bishop', color: 'white' };
        board[7][3] = { type: 'queen', color: 'white' };
        board[7][4] = { type: 'king', color: 'white' };
        board[7][5] = { type: 'bishop', color: 'white' };
        board[7][6] = { type: 'knight', color: 'white' };
        board[7][7] = { type: 'rook', color: 'white' };
        
        for (let i = 0; i < 8; i++) {
            board[6][i] = { type: 'pawn', color: 'white' };
        }

        // Set up black pieces
        board[0][0] = { type: 'rook', color: 'black' };
        board[0][1] = { type: 'knight', color: 'black' };
        board[0][2] = { type: 'bishop', color: 'black' };
        board[0][3] = { type: 'queen', color: 'black' };
        board[0][4] = { type: 'king', color: 'black' };
        board[0][5] = { type: 'bishop', color: 'black' };
        board[0][6] = { type: 'knight', color: 'black' };
        board[0][7] = { type: 'rook', color: 'black' };
        
        for (let i = 0; i < 8; i++) {
            board[1][i] = { type: 'pawn', color: 'black' };
        }

        return board;
    }

    getPieceUnicode(piece) {
        const pieces = {
            white: {
                king: '♔',
                queen: '♕',
                rook: '♖',
                bishop: '♗',
                knight: '♘',
                pawn: '♙'
            },
            black: {
                king: '♚',
                queen: '♛',
                rook: '♜',
                bishop: '♝',
                knight: '♞',
                pawn: '♟'
            }
        };
        return pieces[piece.color][piece.type];
    }

    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    isSquareEmpty(row, col) {
        return this.board[row][col] === null;
    }

    isEnemyPiece(row, col, color) {
        const piece = this.board[row][col];
        return piece && piece.color !== color;
    }

    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece || piece.color !== this.currentPlayer) return [];

        const moves = [];

        switch (piece.type) {
            case 'pawn':
                moves.push(...this.getPawnMoves(row, col, piece.color));
                break;
            case 'rook':
                moves.push(...this.getRookMoves(row, col, piece.color));
                break;
            case 'knight':
                moves.push(...this.getKnightMoves(row, col, piece.color));
                break;
            case 'bishop':
                moves.push(...this.getBishopMoves(row, col, piece.color));
                break;
            case 'queen':
                moves.push(...this.getQueenMoves(row, col, piece.color));
                break;
            case 'king':
                moves.push(...this.getKingMoves(row, col, piece.color));
                break;
        }

        return moves.filter(move => this.isMoveValid(row, col, move[0], move[1], piece.color));
    }

    getPawnMoves(row, col, color) {
        const moves = [];
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;

        // Move forward
        const forwardRow = row + direction;
        if (this.isValidSquare(forwardRow, col) && this.isSquareEmpty(forwardRow, col)) {
            moves.push([forwardRow, col]);

            // Double move from start
            if (row === startRow) {
                const doubleRow = row + 2 * direction;
                if (this.isSquareEmpty(doubleRow, col)) {
                    moves.push([doubleRow, col]);
                }
            }
        }

        // Captures
        for (let dx of [-1, 1]) {
            const captureRow = row + direction;
            const captureCol = col + dx;
            if (this.isValidSquare(captureRow, captureCol) && this.isEnemyPiece(captureRow, captureCol, color)) {
                moves.push([captureRow, captureCol]);
            }
        }

        return moves;
    }

    getRookMoves(row, col, color) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        for (const [dx, dy] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (!this.isValidSquare(newRow, newCol)) break;
                if (this.isSquareEmpty(newRow, newCol)) {
                    moves.push([newRow, newCol]);
                } else if (this.isEnemyPiece(newRow, newCol, color)) {
                    moves.push([newRow, newCol]);
                    break;
                } else {
                    break;
                }
            }
        }
        return moves;
    }

    getKnightMoves(row, col, color) {
        const moves = [];
        const offsets = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];

        for (const [dx, dy] of offsets) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (this.isValidSquare(newRow, newCol)) {
                if (this.isSquareEmpty(newRow, newCol) || this.isEnemyPiece(newRow, newCol, color)) {
                    moves.push([newRow, newCol]);
                }
            }
        }
        return moves;
    }

    getBishopMoves(row, col, color) {
        const moves = [];
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

        for (const [dx, dy] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (!this.isValidSquare(newRow, newCol)) break;
                if (this.isSquareEmpty(newRow, newCol)) {
                    moves.push([newRow, newCol]);
                } else if (this.isEnemyPiece(newRow, newCol, color)) {
                    moves.push([newRow, newCol]);
                    break;
                } else {
                    break;
                }
            }
        }
        return moves;
    }

    getQueenMoves(row, col, color) {
        return [...this.getRookMoves(row, col, color), ...this.getBishopMoves(row, col, color)];
    }

    getKingMoves(row, col, color) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (this.isValidSquare(newRow, newCol)) {
                if (this.isSquareEmpty(newRow, newCol) || this.isEnemyPiece(newRow, newCol, color)) {
                    moves.push([newRow, newCol]);
                }
            }
        }

        // Castling
        if (color === 'white' && !this.whiteKingMoved && row === 7 && col === 4) {
            // Kingside castling
            if (!this.whiteRookKingMoved && this.isSquareEmpty(7, 5) && this.isSquareEmpty(7, 6)) {
                moves.push([7, 6]);
            }
            // Queenside castling
            if (!this.whiteRookQueenMoved && this.isSquareEmpty(7, 3) && this.isSquareEmpty(7, 2) && this.isSquareEmpty(7, 1)) {
                moves.push([7, 2]);
            }
        } else if (color === 'black' && !this.blackKingMoved && row === 0 && col === 4) {
            // Kingside castling
            if (!this.blackRookKingMoved && this.isSquareEmpty(0, 5) && this.isSquareEmpty(0, 6)) {
                moves.push([0, 6]);
            }
            // Queenside castling
            if (!this.blackRookQueenMoved && this.isSquareEmpty(0, 3) && this.isSquareEmpty(0, 2) && this.isSquareEmpty(0, 1)) {
                moves.push([0, 2]);
            }
        }

        return moves;
    }

    isMoveValid(fromRow, fromCol, toRow, toCol, color) {
        // Simulate the move
        const tempBoard = JSON.parse(JSON.stringify(this.board));
        tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
        tempBoard[fromRow][fromCol] = null;

        // Find king position
        let kingRow, kingCol;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (tempBoard[r][c] && tempBoard[r][c].type === 'king' && tempBoard[r][c].color === color) {
                    kingRow = r;
                    kingCol = c;
                }
            }
        }

        // Check if king is in check
        return !this.isSquareUnderAttack(kingRow, kingCol, color, tempBoard);
    }

    isSquareUnderAttack(row, col, byColor, board = this.board) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c];
                if (piece && piece.color === byColor) {
                    if (this.canPieceAttack(r, c, row, col, piece, board)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    canPieceAttack(fromRow, fromCol, toRow, toCol, piece, board) {
        switch (piece.type) {
            case 'pawn':
                return this.canPawnAttack(fromRow, fromCol, toRow, toCol, piece.color);
            case 'knight':
                return this.canKnightAttack(fromRow, fromCol, toRow, toCol);
            case 'king':
                return this.canKingAttack(fromRow, fromCol, toRow, toCol);
            case 'rook':
                return this.canRookAttack(fromRow, fromCol, toRow, toCol, board);
            case 'bishop':
                return this.canBishopAttack(fromRow, fromCol, toRow, toCol, board);
            case 'queen':
                return this.canQueenAttack(fromRow, fromCol, toRow, toCol, board);
        }
        return false;
    }

    canPawnAttack(fromRow, fromCol, toRow, toCol, color) {
        const direction = color === 'white' ? -1 : 1;
        return toRow === fromRow + direction && Math.abs(toCol - fromCol) === 1;
    }

    canKnightAttack(fromRow, fromCol, toRow, toCol) {
        const dx = Math.abs(fromRow - toRow);
        const dy = Math.abs(fromCol - toCol);
        return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    }

    canKingAttack(fromRow, fromCol, toRow, toCol) {
        return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
    }

    canRookAttack(fromRow, fromCol, toRow, toCol, board) {
        if (fromRow !== toRow && fromCol !== toCol) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol, board);
    }

    canBishopAttack(fromRow, fromCol, toRow, toCol, board) {
        if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol, board);
    }

    canQueenAttack(fromRow, fromCol, toRow, toCol, board) {
        return this.canRookAttack(fromRow, fromCol, toRow, toCol, board) || 
               this.canBishopAttack(fromRow, fromCol, toRow, toCol, board);
    }

    isPathClear(fromRow, fromCol, toRow, toCol, board) {
        const dx = toRow === fromRow ? 0 : (toRow > fromRow ? 1 : -1);
        const dy = toCol === fromCol ? 0 : (toCol > fromCol ? 1 : -1);

        let r = fromRow + dx;
        let c = fromCol + dy;

        while (r !== toRow || c !== toCol) {
            if (board[r][c] !== null) return false;
            r += dx;
            c += dy;
        }
        return true;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;

        const moves = this.getValidMoves(fromRow, fromCol);
        if (!moves.some(m => m[0] === toRow && m[1] === toCol)) {
            return false;
        }

        // Handle castling
        if (piece.type === 'king') {
            if (piece.color === 'white') this.whiteKingMoved = true;
            else this.blackKingMoved = true;

            if (Math.abs(toCol - fromCol) === 2) {
                // Castling move
                if (toCol > fromCol) {
                    // Kingside
                    const rook = this.board[fromRow][7];
                    this.board[fromRow][5] = rook;
                    this.board[fromRow][7] = null;
                    if (piece.color === 'white') this.whiteRookKingMoved = true;
                    else this.blackRookKingMoved = true;
                } else {
                    // Queenside
                    const rook = this.board[fromRow][0];
                    this.board[fromRow][3] = rook;
                    this.board[fromRow][0] = null;
                    if (piece.color === 'white') this.whiteRookQueenMoved = true;
                    else this.blackRookQueenMoved = true;
                }
            }
        }

        // Track rook moves
        if (piece.type === 'rook') {
            if (piece.color === 'white') {
                if (fromCol === 7) this.whiteRookKingMoved = true;
                else if (fromCol === 0) this.whiteRookQueenMoved = true;
            } else {
                if (fromCol === 7) this.blackRookKingMoved = true;
                else if (fromCol === 0) this.blackRookQueenMoved = true;
            }
        }

        // Handle pawn promotion
        if (piece.type === 'pawn' && ((piece.color === 'white' && toRow === 0) || (piece.color === 'black' && toRow === 7))) {
            piece.type = 'queen'; // Auto-promote to queen
        }

        const capturedPiece = this.board[toRow][toCol];
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        this.moveHistory.push({
            from: [fromRow, fromCol],
            to: [toRow, toCol],
            piece: piece.type,
            captured: capturedPiece
        });

        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateGameState();

        return true;
    }

    updateGameState() {
        const hasValidMoves = this.hasValidMoves(this.currentPlayer);
        const isInCheck = this.isInCheck(this.currentPlayer);

        if (!hasValidMoves) {
            if (isInCheck) {
                this.gameState = 'checkmate';
            } else {
                this.gameState = 'stalemate';
            }
        } else if (isInCheck) {
            this.gameState = 'check';
        } else {
            this.gameState = 'playing';
        }
    }

    hasValidMoves(color) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece && piece.color === color) {
                    const moves = this.getValidMoves(r, c);
                    if (moves.length > 0) return true;
                }
            }
        }
        return false;
    }

    isInCheck(color) {
        let kingRow, kingCol;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.board[r][c] && this.board[r][c].type === 'king' && this.board[r][c].color === color) {
                    kingRow = r;
                    kingCol = c;
                }
            }
        }
        const enemyColor = color === 'white' ? 'black' : 'white';
        return this.isSquareUnderAttack(kingRow, kingCol, enemyColor);
    }

    undoMove() {
        if (this.moveHistory.length === 0) return false;
        
        const move = this.moveHistory.pop();
        const piece = this.board[move.to[0]][move.to[1]];
        
        this.board[move.from[0]][move.from[1]] = piece;
        this.board[move.to[0]][move.to[1]] = move.captured;
        
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateGameState();
        
        return true;
    }

    reset() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.selectedSquare = null;
        this.validMoves = [];
        this.gameState = 'playing';
        this.whiteKingMoved = false;
        this.blackKingMoved = false;
        this.whiteRookKingMoved = false;
        this.whiteRookQueenMoved = false;
        this.blackRookKingMoved = false;
        this.blackRookQueenMoved = false;
    }
}

// Game UI Manager
let game = null;
let gameMode = null;
let wsConnection = null;

function startLocalGame() {
    gameMode = 'local';
    game = new ChessGame();
    document.getElementById('modeSelection').classList.add('hidden');
    document.getElementById('gameStatus').classList.remove('hidden');
    document.getElementById('gameInfo').classList.remove('hidden');
    document.getElementById('gameControls').classList.remove('hidden');
    document.getElementById('moveHistory').classList.remove('hidden');
    document.getElementById('whitePlayer').textContent = 'Player 1 (White)';
    document.getElementById('blackPlayer').textContent = 'Player 2 (Black)';
    renderBoard();
    updateGameUI();
}

function showLANOptions() {
    document.getElementById('lanOptions').classList.remove('hidden');
}

function cancelLAN() {
    document.getElementById('lanOptions').classList.add('hidden');
}

function hostGame() {
    alert('LAN hosting requires a WebSocket server.\nPlease set up a server at the specified URL and try again.\n\nFor now, use Local Multiplayer mode.');
}

function joinGame() {
    alert('LAN joining requires a WebSocket server.\nPlease ensure the server is running at the specified URL.\n\nFor now, use Local Multiplayer mode.');
}

function renderBoard() {
    const boardElement = document.getElementById('chessBoard');
    boardElement.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            const isLight = (row + col) % 2 === 0;
            
            square.className = `chess-square ${isLight ? 'light' : 'dark'}`;
            square.id = `square-${row}-${col}`;
            
            const piece = game.board[row][col];
            if (piece) {
                const pieceElement = document.createElement('span');
                pieceElement.className = 'piece';
                pieceElement.textContent = game.getPieceUnicode(piece);
                square.appendChild(pieceElement);
            }

            if (game.selectedSquare && game.selectedSquare[0] === row && game.selectedSquare[1] === col) {
                square.classList.add('selected');
            }

            if (game.validMoves.some(m => m[0] === row && m[1] === col)) {
                const piece = game.board[row][col];
                square.classList.add(piece ? 'valid-capture' : 'valid-move');
            }

            square.addEventListener('click', () => handleSquareClick(row, col));
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(row, col) {
    if (gameMode !== 'local') return;

    const piece = game.board[row][col];

    if (game.selectedSquare) {
        if (game.selectedSquare[0] === row && game.selectedSquare[1] === col) {
            game.selectedSquare = null;
            game.validMoves = [];
        } else {
            const moved = game.makeMove(game.selectedSquare[0], game.selectedSquare[1], row, col);
            if (moved) {
                game.selectedSquare = null;
                game.validMoves = [];
                updateGameUI();
            } else {
                if (piece && piece.color === game.currentPlayer) {
                    game.selectedSquare = [row, col];
                    game.validMoves = game.getValidMoves(row, col);
                }
            }
        }
    } else {
        if (piece && piece.color === game.currentPlayer) {
            game.selectedSquare = [row, col];
            game.validMoves = game.getValidMoves(row, col);
        }
    }

    renderBoard();
}

function updateGameUI() {
    const statusMap = {
        'playing': '🔄 Game in Progress',
        'check': '⚠️ King in Check',
        'checkmate': '🏁 Checkmate - Game Over',
        'stalemate': '⚪ Stalemate - Game Over'
    };

    document.getElementById('statusText').textContent = statusMap[game.gameState] || 'Playing';
    document.getElementById('turnText').textContent = `Current Turn: ${game.currentPlayer === 'white' ? '⚪ White' : '⚫ Black'}`;
    document.getElementById('currentTurn').textContent = game.currentPlayer === 'white' ? 'White' : 'Black';
    document.getElementById('gameStateText').textContent = game.gameState === 'playing' ? 'Playing' : game.gameState;

    updateMoveHistory();
}

function updateMoveHistory() {
    const moveList = document.getElementById('moveList');
    moveList.innerHTML = '';

    game.moveHistory.forEach((move, index) => {
        const moveText = `${index + 1}. ${String.fromCharCode(97 + move.from[1])}${8 - move.from[0]} → ${String.fromCharCode(97 + move.to[1])}${8 - move.to[0]}`;
        const moveElement = document.createElement('div');
        moveElement.className = 'text-gray-300';
        moveElement.textContent = moveText;
        moveList.appendChild(moveElement);
    });
}

function undoMove() {
    if (game.undoMove()) {
        game.selectedSquare = null;
        game.validMoves = [];
        renderBoard();
        updateGameUI();
    }
}

function resetGame() {
    game.reset();
    game.selectedSquare = null;
    game.validMoves = [];
    renderBoard();
    updateGameUI();
}

function returnToMenu() {
    game = null;
    gameMode = null;
    document.getElementById('modeSelection').classList.remove('hidden');
    document.getElementById('gameStatus').classList.add('hidden');
    document.getElementById('gameInfo').classList.add('hidden');
    document.getElementById('gameControls').classList.add('hidden');
    document.getElementById('moveHistory').classList.add('hidden');
    document.getElementById('lanOptions').classList.add('hidden');
    document.getElementById('chessBoard').innerHTML = '';
}