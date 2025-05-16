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
export type FileMetadataBody = Omit<
  FileMetadata,
  "created_at" | "modified_at"
> & {
  created_at: string;
  modified_at: string;
};

export interface FolderMetadata {
  folder_id: FolderId;
  parent_folder_id?: FolderId;
  folder_name: string;
  created_at: Date;
  status: Status;
}

export type FolderMetadataBody = Omit<FolderMetadata, "created_at"> & {
  created_at: string;
};

export interface User {
  username: string;
}
