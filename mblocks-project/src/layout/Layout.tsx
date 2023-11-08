import { useState } from "react"
import { EBlockType, EVariableType, TBlock, Variable } from "../Types"
import { Block } from "../components/blocks/Block"
import blockOptions from "./BlockOptions"

export const Layout: React.FC = () => {

    const [blocks, setBlocks] = useState<TBlock[]>([])
    const [variables, setVariables] = useState<Variable[]>([])

    const [registers, setRegisters] = useState({
        AC: 0x0,
        MAR: 0x0,
        MBR: 0x0,
        PC: 0x0,
        IR: 0x0,
        INREG: 0x0,
        OUTREG: 0x0,
    })

    // set AC
    const setAC = (value: number) => {
        setRegisters({
            ...registers,
            AC: value,
        })
    }

    const removeItself = (index: number) => {
        const newBlocks = blocks.filter((block, i) => i !== index)
        setBlocks(newBlocks)
    }

    return (
        <div className="flex flex-wrap w-full h-screen">
            <div id="side™" className="w-full sm:w-1/4 p-4 bg-gray-200">
                <div className="bg-gray-200 p-4 flex flex-col justify-center align-middle gap-2">
                    <h1 className="text-2xl font-semibold">
                        {/* Left Tab */}
                    </h1>
                    {blockOptions.map((block, index) => {
                        return (
                            <div key={index} className="flex flex-row justify-center">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-52 disabled:bg-gray-400 ≈ "
                                    onClick={() => setBlocks([...blocks, block])}
                                    // disabled when last type is equal to block type
                                    disabled={block.type === EBlockType.VARIABLE && variables.length === 0 || blocks.length > 0 && blocks[blocks.length - 1].type === block.type}
                                >
                                    {block.name}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="w-full sm:w-1/2 p-4 flex flex-col">

                <div className="bg-white p-4 flex-1">
                    <h1 className="text-2xl font-semibold">
                        {/* Main Content */}
                    </h1>
                    {/* grid split in half */}
                    <div className="grid grid-cols-3 gap-4 overflow-scroll">
                        {blocks.map((block, index) => {
                            return (
                                <div className="w-full">
                                    <Block
                                        key={index}
                                        block={block}
                                        blocks={blocks}
                                        setBlocks={setBlocks}
                                        variables={variables}
                                        index={index}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
                {/* variable declaration */}
                <div className="bg-gray-200 p-4 flex-auto">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-52"
                        onClick={() => setVariables([...variables, { name: "var", type:EVariableType.DEC, value: 0x0 }])}
                    >
                        Add Variable
                    </button>
                    <div className="grid grid-cols-3 gap-2 h-4 p-4">
                        {variables.map((variable, index) => {
                            return (
                                <div className="flex justify-center mt-3 gap-3 bg-white">
                                    <input
                                        className="p-2 text-black w-32"
                                        type="text"
                                        value={variable.name}
                                        onChange={(e) => {
                                            const newVariables = variables.map((variable, i) => {
                                                if (i === index) {
                                                    return {
                                                        ...variable,
                                                        name: e.target.value,
                                                    }
                                                }
                                                return variable
                                            })
                                            setVariables(newVariables)
                                        }}
                                    />
                                    <input
                                        className="p-2 text-black w-32"
                                        type="text"
                                        value={variable.value}
                                        onChange={(e) => {
                                            const newVariables = variables.map((variable, i) => {
                                                if (i === index) {
                                                    return {
                                                        ...variable,
                                                        value: e.target.value,
                                                    }
                                                }
                                                return variable
                                            })
                                            setVariables(newVariables as Variable[])
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
            <div className="w-full sm:w-1/4 p-4">
                <div className="bg-gray-200 p-4">
                    <h1 className="text-2xl font-semibold">
                        {/* Right Tab */}
                    </h1>
                </div>
            </div>
        </div>
    )
}
