import { useEffect, useState } from 'react'
import './App.css'
import { EBlockType, EVariableType, Memory, Registers, TBlock, Variable } from './Types'
import { RegisterCounter } from './components/RegisterCounter'
import blockOptions from './layout/BlockOptions'
import { Block } from './components/Block'
import { VariableSetter } from './components/VariableSetter'

function App() {
  const [registers, setRegisters] = useState<Registers>({
    AC: 0x0453,
    MAR: 0x0,
    MBR: 0x0,
    PC: 0x0,
    IR: 0x0,
  })

  const [blocks, setBlocks] = useState<TBlock[]>([])
  const [variables, setVariables] = useState<Variable[]>([])
  const [disabledBlockOptions, setDisabledBlockOptions] = useState({
    operation: false,
    command: false,
    variable: false,
    value: false,
    label: false,
  })

  useEffect(() => {
    updateDisabledBlockOptions();



  }, [blocks, variables])

  const updateDisabledBlockOptions = () => {
    const newDisabledBlockOptions = {
      operation: false,
      command: false,
      variable: false,
      value: false,
      label: false,
    }

    if (variables.length === 0) {
      newDisabledBlockOptions.variable = true
    }

    if (blocks.length === 0) {
      newDisabledBlockOptions.variable = true
      newDisabledBlockOptions.value = true
    }

    if (blocks.length > 0) {
      const lastBlock = blocks[blocks.length - 1]

      // if operation block, disable all except variable and value, else disable variable and value
      if (lastBlock.type === EBlockType.OPERATION) {
        Object.keys(newDisabledBlockOptions).forEach((key) => {
          if (key !== "variable" && key !== "value") {
            newDisabledBlockOptions[key as keyof typeof newDisabledBlockOptions] = true
          }
        })
      } else {
        newDisabledBlockOptions.value = true
        newDisabledBlockOptions.variable = true
      }

      // block all after Halt
      if(lastBlock.code === 0x7){
        Object.keys(newDisabledBlockOptions).forEach((key) => {
          newDisabledBlockOptions[key as keyof typeof newDisabledBlockOptions] = true
        })
      }

    }
    setDisabledBlockOptions(newDisabledBlockOptions)
  }

  const handleAddBlock = (block: TBlock) => {
      setBlocks([...blocks, block])
  }


  return (
    <>
      {/* <Layout /> */}
      <div className='w-full h-screen md:grid md:grid-cols-4 flex flex-col'>
        <div id='left-side' className='bg-white grid grid-rows-4 shadow-lg divide-y'>
          <div id='block-options' className='row-span-3 grid grid-cols-2'>
            {blockOptions.map((block, index) => {
              return (
                <div className='flex justify-center align-middle' key={index}>
                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full h-full disabled:bg-gray-400 '
                    onClick={() => handleAddBlock(block)}
                    disabled={disabledBlockOptions[block.type]}
                  >
                    {block.name}
                  </button>
                </div>
              )
            })}
          </div>
          <div id='registers' className='bg-white flex flex-row justify-between align-middle text-center'>
            <div className='w-full grid lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-1 gap-3 p-6'>
              {Object.keys(registers).map((key, index) =>
                <RegisterCounter key={index} name={key} value={registers[key as keyof Registers]} />
              )}
            </div>
          </div>
        </div>
        <div className='col-span-2 bg-gray-200 overflow-auto py-2 px-4'>
          {/* center */}
          <div className="grid grid-cols-2 gap-2">
            {blocks.map((block, index) =>
              <Block key={index} block={block} variables={variables} index={index} blocks={blocks} setBlocks={setBlocks} />
            )}
          </div>
        </div>
        <div id='right-side' className='bg-white grid grid-rows-4 shadow-lg divide-y overflow-auto'>
          <div className='row-span-3'></div>
          <div id='variables' className='row-span-1 py-2 px-4'>
            <div className='flex flex-col justify-center align-middle gap-2'>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-52"
                onClick={() => setVariables([...variables, { name: "var", type: EVariableType.HEX, value: 0x0 }])}
              >
                Add Variable
              </button>
              <div className="flex flex-col gap-2 h-4 p-4">
                {variables.map((_, index) => {
                  return (
                    <VariableSetter variables={variables} setVariables={setVariables} index={index} key={index} />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
