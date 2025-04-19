import { Assignment } from '../types/assignment';

interface AssignmentHeaderProps {
  assignment: Assignment;
}

export default function AssignmentHeader({ assignment }: AssignmentHeaderProps) {
  return (
    <div className="bg-[#24283b] rounded-t-lg p-6 mb-1">
      <h1 className="text-2xl font-semibold mb-2">{assignment.title}</h1>
      <p className="text-[#a9b1d6] text-sm">
        Assignment - {assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}
      </p>
      {assignment.dueDate && (
        <p className="text-[#a9b1d6] text-sm mt-1">
          Due: {assignment.dueDate.toLocaleDateString()}
        </p>
      )}
    </div>
  );
} 