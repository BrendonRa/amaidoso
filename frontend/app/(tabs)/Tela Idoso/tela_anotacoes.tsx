import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, SafeAreaView as SafeAreaInsetsView } from 'react-native-safe-area-context';

import { useIdosoProfile } from '@/contexts/idoso-profile-context';
import { useLanguage } from '@/contexts/language-context';
import { createAnotacao, subscribeAnotacoes, type Anotacao } from '@/lib/idoso-data-service';
import IdosoBottomNav from './IdosoBottomNav';

export default function TelaAnotacoesIdoso() {
  const { profile } = useIdosoProfile();
  const { t } = useLanguage();
  const [anotacoes, setAnotacoes] = React.useState<Anotacao[] | null>(null);
  const [texto, setTexto] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!profile?.uid) {
      setAnotacoes([]);
      return undefined;
    }

    return subscribeAnotacoes(profile.uid, setAnotacoes, () => setAnotacoes([]));
  }, [profile?.uid]);

  const handleSave = async () => {
    if (!profile?.uid || !texto.trim()) {
      Alert.alert(t('Anotação'), t('Escreva algo primeiro.'));
      return;
    }
    try {
      setSaving(true);
      await createAnotacao(profile.uid, texto);
      setTexto('');
    } catch {
      Alert.alert(t('Erro'), t('Tente de novo.'));
    } finally {
      setSaving(false);
    }
  };

  const firstName = profile?.nome?.split(' ')[0] || t('senior');
  const photoUri =
    profile?.fotoPerfil && profile.fotoPerfil !== 'imagem_padrao.png' ? profile.fotoPerfil : null;

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <SafeAreaInsetsView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('Olá')}, {firstName}</Text>
          <View style={styles.avatar}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={22} color="#F58220" />
            )}
          </View>
        </View>
      </SafeAreaInsetsView>

      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('./tela_principal_idoso')} style={styles.backButton}>
        <Text style={styles.backButtonText}>{t('Voltar')}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{t('Nova anotação')}</Text>
        <TextInput
          multiline
          placeholder={t('Escreva aqui...')}
          placeholderTextColor="#777777"
          style={styles.textArea}
          value={texto}
          onChangeText={setTexto}
        />
        <TouchableOpacity disabled={saving} onPress={() => void handleSave()} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>
            {saving ? t('Salvando...') : t('Salvar anotação')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('Minhas anotações')}</Text>
        {anotacoes === null ? (
          <ActivityIndicator size="large" color="#F58220" />
        ) : anotacoes.length ? (
          anotacoes.map((item) => (
            <View key={item.id} style={styles.noteCard}>
              {item.createdAtText ? <Text style={styles.noteMeta}>{item.createdAtText}</Text> : null}
              <Text style={styles.noteText}>{item.texto}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{t('Nenhuma anotação ainda.')}</Text>
        )}
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
    backgroundColor: '#F58220',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#FFE4CC',
  },
  backButtonText: {
    color: '#F58220',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#151515',
    marginBottom: 10,
  },
  textArea: {
    minHeight: 110,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    padding: 14,
    textAlignVertical: 'top',
    color: '#151515',
  },
  saveButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 999,
    backgroundColor: '#F58220',
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  noteCard: {
    borderRadius: 15,
    backgroundColor: '#E6E6E6',
    padding: 15,
    marginBottom: 12,
  },
  noteMeta: {
    color: '#F58220',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  noteText: {
    color: '#151515',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 18,
    color: '#707070',
    fontWeight: '700',
  },
});
