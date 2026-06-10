import React from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { getFirebaseAuth } from '@/lib/firebase';
import { subscribeIdosoByUid } from '@/lib/idoso-data-service';

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
  const profileUid = profile?.uid;

  React.useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(getFirebaseAuth(), (user) => {
      unsubscribeProfile?.();
      unsubscribeProfile = undefined;

      if (!user) {
        setProfile(null);
        return;
      }

      unsubscribeProfile = subscribeIdosoByUid(user.uid, (idoso) => {
        if (!idoso) {
          return;
        }

        setProfile({
          uid: idoso.uid,
          nome: idoso.nomeIdoso,
          cpf: idoso.cpf,
          dataNascimento: idoso.dataNascimento,
          fotoPerfil: idoso.fotoPerfil,
          responsavelId: idoso.responsavelId,
        });
      });
    });

    return () => {
      unsubscribeProfile?.();
      unsubscribeAuth();
    };
  }, []);

  React.useEffect(() => {
    if (!profileUid) {
      return undefined;
    }

    return subscribeIdosoByUid(profileUid, (idoso) => {
      if (!idoso) {
        setProfile(null);
        return;
      }

      setProfile({
        uid: idoso.uid,
        nome: idoso.nomeIdoso,
        cpf: idoso.cpf,
        dataNascimento: idoso.dataNascimento,
        fotoPerfil: idoso.fotoPerfil,
        responsavelId: idoso.responsavelId,
      });
    });
  }, [profileUid]);

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
