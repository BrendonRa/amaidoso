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
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';

export type IdosoResumo = {
  uid: string;
  nomeIdoso: string;
  cpf: string;
  dataNascimento: string;
  fotoPerfil: string | null;
  responsavelId: string;
  expoPushToken?: string;
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
  dataInicio?: string;
  usoContinuo?: boolean;
  frequencia?: 'Diário' | 'Semanal' | 'Mensal' | '';
  doseValor?: string;
  unidade?: 'ml' | 'mg';
  novo?: boolean;
  confirmado: boolean;
  confirmadoEm?: string | null;
};

export type CreateMedicacaoInput = {
  nome: string;
  dose?: string;
  horario: string;
  dataInicio: string;
  usoContinuo: boolean;
  frequencia: 'Diário' | 'Semanal' | 'Mensal' | '';
  doseValor: string;
  unidade: 'ml' | 'mg';
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
      expoPushToken: d.expoPushToken ? String(d.expoPushToken) : '',
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
    expoPushToken: d.expoPushToken ? String(d.expoPushToken) : '',
  };
}

function getExpoProjectId() {
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  return extra?.eas?.projectId;
}

export async function registerCurrentIdosoNotificationToken(idosoUid: string): Promise<void> {
  if (Platform.OS === 'web') return;

  const currentPermission = await Notifications.getPermissionsAsync();
  let finalStatus = currentPermission.status;

  if (finalStatus !== 'granted') {
    const requestedPermission = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermission.status;
  }

  if (finalStatus !== 'granted') return;

  const projectId = getExpoProjectId();
  const tokenResponse = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );

  await setDoc(
    idosoDoc(idosoUid),
    {
      expoPushToken: tokenResponse.data,
      pushTokenUpdatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

async function sendMedicationPushNotification(idosoUid: string, title: string, body: string) {
  const snap = await getDoc(idosoDoc(idosoUid));
  const token = snap.exists() ? String(snap.data().expoPushToken ?? '') : '';

  if (!token || (!token.startsWith('ExponentPushToken') && !token.startsWith('ExpoPushToken'))) {
    return;
  }

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      sound: 'default',
      title,
      body,
      data: { type: 'nova-medicacao', idosoUid },
    }),
  });
}

export async function updateCurrentIdosoPhoto(fotoPerfil: string | null): Promise<void> {
  const u = getFirebaseAuth().currentUser;
  if (!u) throw new Error('Faça login para alterar a foto.');

  await setDoc(
    idosoDoc(u.uid),
    {
      fotoPerfil: fotoPerfil || 'imagem_padrao.png',
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
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
      dataInicio: d.dataInicio ? String(d.dataInicio) : '',
      usoContinuo: Boolean(d.usoContinuo),
      frequencia: d.frequencia ? String(d.frequencia) as Medicacao['frequencia'] : '',
      doseValor: d.doseValor ? String(d.doseValor) : '',
      unidade: d.unidade === 'ml' ? 'ml' : 'mg',
      novo: Boolean(d.novo),
      confirmado: Boolean(d.confirmado),
      confirmadoEm: d.confirmadoEm ? String(d.confirmadoEm) : null,
    };
  });
}

export async function createMedicacao(idosoUid: string, input: CreateMedicacaoInput): Promise<void> {
  const dose = input.dose ?? `${input.doseValor} ${input.unidade}`;
  await addDoc(idosoSubcollection(idosoUid, 'medicacoes'), {
    ...input,
    dose,
    novo: true,
    confirmado: false,
    confirmadoEm: null,
    createdAt: serverTimestamp(),
  });

  await sendMedicationPushNotification(
    idosoUid,
    'Nova medicação',
    `${input.nome} - ${dose} às ${input.horario}`,
  ).catch(() => undefined);
}

export async function confirmMedicacao(idosoUid: string, medicacaoId: string, confirmado: boolean): Promise<void> {
  await setDoc(
    doc(getFirebaseFirestore(), 'idosos', idosoUid, 'medicacoes', medicacaoId),
    {
      confirmado,
      confirmadoEm: confirmado ? new Date().toISOString() : null,
      novo: false,
    },
    { merge: true },
  );
}

export async function markMedicacaoSeen(idosoUid: string, medicacaoId: string): Promise<void> {
  await setDoc(
    doc(getFirebaseFirestore(), 'idosos', idosoUid, 'medicacoes', medicacaoId),
    { novo: false },
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
