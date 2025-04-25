import { MasterAssignment } from "@/app/types/assignmentResponse ";

interface AssignmentHeaderProps {
  masterAssignment?: MasterAssignment;
}

export default function AssignmentHeader({ masterAssignment }: AssignmentHeaderProps) {
  return (
    <div className="bg-[#24283b] p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{masterAssignment?.title}</h1>
      <div className="flex items-center gap-6 text-base">

        <div className="flex items-center gap-2">
          <span className="text-gray-400">Created:</span>
          <span
            className="text-white font-medium">{masterAssignment?.createdAt && new Date(masterAssignment.createdAt)?.toLocaleDateString("th-TH")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Due:</span>
          <span
            className="text-white font-medium">{masterAssignment?.dueDate && new Date(masterAssignment.dueDate)?.toLocaleDateString("th-TH")}</span>
        </div>

      </div>
    </div>
  );
}
