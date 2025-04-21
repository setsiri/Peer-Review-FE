export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'doc';
  size: string;
  uploadDate: string;
  downloadUrl: string;
}

const STORAGE_KEY_NOTES = 'teacher-notes';
const STORAGE_KEY_MATERIALS = 'teacher-materials';

// Initial data
const defaultNotes: Note[] = [
  {
    id: '1',
    title: 'Initial data',
    content: 'Initial data',
    date: '2024-03-25'
  },
  
];

const defaultMaterials: Material[] = [
  {
    id: '1',
    title: 'Initial data',
    type: 'pdf',
    size: '2.5 MB',
    uploadDate: '2024-03-20',
    downloadUrl: '/materials/week1.pdf'
  },
  
];

// State management
let notes: Note[] = [...defaultNotes];
let materials: Material[] = [...defaultMaterials];

// Initialize data from localStorage
const initializeData = () => {
  if (typeof window !== 'undefined') {
    const storedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
    const storedMaterials = localStorage.getItem(STORAGE_KEY_MATERIALS);
    
    if (storedNotes) {
      notes = JSON.parse(storedNotes);
    } else {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    }
    
    if (storedMaterials) {
      materials = JSON.parse(storedMaterials);
    } else {
      localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(materials));
    }
  }
};

// Function to persist data to localStorage
const persistData = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(materials));
  }
};

// Initialize data on module load
if (typeof window !== 'undefined') {
  initializeData();
}

// Export notes and materials as arrays
export const getNotes = (): Note[] => notes;
export const getMaterials = (): Material[] => materials;

export const addNote = (newNote: Omit<Note, 'id'>): Note => {
  const note: Note = {
    ...newNote,
    id: Date.now().toString()
  };
  notes = [note, ...notes];
  persistData();
  return note;
};

export const addMaterial = (newMaterial: Omit<Material, 'id'>): Material => {
  const material: Material = {
    ...newMaterial,
    id: Date.now().toString()
  };
  materials = [material, ...materials];
  persistData();
  return material;
};

export const deleteNote = (id: string): boolean => {
  const initialLength = notes.length;
  notes = notes.filter(note => note.id !== id);
  if (notes.length !== initialLength) {
    persistData();
    return true;
  }
  return false;
};

export const deleteMaterial = (id: string): boolean => {
  const initialLength = materials.length;
  materials = materials.filter(material => material.id !== id);
  if (materials.length !== initialLength) {
    persistData();
    return true;
  }
  return false;
};

export const resetData = () => {
  notes = [...defaultNotes];
  materials = [...defaultMaterials];
  persistData();
};
