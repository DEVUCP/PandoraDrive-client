import { createContext, useContext, useState, useRef, useEffect } from "react";
import type { FileId, FileMetadata, FolderId, FolderMetadata } from "../types";
import FileMetadataService from "../Services/FileMetadataService";
import { type IFileMetadataService } from "../Services/FileMetadataService";
import { ServiceLocatorContext } from "./ServiceLocatorContext";
import { AuthContext } from "./AuthContext";
import { type RequestError } from "../Clients/HTTPClient";
import Status from "../Enums/Status";
import FileUploadService, {
  type IUploadService,
} from "../Services/UploadService";

/**
 * This context goal is to cache results from backend to reduce calls to backend
 * It will look at cache and then use file service if not found
 */
interface IFSCacheContext {
  getFile: (id: FileId) => Promise<FileMetadata>;
  getFolder: (id: FolderId) => Promise<FolderMetadata>;
  getRootFolder: () => Promise<FolderMetadata>;
  getSubFolders: (id: FolderId) => Promise<FolderMetadata[]>;
  getSubFiles: (id: FolderId) => Promise<FileMetadata[]>;

  uploadFile: (file: File, target_folder_id: FolderId) => Promise<null>;
  uploadFolder: (folder: string, target_folder_id: FolderId) => Promise<null>;
}

export const IFSCacheContext = createContext<IFSCacheContext | null>(null);

export const FSCacheProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loadedFiles, setLoadedFiles] = useState<Map<FileId, FileMetadata>>(
    new Map(),
  );
  const [loadedFolders, setLoadedFolders] = useState<
    Map<FolderId, FolderMetadata>
  >(new Map());
  const [rootFolder, setRootFolder] = useState<FolderMetadata | null>(null);

  const { url } = useContext(ServiceLocatorContext)!;
  const { setIsAuthenticated } = useContext(AuthContext)!;

  const file_service = useRef<IFileMetadataService | null>(null);
  const upload_service = useRef<IUploadService | null>(null);

  useEffect(() => {
    file_service.current = FileMetadataService(url, (err: RequestError) => {
      console.error("FileService error:", err);
      let final_err: RequestError = err;
      if (final_err.response?.status == Status.FORBIDDEN)
        setIsAuthenticated(false);
    });
    upload_service.current = FileUploadService(url, console.log);

    return () => {
      file_service.current = null;
      upload_service.current = null;
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
        throw Error("Failed to get sub files");
      }
      setLoadedFolders((old) => {
        const nw = new Map(old);
        for (let folder of data) nw.set(id, folder);
        return nw;
      });
      return data;
    });
  };
  const getSubFiles = (id: FolderId) => {
    const fs = file_service.current;
    if (!fs) throw Error("File service not connected");

    return fs.getSubFiles(id).then((data) => {
      if (!data) {
        console.log(data);
        throw Error("Failed to get sub files");
      }
      setLoadedFiles((old) => {
        const nw = new Map(old);
        for (let file of data) nw.set(id, file);
        return nw;
      });
      return data;
    });
  };

  const uploadFile = (file: File, target_folder_id: FolderId) => {
    const us = upload_service.current;
    if (!us) throw Error("Upload service not connected");

    return us.uploadFile(file, target_folder_id).then((_) => null);
  };
  const uploadFolder = (
    folder: string,
    target_folder_id: FolderId,
  ): Promise<null> => {
    const us = upload_service.current;
    if (!us) throw Error("Upload service not connected");
    return us.uploadFolder(folder, target_folder_id).then((_) => null);
  };
  return (
    <IFSCacheContext.Provider
      value={{
        getFile,
        getFolder,
        getRootFolder,
        getSubFolders,
        getSubFiles,
        uploadFile,
        uploadFolder,
      }}
    >
      {children}
    </IFSCacheContext.Provider>
  );
};
