import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../services/ThemeService';
import { SafeAreaView } from 'react-native-safe-area-context';

type DeliveryStackParamList = {
  Dashboard: undefined;
  Customers: undefined;
  CustomerDetails: { customerId: string };
};

type CustomersScreenNavigationProp = NativeStackNavigationProp<DeliveryStackParamList, 'Customers'>;

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
};

export default function CustomersScreen({ navigation }: { navigation: CustomersScreenNavigationProp }) {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const { colors } = useTheme();

  const fetchCustomers = async () => {
    try {
      // TODO: Implement actual API call to fetch customers
      // Mock data for now
      setCustomers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          address: '123 Main St, City',
          totalOrders: 5,
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+0987654321',
          address: '456 Oak Ave, Town',
          totalOrders: 3,
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={[styles.customerCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('CustomerDetails', { customerId: item.id })}
    >
      <View style={styles.customerHeader}>
        <Text style={[styles.customerName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.orderCount, { color: colors.primary }]}>
          {item.totalOrders} Orders
        </Text>
      </View>
      <Text style={[styles.customerEmail, { color: colors.text }]}>{item.email}</Text>
      <Text style={[styles.customerPhone, { color: colors.text }]}>{item.phone}</Text>
      <Text style={[styles.customerAddress, { color: colors.text }]}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Customers</Text>
      </View>

      <FlatList
        data={customers}
        renderItem={renderCustomerItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.customerList}
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  customerList: {
    padding: 16,
  },
  customerCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  customerEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 14,
  },
});
