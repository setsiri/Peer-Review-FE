"use client";

import { useState, useEffect } from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { mapStudentName } from "@/app/services/commonService";
import { createGroup, deleteGroup, getGroups } from "@/app/lib/group";
import { getStudents } from "@/app/lib/users";
import Loader from "@/app/components/Loader";

export default function TeacherGroupsPage() {
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    // Fetch groups and students from the server
    const fetchGroupsAndStudents = async () => {
      try {
        setIsLoading(true);
        const groupsResponse = await getGroups();
        const studentsResponse = await getStudents();

        setGroups(groupsResponse);
        setStudents(studentsResponse);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchGroupsAndStudents();
  }, [toggleRefresh]);

  const handleOpenCreateModal = () => {
    setEditingGroup({
      name: "",
      users: [],
    });
    setModalMode("create");
    setShowModal(true);
  };

  const handleOpenEditModal = (group: any) => {
    setModalMode("edit");
    setEditingGroup(group);
    setSelectedStudents(group.users.map((student: any) => student.id));
    setShowModal(true);
  };

  const handleSaveGroup = async () => {
    if (modalMode === "create") {
      setIsLoading(true);
      await createGroup({
        name: editingGroup.name,
        userIds: selectedStudents, // array of student IDs
      });
      setIsLoading(false);
    }
    if (modalMode === "edit") {
      // No backend API for edit group now
    }

    setShowModal(false);
    setSelectedStudents([]);
    setEditingGroup(null);
    setToggleRefresh(!toggleRefresh);
  };

  const handleDeleteGroup = async (groupId: string) => {
    setIsLoading(true);
    await deleteGroup(groupId);
    setIsLoading(false);
    setToggleRefresh(!toggleRefresh);
  };

  const getAvailableStudents = () => {
    return students.filter((student) => {
      return student.groupId === null;
    });
  };

  const getGroupStudents = (groupId: string) => {
    const group = groups.find((group) => group.id === groupId);
    if (!group) return [];
    const groupStudentIds = group.users.map((user: any) => user.id);
    return students.filter((student) => {
      return groupStudentIds.includes(student.id);
    });
  };

  return (
    <div className="p-6">
      <Loader visible={isLoading} />
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] overflow-hidden relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
          <div className="flex items-center gap-4 px-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#39cf34] to-[#188f54] rounded-2xl flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white translate-y-2">
              Groups Dashboard
            </h1>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={handleOpenCreateModal}
          className="primary-btn px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span> สร้างกลุ่มใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-[#24283b] rounded-lg p-6 flex flex-col h-full"
          >
            <div className="mb-4">
              <h2 className="text-[#7aa2f7] text-xl font-medium">
                {group.name}
              </h2>
              <div className="h-[2px] bg-gradient-to-r from-[#7aa2f7] to-transparent mt-2"></div>
            </div>

            <div className="flex-grow mb-4">
              <h3 className="text-[#a9b1d6] text-sm font-medium mb-2">
                สมาชิก
              </h3>
              <ul className="space-y-2">
                {group.users.map((student: any) => (
                  <li
                    key={student.id}
                    className="text-[#a9b1d6] bg-gradient-to-r from-[#2b3540] to-transparent px-3 py-2 rounded-lg"
                  >
                    <span className="text-[#7aa2f7]">
                      {mapStudentName(student)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleOpenEditModal(group)}
                className="flex-1 bg-[#1a1b26] text-[#7aa2f7] px-3 py-2 rounded-lg hover:bg-[#2a2e3b] transition-colors flex items-center justify-center gap-2"
              >
                แก้ไข
              </button>
              <button
                onClick={() => handleDeleteGroup(group.id)}
                className="flex-1 bg-[#1a1b26] text-[#f7768e] px-3 py-2 rounded-lg hover:bg-[#2a2e3b] transition-colors flex items-center justify-center gap-2"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#24283b] p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-[#7aa2f7] mb-4">
              {modalMode === "create" ? "สร้างกลุ่มใหม่" : "แก้ไขกลุ่ม"}
            </h2>

            <div className="mb-4">
              <label className="block text-[#a9b1d6] mb-2">ชื่อกลุ่ม</label>
              <input
                type="text"
                value={editingGroup?.name || ""}
                onChange={(e) =>
                  setEditingGroup({
                    ...editingGroup,
                    name: e.target.value,
                  })
                }
                className="w-full bg-[#1a1b26] text-[#a9b1d6] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7aa2f7]"
                placeholder="กรอกชื่อกลุ่ม"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#a9b1d6] mb-2">เลือกสมาชิก</label>
              <div className="max-h-48 overflow-y-auto bg-[#1a1b26] rounded-lg p-3">
                {(modalMode === "create"
                  ? getAvailableStudents()
                  : getGroupStudents(editingGroup.id).concat(
                      getAvailableStudents()
                    )
                ).map((student: any) => (
                  <div
                    key={student.id}
                    className="flex items-center mb-2 hover:bg-[#2a2e3b] p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents([
                            ...selectedStudents,
                            student.id,
                          ]);
                        } else {
                          setSelectedStudents(
                            selectedStudents.filter((id) => id !== student.id)
                          );
                        }
                      }}
                      className="mr-3 w-4 h-4 accent-[#7aa2f7]"
                    />
                    <span className="text-[#a9b1d6]">
                      <span className="text-[#7aa2f7]">
                        {mapStudentName(student)}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedStudents([]);
                  setEditingGroup(null);
                }}
                className="bg-[#1a1b26] text-[#a9b1d6] px-4 py-2 rounded-lg hover:bg-[#2a2e3b] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveGroup}
                className="bg-[#7aa2f7] text-white px-4 py-2 rounded-lg hover:bg-[#5d84d7] transition-colors"
              >
                {modalMode === "create" ? "สร้าง" : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
