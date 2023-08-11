import store from '../redux/store'
import { toHex } from '../utils/hex'
import FONT_SET from '../data/FONT_SET'
import INSTRUCTION_SET from '../data/INSTRUCTION_SET'

class CPU
{
    #display; #memory; #registers; #stack; #ST; #DT; #I; #SP; #PC; #memoryOffset; #keyboard; #buzzer; #halted = false;

    constructor(display, keyboard, buzzer)
    {
        this.#display = display;
        this.#keyboard = keyboard;
        this.#buzzer = buzzer;
        this.#memoryOffset = 0x200;
    }

    #reset()
    {   
        this.#display.clear(); //clear the screen
        this.#memory = new Uint8Array(4096);
        this.#registers = new Uint8Array(16);
        this.#stack = new Uint16Array(16);
        this.#ST = 0;
        this.#DT = 0;
        this.#I = 0;
        this.#SP = -1;
        this.#PC = this.#memoryOffset;
        this.#halted = false;

        // Load sprites into memory
        for(let i = 0; i < FONT_SET.length; i++)
        {
            this.#memory[i] = FONT_SET[i];
        }

        //Reset redux state
        store.dispatch({type: 'reset'});
    }

    #dispatchInstructions(rawInstruction)
    {
        let { address, opcode, args } = rawInstruction;
        address = toHex(address, 4);
        opcode = toHex(opcode, 4);
        args = (args.length) ? args.map(v => toHex(v)) : args;

        store.dispatch({
            type: 'updateInstructions',
            payload: {...rawInstruction, address, opcode, args}
        });
    }

    #dispatchRegisters()
    {
        store.dispatch(
            {
                type: 'updateRegisters', 
                payload: {
                    registers: [...this.#registers].map(v => toHex(v, 2)),
                    ST: toHex(this.#ST, 2),
                    DT: toHex(this.#DT, 2),
                    I: toHex(this.#I, 4),
                    SP: toHex(this.#SP, 2),
                    PC: toHex(this.#PC, 4)
                }});
    }

    #dispatchRomBuffer(data)
    {
        store.dispatch({
            type: 'updateRomData',
            payload: data
        });
    }

    loadProgramIntoMemory(program)
    {
        this.#reset();

        for(let i = 0; i < program.length; i++)
        {
            this.#memory[this.#memoryOffset + i] = program[i];
        }
        
        this.#dispatchRomBuffer(program);
    }

    #nextInstruction()
    {
        this.#PC += 2;
    }

    #skipInstruction()
    {
        this.#PC += 4;
    }

    #fetch_opcode()
    {
        // 16-bit opcode by adding two bytes
        return (this.#memory[this.#PC] << 8) | (this.#memory[this.#PC + 1]);
    }

    #decodeInstruction(opcode)
    {
        const instruction = INSTRUCTION_SET.find(instr => 
            instr.bit_pattern === (opcode & instr.bit_mask));
        
        // Args bitmask
        const addr = opcode & 0x0FFF;
        const byte = opcode & 0x00FF;
        const x = (opcode & 0x0F00) >> 8;
        const y = (opcode & 0x00F0) >> 4;
        const n = opcode & 0x000F;

        // instruction args
        let instrArgs = [];

        if(instruction)
        {
            if(instruction.args_template.length)
            instruction.args_template.forEach(v => {
                switch(v)
                {
                    case 'addr':
                        instrArgs.push(addr);
                        break;
                    case 'byte':
                        instrArgs.push(byte);
                        break;
                    case 'x':
                        instrArgs.push(x);
                        break;
                    case 'y':
                        instrArgs.push(y);
                        break;
                    case 'n':
                        instrArgs.push(n);
                        break;
                    default:
                        throw new Error(`Error while decoding Instruction: ${instruction.name}, *${v}* argument isn't implemented`);
                }
            });
        
            // Address - Opcode - Name - Type - Args
            return { 
                address: this.#PC,
                opcode: opcode,
                name: instruction.name,
                type: instruction.type,
                args: instrArgs
            }
        }
        else
        {
            return { 
                address: this.#PC,
                opcode: opcode,
                name: 'unknown',
                type: 'unknown',
                args: []
            }
        }
    }

    #executeInstruction(instruction)
    {
        this.#dispatchInstructions(instruction);

        switch (instruction.name) {
            case 'CLS':
                this.#display.clear();
                this.#nextInstruction();
                break;
            case 'RET':
                if(this.#SP === -1)
                    throw new Error('SP: Stack underflow');

                this.#PC = this.#stack[this.#SP];
                this.#SP--;
                break;
            case 'JP_ADDR':
                this.#PC = instruction.args[0];
                break;
            case 'CALL_ADDR':
                if(this.#SP === 15)
                    throw new Error('SP: Stack overflow');

                this.#SP++;
                this.#stack[this.#SP] = this.#PC + 2;
                this.#PC = instruction.args[0];
                break;
            case 'SE_VX_BYTE':
                if(this.#registers[instruction.args[0]] === instruction.args[1])
                    this.#skipInstruction();
                else
                    this.#nextInstruction();
                break;
            case 'SNE_VX_BYTE':
                if(this.#registers[instruction.args[0]] !== instruction.args[1])
                    this.#skipInstruction();
                else
                    this.#nextInstruction();
                break;
            case 'SE_VX_VY':
                if(this.#registers[instruction.args[0]] === this.#registers[instruction.args[1]])
                    this.#skipInstruction();
                else
                    this.#nextInstruction();
                break;
            case 'LD_VX_BYTE':
                this.#registers[instruction.args[0]] = instruction.args[1];
                this.#nextInstruction();
                break;
            case 'ADD_VX_BYTE':
                this.#registers[instruction.args[0]] += instruction.args[1];
                this.#nextInstruction();
                break;
            case 'LD_VX_VY':
                this.#registers[instruction.args[0]] = this.#registers[instruction.args[1]];
                this.#nextInstruction();
                break;
            case 'OR_VX_VY':
                this.#registers[instruction.args[0]] |= this.#registers[instruction.args[1]];
                this.#nextInstruction();
                break;
            case 'AND_VX_VY':
                this.#registers[instruction.args[0]] &= this.#registers[instruction.args[1]];
                this.#nextInstruction();
                break;
            case 'XOR_VX_VY':
                this.#registers[instruction.args[0]] ^= this.#registers[instruction.args[1]];
                this.#nextInstruction();
                break;
            case 'ADD_VX_VY':
                this.#registers[0xF] = (this.#registers[instruction.args[0]] > 0xFF) ? 1 : 0;
                this.#registers[instruction.args[0]] += this.#registers[instruction.args[1]];
                this.#nextInstruction();
                break;
            case 'SUB_VX_VY':
                this.#registers[0xF] = (this.#registers[instruction.args[0]] > this.#registers[instruction.args[1]]) ? 1 : 0;
                this.#registers[instruction.args[0]] -= this.#registers[instruction.args[1]];
                this.#nextInstruction();
                break;
            case 'SHR_VX_VY':
                this.#registers[0xF] = (this.#registers[instruction.args[0]] & 0x1);
                this.#registers[instruction.args[0]] >>= 1;
                this.#nextInstruction();
                break;
            case 'SUBN_VX_VY':
                this.#registers[0xF] = (this.#registers[instruction.args[1]] > this.#registers[instruction.args[0]]) ? 1 : 0;
                this.#registers[instruction.args[0]] = this.#registers[instruction.args[1]] - this.#registers[instruction.args[0]];
                this.#nextInstruction();
                break;
            case 'SHL_VX_VY':
                this.#registers[0xF] = (this.#registers[instruction.args[0]] >> 7) ? 1 : 0;
                this.#registers[instruction.args[0]] <<= 1;
                this.#nextInstruction();
                break;
            case 'SNE_VX_VY':
                if(this.#registers[instruction.args[0]] !== this.#registers[instruction.args[1]])
                    this.#skipInstruction();
                else
                    this.#nextInstruction();
                break;
            case 'LD_I_ADDR':
                this.#I = instruction.args[0];
                this.#nextInstruction();
                break;
            case 'JP_V0_ADDR':
                this.#PC = instruction.args[0] + this.#registers[0x0];
                break;
            case 'RND_VX_BYTE':
                this.#registers[instruction.args[0]] = Math.floor(Math.random() * 0xFF) & instruction.args[1];
                this.#nextInstruction();
                break;
            case 'DRW_VX_VY_N':
                const spriteHeight = instruction.args[2];
                const spriteWidth = 8;

                this.#registers[0xF] = 0; // collision flag

                for(let spriteRow = 0; spriteRow < spriteHeight; spriteRow++)
                {
                    const line = this.#memory[this.#I + spriteRow];
                    for(let spriteColumn = 0; spriteColumn < spriteWidth; spriteColumn++)
                    {
                        if(line & (1 << (7-spriteColumn))) // gets each bit from sprite line ( 1 << 7 = 10000000)
                            if(this.#display.setPixel(this.#registers[instruction.args[0]] + spriteColumn, this.#registers[instruction.args[1]] + spriteRow))
                                this.#registers[0xF] = 1; // set collision flag to 1 if a pixel has been erased
                    }
                }
                this.#nextInstruction();
                break;
            case 'SKP_VX':
                if(this.#keyboard.isKeyPressed(this.#registers[instruction.args[0]]))
                    this.#skipInstruction();
                else
                    this.#nextInstruction();
                break;
            case 'SKNP_VX':
                if(!this.#keyboard.isKeyPressed(this.#registers[instruction.args[0]]))
                    this.#skipInstruction();
                else
                    this.#nextInstruction();
                break;
            case 'LD_VX_DT':
                this.#registers[instruction.args[0]] = this.#DT;
                this.#nextInstruction();
                break;
            case 'LD_VX_K':
                this.#halted = true;

                this.#keyboard.onNextKeyPress = function(key) {
                    this.#registers[instruction.args[0]] = key;
                    this.#halted = false;
                    this.#nextInstruction();
                }.bind(this);
                break;
            case 'LD_DT_VX':
                this.#DT = this.#registers[instruction.args[0]];
                this.#nextInstruction();
                break;
            case 'LD_ST_VX':
                this.#ST = this.#registers[instruction.args[0]];
                this.#nextInstruction();
                break;
            case 'ADD_I_VX':
                this.#I += this.#registers[instruction.args[0]];
                this.#nextInstruction();
                break;
            case 'LD_F_VX':
                this.#I = this.#registers[instruction.args[0]] * 5;
                this.#nextInstruction();
                break;
            case 'LD_B_VX':
                const Vx = this.#registers[instruction.args[0]];
                this.#memory[this.#I] = parseInt(Vx / 100);
                this.#memory[this.#I + 1] = parseInt((Vx % 100) / 10);
                this.#memory[this.#I + 2] = parseInt(Vx % 10);
                this.#nextInstruction();
                break;
            case 'LD_I_VX':
                for(let index = 0; index <= instruction.args[0]; index++)
                    this.#memory[this.#I + index] = this.#registers[index];
                
                this.#nextInstruction();
                break;
            case 'LD_VX_I':
                for(let index = 0; index <= instruction.args[0]; index++)
                    this.#registers[index] = this.#memory[this.#I + index];

                this.#nextInstruction();
                break;
            default:
                throw new Error(`Executing unknown opcode: ${toHex(instruction.opcode, 4)}`);
        }

        this.#dispatchRegisters();
    }

    cycle()
    {
        if(!this.#halted)
        {
            const opcode = this.#fetch_opcode();
            const instruction = this.#decodeInstruction(opcode);
            this.#executeInstruction(instruction);
        }
    }

    updateTimers()
    {
        if(!this.#halted)
        {
            if (this.#ST > 0)
            {
                this.#buzzer.play();
                this.#ST--;
            }
            else
            {
                this.#buzzer.stop();
            }

            if (this.#DT > 0) this.#DT--;
        }
    }
    
}

export default CPU;