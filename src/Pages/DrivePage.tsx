import FolderSection from "../Components/FolderSection";
import FileTable from "../Components/FileTable";
import { useContext, useEffect, useState } from "react";
import { FSContext } from "../Contexts/FSContext";
import { useParams } from "react-router-dom";
import type { FolderMetadata } from "../types";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CirclePlus, FileUp, FolderUp } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const DrivePage = () => {
  const [folder, setFolder] = useState<FolderMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { getRootFolder, getFolder, uploadFile } = useContext(FSContext)!;
  const { folder_id } = useParams();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    async function effect() {
      if (folder_id === undefined) return setFolder(await getRootFolder());
      const parsedFolderId = parseInt(folder_id!);
      if (isNaN(parsedFolderId)) {
        setFolder(null);
      } else {
        setFolder(await getFolder(parsedFolderId));
      }
    }
    effect().then(() => setLoading(false));
  }, [folder_id, getFolder, getRootFolder]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUploadFile = () => {
    setFileUploadOpen(true);
    handleClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (selectedFile && folder) {
      await uploadFile(selectedFile, folder.folder_id);
    }
    setFileUploadOpen(false);
    setSelectedFile(null);
  };

  const handleCancelUpload = () => {
    setFileUploadOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-8 text-center">
      <div className="flex-1 p-4">
        {loading ? (
          <CircularProgress />
        ) : folder !== null ? (
          <>
            <FolderSection parent_folder_id={folder.folder_id} />
            <FileTable parent_folder_id={folder.folder_id} />
          </>
        ) : (
          <div className="text-red-500">
            Invalid folder ID. Please provide a valid numeric ID.
          </div>
        )}
      </div>

      <Fab
        color="primary"
        aria-label="upload"
        onClick={handleClick}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <CirclePlus />
      </Fab>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem onClick={handleUploadFile}>
          <FileUp size={10} />
          Upload File
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <FolderUp size={10} />
          Upload Folder
        </MenuItem>
      </Menu>

      <Dialog open={fileUploadOpen} onClose={handleCancelUpload}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleFileSelect} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpload}>Cancel</Button>
          <Button onClick={handleFileUpload} disabled={!selectedFile}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DrivePage;
