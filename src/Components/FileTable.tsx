import React from "react";
import { FileText, Folder } from "lucide-react";

type File = {
  name: string;
  location: string;
  owner: string;
  modified: string;
  opened: string;
  iconColor?: string;
};

const files: File[] = [
  {
    name: "Hot Startups 2019 - Report",
    location: "My Drive",
    owner: "me",
    modified: "Apr 9, 2019",
    opened: "yesterday",
    iconColor: "text-blue-600",
  },
  {
    name: "Burning Minds - agenda",
    location: "My Drive",
    owner: "me",
    modified: "Apr 9, 2019",
    opened: "2 days ago",
    iconColor: "text-blue-600",
  },
  {
    name: "Onboarding sheet",
    location: "My Drive",
    owner: "me",
    modified: "Apr 9, 2019",
    opened: "3 days ago",
    iconColor: "text-green-600",
  },
];

const FileTable: React.FC = () => {
  return (
    <div className="mt-6">
      <h2 className="text-xl text-left font-bold mb-4">Files</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="text-gray-500 uppercase border-b text-xs bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Owner</th>
              <th className="px-6 py-3">Last modified</th>
              <th className="px-6 py-3">Last opened</th>
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
                  <FileText
                    className={`w-5 h-5 ${file.iconColor || "text-gray-500"}`}
                  />
                  <span className="whitespace-nowrap">{file.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Folder className="w-4 h-4 text-gray-400" />
                    <span>{file.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{file.owner}</td>
                <td className="px-6 py-4">{file.modified}</td>
                <td className="px-6 py-4">{file.opened}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileTable;
