import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';
export function InfoCard({ title, description }: { title: string; description: string }) {
  return <View style={styles.card}><Text style={styles.title}>{title}</Text><Text style={styles.body}>{description}</Text></View>;
}
const styles = StyleSheet.create({ card: { padding: 20, gap: 8, borderRadius: theme.radius, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }, title: { fontSize: 18, fontWeight: '600', color: theme.colors.text }, body: { color: theme.colors.muted, fontSize: 15, lineHeight: 22 } });
