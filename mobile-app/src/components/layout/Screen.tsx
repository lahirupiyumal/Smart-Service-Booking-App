import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/theme';
export function Screen({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}><ScrollView contentContainerStyle={styles.scroll}>
    <View style={styles.content}><Text style={styles.brand}>SMART SERVICE BOOKING</Text><Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}{children}</View>
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: theme.colors.background }, scroll: { flexGrow: 1, padding: 24 }, content: { width: '100%', maxWidth: 720, alignSelf: 'center', gap: 16 }, brand: { color: theme.colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 }, title: { fontSize: 30, fontWeight: '700', color: theme.colors.text }, subtitle: { color: theme.colors.muted, fontSize: 16, lineHeight: 24 } });
