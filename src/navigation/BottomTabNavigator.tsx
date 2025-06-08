/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../services/ThemeService';
import { Image } from 'react-native';

// Import delivery screens
import DashboardScreen from '../screens/delivery/DashboardScreen';
import OrdersScreen from '../screens/delivery/OrdersScreen';
import OrderDetailsScreen from '../screens/delivery/OrderDetailsScreen';
import DriversScreen from '../screens/delivery/DriversScreen';
import DriverDetailsScreen from '../screens/delivery/DriverDetailsScreen';
import CustomersScreen from '../screens/delivery/CustomersScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import icons
import settingIcon from '../assets/setting.png';
import customerIcon from '../assets/customer.png';
import deliveryIcon from '../assets/delivery.png';
import orderIcon from '../assets/order.png';

const Tab = createBottomTabNavigator();
const OrdersStack = createNativeStackNavigator();
const DriversStack = createNativeStackNavigator();
const CustomersStack = createNativeStackNavigator();

function OrdersStackNavigator() {
  return (
    <OrdersStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="OrdersList" component={OrdersScreen} />
      <OrdersStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    </OrdersStack.Navigator>
  );
}

function DriversStackNavigator() {
  return (
    <DriversStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <DriversStack.Screen name="DriversList" component={DriversScreen} />
      <DriversStack.Screen name="DriverDetails" component={DriverDetailsScreen} />
    </DriversStack.Navigator>
  );
}

function CustomersStackNavigator() {
  return (
    <CustomersStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <CustomersStack.Screen name="CustomersList" component={CustomersScreen} />
    </CustomersStack.Navigator>
  );
}

export default function BottomTabNavigator() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarIcon: ({ focused: _focused, color, size }) => {
          let iconSource;
          if (route.name === 'Dashboard') {iconSource = customerIcon;}
          else if (route.name === 'Orders') {iconSource = orderIcon;}
          else if (route.name === 'Drivers') {iconSource = deliveryIcon;}
          else if (route.name === 'Customers') {iconSource = customerIcon;}
          else if (route.name === 'Settings') {iconSource = settingIcon;}
          return (
            <Image
              source={iconSource}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStackNavigator}
        options={{ title: 'Orders' }}
      />
      <Tab.Screen
        name="Drivers"
        component={DriversStackNavigator}
        options={{ title: 'Drivers' }}
      />
      <Tab.Screen
        name="Customers"
        component={CustomersStackNavigator}
        options={{ title: 'Customers' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
