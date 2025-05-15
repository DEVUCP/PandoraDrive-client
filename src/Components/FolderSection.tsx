import { useContext, useEffect, useState } from "react";
import { Folder } from "lucide-react";
import { FSContext } from "../Contexts/FSContext";
import type { FolderId, FolderMetadata } from "../types";

const folders = ["Projects", "Photos", "Music", "Archive", "Backup"];

interface Params {
  parent_folder_id: FolderId;
}
const FolderSection = ({ parent_folder_id }: Params) => {
  const { getSubFolders } = useContext(FSContext);
  const [folders, setFolders] = useState<FolderMetadata[]>();
  useEffect(() => {
    async function effect() {
      setFolders(await getSubFolders(parent_folder_id));
    }
    effect();
  }, []);
  return (
    <div className="mb-10">
      <h2 className="text-xl text-left font-bold mb-4">Folders</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {/* {folders.map(({ folder_name }) => ( */}
        {/*   <div */}
        {/*     key={folder_name} */}
        {/*     className="flex-shrink-0 flex items-center gap-2 bg-white rounded-lg px-4 py-3 shadow hover:bg-gray-100 transition min-w-[160px]" */}
        {/*   > */}
        {/*     <Folder className="text-yellow-500 w-5 h-5" /> */}
        {/*     <span className="text-sm font-medium">{folder_name}</span> */}
        {/*   </div> */}
        {/* ))} */}
      </div>
    </div>
  );
};

export default FolderSection;
