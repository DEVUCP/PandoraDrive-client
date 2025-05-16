import {
  createContext,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";
import type { FileMetadata, FolderMetadata } from "../types";
import { IFSCacheContext } from "./FSCacheContext";

export interface IDriveContext {
  currentFolder: FolderMetadata | null;
  files: FileMetadata[];
  folders: FolderMetadata[];
  reloadFiles: () => void;
  reloadFolders: (folder: FolderMetadata) => void;
  setCurrentFolder: (folder: FolderMetadata | null) => void;
}

export const DriveContext = createContext<IDriveContext | null>(null);

export const DriveProvider = ({ children }: { children: ReactNode }) => {
  const { getSubFiles, getSubFolders } = useContext(IFSCacheContext)!;
  const [currentFolder, setCurrentFolder] = useState<FolderMetadata | null>(
    null,
  );
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [folders, setFolders] = useState<FolderMetadata[]>([]);

  const reloadFiles = async () => {
    if (currentFolder) {
      setFiles(await getSubFiles(currentFolder.folder_id));
    }
  };
  const reloadFolders = async () => {
    if (currentFolder) {
      setFolders(await getSubFolders(currentFolder.folder_id));
    }
  };

  useEffect(() => {
    const effect = async () =>
      await Promise.all([reloadFiles(), reloadFolders()]);
    effect();
  }, [currentFolder]);
  return (
    <DriveContext.Provider
      value={{
        files,
        folders,
        currentFolder,
        reloadFiles,
        reloadFolders,
        setCurrentFolder,
      }}
    >
      {children}
    </DriveContext.Provider>
  );
};
