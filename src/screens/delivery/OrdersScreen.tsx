import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../services/ThemeService';
import { SafeAreaView } from 'react-native-safe-area-context';

type DeliveryStackParamList = {
  Dashboard: undefined;
  Orders: undefined;
  OrderDetails: { orderId: string };
};

type OrdersScreenNavigationProp = NativeStackNavigationProp<DeliveryStackParamList, 'Orders'>;

interface Order {
  id: string;
  customerName: string;
  address: string;
  status: 'pending' | 'pickup' | 'delivering' | 'delivered' | 'cancelled';
  items: string[];
  createdAt: string;
  assignedDriver?: string;
}

const statusColors = {
  pending: '#ff8418',
  pickup: '#0073d8',
  delivering: '#ff8418',
  delivered: '#0073d8',
  cancelled: '#ff8418',
};

const statusLabels = {
  pending: 'Pending',
  pickup: 'Ready for Pickup',
  delivering: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrdersScreen({ navigation }: { navigation: OrdersScreenNavigationProp }) {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const { colors } = useTheme();

  const fetchOrders = async () => {
    try {
      // TODO: Implement actual API call to fetch orders
      // const response = await deliveryService.getOrders();
      // setOrders(response.data);
      
      // Mock data for now
      setOrders([
        {
          id: '1',
          customerName: 'John Doe',
          address: '123 Main St, City',
          status: 'pending',
          items: ['Item 1', 'Item 2'],
          createdAt: '2024-03-20T10:00:00Z',
        },
        {
          id: '2',
          customerName: 'Jane Smith',
          address: '456 Oak Ave, Town',
          status: 'delivering',
          items: ['Item 3'],
          createdAt: '2024-03-20T09:30:00Z',
          assignedDriver: 'Driver 1',
        },
        // Add more mock orders as needed
      ]);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = selectedStatus
    ? orders.filter(order => order.status === selectedStatus)
    : orders;

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      // TODO: Implement actual API call to update order status
      // await deliveryService.updateOrderStatus(orderId, newStatus);
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleAssignDriver = async (orderId: string) => {
    // TODO: Implement driver assignment logic
    console.log('Assigning driver to order:', orderId);
    Alert.alert('Coming Soon', 'Driver assignment feature will be available soon');
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderId, { color: colors.text }]}>Order #{item.id}</Text>
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

      <Text style={[styles.customerName, { color: colors.text }]}>
        {item.customerName}
      </Text>
      <Text style={[styles.address, { color: colors.text }]}>{item.address}</Text>
      <Text style={[styles.items, { color: colors.text }]}>
        Items: {item.items.join(', ')}
      </Text>

      <View style={styles.orderActions}>
        {item.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#ff8418' }]}
              onPress={() => handleStatusChange(item.id, 'pickup')}
            >
              <Text style={styles.actionButtonText}>Mark Ready for Pickup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#ff8418' }]}
              onPress={() => handleStatusChange(item.id, 'cancelled')}
            >
              <Text style={styles.actionButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'pickup' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#ff8418' }]}
              onPress={() => handleAssignDriver(item.id)}
            >
              <Text style={styles.actionButtonText}>Assign Driver</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'delivering' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ff8418' }]}
            onPress={() => handleStatusChange(item.id, 'delivered')}
          >
            <Text style={styles.actionButtonText}>Mark as Delivered</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Orders</Text>
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                !selectedStatus && { backgroundColor: colors.primary },
              ]}
              onPress={() => setSelectedStatus(null)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedStatus && { color: '#fff' },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {Object.entries(statusLabels).map(([status, label]) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  selectedStatus === status && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedStatus === status && { color: '#fff' },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.orderList}
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderList: {
    padding: 16,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
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
  customerName: {
    fontSize: 16,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  items: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
}); 