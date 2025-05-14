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
  get_file: (id: FileId) => Promise<FileMetadata>;
  get_folder: (id: FolderId) => Promise<FolderMetadata>;
  get_root_folder: () => Promise<FolderMetadata>;
}

export const FSContext = createContext<IFSContext | null>(null);

export const FSProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadedFiles, setLoadedFiles] = useState<Map<FileId, FileMetadata>>(
    new Map(),
  );

  const [loadedFolders, setLoadedFolders] = useState<
    Map<FolderId, FolderMetadata>
  >(new Map());
  const { ip } = useContext(ipContext);
  const { port } = useContext(portContext);

  const file_service = useRef<IFileService | null>(null);

  useEffect(() => {
    file_service.current = FileService(`${ip}:${port}`, (err: Error) => {
      console.error("FileService error:", err);
    });

    return () => {
      file_service.current = null;
    };
  }, [ip, port]);

  const get_file = (id: FileId): Promise<FileMetadata> => {
    const fs = file_service.current;
    if (!fs) throw Error("File service not connected");
    if (loadedFiles.has(id)) return Promise.resolve(loadedFiles.get(id)!);

    // Otherwise, use file_service
    return fs.get_file(id).then((data) => {
      if (!data) throw Error("Failed to get file with file_id: ${id}");
      setLoadedFiles((old) => {
        const nw = new Map(old);
        nw.set(id, data);
        return nw;
      });
      return data;
    });
  };
  const get_folder = (id: FolderId): Promise<FolderMetadata> =>
    Promise.resolve({
      folder_id: id,
      folder_name: "root",
      created_at: new Date(),
      status: "Uploaded",
    });

  const get_root_folder = () => get_folder(0);
  return (
    <FSContext.Provider value={{ get_file, get_folder, get_root_folder }}>
      {children}
    </FSContext.Provider>
  );
};
