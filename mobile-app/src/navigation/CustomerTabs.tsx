import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ServiceIcon, type IconName } from '@/components/common/ServiceIcon';

const tabs: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'explore', title: 'Explore', icon: 'search' },
  { name: 'bookings', title: 'Bookings', icon: 'calendar' },
  { name: 'favorites', title: 'Favorites', icon: 'heart' },
  { name: 'profile', title: 'Profile', icon: 'user' },
];

function NavigationBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 640;
  return <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, 12) }]}>
    <View style={[styles.bar, !wide && styles.mobileBar]}>
      {state.routes.map((route, index) => {
        const tab = tabs.find(item => item.name === route.name);
        if (!tab) return null;
        const focused = state.index === index;
        const options = descriptors[route.key].options;
        const color = focused ? '#FFFFFF' : '#72819A';
        return <Pressable key={route.key}
          accessibilityRole={Platform.OS === 'web' ? 'tab' : 'button'}
          accessibilityState={{ selected: focused }}
          accessibilityLabel={options.tabBarAccessibilityLabel ?? tab.title}
          testID={options.tabBarButtonTestID}
          onPress={() => {
            const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigateToTab(route.key);
          }}
          onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
          style={({ pressed, hovered }) => [styles.item, !wide && styles.mobileItem, hovered && !focused && styles.hovered, focused && styles.activeItem, pressed && styles.pressed]}>
          <ServiceIcon name={tab.icon} color={color} size={wide ? 21 : 20} />
          <Text numberOfLines={1} style={[styles.label, !wide && styles.mobileLabel, focused && styles.activeLabel]}>{tab.title}</Text>
        </Pressable>;
      })}
    </View>
  </View>;
}

export default function Layout() {
  return <Tabs tabBar={props => <NavigationBar {...props} />} screenOptions={{ headerShown: false }}>
    {tabs.map(tab => <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title }} />)}
  </Tabs>;
}

const styles = StyleSheet.create({
  dock: { backgroundColor: '#F7F9FC', paddingTop: 10, paddingHorizontal: 16 },
  bar: { width: '100%', maxWidth: 780, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 7, padding: 7, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF5', borderRadius: 21, shadowColor: '#17345C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 4 },
  mobileBar: { gap: 3, padding: 5, borderRadius: 20 },
  item: { flex: 1, minWidth: 0, minHeight: 49, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 8, paddingVertical: 12 },
  mobileItem: { flexDirection: 'column', gap: 6, minHeight: 58, paddingHorizontal: 2, paddingVertical: 9 },
  activeItem: { backgroundColor: '#2563EB', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 2 },
  hovered: { backgroundColor: '#F0F5FD' },
  pressed: { opacity: 0.78 },
  label: { fontSize: 12, fontWeight: '600', color: '#72819A' },
  mobileLabel: { fontSize: 9, letterSpacing: 0.1 },
  activeLabel: { color: '#FFFFFF', fontWeight: '700' },
});
