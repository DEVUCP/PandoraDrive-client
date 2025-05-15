import FolderSection from "../Components/FolderSection";
import FileTable from "../Components/FileTable";
import { useContext, useEffect, useState } from "react";
import { FSContext } from "../Contexts/FSContext";
import { useParams } from "react-router-dom";
import type { FolderMetadata } from "../types";
import CircularProgress from "@mui/material/CircularProgress";

const DrivePage = () => {
  const [folder, setFolder] = useState<FolderMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { getRootFolder, getFolder } = useContext(FSContext)!;
  const { folder_id } = useParams();

  useEffect(() => {
    async function effect() {
      if (folder_id === undefined) return setFolder(await getRootFolder());
      console.log("shouldn't make it here in '/drive' route");

      const parsedFolderId = parseInt(folder_id!);

      if (isNaN(parsedFolderId)) {
        setFolder(null);
      } else {
        setFolder(await getFolder(parsedFolderId));
      }
    }
    effect().then(() => setLoading(false));
  }, [folder_id, getFolder, getRootFolder]);

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
    </div>
  );
};

export default DrivePage;
