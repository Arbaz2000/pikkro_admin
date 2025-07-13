import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTheme} from '../../services/ThemeService';
import {SafeAreaView} from 'react-native-safe-area-context';
import PartnerService, {
  PartnerRequestStatus,
} from '../../services/PartnerService';

type DeliveryStackParamList = {
  Dashboard: undefined;
  Drivers: undefined;
  DriverDetails: {driverId: string};
  PartnerRequest: undefined;
  PartnerRequestDetails: {partnerId: string};
};

type DriversScreenNavigationProp = NativeStackNavigationProp<
  DeliveryStackParamList,
  'Drivers'
>;

const statusColors = {
  pending: '#ff8418',
  approved: '#28a745',
  disapproved: '#dc3545',
};

const statusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  disapproved: 'Disapproved',
};

export default function DriversScreen({}: {
  navigation: DriversScreenNavigationProp;
}) {
  const [partnerRequests, setPartnerRequests] = React.useState<
    PartnerRequestStatus[]
  >([]);
  const [filteredRequests, setFilteredRequests] = React.useState<
    PartnerRequestStatus[]
  >([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [selectedPartner, setSelectedPartner] =
    React.useState<PartnerRequestStatus | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'name' | 'status' | 'date'>('name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const {colors} = useTheme();

  const fetchPartnerRequests = async () => {
    try {
      setLoading(true);
      const data = await PartnerService.getPartnerRequests();
      setPartnerRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error('Failed to fetch partner requests:', error);
      Alert.alert('Error', 'Failed to load partner requests');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchPartnerRequests();
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    fetchPartnerRequests();
  }, []);

  // Search and sort logic
  React.useEffect(() => {
    let filtered = [...partnerRequests];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        partner =>
          partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          partner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          partner.phone.includes(searchQuery) ||
          partner.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'date':
          // Assuming there's a createdAt field, if not, you can modify this
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredRequests(filtered);
  }, [partnerRequests, searchQuery, sortBy, sortOrder]);

  const handleApprove = async (partnerId: string) => {
    try {
      await PartnerService.approvePartnerRequest(partnerId);
      Alert.alert('Success', 'Partner request approved successfully');
      fetchPartnerRequests(); // Refresh the list
    } catch (error) {
      console.error('Failed to approve partner request:', error);
      Alert.alert('Error', 'Failed to approve partner request');
    }
  };

  const handleDisapprove = async (partnerId: string) => {
    try {
      await PartnerService.disapprovePartnerRequest(partnerId);
      Alert.alert('Success', 'Partner request disapproved successfully');
      fetchPartnerRequests(); // Refresh the list
    } catch (error) {
      console.error('Failed to disapprove partner request:', error);
      Alert.alert('Error', 'Failed to disapprove partner request');
    }
  };

  const handleDelete = async (partnerId: string) => {
    Alert.alert(
      'Delete Partner Request',
      'Are you sure you want to delete this partner request? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await PartnerService.deletePartnerRequest(partnerId);
              Alert.alert('Success', 'Partner request deleted successfully');
              fetchPartnerRequests(); // Refresh the list
            } catch (error) {
              console.error('Failed to delete partner request:', error);
              Alert.alert('Error', 'Failed to delete partner request');
            }
          },
        },
      ],
    );
  };

  const showPartnerDetails = (partner: PartnerRequestStatus) => {
    setSelectedPartner(partner);
    setShowModal(true);
  };

  const renderPartnerItem = ({item}: {item: PartnerRequestStatus}) => (
    <TouchableOpacity
      style={[styles.partnerCard, {backgroundColor: colors.card}]}
      onPress={() => showPartnerDetails(item)}>
      <View style={styles.partnerHeader}>
        <View style={styles.partnerInfo}>
          <Image
            source={{uri: item.documents.profilePicture}}
            style={styles.profileImage}
            defaultSource={require('../../assets/delivery.png')}
          />
          <View style={styles.partnerDetails}>
            <Text style={[styles.partnerName, {color: colors.text}]}>
              {item.name}
            </Text>
            <Text style={[styles.partnerEmail, {color: colors.text}]}>
              {item.email}
            </Text>
            <Text style={[styles.partnerPhone, {color: colors.text}]}>
              {item.phone}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: statusColors[item.status] + '20'},
          ]}>
          <Text style={[styles.statusText, {color: statusColors[item.status]}]}>
            {statusLabels[item.status]}
          </Text>
        </View>
      </View>

      <View style={styles.vehicleInfo}>
        <Text style={[styles.vehicleLabel, {color: colors.text}]}>
          Vehicle Details:
        </Text>
        <Text style={[styles.vehicleText, {color: colors.text}]}>
          {item.vehicleType} - {item.vehicleNumber}
        </Text>
      </View>

      <View style={styles.addressInfo}>
        <Text style={[styles.addressLabel, {color: colors.text}]}>
          Address:
        </Text>
        <Text
          style={[styles.addressText, {color: colors.text}]}
          numberOfLines={2}>
          {item.address}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        {item.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.approveButton, {backgroundColor: '#28a745'}]}
              onPress={() => handleApprove(item.id)}>
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.disapproveButton, {backgroundColor: '#dc3545'}]}
              onPress={() => handleDisapprove(item.id)}>
              <Text style={styles.buttonText}>Disapprove</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={[styles.deleteButton, {backgroundColor: '#6c757d'}]}
          onPress={() => handleDelete(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleSort = (newSortBy: 'name' | 'status' | 'date') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: 'name' | 'status' | 'date') => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const renderSearchAndSort = () => (
    <View style={styles.searchSortContainer}>
      <View style={[styles.searchContainer, {backgroundColor: colors.card}]}>
        <TextInput
          style={[styles.searchInput, {color: colors.text}]}
          placeholder="Search by name, email, phone, or vehicle..."
          placeholderTextColor={colors.text + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, {color: colors.text}]}>Sort by:</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              {
                backgroundColor: sortBy === 'name' ? colors.primary : colors.card,
              },
            ]}
            onPress={() => handleSort('name')}>
            <Text
              style={[
                styles.sortButtonText,
                {color: sortBy === 'name' ? '#fff' : colors.text},
              ]}>
              Name {getSortIcon('name')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sortButton,
              {
                backgroundColor: sortBy === 'status' ? colors.primary : colors.card,
              },
            ]}
            onPress={() => handleSort('status')}>
            <Text
              style={[
                styles.sortButtonText,
                {color: sortBy === 'status' ? '#fff' : colors.text},
              ]}>
              Status {getSortIcon('status')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sortButton,
              {
                backgroundColor: sortBy === 'date' ? colors.primary : colors.card,
              },
            ]}
            onPress={() => handleSort('date')}>
            <Text
              style={[
                styles.sortButtonText,
                {color: sortBy === 'date' ? '#fff' : colors.text},
              ]}>
              Date {getSortIcon('date')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPartnerDetailsModal = () => (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: colors.card}]}>
          {selectedPartner && (
            <>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, {color: colors.text}]}>
                  Partner Details
                </Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text style={[styles.closeButton, {color: colors.text}]}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Image
                  source={{uri: selectedPartner.documents.profilePicture}}
                  style={styles.modalProfileImage}
                  defaultSource={require('../../assets/delivery.png')}
                />

                <Text style={[styles.modalName, {color: colors.text}]}>
                  {selectedPartner.name}
                </Text>
                <Text style={[styles.modalEmail, {color: colors.text}]}>
                  {selectedPartner.email}
                </Text>
                <Text style={[styles.modalPhone, {color: colors.text}]}>
                  {selectedPartner.phone}
                </Text>

                <View style={styles.modalSection}>
                  <Text
                    style={[styles.modalSectionTitle, {color: colors.text}]}>
                    Vehicle Information
                  </Text>
                  <Text style={[styles.modalText, {color: colors.text}]}>
                    Type: {selectedPartner.vehicleType}
                  </Text>
                  <Text style={[styles.modalText, {color: colors.text}]}>
                    Number: {selectedPartner.vehicleNumber}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text
                    style={[styles.modalSectionTitle, {color: colors.text}]}>
                    Address
                  </Text>
                  <Text style={[styles.modalText, {color: colors.text}]}>
                    {selectedPartner.address}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text
                    style={[styles.modalSectionTitle, {color: colors.text}]}>
                    Documents
                  </Text>
                  <View style={styles.documentGrid}>
                    <TouchableOpacity style={styles.documentItem}>
                      <Text style={[styles.documentText, {color: colors.text}]}>
                        DL Document
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.documentItem}>
                      <Text style={[styles.documentText, {color: colors.text}]}>
                        POA Document
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.documentItem}>
                      <Text style={[styles.documentText, {color: colors.text}]}>
                        POI Document
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.documentItem}>
                      <Text style={[styles.documentText, {color: colors.text}]}>
                        RC Document
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.documentItem}>
                      <Text style={[styles.documentText, {color: colors.text}]}>
                        Bike Photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text
                    style={[styles.modalSectionTitle, {color: colors.text}]}>
                    Status
                  </Text>
                  <View
                    style={[
                      styles.modalStatusBadge,
                      {
                        backgroundColor:
                          statusColors[selectedPartner.status] + '20',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.modalStatusText,
                        {color: statusColors[selectedPartner.status]},
                      ]}>
                      {statusLabels[selectedPartner.status]}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, {color: colors.text}]}>
            Loading partner requests...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: colors.text}]}>
          Partner Requests
        </Text>
        {/* <Text style={[styles.subtitle, {color: colors.text}]}>
          {filteredRequests.length} of {partnerRequests.length} requests
        </Text> */}
      </View>

      {renderSearchAndSort()}

      <FlatList
        data={filteredRequests}
        renderItem={renderPartnerItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.partnerList}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: colors.text}]}>
              {searchQuery.trim() 
                ? 'No partner requests match your search'
                : 'No partner requests found'
              }
            </Text>
          </View>
        }
      />

      {renderPartnerDetailsModal()}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  partnerList: {
    padding: 16,
  },
  partnerCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  partnerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  partnerDetails: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  partnerEmail: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  partnerPhone: {
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
  vehicleInfo: {
    marginBottom: 12,
  },
  vehicleLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleText: {
    fontSize: 14,
    opacity: 0.8,
  },
  addressInfo: {
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  disapproveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
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
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBody: {
    alignItems: 'center',
  },
  modalProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  modalName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalEmail: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 4,
  },
  modalPhone: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 20,
  },
  modalSection: {
    width: '100%',
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  documentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  documentItem: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 8,
    alignItems: 'center',
  },
  documentText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalStatusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  searchSortContainer: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  searchContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    // paddingVertical: 5,
    marginBottom: 12,
  },
  searchInput: {
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  sortButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 5,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
