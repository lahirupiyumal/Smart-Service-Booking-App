import { styles } from '../styles/HomeScreen.styles';
import { useState } from 'react';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServiceIcon } from '@/components/common/ServiceIcon';

import { serviceCategories } from '@/features/services/data/categories';
import { agriculturalCrops, type AgriculturalCropId } from '@/features/services/data/agriculturalCrops';

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
  const cropCardWidth = Math.floor((contentWidth - cardGap * 3) / 4);
  const cropImageSize = Math.min(88, Math.max(24, cropCardWidth - (compact ? 12 : 24)));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<AgriculturalCropId | null>(null);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchTerm = query.trim().toLowerCase();
  const activeCategory = serviceCategories.find(category => category.id === selectedCategory);
  const activeCrop = agriculturalCrops.find(crop => crop.id === selectedCrop);
  const choosingCrop = activeCategory?.id === 'agricultural' && !activeCrop && !searchTerm;
  const groups = (searchTerm ? serviceCategories : activeCategory && !choosingCrop ? [activeCategory] : []).map(category => ({
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
        <View style={styles.section}><View style={styles.sectionHeading}><View><Text style={styles.kicker}>FIND YOUR SERVICE</Text><Text style={styles.sectionTitle}>{searchTerm ? 'Search results' : activeCategory ? activeCrop && activeCategory.id === 'agricultural' ? `${activeCategory.name} · ${activeCrop.name}` : activeCategory.name : 'What can we help with?'}</Text></View></View>
          {(activeCategory || searchTerm) && <Pressable accessibilityRole="button" onPress={() => { if (activeCrop && !searchTerm) setSelectedCrop(null); else { setSelectedCategory(null); setSelectedCrop(null); } setQuery(''); }} style={styles.backButton}><Text style={styles.resetText}>{activeCrop && !searchTerm ? '←  Vee & Tea' : '←  All categories'}</Text></Pressable>}
          {!activeCategory && !searchTerm && <View style={[styles.categoryGrid, { gap: mainGap }]}>{serviceCategories.map(category => <Pressable key={category.id} accessibilityRole="button" accessibilityLabel={`View ${category.name} subcategories`} onPress={() => { setSelectedCategory(category.id); setSelectedCrop(null); }} style={({ pressed, hovered }) => [styles.category, styles.mainCategory, compact && styles.compactMainCategory, { width: mainCardWidth, minHeight: mainImageSize + (compact ? captionHeight + 34 : 88) }, hovered && styles.iconButtonHovered, pressed && styles.pressed]}>
            <Image source={category.image} style={[styles.categoryImage, { width: mainImageSize, height: mainImageSize }]} resizeMode="contain" accessible={false} />
            <View style={[styles.mainCaption, compact && { minHeight: captionHeight }]}><Text style={[styles.categoryLabel, compact && styles.compactMainLabel]}>{category.name}</Text></View>
          </Pressable>)}</View>}
          {choosingCrop && <View style={styles.section}>
            <Text style={styles.groupTitle}>Choose your crop</Text>
            <View style={[styles.categoryGrid, { gap: cardGap }]}>{agriculturalCrops.map(crop => <Pressable key={crop.id} accessibilityRole="button" accessibilityLabel={`View ${crop.name} agricultural services`} onPress={() => setSelectedCrop(crop.id)} style={({ pressed, hovered }) => [styles.category, compact && styles.compactCategory, { width: cropCardWidth, minHeight: cropImageSize + (compact ? 44 : 62) }, hovered && styles.iconButtonHovered, pressed && styles.pressed]}>
              <Image source={crop.image} style={[styles.categoryImage, { width: cropImageSize, height: cropImageSize }]} resizeMode="contain" accessible={false} />
              <Text style={[styles.categoryLabel, compact && styles.compactCategoryLabel]}>{crop.name}</Text>
            </Pressable>)}</View>
          </View>}
          {groups.map(category => <View key={category.id} style={styles.section}>
            <Text style={styles.groupTitle}>{category.id === 'agricultural' && activeCrop ? `${activeCrop.name} services` : category.name}</Text>
            <View style={[styles.categoryGrid, { gap: cardGap }]}>{category.subcategories.map(subcategory => <Pressable key={subcategory.name} accessibilityRole="button" accessibilityLabel={`Book ${subcategory.name}`} onPress={() => router.push({ pathname: '/booking/create', params: { mainCategory: category.name, category: subcategory.name, ...(category.id === 'agricultural' && activeCrop ? { crop: activeCrop.id } : {}) } })} style={({ pressed, hovered }) => [styles.category, compact && styles.compactCategory, { width: cardWidth, minHeight: compact ? compactCardHeight : 152 }, hovered && styles.iconButtonHovered, pressed && styles.pressed]}>
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

