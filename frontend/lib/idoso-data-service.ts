import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';

export type IdosoResumo = {
  uid: string;
  nomeIdoso: string;
  cpf: string;
  dataNascimento: string;
  fotoPerfil: string | null;
  responsavelId: string;
};

export type Lembrete = {
  id: string;
  titulo: string;
  descricao: string;
  horario: string;
};

export type Medicacao = {
  id: string;
  nome: string;
  dose: string;
  horario: string;
  confirmado: boolean;
  confirmadoEm?: string | null;
};

export type Anotacao = {
  id: string;
  texto: string;
  createdBy: string;
  createdAtText?: string | null;
};

function idosoDoc(idosoUid: string) {
  return doc(getFirebaseFirestore(), 'idosos', idosoUid);
}

function idosoSubcollection(idosoUid: string, name: 'lembretes' | 'medicacoes' | 'anotacoes') {
  return collection(getFirebaseFirestore(), 'idosos', idosoUid, name);
}

export async function listIdososForCurrentResponsavel(): Promise<IdosoResumo[]> {
  const u = getFirebaseAuth().currentUser;
  if (!u) return [];
  const q = query(collection(getFirebaseFirestore(), 'idosos'), where('responsavelId', '==', u.uid));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      uid: docSnap.id,
      nomeIdoso: String(d.nomeIdoso ?? ''),
      cpf: String(d.cpf ?? ''),
      dataNascimento: String(d.dataNascimento ?? ''),
      fotoPerfil: d.fotoPerfil != null ? String(d.fotoPerfil) : null,
      responsavelId: String(d.responsavelId ?? ''),
    };
  });
}

export async function getIdosoByUid(idosoUid: string): Promise<IdosoResumo | null> {
  const snap = await getDoc(idosoDoc(idosoUid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    uid: snap.id,
    nomeIdoso: String(d.nomeIdoso ?? ''),
    cpf: String(d.cpf ?? ''),
    dataNascimento: String(d.dataNascimento ?? ''),
    fotoPerfil: d.fotoPerfil != null ? String(d.fotoPerfil) : null,
    responsavelId: String(d.responsavelId ?? ''),
  };
}

export async function listLembretes(idosoUid: string): Promise<Lembrete[]> {
  const q = query(idosoSubcollection(idosoUid, 'lembretes'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      titulo: String(d.titulo ?? ''),
      descricao: String(d.descricao ?? ''),
      horario: String(d.horario ?? ''),
    };
  });
}

export async function createLembrete(idosoUid: string, input: Omit<Lembrete, 'id'>): Promise<void> {
  await addDoc(idosoSubcollection(idosoUid, 'lembretes'), {
    ...input,
    createdAt: serverTimestamp(),
  });
}

export async function listMedicacoes(idosoUid: string): Promise<Medicacao[]> {
  const q = query(idosoSubcollection(idosoUid, 'medicacoes'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      nome: String(d.nome ?? ''),
      dose: String(d.dose ?? ''),
      horario: String(d.horario ?? ''),
      confirmado: Boolean(d.confirmado),
      confirmadoEm: d.confirmadoEm ? String(d.confirmadoEm) : null,
    };
  });
}

export async function createMedicacao(idosoUid: string, input: Omit<Medicacao, 'id' | 'confirmado'>): Promise<void> {
  await addDoc(idosoSubcollection(idosoUid, 'medicacoes'), {
    ...input,
    confirmado: false,
    confirmadoEm: null,
    createdAt: serverTimestamp(),
  });
}

export async function confirmMedicacao(idosoUid: string, medicacaoId: string, confirmado: boolean): Promise<void> {
  await setDoc(
    doc(getFirebaseFirestore(), 'idosos', idosoUid, 'medicacoes', medicacaoId),
    {
      confirmado,
      confirmadoEm: confirmado ? new Date().toISOString() : null,
    },
    { merge: true },
  );
}

export async function listAnotacoes(idosoUid: string): Promise<Anotacao[]> {
  const q = query(idosoSubcollection(idosoUid, 'anotacoes'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      texto: String(d.texto ?? ''),
      createdBy: String(d.createdBy ?? ''),
      createdAtText: d.createdAtText ? String(d.createdAtText) : null,
    };
  });
}

export async function createAnotacao(idosoUid: string, texto: string): Promise<void> {
  const u = getFirebaseAuth().currentUser;
  if (!u) throw new Error('Faça login para criar uma anotação.');
  await addDoc(idosoSubcollection(idosoUid, 'anotacoes'), {
    texto: texto.trim(),
    createdBy: u.uid,
    createdAt: serverTimestamp(),
    createdAtText: new Date().toLocaleString('pt-BR'),
  });
}
