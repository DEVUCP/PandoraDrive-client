import FolderSection from "../Components/FolderSection";
import FileTable from "../Components/FileTable";

const DrivePage: React.FC = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-8 text-center">
      <div className="flex-1 p-4">
        <FolderSection />
        <FileTable />
      </div>
    </div>
  );
};

export default DrivePage;
