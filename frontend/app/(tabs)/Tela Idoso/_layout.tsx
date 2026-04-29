import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 220,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="tela_inicio1" />
      <Stack.Screen name="tela_inicio2" />
      <Stack.Screen name="tela_login_idoso" />
      <Stack.Screen name="tela_lembretes" />
      <Stack.Screen name="tela_medicacao" />
      <Stack.Screen name="Tela_Principal" />
      <Stack.Screen name="tela_principal_idoso" />
      <Stack.Screen name="tela_tutorial_idoso" />
      <Stack.Screen name="tela_configuracao_idoso" />
    </Stack>
  );
}
