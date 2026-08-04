import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing, 
  FadeInUp
} from 'react-native-reanimated';
import { Network, Server, ShieldCheck, Cpu, Globe } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuthStore } from '../store/useAuthStore';

const STATUS_LOGS = [
  "INITIALIZING_TOPOLOGY...",
  "TCP_HANDSHAKE_SYN...",
  "ESTABLISHING_TLS_SESSION...",
  "CONNECTION_SECURE"
];

export const SplashScreen = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const { theme } = useTheme();
  const [statusIndex, setStatusIndex] = useState(0);

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  const packetTop = useSharedValue(0);
  const packetBottom = useSharedValue(0);
  const packetLeft = useSharedValue(0);
  const packetRight = useSharedValue(0);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(2, { duration: 2500, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 2500, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );

    const timingConfig = { duration: 1000, easing: Easing.inOut(Easing.cubic) };

    packetTop.value = withRepeat(withTiming(1, timingConfig), -1, true);

    packetRight.value = withDelay(250, withRepeat(withTiming(1, timingConfig), -1, true));
    packetBottom.value = withDelay(500, withRepeat(withTiming(1, timingConfig), -1, true));
    packetLeft.value = withDelay(750, withRepeat(withTiming(1, timingConfig), -1, true));

    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev < STATUS_LOGS.length - 1 ? prev + 1 : prev));
    }, 600);

    const timer = setTimeout(() => {
      initialize();
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [initialize]);

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const topPacketStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -packetTop.value * 85 }],
    opacity: packetTop.value > 0.1 ? 1 : 0, 
  }));
  const bottomPacketStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: packetBottom.value * 85 }],
    opacity: packetBottom.value > 0.1 ? 1 : 0,
  }));
  const leftPacketStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -packetLeft.value * 85 }],
    opacity: packetLeft.value > 0.1 ? 1 : 0,
  }));
  const rightPacketStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: packetRight.value * 85 }],
    opacity: packetRight.value > 0.1 ? 1 : 0,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <View style={styles.meshCanvas}>

        <View style={[styles.wireVertical, { backgroundColor: theme.colors.border }]} />
        <View style={[styles.wireHorizontal, { backgroundColor: theme.colors.border }]} />

        <Animated.View style={[styles.packetDot, { backgroundColor: theme.colors.primary }, topPacketStyle]} />
        <Animated.View style={[styles.packetDot, { backgroundColor: theme.colors.primary }, bottomPacketStyle]} />
        <Animated.View style={[styles.packetDot, { backgroundColor: theme.colors.primary }, leftPacketStyle]} />
        <Animated.View style={[styles.packetDot, { backgroundColor: theme.colors.primary }, rightPacketStyle]} />

        <View style={[styles.satelliteNode, styles.nodeTop, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Globe size={18} color={theme.colors.textSecondary} />
        </View>
        <View style={[styles.satelliteNode, styles.nodeBottom, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Server size={18} color={theme.colors.textSecondary} />
        </View>
        <View style={[styles.satelliteNode, styles.nodeLeft, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <ShieldCheck size={18} color={theme.colors.textSecondary} />
        </View>
        <View style={[styles.satelliteNode, styles.nodeRight, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Cpu size={18} color={theme.colors.textSecondary} />
        </View>

        <Animated.View style={[styles.pulseWave, { borderColor: theme.colors.primary }, waveStyle]} />
        <View style={[styles.coreHub, { backgroundColor: theme.colors.primary }]}>
          <Network size={32} color={theme.colors.background} />
        </View>

      </View>

      <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.brandContainer}>
        <Text style={[styles.brandTitle, { color: theme.colors.text }]}>CN MASTER</Text>
        <Text style={[styles.brandSubtitle, { color: theme.colors.textSecondary }]}>NETWORKING ENGINE</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(500).duration(600)} style={[styles.consoleBadge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={[styles.greenIndicator, { backgroundColor: theme.colors.primary }]} />
        <Text style={[styles.consoleText, { color: theme.colors.text }]}>
          {STATUS_LOGS[statusIndex]}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meshCanvas: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 48,
  },

  wireVertical: {
    position: 'absolute',
    width: 2,
    height: '100%',
    zIndex: 1,
  },
  wireHorizontal: {
    position: 'absolute',
    height: 2,
    width: '100%',
    zIndex: 1,
  },

  packetDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 2,
  },

  coreHub: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  pulseWave: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    zIndex: 1,
  },

  satelliteNode: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 8,
  },
  nodeTop: { top: 0 },
  nodeBottom: { bottom: 0 },
  nodeLeft: { left: 0 },
  nodeRight: { right: 0 },

  brandContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 3,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Status Badge
  consoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
  },
  greenIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  consoleText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
});