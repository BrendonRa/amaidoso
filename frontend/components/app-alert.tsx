import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type AlertType = 'success' | 'error' | 'warning' | 'info';

type AlertButton = {
  text: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

type AlertOptions = {
  type?: AlertType;
  title: string;
  message: string;
  buttons?: AlertButton[];
};

type AppAlertContextValue = {
  showAlert: (options: AlertOptions) => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
};

const AppAlertContext = React.createContext<AppAlertContextValue | null>(null);

const ALERT_STYLE: Record<
  AlertType,
  { icon: keyof typeof Feather.glyphMap; color: string; background: string }
> = {
  success: { icon: 'check', color: '#157347', background: '#E7F6ED' },
  error: { icon: 'alert-circle', color: '#B42318', background: '#FDE8E7' },
  warning: { icon: 'alert-triangle', color: '#B54708', background: '#FFF3E0' },
  info: { icon: 'info', color: '#0C4DFF', background: '#EAF1FF' },
};

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = React.useState<AlertOptions | null>(null);

  const close = React.useCallback(() => setAlert(null), []);

  const showAlert = React.useCallback((options: AlertOptions) => {
    setAlert({
      ...options,
      type: options.type ?? 'info',
      buttons: options.buttons?.length
        ? options.buttons
        : [{ text: 'Entendi', variant: options.type === 'error' ? 'danger' : 'primary' }],
    });
  }, []);

  const value = React.useMemo<AppAlertContextValue>(
    () => ({
      showAlert,
      showSuccess: (title, message) => showAlert({ type: 'success', title, message }),
      showError: (title, message) => showAlert({ type: 'error', title, message }),
      showWarning: (title, message) => showAlert({ type: 'warning', title, message }),
    }),
    [showAlert],
  );

  const type = alert?.type ?? 'info';
  const visual = ALERT_STYLE[type];
  const buttons = alert?.buttons ?? [];

  return (
    <AppAlertContext.Provider value={value}>
      {children}
      <Modal animationType="fade" transparent visible={!!alert} onRequestClose={close}>
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={close} />
          {alert ? (
            <View style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: visual.background }]}>
                <Feather name={visual.icon} size={25} color={visual.color} />
              </View>
              <Text style={styles.title}>{alert.title}</Text>
              <Text style={styles.message}>{alert.message}</Text>

              <View style={buttons.length > 1 ? styles.actionsRow : styles.actionsStack}>
                {buttons.map((button, index) => {
                  const variant = button.variant ?? (index === buttons.length - 1 ? 'primary' : 'secondary');
                  return (
                    <TouchableOpacity
                      activeOpacity={0.82}
                      key={`${button.text}-${index}`}
                      onPress={() => {
                        close();
                        button.onPress?.();
                      }}
                      style={[
                        styles.button,
                        variant === 'secondary' && styles.secondaryButton,
                        variant === 'danger' && styles.dangerButton,
                      ]}>
                      <Text
                        style={[
                          styles.buttonText,
                          variant === 'secondary' && styles.secondaryButtonText,
                        ]}>
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
    </AppAlertContext.Provider>
  );
}

export function useAppAlert() {
  const context = React.useContext(AppAlertContext);
  if (!context) {
    throw new Error('useAppAlert must be used within AppAlertProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#161616',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: '#3A3A3A',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionsStack: {
    width: '100%',
    alignItems: 'center',
  },
  actionsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    minWidth: 150,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C4DFF',
    paddingHorizontal: 18,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D8D8',
  },
  dangerButton: {
    backgroundColor: '#D92D20',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#333333',
  },
});
