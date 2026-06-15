import React from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  onFinish: () => void;
};

export function AnimatedStartupSplash({ onFinish }: Props) {
  const logoOpacity = React.useRef(new Animated.Value(0)).current;
  const logoScale = React.useRef(new Animated.Value(0.82)).current;
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const titleTranslateY = React.useRef(new Animated.Value(10)).current;
  const progressScale = React.useRef(new Animated.Value(0)).current;
  const screenOpacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 360,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(progressScale, {
          toValue: 1,
          duration: 720,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(180),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        onFinish();
      }
    });

    return () => animation.stop();
  }, [logoOpacity, logoScale, onFinish, progressScale, screenOpacity, titleOpacity, titleTranslateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.screen, { opacity: screenOpacity }]}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoFrame,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}>
          <Image
            source={require('../assets/images/amaidoso-logo-app.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          }}>
          <Text style={styles.title}>Amaidoso</Text>
          <Text style={styles.subtitle}>Cuidado em cada lembrete</Text>
        </Animated.View>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                transform: [{ scaleX: progressScale }],
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoFrame: {
    width: 156,
    height: 156,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1456FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 5,
  },
  logo: {
    width: 132,
    height: 132,
  },
  title: {
    marginTop: 24,
    fontSize: 30,
    fontWeight: '900',
    color: '#202020',
    textAlign: 'center',
    letterSpacing: 0,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#5E6878',
    textAlign: 'center',
    letterSpacing: 0,
  },
  progressTrack: {
    width: 150,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#E8EEF8',
    overflow: 'hidden',
    marginTop: 24,
  },
  progressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#F58220',
    transformOrigin: 'left',
  },
});
