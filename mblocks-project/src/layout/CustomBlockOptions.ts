import { EVariableType, TBlock, TCustomBlock, Variable } from "../Types";
import blockOptions from "./BlockOptions";

interface customBlock{
    blockList: TBlock[],
    variables: Variable[],
}

const MultiplyBlock: TCustomBlock = {
    fields: [
        {name: "X", type: EVariableType.DEC, value: 0x000},
    ],
}

const customBlockOptions: Record<string, TBlock[]> = {
    Multiply: [
        blockOptions.Load,
        // / check if Y is negative, if -ve negate Y and set negative flag
        {...blockOptions.SkipCond, value: 0x000},
        {...blockOptions.Jump, label: "nonneg"},
    ]
}

export default customBlockOptions;
