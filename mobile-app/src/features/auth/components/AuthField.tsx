import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { styles } from '../styles/Auth.styles';

interface Props extends TextInputProps { label: string; error?: string; hint?: string; password?: boolean }
export function AuthField({ label, error, hint, password = false, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputRow, focused && styles.focused, !!error && styles.invalid]}>
      <TextInput {...props} accessibilityLabel={label} accessibilityHint={error || hint} placeholderTextColor="#91A0B6" style={styles.input}
        secureTextEntry={password && !visible} onFocus={event => { setFocused(true); props.onFocus?.(event); }} onBlur={event => { setFocused(false); props.onBlur?.(event); }} />
      {password && <Pressable accessibilityRole="button" accessibilityLabel={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} accessibilityState={{ expanded: visible }} disabled={props.editable === false} onPress={() => setVisible(value => !value)} style={styles.reveal}><Text style={styles.revealText}>{visible ? 'Hide' : 'Show'}</Text></Pressable>}
    </View>
    {!!error ? <Text accessibilityRole="alert" style={styles.fieldError}>{error}</Text> : !!hint && <Text style={styles.hint}>{hint}</Text>}
  </View>;
}
