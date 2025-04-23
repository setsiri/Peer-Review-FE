"use client";

import { useState, useEffect } from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { mapStudentName } from "@/app/services/commonService";
import { useUser } from "@/app/contexts/UserContext";
import { createGroup, deleteGroup, getGroups } from "@/app/lib/group";
import { getStudents } from "@/app/lib/users";
import Loader from "@/app/components/Loader";

export default function GroupsPage() {
  const { user } = useUser();
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const isTeacher = user?.role === "INSTRUCTOR";
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const groupData = await getGroups();
        setGroups(groupData);

        if (isTeacher) {
          const studentData = await getStudents();
          setStudents(studentData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading groups:", err);
      }
    };
    fetchData();
  }, [toggleRefresh]);

  const userGroup = isStudent
    ? groups.find((g) => g.users.some((u: any) => u.id === user?.id))
    : null;

  const otherGroups = isStudent
    ? groups.filter((g) => g.id !== userGroup?.id)
    : groups;

  const handleOpenCreateModal = () => {
    setEditingGroup({ name: "", users: [] });
    setModalMode("create");
    setShowModal(true);
  };

  const handleSaveGroup = async () => {
    setLoading(true);
    if (modalMode === "create") {
      await createGroup({ name: editingGroup.name, userIds: selectedStudents });
    }
    setShowModal(false);
    setSelectedStudents([]);
    setEditingGroup(null);
    setToggleRefresh(!toggleRefresh);
    setLoading(false);
  };

  const handleDeleteGroup = async (groupId: string) => {
    setLoading(true);
    await deleteGroup(groupId);
    setToggleRefresh(!toggleRefresh);
    setLoading(false);
  };

  const getAvailableStudents = () => students.filter((s) => s.groupId == null);

  const getGroupStudents = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return [];
    const ids = group.users.map((u: any) => u.id);
    return students.filter((s) => ids.includes(s.id));
  };

  const isSubmitDisabled = () => {
    return !editingGroup?.name || selectedStudents.length === 0;
  };

  const renderGroupCard = (group: any) => (
    <div
      key={group.id}
      className="bg-[#24283b] rounded-lg p-6 flex flex-col h-full"
    >
      <div className="mb-4">
        <h2 className="text-[#7aa2f7] text-xl font-medium">{group.name}</h2>
        <div className="h-[2px] bg-gradient-to-r from-[#7aa2f7] to-transparent mt-2"></div>
      </div>
      <div className="flex-grow mb-4">
        <h3 className="text-[#a9b1d6] text-sm font-medium mb-2">สมาชิก</h3>
        <ul className="space-y-2">
          {group.users.map((student: any) => (
            <li
              key={student.id}
              className="text-[#a9b1d6] bg-[#2b3540] px-3 py-2 rounded-lg"
            >
              <span className="text-[#7aa2f7]">{mapStudentName(student)}</span>
            </li>
          ))}
        </ul>
      </div>
      {isTeacher && (
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => {
              setEditingGroup(group);
              setModalMode("edit");
              setSelectedStudents(group.users.map((s: any) => s.id));
              setShowModal(true);
            }}
            className="flex-1 bg-[#1a1b26] text-[#7aa2f7] px-3 py-2 rounded-lg hover:bg-[#2a2e3b]"
          >
            แก้ไข
          </button>
          <button
            onClick={() => handleDeleteGroup(group.id)}
            className="flex-1 bg-[#1a1b26] text-[#f7768e] px-3 py-2 rounded-lg hover:bg-[#2a2e3b]"
          >
            ลบ
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <Loader visible={isLoading} />
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] flex items-center px-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#39cf34] to-[#188f54] rounded-2xl flex items-center justify-center">
            <UserGroupIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="ml-4 text-3xl font-semibold text-white">
            Groups Dashboard
          </h1>
        </div>
      </div>

      {isTeacher && (
        <div className="flex justify-end mb-6">
          <button
            onClick={handleOpenCreateModal}
            className="primary-btn px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <span className="text-xl">+</span> สร้างกลุ่มใหม่
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userGroup && renderGroupCard(userGroup)}
        {otherGroups.map(renderGroupCard)}
      </div>

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
                  setEditingGroup({ ...editingGroup, name: e.target.value })
                }
                className="w-full bg-[#1a1b26] text-[#a9b1d6] px-3 py-2 rounded-lg"
                placeholder="กรอกชื่อกลุ่ม"
              />
            </div>
            <div className="mb-4">
              <label className=" ablock text-[#a9b1d6] mb-2">เลือกสมาชิก</label>
              {getAvailableStudents().length === 0 && modalMode === "create" ? (
                <div className="text-[#61667d] text-left self-start">
                  - นักเรียนมีกลุ่มหมดแล้ว -
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto bg-[#1a1b26] rounded-lg p-3">
                  {(modalMode === "create"
                    ? getAvailableStudents()
                    : getGroupStudents(editingGroup.id).concat(
                        getAvailableStudents()
                      )
                  ).map((student: any) => (
                    <div
                      key={student.id}
                      className="flex items-center mb-2 hover:bg-[#2a2e3b] p-2 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...selectedStudents, student.id]
                            : selectedStudents.filter(
                                (id) => id !== student.id
                              );
                          setSelectedStudents(updated);
                        }}
                        className="mr-3 w-4 h-4 accent-[#7aa2f7]"
                      />
                      <span className="text-[#7aa2f7]">
                        {mapStudentName(student)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedStudents([]);
                  setEditingGroup(null);
                }}
                className="bg-[#1a1b26] text-[#a9b1d6] px-4 py-2 rounded-lg hover:bg-[#2a2e3b]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveGroup}
                disabled={isSubmitDisabled()}
                className={`bg-[#7aa2f7] text-white px-4 py-2 rounded-lg hover:bg-[#5d84d7] ${
                  isSubmitDisabled() ? "opacity-50 cursor-not-allowed" : ""
                }`}
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
