import { EBlockCode, TBlock, Variable } from "../../Types";

interface BlockContentProps {
    block: TBlock;
    variables: Variable[];
    blocks: TBlock[];
    handleVariableSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSkipcondSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleJumpSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const BlockContent: React.FC<BlockContentProps> = ({
    block,
    variables,
    blocks,
    handleVariableSelectChange,
    handleSkipcondSelectChange,
    handleJumpSelectChange,
}) => {
    const renderVariableSelect = () => {
        const variableCodes = [
            EBlockCode.ADD,
            EBlockCode.ADDI,
            EBlockCode.LOAD,
            EBlockCode.LOADI,
            EBlockCode.STORE,
            EBlockCode.SUBT,
            EBlockCode.JUMPI,
        ];

        if (variableCodes.includes(block.code)) {
            return (
                <select
                    className="rounded p-2 bg-gray-100 hover:bg-gray-200 text-black w-40 mr-8"
                    value={block.variable?.name}
                    onChange={handleVariableSelectChange}
                >
                    <option value={undefined}></option>
                    {variables.map((variable: Variable) => (
                        <option key={variable.name} value={variable.name}>
                            {variable.name}
                        </option>
                    ))}
                </select>
            );
        }

        return null;
    };

    const renderJumpSelect = () => {
        if (block.code === EBlockCode.JUMP) {
            return (
                <select
                    className="rounded p-2 bg-gray-100 hover:bg-gray-200 text-black w-40 mr-8"
                    value={block.label?.name}
                    onChange={handleJumpSelectChange}
                >
                    <option value={undefined}></option>
                    {blocks
                        .filter((b) => b.code === EBlockCode.LABEL)
                        .map((block: TBlock) => (
                            <option key={block.label?.name} value={block.label?.name}>
                                {block.label?.name}
                            </option>
                        ))}
                </select>
            );
        }

        return null;
    };

    const renderLabelInput = () => {
        if (block.code === EBlockCode.LABEL) {
            return (
                <input
                    className="rounded p-2 bg-gray-100 hover:bg-gray-200 text-black w-40 mr-8"
                    value={block.label?.name}
                    disabled
                />
            );
        }

        return null;
    };

    const renderSkipcondSelect = () => {
        if (block.code === EBlockCode.SKIPCOND) {
            return (
                <select
                    className="rounded p-2 bg-gray-100 hover:bg-gray-200 text-black w-40 mr-8"
                    value={block.value}
                    onChange={handleSkipcondSelectChange}
                >
                    <option value={0x800}>Positive</option>
                    <option value={0x400}>Zero</option>
                    <option value={0x000}>Negative</option>
                </select>
            );
        }

        return null;
    };

    return (
        <div>
            {renderVariableSelect()}
            {renderJumpSelect()}
            {renderLabelInput()}
            {renderSkipcondSelect()}
        </div>
    );
};

export default BlockContent;