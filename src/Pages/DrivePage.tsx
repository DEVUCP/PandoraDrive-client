import FolderSection from "../Components/FolderSection";
import FileTable from "../Components/FileTable";
import { useContext, useEffect, useState } from "react";
import { IFSCacheContext } from "../Contexts/FSCacheContext";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { DriveContext } from "../Contexts/DriveContext";
import UploadMenu from "../Components/UploadMenu";

const DrivePage = () => {
  const { changeCurrentDirectory, currentFolder } = useContext(DriveContext)!;
  const { getRootFolder, getFolder } = useContext(IFSCacheContext)!;
  const [loading, setLoading] = useState<boolean>(true);
  const { folder_id } = useParams();

  useEffect(() => {
    async function effect() {
      if (folder_id === undefined)
        return changeCurrentDirectory(await getRootFolder());
      const parsedFolderId = parseInt(folder_id!);
      if (isNaN(parsedFolderId)) {
        changeCurrentDirectory(null);
      } else {
        let result = await getFolder(parsedFolderId);
        changeCurrentDirectory(result);
      }
    }
    effect().then(() => setLoading(false));
  }, [folder_id]);

  if (!currentFolder) return <CircularProgress />;

  return (
    <div className="max-w-screen-xl mx-auto p-8 text-center">
      <div className="flex-1 p-4">
        {loading ? (
          <CircularProgress />
        ) : currentFolder !== null ? (
          <>
            <FolderSection />
            <FileTable />
          </>
        ) : (
          <div className="text-red-500">
            Invalid folder ID. Please provide a valid numeric ID.
          </div>
        )}
      </div>

      <UploadMenu parent_folder_id={currentFolder.folder_id} />
    </div>
  );
};

export default DrivePage;
