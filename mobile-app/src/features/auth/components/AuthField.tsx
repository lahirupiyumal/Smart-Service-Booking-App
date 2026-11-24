import { useState, type ReactNode } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { ServiceIcon } from '@/components/common/ServiceIcon';
import { styles } from '../styles/AuthScreen.styles';

export function AuthField({ label, icon = 'user', trailing, ...props }: TextInputProps & { label: string; icon?: 'user' | 'check'; trailing?: ReactNode }) {
  const [focused, setFocused] = useState(false);
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrap, focused && styles.inputFocused]}>
      <ServiceIcon name={icon} size={19} color={focused ? '#16796B' : '#8995A7'} />
      <TextInput {...props} accessibilityLabel={label} placeholderTextColor="#8A95A5" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={styles.input} />
      {trailing}
    </View>
  </View>;
}

