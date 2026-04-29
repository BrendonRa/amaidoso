import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  gradientColors?: [string, string];
};

export function PrimaryButton({ title, onPress, disabled, style, gradientColors }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled, style]}>
      {gradientColors ? (
        <LinearGradient colors={gradientColors} end={{ x: 1, y: 0.5 }} start={{ x: 0, y: 0.5 }} style={styles.gradient} />
      ) : null}
      <Text style={[styles.text, !gradientColors ? styles.solidText : null]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 150,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#111111',
    paddingHorizontal: 18,
    position: 'relative',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  solidText: {
    color: '#FFFFFF',
  },
});

