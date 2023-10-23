import { TBlock, Variable } from "../../Types"

interface VariableSelectProps {
    block: TBlock,
    blocks: TBlock[],
    setBlocks: React.Dispatch<React.SetStateAction<TBlock[]>>
    variables: Variable[],
}

export const VariableSelect: React.FC<VariableSelectProps> = (props) => {
    const { block, blocks, setBlocks, variables } = props
    console.log(variables)


    return (
        <select className="rounded p-2 bg-gray-200 hover:bg-gray-400 text-black w-40 mr-8 "
            value={block.variable?.name}
            onChange={(e) => {
                const newBlocks = [...blocks]
                newBlocks[blocks.indexOf(block)].variable = variables.find((variable: Variable) => variable.name === e.target.value)
                setBlocks(newBlocks)
            }}
        >
            <option value={undefined}></option>
            {variables.map((variable: Variable) => (
                <option key={variable.name} value={variable.name}>{variable.name}</option>
            ))
            }

        </select>
    )
}
