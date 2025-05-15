import { createHTTPClient } from "../Clients/HTTPClient";
import type { FileMetadataInsertedDTO, FileUpsertionDTO } from "../DTOS";
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
  const uploadFile = async (
    file: File,
    target_folder_id: FolderId,
  ): Promise<FileMetadata | null> => {
    return gateway_client
      .post<FileMetadataInsertedDTO>(
        `${backend_url}/api/v1/files/upload`,
        {},
        gatherStats(file, target_folder_id),
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

        Promise.all(promises).then((_) =>
          gateway_client.post(complete_link, {}, { token }).catch(handle_error),
        );
        return null;
      })
      .catch((err: Error) => {
        handle_error(err);
        return null;
      });
  };

  return {
    uploadFile,
  };
};
export default FileUploadService;
