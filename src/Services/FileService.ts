import { createHTTPClient } from "../Clients/HTTPClient";

import { FolderMetadata } from "../types";

type MimeType = `${string}/${string}`;
type Token = string;

const FileService = (backend_url: URL, handle_error: (err: Error) => void) => {
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
  };
};
export default FileService;
