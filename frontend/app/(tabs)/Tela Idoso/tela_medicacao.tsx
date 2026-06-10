import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useIdosoProfile } from '@/contexts/idoso-profile-context';
import {
  confirmMedicacao,
  listMedicacoes,
  markMedicacaoSeen,
  registerCurrentIdosoNotificationToken,
  subscribeMedicacoes,
  type Medicacao,
} from '@/lib/idoso-data-service';
import IdosoBottomNav from './IdosoBottomNav';

export default function ConfirmarMedicacoesScreen() {
  const { profile } = useIdosoProfile();
  const [medicacoes, setMedicacoes] = React.useState<Medicacao[] | null>(null);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const notifiedIds = React.useRef<Set<string>>(new Set());

  const load = React.useCallback(async () => {
    if (!profile?.uid) {
      setMedicacoes([]);
      return;
    }
    setMedicacoes(await listMedicacoes(profile.uid));
  }, [profile?.uid]);

  React.useEffect(() => {
    if (!profile?.uid) {
      setMedicacoes([]);
      return undefined;
    }

    return subscribeMedicacoes(
      profile.uid,
      setMedicacoes,
      () => setMedicacoes([]),
    );
  }, [profile?.uid]);

  const handleRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);
      await load();
    } catch {
      Alert.alert('Erro', 'Tente de novo.');
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  React.useEffect(() => {
    if (!profile?.uid) return;
    void registerCurrentIdosoNotificationToken(profile.uid).catch(() => undefined);
  }, [profile?.uid]);

  React.useEffect(() => {
    const novasMedicacoes = medicacoes?.filter((item) => item.novo && !notifiedIds.current.has(item.id)) ?? [];
    if (!novasMedicacoes.length) return;

    novasMedicacoes.forEach((item) => notifiedIds.current.add(item.id));
    Alert.alert(
      'Novo remedio',
      novasMedicacoes.length === 1
        ? `${novasMedicacoes[0].nome} adicionado.`
        : `${novasMedicacoes.length} remedios adicionados.`,
    );
  }, [medicacoes]);

  const handleConfirm = async (item: Medicacao, confirmado: boolean) => {
    if (!profile?.uid) return;
    try {
      setSavingId(item.id);
      await confirmMedicacao(profile.uid, item.id, confirmado);
    } catch {
      Alert.alert('Erro', 'Tente de novo.');
    } finally {
      setSavingId(null);
    }
  };

  const handleMarkSeen = async (item: Medicacao) => {
    if (!profile?.uid) return;
    try {
      setSavingId(item.id);
      await markMedicacaoSeen(profile.uid, item.id);
    } catch {
      Alert.alert('Erro', 'Tente de novo.');
    } finally {
      setSavingId(null);
    }
  };

  const firstName = profile?.nome?.split(' ')[0] || 'Idoso';
  const photoUri =
    profile?.fotoPerfil && profile.fotoPerfil !== 'imagem_padrao.png' ? profile.fotoPerfil : null;

  const renderMedicacao = ({ item }: { item: Medicacao }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardText}>{item.nome}</Text>
          {item.novo ? (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>Novo</Text>
            </View>
          ) : null}
        </View>
        {item.dose ? <Text style={styles.doseText}>{item.dose}</Text> : null}
        <View style={styles.actions}>
          <TouchableOpacity
            disabled={savingId === item.id}
            onPress={() => void handleConfirm(item, true)}
            style={[styles.confirmButton, item.confirmado && styles.confirmButtonActive]}>
            <Text style={[styles.confirmButtonText, item.confirmado && styles.confirmButtonTextActive]}>
              Tomei
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={savingId === item.id}
            onPress={() => void handleConfirm(item, false)}
            style={styles.undoButton}>
            <Text style={styles.undoButtonText}>Ainda não</Text>
          </TouchableOpacity>
        </View>
        {item.novo ? (
          <TouchableOpacity
            disabled={savingId === item.id}
            onPress={() => void handleMarkSeen(item)}
            style={styles.seenButton}>
            <Text style={styles.seenButtonText}>Marcar como visto</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.timeWrap}>
        <Text style={styles.time}>{item.horario}</Text>
        <Text style={[styles.status, item.confirmado && styles.statusOk]}>
          {item.confirmado ? 'Confirmada' : 'Pendente'}
        </Text>
      </View>
    </View>
  );

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

      {medicacoes === null ? (
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#F58220" />
        </View>
      ) : (
        <FlatList
          data={medicacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderMedicacao}
          contentContainerStyle={[
            styles.listContent,
            medicacoes.length === 0 && styles.emptyListContent,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#F58220']}
              tintColor="#F58220"
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma medicação cadastrada.</Text>
          }
        />
      )}

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>As medicações são cadastradas pelo responsável. Confirme quando tomar.</Text>
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
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 10,
    gap: 15,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#E6E6E6',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardInfo: {
    flex: 1,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 3,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 3,
  },
  newBadge: {
    borderRadius: 999,
    backgroundColor: '#F58220',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  doseText: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmButton: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3A8F4A',
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  confirmButtonActive: {
    backgroundColor: '#3A8F4A',
  },
  confirmButtonText: {
    color: '#3A8F4A',
    fontWeight: '800',
  },
  confirmButtonTextActive: {
    color: '#FFFFFF',
  },
  undoButton: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  undoButtonText: {
    color: '#A43232',
    fontWeight: '800',
  },
  seenButton: {
    alignSelf: 'flex-start',
    marginTop: 9,
    borderRadius: 999,
    backgroundColor: '#FFF4EA',
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  seenButtonText: {
    color: '#F58220',
    fontWeight: '900',
    fontSize: 12,
  },
  timeWrap: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  time: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F58220',
  },
  status: {
    marginTop: 4,
    fontSize: 11,
    color: '#A43232',
    fontWeight: '800',
  },
  statusOk: {
    color: '#3A8F4A',
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
