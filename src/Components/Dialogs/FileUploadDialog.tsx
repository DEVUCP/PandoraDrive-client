import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState, useContext } from "react";
import { IFSCacheContext } from "../../Contexts/FSCacheContext";
import { DriveContext } from "../../Contexts/DriveContext";
import type { FolderId } from "../../types";

interface Params {
  onClose: () => void;
  open: boolean;
  parent_folder_id: FolderId;
}
export default function ({ open, onClose, parent_folder_id }: Params) {
  const { uploadFile } = useContext(IFSCacheContext)!;
  const { reloadFiles } = useContext(DriveContext)!;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
    else setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await uploadFile(selectedFile, parent_folder_id);
      reloadFiles();
    }

    handleCancel();
  };

  const handleCancel = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload File</DialogTitle>
      <DialogContent>
        <input type="file" onChange={handleFileSelect} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
