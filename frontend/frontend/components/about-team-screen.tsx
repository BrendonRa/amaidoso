import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/contexts/language-context';

type TeamMember = {
  name: string;
  roleKey: string;
  initials: string;
  accent: string;
  avatar?: ImageSourcePropType;
};

type InfoCard = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  text: string;
};

const teamMembers: TeamMember[] = [
  {
    name: 'Felipe',
    roleKey: 'Banco de Dados e Documentação',
    initials: 'F',
    accent: '#F58220',
    avatar: require('../assets/images/felipe-avatar.jpg'),
  },
  {
    name: 'Gabriel',
    roleKey: 'FrontEnd e BackEnd',
    initials: 'G',
    accent: '#3B82F6',
    avatar: require('../assets/images/gabriel-avatar.jpg'),
  },
  {
    name: 'Eduardo',
    roleKey: 'FrontEnd',
    initials: 'E',
    accent: '#14B8A6',
    avatar: require('../assets/images/eduardo-avatar.jpg'),
  },
  {
    name: 'Brendon',
    roleKey: 'BackEnd',
    initials: 'B',
    accent: '#8B5CF6',
    avatar: require('../assets/images/brendon-avatar.jpg'),
  },
  { name: 'Henrique', roleKey: 'Documentação', initials: 'H', accent: '#EF4444' },
];

const projectCards: InfoCard[] = [
  {
    icon: 'bell',
    title: 'Lembretes',
    text: 'Ajuda o idoso a acompanhar tarefas importantes da rotina.',
  },
  {
    icon: 'clipboard',
    title: 'Medicações',
    text: 'Organiza remédios cadastrados pelo responsável e confirmações do idoso.',
  },
  {
    icon: 'edit-3',
    title: 'Anotações',
    text: 'Registra observações úteis para acompanhar o cuidado no dia a dia.',
  },
];

export function AboutTeamScreen() {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={styles.backButton}>
          <Feather name="arrow-left" size={22} color="#202020" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('about')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        maximumZoomScale={1}
        minimumZoomScale={1}
        pinchGestureEnabled={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.logoWrap}>
            <Image source={require('../assets/images/amaidoso-escrito.png')} style={styles.logo} />
          </View>

          <View style={styles.heroText}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="school-outline" size={16} color="#F58220" />
              <Text style={styles.badgeText}>{t('Projeto de TCC')}</Text>
            </View>
            <Text style={styles.heroTitle}>Amaidoso</Text>
            <Text style={styles.heroSubtitle}>
              Aplicativo desenvolvido no Curso Técnico de Desenvolvimento de Sistemas para apoiar o
              cuidado, a organização e a comunicação entre idosos e responsáveis.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objetivo do projeto</Text>
          <Text style={styles.bodyText}>
            O Amaidoso nasceu como uma solução de TCC pensada para tornar a rotina de cuidados mais
            clara. A proposta é reunir lembretes, medicações e anotações em um app simples, com
            telas separadas para o idoso e para o responsável.
          </Text>
        </View>

        <View style={styles.infoGrid}>
          {projectCards.map((card) => (
            <View key={card.title} style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Feather name={card.icon} size={20} color="#F58220" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>{t(card.title)}</Text>
                <Text style={styles.infoDescription}>{card.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.courseCard}>
          <View style={styles.courseIcon}>
            <Feather name="code" size={22} color="#1456FF" />
          </View>
          <View style={styles.courseText}>
            <Text style={styles.courseTitle}>Desenvolvimento de Sistemas</Text>
            <Text style={styles.courseDescription}>
              Projeto acadêmico construído em equipe, envolvendo front-end, back-end, banco de dados
              e documentação.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Membros e contribuidores')}</Text>

          <View style={styles.memberList}>
            {teamMembers.map((member) => (
              <View key={member.name} style={styles.memberRow}>
                <View style={[styles.avatar, { backgroundColor: member.accent }]}>
                  {member.avatar ? (
                    <Image source={member.avatar} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarInitials}>{member.initials}</Text>
                  )}
                </View>
                <View style={styles.memberTextWrap}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{t(member.roleKey)}</Text>
                </View>
              </View>
            ))}
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
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  logoWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFF4E9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  heroText: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#FFF4E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A4709',
  },
  heroTitle: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '900',
    color: '#202020',
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#5E6878',
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
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5E6878',
  },
  infoGrid: {
    gap: 10,
  },
  infoCard: {
    minHeight: 82,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7EAF0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF4E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#202020',
  },
  infoDescription: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    color: '#687385',
  },
  courseCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7E1FF',
    backgroundColor: '#F7FAFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  courseIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  courseText: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#202020',
  },
  courseDescription: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    color: '#5E6878',
  },
  memberList: {
    gap: 10,
  },
  memberRow: {
    minHeight: 64,
    borderRadius: 14,
    backgroundColor: '#FAFAFB',
    borderWidth: 1,
    borderColor: '#EEF0F4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  memberTextWrap: {
    flex: 1,
  },
  memberName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#202020',
  },
  memberRole: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 18,
    color: '#687385',
  },
});
