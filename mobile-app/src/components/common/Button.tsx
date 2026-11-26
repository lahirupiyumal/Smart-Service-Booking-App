import { ActivityIndicator, Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';
interface Props { title: string; onPress: () => void; disabled?: boolean; secondary?: boolean; loading?: boolean }
export function Button({ title, onPress, disabled, secondary, loading = false }: Props) {
  return <Pressable accessibilityRole="button" accessibilityState={{ busy: loading, disabled: disabled || loading }} disabled={disabled || loading} onPress={onPress}
    style={({ pressed }) => [styles.button, secondary && styles.secondary, { opacity: disabled || loading ? 0.6 : pressed ? 0.75 : 1 }]}>
    {loading && <ActivityIndicator color={secondary ? theme.colors.primary : '#FFFFFF'} />}
    <Text style={[styles.text, secondary && { color: theme.colors.primary }]}>{title}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({ button: { minHeight: 52, flexDirection: 'row', justifyContent: 'center', gap: 10, backgroundColor: theme.colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' }, secondary: { backgroundColor: '#E6EFFD' }, text: { color: '#FFF', fontSize: 16, fontWeight: '600' } });
