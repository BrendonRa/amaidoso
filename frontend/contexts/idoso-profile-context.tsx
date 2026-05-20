import React from 'react';

export type IdosoProfile = {
  uid: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  fotoPerfil: string | null;
  responsavelId: string;
};

type IdosoProfileContextValue = {
  profile: IdosoProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<IdosoProfile | null>>;
  updateProfile: (updates: Partial<IdosoProfile>) => void;
  clearProfile: () => void;
};

const IdosoProfileContext = React.createContext<IdosoProfileContextValue | undefined>(undefined);

export function IdosoProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<IdosoProfile | null>(null);

  const updateProfile = React.useCallback((updates: Partial<IdosoProfile>) => {
    setProfile((current) => (current ? { ...current, ...updates } : null));
  }, []);

  const clearProfile = React.useCallback(() => {
    setProfile(null);
  }, []);

  return (
    <IdosoProfileContext.Provider value={{ profile, setProfile, updateProfile, clearProfile }}>
      {children}
    </IdosoProfileContext.Provider>
  );
}

export function useIdosoProfile() {
  const context = React.useContext(IdosoProfileContext);

  if (!context) {
    throw new Error('useIdosoProfile must be used within IdosoProfileProvider');
  }

  return context;
}
