import React from "react";
import CloseIcon from "@mui/icons-material/Close";

interface GeneratedContentPanelProps {
  content: string;
  onClose: () => void;
  onApply: (content: string) => void;
}

const GeneratedContentPanel: React.FC<GeneratedContentPanelProps> = ({
  content,
  onClose,
  onApply,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md modal-content backdrop-blur-sm bg-white/90 border-l-4 border-purple-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-700">
          Generated Content
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="space-y-4">
        <div className="prose max-w-none">
          <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
            {content}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => onApply(content)}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600
                     transition-colors duration-200"
          >
            Apply Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedContentPanel;
