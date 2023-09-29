import { EBlockName, EBlockType, TBlock, Variable } from "../Types"

type BlockProps = {
    block: TBlock,
    variables: Variable[],
    index: number,
    blocks: TBlock[],
    setBlocks: React.Dispatch<React.SetStateAction<TBlock[]>>
}

export const Block: React.FC<BlockProps> = (props) => {
    const removeItself = () => {
        const newBlocks = props.blocks.filter((_, i) => i !== props.index)
        props.setBlocks(newBlocks)
    }

    const blockType = props.block.type;

    if (blockType === EBlockType.COMMAND || blockType === EBlockType.LABEL) return (
        <div className="flex justify-center">
            <div className={"p-5 bg-gray-100 flex justify-between items-center rounded w-full max-w-2xl"}>

                <div className="flex-1">
                <h1 className="font-semibold flex-1">{props.block.name}</h1>
    
                </div>                

                <button
                    onClick={() => removeItself()}
                    className="rounded p-2 bg-red-500 hover:bg-red-700 text-white w-8 h-full justify-self-end">
                    X
                </button>
            </div>
        </div>

    )


    return (
        <div className="flex justify-center">
            <div className={"p-5 bg-gray-100 grid grid-cols-3 items-center rounded w-full max-w-2xl"}>
                <h1 className="font-semibold">{props.block.name}</h1>
                <select className="rounded p-2 bg-gray-200 hover:bg-gray-400 text-black w-40 mr-8 "
                    onChange={(e) => {
                        const newBlocks = [...props.blocks]
                        newBlocks[props.index].variable = props.variables.find((variable: Variable) => variable.name === e.target.value)
                        props.setBlocks(newBlocks)
                    }}
                >
                    {props.variables.map((variable, index) => {
                        return (
                            <option key={index} value={variable.name}>{variable.name}</option>
                        )
                    })}
                </select>

                <button
                    onClick={() => removeItself()}
                    className="rounded p-2 bg-red-500 hover:bg-red-700 text-white w-8 h-full justify-self-end">
                    X
                </button>
            </div>

        </div>
    )
}
