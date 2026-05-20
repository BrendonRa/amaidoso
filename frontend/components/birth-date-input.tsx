import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
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
  const date = new Date(year, month, day);

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

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isSameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isFutureDate(date: Date) {
  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return normalizedDate > normalizedToday;
}

function getCalendarDays(monthDate: Date) {
  const firstDay = getMonthStart(monthDate);
  const daysInMonth = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0).getDate();
  const days: Array<Date | null> = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(firstDay.getFullYear(), firstDay.getMonth(), day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
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
  const [showCalendar, setShowCalendar] = React.useState(false);
  const selectedDate = parseDateDisplay(value);
  const [calendarMonth, setCalendarMonth] = React.useState(() =>
    getMonthStart(selectedDate ?? new Date(1950, 0, 1)),
  );
  const calendarDays = React.useMemo(() => getCalendarDays(calendarMonth), [calendarMonth]);
  const calendarTitle = `${monthNames[calendarMonth.getMonth()]} ${calendarMonth.getFullYear()}`;
  const currentMonthStart = getMonthStart(new Date());
  const canGoNextMonth = addMonths(calendarMonth, 1) <= currentMonthStart;
  const canGoNextYear = addMonths(calendarMonth, 12) <= currentMonthStart;

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

  const openCalendar = () => {
    setCalendarMonth(getMonthStart(selectedDate ?? new Date(1950, 0, 1)));
    setShowCalendar(true);
  };

  const selectDate = (date: Date) => {
    if (isFutureDate(date)) return;

    onChangeText(formatDateDisplay(date));
    setShowCalendar(false);
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
        <TouchableOpacity activeOpacity={0.75} onPress={openCalendar} style={styles.calendarButton}>
          <Feather name="calendar" size={18} color="#0C4DFF" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowCalendar(false)} />
          <View style={styles.calendarCard}>
            <Text style={styles.calendarTitle}>Data de nascimento</Text>

            <View style={styles.calendarHeader}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setCalendarMonth((current) => addMonths(current, -12))}
                style={styles.calendarNavButton}>
                <Feather name="chevrons-left" size={18} color="#0C4DFF" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setCalendarMonth((current) => addMonths(current, -1))}
                style={styles.calendarNavButton}>
                <Feather name="chevron-left" size={18} color="#0C4DFF" />
              </TouchableOpacity>
              <Text style={styles.calendarMonthText}>{calendarTitle}</Text>
              <TouchableOpacity
                activeOpacity={0.75}
                disabled={!canGoNextMonth}
                onPress={() => setCalendarMonth((current) => addMonths(current, 1))}
                style={[styles.calendarNavButton, !canGoNextMonth && styles.calendarNavDisabled]}>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={canGoNextMonth ? '#0C4DFF' : '#9AA6C0'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.75}
                disabled={!canGoNextYear}
                onPress={() => setCalendarMonth((current) => addMonths(current, 12))}
                style={[styles.calendarNavButton, !canGoNextYear && styles.calendarNavDisabled]}>
                <Feather
                  name="chevrons-right"
                  size={18}
                  color={canGoNextYear ? '#0C4DFF' : '#9AA6C0'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
              {weekDays.map((day, index) => (
                <Text key={`${day}-${index}`} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((date, index) => {
                const isSelected = date && selectedDate && isSameDate(date, selectedDate);
                const isDisabled = !date || isFutureDate(date);

                return (
                  <Pressable
                    key={date ? date.toISOString() : `empty-${index}`}
                    disabled={isDisabled}
                    onPress={() => date && selectDate(date)}
                    style={[
                      styles.calendarDayButton,
                      isSelected && styles.calendarDaySelected,
                      isDisabled && styles.calendarDayDisabled,
                    ]}>
                    <Text
                      style={[
                        styles.calendarDayText,
                        isSelected && styles.calendarDaySelectedText,
                        isDisabled && styles.calendarDayDisabledText,
                      ]}>
                      {date ? date.getDate() : ''}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowCalendar(false)}
              style={styles.calendarCloseButton}>
              <Text style={styles.calendarCloseText}>Fechar</Text>
            </TouchableOpacity>
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
  calendarCard: {
    width: '100%',
    maxWidth: 340,
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
  calendarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 14,
  },
  calendarHeader: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  calendarNavButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFE0FF',
    backgroundColor: '#EFF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarNavDisabled: {
    backgroundColor: '#F3F5F9',
    borderColor: '#E3E7F0',
  },
  calendarMonthText: {
    flex: 1,
    minWidth: 98,
    color: '#14213D',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekDayText: {
    width: `${100 / 7}%`,
    color: '#64708A',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  calendarDayButton: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  calendarDaySelected: {
    backgroundColor: '#0C4DFF',
  },
  calendarDayDisabled: {
    opacity: 0.35,
  },
  calendarDayText: {
    color: '#1B2435',
    fontSize: 14,
    fontWeight: '700',
  },
  calendarDaySelectedText: {
    color: '#FFFFFF',
  },
  calendarDayDisabledText: {
    color: '#8A94A8',
  },
  calendarCloseButton: {
    alignSelf: 'center',
    minWidth: 110,
    minHeight: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C4DFF',
    paddingHorizontal: 18,
  },
  calendarCloseText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
