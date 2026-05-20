import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useIdosoProfile } from '@/contexts/idoso-profile-context';
import { listLembretes, type Lembrete } from '@/lib/idoso-data-service';
import IdosoBottomNav from './IdosoBottomNav';

export default function LembretesScreen() {
  const { profile } = useIdosoProfile();
  const [lembretes, setLembretes] = React.useState<Lembrete[] | null>(null);

  React.useEffect(() => {
    if (!profile?.uid) {
      setLembretes([]);
      return;
    }
    void listLembretes(profile.uid).then(setLembretes).catch(() => setLembretes([]));
  }, [profile?.uid]);

  const firstName = profile?.nome?.split(' ')[0] || 'Idoso';
  const photoUri =
    profile?.fotoPerfil && profile.fotoPerfil !== 'imagem_padrao.png' ? profile.fotoPerfil : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {firstName}</Text>
        <View style={styles.avatar}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={22} color="#F58220" />
          )}
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('./tela_principal_idoso')} style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {lembretes === null ? (
          <ActivityIndicator size="large" color="#F58220" />
        ) : lembretes.length ? (
          lembretes.map((item) => (
            <View key={item.id} style={styles.reminder}>
              <View style={styles.reminderTextWrap}>
                <Text style={styles.reminderTitle}>{item.titulo}</Text>
                {item.descricao ? <Text style={styles.reminderText}>{item.descricao}</Text> : null}
              </View>
              <Text style={styles.time}>{item.horario}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum lembrete por enquanto.</Text>
        )}
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>Os lembretes são criados pelo seu responsável.</Text>
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
  header: {
    backgroundColor: '#F58220',
    padding: 16,
    paddingTop: 52,
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
  content: {
    flex: 1,
    padding: 20,
    gap: 15,
  },
  reminder: {
    backgroundColor: '#E6E6E6',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  reminderTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#151515',
  },
  reminderText: {
    marginTop: 3,
    fontSize: 13,
    color: '#444444',
  },
  time: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F58220',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#707070',
    fontWeight: '700',
  },
  warningBox: {
    margin: 20,
    backgroundColor: '#DDDDDD',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  warningText: {
    color: '#A43232',
    fontSize: 12,
    textAlign: 'center',
  },
});
