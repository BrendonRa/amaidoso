import React from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import type { ResponsavelAuthProvider } from '@/lib/firebase-auth-service';
import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';

type ResponsavelProfile = {
  nome: string;
  usuario: string;
  nascimento: string;
  email: string;
  senha: string;
  photoUri: string | null;
  authProvider: ResponsavelAuthProvider;
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
  authProvider: 'unknown',
};

const ResponsavelProfileContext = React.createContext<ResponsavelProfileContextValue | undefined>(
  undefined,
);

function normalizePhotoUri(value: unknown, fallback?: string | null) {
  const photoUri = value != null ? String(value) : fallback;
  return photoUri && photoUri !== 'imagem_padrao.png' ? photoUri : null;
}

export function ResponsavelProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<ResponsavelProfile>(initialProfile);

  React.useEffect(() => {
    const auth = getFirebaseAuth();
    const db = getFirebaseFirestore();

    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        setProfile(initialProfile);
        return;
      }

      void getDoc(doc(db, 'responsaveis', user.uid))
        .then((snap) => {
          if (!snap.exists()) {
            return;
          }

          const data = snap.data();
          const email = user.email ?? String(data.email ?? initialProfile.email);
          const nome = String(data.nomeResponsavel ?? user.displayName ?? email.split('@')[0]);
          const providers = user.providerData.map((provider) => provider.providerId);
          const authProvider: ResponsavelAuthProvider = providers.includes('google.com')
            ? 'google'
            : providers.includes('password')
              ? 'password'
              : 'unknown';

          setProfile((current) => ({
            ...current,
            nome,
            usuario: String(data.usuario ?? nome),
            nascimento: String(data.nascimento ?? ''),
            email,
            photoUri: normalizePhotoUri(data.fotoPerfil, user.photoURL),
            authProvider,
          }));
        })
        .catch(() => undefined);
    });
  }, []);

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
