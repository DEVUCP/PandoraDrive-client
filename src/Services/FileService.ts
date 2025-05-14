import { createHTTPClient } from "../Clients/HTTPClient";

import {
  FileId,
  FileMetadata,
  FileMetadataBody as FileMetadataBody,
  FolderId,
  FolderMetadata,
  FolderMetadataBody,
} from "../types";

type MimeType = `${string}/${string}`;
type Token = string;

export type IFileService = {
  getRootFolder: () => Promise<FolderMetadata | null>;
  createFile: (data: {
    file_name: string;
    folder_id: number;
    size_bytes: number;
    mime_type: MimeType;
  }) => void;
  getFile: (file_id: FileId) => Promise<FileMetadata | null>;
  getFolder: (folder_id: FolderId) => Promise<FolderMetadata | null>;
};

const FileService = (
  backend_url: string,
  handleError: (err: Error) => void,
): IFileService => {
  const gateway_client = createHTTPClient();

  return {
    getRootFolder: () => {
      return gateway_client
        .get<FolderMetadataBody>(`${backend_url}/api/v1/folder?user_id=1`)
        .then(({ created_at, ...rest }) => ({
          ...rest,
          created_at: new Date(created_at),
        }))
        .catch((err: Error) => {
          handleError(err);
          return null;
        });
    },
    createFile: (data: {
      file_name: string;
      folder_id: number;
      size_bytes: number;
      mime_type: MimeType;
    }) => {
      gateway_client
        .post(`${backend_url}/api/v1/files/upload`, {}, data)
        .catch((err: Error) => handleError(err));
    },
    getFile: (id: FileId) => {
      return gateway_client
        .get<FileMetadataBody>(`${backend_url}/api/v1/files?file_id=${id}`)
        .then(({ created_at, modified_at, ...rest }) => ({
          ...rest,
          created_at: new Date(created_at),
          modified_at: new Date(modified_at),
        }))
        .catch((err: Error) => {
          handleError(err);
          return null;
        });
    },
    getFolder: (id: FolderId) => {
      return gateway_client
        .get<FolderMetadataBody>(
          `${backend_url}/api/v1/files/folder?folder_id=${id}`,
        )
        .then(({ created_at, ...rest }) => ({
          ...rest,
          created_at: new Date(created_at),
        }))
        .catch((err) => {
          handleError(err);
          return null;
        });
    },
  };
};
export default FileService;
