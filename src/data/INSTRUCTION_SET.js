const INSTRUCTION_SET = [
    {
        name: 'CLS',
        type: 'CLEAR',
        bit_pattern: 0x00E0,
        bit_mask: 0xFFFF,
        args_template: []
    },
    {
        name: 'RET',
        type: 'RETURN',
        bit_pattern: 0x00EE,
        bit_mask: 0xFFFF,
        args_template: []
    },
    {
        name: 'JP_ADDR',
        type: 'JUMP',
        bit_pattern: 0x1000,
        bit_mask: 0xF000,
        args_template: ['addr']
    },
    {
        name: 'CALL_ADDR',
        type: 'CALL',
        bit_pattern: 0x2000,
        bit_mask: 0xF000,
        args_template: ['addr']
    },
    {
        name: 'SE_VX_BYTE',
        type: 'SKIP',
        bit_pattern: 0x3000,
        bit_mask: 0xF000,
        args_template: ['x', 'byte']
    },
    {
        name: 'SNE_VX_BYTE',
        type: 'SKIP',
        bit_pattern: 0x4000,
        bit_mask: 0xF000,
        args_template: ['x', 'byte']
    },
    {
        name: 'SE_VX_VY',
        type: 'SKIP',
        bit_pattern: 0x5000,
        bit_mask: 0xF00F,
        args_template: ['x', 'y']
    },
    {
        name: 'LD_VX_BYTE',
        type: 'LOAD',
        bit_pattern: 0x6000,
        bit_mask: 0xF000,
        args_template: ['x', 'byte']
    },
    {
        name: 'ADD_VX_BYTE',
        type: 'ADD',
        bit_pattern: 0x7000,
        bit_mask: 0xF000,
        args_template: ['x', 'byte']
    },
    {
        name: 'LD_VX_VY',
        type: 'LOAD',
        bit_pattern: 0x8000,
        bit_mask: 0xF00F,
        args_template: ['x', 'y']
    },
    {
        name: 'OR_VX_VY',
        type: 'OR',
        bit_pattern: 0x8001,
        bit_mask: 0xF00F,
        args_template: ['x', 'y']
    },
    {
        name: 'AND_VX_VY',
        type: 'AND',
        bit_pattern: 0x8002,
        bit_mask: 0xF00F,
        args_template: ['x', 'y']
    },
    {
        name: 'XOR_VX_VY',
        type: 'XOR',
        bit_pattern: 0x8003,
        bit_mask: 0xF00F,
        args_template: ['x', 'y']
    },
    {
        name: 'ADD_VX_VY',
        type: 'ADD',
        bit_pattern: 0x8004,
        bit_mask: 0xF00F,
        args_template: ['x', 'y']
    },
    {
        name: 'SUB_VX_VY',
        type: 'SUB',
        bit_pattern: 0x8005,
        bit_mask: 0xF00F,
        args_template: ['x', 'y']
    },
    {
        name: 'SHR_VX_VY',
        type: 'SHR',
        bit_pattern: 0x8006,
        bit_mask: 0xF00F,
        args_template: ['x', 'y']
    },
    {
        name: 'SUBN_VX_VY',
        type: 'SUBN',
        bit_pattern: 0x8007,
        bit_mask: 0xF00F,
        args_template: ['x', 'y']
    },
    {
        name: 'SHL_VX_VY',
        type: 'SHL',
        bit_pattern: 0x800E,
        bit_mask: 0xF00F,
        args_template: ['x', 'y']
    },
    {
        name: 'SNE_VX_VY',
        type: 'SKIP',
        bit_pattern: 0x9000,
        bit_mask: 0xF00F,
        args_template: ['x', 'y']
    },
    {
        name: 'LD_I_ADDR',
        type: 'LOAD',
        bit_pattern: 0xA000,
        bit_mask: 0xF000,
        args_template: ['addr']
    },
    {
        name: 'JP_V0_ADDR',
        type: 'JUMP',
        bit_pattern: 0xB000,
        bit_mask: 0xF000,
        args_template: ['addr']
    },
    {
        name: 'RND_VX_BYTE',
        type: 'RND',
        bit_pattern: 0xC000,
        bit_mask: 0xF000,
        args_template: ['x', 'byte']
    },
    {
        name: 'DRW_VX_VY_N',
        type: 'DRAW',
        bit_pattern: 0xD000,
        bit_mask: 0xF000,
        args_template: ['x', 'y', 'n']
    },
    {
        name: 'SKP_VX',
        type: 'SKIP',
        bit_pattern: 0xE09E,
        bit_mask: 0xF0FF,
        args_template: ['x']
    },
    {
        name: 'SKNP_VX',
        type: 'SKIP',
        bit_pattern: 0xE0A1,
        bit_mask: 0xF0FF,
        args_template: ['x']
    },
    {
        name: 'LD_VX_DT',
        type: 'LOAD',
        bit_pattern: 0xF007,
        bit_mask: 0xF0FF,
        args_template: ['x']
    },
    {
        name: 'LD_VX_K',
        type: 'LOAD',
        bit_pattern: 0xF00A,
        bit_mask: 0xF0FF,
        args_template: ['x']
    },
    {
        name: 'LD_DT_VX',
        type: 'LOAD',
        bit_pattern: 0xF015,
        bit_mask: 0xF0FF,
        args_template: ['x']
    },
    {
        name: 'LD_ST_VX',
        type: 'LOAD',
        bit_pattern: 0xF018,
        bit_mask: 0xF0FF,
        args_template: ['x']
    },
    {
        name: 'ADD_I_VX',
        type: 'ADD',
        bit_pattern: 0xF01E,
        bit_mask: 0xF0FF,
        args_template: ['x']
    },
    {
        name: 'LD_F_VX',
        type: 'LOAD',
        bit_pattern: 0xF029,
        bit_mask: 0xF0FF,
        args_template: ['x']
    },
    {
        name: 'LD_B_VX',
        type: 'LOAD',
        bit_pattern: 0xF033,
        bit_mask: 0xF0FF,
        args_template: ['x']
    },
    {
        name: 'LD_I_VX',
        type: 'LOAD',
        bit_pattern: 0xF055,
        bit_mask: 0xF0FF,
        args_template: ['x']
    },
    {
        name: 'LD_VX_I',
        type: 'LOAD',
        bit_pattern: 0xF065,
        bit_mask: 0xF0FF,
        args_template: ['x']
    },
    ];
    
    export default INSTRUCTION_SET;