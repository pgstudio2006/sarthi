import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { colors } from '../theme/colors';

const FIGMA_WIDTH = 390;
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

type DatePickerModalProps = {
  visible: boolean;
  initialDate?: Date;
  maxDate?: Date;
  minDate?: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
};

export default function DatePickerModal({
  visible,
  initialDate,
  maxDate = new Date(),
  minDate,
  onSelect,
  onClose,
}: DatePickerModalProps) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  const today = new Date();
  const [viewDate, setViewDate] = useState(initialDate ? new Date(initialDate) : new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
    return cells;
  }, [year, month]);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const isDisabled = (day: number) => {
    const date = new Date(year, month, day);
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    return false;
  };

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleConfirm = () => {
    if (selectedDate) {
      onSelect(selectedDate);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { borderRadius: 24 * scale, padding: 20 * scale, width: width - 40 * scale }]}>
          <Text style={[styles.title, { fontSize: 20 * scale, marginBottom: 16 * scale }]}>
            Select Date of Birth
          </Text>

          <View style={[styles.header, { marginBottom: 12 * scale }]}>
            <Pressable onPress={handlePrevMonth} hitSlop={10}>
              <Text style={[styles.nav, { fontSize: 22 * scale }]}>{'<'}</Text>
            </Pressable>
            <Text style={[styles.monthYear, { fontSize: 16 * scale }]}>
              {MONTHS[month]} {year}
            </Text>
            <Pressable onPress={handleNextMonth} hitSlop={10}>
              <Text style={[styles.nav, { fontSize: 22 * scale }]}>{'>'}</Text>
            </Pressable>
          </View>

          <View style={[styles.weekdays, { marginBottom: 8 * scale }]}>
            {WEEKDAYS.map((d) => (
              <Text key={d} style={[styles.weekday, { fontSize: 12 * scale, width: '14.28%' }]}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day, idx) => {
              if (day === null) {
                return <View key={`empty-${idx}`} style={{ width: '14.28%' }} />;
              }
              const date = new Date(year, month, day);
              const selected = selectedDate ? isSameDay(date, selectedDate) : false;
              const isToday = isSameDay(date, today);
              const disabled = isDisabled(day);
              return (
                <Pressable
                  key={day}
                  disabled={disabled}
                  onPress={() => setSelectedDate(date)}
                  style={{
                    width: '14.28%',
                    alignItems: 'center',
                    paddingVertical: 8 * scale,
                  }}
                >
                  <View
                    style={[
                      styles.dayBubble,
                      {
                        width: 36 * scale,
                        height: 36 * scale,
                        borderRadius: 18 * scale,
                        backgroundColor: selected ? colors.primaryBlue : 'transparent',
                        borderWidth: isToday && !selected ? 1.5 : 0,
                        borderColor: colors.primaryBlue,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        { fontSize: 14 * scale },
                        selected && { color: colors.white },
                        disabled && { color: colors.grey },
                        isToday && !selected && { color: colors.primaryBlue },
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.actions, { marginTop: 20 * scale, gap: 12 * scale }]}>
            <Pressable onPress={onClose} style={[styles.actionButton, styles.cancelButton, { borderRadius: 16 * scale, paddingVertical: 14 * scale }]}>
              <Text style={[styles.actionText, { fontSize: 16 * scale, color: colors.primaryBlue }]}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleConfirm} style={[styles.actionButton, styles.confirmButton, { borderRadius: 16 * scale, paddingVertical: 14 * scale, backgroundColor: colors.primaryBlue }]}>
              <Text style={[styles.actionText, { fontSize: 16 * scale, color: colors.white }]}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    maxWidth: 400,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nav: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.primaryBlue,
    minWidth: 32,
    textAlign: 'center',
  },
  monthYear: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekday: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.grey,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayBubble: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.mainBlack,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  cancelButton: {
    backgroundColor: colors.white,
  },
  confirmButton: {
    backgroundColor: colors.primaryBlue,
  },
  actionText: {
    fontFamily: 'Inter_700Bold',
  },
});
