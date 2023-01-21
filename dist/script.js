"use strict";
class Canvas {
    constructor() {
        this.mousePosition = { mousex: null, mousey: null };
        this.canvas = document.querySelector('#cv');
        this.cvH = this.canvas.height = window.innerHeight;
        this.cvW = this.canvas.width = window.innerWidth;
        this.rightBorder = this.cvW;
        this.leftBorder = 0;
        this.topBorder = 0;
        this.bottomBorder = this.cvH;
    }
    get ctx() { return this.canvas.getContext('2d'); }
    get mousePositions() { return this.mousePosition; }
    get size() {
        return {
            height: this.cvH,
            width: this.cvW,
        };
    }
    get borders() {
        return {
            left: this.leftBorder,
            right: this.rightBorder,
            top: this.topBorder,
            bot: this.bottomBorder,
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
;
class TicTacToe {
    constructor(canvas) {
        this.canvas = canvas;
        this.FIELD_WIDTH = 150;
        this.FIELD_HEIGHT = 150;
        this.COLUMNS = 3;
        this.ROWS = 3;
        this.countID = 0;
        this.strokeColor = 'white';
        this.fieldCoordinates = [];
        this.symbol = ['X', 'O'];
        this.positions = new Array(9).fill(false);
        this.playerIndex = Math.random() > 0.5 ? 1 : 0;
        this.player = this.symbol[this.playerIndex];
        this.setPlayerSymbol = this.setPlayerSymbol.bind(this);
        this.canvas.listenForClicks(this.setPlayerSymbol);
    }
    draw() {
        const ctx = this.canvas.ctx;
        const { width, height } = this.canvas.size;
        const posXOffset = width / 2 - ((this.COLUMNS * this.FIELD_WIDTH) * 0.5);
        const posYOffset = height / 2 - ((this.ROWS * this.FIELD_HEIGHT) * 0.5);
        ctx.strokeStyle = this.strokeColor;
        for (let y = 0; y < this.ROWS; y++) {
            for (let x = 0; x < this.COLUMNS; x++) {
                const psX = (x * this.FIELD_WIDTH) + posXOffset;
                const psY = (y * this.FIELD_HEIGHT) + posYOffset;
                this.fieldCoordinates.push({
                    fieldX: psX,
                    fieldY: psY,
                    id: ++this.countID,
                });
                ctx.strokeRect(psX, psY, this.FIELD_WIDTH, this.FIELD_HEIGHT);
            }
        }
    }
    setPlayerSymbol() {
        this.playerIndex = ++this.playerIndex & 1 ? 1 : 0;
        this.player = this.symbol[this.playerIndex];
    }
    update() {
        this.draw();
    }
    init() {
        this.update();
    }
}
function render() {
    const myCanvas = new Canvas();
    const game = new TicTacToe(myCanvas);
    game.init();
}
window.onload = render;
