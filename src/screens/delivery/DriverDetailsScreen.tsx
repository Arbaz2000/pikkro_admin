import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useTheme } from '../../services/ThemeService';
import { SafeAreaView } from 'react-native-safe-area-context';

type DeliveryStackParamList = {
  Drivers: undefined;
  DriverDetails: { driverId: string };
};

type DriverDetailsScreenRouteProp = RouteProp<DeliveryStackParamList, 'DriverDetails'>;

interface DriverDetails {
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
  totalEarnings: number;
  joinedDate: string;
  vehicleInfo: {
    type: string;
    model: string;
    plateNumber: string;
  };
  documents: {
    id: string;
    type: string;
    status: 'verified' | 'pending' | 'expired';
    expiryDate?: string;
  }[];
  recentDeliveries: {
    id: string;
    customerName: string;
    address: string;
    status: 'completed' | 'failed' | 'cancelled';
    completedAt: string;
  }[];
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

const documentStatusColors = {
  verified: '#ff8418',
  pending: '#ff8418',
  expired: '#ff8418',
};

const documentStatusLabels = {
  verified: 'Verified',
  pending: 'Pending',
  expired: 'Expired',
};

export default function DriverDetailsScreen({
  route,
}: {
  route: DriverDetailsScreenRouteProp;
}) {
  const [driverDetails, setDriverDetails] = React.useState<DriverDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { colors } = useTheme();

  const fetchDriverDetails = React.useCallback(async () => {
    try {
      // TODO: Implement actual API call to fetch driver details
      // const response = await deliveryService.getDriverDetails(route.params.driverId);
      // setDriverDetails(response.data);
      
      // Mock data for now
      setDriverDetails({
        id: route.params.driverId,
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
        totalEarnings: 12500.50,
        joinedDate: '2023-01-15',
        vehicleInfo: {
          type: 'Motorcycle',
          model: 'Honda CB500F',
          plateNumber: 'ABC123',
        },
        documents: [
          {
            id: '1',
            type: 'Driver\'s License',
            status: 'verified',
            expiryDate: '2025-12-31',
          },
          {
            id: '2',
            type: 'Vehicle Registration',
            status: 'verified',
            expiryDate: '2024-12-31',
          },
          {
            id: '3',
            type: 'Insurance',
            status: 'pending',
          },
        ],
        recentDeliveries: [
          {
            id: '1',
            customerName: 'Alice Johnson',
            address: '123 Main St',
            status: 'completed',
            completedAt: '2024-03-20T15:30:00Z',
          },
          {
            id: '2',
            customerName: 'Bob Wilson',
            address: '456 Oak Ave',
            status: 'completed',
            completedAt: '2024-03-20T14:15:00Z',
          },
        ],
      });
    } catch (error) {
      console.error('Failed to fetch driver details:', error);
      Alert.alert('Error', 'Failed to load driver details');
    } finally {
      setLoading(false);
    }
  }, [route.params.driverId]);

  React.useEffect(() => {
    fetchDriverDetails();
  }, [fetchDriverDetails]);

  if (loading || !driverDetails) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{driverDetails.name}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[driverDetails.status] + '20' },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColors[driverDetails.status] }]}>
              {statusLabels[driverDetails.status]}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
          <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
          <Text style={[styles.value, { color: colors.text }]}>{driverDetails.phone}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <Text style={[styles.value, { color: colors.text }]}>{driverDetails.email}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {driverDetails.completedOrders}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Orders</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {driverDetails.successRate}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Success</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {driverDetails.averageDeliveryTime}m
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Avg. Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {driverDetails.rating}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Rating</Text>
            </View>
          </View>
          <View style={styles.earningsRow}>
            <Text style={[styles.label, { color: colors.text }]}>Total Earnings</Text>
            <Text style={[styles.earningsValue, { color: colors.text }]}>
              ${driverDetails.totalEarnings.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Vehicle Information</Text>
          <Text style={[styles.label, { color: colors.text }]}>Type</Text>
          <Text style={[styles.value, { color: colors.text }]}>{driverDetails.vehicleInfo.type}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Model</Text>
          <Text style={[styles.value, { color: colors.text }]}>{driverDetails.vehicleInfo.model}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Plate Number</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {driverDetails.vehicleInfo.plateNumber}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Documents</Text>
          {driverDetails.documents.map(doc => (
            <View key={doc.id} style={styles.documentItem}>
              <View>
                <Text style={[styles.documentType, { color: colors.text }]}>{doc.type}</Text>
                {doc.expiryDate && (
                  <Text style={[styles.expiryDate, { color: colors.text }]}>
                    Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.documentStatus,
                  { backgroundColor: documentStatusColors[doc.status] + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.documentStatusText,
                    { color: documentStatusColors[doc.status] },
                  ]}
                >
                  {documentStatusLabels[doc.status]}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Deliveries</Text>
          {driverDetails.recentDeliveries.map(delivery => (
            <View key={delivery.id} style={styles.deliveryItem}>
              <View>
                <Text style={[styles.customerName, { color: colors.text }]}>
                  {delivery.customerName}
                </Text>
                <Text style={[styles.deliveryAddress, { color: colors.text }]}>
                  {delivery.address}
                </Text>
                <Text style={[styles.deliveryTime, { color: colors.text }]}>
                  {new Date(delivery.completedAt).toLocaleString()}
                </Text>
              </View>
              <View
                style={[
                  styles.deliveryStatus,
                  { backgroundColor: delivery.status === 'completed' ? '#0073d820' : '#ff841820' },
                ]}
              >
                <Text
                  style={[
                    styles.deliveryStatusText,
                    { color: delivery.status === 'completed' ? '#0073d8' : '#ff8418' },
                  ]}
                >
                  {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {driverDetails.currentLocation && (
          <TouchableOpacity
            style={[styles.trackButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              // TODO: Implement live tracking
              Alert.alert('Coming Soon', 'Live tracking feature will be available soon');
            }}
          >
            <Text style={styles.trackButtonText}>Track Current Location</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  earningsValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentType: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 14,
    opacity: 0.8,
  },
  documentStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  documentStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deliveryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  deliveryStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  deliveryStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trackButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
}); 