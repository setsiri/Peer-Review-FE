export const validateOtp = async (otp: string, ref: string) => {
  try {
    const response = await fetch("http://localhost:3000/auth/validate-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: otp, ref }),
    });

    if (!response.ok) {
      throw new Error("Invalid OTP");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error validating OTP:", error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const accessToken = await localStorage.getItem("accessToken");
    const response = await fetch("http://localhost:3000/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
