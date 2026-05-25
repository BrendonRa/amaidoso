import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { IdosoProfileProvider } from '@/contexts/idoso-profile-context';
import { ResponsavelProfileProvider } from '@/contexts/responsavel-profile-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { initFirebase } from '@/lib/firebase';

WebBrowser.maybeCompleteAuthSession();
initFirebase();

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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <ResponsavelProfileProvider>
          <IdosoProfileProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                animationDuration: 220,
              }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
            <StatusBar style="auto" />
          </IdosoProfileProvider>
        </ResponsavelProfileProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
