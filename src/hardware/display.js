class DISPLAY
{
    #frameBuffer; #canvas; #canvasContext; #cols; #rows; #pixelWidth; #pixelHeight; #showDisplayGrid = false;
    constructor()
    {
        this.#canvas = document.querySelector('canvas');
        this.#canvasContext = this.#canvas.getContext('2d');
        this.#cols = 64;
        this.#rows = 32;
        this.#frameBuffer = new Array(this.#rows).fill().map(() => new Array(this.#cols).fill(0));  //Create and initialize display matrix
        this.#pixelWidth = this.#canvas.width / this.#cols;
        this.#pixelHeight = this.#canvas.height / this.#rows;
        this.drawFlag = false;
    }

    draw()
    {
        this.#canvasContext.beginPath();
        this.#canvasContext.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        for(let y = 0; y < this.#frameBuffer.length; y++)
        {
            for(let x = 0; x < this.#frameBuffer[y].length; x++)
            {
                if(this.#frameBuffer[y][x])
                {
                    this.#canvasContext.fillStyle = '#333';
                    this.#canvasContext.fillRect((x * this.#pixelWidth), (y * this.#pixelHeight), this.#pixelWidth, this.#pixelHeight);
                    
                }
                if(this.#showDisplayGrid)
                {
                    this.#canvasContext.lineWidth = 0.65;
                    this.#canvasContext.strokeStyle= '#2563EB';
                    this.#canvasContext.strokeRect((x * this.#pixelWidth), (y * this.#pixelHeight), this.#pixelWidth, this.#pixelHeight);
                }
            }
            this.drawFlag = false;
        }
    }

    showGrid(value)
    {
        this.#showDisplayGrid = value;
    }

    clear()
    {
        this.#frameBuffer = new Array(this.#rows).fill().map(() => new Array(this.#cols).fill(0));
        this.drawFlag = true;
    }

    setPixel(x, y)
    {
        if(x >= this.#cols)
            x -= this.#cols;
        else if(x < 0)
            x += this.#cols;

        if(y >= this.#rows)
            y -= this.#rows;
        else if(y < 0)
            y += this.#rows;

        this.drawFlag = true;
        this.#frameBuffer[y][x] ^= 1;

        return !this.#frameBuffer[y][x];
    }
}

export default DISPLAY;