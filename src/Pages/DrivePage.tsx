import FolderSection from "../Components/FolderSection";
import FileTable from "../Components/FileTable";
import { useContext, useEffect, useState } from "react";
import { IFSCacheContext } from "../Contexts/FSCacheContext";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { DriveContext } from "../Contexts/DriveContext";
import UploadMenu from "../Components/UploadMenu";

const DrivePage = () => {
  const { setCurrentFolder, currentFolder, reloadFiles } =
    useContext(DriveContext)!;
  const { getRootFolder, getFolder, uploadFile } = useContext(IFSCacheContext)!;
  const [loading, setLoading] = useState<boolean>(true);
  const { folder_id } = useParams();

  useEffect(() => {
    async function effect() {
      if (folder_id === undefined)
        return setCurrentFolder(await getRootFolder());
      const parsedFolderId = parseInt(folder_id!);
      if (isNaN(parsedFolderId)) {
        setCurrentFolder(null);
      } else {
        setCurrentFolder(await getFolder(parsedFolderId));
      }
    }
    effect().then(() => setLoading(false));
  }, [folder_id, getFolder, getRootFolder]);

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
