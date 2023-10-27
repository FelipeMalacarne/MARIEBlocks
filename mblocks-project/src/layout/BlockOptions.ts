import { EBlockCode, EBlockName, EBlockType, TBlock } from "../Types";

const blockOptions: Record<EBlockName, TBlock> = {
    Input: {
        code: EBlockCode.INPUT,
        name: EBlockName.INPUT,
        description: "Input a value from the keyboard into AC",
        type: EBlockType.COMMAND,
        value: 0,
    },
    Output: {
        code: EBlockCode.OUTPUT,
        name: EBlockName.OUTPUT,
        description: "Output the value in AC to the display",
        type: EBlockType.COMMAND,
    },
    Add: {
        code: EBlockCode.ADD,
        name: EBlockName.ADD,
        description: "Add the contents of address X to AC",
        type: EBlockType.OPERATION,
    },
    AddI: {
        code: EBlockCode.ADDI,
        name: EBlockName.ADDI,
        description: "Add indirect: Use the value at X as the actual address of the data operand to add to AC",
        type: EBlockType.OPERATION,
    },
    Subt: {
        code: EBlockCode.SUBT,
        name: EBlockName.SUBT,
        description: "Subtract the contents of address X from AC",
        type: EBlockType.OPERATION,
    },
    Load: {
        code: EBlockCode.LOAD,
        name: EBlockName.LOAD,
        description: "Load contents of address X into AC",
        type: EBlockType.OPERATION,
    },
    LoadI: {
        code: EBlockCode.LOADI,
        name: EBlockName.LOADI,
        description: "Load indirect: Use the value at X as the actual address of the data operand to load into AC",
        type: EBlockType.OPERATION,
    },
    Store: {
        code: EBlockCode.STORE,
        name: EBlockName.STORE,
        description: "Store the contents of AC at address X",
        type: EBlockType.OPERATION,
    },
    Jump: {
        code: EBlockCode.JUMP,
        name: EBlockName.JUMP,
        description: "Load the value of X into PC",
        type: EBlockType.OPERATION,
    },
    JumpI: {
        code: EBlockCode.JUMPI,
        name: EBlockName.JUMPI,
        description: "Jump indirect: Use the value at X as the actual address of the data operand to jump to",
        type: EBlockType.OPERATION,
    },
    Halt: {
        code: EBlockCode.HALT,
        name: EBlockName.HALT,
        description: "Terminate program",
        type: EBlockType.COMMAND,
    },
    Clear: {
        code: EBlockCode.CLEAR,
        name: EBlockName.CLEAR,
        description: "Put all zeros in AC",
        type: EBlockType.COMMAND,
    },
    SkipCond: {
        code: EBlockCode.SKIPCOND,
        name: EBlockName.SKIPCOND,
        description: "Skip next instruction on condition",
        type: EBlockType.OPERATION,
        value: 0x800
    },
    Label: {
        code: EBlockCode.LABEL,
        name: EBlockName.LABEL,
        description: "Label",
        type: EBlockType.LABEL,
    },
}

export default blockOptions;