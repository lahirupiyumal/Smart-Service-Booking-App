import { useState } from 'react';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServiceIcon } from '@/components/common/ServiceIcon';

import { serviceCategories } from '@/constants/categories';

export default function Home() {
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 600;
  const horizontalPadding = compact ? 16 : 22;
  const contentWidth = Math.min(Math.max(width - horizontalPadding * 2, 0), 1040);
  const columns = compact ? 4 : contentWidth >= 900 ? 4 : 3;
  const cardGap = compact ? 8 : 12;
  const cardWidth = Math.floor((contentWidth - (columns - 1) * cardGap) / columns);
  const imageSize = Math.min(72, Math.max(24, cardWidth - 16));
  const captionHeight = Math.ceil(42 * fontScale);
  const compactCardHeight = imageSize + captionHeight + 30;
  const mainGap = compact ? 8 : 12;
  const mainCardWidth = contentWidth >= 280 ? Math.floor((contentWidth - mainGap * 2) / 3) : contentWidth;
  const mainImageSize = Math.max(40, Math.min(mainCardWidth - 20, compact ? 96 : 160));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchTerm = query.trim().toLowerCase();
  const activeCategory = serviceCategories.find(category => category.id === selectedCategory);
  const groups = (searchTerm ? serviceCategories : activeCategory ? [activeCategory] : []).map(category => ({
    ...category,
    subcategories: category.subcategories.filter(subcategory =>
      `${category.name} ${subcategory.name} ${subcategory.services.join(' ')}`.toLowerCase().includes(searchTerm)),
  })).filter(category => category.subcategories.length > 0);
  const resultCount = groups.reduce((count, category) => count + category.subcategories.length, 0);
  return <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.scroll, { paddingHorizontal: horizontalPadding }]}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.row}><View style={styles.logo}><ServiceIcon name="home" color="#FFFFFF" size={23} /></View><View><Text style={styles.brand}>SmartServe<Text style={styles.dot}>.</Text></Text><Text style={styles.brandCaption}>EVERYDAY SERVICES, SIMPLIFIED</Text></View></View>
          <View style={styles.headerActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Open notifications" onPress={() => router.push('/notifications')} style={({ pressed, hovered }) => [styles.iconButton, hovered && styles.iconButtonHovered, pressed && styles.pressed]}><ServiceIcon name="bell" color="#243650" size={21} /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Open your profile" onPress={() => router.push('/(customer)/profile')} style={({ pressed, hovered }) => [styles.iconButton, hovered && styles.iconButtonHovered, pressed && styles.pressed]}><ServiceIcon name="user" color="#243650" size={22} /></Pressable>
          </View>
        </View>
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, searchFocused && styles.searchFocused]}>
            <ServiceIcon name="search" size={22} color={searchFocused ? '#2563EB' : '#7C8CA5'} />
            <TextInput accessibilityLabel="Search services" placeholder="Search home, farming, vehicle services" placeholderTextColor="#8A98AD" value={query} onChangeText={setQuery} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} autoCapitalize="none" autoCorrect={false} returnKeyType="search" style={styles.searchInput} />
            {query.length > 0 && <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} style={styles.clearButton}><Text style={styles.clearText}>×</Text></Pressable>}
          </View>
          {searchTerm.length > 0 && <Text accessibilityLiveRegion="polite" style={styles.resultCount}>{resultCount} {resultCount === 1 ? 'subcategory' : 'subcategories'} found</Text>}
        </View>
        <View style={styles.section}><View style={styles.sectionHeading}><View><Text style={styles.kicker}>FIND YOUR SERVICE</Text><Text style={styles.sectionTitle}>{searchTerm ? 'Search results' : activeCategory ? activeCategory.name : 'What can we help with?'}</Text></View></View>
          {(activeCategory || searchTerm) && <Pressable accessibilityRole="button" onPress={() => { setSelectedCategory(null); setQuery(''); }} style={styles.backButton}><Text style={styles.resetText}>←  All categories</Text></Pressable>}
          {!activeCategory && !searchTerm && <View style={[styles.categoryGrid, { gap: mainGap }]}>{serviceCategories.map(category => <Pressable key={category.id} accessibilityRole="button" accessibilityLabel={`View ${category.name} subcategories`} onPress={() => setSelectedCategory(category.id)} style={({ pressed, hovered }) => [styles.category, styles.mainCategory, compact && styles.compactMainCategory, { width: mainCardWidth, minHeight: mainImageSize + (compact ? captionHeight + 34 : 88) }, hovered && styles.iconButtonHovered, pressed && styles.pressed]}>
            <Image source={category.image} style={[styles.categoryImage, { width: mainImageSize, height: mainImageSize }]} resizeMode="contain" accessible={false} />
            <View style={[styles.mainCaption, compact && { minHeight: captionHeight }]}><Text style={[styles.categoryLabel, compact && styles.compactMainLabel]}>{category.name}</Text></View>
          </Pressable>)}</View>}
          {groups.map(category => <View key={category.id} style={styles.section}>
            <Text style={styles.groupTitle}>{category.name}</Text>
            <View style={[styles.categoryGrid, { gap: cardGap }]}>{category.subcategories.map(subcategory => <Pressable key={subcategory.name} accessibilityRole="button" accessibilityLabel={`Book ${subcategory.name}`} onPress={() => router.push({ pathname: '/booking/create', params: { mainCategory: category.name, category: subcategory.name } })} style={({ pressed, hovered }) => [styles.category, compact && styles.compactCategory, { width: cardWidth, minHeight: compact ? compactCardHeight : 152 }, hovered && styles.iconButtonHovered, pressed && styles.pressed]}>
              {subcategory.image ? <Image source={subcategory.image} style={[styles.categoryImage, { width: imageSize, height: imageSize }]} resizeMode="contain" accessible={false} /> : <View style={[styles.subcategoryIcon, { width: imageSize, height: imageSize }]}><ServiceIcon name={subcategory.icon} size={32} /></View>}
              <View style={[styles.caption, compact && { minHeight: captionHeight }]}><Text style={[styles.categoryLabel, compact && styles.compactCategoryLabel]}>{subcategory.name}</Text></View>
            </Pressable>)}</View>
          </View>)}
          {!!searchTerm && resultCount === 0 && <View style={styles.emptyState}><ServiceIcon name="search" size={30} color="#8A98AD" /><Text style={styles.emptyTitle}>No services found</Text><Text style={styles.emptyText}>Try “cleaning”, “tractor” or “car wash”.</Text><Pressable accessibilityRole="button" onPress={() => setQuery('')} style={styles.resetButton}><Text style={styles.resetText}>Back to categories</Text></Pressable></View>}
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' }, scroll: { paddingHorizontal: 22, paddingBottom: 32 }, page: { width: '100%', maxWidth: 1040, alignSelf: 'center', gap: 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#E7EDF5' }, row: { flexDirection: 'row', alignItems: 'center', gap: 10 }, logo: { width: 42, height: 42, backgroundColor: '#2563EB', borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, brand: { color: '#14243D', fontSize: 22, fontWeight: '800', letterSpacing: -0.8 }, dot: { color: '#2563EB' }, brandCaption: { color: '#7C8AA0', fontSize: 7, letterSpacing: 1.7, fontWeight: '700', marginTop: 3 }, iconButton: { width: 44, height: 44, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E6ECF5', alignItems: 'center', justifyContent: 'center' },
  section: { gap: 18 }, sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, kicker: { color: '#8996AA', fontSize: 8, fontWeight: '700', letterSpacing: 1.5, marginBottom: 7 }, sectionTitle: { color: '#14243D', fontSize: 21, fontWeight: '700', letterSpacing: -0.6 }, categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 12 }, category: { paddingVertical: 16, paddingHorizontal: 10, alignItems: 'center', gap: 12, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6ECF4' }, categoryImage: { flexShrink: 0, borderRadius: 12 }, categoryLabel: { fontSize: 12, lineHeight: 18, color: '#3E506B', fontWeight: '600', textAlign: 'center' },
  compactCategory: { paddingHorizontal: 5, paddingVertical: 10, gap: 8, borderRadius: 14, shadowColor: '#203B62', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  compactCategoryLabel: { fontSize: 10, lineHeight: 14, color: '#334763' },
  caption: { width: '100%', minHeight: 36, justifyContent: 'center', alignItems: 'center' },
  mainCaption: { width: '100%', minHeight: 36, justifyContent: 'center', alignItems: 'center' },
  compactMainCategory: { paddingHorizontal: 6, paddingVertical: 14, gap: 8, justifyContent: 'flex-start' },
  compactMainLabel: { fontSize: 11, lineHeight: 15 },
  mainCategory: { minHeight: 184, justifyContent: 'center', paddingHorizontal: 8 },
  backButton: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#EBF2FF' },
  groupTitle: { color: '#243650', fontSize: 18, fontWeight: '700', marginTop: 8 },
  subcategoryIcon: { width: 72, height: 72, borderRadius: 12, backgroundColor: '#EBF2FF', alignItems: 'center', justifyContent: 'center' },
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
