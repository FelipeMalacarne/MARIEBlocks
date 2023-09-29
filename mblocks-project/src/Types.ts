export type TBlock = {
    code: number
    name?: EBlockName;
    description?: string;
    type: EBlockType;
    value?: number;
    variable?: Variable;

}
export enum EBlockType {
    OPERATION = 'operation',
    LABEL = 'label',
    COMMAND = 'command',
}

export enum EBlockName {
    INPUT = 'Input',
    OUTPUT = 'Output',
    ADD = 'Add',
    ADDI = 'AddI',
    SUBT = 'Subt',
    LOAD = 'Load',
    LOADI = 'LoadI',
    STORE = 'Store',
    JUMP = 'Jump',
    JUMPI = 'JumpI',
    HALT = 'Halt',
    CLEAR = 'Clear',
    SKIPCOND = 'SkipCond',
    LABEL = 'Label',
}

// block code
export enum EBlockCode {
    INPUT = 0x5,
    OUTPUT = 0x6,
    ADD = 0x3,
    ADDI = 0xb,
    SUBT = 0x4,
    LOAD = 0x1,
    LOADI = 0xd,
    STORE = 0x2,
    JUMP = 0x9,
    JUMPI = 0xc,
    HALT = 0x7,
    CLEAR = 0xa,
    SKIPCOND = 0x8,
    LABEL = 0x1009,
}

export enum EVariableType {
    HEX = 'hex',
    DEC = 'dec',
    OCT = 'oct',
    BIN = 'bin',
}

export type Variable = {
    name: string;
    type: EVariableType;
    value: number;
}

export type Registers = {
    AC: number;
    PC: number;
    MAR: number;
    MBR: number;
    IR: number;
}

export type Memory = {
    [key: number]: number;
}


