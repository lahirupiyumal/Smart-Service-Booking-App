import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServiceIcon, type IconName } from '@/components/common/ServiceIcon';

const services: { category: string; icon: IconName; tint: string; label: string }[] = [
  { category: 'Home Cleaning', icon: 'clean', tint: '#EAF1FF', label: 'Cleaning' },
  { category: 'AC Repair', icon: 'ac', tint: '#E5F5FA', label: 'AC repair' },
  { category: 'Electrical Services', icon: 'bolt', tint: '#FFF4DF', label: 'Electrical' },
  { category: 'Plumbing', icon: 'plumbing', tint: '#E9F1FD', label: 'Plumbing' },
  { category: 'Painting', icon: 'paint', tint: '#F1EDFC', label: 'Painting' },
  { category: 'Gardening', icon: 'garden', tint: '#EAF5EE', label: 'Gardening' },
];

export default function Home() {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchTerm = query.trim().toLowerCase();
  const filteredServices = services.filter(service => `${service.category} ${service.label}`.toLowerCase().includes(searchTerm));
  return <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.row}><View style={styles.logo}><ServiceIcon name="home" color="#FFFFFF" size={23} /></View><View><Text style={styles.brand}>SmartServe<Text style={styles.dot}>.</Text></Text><Text style={styles.brandCaption}>HOME SERVICES, SIMPLIFIED</Text></View></View>
          <View style={styles.headerActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Open notifications" onPress={() => router.push('/notifications')} style={({ pressed, hovered }) => [styles.iconButton, hovered && styles.iconButtonHovered, pressed && styles.pressed]}><ServiceIcon name="bell" color="#243650" size={21} /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Open your profile" onPress={() => router.push('/(customer)/profile')} style={({ pressed, hovered }) => [styles.iconButton, hovered && styles.iconButtonHovered, pressed && styles.pressed]}><ServiceIcon name="user" color="#243650" size={22} /></Pressable>
          </View>
        </View>
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, searchFocused && styles.searchFocused]}>
            <ServiceIcon name="search" size={22} color={searchFocused ? '#2563EB' : '#7C8CA5'} />
            <TextInput accessibilityLabel="Search services" placeholder="Search cleaning, repairs and more" placeholderTextColor="#8A98AD" value={query} onChangeText={setQuery} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} autoCapitalize="none" autoCorrect={false} returnKeyType="search" style={styles.searchInput} />
            {query.length > 0 && <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} style={styles.clearButton}><Text style={styles.clearText}>×</Text></Pressable>}
          </View>
          {searchTerm.length > 0 && <Text accessibilityLiveRegion="polite" style={styles.resultCount}>{filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found</Text>}
        </View>
        <View style={styles.section}><View style={styles.sectionHeading}><View><Text style={styles.kicker}>FIND YOUR SERVICE</Text><Text style={styles.sectionTitle}>What can we help with?</Text></View></View>
          <View style={styles.categoryGrid}>{filteredServices.map(s => <Pressable key={s.category} accessibilityRole="button" onPress={() => router.push({ pathname: '/booking/create', params: { category: s.category } })} style={({ pressed }) => [styles.category, { width: wide ? '15.3%' : '31%' }, pressed && styles.pressed]}><View style={[styles.categoryIcon, { backgroundColor: s.tint }]}><ServiceIcon name={s.icon} color="#2563EB" size={26} /></View><Text style={styles.categoryLabel}>{s.label}</Text></Pressable>)}</View>
          {filteredServices.length === 0 && <View style={styles.emptyState}><ServiceIcon name="search" size={30} color="#8A98AD" /><Text style={styles.emptyTitle}>No services found</Text><Text style={styles.emptyText}>Try “cleaning”, “AC” or “painting”.</Text><Pressable accessibilityRole="button" onPress={() => setQuery('')} style={styles.resetButton}><Text style={styles.resetText}>Show all services</Text></Pressable></View>}
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' }, scroll: { paddingHorizontal: 22, paddingBottom: 32 }, page: { width: '100%', maxWidth: 1040, alignSelf: 'center', gap: 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#E7EDF5' }, row: { flexDirection: 'row', alignItems: 'center', gap: 10 }, logo: { width: 42, height: 42, backgroundColor: '#2563EB', borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, brand: { color: '#14243D', fontSize: 22, fontWeight: '800', letterSpacing: -0.8 }, dot: { color: '#2563EB' }, brandCaption: { color: '#7C8AA0', fontSize: 7, letterSpacing: 1.7, fontWeight: '700', marginTop: 3 }, iconButton: { width: 44, height: 44, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E6ECF5', alignItems: 'center', justifyContent: 'center' },
  section: { gap: 18 }, sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, kicker: { color: '#8996AA', fontSize: 8, fontWeight: '700', letterSpacing: 1.5, marginBottom: 7 }, sectionTitle: { color: '#14243D', fontSize: 21, fontWeight: '700', letterSpacing: -0.6 }, categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }, category: { paddingVertical: 17, paddingHorizontal: 4, alignItems: 'center', gap: 12, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6ECF4' }, categoryIcon: { width: 49, height: 49, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, categoryLabel: { fontSize: 11, color: '#3E506B', fontWeight: '600' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButtonHovered: { backgroundColor: '#EFF5FF', borderColor: '#BDD3FA' },
  searchSection: { gap: 10 },
  searchBar: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 18, paddingRight: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7F3', borderRadius: 15 },
  searchFocused: { borderColor: '#2563EB', backgroundColor: '#FCFDFF' },
  searchInput: { flex: 1, minWidth: 0, paddingVertical: 18, fontSize: 14, color: '#243650' },
  clearButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  clearText: { fontSize: 25, color: '#7C8CA5' },
  resultCount: { fontSize: 12, color: '#72819A', paddingLeft: 3 },
  emptyState: { paddingVertical: 28, alignItems: 'center', gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#243650' },
  emptyText: { fontSize: 13, color: '#72819A', textAlign: 'center' },
  resetButton: { paddingHorizontal: 18, paddingVertical: 13, backgroundColor: '#EBF2FF', borderRadius: 10, marginTop: 4 },
  resetText: { color: '#2563EB', fontSize: 12, fontWeight: '600' },
  pressed: { opacity: 0.72 },
});
