import { createContext, useContext, useState, useRef, useEffect } from "react";
import type { FileId, FileMetadata, FolderId, FolderMetadata } from "../types";
import FileService from "../Services/FileService";
import { type IFileService } from "../Services/FileService";
import { ServiceLocatorContext } from "./ServiceLocatorContext";
import { AuthContext } from "./AuthContext";
import { type RequestError } from "../Clients/HTTPClient";
import Status from "../Enums/Status";

/**
 * This context goal is to cache results from backend to reduce calls to backend
 * It will look at cache and then use file service if not found
 */
interface IFSContext {
  getFile: (id: FileId) => Promise<FileMetadata>;
  getFolder: (id: FolderId) => Promise<FolderMetadata>;
  getRootFolder: () => Promise<FolderMetadata>;
  getSubFolders: (id: FolderId) => Promise<FolderMetadata[]>;
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

  const { url } = useContext(ServiceLocatorContext)!;
  const { setIsAuthenticated } = useContext(AuthContext)!;

  const file_service = useRef<IFileService | null>(null);

  useEffect(() => {
    file_service.current = FileService(url, (err: RequestError) => {
      console.error("FileService error:", err);
      let final_err: RequestError = err;
      if (final_err.response?.status == Status.FORBIDDEN)
        setIsAuthenticated(false);
    });

    return () => {
      file_service.current = null;
    };
  }, [url]);

  const getFile = (id: FileId): Promise<FileMetadata> => {
    if (loadedFiles.has(id)) return Promise.resolve(loadedFiles.get(id)!);

    // Otherwise, use file_service
    const fs = file_service.current;
    if (!fs) throw Error("File service not connected");

    return fs.getFile(id).then((data) => {
      if (!data) throw Error(`Failed to get file with file_id: ${id}`);
      setLoadedFiles((old) => {
        const nw = new Map(old);
        nw.set(id, data);
        return nw;
      });
      return data;
    });
  };
  const getFolder = (id: FolderId): Promise<FolderMetadata> => {
    if (loadedFolders.has(id)) return Promise.resolve(loadedFolders.get(id)!);

    // otherwise use file servcie
    const fs = file_service.current;
    if (!fs) throw Error("File service not connected");

    return fs.getFolder(id).then((data) => {
      if (!data) throw Error(`Failed to get folder with folder_id: ${id}`);
      setLoadedFolders((old) => {
        const nw = new Map(old);
        nw.set(id, data);
        return nw;
      });
      return data;
    });
  };

  const getRootFolder = () => {
    if (rootFolder) return Promise.resolve(rootFolder);

    const fs = file_service.current;
    if (!fs) throw Error("File service not connected");

    // otherwise use file servcie
    return fs.getRootFolder().then((data) => {
      if (!data) throw Error("Failed to get root folder");
      setRootFolder(data);
      return data;
    });
  };

  const getSubFolders = (id: FolderId) => {
    const fs = file_service.current;
    if (!fs) throw Error("File service not connected");

    return fs.getSubFolders(id).then((data) => {
      if (!data) {
        console.log(data);
        throw Error("Failed to get sub folder");
      }
      setLoadedFolders((old) => {
        const nw = new Map(old);
        for (let folder of data) nw.set(id, folder);
        return nw;
      });
      return data;
    });
  };
  return (
    <FSContext.Provider
      value={{
        getFile,
        getFolder,
        getRootFolder,
        getSubFolders,
      }}
    >
      {children}
    </FSContext.Provider>
  );
};
