import { createContext, useContext, useState, useRef, useEffect } from "react";
import { FileId, FileMetadata, FolderId, FolderMetadata } from "../types";
import FileService, { IFileService } from "../Services/FileService";
import { ipContext } from "./ipContext";
import { portContext } from "./portContext";

/**
 * This context goal is to cache results from backend to reduce calls to backend
 * It will look at cache and then use file service if not found
 */
interface IFSContext {
  getFile: (id: FileId) => Promise<FileMetadata>;
  getFolder: (id: FolderId) => Promise<FolderMetadata>;
  getRootFolder: () => Promise<FolderMetadata>;
}

export const FSContext = createContext<IFSContext | null>(null);

export const FSProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadedFiles, setLoadedFiles] = useState<Map<FileId, FileMetadata>>(
    new Map(),
  );
  const [loadedFolders, setLoadedFolders] = useState<
    Map<FolderId, FolderMetadata>
  >(new Map());
  const [rootFolder, setRootFolder] = useState<FolderMetadata | null>(null);

  const { ip } = useContext(ipContext);
  const { port } = useContext(portContext);

  const file_service = useRef<IFileService | null>(null);

  useEffect(() => {
    file_service.current = FileService(
      `http://localhost:${port}`,
      (err: Error) => {
        console.error("FileService error:", err);
      },
    );

    return () => {
      file_service.current = null;
    };
  }, [ip, port]);

  const get_file = (id: FileId): Promise<FileMetadata> => {
    if (loadedFiles.has(id)) return Promise.resolve(loadedFiles.get(id)!);

    // Otherwise, use file_service
    const fs = file_service.current;
    if (!fs) throw Error("File service not connected");

    return fs.getFile(id).then((data) => {
      if (!data) throw Error("Failed to get file with file_id: ${id}");
      setLoadedFiles((old) => {
        const nw = new Map(old);
        nw.set(id, data);
        return nw;
      });
      return data;
    });
  };
  const get_folder = (id: FolderId): Promise<FolderMetadata> => {
    if (loadedFolders.has(id)) return Promise.resolve(loadedFolders.get(id)!);

    // otherwise use file servcie
    const fs = file_service.current;
    if (!fs) throw Error("File service not connected");

    return fs.getFolder(id).then((data) => {
      if (!data) throw Error("Failed to get folder with folder_id: ${id}");

      setLoadedFolders((old) => {
        const nw = new Map(old);
        nw.set(id, data);
        return nw;
      });
      return data;
    });
  };

  const get_root_folder = () => {
    if (rootFolder) return Promise.resolve(rootFolder);

    const fs = file_service.current;
    if (!fs) throw Error("File service not connected");

    // otherwise use file servcie
    return fs.getRootFolder().then((data) => {
      if (!data) throw Error("Failed to get folder with folder_id: ${id}");
      setRootFolder(data);
      return data;
    });
  };
  return (
    <FSContext.Provider
      value={{
        getFile: get_file,
        getFolder: get_folder,
        getRootFolder: get_root_folder,
      }}
    >
      {children}
    </FSContext.Provider>
  );
};
