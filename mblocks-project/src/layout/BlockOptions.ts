import { EBlockType, TBlock } from "../Types";

const blockOptions: TBlock[] = [
    {
        code: 0x5,
        name: "Input",
        description: "Input a value from the keyboard into AC",
        type: EBlockType.COMMAND,
        value: 0,
    },
    {
        code: 0x6,
        name: "Output",
        description: "Output the value in AC to the display",
        type: EBlockType.COMMAND,
    },
    {
        code: 0x3,
        name: "Add",
        description: "Add the contents of address X to AC",
        type: EBlockType.OPERATION,
    },
    {
        code: 0x4,
        name: "Subt",
        description: "Subtract the contents of address X from AC",
        type: EBlockType.OPERATION,
    },
    {
        code: 0x1,
        name: "Load",
        description: "Load contents of address X into AC",
        type: EBlockType.OPERATION,
    },
    {
        code: 0x2,
        name: "Store",
        description: "Store the contents of AC at address X",
        type: EBlockType.OPERATION,
    },
    {
        code: 0x9,
        name: "Jump",
        description: "Load the value of X into PC",
        type: EBlockType.OPERATION,
    },
    {
        code: 0x7,
        name: "Halt",
        description: "Terminate program",
        type: EBlockType.COMMAND,
    },
    {
        code: 0x1000,
        name: "Variable",
        description: "Variable",
        type: EBlockType.VARIABLE,
    },
    {
        code: 0x1001,
        name: "HexValue",
        description: "Hex Value",
        type: EBlockType.VALUE,
        value: 0x0,
    },
    {
        code: 0x1002,
        name: "DecValue",
        description: "Decimal Value",
        type: EBlockType.VALUE,
        value: 0,
    },
    {
        code: 0x1003,
        name: "OctValue",
        description: "Octal Value",
        type: EBlockType.VALUE,
        value: 0,
    },
    {
        code: 0xB,
        name: "AddI",
        description: "Add indirect: Use the value at X as the actual address of the data operand to add to AC",
        type: EBlockType.OPERATION,
    },
    {
        code: 0xA,
        name: "Clear",
        description: "Put all zeros in AC",
        type: EBlockType.COMMAND,
    },
    {
        code: 0xC,
        name: "JumpI",
        description: "Jump indirect: Use the value at X as the actual address of the data operand to jump to",
        type: EBlockType.OPERATION,
    },
    {
        code: 0xD,
        name: "LoadI",
        description: "Load indirect: Use the value at X as the actual address of the data operand to load into AC",
        type: EBlockType.OPERATION,
    },
    {
        code: 0x8,
        name: "Skipcond",
        description: "Skip next instruction on condition",
        type: EBlockType.OPERATION,
    },
    {
        code: 0x1009,
        name: "Label",
        description: "Label",
        type: EBlockType.LABEL,
    }

];

export default blockOptions;