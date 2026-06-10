import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getAuthErrorMessage } from '@/lib/firebase-auth-service';
import {
  createLembrete,
  subscribeAnotacoes,
  subscribeIdosoByUid,
  subscribeLembretes,
  subscribeMedicacoes,
  type Anotacao,
  type IdosoResumo,
  type Lembrete,
  type Medicacao,
} from '@/lib/idoso-data-service';

type Tab = 'lembretes' | 'medicacoes' | 'anotacoes';

export default function TelaDetalhesIdosoResponsavel() {
  const { idosoUid } = useLocalSearchParams<{ idosoUid?: string }>();
  const uid = String(idosoUid ?? '');
  const [idoso, setIdoso] = React.useState<IdosoResumo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [tab, setTab] = React.useState<Tab>('lembretes');
  const [lembretes, setLembretes] = React.useState<Lembrete[]>([]);
  const [medicacoes, setMedicacoes] = React.useState<Medicacao[]>([]);
  const [anotacoes, setAnotacoes] = React.useState<Anotacao[]>([]);
  const [saving, setSaving] = React.useState(false);

  const [lembreteTitulo, setLembreteTitulo] = React.useState('');
  const [lembreteDescricao, setLembreteDescricao] = React.useState('');
  const [lembreteHorario, setLembreteHorario] = React.useState('');

  React.useEffect(() => {
    if (!uid) {
      setIdoso(null);
      setLembretes([]);
      setMedicacoes([]);
      setAnotacoes([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const handleError = (e: unknown) => {
      Alert.alert('Erro', getAuthErrorMessage(e, 'email'));
      setLoading(false);
    };

    const unsubIdoso = subscribeIdosoByUid(uid, (idosoData) => {
      setIdoso(idosoData);
      setLoading(false);
    }, handleError);
    const unsubLembretes = subscribeLembretes(uid, setLembretes, handleError);
    const unsubMedicacoes = subscribeMedicacoes(uid, setMedicacoes, handleError);
    const unsubAnotacoes = subscribeAnotacoes(uid, setAnotacoes, handleError);

    return () => {
      unsubIdoso();
      unsubLembretes();
      unsubMedicacoes();
      unsubAnotacoes();
    };
  }, [uid]);

  const handleCreateLembrete = async () => {
    if (!lembreteTitulo.trim() || !lembreteHorario.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha titulo e horario.');
      return;
    }
    try {
      setSaving(true);
      await createLembrete(uid, {
        titulo: lembreteTitulo.trim(),
        descricao: lembreteDescricao.trim(),
        horario: lembreteHorario.trim(),
      });
      setLembreteTitulo('');
      setLembreteDescricao('');
      setLembreteHorario('');
    } catch (e) {
      Alert.alert('Erro', getAuthErrorMessage(e, 'email'));
    } finally {
      setSaving(false);
    }
  };

  const photoUri =
    idoso?.fotoPerfil && idoso.fotoPerfil !== 'imagem_padrao.png' ? idoso.fotoPerfil : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{idoso?.nomeIdoso || 'Cuidados do idoso'}</Text>
        <View style={styles.avatar}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={22} color="#1456FF" />
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1456FF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.tabs}>
            <TabButton active={tab === 'lembretes'} label="Lembretes" onPress={() => setTab('lembretes')} />
            <TabButton active={tab === 'medicacoes'} label="Medicações" onPress={() => setTab('medicacoes')} />
            <TabButton active={tab === 'anotacoes'} label="Anotações" onPress={() => setTab('anotacoes')} />
          </View>

          {tab === 'lembretes' ? (
            <View>
              <Text style={styles.sectionTitle}>Criar lembrete</Text>
              <TextInput style={styles.input} placeholder="Título" value={lembreteTitulo} onChangeText={setLembreteTitulo} />
              <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={lembreteDescricao}
                onChangeText={setLembreteDescricao}
              />
              <TextInput style={styles.input} placeholder="Horário ou prazo" value={lembreteHorario} onChangeText={setLembreteHorario} />
              <TouchableOpacity disabled={saving} onPress={() => void handleCreateLembrete()} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Salvar lembrete</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Lembretes enviados</Text>
              {lembretes.length ? lembretes.map((item) => <InfoCard key={item.id} title={item.titulo} meta={item.horario} body={item.descricao} />) : <Empty text="Nenhum lembrete criado." />}
            </View>
          ) : null}

          {tab === 'medicacoes' ? (
            <View>
              <Text style={styles.sectionTitle}>Medicações</Text>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() =>
                  router.push({
                    pathname: './tela_cadastrar_medicacao_responsavel',
                    params: { idosoUid: uid },
                  })
                }
                style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Cadastrar medicação</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Medicações e confirmações</Text>
              {medicacoes.length ? (
                medicacoes.map((item) => (
                  <InfoCard
                    key={item.id}
                    title={`${item.nome}${item.dose ? ` - ${item.dose}` : ''}`}
                    meta={`${item.dataInicio ? `${item.dataInicio} • ` : ''}${item.horario} • ${item.confirmado ? 'Confirmada' : 'Pendente'}`}
                    body={[
                      item.usoContinuo ? `Uso contínuo: ${item.frequencia}` : 'Uso contínuo: Não',
                      item.novo ? 'Aviso: novo medicamento para o idoso' : '',
                      item.confirmadoEm ? `Confirmado em ${new Date(item.confirmadoEm).toLocaleString('pt-BR')}` : '',
                    ]
                      .filter(Boolean)
                      .join('\n')}
                  />
                ))
              ) : (
                <Empty text="Nenhuma medicação criada." />
              )}
            </View>
          ) : null}

          {tab === 'anotacoes' ? (
            <View>
              <Text style={styles.sectionTitle}>Anotações do idoso</Text>
              {anotacoes.length ? (
                anotacoes.map((item) => (
                  <InfoCard key={item.id} title="Anotação" meta={item.createdAtText ?? ''} body={item.texto} />
                ))
              ) : (
                <Empty text="Nenhuma anotação feita pelo idoso." />
              )}
            </View>
          ) : null}
        </ScrollView>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity activeOpacity={0.6} style={styles.navItem}>
          <View style={styles.activePill}>
            <Feather name="edit-3" size={24} color="#121212" />
          </View>
          <Text style={styles.navLabel}>Painel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => router.push('./tela_home_responsavel')}
          style={styles.navItem}>
          <Image source={require('../../../assets/images/home.png')} style={styles.navIcon} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => router.push('./tela_config_responsavel')}
          style={styles.navItem}>
          <Feather name="settings" size={24} color="#121212" />
          <Text style={styles.navLabel}>Configuracoes</Text>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}

function TabButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={[styles.tabButton, active && styles.tabButtonActive]}>
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function InfoCard({ title, meta, body }: { title: string; meta: string; body?: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>{title}</Text>
      {meta ? <Text style={styles.infoMeta}>{meta}</Text> : null}
      {body ? <Text style={styles.infoBody}>{body}</Text> : null}
    </View>
  );
}

function Empty({ text }: { text: string }) {
  return <Text style={styles.emptyText}>{text}</Text>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    minHeight: 84,
    backgroundColor: '#1456FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  tabButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tabButtonActive: {
    backgroundColor: '#1456FF',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1456FF',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#151515',
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    color: '#151515',
  },
  primaryButton: {
    alignSelf: 'flex-end',
    borderRadius: 999,
    backgroundColor: '#1456FF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  infoCard: {
    borderRadius: 14,
    backgroundColor: '#F4F7FF',
    borderWidth: 1,
    borderColor: '#D7E1FF',
    padding: 14,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#151515',
  },
  infoMeta: {
    marginTop: 3,
    fontSize: 13,
    color: '#1456FF',
    fontWeight: '700',
  },
  infoBody: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 19,
    color: '#444444',
  },
  emptyText: {
    paddingVertical: 22,
    textAlign: 'center',
    color: '#707070',
    fontWeight: '700',
  },
  bottomBar: {
    height: 82,
    borderTopWidth: 1,
    borderTopColor: '#151515',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  navItem: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  activePill: {
    width: 52,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#9AB8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#1A1A1A',
  },
});
