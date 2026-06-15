import * as AuthSession from 'expo-auth-session';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import googleServices from '../google-services.json';

type OauthClient = { client_id: string; client_type: number };

type GoogleServicesWithOauth = {
  client: {
    oauth_client?: OauthClient[];
  }[];
};

function readOauthClientIdFromGoogleServices(clientType: number): string | undefined {
  const clients = (googleServices as GoogleServicesWithOauth).client?.[0]?.oauth_client;
  if (!clients?.length) {
    return undefined;
  }
  const client = clients.find((c) => c.client_type === clientType);
  return client?.client_id;
}

/**
 * Client ID OAuth tipo "Web" do `google-services.json` (Firebase costuma colocar client_type 3).
 */
function readWebClientIdFromGoogleServices(): string | undefined {
  return readOauthClientIdFromGoogleServices(3);
}

/**
 * Client ID OAuth tipo "Android" do `google-services.json` (client_type 1).
 * Ele aparece depois que o SHA-1/SHA-256 do app e o package name estao cadastrados no Firebase.
 */
function readAndroidClientIdFromGoogleServices(): string | undefined {
  return readOauthClientIdFromGoogleServices(1);
}

export type ResponsavelGoogleAuthSessionConfig = {
  webClientId: string;
  iosClientId?: string;
  androidClientId?: string;
  /** Fallback usado pelo expo-auth-session quando o client da plataforma não está definido. */
  clientId: string;
  selectAccount: true;
  /** Nativo: redirect exato enviado ao Google quando sobrescrito por env. */
  redirectUri?: string;
};

/** Expo Go: Google OAuth com expo-auth-session não é suportado (redirect exp:// rejeitado pelo Google). */
export function isRunningInExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

/**
 * URI de redirecionamento OAuth.
 * Opcional: `EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI`.
 */
export function getResponsavelGoogleOAuthRedirectUri(): string | undefined {
  const fromEnv =
    typeof process !== 'undefined' && process.env.EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI
      ? String(process.env.EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI).trim()
      : '';
  if (fromEnv) {
    return fromEnv;
  }
  if (Platform.OS === 'web') {
    return AuthSession.makeRedirectUri({ preferLocalhost: true });
  }
  return undefined;
}

/**
 * Config do Google para `expo-auth-session/providers/google`.
 * Prioridade: `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` → Web no google-services.json.
 * Opcional: `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` (build proprio / loja).
 */
export function getResponsavelGoogleAuthSessionConfig(): ResponsavelGoogleAuthSessionConfig {
  const fromEnv =
    typeof process !== 'undefined' && process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
      ? String(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID).trim()
      : '';
  const web = fromEnv || readWebClientIdFromGoogleServices();
  if (!web) {
    throw new Error(
      'Configure o login Google: defina EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ou adicione oauth_client Web no google-services.json.',
    );
  }
  const ios =
    typeof process !== 'undefined' && process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
      ? String(process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID).trim()
      : undefined;
  const android =
    typeof process !== 'undefined' && process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
      ? String(process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID).trim()
      : readAndroidClientIdFromGoogleServices();
  return {
    webClientId: web,
    iosClientId: ios || undefined,
    androidClientId: android || undefined,
    clientId: web,
    selectAccount: true,
    redirectUri: Platform.OS === 'web' ? undefined : getResponsavelGoogleOAuthRedirectUri(),
  };
}
