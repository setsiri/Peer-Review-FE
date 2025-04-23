"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";

export default function SubjectDashboard() {
  const [subjectId, setSubjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubject = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/subject", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch subject data");
          setLoading(false);
          return;
        }

        const data = await response.json();
        if (data.length > 0) {
          setSubjectId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching subject data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, []);

  const handleSubjectClick = () => {
    if (subjectId) {
      localStorage.setItem("subjectId", subjectId);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1b26] p-6">
      <div className="bg-[#24283b] rounded-2xl shadow-xl p-8 w-full max-w-sm transition-all hover:scale-[1.02] duration-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader visible={loading} />
            <p className="text-[#a9b1d6] text-sm">Loading subject...</p>
          </div>
        ) : subjectId ? (
          <>
            <h2 className="text-[#7aa2f7] text-2xl font-semibold mb-3 tracking-tight">
              Software Des. & Dev.
            </h2>
            <p className="text-[#a9b1d6] text-sm mb-1">Code: 2110634</p>
            <p className="text-[#a9b1d6] text-sm mb-6">
              Instructor: อ.สมชาย ดวงดี
            </p>
            <button
              onClick={handleSubjectClick}
              className="bg-[#7aa2f7] text-[#1a1b26] hover:bg-[#5d84d7] transition-colors font-medium w-full py-2 rounded-lg"
            >
              Select Subject
            </button>
          </>
        ) : (
          <>
            <h2 className="text-[#f7768e] text-xl font-semibold mb-2">
              No Subject Found
            </h2>
            <p className="text-[#a9b1d6] text-sm mb-4">
              Please select a subject or contact your instructor.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
