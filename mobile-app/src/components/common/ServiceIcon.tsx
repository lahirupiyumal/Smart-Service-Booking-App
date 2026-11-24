import { View, type ColorValue } from 'react-native';

export type IconName = 'home' | 'search' | 'calendar' | 'heart' | 'user' | 'bell' | 'clean' | 'ac' | 'bolt' | 'plumbing' | 'paint' | 'garden' | 'arrow' | 'check';

/** Small, consistent line icons rendered with native views on every platform. */
export function ServiceIcon({ name, size = 24, color = '#2563EB' }: { name: IconName; size?: number; color?: ColorValue }) {
  const line = (x: number, y: number, width: number, rotation = 0) => <View style={{ position: 'absolute', left: x, top: y, width, height: 1.8, borderRadius: 2, backgroundColor: color, transform: [{ rotate: `${rotation}deg` }] }} />;
  const box = (x: number, y: number, width: number, height: number, radius = 2) => <View style={{ position: 'absolute', left: x, top: y, width, height, borderRadius: radius, borderWidth: 1.8, borderColor: color }} />;
  let shape;
  switch (name) {
    case 'home': shape = <>{line(2, 7, 12, -40)}{line(10, 7, 12, 40)}{box(5, 9, 14, 12)}{box(10, 15, 4, 6)}</>; break;
    case 'search': shape = <>{box(3, 3, 14, 14, 9)}{line(15, 18, 8, 45)}</>; break;
    case 'calendar': shape = <>{box(3, 5, 18, 16, 3)}{line(4, 10, 16)}{line(5, 4, 6, 90)}{line(13, 4, 6, 90)}{box(8, 14, 3, 3, 0)}</>; break;
    case 'user': shape = <>{box(8, 2, 8, 8, 5)}{box(4, 13, 16, 10, 8)}</>; break;
    case 'heart': shape = <>{box(3, 4, 10, 13, 7)}{box(11, 4, 10, 13, 7)}{line(5, 17, 9, 40)}{line(11, 17, 9, -40)}</>; break;
    case 'bell': shape = <>{box(6, 4, 12, 14, 7)}{line(4, 18, 16)}{line(10, 22, 4)}</>; break;
    case 'clean': shape = <>{line(7, 8, 18, -55)}{box(3, 12, 10, 8, 2)}{line(5, 16, 6, 90)}{line(15, 4, 7)}{line(17, 4, 7, 90)}</>; break;
    case 'ac': shape = <>{box(2, 4, 20, 11, 3)}{line(5, 11, 14)}{line(6, 19, 5, 90)}{line(13, 19, 5, 90)}{line(16, 7, 3)}</>; break;
    case 'bolt': shape = <>{line(5, 7, 13, -55)}{line(4, 12, 14)}{line(7, 18, 13, -55)}</>; break;
    case 'plumbing': shape = <>{box(3, 4, 6, 11)}{box(3, 13, 17, 6)}{box(15, 13, 6, 9)}{line(1, 5, 10)}{line(14, 22, 9)}</>; break;
    case 'paint': shape = <>{box(2, 3, 17, 8, 2)}{line(19, 9, 6, 90)}{line(12, 13, 10)}{box(10, 14, 4, 9)}</>; break;
    case 'garden': shape = <>{box(3, 3, 10, 14, 8)}{box(12, 5, 9, 12, 7)}{line(4, 15, 16, 90)}{line(7, 21, 10)}</>; break;
    case 'check': shape = <>{line(4, 13, 7, 45)}{line(8, 11, 14, -45)}</>; break;
    default: shape = <>{line(3, 12, 17)}{line(13, 9, 8, 40)}{line(13, 15, 8, -40)}</>;
  }
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: size, height: size }}><View style={{ width: 24, height: 24, transform: [{ scale: size / 24 }], transformOrigin: 'top left' }}>{shape}</View></View>;
}
