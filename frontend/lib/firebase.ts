import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  getAuth,
  initializeAuth,
  type Auth,
  type Persistence,
} from 'firebase/auth';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';

import googleServices from '../google-services.json';

type GoogleServicesJson = {
  project_info: {
    project_number: string;
    project_id: string;
    storage_bucket: string;
  };
  client: Array<{
    client_info: { mobilesdk_app_id: string };
    api_key: Array<{ current_key: string }>;
  }>;
};

const gs = googleServices as GoogleServicesJson;

export function getFirebaseWebApiKey(): string {
  const client = gs.client[0];
  const key = client?.api_key?.[0]?.current_key;
  if (!key) {
    throw new Error('Chave de API ausente no google-services.json.');
  }
  return key;
}

function buildFirebaseConfig() {
  const client = gs.client[0];
  if (!client?.api_key?.[0]?.current_key) {
    throw new Error('google-services.json inválido ou sem client/api_key.');
  }
  const projectId = gs.project_info.project_id;
  const androidAppId = client.client_info.mobilesdk_app_id;
  /** Web: Google sign-in + OAuth exigem o App ID do app *Web* no Console (não o do Android). */
  const webAppId =
    typeof process !== 'undefined' && process.env.EXPO_PUBLIC_FIREBASE_WEB_APP_ID
      ? String(process.env.EXPO_PUBLIC_FIREBASE_WEB_APP_ID).trim()
      : '';
  const appId = Platform.OS === 'web' && webAppId ? webAppId : androidAppId;
  if (Platform.OS === 'web' && !webAppId && __DEV__) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Firebase] Na web, defina EXPO_PUBLIC_FIREBASE_WEB_APP_ID (Console → Configurações do projeto → Seus apps → Web). ' +
        'Sem isso, o login com Google costuma falhar; o appId do Android não é válido para o SDK web.',
    );
  }
  return {
    apiKey: client.api_key[0].current_key,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: gs.project_info.storage_bucket,
    messagingSenderId: String(gs.project_info.project_number),
    appId,
  };
}

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(buildFirebaseConfig());
}

let auth: Auth | undefined;

function getReactNativePersistence(): ((storage: typeof AsyncStorage) => Persistence) | undefined {
  return (FirebaseAuth as typeof FirebaseAuth & {
    getReactNativePersistence?: (storage: typeof AsyncStorage) => Persistence;
  }).getReactNativePersistence;
}

export function getFirebaseAuth(): Auth {
  if (auth) {
    return auth;
  }
  const firebaseApp = getFirebaseApp();
  try {
    if (Platform.OS === 'web') {
      auth = initializeAuth(firebaseApp, {
        persistence: browserLocalPersistence,
        popupRedirectResolver: browserPopupRedirectResolver,
      });
    } else {
      const reactNativePersistence = getReactNativePersistence();
      if (!reactNativePersistence) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn(
            '[Firebase] Persistência React Native não disponível neste bundle. ' +
              'O Auth será inicializado com a persistência padrão.',
          );
        }
        auth = getAuth(firebaseApp);
        return auth;
      }
      auth = initializeAuth(firebaseApp, {
        persistence: reactNativePersistence(AsyncStorage),
      });
    }
  } catch {
    auth = getAuth(firebaseApp);
  }
  return auth;
}

let db: Firestore | undefined;

export function getFirebaseFirestore(): Firestore {
  if (!db) {
    const app = getFirebaseApp();
    if (Platform.OS === 'web') {
      db = getFirestore(app);
    } else {
      try {
        db = initializeFirestore(app, {
          experimentalForceLongPolling: true,
        });
      } catch {
        db = getFirestore(app);
      }
    }
  }
  return db;
}

/** Garante App + Auth inicializados na subida (evita primeiro uso em tela isolada). */
export function initFirebase(): void {
  getFirebaseApp();
  getFirebaseAuth();
  getFirebaseFirestore();
}
