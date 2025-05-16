import { useContext } from "react";
import { DriveContext } from "../Contexts/DriveContext";
import { Folder } from "lucide-react";
import { Link } from "react-router-dom";

const folders = ["Projects", "Photos", "Music", "Archive", "Backup"];

const FolderSection = () => {
  const { folders } = useContext(DriveContext)!;
  return (
    <div className="mb-10">
      <h2 className="text-xl text-left font-bold mb-4">Folders</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {folders.map(({ folder_name, folder_id }) => (
          <Link
            to={`/drive/${folder_id}`}
            key={folder_name}
            className="flex-shrink-0 flex items-center gap-2 bg-white rounded-lg px-4 py-3 shadow hover:bg-gray-100 transition min-w-[160px]"
          >
            <Folder className="text-yellow-500 w-5 h-5" />
            <span className="text-sm font-medium">{folder_name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FolderSection;
