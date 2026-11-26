import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServiceIcon } from '@/components/common/ServiceIcon';
import { styles } from '../styles/Auth.styles';

function Brand() {
  return <View style={styles.brandRow}>
    <View style={styles.logo}><ServiceIcon name="home" color="#FFFFFF" size={24} /></View>
    <View style={styles.brandCopy}>
      <Text style={styles.brand}>SmartServe<Text style={styles.brandDot}>.</Text></Text>
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={styles.brandCaption}>EVERYDAY SERVICES, SIMPLIFIED</Text>
    </View>
  </View>;
}

export function AuthScaffold({ title, subtitle, eyebrow, children }: PropsWithChildren<{ title: string; subtitle: string; eyebrow: string }>) {
  const wide = useWindowDimensions().width >= 600;
  return <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={[styles.scroll, wide && styles.wideScroll]}>
        <View style={styles.shell}>
          <View style={styles.cardAccent} />
          <View style={[styles.formPanel, wide && styles.wideFormPanel]}>
            <View style={styles.brandHeader}><Brand /></View>
            <View style={styles.eyebrowRow}><View style={styles.eyebrowDot} /><Text style={styles.eyebrow}>{eyebrow}</Text></View>
            <Text accessibilityRole="header" style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            {children}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
