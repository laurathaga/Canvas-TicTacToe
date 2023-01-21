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
        this.countID = 0;
        this.strokeColor = 'white';
        this.symbol = ['X', 'O'];
        this.positions = new Array(this.COLUMNS * this.ROWS);
        this.playerIndex = Math.random() > 0.5 ? 1 : 0;
        this.player = this.symbol[this.playerIndex];
        this.update = this.update.bind(this);
        this.canvas.listenForClicks(this.update);
        this.ctx = this.canvas.ctx;
        this.posXOffset = this.canvas.size.halfX - ((this.COLUMNS * this.FIELD_WIDTH) * 0.5);
        this.posYOffset = this.canvas.size.halfY - ((this.ROWS * this.FIELD_HEIGHT) * 0.5);
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
    setPlayerSymbol() {
        this.playerIndex = ++this.playerIndex & 1 ? 1 : 0;
        this.player = this.symbol[this.playerIndex];
    }
    setCurrentFieldIndex() {
        const { mousex, mousey } = this.canvas.mousePositions;
        const currentCol = Math.floor((mousex - this.posXOffset) / this.FIELD_WIDTH);
        const currentRow = Math.floor((mousey - this.posYOffset) / this.FIELD_HEIGHT);
        const currentIndex = currentCol + this.COLUMNS * currentRow;
        if (!this.positions[currentIndex])
            this.positions[currentIndex] = this.player;
        console.log(this.positions);
    }
    update() {
        this.setPlayerSymbol();
        this.setCurrentFieldIndex();
    }
    init() {
        this.draw();
    }
}
function render() {
    const myCanvas = new Canvas();
    const game = new TicTacToe(myCanvas);
    game.init();
}
window.onload = render;
