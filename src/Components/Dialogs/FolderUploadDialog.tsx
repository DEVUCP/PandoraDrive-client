import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
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
  const { uploadFolder } = useContext(IFSCacheContext)!;
  const { reloadFiles } = useContext(DriveContext)!;
  const [folderName, setFolderName] = useState<string>("");

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ?? "";
    setFolderName(val);
  };

  const handleUpload = async () => {
    if (!folderName.trim()) {
      return;
    }

    await uploadFolder(folderName, parent_folder_id);
    reloadFiles();
    handleCancel();
  };

  const handleCancel = () => {
    setFolderName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Folder</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Folder Name"
            variant="outlined"
            value={folderName}
            onChange={handleFolderNameChange}
            inputProps={{
              maxLength: 100,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!folderName.trim()}
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
