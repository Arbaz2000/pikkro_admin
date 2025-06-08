import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, SafeAreaView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../services/ThemeService';

type DeliveryStackParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Drivers: undefined;
  Customers: undefined;
  Settings: undefined;
};

type DashboardScreenNavigationProp = NativeStackNavigationProp<DeliveryStackParamList, 'Dashboard'>;

interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.statTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
};

export default function DashboardScreen({ navigation }: { navigation: DashboardScreenNavigationProp }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [stats, setStats] = React.useState({
    totalOrders: 0,
    pendingPickups: 0,
    outForDelivery: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const { colors } = useTheme();

  const fetchStats = async () => {
    try {
      // TODO: Implement actual API call to fetch stats
      // const response = await deliveryService.getStats();
      // setStats(response.data);
      
      // Mock data for now
      setStats({
        totalOrders: 156,
        pendingPickups: 23,
        outForDelivery: 45,
        deliveredOrders: 85,
        cancelledOrders: 3,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    fetchStats();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.header}>
          <Text style={[styles.title, {color: colors.text}]}>Dashboard</Text>
          <Text style={[styles.subtitle, {color: colors.text}]}>
            Real-time delivery operations overview
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Total Orders Today"
            value={stats.totalOrders}
            color="#ff8418"
          />
          <StatCard
            title="Pending Pickups"
            value={stats.pendingPickups}
            color="#0073d8"
          />
          <StatCard
            title="Out for Delivery"
            value={stats.outForDelivery}
            color="#ff8418"
          />
          <StatCard
            title="Delivered Orders"
            value={stats.deliveredOrders}
            color="#0073d8"
          />
          <StatCard
            title="Cancelled Orders"
            value={stats.cancelledOrders}
            color="#ff8418"
          />
        </View>

        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <View
              style={[styles.actionButton, {backgroundColor: colors.card}]}
              onTouchEnd={() => navigation.navigate('Orders')}>
              <Text style={[styles.actionButtonText, {color: colors.text}]}>
                View Orders
              </Text>
            </View>
            <View
              style={[styles.actionButton, {backgroundColor: colors.card}]}
              onTouchEnd={() => navigation.navigate('Drivers')}>
              <Text style={[styles.actionButtonText, {color: colors.text}]}>
                Manage Drivers
              </Text>
            </View>
            <View
              style={[styles.actionButton, {backgroundColor: colors.card}]}
              onTouchEnd={() => navigation.navigate('Customers')}>
              <Text style={[styles.actionButtonText, {color: colors.text}]}>
                View Customers
              </Text>
            </View>
          </View>
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButtons: {
    gap: 10,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 