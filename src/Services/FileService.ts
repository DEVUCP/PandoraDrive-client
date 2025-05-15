import { createHTTPClient } from "../Clients/HTTPClient";

import type {
  FileId,
  FileMetadata,
  FileMetadataBody as FileMetadataBody,
  FolderId,
  FolderMetadata,
  FolderMetadataBody,
} from "../types";

type MimeType = `${string}/${string}`;

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
  getSubFolders: (folder_id: FolderId) => Promise<FolderMetadata[] | null>;
  getSubFiles: (folder_id: FolderId) => Promise<FileMetadata[] | null>;
};

const FileService = (
  backend_url: string,
  handleError: (err: Error) => void,
): IFileService => {
  const gateway_client = createHTTPClient(
    [
      (data) => {
        return data;
      },
    ],
    [
      (resp) => {
        console.log(resp);
        return resp;
      },
    ],
  );

  const transformFolderMetadataBody = ({
    created_at,
    ...rest
  }: FolderMetadataBody): FolderMetadata => ({
    ...rest,
    created_at: new Date(created_at),
  });
  const transformFileMetadataBody = ({
    created_at,
    modified_at,
    ...rest
  }: FileMetadataBody): FileMetadata => ({
    ...rest,
    created_at: new Date(created_at),
    modified_at: new Date(modified_at),
  });

  return {
    getRootFolder: () => {
      return gateway_client
        .get<FolderMetadataBody>(`${backend_url}/api/v1/files/folder/root`)
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
        .then(transformFolderMetadataBody)
        .catch((err) => {
          handleError(err);
          return null;
        });
    },
    getSubFolders: (id: FolderId): Promise<FolderMetadata[] | null> => {
      return gateway_client
        .get<FolderMetadataBody[]>(
          `${backend_url}/api/v1/files/folder?parent_folder_id=${id}`,
        )
        .then((folders) => folders.map(transformFolderMetadataBody))
        .catch((err) => {
          handleError(err);
          return null;
        });
    },
    getSubFiles: (id: FolderId): Promise<FileMetadata[] | null> => {
      return gateway_client
        .get<FileMetadataBody[]>(`${backend_url}/api/v1/files?folder_id=${id}`)
        .then((files) => files.map(transformFileMetadataBody))
        .catch((err) => {
          handleError(err);
          return null;
        });
    },
  };
};
export default FileService;
