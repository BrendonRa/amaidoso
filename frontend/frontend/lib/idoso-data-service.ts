import {
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
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
  notificationsEnabled?: boolean;
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

function mapIdosoDoc(docSnap: { id: string; data: () => Record<string, unknown> }): IdosoResumo {
  const d = docSnap.data();
  return {
    uid: docSnap.id,
    nomeIdoso: String(d.nomeIdoso ?? ''),
    cpf: String(d.cpf ?? ''),
    dataNascimento: String(d.dataNascimento ?? ''),
    fotoPerfil: d.fotoPerfil != null ? String(d.fotoPerfil) : null,
    responsavelId: String(d.responsavelId ?? ''),
    expoPushToken: d.expoPushToken ? String(d.expoPushToken) : '',
    notificationsEnabled: d.notificationsEnabled !== false,
  };
}

function mapLembreteDoc(docSnap: { id: string; data: () => Record<string, unknown> }): Lembrete {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    titulo: String(d.titulo ?? ''),
    descricao: String(d.descricao ?? ''),
    horario: String(d.horario ?? ''),
  };
}

function mapMedicacaoDoc(docSnap: { id: string; data: () => Record<string, unknown> }): Medicacao {
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
}

function mapAnotacaoDoc(docSnap: { id: string; data: () => Record<string, unknown> }): Anotacao {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    texto: String(d.texto ?? ''),
    createdBy: String(d.createdBy ?? ''),
    createdAtText: d.createdAtText ? String(d.createdAtText) : null,
  };
}

export async function listIdososForCurrentResponsavel(): Promise<IdosoResumo[]> {
  const u = getFirebaseAuth().currentUser;
  if (!u) return [];
  const q = query(collection(getFirebaseFirestore(), 'idosos'), where('responsavelId', '==', u.uid));
  const snap = await getDocs(q);
  return snap.docs.map(mapIdosoDoc);
}

export function subscribeIdososForCurrentResponsavel(
  onChange: (idosos: IdosoResumo[]) => void,
  onError?: (error: unknown) => void,
): Unsubscribe {
  let unsubscribeSnapshot: Unsubscribe | undefined;

  const subscribeForUser = (user: User | null) => {
    unsubscribeSnapshot?.();
    unsubscribeSnapshot = undefined;

    if (!user) {
      onChange([]);
      return;
    }

    const q = query(collection(getFirebaseFirestore(), 'idosos'), where('responsavelId', '==', user.uid));
    unsubscribeSnapshot = onSnapshot(q, (snap) => onChange(snap.docs.map(mapIdosoDoc)), onError);
  };

  const unsubscribeAuth = onAuthStateChanged(getFirebaseAuth(), subscribeForUser, onError);

  return () => {
    unsubscribeAuth();
    unsubscribeSnapshot?.();
  };
}

export async function getIdosoByUid(idosoUid: string): Promise<IdosoResumo | null> {
  const snap = await getDoc(idosoDoc(idosoUid));
  if (!snap.exists()) return null;
  return mapIdosoDoc(snap);
}

export function subscribeIdosoByUid(
  idosoUid: string,
  onChange: (idoso: IdosoResumo | null) => void,
  onError?: (error: unknown) => void,
): Unsubscribe {
  if (!idosoUid) {
    onChange(null);
    return () => undefined;
  }

  return onSnapshot(
    idosoDoc(idosoUid),
    (snap) => onChange(snap.exists() ? mapIdosoDoc(snap) : null),
    onError,
  );
}

function getExpoProjectId() {
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  return extra?.eas?.projectId;
}

export async function registerCurrentIdosoNotificationToken(idosoUid: string): Promise<void> {
  if (Platform.OS === 'web') return;

  const idosoSnap = await getDoc(idosoDoc(idosoUid));
  if (idosoSnap.exists() && idosoSnap.data().notificationsEnabled === false) {
    return;
  }

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
      notificationsEnabled: true,
      pushTokenUpdatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getIdosoNotificationsEnabled(idosoUid: string): Promise<boolean> {
  const snap = await getDoc(idosoDoc(idosoUid));
  return snap.exists() ? snap.data().notificationsEnabled !== false : true;
}

export async function setIdosoNotificationsEnabled(
  idosoUid: string,
  enabled: boolean,
): Promise<boolean> {
  if (!enabled) {
    await setDoc(
      idosoDoc(idosoUid),
      {
        expoPushToken: '',
        notificationsEnabled: false,
        pushTokenUpdatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return false;
  }

  if (Platform.OS === 'web') {
    await setDoc(
      idosoDoc(idosoUid),
      {
        notificationsEnabled: true,
        pushTokenUpdatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return true;
  }

  const currentPermission = await Notifications.getPermissionsAsync();
  let finalStatus = currentPermission.status;

  if (finalStatus !== 'granted') {
    const requestedPermission = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermission.status;
  }

  if (finalStatus !== 'granted') {
    await setDoc(idosoDoc(idosoUid), { notificationsEnabled: false }, { merge: true });
    return false;
  }

  const projectId = getExpoProjectId();
  const tokenResponse = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );

  await setDoc(
    idosoDoc(idosoUid),
    {
      expoPushToken: tokenResponse.data,
      notificationsEnabled: true,
      pushTokenUpdatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return true;
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
  return snap.docs.map(mapLembreteDoc);
}

export function subscribeLembretes(
  idosoUid: string,
  onChange: (lembretes: Lembrete[]) => void,
  onError?: (error: unknown) => void,
): Unsubscribe {
  if (!idosoUid) {
    onChange([]);
    return () => undefined;
  }

  const q = query(idosoSubcollection(idosoUid, 'lembretes'), orderBy('createdAt', 'desc'));
  const unsubscribeSnapshot = onSnapshot(q, (snap) => onChange(snap.docs.map(mapLembreteDoc)), onError);
  const refreshTimer = setInterval(() => {
    void listLembretes(idosoUid).then(onChange).catch(() => undefined);
  }, 7000);

  return () => {
    unsubscribeSnapshot();
    clearInterval(refreshTimer);
  };
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
  return snap.docs.map(mapMedicacaoDoc);
}

export function subscribeMedicacoes(
  idosoUid: string,
  onChange: (medicacoes: Medicacao[]) => void,
  onError?: (error: unknown) => void,
): Unsubscribe {
  if (!idosoUid) {
    onChange([]);
    return () => undefined;
  }

  const q = query(idosoSubcollection(idosoUid, 'medicacoes'), orderBy('createdAt', 'desc'));
  const unsubscribeSnapshot = onSnapshot(q, (snap) => onChange(snap.docs.map(mapMedicacaoDoc)), onError);
  const refreshTimer = setInterval(() => {
    void listMedicacoes(idosoUid).then(onChange).catch(() => undefined);
  }, 7000);

  return () => {
    unsubscribeSnapshot();
    clearInterval(refreshTimer);
  };
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
  return snap.docs.map(mapAnotacaoDoc);
}

export function subscribeAnotacoes(
  idosoUid: string,
  onChange: (anotacoes: Anotacao[]) => void,
  onError?: (error: unknown) => void,
): Unsubscribe {
  if (!idosoUid) {
    onChange([]);
    return () => undefined;
  }

  const q = query(idosoSubcollection(idosoUid, 'anotacoes'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => onChange(snap.docs.map(mapAnotacaoDoc)), onError);
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
