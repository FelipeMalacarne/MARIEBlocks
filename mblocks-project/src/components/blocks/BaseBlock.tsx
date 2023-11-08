import { useCallback } from "react";
import { TBlock, Variable } from "../../Types";
import BlockContent from "./BlockContent";

interface BaseBlockProps {
  block: TBlock;
  blocks: TBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<TBlock[]>>;
  variables: Variable[];
}

const BaseBlock: React.FC<BaseBlockProps> = ({ block, blocks, setBlocks, variables }) => {
  const removeBlock = useCallback(() => {
    const newBlocks = blocks.filter((b) => b !== block);
    setBlocks(newBlocks);
  }, [blocks, block, setBlocks]);

  const handleVariableSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newBlocks = [...blocks];
      const index = blocks.indexOf(block);
      newBlocks[index].variable = variables.find((variable: Variable) => variable.name === e.target.value);
      setBlocks(newBlocks);
    },
    [blocks, block, variables, setBlocks]
  );

  const handleSkipcondSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newBlocks = [...blocks];
      const index = blocks.indexOf(block);
      newBlocks[index].value = parseInt(e.target.value);
      setBlocks(newBlocks);
    },
    [blocks, block, setBlocks]
  );

  const handleJumpSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newBlocks = [...blocks];
      const index = blocks.indexOf(block);
      newBlocks[index].label = { name: e.target.value};
      setBlocks(newBlocks);
    },
    [blocks, block, setBlocks]
  );

  return (
    <div className="flex justify-center">
      <div className="p-5 bg-white grid grid-cols-3 items-center rounded w-full max-w-2xl">
        <h1 className="font-semibold">{block.name}</h1>
        <BlockContent
          block={block}
          variables={variables}
          blocks={blocks}
          handleVariableSelectChange={handleVariableSelectChange}
          handleSkipcondSelectChange={handleSkipcondSelectChange}
          handleJumpSelectChange={handleJumpSelectChange}
        />
        <button
          onClick={removeBlock}
          className="rounded p-2 bg-red-500 hover:bg-red-700 text-white w-8 h-full justify-self-end"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default BaseBlock;