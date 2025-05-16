import Fab from "@mui/material/Fab";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CirclePlus, FileUp, FolderUp } from "lucide-react";
import FileUploadDialog from "../Components/Dialogs/FileUploadDialog";
import { useState } from "react";
import type { FolderId } from "../types";
import FolderUploadDialog from "./Dialogs/FolderUploadDialog";

interface Params {
  parent_folder_id: FolderId;
}

export default function ({ parent_folder_id }: Params) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [folderUploadOpen, setFolderUploadOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setFileUploadOpen(false);
    setFolderUploadOpen(false);
    setAnchorEl(null);
  };

  const handleUploadFile = () => {};

  return (
    <>
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
        <MenuItem onClick={() => setFileUploadOpen(true)}>
          <FileUp size={20} />
          Upload File
        </MenuItem>
        <MenuItem onClick={() => setFolderUploadOpen(true)}>
          <FolderUp size={20} />
          Upload Folder
        </MenuItem>
      </Menu>

      <FileUploadDialog
        parent_folder_id={parent_folder_id}
        onClose={handleClose}
        open={fileUploadOpen}
      />
      <FolderUploadDialog
        parent_folder_id={parent_folder_id}
        onClose={handleClose}
        open={folderUploadOpen}
      />
    </>
  );
}
