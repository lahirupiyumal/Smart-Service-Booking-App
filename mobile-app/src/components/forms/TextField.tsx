import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { theme } from '@/theme';
export function TextField({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={{ gap: 8 }}><Text style={{ color: theme.colors.text, fontWeight: '600' }}>{label}</Text>
    <TextInput {...props} accessibilityLabel={label} placeholderTextColor={theme.colors.muted} style={{ backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 16, fontSize: 16, color: theme.colors.text }} /></View>;
}
