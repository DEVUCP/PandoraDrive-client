import { createHTTPClient } from "../Clients/HTTPClient";

import {
  FileId,
  FileMetadata,
  FileMetadataBody as FileMetadataBody,
} from "../types";

type MimeType = `${string}/${string}`;
type Token = string;

export type IFileService = {
  get_root_folder: () => void;
  create_file: (data: {
    file_name: string;
    folder_id: number;
    size_bytes: number;
    mime_type: MimeType;
  }) => void;
  get_file: (file_id: FileId) => Promise<FileMetadata | null>;
};

const FileService = (
  backend_url: string,
  handle_error: (err: Error) => void,
): IFileService => {
  const gateway_client = createHTTPClient();

  return {
    get_root_folder: () => {
      gateway_client
        .get(`${backend_url}/api/v1/folder?user_id=1`)
        .catch((err: Error) => handle_error(err));
    },
    create_file: (data: {
      file_name: string;
      folder_id: number;
      size_bytes: number;
      mime_type: MimeType;
    }) => {
      gateway_client
        .post(`${backend_url}/api/v1/files/upload`, {}, data)
        .catch((err: Error) => handle_error(err));
    },
    get_file: (id: FileId) => {
      return gateway_client
        .get<FileMetadataBody>(`${backend_url}/api/v1/files?file_id=${id}`)
        .then(({ created_at, modified_at, ...rest }) => ({
          ...rest,
          created_at: new Date(created_at),
          modified_at: new Date(modified_at),
        }))
        .catch((err: Error) => {
          handle_error(err);
          return null;
        });
    },
  };
};
export default FileService;
