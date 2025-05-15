import { createHTTPClient } from "../Clients/HTTPClient";
import type { FileUpsertionDTO } from "../DTOS";
import type { FileMetadata, FolderId } from "../types";

export interface IFileUploadService {
  uploadFile: (
    file: File,
    target_folder_id: FolderId,
  ) => Promise<FileMetadata | null>;
}
const FileUploadService = (
  backend_url: string,
  handle_error: (err: Error) => void,
) => {
  const gateway_client = createHTTPClient();
  const gatherStats = (
    file: File,
    target_folder_id: FolderId,
  ): FileUpsertionDTO => {
    return {
      file_name: file.name,
      folder_id: target_folder_id,
      mime_type: file.type,
      size_bytes: file.size,
    };
  };
  const uploadFile = (
    file: File,
    target_folder_id: FolderId,
  ): Promise<FileMetadata | null> =>
    gateway_client
      .post(
        `${backend_url}/api/v1/files/upload`,
        {},
        gatherStats(file, target_folder_id),
      )
      .then((data) => {
        console.log(data);
        return null;
      })
      .catch((err: Error) => {
        handle_error(err);
        return null;
      });

  return {
    uploadFile,
  };
};
export default FileUploadService;
