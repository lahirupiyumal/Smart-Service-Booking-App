import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { styles } from '../styles/Auth.styles';

export function AuthLink({ href, children, disabled = false, alignRight = false }: { href: Href; children: string; disabled?: boolean; alignRight?: boolean }) {
  return <Link href={href} disabled={disabled} asChild>
    <Pressable accessibilityRole="link" disabled={disabled} style={StyleSheet.flatten([styles.linkButton, alignRight && styles.rightLink])}><Text style={styles.link}>{children}</Text></Pressable>
  </Link>;
}
