import { Feather } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export function formatDateDisplay(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

export function parseDateDisplay(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const date = new Date(year, month, day, 12);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date;
}

export function formatDateForStorage(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${year}-${month}-${day}`;
}

export function storageDateToDisplay(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function displayDateToStorage(value: string) {
  const date = parseDateDisplay(value);
  if (!date) return null;
  return formatDateForStorage(date);
}

const MIN_BIRTH_DATE = new Date(1900, 0, 1, 12);
const DEFAULT_BIRTH_DATE = new Date(1950, 0, 1, 12);

function getTodayDate() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
}

function clampDate(date: Date, minimumDate: Date, maximumDate: Date) {
  if (date < minimumDate) return minimumDate;
  if (date > maximumDate) return maximumDate;
  return date;
}

type BirthDateInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function BirthDateInput({
  value,
  onChangeText,
  placeholder = 'dd/mm/aaaa',
  containerStyle,
}: BirthDateInputProps) {
  const selectedDate = React.useMemo(() => parseDateDisplay(value), [value]);
  const maximumBirthDate = React.useMemo(() => getTodayDate(), []);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [pickerDate, setPickerDate] = React.useState(() =>
    clampDate(selectedDate ?? DEFAULT_BIRTH_DATE, MIN_BIRTH_DATE, maximumBirthDate),
  );

  React.useEffect(() => {
    if (selectedDate) {
      const clampedDate = clampDate(selectedDate, MIN_BIRTH_DATE, maximumBirthDate);
      setPickerDate((currentDate) =>
        currentDate.getTime() === clampedDate.getTime() ? currentDate : clampedDate,
      );
    }
  }, [maximumBirthDate, selectedDate]);

  const handleInputChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, '').slice(0, 8);
    let maskedValue = digitsOnly;

    if (digitsOnly.length > 2) {
      maskedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
    }

    if (digitsOnly.length > 4) {
      maskedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`;
    }

    onChangeText(maskedValue);
  };

  const handlePickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'neutralButtonPressed') {
      onChangeText('');
      return;
    }

    if (event.type === 'set' && date) {
      onChangeText(formatDateDisplay(date));
    }
  };

  const openDatePicker = () => {
    const currentPickerDate = clampDate(
      selectedDate ?? DEFAULT_BIRTH_DATE,
      MIN_BIRTH_DATE,
      maximumBirthDate,
    );
    setPickerDate(currentPickerDate);

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: currentPickerDate,
        mode: 'date',
        display: 'calendar',
        minimumDate: MIN_BIRTH_DATE,
        maximumDate: maximumBirthDate,
        positiveButton: { label: 'Definir' },
        negativeButton: { label: 'Cancelar' },
        neutralButton: { label: 'Limpar' },
        onChange: handlePickerChange,
      });
      return;
    }

    setShowDatePicker(true);
  };

  return (
    <>
      <View style={[styles.dateInputRow, containerStyle]}>
        <TextInput
          keyboardType="number-pad"
          maxLength={10}
          onChangeText={handleInputChange}
          placeholder={placeholder}
          placeholderTextColor="#737373"
          style={styles.dateInput}
          value={value}
        />
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={openDatePicker}
          style={styles.calendarButton}>
          <Feather name="calendar" size={18} color="#0C4DFF" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowDatePicker(false)} />
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Data de nascimento</Text>
            <DateTimePicker
              value={pickerDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={MIN_BIRTH_DATE}
              maximumDate={maximumBirthDate}
              onChange={(_, date) => {
                if (date) {
                  setPickerDate(date);
                }
              }}
            />
            <View style={styles.pickerActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onChangeText('');
                  setShowDatePicker(false);
                }}
                style={styles.pickerActionButton}>
                <Text style={styles.pickerActionText}>Limpar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowDatePicker(false)}
                style={styles.pickerActionButton}>
                <Text style={styles.pickerActionText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onChangeText(formatDateDisplay(pickerDate));
                  setShowDatePicker(false);
                }}
                style={styles.pickerActionButton}>
                <Text style={styles.pickerActionText}>Definir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dateInputRow: {
    width: '100%',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dateInput: {
    flex: 1,
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#B8B8B8',
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#151515',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'center',
  },
  calendarButton: {
    width: 52,
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CFE0FF',
    backgroundColor: '#EFF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  pickerCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 14,
  },
  pickerActions: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  pickerActionButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  pickerActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C4DFF',
  },
});
