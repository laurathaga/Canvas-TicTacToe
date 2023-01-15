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

        this.canvas.addEventListener('click', (event: MouseEvent) => {
            this.mousePosition = {
                mousex: event.pageX,
                mousey: event.pageY,
            };
        });
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
}

interface FieldCoord {
    fieldX: number;
    fieldY: number;
    id: number;
    value?: 'x' | 'o';
};

class TicTacToe {
    private readonly FIELD_WIDTH = 150;
    private readonly FIELD_HEIGHT = 150;
    private readonly COLUMNS = 3;
    private readonly ROWS = 3;
    private countID: number = 0;
    private readonly strokeColor = 'white';
    private fieldCoordinates: FieldCoord[] = [];

    constructor( private canvas: Canvas ) {}

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

    update(): void{

    }
}

const myCanvas: Canvas = new Canvas();
const game = new TicTacToe(myCanvas);

function render() {
    game.draw();
    // window.requestAnimationFrame(render);
}

window.onload = render;
