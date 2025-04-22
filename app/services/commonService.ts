export const mapStudentName = (student: any) => {
  return `${student.firstName}${
    student.lastName ? " " + student.lastName : ""
  }`;
};
