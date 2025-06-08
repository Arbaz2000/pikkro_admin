import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useTheme } from '../../services/ThemeService';
import { SafeAreaView } from 'react-native-safe-area-context';

type DeliveryStackParamList = {
  Orders: undefined;
  OrderDetails: { orderId: string };
};

type OrderDetailsScreenRouteProp = RouteProp<DeliveryStackParamList, 'OrderDetails'>;

interface OrderDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  status: 'pending' | 'pickup' | 'delivering' | 'delivered' | 'cancelled';
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  createdAt: string;
  assignedDriver?: {
    id: string;
    name: string;
    phone: string;
  };
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryNotes?: string;
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

const paymentStatusColors = {
  pending: '#ff8418',
  paid: '#0073d8',
  failed: '#ff8418',
};

const paymentStatusLabels = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
};

export default function OrderDetailsScreen({
  route,
}: {
  route: OrderDetailsScreenRouteProp;
}) {
  const [orderDetails, setOrderDetails] = React.useState<OrderDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { colors } = useTheme();

  const fetchOrderDetails = React.useCallback(async () => {
    try {
      // TODO: Implement actual API call to fetch order details
      // const response = await deliveryService.getOrderDetails(route.params.orderId);
      // setOrderDetails(response.data);
      
      // Mock data for now
      setOrderDetails({
        id: route.params.orderId,
        customerName: 'John Doe',
        customerPhone: '+1 234 567 8900',
        customerEmail: 'john.doe@example.com',
        address: '123 Main St, City, State 12345',
        status: 'pending',
        items: [
          { id: '1', name: 'Item 1', quantity: 2, price: 29.99 },
          { id: '2', name: 'Item 2', quantity: 1, price: 49.99 },
        ],
        createdAt: '2024-03-20T10:00:00Z',
        totalAmount: 109.97,
        paymentStatus: 'pending',
        deliveryNotes: 'Please deliver to the front door',
      });
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [route.params.orderId]);

  React.useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  if (loading || !orderDetails) {
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

  const handleStatusUpdate = (newStatus: OrderDetails['status']) => {
    // TODO: Implement status update
    console.log('Updating order status:', newStatus);
    Alert.alert('Coming Soon', 'Status update feature will be available soon');
  };

  const handleOrderCancellation = () => {
    // TODO: Implement order cancellation
    console.log('Cancelling order:', orderDetails.id);
    Alert.alert('Coming Soon', 'Order cancellation feature will be available soon');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Order #{orderDetails.id}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[orderDetails.status] + '20' },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColors[orderDetails.status] }]}>
              {statusLabels[orderDetails.status]}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Customer Information</Text>
          <Text style={[styles.label, { color: colors.text }]}>Name</Text>
          <Text style={[styles.value, { color: colors.text }]}>{orderDetails.customerName}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
          <Text style={[styles.value, { color: colors.text }]}>{orderDetails.customerPhone}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <Text style={[styles.value, { color: colors.text }]}>{orderDetails.customerEmail}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Delivery Address</Text>
          <Text style={[styles.value, { color: colors.text }]}>{orderDetails.address}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Items</Text>
          {orderDetails.items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.itemQuantity, { color: colors.text }]}>
                  Quantity: {item.quantity}
                </Text>
              </View>
              <Text style={[styles.itemPrice, { color: colors.text }]}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              ${orderDetails.totalAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.paymentStatus}>
            <Text style={[styles.label, { color: colors.text }]}>Payment Status</Text>
            <View
              style={[
                styles.paymentBadge,
                { backgroundColor: paymentStatusColors[orderDetails.paymentStatus] + '20' },
              ]}
            >
              <Text
                style={[
                  styles.paymentStatusText,
                  { color: paymentStatusColors[orderDetails.paymentStatus] },
                ]}
              >
                {paymentStatusLabels[orderDetails.paymentStatus]}
              </Text>
            </View>
          </View>
        </View>

        {orderDetails.deliveryNotes && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Notes</Text>
            <Text style={[styles.notes, { color: colors.text }]}>{orderDetails.deliveryNotes}</Text>
          </View>
        )}

        {orderDetails.assignedDriver && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Assigned Driver</Text>
            <Text style={[styles.label, { color: colors.text }]}>Name</Text>
            <Text style={[styles.value, { color: colors.text }]}>{orderDetails.assignedDriver.name}</Text>
            <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
            <Text style={[styles.value, { color: colors.text }]}>{orderDetails.assignedDriver.phone}</Text>
          </View>
        )}

        <View style={styles.actions}>
          {orderDetails.status === 'pending' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#ff8418' }]}
                onPress={() => handleStatusUpdate('pickup')}
              >
                <Text style={styles.actionButtonText}>Mark Ready for Pickup</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#ff8418' }]}
                onPress={handleOrderCancellation}
              >
                <Text style={styles.actionButtonText}>Cancel Order</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 14,
    opacity: 0.8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentStatus: {
    marginTop: 16,
  },
  paymentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  paymentStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
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