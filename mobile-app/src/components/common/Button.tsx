import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';
interface Props { title: string; onPress: () => void; disabled?: boolean; secondary?: boolean }
export function Button({ title, onPress, disabled, secondary }: Props) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, secondary && styles.secondary, { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 }]}>
    <Text style={[styles.text, secondary && { color: theme.colors.primary }]}>{title}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({ button: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' }, secondary: { backgroundColor: '#E6EFFD' }, text: { color: '#FFF', fontSize: 16, fontWeight: '600' } });
