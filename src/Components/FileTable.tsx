import { useContext, useEffect, useState } from "react";
import { FileText, Folder } from "lucide-react";
import type { FileMetadata, FolderId } from "../types";
import { IFSCacheContext } from "../Contexts/FSCacheContext";

interface Params {
  parent_folder_id: FolderId;
}

const FileTable = ({ parent_folder_id }: Params) => {
  const { getSubFiles } = useContext(IFSCacheContext)!;
  const [files, setFiles] = useState<FileMetadata[]>([]);
  useEffect(() => {
    async function effect() {
      setFiles(await getSubFiles(parent_folder_id));
    }
    effect();
  }, []);
  return (
    <div className="mt-6">
      <h2 className="text-xl text-left font-bold mb-4">Files</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="text-gray-500 uppercase border-b text-xs bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Last modified</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, i) => (
              <tr
                key={i}
                className={`border-b hover:bg-blue-50 transition ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 flex items-center gap-2">
                  <FileText className={`w-5 h-5 "text-gray-500"`} />
                  <span className="whitespace-nowrap">{file.file_name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Folder className="w-4 h-4 text-gray-400" />
                    <span>{file.parent_folder_id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{file.modified_at.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileTable;
