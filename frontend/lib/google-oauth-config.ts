import * as AuthSession from 'expo-auth-session';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import googleServices from '../google-services.json';

type OauthClient = { client_id: string; client_type: number };

type GoogleServicesWithOauth = {
  client: Array<{
    oauth_client?: OauthClient[];
  }>;
};

/**
 * Client ID OAuth tipo "Web" do `google-services.json` (Firebase costuma colocar client_type 3).
 * Para o fluxo nativo (expo-auth-session), o mesmo ID costuma servir como fallback em `clientId`
 * quando não há client iOS/Android dedicados (útil em desenvolvimento).
 */
function readWebClientIdFromGoogleServices(): string | undefined {
  const clients = (googleServices as GoogleServicesWithOauth).client?.[0]?.oauth_client;
  if (!clients?.length) {
    return undefined;
  }
  const web = clients.find((c) => c.client_type === 3);
  return web?.client_id;
}

export type ResponsavelGoogleAuthSessionConfig = {
  webClientId: string;
  iosClientId?: string;
  androidClientId?: string;
  /** Fallback usado pelo expo-auth-session quando o client da plataforma não está definido. */
  clientId: string;
  selectAccount: true;
  /** Nativo: redirect exato enviado ao Google (cadastrar no Google Cloud). */
  redirectUri?: string;
};

/** Expo Go: Google OAuth com expo-auth-session não é suportado (redirect exp:// rejeitado pelo Google). */
export function isRunningInExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

/**
 * URI de redirecionamento OAuth (tem que existir igual no Google Cloud → Credenciais → OAuth cliente Web).
 * Opcional: `EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI`.
 */
export function getResponsavelGoogleOAuthRedirectUri(): string {
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
  return AuthSession.makeRedirectUri({ scheme: 'amaidoso', path: 'oauth' });
}

/**
 * Config do Google para `expo-auth-session/providers/google`.
 * Prioridade: `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` → Web no google-services.json.
 * Opcional: `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` (build próprio / loja).
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
      : undefined;
  return {
    webClientId: web,
    iosClientId: ios || undefined,
    androidClientId: android || undefined,
    clientId: web,
    selectAccount: true,
    redirectUri: Platform.OS === 'web' ? undefined : getResponsavelGoogleOAuthRedirectUri(),
  };
}
