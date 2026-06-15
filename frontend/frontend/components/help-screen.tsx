import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/contexts/language-context';

type HelpItem = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  text: string;
  accent: string;
};

const quickSteps: HelpItem[] = [
  {
    icon: 'user-plus',
    title: 'Cadastre o idoso',
    text: 'O responsável adiciona o idoso com nome, CPF, data de nascimento e senha de acesso.',
    accent: '#1456FF',
  },
  {
    icon: 'bell',
    title: 'Crie lembretes',
    text: 'Use os lembretes para organizar tarefas importantes da rotina do idoso.',
    accent: '#F58220',
  },
  {
    icon: 'clipboard',
    title: 'Acompanhe medicações',
    text: 'O responsável registra os remédios e o idoso confirma quando tomar.',
    accent: '#14B8A6',
  },
  {
    icon: 'edit-3',
    title: 'Use anotações',
    text: 'As anotações ajudam a registrar informações úteis do dia a dia.',
    accent: '#8B5CF6',
  },
];

const faqItems: HelpItem[] = [
  {
    icon: 'lock',
    title: 'Esqueci minha senha',
    text: 'O responsável pode recuperar a senha pelo e-mail. O acesso do idoso é feito com CPF e senha cadastrados pelo responsável.',
    accent: '#EF4444',
  },
  {
    icon: 'globe',
    title: 'Trocar idioma',
    text: 'Entre em Configurações, toque em Idioma e escolha Português, Inglês ou Espanhol.',
    accent: '#1456FF',
  },
  {
    icon: 'image',
    title: 'Editar foto',
    text: 'Na área de perfil é possível atualizar a foto para deixar a conta mais fácil de reconhecer.',
    accent: '#F58220',
  },
];

export function HelpScreen() {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color="#202020" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('help')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Feather name="help-circle" size={30} color="#F58220" />
          </View>
          <Text style={styles.heroTitle}>Como podemos ajudar?</Text>
          <Text style={styles.heroText}>
            Veja orientações rápidas para usar o Amaidoso e organizar melhor os cuidados do idoso.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primeiros passos</Text>
          <View style={styles.cardList}>
            {quickSteps.map((item) => (
              <View key={item.title} style={styles.helpCard}>
                <View style={[styles.cardIcon, { backgroundColor: `${item.accent}18` }]}>
                  <Feather name={item.icon} size={20} color={item.accent} />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dúvidas frequentes</Text>
          <View style={styles.cardList}>
            {faqItems.map((item) => (
              <View key={item.title} style={styles.helpCard}>
                <View style={[styles.cardIcon, { backgroundColor: `${item.accent}18` }]}>
                  <Feather name={item.icon} size={20} color={item.accent} />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.contactCard}>
          <View style={styles.contactIcon}>
            <Feather name="mail" size={22} color="#1456FF" />
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.contactTitle}>Suporte do projeto</Text>
            <Text style={styles.contactText}>
              Em caso de dúvidas, fale com a equipe desenvolvedora do Amaidoso.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  header: {
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#202020',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 14,
  },
  hero: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7EAF0',
    padding: 18,
    alignItems: 'center',
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF4E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#202020',
    textAlign: 'center',
  },
  heroText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#5E6878',
    textAlign: 'center',
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7EAF0',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 12,
  },
  cardList: {
    gap: 10,
  },
  helpCard: {
    minHeight: 76,
    borderRadius: 14,
    backgroundColor: '#FAFAFB',
    borderWidth: 1,
    borderColor: '#EEF0F4',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#202020',
  },
  cardText: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    color: '#687385',
  },
  contactCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7E1FF',
    backgroundColor: '#F7FAFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#202020',
  },
  contactText: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    color: '#5E6878',
  },
});
