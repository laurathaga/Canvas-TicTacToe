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

    constructor( private canvas: Canvas ) {
        this.playerIndex = Math.random() > 0.5 ? 1 : 0;
        this.player = this.symbol[this.playerIndex];
        this.setPlayerSymbol = this.setPlayerSymbol.bind(this);
        this.canvas.listenForClicks(this.setPlayerSymbol);
    }

    draw(): void {
        const ctx = this.canvas.ctx!;
        const { width, height } = this.canvas.size;

        const posXOffset = width / 2 - ((this.COLUMNS * this.FIELD_WIDTH) * 0.5);
        const posYOffset = height / 2 - ((this.ROWS * this.FIELD_HEIGHT) * 0.5);

        ctx.strokeStyle = this.strokeColor;
        
        for(let y = 0; y < this.ROWS; y++) {
            for(let x = 0; x < this.COLUMNS; x++) {
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

    setPlayerSymbol(): void{
        this.playerIndex = ++this.playerIndex & 1 ? 1 : 0;
        this.player = this.symbol[this.playerIndex];
    }

    update(): void{
        this.draw();
    }

    init(): void {
        this.update();
    }
}

function render() {
    const myCanvas: Canvas = new Canvas();
    const game = new TicTacToe(myCanvas);
    game.init();
}

window.onload = render;
