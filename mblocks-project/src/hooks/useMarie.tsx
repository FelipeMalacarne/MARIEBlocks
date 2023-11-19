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



    const decToHex = (dec: number) => {

        // Check if number is bigger than integer limit

        if (dec > 32767) {
            dec = 32767;
        }
        
        // Check if number is negative

        if (dec < 0) {
            dec = 65536 + dec;
        }

        // Convert to hex

        let hex = dec.toString(16).toUpperCase().padStart(4, "0");

        return hex;
    }

    const hexToDec = (hex: string) => {

        let dec = parseInt(hex, 16);

        // Check if number is negative

        if (dec > 32767) {
            dec = dec - 65536;
        }

        return dec;
    }


    const run = async () => {
        runningRef.current = true;
        hasRun.current = true;
        while (runningRef.current) {
          step();
          await new Promise(resolve => setTimeout(resolve, 100)); // delay for 1 second
        }
      }

    const stop = () => {
        runningRef.current = false;
        hasRun.current = false;
        setHalted(true);
        registers.AC = 0;
        registers.MAR = 0;
        registers.MBR = 0;
        registers.PC = 0;
        registers.IN = 0;
        registers.OUT = 0;
        registers.IR = "";
        setRegisters((prevRegisters) => ({ ... prevRegisters, ...registers }));
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

        //  Ciclo Buscar
        //
        //      MAR <- PC
        //		MBR <- M[MAR]
        //		IR <- MBR
        //		PC <- PC + 1

        registers.MAR = registers.PC;
        registers.MBR = hexToDec(memory[registers.MAR]);
        registers.IR = decToHex(registers.MBR);
        registers.PC++;

        //  Ciclo Decodificar

        const opCode = registers.IR.substring(0, 1);
        const skipValue = registers.IR.substring(1, 2);
        const operand = parseInt(registers.IR.substring(1, 4), 16);

        //  Ciclo Executar

        switch (opCode) {
            case "0":
                // JnS
                break;
            case "1":
                //  Load
                //      MAR <- operand
                //      MBR <- M[MAR]
                //      AC <- MBR
                registers.MAR = operand;
                registers.MBR = hexToDec(memory[registers.MAR]);
                registers.AC = registers.MBR;
                break;
            case "2":
                //  Store
                //      MAR <- IR[11-0]
                //      MBR <- AC
                //      M[MAR] <- MBR
                registers.MAR = operand;
                registers.MBR = registers.AC;
                memory[registers.MAR] = decToHex(registers.MBR);
                break;
            case "3":
                //  Add
                //      MAR <- IR[11-0]
                //      MBR <- M[MAR]
                //      AC <- AC + MBR
                registers.MAR = operand;
                registers.MBR = hexToDec(memory[registers.MAR]);
                registers.AC += registers.MBR;
                break;
            case "4":
                //  Subt
                //      MAR <- IR[11-0]
                //      MBR <- M[MAR]
                //      AC <- AC - MBR
                registers.MAR = operand;
                registers.MBR = hexToDec(memory[registers.MAR]);
                registers.AC -= registers.MBR;
                break;
            case "5":
                //  Input
                //      AC <- IN
                runningRef.current = false;
                setShowInputModal(true);
                break;
            case "6":
                //  Output
                //      OUT <- AC
                registers.OUT = registers.AC;
                setOutputStr((prevState) => prevState + registers.OUT + "\n");
                console.log(registers.OUT);
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
                //      PC <- IR[11-0]
                registers.PC = operand;
                break;
            case "a":
                //  Clear
                //     AC <- 0
                registers.AC = 0;
                break;
            case "b":
                //  AddI
                //      MAR <- operand
                //      MBR <- M[MAR]
                //      MAR <- MBR
                //      MBR <- M[MAR]
                //      AC <- AC + MBR
                registers.MAR = operand;
                registers.MBR = hexToDec(memory[registers.MAR]);
                registers.MAR = registers.MBR;
                registers.MBR = hexToDec(memory[registers.MAR]);
                registers.AC += registers.MBR;
                break;
            case "c":
                //  JumpI
                //      MAR <- operand
                //      MBR <- M[MAR]
                //      PC <- MBR
                registers.MAR = operand;
                registers.MBR = hexToDec(memory[registers.MAR]);
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
