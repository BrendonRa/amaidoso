import React, { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
  brand?: ReactNode;
  headerLeft?: ReactNode;
  footer?: ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}>;

export function AuthLayout({
  children,
  title,
  subtitle,
  brand,
  headerLeft,
  footer,
  titleStyle,
  subtitleStyle,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <View style={styles.container}>
          {headerLeft ? <View style={styles.headerLeft}>{headerLeft}</View> : null}

          {brand ? <View style={styles.brandWrap}>{brand}</View> : null}

          <View style={styles.header}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
          </View>

          <View style={styles.content}>{children}</View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
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
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerLeft: {
    position: 'absolute',
    top: 40,
    left: 28,
    zIndex: 1,
  },
  brandWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#2E2E2E',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    marginTop: 16,
  },
});

