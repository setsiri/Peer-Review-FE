export const mapName = (student: any) => {
  return `${student.firstName}${
    student.lastName ? " " + student.lastName : ""
  }`;
};
