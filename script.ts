class Canvas {
    private canvas: HTMLCanvasElement;
    private cvW: number;
    private cvH: number;
    private mousePosition: { mousex: number | null, mousey: number | null } = { mousex: null, mousey: null };

    constructor() {
        this.canvas = document.querySelector('#cv')!;
        this.cvH = this.canvas.height = window.innerHeight; 
        this.cvW = this.canvas.width = window.innerWidth;
    }

    get ctx(): CanvasRenderingContext2D { return this.canvas.getContext('2d')! }

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

class TicTacToe {
    private readonly FIELD_WIDTH = 150;
    private readonly FIELD_HEIGHT = 150;
    private readonly COLUMNS = 3;
    private readonly ROWS = 3;
    private countID: number = 0;
    private readonly strokeColor = 'white';
    private readonly symbol: ['X','O'] = ['X', 'O'];
    private playerIndex: number;
    private positions = new Array(this.COLUMNS * this.ROWS);
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
        this.posXOffset = this.canvas.size.halfX - ((this.COLUMNS * this.FIELD_WIDTH) * 0.5);
        this.posYOffset = this.canvas.size.halfY - ((this.ROWS * this.FIELD_HEIGHT) * 0.5);
    }

    private draw(): void {
        this.ctx.strokeStyle = this.strokeColor;
        
        for(let y = 0; y < this.ROWS; y++) {
            for(let x = 0; x < this.COLUMNS; x++) {
                const psX = (x * this.FIELD_WIDTH) + this.posXOffset; 
                const psY = (y * this.FIELD_HEIGHT) + this.posYOffset;
                this.ctx.strokeRect(psX, psY, this.FIELD_WIDTH, this.FIELD_HEIGHT);
            }
        }
    }

    private setPlayerSymbol() {
        this.playerIndex = ++this.playerIndex & 1 ? 1 : 0;
        this.player = this.symbol[this.playerIndex];
    }

    private setCurrentFieldIndex() {
        const { mousex, mousey } = this.canvas.mousePositions;

        if (typeof mousex === 'number' && typeof mousey === 'number') {
            // check if mouse is outside the grid
            if (
                mousex <= this.posXOffset || 
                mousex >= this.posXOffset + (this.FIELD_WIDTH * this.COLUMNS) ||
                mousey <= this.posYOffset || 
                mousey >= this.posYOffset + (this.FIELD_HEIGHT * this.ROWS)
            ) return;
    
            const currentCol = Math.floor((mousex - this.posXOffset) / this.FIELD_WIDTH);
            const currentRow = Math.floor((mousey - this.posYOffset) / this.FIELD_HEIGHT);
            const currentIndex = currentCol + this.COLUMNS * currentRow;
        
            if (!this.positions[currentIndex]) this.positions[currentIndex] = this.player;
        }
    }

    update(): void {
        this.setPlayerSymbol();
        this.setCurrentFieldIndex();
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
