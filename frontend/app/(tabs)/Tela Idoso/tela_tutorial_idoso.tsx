import React from 'react';
import IdosoBottomNav from './IdosoBottomNav';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

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

  const currentStep = tutorialSteps[stepIndex];
  const isLastStep = stepIndex === tutorialSteps.length - 1;
  const isWelcomeStep = stepIndex === 0;

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ola, Oswaldo Teixeira</Text>

        <Pressable style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://wallpapers.com/images/hd/funny-old-man-pictures-29zq8pp6pi1gcap8.jpg',
            }}
            style={styles.avatar}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={[styles.card, isWelcomeStep && styles.welcomeCard, isLastStep && styles.finalCard]}>
          <Text style={[styles.cardText, isWelcomeStep && styles.welcomeText]}>{currentStep.body}</Text>

          <View style={[styles.actionsRow, !currentStep.secondaryLabel && styles.actionsCenter]}>
            {currentStep.secondaryLabel ? (
              <TouchableOpacity activeOpacity={0.7} onPress={handleSecondaryAction}>
                <Text style={styles.secondaryText}>{currentStep.secondaryLabel}</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity activeOpacity={0.8} onPress={goNext} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{currentStep.primaryLabel}</Text>
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
