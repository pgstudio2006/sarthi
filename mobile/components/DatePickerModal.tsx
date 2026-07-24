import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { colors } from '../theme/colors';
import { useTranslation } from '../i18n';

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
  maxDate,
  minDate,
  onSelect,
  onClose,
}: DatePickerModalProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date>(initialDate ?? new Date());
  const openedRef = useRef(false);

  useEffect(() => {
    if (visible) {
      setDate(initialDate ?? new Date());
    }
  }, [visible, initialDate]);

  useEffect(() => {
    if (Platform.OS !== 'android' || !visible) {
      openedRef.current = false;
      return;
    }
    if (openedRef.current) return;

    openedRef.current = true;
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event: any, selectedDate?: Date) => {
        openedRef.current = false;
        if (event?.type === 'set' && selectedDate) {
          setDate(selectedDate);
          onSelect(selectedDate);
        }
        onClose();
      },
      maximumDate: maxDate,
      minimumDate: minDate,
    });
  }, [visible, date, maxDate, minDate, onSelect, onClose]);

  if (Platform.OS === 'android') {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <RNDateTimePicker
            value={date}
            mode="date"
            display="spinner"
            maximumDate={maxDate}
            minimumDate={minDate}
            onChange={(_event: any, selectedDate?: Date) => {
              if (selectedDate) setDate(selectedDate);
            }}
          />
          <View style={styles.actions}>
            <Pressable onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={[styles.buttonText, { color: colors.primaryBlue }]}>{t('cancel')}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onSelect(date);
                onClose();
              }}
              style={[styles.button, styles.confirmButton, { backgroundColor: colors.primaryBlue }]}
            >
              <Text style={[styles.buttonText, { color: colors.white }]}>{t('confirm')}</Text>
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
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    zIndex: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  cancelButton: {
    backgroundColor: colors.white,
  },
  confirmButton: {
    backgroundColor: colors.primaryBlue,
  },
  buttonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
});
