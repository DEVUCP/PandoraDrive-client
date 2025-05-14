import React from "react";
import FolderSection from "../Components/FolderSection";
import FileTable from "../Components/FileTable";

const DrivePage: React.FC = () => {
  return (
    <div className="flex-1 p-4">
      <FolderSection />
      <FileTable />
    </div>
  );
};

export default DrivePage;
