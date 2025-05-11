import { createHTTPClient } from "../Clients/HTTPClient";

type MimeType = `${string}/${string}`;
type Token = string;
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const FileService = (
  backend_url: URL,
  handle_error: (err: Error) => void,
  token: Token,
) => {
  const client = createHTTPClient();

  return {
    get_root_folder: () => {
      client
        .get(`${backend_url}/api/v1/folder?user_id=1`)
        .catch((err: Error) => handle_error(err));
    },
    create_file: (data: {
      file_name: string;
      folder_id: number;
      size_bytes: number;
      mime_type: MimeType;
      created_at: Date;
      modified_at: Date;
    }) => {
      client
        .post(
          `${backend_url}/api/v1/files/upload`,
          {},
          {
            ...data,
            created_at: formatDate(data.created_at),
            modified_at: formatDate(data.modified_at),
            token,
          },
        )
        .catch((err: Error) => handle_error(err));
    },
  };
};
export default FileService;
