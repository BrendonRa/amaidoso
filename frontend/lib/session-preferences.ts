import AsyncStorage from '@react-native-async-storage/async-storage';

export type LastSessionRole = 'responsavel' | 'idoso';

const LAST_SESSION_ROLE_KEY = '@amaidoso:last-session-role';

export async function setLastSessionRole(role: LastSessionRole): Promise<void> {
  await AsyncStorage.setItem(LAST_SESSION_ROLE_KEY, role);
}

export async function getLastSessionRole(): Promise<LastSessionRole | null> {
  const value = await AsyncStorage.getItem(LAST_SESSION_ROLE_KEY);
  return value === 'responsavel' || value === 'idoso' ? value : null;
}

export async function clearLastSessionRole(): Promise<void> {
  await AsyncStorage.removeItem(LAST_SESSION_ROLE_KEY);
}
