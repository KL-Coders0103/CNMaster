import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, CalendarDays, BookOpenText, BarChart3, User } from 'lucide-react-native';

import { useTheme } from '../theme/ThemeProvider';

import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { PlannerScreen } from '../screens/planner/PlannerScreen';
import { NotesScreen } from '../screens/notes/NotesScreen';
import { AnalyticsScreen } from '../screens/analytics/AnalyticsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardScreen} 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} strokeWidth={2.5} />
        }}
      />
      
      <Tab.Screen 
        name="PlannerTab" 
        component={PlannerScreen} 
        options={{
          title: 'Planner',
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} strokeWidth={2.5} />
        }}
      />

      <Tab.Screen 
        name="NotesTab" 
        component={NotesScreen} 
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, size }) => <BookOpenText color={color} size={size} strokeWidth={2.5} />
        }}
      />

      <Tab.Screen 
        name="AnalyticsTab" 
        component={AnalyticsScreen} 
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} strokeWidth={2.5} />
        }}
      />

      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={2.5} />
        }}
      />
    </Tab.Navigator>
  );
};