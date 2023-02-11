"use strict";
class Canvas {
    constructor() {
        this.mousePosition = { mousex: null, mousey: null };
        this.canvas = document.querySelector('#cv');
        this.cvH = this.canvas.height = window.innerHeight;
        this.cvW = this.canvas.width = window.innerWidth;
    }
    get ctx() { return this.canvas.getContext('2d'); }
    get mousePositions() { return this.mousePosition; }
    get size() {
        return {
            height: this.cvH,
            width: this.cvW,
            halfX: this.cvW / 2,
            halfY: this.cvH / 2,
        };
    }
    get borders() {
        return {
            left: 0,
            right: this.cvW,
            top: 0,
            bot: this.cvH,
        };
    }
    listenForClicks(callback) {
        this.canvas.addEventListener('click', (event) => {
            this.mousePosition = {
                mousex: event.pageX,
                mousey: event.pageY,
            };
            callback();
        });
    }
}
class TicTacToe {
    constructor(canvas) {
        this.canvas = canvas;
        this.FIELD_WIDTH = 150;
        this.FIELD_HEIGHT = 150;
        this.COLUMNS = 3;
        this.ROWS = 3;
        this.strokeColor = 'white';
        this.positions = new Array(this.COLUMNS * this.ROWS);
        this.players = [
            ['X', this.X.bind(this)],
            ['O', this.O.bind(this)]
        ];
        this.playerIndex = Math.random() > 0.5 ? 1 : 0;
        this.player = this.players[this.playerIndex];
        this.update = this.update.bind(this);
        this.canvas.listenForClicks(this.update);
        this.ctx = this.canvas.ctx;
        this.posXOffset = this.canvas.size.halfX - ((this.COLUMNS * this.FIELD_WIDTH) * 0.5);
        this.posYOffset = this.canvas.size.halfY - ((this.ROWS * this.FIELD_HEIGHT) * 0.5);
        this.halfFieldX = this.FIELD_WIDTH * 0.5;
        this.halfFieldY = this.FIELD_HEIGHT * 0.5;
    }
    draw() {
        this.ctx.strokeStyle = this.strokeColor;
        for (let y = 0; y < this.ROWS; y++) {
            for (let x = 0; x < this.COLUMNS; x++) {
                const psX = (x * this.FIELD_WIDTH) + this.posXOffset;
                const psY = (y * this.FIELD_HEIGHT) + this.posYOffset;
                this.ctx.strokeRect(psX, psY, this.FIELD_WIDTH, this.FIELD_HEIGHT);
            }
        }
    }
    X(x, y) {
        const distance = 0.6;
        this.ctx.beginPath();
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = 'blue';
        this.ctx.moveTo(x - this.halfFieldX * distance, y - this.halfFieldY * distance);
        this.ctx.lineTo(x + this.halfFieldX * distance, y + this.halfFieldY * distance);
        this.ctx.moveTo(x + this.halfFieldX * distance, y - this.halfFieldY * distance);
        this.ctx.lineTo(x - this.halfFieldX * distance, y + this.halfFieldY * distance);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    O(x, y, radius) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 6;
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    setPlayerSymbol() {
        this.playerIndex = ++this.playerIndex & 1 ? 1 : 0;
        this.player = this.players[this.playerIndex];
    }
    setCurrentFieldIndex() {
        const { mousex, mousey } = this.canvas.mousePositions;
        if (typeof mousex === 'number' && typeof mousey === 'number') {
            // check if mouse is outside the grid
            if (mousex <= this.posXOffset ||
                mousex >= this.posXOffset + (this.FIELD_WIDTH * this.COLUMNS) ||
                mousey <= this.posYOffset ||
                mousey >= this.posYOffset + (this.FIELD_HEIGHT * this.ROWS))
                return;
            const currentCol = Math.floor((mousex - this.posXOffset) / this.FIELD_WIDTH);
            const currentRow = Math.floor((mousey - this.posYOffset) / this.FIELD_HEIGHT);
            const currentIndex = currentCol + this.COLUMNS * currentRow;
            const fieldCenterX = ((currentCol + 1) * this.FIELD_WIDTH - this.halfFieldX) + this.posXOffset;
            const fieldCenterY = ((currentRow + 1) * this.FIELD_HEIGHT - this.halfFieldY) + this.posYOffset;
            const [value, callback] = this.player;
            // When clicked if the block contains the same value (O or X) as the current player
            // then return and dont change the turn of players
            if (this.positions[currentIndex] === value)
                return;
            if (!this.positions[currentIndex]) {
                callback(fieldCenterX, fieldCenterY, this.FIELD_WIDTH / 3);
                this.setPlayerSymbol();
                this.positions[currentIndex] = value;
            }
        }
    }
    update() {
        this.setCurrentFieldIndex();
    }
    init() {
        this.draw();
    }
}
function renderGame() {
    const myCanvas = new Canvas();
    const game = new TicTacToe(myCanvas);
    game.init();
}
window.onload = renderGame;
