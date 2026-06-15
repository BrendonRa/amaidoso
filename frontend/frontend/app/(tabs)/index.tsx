import { Redirect } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';
import { getLastSessionRole, type LastSessionRole } from '@/lib/session-preferences';

type InitialRoute =
  | './Tela Idoso/tela_inicio1'
  | './Tela Idoso/tela_principal_idoso'
  | './Tela Responsavel/tela_home_responsavel';

function routeForRole(role: LastSessionRole): InitialRoute {
  return role === 'idoso'
    ? './Tela Idoso/tela_principal_idoso'
    : './Tela Responsavel/tela_home_responsavel';
}

async function resolveAuthenticatedRoute(uid: string): Promise<InitialRoute> {
  const db = getFirebaseFirestore();
  const [responsavelSnap, idosoSnap] = await Promise.all([
    getDoc(doc(db, 'responsaveis', uid)),
    getDoc(doc(db, 'idosos', uid)),
  ]);

  if (responsavelSnap.exists()) {
    return './Tela Responsavel/tela_home_responsavel';
  }

  if (idosoSnap.exists()) {
    return './Tela Idoso/tela_principal_idoso';
  }

  const lastRole = await getLastSessionRole();
  return lastRole ? routeForRole(lastRole) : './Tela Idoso/tela_inicio1';
}

export default function TabsIndex() {
  const [initialRoute, setInitialRoute] = React.useState<InitialRoute | null>(null);

  React.useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (!user) {
        setInitialRoute('./Tela Idoso/tela_inicio1');
        return;
      }

      void resolveAuthenticatedRoute(user.uid)
        .then((route) => {
          if (active) {
            setInitialRoute(route);
          }
        })
        .catch(async () => {
          const lastRole = await getLastSessionRole().catch(() => null);
          if (active) {
            setInitialRoute(lastRole ? routeForRole(lastRole) : './Tela Idoso/tela_inicio1');
          }
        });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color="#F58220" />
      </View>
    );
  }

  return <Redirect href={initialRoute} />;
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
