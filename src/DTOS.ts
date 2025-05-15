import type { FolderId } from "./types";

export interface FileUpsertionDTO {
  file_name: string;
  folder_id: FolderId;
  size_bytes: number;
  mime_type: string;
}
