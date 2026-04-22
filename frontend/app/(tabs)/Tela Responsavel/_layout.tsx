import { Stack } from 'expo-router';
import React from 'react';

export default function TelaResponsavelLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 220,
      }}>
      <Stack.Screen name="tela_login_responsavel" />
      <Stack.Screen name="tela_cadastro_responsavel" />
      <Stack.Screen name="tela_recuperar_senha_responsavel" />
      <Stack.Screen name="tela_recuperar_senha_codigo_responsavel" />
      <Stack.Screen name="tela_home_responsavel" />
      <Stack.Screen name="tela_painel_responsavel" />
      <Stack.Screen name="tela_config_responsavel" />
      <Stack.Screen name="tela_editar_perfil_responsavel" />
      <Stack.Screen name="tela_edicao_perfil_responsavel" />
    </Stack>
  );
}
