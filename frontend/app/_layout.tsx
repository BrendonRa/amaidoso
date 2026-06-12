import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedStartupSplash } from '@/components/animated-startup-splash';
import { AppAlertProvider } from '@/components/app-alert';
import { IdosoProfileProvider } from '@/contexts/idoso-profile-context';
import { LanguageProvider } from '@/contexts/language-context';
import { ResponsavelProfileProvider } from '@/contexts/responsavel-profile-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { initFirebase } from '@/lib/firebase';

WebBrowser.maybeCompleteAuthSession();
initFirebase();
void SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [rootReady, setRootReady] = React.useState(false);
  const [showStartupSplash, setShowStartupSplash] = React.useState(true);

  const handleRootLayout = React.useCallback(() => {
    if (rootReady) {
      return;
    }
    setRootReady(true);
    void SplashScreen.hideAsync();
  }, [rootReady]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.root} onLayout={handleRootLayout}>
        <SafeAreaProvider>
          <PaperProvider>
            <LanguageProvider>
              <ResponsavelProfileProvider>
                <IdosoProfileProvider>
                  <AppAlertProvider>
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        animation: 'fade',
                        animationDuration: 220,
                      }}>
                      <Stack.Screen name="(tabs)" />
                    </Stack>
                    <StatusBar style="dark" />
                  </AppAlertProvider>
                </IdosoProfileProvider>
              </ResponsavelProfileProvider>
            </LanguageProvider>
          </PaperProvider>
        </SafeAreaProvider>

        {rootReady && showStartupSplash ? (
          <AnimatedStartupSplash onFinish={() => setShowStartupSplash(false)} />
        ) : null}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
