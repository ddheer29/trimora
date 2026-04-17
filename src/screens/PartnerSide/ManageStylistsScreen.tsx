import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Feather } from '@react-native-vector-icons/feather';
import CommonContainer from '@components/CommonContainer';
import theme from '@utils/Theme';
import { navigate } from '@utils/NavigationUtil';
import { Stylist } from '@/types';
import { usePartnerStylists, useDeleteStylist } from '@/hooks/useSalonQueries';
import CustomAlert from '@components/CustomAlert';

const ManageStylistsScreen = () => {
  const { data, isLoading: loading } = usePartnerStylists();
  const { mutate: deleteStylist } = useDeleteStylist();
  const [isDeleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [stylistToDeleteId, setStylistToDeleteId] = useState<string | null>(
    null,
  );

  const stylists: Stylist[] = (data?.data as Stylist[]) ?? [];

  const handleDelete = (id: string) => {
    setStylistToDeleteId(id);
    setDeleteAlertVisible(true);
  };

  const confirmDelete = () => {
    if (stylistToDeleteId) {
      deleteStylist(stylistToDeleteId, {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Stylist deleted successfully',
          });
          setDeleteAlertVisible(false);
          setStylistToDeleteId(null);
        },
        onError: () => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong',
          });
          setDeleteAlertVisible(false);
          setStylistToDeleteId(null);
        },
      });
    }
  };

  const renderStylistItem = ({ item }: { item: Stylist }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: (item as any).stylistImage || 'https://via.placeholder.com/100',
        }}
        style={styles.stylistImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.stylistName}>{item.name}</Text>
        <Text style={styles.stylistExp}>
          {item.yearsOfExperience} years experience
        </Text>
        <View style={styles.ratingRow}>
          <Feather name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating || 0}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigate('AddEditStylistScreen', { stylist: item })}
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
      title="Manage Stylists"
      noPadding
      hideHeader={false}
      backgroundColor="#FFFFFF"
    >
      <CustomAlert
        visible={isDeleteAlertVisible}
        title="Delete Stylist"
        message="Are you sure you want to remove this stylist?"
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
          <FlatList
            data={stylists}
            keyExtractor={item => item._id}
            renderItem={renderStylistItem}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="users" size={50} color={theme.colors.border} />
                <Text style={styles.emptyText}>No stylists added yet</Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigate('AddEditStylistScreen')}
        >
          <Feather name="plus" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add New Stylist</Text>
        </TouchableOpacity>
      </View>
    </CommonContainer>
  );
};

export default ManageStylistsScreen;

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
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f5ff',
  },
  stylistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  stylistName: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
  },
  stylistExp: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textPrimary,
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
