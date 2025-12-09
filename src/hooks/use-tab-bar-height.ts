import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Custom hook to calculate the dynamic tab bar height based on safe area insets.
 * 
 * This ensures the tab bar properly accounts for device-specific bottom insets
 * (e.g., home indicator on iOS, gesture navigation on Android).
 * 
 * @returns The calculated tab bar height in pixels
 * 
 * @example
 * ```tsx
 * const tabBarHeight = useTabBarHeight();
 * const bottomPadding = tabBarHeight + 64; // Add extra spacing as needed
 * ```
 */
export function useTabBarHeight() {
    const insets = useSafeAreaInsets();

    // Tab bar composition:
    // - Content height: 56px (icon + label)
    // - Top padding: 8px
    // - Bottom padding: max(8px, safe area inset)
    const TAB_BAR_CONTENT_HEIGHT = 56;
    const TAB_BAR_TOP_PADDING = 8;
    const TAB_BAR_MIN_BOTTOM_PADDING = 8;

    return TAB_BAR_CONTENT_HEIGHT + TAB_BAR_TOP_PADDING + Math.max(TAB_BAR_MIN_BOTTOM_PADDING, insets.bottom);
}

/**
 * Custom hook to calculate the bottom padding for scrollable content in tab screens.
 * 
 * This ensures content doesn't get hidden behind the tab bar and provides
 * appropriate spacing at the bottom of the scroll view.
 * 
 * @param extraSpacing - Additional spacing to add below the tab bar (default: 64)
 * @returns The calculated bottom padding in pixels
 * 
 * @example
 * ```tsx
 * const bottomPadding = useTabScreenBottomPadding(80);
 * 
 * <ScrollView contentContainerStyle={{ paddingBottom: bottomPadding }}>
 *   {content}
 * </ScrollView>
 * ```
 */
export function useTabScreenBottomPadding(extraSpacing: number = 64) {
    const tabBarHeight = useTabBarHeight();
    return tabBarHeight + extraSpacing;
}
