import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SectionList,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Feather } from '@react-native-vector-icons/feather';
import CommonContainer from '@components/CommonContainer';
import theme from '@utils/Theme';
import { navigate } from '@utils/NavigationUtil';
import { Service } from '@/types';
import { usePartnerServices, useDeleteService } from '@/hooks/useSalonQueries';
import CustomAlert from '@components/CustomAlert';

const ManageServicesScreen = () => {
  const { data, isLoading: loading } = usePartnerServices();
  const { mutate: deleteService } = useDeleteService();
  const [isDeleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | null>(
    null,
  );

  // Group services by category for SectionList
  const services = React.useMemo(() => {
    if (!data?.data) return [];
    const grouped = (data.data as Service[]).reduce(
      (acc: any, service: Service) => {
        const category = service.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(service);
        return acc;
      },
      {},
    );
    return Object.keys(grouped).map(category => ({
      title: category,
      data: grouped[category],
    }));
  }, [data]);

  const handleDelete = (id: string) => {
    setServiceToDeleteId(id);
    setDeleteAlertVisible(true);
  };

  const confirmDelete = () => {
    if (serviceToDeleteId) {
      deleteService(serviceToDeleteId, {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Service deleted successfully',
          });
          setDeleteAlertVisible(false);
          setServiceToDeleteId(null);
        },
        onError: () => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong',
          });
          setDeleteAlertVisible(false);
          setServiceToDeleteId(null);
        },
      });
    }
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.servicePrice}>₹{item.price}</Text>
        </View>
        <Text style={styles.serviceSub}>
          {item.subCategory} • {item.duration} mins • {item.gender}
        </Text>
        {item.description && (
          <Text numberOfLines={2} style={styles.serviceDesc}>
            {item.description}
          </Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigate('AddEditServiceScreen', { service: item })}
        >
          <Feather name="edit-2" size={18} color={theme.colors.primaryDark} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item._id)}
        >
          <Feather name="trash-2" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <CommonContainer
      showBackButton
      title="Manage Services"
      noPadding
      hideHeader={false}
      backgroundColor="#FFFFFF"
    >
      <CustomAlert
        visible={isDeleteAlertVisible}
        title="Delete Service"
        message="Are you sure you want to remove this service? This will update your salon average price."
        iconName="trash-outline"
        iconBgColor="#FEE2E2"
        iconColor="#EF4444"
        onRequestClose={() => setDeleteAlertVisible(false)}
        options={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setDeleteAlertVisible(false),
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: confirmDelete,
          },
        ]}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primaryDark}
            style={{ marginTop: 50 }}
          />
        ) : (
          <SectionList
            sections={services}
            keyExtractor={item => item._id}
            renderItem={renderServiceItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather
                  name="scissors"
                  size={50}
                  color={theme.colors.border}
                />
                <Text style={styles.emptyText}>No services added yet</Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigate('AddEditServiceScreen')}
        >
          <Feather name="plus" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add New Service</Text>
        </TouchableOpacity>
      </View>
    </CommonContainer>
  );
};

export default ManageServicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.md,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 80,
  },
  sectionHeader: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.primaryDark,
    backgroundColor: '#FFFFFF',
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f5ff',
  },
  cardContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  servicePrice: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.md,
    color: theme.colors.primaryDark,
    marginLeft: theme.spacing.sm,
  },
  serviceSub: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  serviceDesc: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: theme.spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.md,
    marginLeft: theme.spacing.sm,
  },
});
