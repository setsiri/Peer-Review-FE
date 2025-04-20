'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import Link from 'next/link';
import { HomeIcon, ClipboardDocumentListIcon, XMarkIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Note, Material, addNote, addMaterial, getNotes, getMaterials, deleteNote } from '../data/TeacherNotesAndFiles';
import { useEffect, useState, useRef } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [localNotes, setLocalNotes] = useState<Note[]>(getNotes());
  const [localMaterials, setLocalMaterials] = useState<Material[]>(getMaterials());
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [showMaterialPopup, setShowMaterialPopup] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [newMaterial, setNewMaterial] = useState<Omit<Material, 'id' | 'uploadDate'>>({
    title: '',
    type: 'pdf',
    size: '',
    downloadUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setLocalNotes(getNotes());
      setLocalMaterials(getMaterials());
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const assignmentPath = user.role === 'student' 
    ? '/dashboard/studentassignment' 
    : '/dashboard/teacherassignment';

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      const addedNote = addNote({
        ...newNote,
        date: new Date().toISOString().split('T')[0]
      });
      setLocalNotes(getNotes());
      setNewNote({ title: '', content: '' });
      setShowNotePopup(false);
    }
  };

  const handleAddMaterial = () => {
    if (newMaterial.title && newMaterial.downloadUrl) {
      const addedMaterial = addMaterial({
        ...newMaterial,
        uploadDate: new Date().toISOString().split('T')[0]
      });
      setLocalMaterials(getMaterials());
      setNewMaterial({ title: '', type: 'pdf', size: '', downloadUrl: '' });
      setShowMaterialPopup(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setNewMaterial({
          ...newMaterial,
          title: data.originalName,
          type: data.fileType.split('/')[1] as 'pdf' | 'ppt' | 'doc',
          size: `${(data.fileSize / (1024 * 1024)).toFixed(1)} MB`,
          downloadUrl: `/CourseFiles/${data.fileName}`
        });
      } else {
        setUploadError(data.error || 'Error uploading file');
      }
    } catch (error) {
      setUploadError('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบโน้ตนี้?')) {
      deleteNote(id);
      setLocalNotes(getNotes());
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] overflow-hidden relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
          <div className="flex items-center gap-4 px-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#73daca] to-[#7aa2f7] rounded-2xl flex items-center justify-center">
              <HomeIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white translate-y-2">Course Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teacher's Notes */}
        <div className="bg-[#24283b] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[#1a1b26] flex justify-between items-center">
            <h2 className="text-[#a9b1d6] text-lg font-semibold">Teacher's Notes</h2>
            <button
              onClick={() => setShowNotePopup(true)}
              className="px-4 py-2 bg-[#7aa2f7] text-white rounded hover:bg-[#6a92e7] transition-colors"
            >
              Add Note
            </button>
          </div>
          <div className="divide-y divide-[#1a1b26]">
            {localNotes.map((note) => (
              <div key={note.id} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#7aa2f7] font-medium">{note.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[#787c99] text-sm">{note.date}</span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 text-red-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-400/10"
                      title="ลบโน้ต"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-[#a9b1d6] text-sm whitespace-pre-line">{note.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Slides */}
        <div className="bg-[#24283b] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[#1a1b26] flex justify-between items-center">
            <h2 className="text-[#a9b1d6] text-lg font-semibold">Course Slides & Documents</h2>
            <button
              onClick={() => setShowMaterialPopup(true)}
              className="px-4 py-2 bg-[#7aa2f7] text-white rounded hover:bg-[#6a92e7] transition-colors"
            >
              Add Material
            </button>
          </div>
          <div className="divide-y divide-[#1a1b26]">
            {localMaterials.map((material) => (
              <div key={material.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[#7aa2f7] font-medium">{material.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[#787c99] text-sm">
                        {material.type.toUpperCase()} • {material.size}
                      </span>
                      <span className="text-[#787c99] text-sm">
                        Uploaded: {material.uploadDate}
                      </span>
                    </div>
                  </div>
                  <a
                    href={material.downloadUrl}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1b26] text-[#73daca] rounded hover:bg-[#2a2e3b] transition-colors text-sm"
                    download
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note Popup */}
      {showNotePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#24283b] p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#a9b1d6] text-lg font-semibold">Add New Note</h3>
              <button onClick={() => setShowNotePopup(false)} className="text-[#a9b1d6] hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full p-2 bg-[#1a1b26] text-[#a9b1d6] rounded"
              />
              <textarea
                placeholder="Content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full p-2 bg-[#1a1b26] text-[#a9b1d6] rounded h-32"
              />
              <button
                onClick={handleAddNote}
                className="w-full py-2 bg-[#7aa2f7] text-white rounded hover:bg-[#6a92e7] transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Material Popup */}
      {showMaterialPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#24283b] p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#a9b1d6] text-lg font-semibold">Add New Material</h3>
              <button onClick={() => setShowMaterialPopup(false)} className="text-[#a9b1d6] hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#7aa2f7] rounded-lg cursor-pointer bg-[#1a1b26] hover:bg-[#2a2e3b] transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ArrowUpTrayIcon className="w-8 h-8 mb-2 text-[#7aa2f7]" />
                    <p className="mb-2 text-sm text-[#a9b1d6]">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-[#787c99]">PDF, PPT, DOC (MAX. 10MB)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.ppt,.doc,.docx"
                  />
                </label>
                {uploading && (
                  <div className="mt-2 text-[#7aa2f7]">Uploading...</div>
                )}
                {uploadError && (
                  <div className="mt-2 text-red-500">{uploadError}</div>
                )}
                {newMaterial.downloadUrl && (
                  <div className="mt-2 text-[#73daca]">
                    File uploaded successfully!
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Title"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                className="w-full p-2 bg-[#1a1b26] text-[#a9b1d6] rounded"
              />
              <button
                onClick={handleAddMaterial}
                disabled={!newMaterial.downloadUrl}
                className="w-full py-2 bg-[#7aa2f7] text-white rounded hover:bg-[#6a92e7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 