import React from "react";
import { useState } from "react";
import { useMarie } from '../hooks/useMarie'
import { TBlock, Variable } from "../Types";

interface UseMarieInputModalProps {
  onConfirm: (input: number) => void;
  onCancel: () => void;
}

export const UseMarieInputModal: React.FC<UseMarieInputModalProps> = ({
  onConfirm,
  onCancel,
}) => {

    const [input, setInput] = React.useState<number | undefined>(undefined);
    const [blocks, setBlocks] = useState<TBlock[]>([])
    const [variables, setVariables] = useState<Variable[]>([])
    const { stop } = useMarie(blocks, variables);

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setInput(isNaN(value) ? undefined : value);
      };

  const handleConfirmClick = () => {
    if(input != null){
        onConfirm(input);
    } else {
        onCancel();
        stop;
    }
};

  const handleCancelClick = () => {
    onCancel();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Enter Input:</h2>
        <input
          type="number"
          className="border border-gray-400 rounded px-2 py-1 mb-2 w-full"
          value={input}
          onChange={handleLabelChange}
        />
        <div className="flex justify-between">
          <button
            className="bg-gray-200 hover:bg-gray-300 rounded px-4 py-2 mr-2"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
            onClick={handleConfirmClick}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};