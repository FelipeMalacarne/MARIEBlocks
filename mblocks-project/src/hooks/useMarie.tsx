import { useEffect, useState } from "react"
import { EBlockCode, EBlockName, EBlockType, EVariableType, Memory, Registers, TBlock, Variable } from "../Types"
import { parse } from "uuid";

interface MarieProps {
    blocks: TBlock[];
    variables: Variable[];
}


export const useMarie = (blocks: TBlock[], variables: Variable[]) => {

    const [registers, setRegisters] = useState<Registers>({
        AC: 0,
        MAR: 0,
        MBR: 0,
        PC: 0,
        IN: 0,
        OUT: 0,
        IR: "",
    })
    const [memory, setMemory] = useState<string[]>([]);
    const [halted, setHalted] = useState<boolean>(false);
    const [started, setStarted] = useState<boolean>(false);

    const run = () => {
        while (!halted) {
            step()
        }
    }

    const setVariableAddress = (variables: Variable[]) => {
        variables.forEach((variable, i) => {
            const variableAddress = blocks.length + i;
            variable.address = variableAddress;
        })
    }

    useEffect(() => {
        //set memory
        setVariableAddress(variables);
        const memory = blocks.map((block) => {
            const hexBlockCode = block.code.toString(16).substring(0, 1);

            let variableString;
            if(block.code === EBlockCode.SKIPCOND){
                variableString = block.value?.toString(16).padStart(3, '0');
            } else {
                variableString = block.variable?.address ? block.variable.address.toString(16).padStart(3, '0') : "000";
            }

            return `${hexBlockCode}${variableString}`;
        })

        blocks.forEach((block) => {
            if(block.variable){
                memory.push(block.variable.value.toString(16).toUpperCase().padStart(4, "0"));
            }
        })

        console.log(memory)
        setMemory(memory);
    }, [blocks, variables])

    const step = () => {

        if (registers.PC >= memory.length) {
            registers.PC = 0;
        }

        //  Instruction Cycle
        //      MAR <- PC
        //		MBR <- M[MAR]
        //		IR <- MBR
        //		PC <- PC+1

        registers.MAR = registers.PC;
        registers.MBR = parseInt(memory[registers.MAR], 16);
        registers.IR = registers.MBR.toString(16);
        registers.PC++;

        //  Execution Cycle

        const opCode = registers.IR.substring(0, 1);
        const skipValue = registers.IR.substring(1, 2);
        const operand = parseInt(registers.IR.substring(1, 4), 16);


        switch (opCode) {
            case "0":
                // JnS
                break;
            case "1":
                //  Load
                registers.MAR = operand;
                registers.MBR = parseInt(memory[registers.MAR], 16);
                registers.AC = registers.MBR;
                break;
            case "2":
                //  Store
                registers.MAR = operand;
                registers.MBR = registers.AC;
                memory[registers.MAR] = registers.MBR.toString(16).toUpperCase().padStart(4, "0");
                break;
            case "3":
                //  Add
                registers.MAR = operand;
                registers.MBR = parseInt(memory[registers.MAR], 16);
                registers.AC += registers.MBR;
                break;
            case "4":
                //  Subt
                registers.MAR = operand;
                registers.MBR = parseInt(memory[registers.MAR], 16);
                registers.AC -= registers.MBR;
                break;
            case "5":
                //  Input
                // Mostrar popup
                // registers.AC = registers.IN;
                break;
            case "6":
                //  Output
                // Mostrar output
                // registers.OUT = registers.AC;
                console.log(registers.AC)
                break;
            case "7":
                //  Halt
                setHalted(true);
                break;
            case "8":
                //  Skipcond
                if (skipValue === "0" && registers.AC < 0) {
                    registers.PC++;
                }
                else if (skipValue === "4" && registers.AC === 0) {
                    registers.PC++;
                }
                else if (skipValue === "8" && registers.AC > 0) {
                    registers.PC++;
                }
                break;
            case "9":
                //  Jump
                //  PC <- address
                registers.PC = operand;
                break;
            case "A":
                //  Clear
                //  AC <- 0
                registers.AC = 0;
                break;
            case "B":
                //  AddI
                //  AC <- AC + M[M[address]]
                registers.MAR = operand;
                registers.MBR = parseInt(memory[registers.MAR], 16);
                registers.MAR = registers.MBR;
                registers.MBR = parseInt(memory[registers.MAR], 16);
                registers.AC += registers.MBR;
                break;
            case "C":
                //  JumpI
                //  PC <- M[address]
                registers.MAR = operand;
                registers.MBR = parseInt(memory[registers.MAR], 16);
                registers.PC = registers.MBR;
                break;
            default:
                console.log("Operação não reconhecida")
                break;
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




    return { registers, setRegisters,  step, run}
}

