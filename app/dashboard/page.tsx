"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/UserContext";
import {
  Note,
  Material,
  addNote,
  addMaterial,
  getNotes,
  getMaterials,
  deleteNote,
  deleteMaterial,
} from "../data/TeacherNotesAndFiles";
import {
  HomeIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [showMaterialPopup, setShowMaterialPopup] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [newMaterial, setNewMaterial] = useState<
    Omit<Material, "id" | "uploadDate">
  >({
    title: "",
    type: "pdf",
    size: "",
    downloadUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setNotes(getNotes());
      setMaterials(getMaterials());
    }
  }, [user, router]);

  if (!user) return null;

  const isTeacher = user.role === "INSTRUCTOR";

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      addNote({ ...newNote, date: new Date().toISOString().split("T")[0] });
      setNotes(getNotes());
      setNewNote({ title: "", content: "" });
      setShowNotePopup(false);
    }
  };

  const handleAddMaterial = () => {
    if (newMaterial.title && newMaterial.downloadUrl) {
      addMaterial({
        ...newMaterial,
        uploadDate: new Date().toISOString().split("T")[0],
      });
      setMaterials(getMaterials());
      setNewMaterial({ title: "", type: "pdf", size: "", downloadUrl: "" });
      setShowMaterialPopup(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm("Delete this note?")) {
      deleteNote(id);
      setNotes(getNotes());
    }
  };

  const handleDeleteMaterial = (id: string) => {
    if (window.confirm("Delete this file?")) {
      deleteMaterial(id);
      setMaterials(getMaterials());
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setNewMaterial({
          ...newMaterial,
          title: data.originalName,
          type: data.fileType.split("/")[1],
          size: `${(data.fileSize / (1024 * 1024)).toFixed(1)} MB`,
          downloadUrl: `/CourseFiles/${data.fileName}`,
        });
      } else {
        setUploadError(data.error || "Upload failed");
      }
    } catch {
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] overflow-hidden flex items-center px-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#7eeddc] to-[#6594f7] rounded-2xl flex items-center justify-center">
            <HomeIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="ml-4 text-3xl font-semibold text-white">
            Course Dashboard
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes */}
        <div className="bg-[#24283b] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[#1a1b26] flex justify-between items-center">
            <h2 className="text-[#a9b1d6] text-lg font-semibold">
              Teacher's Notes
            </h2>
            {isTeacher && (
              <button
                onClick={() => setShowNotePopup(true)}
                className="primary-btn px-4 py-2 rounded"
              >
                Add Note
              </button>
            )}
          </div>
          <div className="divide-y divide-[#1a1b26]">
            {notes.map((note) => (
              <div key={note.id} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#7aa2f7] font-medium">{note.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[#787c99] text-sm">{note.date}</span>
                    {isTeacher && (
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 text-red-400"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[#a9b1d6] text-sm whitespace-pre-line">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div className="bg-[#24283b] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[#1a1b26] flex justify-between items-center">
            <h2 className="text-[#a9b1d6] text-lg font-semibold">
              Course Slides & Documents
            </h2>
            {isTeacher && (
              <button
                onClick={() => setShowMaterialPopup(true)}
                className="primary-btn px-4 py-2 rounded"
              >
                Add Material
              </button>
            )}
          </div>
          <div className="divide-y divide-[#1a1b26]">
            {materials.map((m) => (
              <div key={m.id} className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-[#7aa2f7] font-medium">{m.title}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-[#787c99]">
                    <span>
                      {m.type.toUpperCase()} • {m.size}
                    </span>
                    <span>Uploaded: {m.uploadDate}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <a
                    href={m.downloadUrl}
                    download
                    className="px-4 py-2 bg-[#1a1b26] text-[#73daca] rounded text-sm"
                  >
                    Download
                  </a>
                  {isTeacher && (
                    <button
                      onClick={() => handleDeleteMaterial(m.id)}
                      className="p-2 text-red-400"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popups */}
      {isTeacher && showNotePopup && (
        <Popup title="Add New Note" onClose={() => setShowNotePopup(false)}>
          <input
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            placeholder="Title"
            className="input border border-[#3b4261] bg-[#1a1b26] text-[#c0caf5] rounded-lg p-2 w-full"
          />
          <textarea
            value={newNote.content}
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
            placeholder="Content"
            className="input border border-[#3b4261] bg-[#1a1b26] text-[#c0caf5] rounded-lg p-2 w-full h-32"
          />
          <button
            onClick={handleAddNote}
            className="primary-btn w-full mt-4 bg-gradient-to-r from-[#7eeddc] to-[#6594f7] text-white py-2 rounded-lg hover:opacity-90"
          >
            Add Note
          </button>
        </Popup>
      )}

      {isTeacher && showMaterialPopup && (
        <Popup
          title="Add New Material"
          onClose={() => setShowMaterialPopup(false)}
        >
          <label
            htmlFor="file-upload"
            className="file-upload flex flex-col items-center justify-center border border-dashed border-[#3b4261] bg-[#1a1b26] text-[#7aa2f7] rounded-lg p-4 cursor-pointer hover:bg-[#24283b]"
          >
            <ArrowUpTrayIcon className="w-8 h-8" />
            <span className="mt-2">Click to upload file</span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.ppt,.doc,.docx"
            />
          </label>
          {uploading && <p className="text-[#7aa2f7] mt-2">Uploading...</p>}
          {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
          <input
            value={newMaterial.title}
            onChange={(e) =>
              setNewMaterial({ ...newMaterial, title: e.target.value })
            }
            placeholder="Title"
            className="input border border-[#3b4261] bg-[#1a1b26] text-[#c0caf5] rounded-lg p-2 w-full mt-4"
          />
          <button
            onClick={handleAddMaterial}
            disabled={!newMaterial.downloadUrl}
            className="primary-btn w-full mt-4 bg-gradient-to-r from-[#7eeddc] to-[#6594f7] text-white py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            Add Material
          </button>
        </Popup>
      )}
    </div>
  );
}

function Popup({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#1e2030] to-[#24283b] p-6 rounded-lg w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-[#c0caf5] font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#1a1b26] hover:bg-[#3b4261]"
          >
            <XMarkIcon className="w-6 h-6 text-[#c0caf5]" />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
