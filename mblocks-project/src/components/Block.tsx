import { EBlockType, TBlock, Variable } from "../Types"

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
        <div className={"p-5 bg-gray-100 flex justify-between rounded col-span-2"}>
            <h1 className="font-semibold">{props.block.name}</h1>
            <button
                onClick={() => removeItself()}
                className="rounded p-2 bg-red-500 hover:bg-red-700 text-white">
                X
            </button>
        </div>
    )

    if (blockType === EBlockType.VARIABLE) return (
        <div className={"p-5 bg-gray-100 flex justify-between items-centerrounded"}>
            <select className="rounded p-2 bg-gray-200 hover:bg-gray-400 text-black w-full mr-8 ">
                {props.variables.map((variable, index) => {
                    return (
                        <option key={index} value={variable.name}>{variable.name}</option>
                    )
                })}
            </select>
            <button
                onClick={() => removeItself()}
                className="rounded p-2 bg-red-500 hover:bg-red-700 text-white">
                X
            </button>
        </div>
    );

    if (blockType === EBlockType.VALUE) return (
        <div className={"p-5 bg-gray-100 flex justify-between gap-3 items-center rounded"}>
            <h1 className="font-semibold">{props.block.name}</h1>
            <input
                className="rounded p-2 bg-gray-200 hover:bg-gray-400 text-black w-full mr-8 "
                type="number"
                value={props.block.value}
                onChange={(e) => {
                    const newBlocks = [...props.blocks]
                    switch (props.block.name) {
                        case "HexValue":
                            newBlocks[props.index].value = Number('0x' + e.target.value)
                            break;
                        case "DecValue":
                            newBlocks[props.index].value = Number(e.target.value)
                            break;
                        case "OctValue":
                            newBlocks[props.index].value = Number('0o' + e.target.value)
                            break;
                        default:
                            break;
                    }
                    console.log(newBlocks)
                    props.setBlocks(newBlocks)
                }}
                max={4095}
            />
            <button
                onClick={() => removeItself()}
                className="rounded p-2 bg-red-500 hover:bg-red-700 text-white">
                X
            </button>
        </div>

    );

    return (
        <div className={"p-5 bg-gray-100 flex justify-between items-center rounded"}>
            <h1 className="font-semibold">{props.block.name}</h1>
            <button
                onClick={() => removeItself()}
                className="rounded p-2 bg-red-500 hover:bg-red-700 text-white">
                X
            </button>
        </div>
    )
}
