import CPU from './cpu'
import DISPLAY from './display'
import KEYBOARD from './keyboard'
import BUZZER from './buzzer'

class CHIP8
{
    #cpu; #display; #keyboard; #buzzer; #displayLoop; #cpuLoop; #initialVolume = -1; #debugMode = false;
    
    #initialize()
    {
        if(!this.#keyboard)
            this.#keyboard = new KEYBOARD();

        if(!this.#buzzer)
            this.#buzzer = new BUZZER();

        if(this.#buzzer && (this.#initialVolume !== -1))
        {
            this.#buzzer.setVolume(this.#initialVolume); this.#initialVolume = -1
        }

        if(!this.#display)
            this.#display = new DISPLAY();

        if(!this.#cpu && this.#display)
            this.#cpu = new CPU(this.#display, this.#keyboard, this.#buzzer);
    }

    #gameLoop()
    {
        if(this.#displayLoop)
        {
            clearInterval(this.#displayLoop);
            this.#displayLoop = null;
        }

        if(this.#cpuLoop)
        {
            clearInterval(this.#cpuLoop);
            this.#cpuLoop = null;
        }

        this.#displayLoop = setInterval(() => {
            if(this.#display.drawFlag);
                this.#display.draw();

            if(this.#cpu && this.#cpuLoop)
                this.#cpu.updateTimers();

        }, 1000/60); //60 Frames per second

        this.#cpuLoop = setInterval(() => {
            if(!this.#debugMode) {
                try {
                    this.#cpu.cycle();
                } catch (e)
                {
                    clearInterval(this.#displayLoop);
                    this.#displayLoop = null;

                    clearInterval(this.#cpuLoop);
                    this.#cpuLoop = null;

                    console.log(`Error: ${e}... Exiting game loop!`);
                    return;
                }
            }
        }, 1); //1Khz clock speed
    }
    
    start(rom)
    {
        if(rom && rom.length > 0)
        {
            this.#initialize();
            this.#cpu.loadProgramIntoMemory(rom);
            this.#gameLoop();

            if(this.#display && this.#displayLoop)
                document.getElementById('gridCheckbox').removeAttribute('disabled');
        }
    }

    changeVolume(volume)
    {
        if(this.#buzzer)
            this.#buzzer.setVolume(volume);
        else
            this.#initialVolume = volume;
    }

    debugMode(value)
    {
        this.#debugMode = value;
        document.getElementById('nextButton').style.display = (value) ? 'block' : 'none';
    }

    nextStep()
    {
        if(this.#cpu && this.#cpuLoop)
            this.#cpu.cycle();         
    }

    showDisplayGrid(value)
    {
        if(this.#display)
        {
            this.#display.showGrid(value);
            document.getElementById('hCanvasGrid').style.visibility = (value) ? 'visible' : 'hidden';
            document.getElementById('vCanvasGrid').style.visibility = (value) ? 'visible' : 'hidden';
        }
    }

}

export default CHIP8;