export type Token = string;
export type FileId = number;
export type FolderId = number;
export type Status = "Uploading" | "Uploaded" | "Flawed";

export interface FileMetadata {
  file_id: FileId;
  file_name: string;
  parent_folder_id: FolderId;
  created_at: Date;
  modified_at: Date;
  status: Status;
}

export interface FolderMetadata {
  folder_id: FolderId;
  parent_folder_id: FolderId;
  created_at: Date;
  status: Status;
}
