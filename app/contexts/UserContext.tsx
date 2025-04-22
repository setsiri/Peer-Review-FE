'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type UserRole = 'STUDENT' | 'INSTRUCTOR';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentId?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedRole) {
      setRole(savedRole as UserRole);
    }
    
    setIsInitialized(true);
  }, []);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  const updateRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('role', newRole);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, role, setRole: updateRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 