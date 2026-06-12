import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type PasswordInputProps = Omit<TextInputProps, 'secureTextEntry' | 'style'> & {
  containerStyle?: StyleProp<ViewStyle>;
  fieldStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  showToggle?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
};

export function PasswordInput({
  containerStyle,
  fieldStyle,
  inputStyle,
  iconColor = '#737373',
  showToggle = true,
  visible,
  onVisibleChange,
  placeholderTextColor = '#737373',
  ...props
}: PasswordInputProps) {
  const [internalVisible, setInternalVisible] = React.useState(false);
  const isVisible = visible ?? internalVisible;
  const setVisible = (nextVisible: boolean) => {
    onVisibleChange?.(nextVisible);
    setInternalVisible(nextVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...props}
        autoCapitalize={props.autoCapitalize ?? 'none'}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={!isVisible}
        style={[fieldStyle, styles.fieldWithoutMargin, inputStyle]}
      />
      {showToggle ? (
        <PasswordVisibilityToggle
          iconColor={iconColor}
          visible={isVisible}
          onPress={() => setVisible(!isVisible)}
        />
      ) : null}
    </View>
  );
}

type PasswordVisibilityToggleProps = {
  iconColor?: string;
  visible: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PasswordVisibilityToggle({
  iconColor = '#737373',
  visible,
  onPress,
  style,
}: PasswordVisibilityToggleProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
      onPress={onPress}
      style={[styles.toggleButton, style]}>
      <View style={[styles.checkbox, visible && { borderColor: iconColor, backgroundColor: iconColor }]}>
        {visible ? <Feather name="check" size={12} color="#FFFFFF" /> : null}
      </View>
      <Text style={[styles.toggleText, { color: iconColor }]}>Mostrar Senha</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  fieldWithoutMargin: {
    marginBottom: 0,
  },
  toggleButton: {
    alignSelf: 'flex-start',
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#9A9A9A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
