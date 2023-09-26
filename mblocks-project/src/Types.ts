export type TBlock = {
    code: number
    name?: string;
    description?: string;
    type: EBlockType;
    value?: number;
    
}

export enum EBlockType {
    OPERATION = 'operation',
    VALUE = 'value',
    VARIABLE = 'variable',
    LABEL = 'label',
    COMMAND = 'command',
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

