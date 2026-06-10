import * as Google from 'expo-auth-session/providers/google';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  getAuthErrorMessage,
  loginResponsavelGoogleWebWithPopup,
  signInResponsavelWithGoogleFromIdToken,
  type ResponsavelGoogleUser,
} from '@/lib/firebase-auth-service';
import { getResponsavelGoogleAuthSessionConfig, getResponsavelGoogleOAuthRedirectUri, isRunningInExpoGo } from '@/lib/google-oauth-config';

type Props = {
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
  onSuccess: (user: ResponsavelGoogleUser) => void;
  onError: (message: string) => void;
  label?: string;
};

export function ResponsavelGoogleSignInButton({
  disabled = false,
  onBusyChange,
  onSuccess,
  onError,
  label = 'Continuar com Google',
}: Props) {
  const googleConfig = React.useMemo(() => getResponsavelGoogleAuthSessionConfig(), []);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(googleConfig);

  const processingRef = React.useRef(false);

  React.useEffect(() => {
    if (__DEV__ && Platform.OS !== 'web' && !isRunningInExpoGo()) {
      const uri = getResponsavelGoogleOAuthRedirectUri();
      // eslint-disable-next-line no-console
      console.warn(
        `[Google OAuth] Cadastre no Google Cloud → APIs e serviços → Credenciais → Cliente OAuth Web (mesmo ID do Firebase) ` +
          `esta URI em "URIs de redirecionamento autorizados" (copie exatamente):\n${uri}`,
      );
    }
  }, []);

  const setBusy = React.useCallback(
    (v: boolean) => {
      onBusyChange?.(v);
    },
    [onBusyChange],
  );

  React.useEffect(() => {
    if (Platform.OS === 'web' || !response) {
      return;
    }
    if (response.type === 'cancel' || response.type === 'dismiss') {
      setBusy(false);
      processingRef.current = false;
      return;
    }
    if (response.type === 'error') {
      setBusy(false);
      processingRef.current = false;
      onError(getAuthErrorMessage(response.error ?? response, 'google'));
      return;
    }
    if (response.type !== 'success') {
      return;
    }
    const idToken =
      response.params.id_token ||
      (response.authentication && 'idToken' in response.authentication
        ? (response.authentication as { idToken?: string }).idToken
        : undefined);
    const accessToken =
      response.params.access_token ||
      (response.authentication && 'accessToken' in response.authentication
        ? (response.authentication as { accessToken?: string }).accessToken
        : undefined);
    if (!idToken || processingRef.current) {
      return;
    }
    processingRef.current = true;
    void (async () => {
      try {
        const user = await signInResponsavelWithGoogleFromIdToken(idToken, accessToken ?? null);
        onSuccess(user);
      } catch (e) {
        onError(getAuthErrorMessage(e, 'google'));
      } finally {
        setBusy(false);
        processingRef.current = false;
      }
    })();
  }, [response, onError, onSuccess, setBusy]);

  const handlePress = React.useCallback(async () => {
    if (Platform.OS === 'web') {
      try {
        setBusy(true);
        const user = await loginResponsavelGoogleWebWithPopup();
        onSuccess(user);
      } catch (e) {
        onError(getAuthErrorMessage(e, 'google'));
      } finally {
        setBusy(false);
      }
      return;
    }
    if (isRunningInExpoGo()) {
      onError('O login com Google não está disponível no Expo Go. Use e-mail e senha neste ambiente.');
      return;
    }
    if (!request) {
      return;
    }
    setBusy(true);
    try {
      const r = await promptAsync();
      if (r.type === 'cancel' || r.type === 'dismiss' || r.type === 'locked') {
        setBusy(false);
        return;
      }
      if (r.type === 'error') {
        setBusy(false);
        onError(getAuthErrorMessage(r.error ?? r, 'google'));
        return;
      }
      if (r.type === 'success') {
        return;
      }
    } catch (e) {
      setBusy(false);
      onError(getAuthErrorMessage(e, 'google'));
    }
  }, [onError, onSuccess, promptAsync, request, setBusy]);

  const buttonDisabled =
    disabled || (Platform.OS !== 'web' && !isRunningInExpoGo() && !request);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.75}
        disabled={buttonDisabled}
        onPress={() => void handlePress()}
        style={styles.googleButton}>
        <Image
          source={require('../assets/images/google-icon-logo.svg')}
          style={styles.googleIcon}
          contentFit="contain"
        />
        <Text style={styles.googleButtonText}>{label}</Text>
      </TouchableOpacity>
      {Platform.OS !== 'web' ? (
        <Text style={styles.hint}>Tambem pode entrar com e-mail e senha.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C8C8C8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  hint: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 15,
    alignSelf: 'center',
    maxWidth: 320,
  },
});
