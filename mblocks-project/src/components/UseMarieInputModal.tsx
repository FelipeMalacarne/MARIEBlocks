import { useState } from "react";

interface UseMarieInputModalProps {
  onConfirm: (input: number) => void;
  onCancel: () => void;
}

export const UseMarieInputModal: React.FC<UseMarieInputModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [input, setInput] = useState<number | string>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    if (value === "-") {
      setInput(value);
    } else if (!isNaN(Number(value))) {
      setInput(Number(value));
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Digite o Input:</h2>
        <input
          type="text"
          className="border border-gray-400 rounded px-2 py-1 mb-2 w-full"
          value={input}
          onChange={handleChange}
        />
        <div className="flex justify-between">
          <button
            className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 mr-2"
            onClick={() => onCancel()}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
            onClick={() => {
              if (typeof input === "number") {
                onConfirm(input);
              }
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};