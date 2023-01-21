class Canvas {
    private canvas: HTMLCanvasElement;
    private cvW: number;
    private cvH: number;
    private rightBorder: number;
    private leftBorder: number;
    private topBorder: number;
    private bottomBorder: number;
    private mousePosition: { mousex: number | null, mousey: number | null } = { mousex: null, mousey: null };

    constructor() {
        this.canvas = document.querySelector('#cv')!;
        this.cvH = this.canvas.height = window.innerHeight; 
        this.cvW = this.canvas.width = window.innerWidth;
        this.rightBorder = this.cvW;
        this.leftBorder = 0;
        this.topBorder = 0;
        this.bottomBorder = this.cvH;
    }

    get ctx(): CanvasRenderingContext2D { return this.canvas.getContext('2d')! }

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

    listenForClicks(callback: () => void) {
        this.canvas.addEventListener('click', (event: MouseEvent) => {
            this.mousePosition = {
                mousex: event.pageX,
                mousey: event.pageY,
            };

            callback();
        });
    }
}

interface FieldCoord {
    fieldX: number;
    fieldY: number;
    id: number;
};

class TicTacToe {
    private readonly FIELD_WIDTH = 150;
    private readonly FIELD_HEIGHT = 150;
    private readonly COLUMNS = 3;
    private readonly ROWS = 3;
    private countID: number = 0;
    private readonly strokeColor = 'white';
    private fieldCoordinates: FieldCoord[] = [];
    private readonly symbol: ['X','O'] = ['X', 'O'];
    private playerIndex: number;
    private positions: boolean[] = new Array(9).fill(false);
    private player: string;
    private ctx: CanvasRenderingContext2D;
    private posXOffset: number;
    private posYOffset: number;

    constructor( private canvas: Canvas ) {
        this.playerIndex = Math.random() > 0.5 ? 1 : 0;
        this.player = this.symbol[this.playerIndex];
        this.update = this.update.bind(this);
        this.canvas.listenForClicks(this.update);
        this.ctx = this.canvas.ctx!;
        this.posXOffset = this.canvas.size.width / 2 - ((this.COLUMNS * this.FIELD_WIDTH) * 0.5);
        this.posYOffset = this.canvas.size.height / 2 - ((this.ROWS * this.FIELD_HEIGHT) * 0.5);
    }

    draw(): void {
        this.ctx.strokeStyle = this.strokeColor;
        
        for(let y = 0; y < this.ROWS; y++) {
            for(let x = 0; x < this.COLUMNS; x++) {

                const psX = (x * this.FIELD_WIDTH) + this.posXOffset; 
                const psY = (y * this.FIELD_HEIGHT) + this.posYOffset;

                this.fieldCoordinates.push({
                    fieldX: psX,
                    fieldY: psY, 
                    id: ++this.countID,
                });

                this.ctx.strokeRect(psX, psY, this.FIELD_WIDTH, this.FIELD_HEIGHT);
            }
        }
    }

    setPlayerSymbol() {
        this.playerIndex = ++this.playerIndex & 1 ? 1 : 0;
        this.player = this.symbol[this.playerIndex];
    }

    update(): void {
        this.setPlayerSymbol();
        const { mousex, mousey } = this.canvas.mousePositions;
        const currentField = Math.floor((mousex! - this.posXOffset) / this.FIELD_WIDTH);

        if (this.positions[currentField]) return;

        this.positions[currentField] = true;
    }
    
    init(): void {
        this.draw();
    }
}

function render() {
    const myCanvas: Canvas = new Canvas();
    const game = new TicTacToe(myCanvas);
    game.init();
}

window.onload = render;
