import 'firebase/auth';

declare module 'firebase/auth' {
  /**
   * Só existe no bundle React Native; os .d.ts do pacote `firebase/auth` vêm do build web.
   * Declaramos aqui para o TypeScript aceitar o import em `lib/firebase.ts`.
   */
  export function getReactNativePersistence(
    storage: import('@react-native-async-storage/async-storage').default
  ): import('firebase/auth').Persistence;
}
