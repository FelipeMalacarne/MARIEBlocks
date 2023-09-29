import { useState } from "react"
import { EBlockName, EBlockType, Memory, Registers, TBlock } from "../Types"

export const useMarie = () => {

    const [registers, setRegisters] = useState<Registers>({
        AC: 0x0,
        MAR: 0x0,
        MBR: 0x0,
        PC: 0x0,
        IR: 0x0,
    })

    const [memory, setMemory] = useState<Memory>({})




    const run = (blocks: TBlock[]) => {
    }

    const step = (blocks: TBlock[]) => {
        try{
            const block = blocks[registers.PC]
            if(block.type === EBlockType.COMMAND){
                switch(block.name){
                    case EBlockName.INPUT:

                        registers.PC++;
                        break;
                    case EBlockName.OUTPUT:
                        alert(registers.AC)
                        registers.PC++;
                        break;
                    case EBlockName.HALT:
                        console.log('halt')
                        break;
                    case EBlockName.CLEAR:
                        registers.AC = 0x0
                        registers.PC++;
                        break;
                }
            }else if(block.type === EBlockType.OPERATION){
                switch(block.name){
                    case EBlockName.ADD:
                        registers.AC += registers.MBR

                        registers.PC++;
                        break;
                    case EBlockName.SUBT:
                        registers.AC -= registers.MBR
                        registers.PC++;
                        break;
                   
                }
            }
        }
        catch(e){
            console.log(e)
        }
    }

    const execInput = (blocks: TBlock[]) => {
        
    }



    const stepBack = (blocks: TBlock[]) => {

    }

    const reset = () => {

    }

    const assemble = (blocks: TBlock[]) => {

    }

  
  
  
  return {}
}

