import { EVariableType, Variable } from "../Types"

type VariableSetterProps = {
    variables: Variable[],
    setVariables: React.Dispatch<React.SetStateAction<Variable[]>>
    index: number,
}

export const VariableSetter: React.FC<VariableSetterProps> = (props) => {
    const { variables, setVariables, index } = props;

    return (
        <div className="flex flex-row justify-between gap-2">
            <div className='flex flex-row justify-start gap-2' >
                <input
                    className="rounded p-2 bg-gray-200 hover:bg-gray-400 text-black w-20"
                    type="text"
                    value={variables[index].name}
                    onChange={(e) => {
                        const newVariables = [...variables]
                        newVariables[index].name = e.target.value
                        setVariables(newVariables)
                    }}
                />
                <select
                    className="rounded p-2 bg-gray-200 hover:bg-gray-400 text-black w-16"
                    value={variables[index].type}
                    onChange={(e) => {
                        const newVariables = [...variables]
                        newVariables[index].type = e.target.value as EVariableType
                        setVariables(newVariables)
                    }
                    }
                >
                    <option value={EVariableType.HEX}>Hex</option>
                    <option value={EVariableType.DEC}>Dec</option>
                    <option value={EVariableType.BIN}>Bin</option>
                    <option value={EVariableType.OCT}>Oct</option>
                </select>
                <input
                    className="rounded p-2 bg-gray-200 hover:bg-gray-400 text-black w-16"
                    type="number"
                    value={variables[index].value}
                    onChange={(e) => {
                        const newVariables = [...variables]
                        newVariables[index].value = Number(e.target.value)
                        setVariables(newVariables)
                    }}
                    max={4095}
                />
            </div>
            <button
                className="rounded p-2 bg-red-500 hover:bg-red-700 text-white"
                onClick={() => {
                    const newVariables = variables.filter((_, i) => i !== index)
                    setVariables(newVariables)
                }}
            >
                X
            </button>
        </div>
    )
}
