import { createHTTPClient } from "../Clients/HTTPClient";
import type {
  FileCompletionMetadata,
  FileMetadataInsertedDTO,
  FileUpsertionDTO,
  FolderCompletionMetadata,
} from "../DTOS";
import type { FolderId } from "../types";

export interface IUploadService {
  uploadFile: (
    file: File,
    target_folder_id: FolderId,
  ) => Promise<FileCompletionMetadata | null>;
  uploadFolder: (
    folder_name: string,
    target_folder_id: FolderId,
  ) => Promise<FolderCompletionMetadata | null>;
}
const UploadService = (
  backend_url: string,
  handle_error: (err: Error) => void,
): IUploadService => {
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

  const uploadFile = async (file: File, target_folder_id: FolderId) => {
    const uploadBody = gatherStats(file, target_folder_id);
    return gateway_client
      .post<FileMetadataInsertedDTO>(
        `${backend_url}/api/v1/files/upload`,
        {},
        uploadBody,
      )
      .then((data) => {
        if (!data) return Promise.reject(Error("Failed to insert metadat"));
        const { upload_link, token, complete_link, chunk_size } = data;

        const totalChunks = Math.ceil(file.size / chunk_size);

        const uploadChunk = async (chunkIndex: number) => {
          const start = chunkIndex * chunk_size;
          const end = Math.min(file.size, start + chunk_size);
          const chunk = file.slice(start, end);

          const metadata = {
            chunk_sequence: chunkIndex,
            chunk_size: end - start,
            token,
          };
          const formData = new FormData();
          formData.append(
            "metadata",
            new Blob([JSON.stringify(metadata)], { type: "application/json" }),
          );
          formData.append("chunk", chunk);
          return gateway_client
            .post(
              upload_link,
              {
                "Content-Type": "multipart/form-data",
              },
              formData,
            )
            .catch(handle_error);
        };

        let promises = [];
        for (let i = 0; i < totalChunks; i++) promises.push(uploadChunk(i));

        return Promise.all(promises).then((_) =>
          gateway_client
            .post<FileCompletionMetadata>(complete_link, {}, { token })
            .catch((err) => {
              handle_error(err);
              return null;
            }),
        );
      })
      .catch((err: Error) => {
        handle_error(err);
        return null;
      });
  };

  const uploadFolder = (
    folder_name: string,
    target_folder_id: FolderId,
  ): Promise<FolderCompletionMetadata | null> =>
    gateway_client
      .post<FolderCompletionMetadata>(
        `${backend_url}/api/v1/files/folder/upload`,
        {},
        { folder_name, parent_folder_id: target_folder_id },
      )
      .catch((err) => {
        handle_error(err);
        return null;
      });

  return {
    uploadFile,
    uploadFolder,
  };
};
export default UploadService;
