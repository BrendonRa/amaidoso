import React from 'react';
import IdosoBottomNav from './IdosoBottomNav';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, SafeAreaView as SafeAreaInsetsView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useIdosoProfile } from '@/contexts/idoso-profile-context';
import { useLanguage } from '@/contexts/language-context';

type TutorialStep = {
  body: string;
  primaryLabel: string;
  secondaryLabel?: string;
};

const tutorialSteps: TutorialStep[] = [
  {
    body: 'Bem vindo ao Amaidoso',
    primaryLabel: 'Avancar',
  },
  {
    body: 'Parece que essa e a sua primeira vez aqui, deseja realizar o tutorial?',
    primaryLabel: 'Sim',
    secondaryLabel: 'Nao, obrigado',
  },
  {
    body: 'Esta e a tela inicial onde aparecera as proximas tarefas',
    primaryLabel: 'Ok',
  },
  {
    body: 'Acima esta suas informacoes, para ver e analisa-las, clique no seu icone de perfil',
    primaryLabel: 'Depois',
    secondaryLabel: 'Ir agora',
  },
  {
    body: 'Abaixo esta a barra de navegacao, onde voce pode alterar entre as abas: Home e Configuracoes',
    primaryLabel: 'Ok',
  },
];

export default function TelaTutorialIdoso() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const { profile } = useIdosoProfile();
  const { t } = useLanguage();

  const currentStep = tutorialSteps[stepIndex];
  const isLastStep = stepIndex === tutorialSteps.length - 1;
  const isWelcomeStep = stepIndex === 0;
  const firstName = profile?.nome?.split(' ')[0] || t('senior');
  const photoUri =
    profile?.fotoPerfil && profile.fotoPerfil !== 'imagem_padrao.png' ? profile.fotoPerfil : null;

  const goNext = React.useCallback(() => {
    if (isLastStep) {
      router.push('./tela_principal_idoso');
      return;
    }

    setStepIndex((current) => current + 1);
  }, [isLastStep]);

  const handleSecondaryAction = React.useCallback(() => {
    goNext();
  }, [goNext]);

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <SafeAreaInsetsView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('Ola')}, {firstName}</Text>

          <Pressable style={styles.avatarContainer}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatar} />
            ) : (
              <Ionicons name="person" size={22} color="#F58220" />
            )}
          </Pressable>
        </View>
      </SafeAreaInsetsView>

      <View style={styles.content}>
        <View style={[styles.card, isWelcomeStep && styles.welcomeCard, isLastStep && styles.finalCard]}>
          <Text style={[styles.cardText, isWelcomeStep && styles.welcomeText]}>
            {t(currentStep.body)}
          </Text>

          <View style={[styles.actionsRow, !currentStep.secondaryLabel && styles.actionsCenter]}>
            {currentStep.secondaryLabel ? (
              <TouchableOpacity activeOpacity={0.7} onPress={handleSecondaryAction}>
                <Text style={styles.secondaryText}>{t(currentStep.secondaryLabel)}</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity activeOpacity={0.8} onPress={goNext} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{t(currentStep.primaryLabel)}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
      <IdosoBottomNav activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  headerSafeArea: {
    backgroundColor: '#F58220',
  },
  header: {
    height: 76,
    backgroundColor: '#F58220',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  card: {
    alignSelf: 'center',
    width: '88%',
    minHeight: 136,
    borderRadius: 15,
    backgroundColor: '#E6E6E6',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  welcomeCard: {
    minHeight: 104,
    width: '80%',
    justifyContent: 'space-between',
  },
  finalCard: {
    minHeight: 144,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'left',
  },
  welcomeText: {
    textAlign: 'center',
    marginTop: 12,
  },
  actionsRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionsCenter: {
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 14,
    color: '#4D4D4D',
  },
  primaryButton: {
    minWidth: 82,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#F58220',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
