import { Tabs } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {

  return (
        <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="fullPaid"
        options={{
          title: 'Full Paid',
          tabBarIcon: ({ color }) => <Ionicons name="checkmark-circle" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
