import React from 'react';

type ResponsavelProfile = {
  nome: string;
  usuario: string;
  nascimento: string;
  email: string;
  senha: string;
  photoUri: string | null;
};

type ResponsavelProfileContextValue = {
  profile: ResponsavelProfile;
  setProfile: React.Dispatch<React.SetStateAction<ResponsavelProfile>>;
  updateProfile: (updates: Partial<ResponsavelProfile>) => void;
};

const initialProfile: ResponsavelProfile = {
  nome: 'Fulano da Silva',
  usuario: 'Fulano da Silva',
  nascimento: '',
  email: 'fulanosilva2002@gmail.com',
  senha: 'A12345678!',
  photoUri: null,
};

const ResponsavelProfileContext = React.createContext<ResponsavelProfileContextValue | undefined>(
  undefined,
);

export function ResponsavelProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<ResponsavelProfile>(initialProfile);

  const updateProfile = React.useCallback((updates: Partial<ResponsavelProfile>) => {
    setProfile((current) => ({ ...current, ...updates }));
  }, []);

  return (
    <ResponsavelProfileContext.Provider value={{ profile, setProfile, updateProfile }}>
      {children}
    </ResponsavelProfileContext.Provider>
  );
}

export function useResponsavelProfile() {
  const context = React.useContext(ResponsavelProfileContext);

  if (!context) {
    throw new Error('useResponsavelProfile must be used within ResponsavelProfileProvider');
  }

  return context;
}
