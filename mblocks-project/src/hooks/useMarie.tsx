import { memo, useEffect, useRef, useState } from "react"
import { EBlockCode, Registers, TBlock, Variable } from "../Types"

export const useMarie = (blocks: TBlock[], variables: Variable[], setShowInputModal: React.Dispatch<React.SetStateAction<boolean>>) => {

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

    const [outputStr, setOutputStr] = useState<string>('')

    const runningRef = useRef(false);
    const hasRun = useRef(false);

    const run = async () => {
        runningRef.current = true;
        hasRun.current = true;
        while (runningRef.current) {
          step();
          await new Promise(resolve => setTimeout(resolve, 1000)); // delay for 1 second
        }
      }

    const stop = () => {
        runningRef.current = false;
        setHalted(true);
        registers.AC = 0;
        registers.MAR = 0;
        registers.MBR = 0;
        registers.PC = 0;
        registers.IN = 0;
        registers.OUT = 0;
        registers.IR = "";
    }

    const setLabelAddress = () => {
        blocks.forEach((block, i) => {
            if(block.code == EBlockCode.LABEL && block.label){
                block.label.address = i;
            }
        })

        blocks.forEach((block, i) => {
            if(block.code == EBlockCode.JUMP && block.label){
                const label = blocks.find((b) => b.code === EBlockCode.LABEL && b.label?.name === block.label?.name);
                if(label){
                    block.label.address = label.label?.address;
                }
            }
        })
    }

    const setVariableAddress = (variables: Variable[], blocksWtLabels: TBlock[]) => {
        variables.forEach((variable, i) => {
            const variableAddress = blocksWtLabels.length + i;
            variable.address = variableAddress;
        })
    }

    useEffect(() => {
        setLabelAddress();
        const blocksWtLabels = blocks.filter((block) => block.code !== EBlockCode.LABEL);

        setVariableAddress(variables, blocksWtLabels);

        const memory = blocksWtLabels.map((block) => {
            const hexBlockCode = block.code.toString(16).substring(0, 1);

            let variableString;
            if(block.code === EBlockCode.SKIPCOND){
                variableString = block.value?.toString(16).padStart(3, '0');
            } else if (block.code === EBlockCode.JUMP){
                variableString = block.label?.address ? block.label.address.toString(16).padStart(3, '0') : "000";
            } else {
                variableString = block.variable?.address ? block.variable.address.toString(16).padStart(3, '0') : "000";
            }

            return `${hexBlockCode}${variableString}`;
        })

        variables.forEach((variable) => {
            memory.push(variable.value.toString(16).toUpperCase().padStart(4, "0"));
        })

        setMemory(memory);
        console.log(memory);

    }, [blocks, variables])

    const step = () => {

        console.log(memory);

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
                runningRef.current = false;
                setShowInputModal(true);
                break;
            case "6":
                //  Output
                // Mostrar output
                registers.OUT = registers.AC;
                setOutputStr((prevState) => prevState + registers.OUT.toString(16).toUpperCase().padStart(4, "0") + "\n");
                console.log(registers.AC);
                break;
            case "7":
                //  Halt
                stop();
                console.log("Program halted normally");
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
                registers.PC = operand;
                break;
            case "a":
                //  Clear
                registers.AC = 0;
                break;
            case "b":
                //  AddI
                registers.MAR = operand;
                registers.MBR = parseInt(memory[registers.MAR], 16);
                registers.MAR = registers.MBR;
                registers.MBR = parseInt(memory[registers.MAR], 16);
                registers.AC += registers.MBR;
                break;
            case "c":
                //  JumpI
                registers.MAR = operand;
                registers.MBR = parseInt(memory[registers.MAR], 16);
                registers.PC = registers.MBR;
                break;
            default:
                console.log("Operação não reconhecida")
                break;
        }
        setRegisters((prevRegisters) => ({ ... prevRegisters, ...registers }));
    }

    const execInput = (blocks: TBlock[]) => {

    }

    const stepBack = (blocks: TBlock[]) => {

    }

    const reset = () => {

    }

    const assemble = (blocks: TBlock[]) => {

    }

    return { registers, setRegisters, step, run, stop, outputStr, setOutputStr, runningRef, hasRun, halted}
}
