import React from "react";
import { Modal, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

interface GeneratedContentModalProps {
  open: boolean;
  onClose: () => void;
  content: string;
  onApply: (content: string) => void;
}

const GeneratedContentModal: React.FC<GeneratedContentModalProps> = ({
  open,
  onClose,
  content,
  onApply,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex items-center justify-center modal-overlay"
    >
      <div
        className="bg-white p-6 rounded-lg w-11/12 max-w-2xl relative"
        style={{ boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="absolute top-2 right-2"
          sx={{
            color: "rgba(0,0,0,0.6)",
            "&:hover": {
              color: "rgba(0,0,0,0.8)",
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <h2 className="text-xl font-semibold mb-4">Generated Content</h2>

        <div className="max-h-[60vh] overflow-y-auto bg-gray-50 p-4 rounded-lg mb-4">
          <pre className="whitespace-pre-wrap font-sans">{content}</pre>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outlined"
            onClick={onClose}
            className="hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<ContentPasteIcon />}
            onClick={() => onApply(content)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Use This Content
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GeneratedContentModal;
