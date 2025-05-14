import React from "react";
import { Folder } from "lucide-react";

const folders = ["Projects", "Photos", "Music", "Archive", "Backup"];

const FolderSection: React.FC = () => {
  return (
    <div className="mb-10">
      <h2 className="text-xl text-left font-bold mb-4">Folders</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {folders.map((name) => (
          <div
            key={name}
            className="flex-shrink-0 flex items-center gap-2 bg-white rounded-lg px-4 py-3 shadow hover:bg-gray-100 transition min-w-[160px]"
          >
            <Folder className="text-yellow-500 w-5 h-5" />
            <span className="text-sm font-medium">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderSection;
