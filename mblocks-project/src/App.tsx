import { useEffect, useState } from 'react'
import './App.css'
import { EBlockCode, EBlockName, EBlockType, EVariableType, Registers, TBlock, TCustomBlock, Variable } from './Types'
import { RegisterCounter } from './components/RegisterCounter'
import blockOptions from './layout/BlockOptions'
import { VariableSetter } from './components/VariableSetter'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid';
import BaseBlock from './components/blocks/BaseBlock'
import { LabelInputModal } from './components/LabelInputModal'
import { UseMarieInputModal } from './components/UseMarieInputModal'
import customBlockOptions from './layout/CustomBlockOptions'
import { useMarie } from './hooks/useMarie'

function App() {

  const [blocks, setBlocks] = useState<TBlock[]>([])
  const [variables, setVariables] = useState<Variable[]>([])
  const [assemblyStr, setAssemblyStr] = useState<string>('')
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false)
  const [showInputModal, setShowInputModal] = useState<boolean>(false)

  const { registers, step, run, setRegisters, stop } = useMarie(blocks, variables, setShowInputModal);
  console.log(registers)

  const [activeTab, setActiveTab] = useState<string>("MARIE");

  const assemblyCode = () => {
    let str: string = '';
    blocks.forEach((block, index) => {
      if (block.type === EBlockType.LABEL) {
        str += `${block.label?.name}, `
        return
      }
      if (block.code === EBlockCode.SKIPCOND) {
        const valueStr = block.value ? block.value.toString(16).padStart(3, "0") : "000";
        str += `${block.name} ${valueStr}\n`;
        return;
      }
      if (block.code === EBlockCode.JUMP) {
        const newLine = `${block.name} ${block.label ? block.label.name : ''} \n`
        str += newLine
        return;
      }
      const newLine = `${block.name} ${block.variable ? block.variable.name : ''} \n`
      str += newLine
    })

    // add the variables declaration at the bottom
    str += '\n'
    variables.forEach((variable) => {
      const newLine = `${variable.name}, ${variable.type} ${variable.value} \n`
      str += newLine
    })
    setAssemblyStr(str)
  }

  useEffect(() => {
    assemblyCode();

  }, [blocks, variables])

  const cleanAll = () => {
    setBlocks([]);
    setVariables([]);
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

  const handleAddCustomBlock = (block: TCustomBlock) => {
    return null;
  }

  const handleOnDragEnd = (result: any) => {
    const { destination, source } = result
    if (!destination) return
    //update order
    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(source.index, 1)
    newBlocks.splice(destination.index, 0, removed)
    setBlocks(newBlocks)
  }


  const handleNewVariable = () => {
    const newVariable = {
      name: `var${variables.length}`,
      type: EVariableType.DEC,
      value: 0x0,
    };

    setVariables([...variables, newVariable]);
  }

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
                label: {name: label},
                description: 'Label'
              };

              setBlocks([...blocks, newBlock]);
              setShowLabelModal(false);
            }}
          />
        )
        }
        {showInputModal && (
          <UseMarieInputModal
            onCancel={() => setShowInputModal(false)}
            onConfirm={(input) => {

              setRegisters({
                ...registers,
                IN: input,
                AC: input,
              });
              setShowInputModal(false);
            }}
          />
        )
        }
        <div id='left-side' className='bg-white flex md:grid md:grid-rows-4 shadow-lg divide-y drop-shadow-xl'>
          <div id='block-options' className='row-span-4 flex flex-col'>
            <div className='flex justify-center'>
              <button
                className={`px-4 py-2 w-full ${activeTab === "MARIE" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-slate-300"
                  }`}
                onClick={() => setActiveTab("MARIE")}
              >
                MARIE
              </button>
              <button
                className={`px-4 py-2 w-full ${activeTab === "Custom" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-slate-300"
                  }`}
                onClick={() => setActiveTab("Custom")}
              >
                Custom
              </button>
            </div>
            <div className='grid grid-cols-2 flex-1 gap-1 bg-slate-200 p-0.5 pt-2'>
              {activeTab === "MARIE" && (
                Object.values(blockOptions).map((block, index) => {
                  return (
                    <div className='flex justify-center items-center max-h-32' key={index}>
                      <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full h-full rounded-lg shadow-md`}
                        onClick={() => handleAddBlock(block)}
                      >
                        {block.name}
                      </button>
                    </div>
                  )
                }))
              }
              {activeTab === "Custom" && (
                Object.keys(customBlockOptions).map((key, index) => {
                  const block = customBlockOptions[key as keyof typeof customBlockOptions]

                  return (
                    <div className='flex justify-center items-center max-h-32' key={index}>
                      <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full h-full rounded-lg shadow-md'
                        // onClick={() => handleAddCustomBlock()}
                      >
                        {key}
                      </button>
                    </div>
                  )
                })
              )
              }
            </div>
          </div>
          <div id='registers' className='flex flex-row justify-between align-middle text-center bg-slate-100'>
            <div className='row-span-1 w-full grid lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-1 gap-3 p-6 items-center justify-center'>
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
        <div id='right-side' className='bg-white grid grid-rows-4 divide-y-2 overflow-auto shadow-lg drop-shadow-xl'>
          <div className='row-span-3 font-bold overflow-auto bg-slate-100 shadow-md relative'>
            <h1 className='p-1 pl-2'>Assembly Code</h1>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md mb-4 disabled:bg-blue-300'
              disabled={blocks.length === 0}
              onClick={() => {
                navigator.clipboard.writeText(assemblyStr);
                alert("Copied to clipboard!");
              }}>
              Copy
            </button>
              
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md mb-4 disabled:bg-blue-300'
              disabled={blocks.length === 0 && variables.length === 0}
              onClick={cleanAll}>
              Clean All
            </button>
            <button
             className=' bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded shadow-md mb-4 w-20 absolute bottom-1 ml-auto mr-auto left-0 right-0 text-center'
             onClick={step}
             >
              Step
            </button>
            <button
             className=' bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded shadow-md mb-4 w-20 absolute bottom-1 left-4 text-center'
             onClick={run}
             >
              Run
            </button>
            <button
             className=' bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md mb-4 absolute bottom-1 right-4 w-20 text-center'
             onClick={stop}
             >
              Stop
            </button>
            <textarea className='w-full h-full bg-slate-200 max-h-full p-2' value={assemblyStr} readOnly></textarea>
          </div>

          <div id='variables' className='row-span-1 py-2 px-4 shadow-2xl overflow-auto bg-slate-100'>
            <div className='flex flex-col justify-center align-middle gap-2'>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-52"
                onClick={handleNewVariable}
              >
                Add Variable
              </button>
              <div className="flex flex-col gap-2">
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