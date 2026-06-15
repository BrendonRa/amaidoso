import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  updateProfile as updateFirebaseAuthProfile,
  verifyBeforeUpdateEmail,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { getFirebaseAuth, getFirebaseFirestore, getFirebaseWebApiKey } from '@/lib/firebase';

/** E-mail sintético único por CPF (Firebase Auth exige formato de e-mail). */
const IDOSO_EMAIL_HOST = 'amaidoso-cpf.com';

export function idosoAuthEmail(cpfDigits: string): string {
  return `idoso_${cpfDigits}@${IDOSO_EMAIL_HOST}`;
}

type AuthFlow = 'email' | 'google';
export type ResponsavelAuthProvider = 'password' | 'google' | 'unknown';

function mapFirebaseAuthMessage(code: string | undefined, flow?: AuthFlow): string {
  switch (code) {
    case 'auth/email-already-in-use':
    case 'EMAIL_EXISTS':
      return 'Este cadastro ja existe.';
    case 'EMAIL_NOT_VERIFIED':
      return 'Confirme seu e-mail antes de entrar.';
    case 'auth/invalid-email':
    case 'INVALID_EMAIL':
      return 'Digite um e-mail valido.';
    case 'auth/weak-password':
    case 'WEAK_PASSWORD':
      return 'Use pelo menos 6 caracteres.';
    case 'auth/missing-password':
      return 'Digite sua senha.';
    case 'auth/missing-new-password':
      return 'Crie uma senha.';
    case 'auth/requires-recent-login':
      return 'Entre novamente e tente de novo.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
    case 'INVALID_LOGIN_CREDENTIALS':
      return 'Dados incorretos.';
    case 'auth/network-request-failed':
      return 'Sem internet. Tente de novo.';
    case 'auth/too-many-requests':
      return 'Aguarde um pouco e tente de novo.';
    case 'auth/popup-blocked':
    case 'auth/popup-closed-by-user':
      return 'Login com Google fechado.';
    case 'auth/cancelled-popup-request':
      return 'Login cancelado.';
    case 'auth/unauthorized-domain':
      return 'Login indisponivel neste aparelho.';
    case 'auth/operation-not-allowed':
      return 'Este tipo de login nao esta disponivel.';
    case 'auth/internal-error':
      return 'Nao foi possivel entrar agora.';
    case 'auth/invalid-api-key':
      return 'Nao foi possivel entrar agora.';
    case 'auth/invalid-app-credential':
      return 'Nao foi possivel entrar agora.';
    case 'permission-denied':
      return 'Acesso nao permitido.';
    case 'unavailable':
      return 'Servico indisponivel. Tente de novo.';
    default:
      if (code?.startsWith('auth/')) {
        return 'Nao foi possivel entrar agora.';
      }
      return 'Nao foi possivel concluir. Tente de novo.';
  }
}

export function getAuthErrorMessage(error: unknown, flow?: AuthFlow): string {
  if (error && typeof error === 'object' && 'code' in error) {
    return mapFirebaseAuthMessage(String((error as { code: string }).code), flow);
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = String((error as { message: string }).message);
    if (msg.includes('EMAIL_EXISTS')) {
      return mapFirebaseAuthMessage('EMAIL_EXISTS', flow);
    }
    if (msg.includes('WEAK_PASSWORD')) {
      return mapFirebaseAuthMessage('WEAK_PASSWORD', flow);
    }
    if (msg.includes('OPERATION_NOT_ALLOWED')) {
      return mapFirebaseAuthMessage('auth/operation-not-allowed', flow);
    }
    if (msg.includes('INVALID_LOGIN_CREDENTIALS')) {
      return mapFirebaseAuthMessage('INVALID_LOGIN_CREDENTIALS', flow);
    }
    return 'Nao foi possivel concluir. Tente de novo.';
  }
  return 'Nao foi possivel concluir. Tente de novo.';
}

async function signUpIdentityToolkit(email: string, password: string): Promise<{ localId: string }> {
  const key = getFirebaseWebApiKey();
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  const json = (await res.json()) as { localId?: string; error?: { message: string } };
  if (!res.ok || !json.localId) {
    const code = json.error?.message ?? 'UNKNOWN';
    throw { code };
  }
  return { localId: json.localId };
}

export async function registerResponsavelFirebase(
  nome: string,
  email: string,
  password: string,
): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  const db = getFirebaseFirestore();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateFirebaseAuthProfile(cred.user, { displayName: nome });
  await sendEmailVerification(cred.user);
  void setDoc(doc(db, 'responsaveis', cred.user.uid), {
    nomeResponsavel: nome,
    usuario: nome,
    nascimento: '',
    email,
    emailVerificado: false,
    fotoPerfil: 'imagem_padrao.png',
    createdAt: serverTimestamp(),
  }).catch(() => undefined);
  return cred;
}

export async function resendCurrentResponsavelEmailVerification(): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Faça login novamente para reenviar o link de verificação.');
  }
  if (user.emailVerified) {
    return;
  }
  await sendEmailVerification(user);
}

export async function resendResponsavelEmailVerification(
  email: string,
  password: string,
): Promise<void> {
  const auth = getFirebaseAuth();
  const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  await cred.user.reload();
  if (!cred.user.emailVerified) {
    await sendEmailVerification(cred.user);
  }
  await signOut(auth).catch(() => undefined);
}

export function getCurrentResponsavelAuthProvider(): ResponsavelAuthProvider {
  const user = getFirebaseAuth().currentUser;
  const providers = user?.providerData.map((provider) => provider.providerId) ?? [];

  if (providers.includes('google.com')) {
    return 'google';
  }

  if (providers.includes('password')) {
    return 'password';
  }

  return 'unknown';
}

export async function requestResponsavelEmailChange(
  newEmail: string,
  currentPassword?: string,
  newPasswordForGoogleAccount?: string,
): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  const currentEmail = user?.email;

  if (!user || !currentEmail) {
    throw { code: 'auth/user-not-found' };
  }

  const normalizedNewEmail = newEmail.trim().toLowerCase();
  if (!normalizedNewEmail) {
    throw { code: 'auth/invalid-email' };
  }

  const provider = getCurrentResponsavelAuthProvider();

  if (provider === 'password') {
    if (!currentPassword) {
      throw { code: 'auth/missing-password' };
    }

    const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
    await reauthenticateWithCredential(user, credential);
  } else if (provider === 'google' && Platform.OS === 'web') {
    if (!newPasswordForGoogleAccount) {
      throw { code: 'auth/missing-new-password' };
    }

    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    await reauthenticateWithPopup(user, googleProvider);
    await updatePassword(user, newPasswordForGoogleAccount);
  } else if (provider === 'google') {
    if (!newPasswordForGoogleAccount) {
      throw { code: 'auth/missing-new-password' };
    }

    await updatePassword(user, newPasswordForGoogleAccount);
  }

  await verifyBeforeUpdateEmail(user, normalizedNewEmail);
}

async function ensureResponsavelDocFromGoogleUser(u: User): Promise<{
  nome: string;
  email: string;
  fotoPerfil: string | null;
}> {
  const db = getFirebaseFirestore();
  const ref = doc(db, 'responsaveis', u.uid);
  const snap = await getDoc(ref);
  const email = u.email ?? '';
  const nome = u.displayName ?? (email ? email.split('@')[0] : 'Responsável');
  const fotoUrl = u.photoURL;

  if (!snap.exists()) {
    await setDoc(ref, {
      nomeResponsavel: nome,
      email,
      emailVerificado: true,
      fotoPerfil: fotoUrl ?? 'imagem_padrao.png',
      createdAt: serverTimestamp(),
    });
  } else if (snap.data().emailVerificado !== true) {
    await setDoc(ref, { emailVerificado: true }, { merge: true });
  }

  const finalSnap = await getDoc(ref);
  const d = finalSnap.data();
  return {
    nome: String(d?.nomeResponsavel ?? nome),
    email: String(d?.email ?? email),
    fotoPerfil: d?.fotoPerfil != null ? String(d.fotoPerfil) : fotoUrl,
  };
}

export type ResponsavelGoogleUser = {
  nome: string;
  email: string;
  fotoPerfil: string | null;
};

/** Web: popup do Firebase (melhor em localhost / Expo web). */
export async function loginResponsavelGoogleWebWithPopup(): Promise<ResponsavelGoogleUser> {
  if (Platform.OS !== 'web') {
    throw new Error('Fluxo web-only: use o botão Google no app.');
  }
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const cred = await signInWithPopup(auth, provider);
  if (!cred.user.email) {
    throw new Error('Sua conta Google não retornou um e-mail. Escolha outra conta ou use cadastro por e-mail.');
  }
  return ensureResponsavelDocFromGoogleUser(cred.user);
}

/** Android/iOS: `id_token` do Google (ex.: expo-auth-session) → sessão Firebase. */
export async function signInResponsavelWithGoogleFromIdToken(
  idToken: string,
  accessToken?: string | null,
): Promise<ResponsavelGoogleUser> {
  const auth = getFirebaseAuth();
  const credential = GoogleAuthProvider.credential(idToken, accessToken ?? undefined);
  const cred = await signInWithCredential(auth, credential);
  if (!cred.user.email) {
    throw new Error('Sua conta Google não retornou um e-mail. Escolha outra conta ou use cadastro por e-mail.');
  }
  return ensureResponsavelDocFromGoogleUser(cred.user);
}

export async function loginResponsavelFirebase(
  email: string,
  password: string,
): Promise<{ nome: string; email: string; fotoPerfil: string | null }> {
  const auth = getFirebaseAuth();
  const db = getFirebaseFirestore();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await cred.user.reload();
  if (!cred.user.emailVerified) {
    await sendEmailVerification(cred.user).catch(() => undefined);
    await signOut(auth).catch(() => undefined);
    throw { code: 'EMAIL_NOT_VERIFIED' };
  }
  const fallbackEmail = cred.user.email ?? email;
  const fallbackNome = cred.user.displayName ?? fallbackEmail.split('@')[0];

  try {
    const ref = doc(db, 'responsaveis', cred.user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const d = snap.data();
      const profileEmail = String(d.email ?? fallbackEmail);
      if (d.emailVerificado !== true || profileEmail !== fallbackEmail) {
        void setDoc(
          ref,
          { email: fallbackEmail, emailVerificado: true },
          { merge: true },
        ).catch(() => undefined);
      }
      return {
        nome: String(d.nomeResponsavel ?? fallbackNome),
        email: fallbackEmail,
        fotoPerfil: d.fotoPerfil != null ? String(d.fotoPerfil) : null,
      };
    }

    void setDoc(ref, {
      nomeResponsavel: fallbackNome,
      email: fallbackEmail,
      emailVerificado: true,
      fotoPerfil: 'imagem_padrao.png',
      createdAt: serverTimestamp(),
    }).catch((e) => {
      if (__DEV__) {
         
        console.warn('[Firebase] Login ok, mas não foi possível criar o perfil do responsável no Firestore.', e);
      }
    });
  } catch (e) {
    if (__DEV__) {
       
      console.warn('[Firebase] Login ok, mas não foi possível ler o perfil do responsável no Firestore.', e);
    }
  }

  return { nome: fallbackNome, email: fallbackEmail, fotoPerfil: 'imagem_padrao.png' };
}

/** Envia e-mail do Firebase com link para redefinir a senha (abra o link no navegador). */
export async function sendResponsavelPasswordResetEmail(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    throw { code: 'auth/invalid-email' };
  }
  await sendPasswordResetEmail(auth, normalized);
}

export type UpdateResponsavelProfileInput = {
  nome: string;
  usuario: string;
  nascimento: string;
  fotoPerfil?: string | null;
};

export async function updateCurrentResponsavelProfile(
  input: UpdateResponsavelProfileInput,
): Promise<void> {
  const auth = getFirebaseAuth();
  const responsavel = auth.currentUser;
  if (!responsavel) {
    throw new Error('Faça login para editar seu perfil.');
  }

  const nome = input.nome.trim();
  const usuario = input.usuario.trim();
  const nascimento = input.nascimento.trim();
  const fotoPerfil = input.fotoPerfil || 'imagem_padrao.png';
  const db = getFirebaseFirestore();

  await setDoc(
    doc(db, 'responsaveis', responsavel.uid),
    {
      nomeResponsavel: nome,
      usuario,
      nascimento,
      email: responsavel.email ?? '',
      fotoPerfil,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  if (responsavel.displayName !== nome) {
    await updateFirebaseAuthProfile(responsavel, { displayName: nome });
  }
}

export async function loginIdosoFirebase(
  cpfDigits: string,
  password: string,
): Promise<{
  uid: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  fotoPerfil: string | null;
  responsavelId: string;
}> {
  const auth = getFirebaseAuth();
  const db = getFirebaseFirestore();
  const email = idosoAuthEmail(cpfDigits);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, 'idosos', cred.user.uid));
  if (!snap.exists()) {
    throw { code: 'auth/user-not-found' };
  }
  const d = snap.data();
  return {
    uid: cred.user.uid,
    nome: String(d.nomeIdoso ?? ''),
    cpf: String(d.cpf ?? cpfDigits),
    dataNascimento: String(d.dataNascimento ?? ''),
    fotoPerfil: d.fotoPerfil != null ? String(d.fotoPerfil) : null,
    responsavelId: String(d.responsavelId ?? ''),
  };
}

export type CreateIdosoInput = {
  cpfDigits: string;
  nomeIdoso: string;
  dataNascimento: string;
  senha: string;
};

/** Cria usuário Auth do idoso + documento no Firestore sem deslogar o responsável (REST signUp). */
export async function createIdosoForResponsavel(input: CreateIdosoInput): Promise<void> {
  const auth = getFirebaseAuth();
  const responsavel = auth.currentUser;
  if (!responsavel) {
    throw new Error('Faça login como responsável para cadastrar um idoso.');
  }
  if (input.senha.length < 6) {
    throw { code: 'auth/weak-password' };
  }
  if (input.cpfDigits.length !== 11) {
    throw new Error('CPF deve ter 11 dígitos.');
  }
  const email = idosoAuthEmail(input.cpfDigits);
  const { localId } = await signUpIdentityToolkit(email, input.senha);
  const db = getFirebaseFirestore();
  await setDoc(doc(db, 'idosos', localId), {
    cpf: input.cpfDigits,
    nomeIdoso: input.nomeIdoso.trim(),
    dataNascimento: input.dataNascimento.trim(),
    fotoPerfil: 'imagem_padrao.png',
    responsavelId: responsavel.uid,
    createdAt: serverTimestamp(),
  });
}

export type UpdateIdosoInput = {
  idosoUid: string;
  nomeIdoso: string;
  dataNascimento: string;
  fotoPerfil?: string | null;
};

/** Atualiza dados editáveis do idoso. CPF e senha ficam fora daqui porque definem o login Auth. */
export async function updateIdosoForResponsavel(input: UpdateIdosoInput): Promise<void> {
  const auth = getFirebaseAuth();
  const responsavel = auth.currentUser;
  if (!responsavel) {
    throw new Error('Faça login como responsável para editar um idoso.');
  }
  const db = getFirebaseFirestore();
  const ref = doc(db, 'idosos', input.idosoUid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw { code: 'auth/user-not-found' };
  }
  const d = snap.data();
  if (String(d.responsavelId ?? '') !== responsavel.uid) {
    throw { code: 'permission-denied' };
  }
  await setDoc(
    ref,
    {
      nomeIdoso: input.nomeIdoso.trim(),
      dataNascimento: input.dataNascimento.trim(),
      fotoPerfil: input.fotoPerfil || 'imagem_padrao.png',
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
