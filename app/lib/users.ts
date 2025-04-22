export const getStudents = async () => {
  try {
    const accessToken = await localStorage.getItem("accessToken");
    const response = await fetch("http://localhost:3000/users/students", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }

    // filter only student from role="STUDENT"
    const data = await response.json();
    console.log("data", data);
    const students = data.filter((user: any) => user.role === "STUDENT");

    return students;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
