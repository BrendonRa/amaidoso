import { Feather } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, SegmentedButtons, Switch, TextInput as PaperTextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAuthErrorMessage } from '@/lib/firebase-auth-service';
import { createMedicacao } from '@/lib/idoso-data-service';

type Frequency = 'Diário' | 'Semanal' | 'Mensal';
type Unit = 'ml' | 'mg';
type DateTimeMode = 'date' | 'time';

const paperInputTheme = {
  colors: {
    onSurface: '#111827',
    onSurfaceVariant: '#344054',
    outline: '#667085',
    primary: '#1456FF',
    surface: '#FFFFFF',
  },
};

function formatDateDisplay(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

function formatDateStorage(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatTimeDisplay(date: Date) {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}h`;
}

function DateTimeField({
  label,
  value,
  mode,
  date,
  onChange,
}: {
  label: string;
  value: string;
  mode: DateTimeMode;
  date: Date;
  onChange: (date: Date) => void;
}) {
  const [showInlinePicker, setShowInlinePicker] = React.useState(false);
  const scale = React.useRef(new Animated.Value(1)).current;

  const animateOpen = React.useCallback(() => {
    scale.setValue(0.98);
    Animated.spring(scale, {
      toValue: 1,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handleChange = React.useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === 'set' && selectedDate) {
        onChange(selectedDate);
      }
      if (Platform.OS !== 'ios') {
        setShowInlinePicker(false);
      }
    },
    [onChange],
  );

  const openPicker = () => {
    animateOpen();

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode,
        display: mode === 'date' ? 'calendar' : 'clock',
        is24Hour: true,
        minimumDate: mode === 'date' ? new Date() : undefined,
        positiveButton: { label: 'Definir' },
        negativeButton: { label: 'Cancelar' },
        onChange: handleChange,
      });
      return;
    }

    setShowInlinePicker((current) => !current);
  };

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity activeOpacity={0.75} onPress={openPicker} style={styles.dateTimeButton}>
          <Text style={[styles.dateTimeValue, !value && styles.placeholderText]}>
            {value || (mode === 'date' ? '--/--/----' : '--:--h')}
          </Text>
          <Feather name={mode === 'date' ? 'calendar' : 'clock'} size={20} color="#1456FF" />
        </TouchableOpacity>
      </Animated.View>

      {showInlinePicker ? (
        <DateTimePicker
          value={date}
          mode={mode}
          display={mode === 'date' ? 'calendar' : 'clock'}
          is24Hour
          minimumDate={mode === 'date' ? new Date() : undefined}
          onChange={handleChange}
        />
      ) : null}
    </View>
  );
}

function DoseSelector({
  dose,
  unit,
  onDoseChange,
  onUnitChange,
}: {
  dose: string;
  unit: Unit;
  onDoseChange: (value: string) => void;
  onUnitChange: (value: Unit) => void;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>Dose do medicamento</Text>
      <View style={styles.doseRow}>
        <PaperTextInput
          keyboardType="numeric"
          mode="outlined"
          outlineColor="#667085"
          activeOutlineColor="#1456FF"
          placeholder="Ex.: 500"
          placeholderTextColor="#667085"
          style={styles.doseInput}
          textColor="#111827"
          theme={paperInputTheme}
          value={dose}
          onChangeText={(value) => onDoseChange(value.replace(/[^\d.,]/g, ''))}
        />
        <SegmentedButtons
          value={unit}
          onValueChange={(value) => onUnitChange(value as Unit)}
          buttons={[
            {
              value: 'ml',
              label: 'ml',
              checkedColor: '#FFFFFF',
              uncheckedColor: '#111827',
              labelStyle: styles.segmentedLabel,
            },
            {
              value: 'mg',
              label: 'mg',
              checkedColor: '#FFFFFF',
              uncheckedColor: '#111827',
              labelStyle: styles.segmentedLabel,
            },
          ]}
          style={styles.unitButtons}
          theme={paperInputTheme}
        />
      </View>
    </View>
  );
}

export default function TelaCadastrarMedicacaoResponsavel() {
  const { idosoUid } = useLocalSearchParams<{ idosoUid?: string }>();
  const uid = String(idosoUid ?? '');
  const [nomeMedicamento, setNomeMedicamento] = React.useState('');
  const [startDate, setStartDate] = React.useState(() => new Date());
  const [timeDate, setTimeDate] = React.useState(() => new Date());
  const [usoContinuo, setUsoContinuo] = React.useState(false);
  const [frequencia, setFrequencia] = React.useState<Frequency>('Diário');
  const [doseValor, setDoseValor] = React.useState('');
  const [unidade, setUnidade] = React.useState<Unit>('mg');
  const [saving, setSaving] = React.useState(false);

  const handleConfirm = async () => {
    if (!uid) {
      Alert.alert('Idoso não encontrado', 'Selecione um idoso.');
      return;
    }

    if (!nomeMedicamento.trim() || !doseValor.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha medicamento e dose.');
      return;
    }

    if (usoContinuo && !frequencia) {
      Alert.alert('Frequência obrigatória', 'Escolha a frequencia.');
      return;
    }

    try {
      setSaving(true);
      await createMedicacao(uid, {
        nome: nomeMedicamento.trim(),
        horario: formatTimeDisplay(timeDate),
        dataInicio: formatDateStorage(startDate),
        usoContinuo,
        frequencia: usoContinuo ? frequencia : '',
        doseValor: doseValor.trim(),
        unidade,
      });

      router.replace({
        pathname: './tela_detalhes_idoso_responsavel',
        params: { idosoUid: uid },
      });
    } catch (error) {
      Alert.alert('Erro', getAuthErrorMessage(error, 'email'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}>
            <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={20} color="#101828" />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>CADASTRAR MEDICAÇÃO</Text>

            <View style={styles.formCard}>
              <PaperTextInput
                label="Nome do medicamento"
                mode="outlined"
                outlineColor="#667085"
                activeOutlineColor="#1456FF"
                placeholderTextColor="#667085"
                style={styles.paperInput}
                textColor="#111827"
                theme={paperInputTheme}
                value={nomeMedicamento}
                onChangeText={setNomeMedicamento}
              />

              <Text style={styles.sectionTitle}>Definir Data e Hora</Text>
              <View style={styles.twoColumns}>
                <DateTimeField
                  label="Data de início"
                  value={formatDateDisplay(startDate)}
                  mode="date"
                  date={startDate}
                  onChange={setStartDate}
                />
                <DateTimeField
                  label="Hora"
                  value={formatTimeDisplay(timeDate)}
                  mode="time"
                  date={timeDate}
                  onChange={setTimeDate}
                />
              </View>

              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.fieldLabel}>Uso contínuo?</Text>
                  <Text style={styles.switchValue}>{usoContinuo ? 'Sim' : 'Não'}</Text>
                </View>
                <Switch
                  value={usoContinuo}
                  onValueChange={setUsoContinuo}
                  color="#1456FF"
                />
              </View>

              {usoContinuo ? (
                <View style={styles.fieldBlock}>
                  <Text style={styles.fieldLabel}>Frequência</Text>
                  <SegmentedButtons
                    value={frequencia}
                    onValueChange={(value) => setFrequencia(value as Frequency)}
                    buttons={[
                      {
                        value: 'Diário',
                        label: 'Diário',
                        checkedColor: '#FFFFFF',
                        uncheckedColor: '#111827',
                        labelStyle: styles.segmentedLabel,
                      },
                      {
                        value: 'Semanal',
                        label: 'Semanal',
                        checkedColor: '#FFFFFF',
                        uncheckedColor: '#111827',
                        labelStyle: styles.segmentedLabel,
                      },
                      {
                        value: 'Mensal',
                        label: 'Mensal',
                        checkedColor: '#FFFFFF',
                        uncheckedColor: '#111827',
                        labelStyle: styles.segmentedLabel,
                      },
                    ]}
                    style={styles.segmentedButtons}
                    theme={paperInputTheme}
                  />
                </View>
              ) : null}

              <DoseSelector
                dose={doseValor}
                unit={unidade}
                onDoseChange={setDoseValor}
                onUnitChange={setUnidade}
              />

              <Button
                mode="contained"
                icon="check"
                loading={saving}
                disabled={saving}
                buttonColor="#1456FF"
                textColor="#FFFFFF"
                contentStyle={styles.confirmButtonContent}
                style={styles.confirmButton}
                onPress={handleConfirm}>
                Confirmar
              </Button>
            </View>
          </ScrollView>

        </KeyboardAvoidingView>

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 110,
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
  },
  title: {
    marginTop: 18,
    marginBottom: 28,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
  },
  formCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  paperInput: {
    minHeight: 58,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 2,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '900',
    color: '#111111',
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldBlock: {
    flex: 1,
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 7,
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  dateTimeButton: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: '#E2E6F0',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  placeholderText: {
    color: '#98A2B3',
  },
  switchRow: {
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1456FF',
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doseInput: {
    flex: 1,
    minHeight: 58,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  unitButtons: {
    flex: 1.35,
  },
  segmentedButtons: {
    backgroundColor: '#FFFFFF',
  },
  segmentedLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  confirmButton: {
    alignSelf: 'center',
    minWidth: 172,
    borderRadius: 999,
    marginTop: 6,
  },
  confirmButtonContent: {
    minHeight: 50,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
