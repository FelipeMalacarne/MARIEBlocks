import { useEffect, useState } from 'react'
import './App.css'
import { EBlockCode, EBlockName, EBlockType, EVariableType, Registers, TBlock, Variable } from './Types'
import { RegisterCounter } from './components/RegisterCounter'
import blockOptions from './layout/BlockOptions'
import { VariableSetter } from './components/VariableSetter'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid';
import BaseBlock from './components/blocks/BaseBlock'
import { LabelInputModal } from './components/LabelInputModal'

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
  const [assemblyStr, setAssemblyStr] = useState<string>('')
  // const [memory, setMemory] = useState<Memory>({})
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false)
  const [disabledBlockOptions, setDisabledBlockOptions] = useState({
    operation: false,
    command: false,
    label: false,
  })

  const assemblyCode = () => {
    let str: string = '';
    blocks.forEach((block, index) => {
      if(block.type === EBlockType.LABEL) {
        str += `${block.label}, `
        return
      }
      if (block.code === EBlockCode.SKIPCOND) {
        const valueStr = block.value ? block.value.toString(16).padStart(3, "0") : "000";
        str += `${block.name} ${valueStr}\n`;
        return;
      }
      if( block.code === EBlockCode.JUMP ) {
        const newLine = `${block.name} ${block.label ? block.label : ''} \n`
        str += newLine
        return;
      }
      const newLine = `${block.name} ${block.variable ? block.variable.name : ''} \n`
      str += newLine
    })

    // add the variables declaration at the bottom
    variables.forEach((variable) => {
      const newLine = `${variable.name}, ${variable.type} ${variable.value} \n`
      str += newLine
    })
    setAssemblyStr(str)
  }

  useEffect(() => {
    updateDisabledBlockOptions();
    assemblyCode();

  }, [blocks, variables])

  const updateDisabledBlockOptions = () => {
    const newDisabledBlockOptions = {
      operation: false,
      command: false,
      label: false,
    }

    if (blocks.length > 0) {
      const lastBlock = blocks[blocks.length - 1]

      // block all after Halt
      if (lastBlock.code === 0x7) {
        Object.keys(newDisabledBlockOptions).forEach((key) => {
          newDisabledBlockOptions[key as keyof typeof newDisabledBlockOptions] = true
        })
      }
    }
    setDisabledBlockOptions(newDisabledBlockOptions)
  }

  const handleAddBlock = (block: TBlock) => {
    const newBlock: TBlock = {
      id: uuidv4(),
      ...block,
    };

    if (block.type === EBlockType.LABEL) {
      setShowLabelModal(true);
      return;
    }
    setBlocks([...blocks, newBlock]);
  };

  const handleOnDragEnd = (result: any) => {
    const { destination, source } = result
    if (!destination) return
    //update order
    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(source.index, 1)
    newBlocks.splice(destination.index, 0, removed)
    setBlocks(newBlocks)
  }

  console.log(blocks)

  return (
    <>
      {/* <Layout /> */}
      <div className='w-full h-screen md:grid md:grid-cols-4 flex flex-col'>
        {showLabelModal && (
          <LabelInputModal
            onCancel={() => setShowLabelModal(false)}
            onConfirm={(label) => {
              const newBlock: TBlock = {
                id: uuidv4(),
                code: EBlockCode.LABEL,
                type: EBlockType.LABEL,
                name: EBlockName.LABEL,
                label: label,
                description: 'Label'
              };

              setBlocks([...blocks, newBlock]);
              setShowLabelModal(false);
            }}
          />
        )
        }
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
            <div className='w-full grid lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-1 gap-3 p-6 items-center'>
              {Object.keys(registers).map((key, index) =>
                <RegisterCounter key={index} name={key} value={registers[key as keyof Registers]} />
              )}
            </div>
          </div>
        </div>
        <div className='col-span-2 bg-gray-100 overflow-auto py-2 px-4'>
          {/* center */}
          <DragDropContext onDragEnd={(result) => handleOnDragEnd(result)}>
            <Droppable droppableId='drBlocks'>
              {(provided) => (
                <div className='drBlocks grid grid-cols-1 gap-1' ref={provided.innerRef} {...provided.droppableProps}>
                  {blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id!} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <BaseBlock block={block} blocks={blocks} setBlocks={setBlocks} variables={variables} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div id='right-side' className='bg-white grid grid-rows-4 shadow-lg divide-y overflow-auto'>
          <div className='row-span-3 m-3 mb-10 font-bold'>
            <h1>Assembly Code</h1>
            <textarea className='w-full h-full m-2' value={assemblyStr} readOnly></textarea>

          </div>
          <div id='variables' className='row-span-1 py-2 px-4'>
            <div className='flex flex-col justify-center align-middle gap-2'>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-52"
                onClick={() => setVariables([...variables, { name: "var", type: EVariableType.DEC, value: 0x0 }])}
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
