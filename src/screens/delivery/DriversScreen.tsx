import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../services/ThemeService';
import { SafeAreaView } from 'react-native-safe-area-context';

type DeliveryStackParamList = {
  Dashboard: undefined;
  Drivers: undefined;
  DriverDetails: { driverId: string };
};

type DriversScreenNavigationProp = NativeStackNavigationProp<DeliveryStackParamList, 'Drivers'>;

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'on_delivery';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  completedOrders: number;
  successRate: number;
  averageDeliveryTime: number;
  rating: number;
}

const statusColors = {
  active: '#ff8418',
  inactive: '#ff8418',
  on_delivery: '#0073d8',
};

const statusLabels = {
  active: 'Available',
  inactive: 'Offline',
  on_delivery: 'On Delivery',
};

export default function DriversScreen({ navigation }: { navigation: DriversScreenNavigationProp }) {
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const { colors } = useTheme();

  const fetchDrivers = async () => {
    try {
      // TODO: Implement actual API call to fetch drivers
      // const response = await deliveryService.getDrivers();
      // setDrivers(response.data);
      
      // Mock data for now
      setDrivers([
        {
          id: '1',
          name: 'John Smith',
          phone: '+1 234 567 8901',
          email: 'john.smith@example.com',
          status: 'active',
          currentLocation: {
            latitude: 37.7749,
            longitude: -122.4194,
          },
          completedOrders: 156,
          successRate: 98.5,
          averageDeliveryTime: 25,
          rating: 4.8,
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          phone: '+1 234 567 8902',
          email: 'sarah.johnson@example.com',
          status: 'on_delivery',
          currentLocation: {
            latitude: 37.7833,
            longitude: -122.4167,
          },
          completedOrders: 89,
          successRate: 97.2,
          averageDeliveryTime: 28,
          rating: 4.6,
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
      Alert.alert('Error', 'Failed to load drivers');
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchDrivers();
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAddDriver = () => {
    // TODO: Implement add driver functionality
    Alert.alert('Coming Soon', 'Add driver feature will be available soon');
  };

  const renderDriverItem = ({ item }: { item: Driver }) => (
    <TouchableOpacity
      style={[styles.driverCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('DriverDetails', { driverId: item.id })}
    >
      <View style={styles.driverHeader}>
        <View>
          <Text style={[styles.driverName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.driverPhone, { color: colors.text }]}>{item.phone}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[item.status] + '20' },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
            {statusLabels[item.status]}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.completedOrders}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Orders</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.successRate}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Success</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.averageDeliveryTime}m
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Avg. Time</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.rating}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Rating</Text>
        </View>
      </View>

      {item.currentLocation && (
        <TouchableOpacity
          style={[styles.trackButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            // TODO: Implement live tracking
            Alert.alert('Coming Soon', 'Live tracking feature will be available soon');
          }}
        >
          <Text style={styles.trackButtonText}>Track Location</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Drivers</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddDriver}
        >
          <Text style={styles.addButtonText}>Add Driver</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={drivers}
        renderItem={renderDriverItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.driverList}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  driverList: {
    padding: 16,
  },
  driverCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  driverPhone: {
    fontSize: 14,
    opacity: 0.8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  trackButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 