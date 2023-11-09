import { useState } from "react";

interface LabelInputModalProps {
  onConfirm: (label: string) => void;
  onCancel: () => void;
}

export const LabelInputModal: React.FC<LabelInputModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [label, setLabel] = useState("");

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleConfirmClick = () => {
    onConfirm(label);
  };

  const handleCancelClick = () => {
    onCancel();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Enter label name:</h2>
        <input
          type="text"
          className="border border-gray-400 rounded px-2 py-1 mb-2 w-full"
          value={label}
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