export interface MasterAssignment {
  title: string;
  detail: string;
  subjectId: string;
  isGroupAssignment: boolean;
}

export async function fetchMasterAssignments(): Promise<MasterAssignment[]> {
  const response = await fetch('http://localhost:3000/master-assignments');
  if (!response.ok) {
    throw new Error('Failed to fetch master assignments');
  }
  return response.json();
}