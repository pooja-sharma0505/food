import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SavorColors, SavorShadow, TAB_BAR_HEIGHT } from '../../constants/savorTheme';
import { CART_ITEMS } from '../../data/mockData';

function TabIcon({ name, focused, color }) {
  return <Ionicons name={name} size={22} color={focused ? SavorColors.orange : color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: SavorColors.orange,
        tabBarInactiveTintColor: '#9A8F88',
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'compass' : 'compass-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => {
            const isActive = focused || CART_ITEMS.length > 0;
            return (
              <View style={[styles.cartFab, isActive && styles.cartFabActive]}>
                <Ionicons name="cart" size={24} color="#fff" />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'notifications' : 'notifications-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: Platform.OS === 'ios' ? 20 : 12,
    height: TAB_BAR_HEIGHT,
    backgroundColor: SavorColors.brownTab,
    borderRadius: 28,
    borderTopWidth: 0,
    paddingTop: 8,
    ...SavorShadow.tab,
  },
  label: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 11,
    marginTop: 2,
  },
  item: { paddingTop: 4 },
  cartFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3E332A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3E332A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  cartFabActive: {
    backgroundColor: SavorColors.orange,
    shadowColor: SavorColors.orange,
  },
});
