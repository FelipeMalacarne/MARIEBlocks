import { useEffect, useState } from "react"
import { EBlockName, EBlockType, EVariableType, Memory, Registers, TBlock, Variable } from "../Types"
import { parse } from "uuid";

interface MarieProps {
    blocks: TBlock[];
    variables: Variable[];
}

export const useMarie = (blocks: TBlock[], variables: Variable[]) => {

    const [registers, setRegisters] = useState<Registers>({
        AC: 0x0,
        MAR: 0x0,
        MBR: 0x0,
        PC: 0x0,
        IR: 0x0,
    })

    const [memory, setMemory] = useState<number[]>([]);

    const [halted, setHalted] = useState<boolean>(false);

    const MEMORY_SIZE = 60;

    const run = (blocks: TBlock[]) => {
        while (!halted) {
            step()

        }
    }

    useEffect(() => {
        //set memory
        const setVariablesOnMemory = (variables: Variable[]) => {
            variables.forEach((variable, i) => {
                const variableAddress = blocks.length + 1 + i;
                variable.address = variableAddress;
                memory[variableAddress] = parseInt(variable.value.toString(16), 16);
            })
        }
        const memory = blocks.map((block) => {
            setVariablesOnMemory(variables);


            const hexBlockCode = block.code.toString(16).substring(0, 1);

            let variableString = block.variable?.address ? block.variable.address.toString(16).padStart(3, '0') : "000";

            return parseInt(`0x${hexBlockCode}${variableString}`, 16);
        })
        setMemory(memory);
        console.log(memory)

    }, [blocks, variables])

    const step = () => {

        if (registers.PC >= MEMORY_SIZE) {
            registers.PC = 0;
        }

        //  Instruction Cycle
        //      MAR <- PC
        //		MBR <- M[MAR]
        //		IR <- MBR
        //		PC <- PC+1
        registers.MAR = registers.PC;
        registers.MBR = memory[registers.MAR];
        registers.IR = registers.MBR;
        registers.PC++;

        //  Execution Cycle
        const ir: string = registers.IR.toString(16).padStart(4, "0");
        const opcode: string = ir.substring(0, 1);
        const skipValue: string = ir.substring(1, 2);
        const address: string = ir.substring(1, 4);
        const operand: number = parseInt(address, 16);

        switch (opcode) {
            case "0":
                // //  Halt
                // setHalted(true);
                break;
            case "1":
                //  Load
                //  AC <- M[address]
                registers.MAR = operand;
                registers.MBR = memory[registers.MAR];
                registers.AC = registers.MBR;
                break;
            case "2":
                //  Store
                //  M[address] <- AC
                registers.MAR = operand;
                registers.MBR = registers.AC;
                memory[registers.MAR] = registers.MBR;
                break;
            case "3":
                //  Add
                //  AC <- AC + M[address]
                registers.MAR = operand;
                registers.MBR = memory[registers.MAR];
                registers.AC += registers.MBR;
                break;
            case "4":
                //  Subtract
                //  AC <- AC - M[address]
                registers.MAR = operand;
                registers.MBR = memory[registers.MAR];
                registers.AC -= registers.MBR;
                break;
            case "5":
                //  Input
                //  AC <- input
                // registers.AC = prompt("Input a value: ");
                break;
            case "6":
                //  Output
                //  Output AC
                console.log(registers.AC)
                // alert(registers.AC);
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
                registers.MBR = memory[registers.MAR];
                registers.MAR = registers.MBR;
                registers.MBR = memory[registers.MAR];
                registers.AC += registers.MBR;
                break;
            case "C":
                //  JumpI
                //  PC <- M[address]
                registers.MAR = operand;
                registers.MBR = memory[registers.MAR];
                registers.PC = registers.MBR;
                break;
            default:
                console.log("erro")
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




    return { registers, step }
}

