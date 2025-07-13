import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, TextInput, Modal } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../services/ThemeService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { orderService, type Order } from '../../services/OrderService';

type DeliveryStackParamList = {
  Dashboard: undefined;
  Orders: undefined;
  OrderDetails: { orderId: string };
};

type OrdersScreenNavigationProp = NativeStackNavigationProp<DeliveryStackParamList, 'Orders'>;



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
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterModalVisible, setFilterModalVisible] = React.useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = React.useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = React.useState<string | null>(null);
  const { colors } = useTheme();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orders = await orderService.getOrders();
      setOrders(orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      Alert.alert('Error', 'Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
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

  const filteredOrders = React.useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.customerName.toLowerCase().includes(query) ||
        order.address.toLowerCase().includes(query) ||
        order.items[0].toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
      );
    }

    // Filter by payment type
    if (selectedPaymentType) {
      filtered = filtered.filter(order => order.paymentType === selectedPaymentType);
    }

    // Filter by date range (simplified - you can enhance this)
    if (selectedDateRange) {
      const today = new Date();
      
      switch (selectedDateRange) {
        case 'today':
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === today.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= weekAgo;
          });
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= monthAgo;
          });
          break;
      }
    }

    return filtered;
  }, [orders, selectedStatus, searchQuery, selectedPaymentType, selectedDateRange]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Orders</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      
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
    try {
      // For now, we'll use a mock driver ID
      await orderService.assignDriver(orderId, 'mock-driver-id');
      Alert.alert('Success', 'Driver assigned successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to assign driver');
    }
  };

  const clearFilters = () => {
    setSelectedStatus(null);
    setSelectedPaymentType(null);
    setSelectedDateRange(null);
    setSearchQuery('');
  };

  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filter Orders</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text style={[styles.closeButton, { color: colors.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Status</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    !selectedStatus && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setSelectedStatus(null)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
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
                      styles.filterOption,
                      selectedStatus === status && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setSelectedStatus(status)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedStatus === status && { color: '#fff' },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Payment Type</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    !selectedPaymentType && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setSelectedPaymentType(null)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      !selectedPaymentType && { color: '#fff' },
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {['cash', 'cash on delivery', 'cash on pickup', 'online payment', 'online'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      selectedPaymentType === type && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setSelectedPaymentType(type)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedPaymentType === type && { color: '#fff' },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Date Range</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    !selectedDateRange && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setSelectedDateRange(null)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      !selectedDateRange && { color: '#fff' },
                    ]}
                  >
                    All Time
                  </Text>
                </TouchableOpacity>
                {[
                  { key: 'today', label: 'Today' },
                  { key: 'week', label: 'This Week' },
                  { key: 'month', label: 'This Month' },
                ].map(({ key, label }) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.filterOption,
                      selectedDateRange === key && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setSelectedDateRange(key)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedDateRange === key && { color: '#fff' },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#ff8418' }]}
              onPress={clearFilters}
            >
              <Text style={styles.modalButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
        Item: {item.items[0]} • {item.weight}
      </Text>
      <Text style={[styles.price, { color: colors.text }]}>
        Price: ${item.price || 'N/A'} • {item.paymentType}
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
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors.card }]}>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search orders..."
              placeholderTextColor={colors.text + '80'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <Text style={[styles.clearSearchButtonText, { color: colors.text }]}>✕</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Text style={[styles.filterButtonText, { color: colors.text }]}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Filters Display */}
        {(selectedStatus || selectedPaymentType || selectedDateRange) && (
          <View style={styles.activeFiltersContainer}>
            <Text style={[styles.activeFiltersTitle, { color: colors.text }]}>Active Filters:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedStatus && (
                <View style={[styles.activeFilterChip, { backgroundColor: colors.primary }]}>
                  <Text style={styles.activeFilterChipText}>
                    Status: {statusLabels[selectedStatus]}
                  </Text>
                </View>
              )}
              {selectedPaymentType && (
                <View style={[styles.activeFilterChip, { backgroundColor: colors.primary }]}>
                  <Text style={styles.activeFilterChipText}>
                    Payment: {selectedPaymentType}
                  </Text>
                </View>
              )}
              {selectedDateRange && (
                <View style={[styles.activeFilterChip, { backgroundColor: colors.primary }]}>
                  <Text style={styles.activeFilterChipText}>
                    Date: {selectedDateRange === 'today' ? 'Today' : 
                           selectedDateRange === 'week' ? 'This Week' : 'This Month'}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={[styles.clearFiltersButton, { backgroundColor: '#ff8418' }]}
                onPress={clearFilters}
              >
                <Text style={styles.clearFiltersButtonText}>Clear All</Text>
              </TouchableOpacity>
          </ScrollView>
        </View>
        )}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.orderList}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              {searchQuery || selectedStatus || selectedPaymentType || selectedDateRange
                ? 'No orders match your filters'
                : 'No orders found'}
            </Text>
          </View>
        }
      />

      {renderFilterModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    // paddingTop: 40,
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
    marginBottom: 8,
  },
  price: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  searchContainer: {
    // marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 12,
  },
  filterButton: {
    padding: 8,
  },
  filterButtonText: {
    fontSize: 20,
  },
  clearSearchButton: {
    padding: 8,
    marginRight: 4,
  },
  clearSearchButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeFiltersContainer: {
    marginBottom: 16,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  activeFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  clearFiltersButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 