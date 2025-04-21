export interface Group {
  id: string;
  name: string;
  members: string[]; // Array of user IDs
  teacherId: string;
}

export const mockGroups: Group[] = [
  {
    "name": "6223156156564564",
    "members": [
      "67700000001",
      "67700000002",
      "67700000003"
    ],
    "teacherId": "T0000000001",
    "id": "4"
  },
  {
    "name": "8888888",
    "members": [
      "67700000002",
      "67700000001",
      "67700000003"
    ],
    "teacherId": "T0000000001",
    "id": "5"
  }
];