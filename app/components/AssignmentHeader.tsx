import { Assignment } from '../types/assignment';

interface AssignmentHeaderProps {
  assignment: Assignment;
}

export default function AssignmentHeader({ assignment }: AssignmentHeaderProps) {
  return (
    <div className="bg-[#24283b] p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{assignment.title}</h1>
      <div className="flex items-center gap-6 text-base">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Assignment type:</span>
          <span className="px-2 py-1 rounded-full bg-[#7c5cff]/20 text-[#b845ff]">{assignment.type}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Created:</span>
          <span className="text-white font-medium">{assignment.createdAt?.toLocaleDateString('th-TH')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Due:</span>
          <span className="text-white font-medium">{assignment.dueDate?.toLocaleDateString('th-TH')}</span>
        </div>
        
      </div>
    </div>
  );
} 