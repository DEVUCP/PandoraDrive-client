import type { FolderId } from "./types";

export interface FileUpsertionDTO {
  file_name: string;
  folder_id: FolderId;
  size_bytes: number;
  mime_type: string;
}

export interface FileMetadataInsertedDTO {
  token: string;
  upload_link: string;
  complete_link: string;
  chunk_size: number;
}
