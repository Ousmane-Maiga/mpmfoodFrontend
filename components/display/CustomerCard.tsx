import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Customer } from '@/types/displayTypes';

interface CustomerCardProps {
  customer: Customer;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  return (
    <View style={styles.container}>
      {/* Customer Image */}
      <View style={styles.imageContainer}>
        {customer.image ? (
          <Image source={{ uri: customer.image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="person" size={60} color="#666" />
          </View>
        )}
      </View>

      {/* Customer Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{customer.name}</Text>
        <Text style={styles.title}>Loyal Customer</Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{customer.ordersThisWeek}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{customer.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
        </View>

        {/* Favorites */}
        {customer.favoriteItems && customer.favoriteItems.length > 0 && (
          <View style={styles.favoritesContainer}>
            <Text style={styles.favoritesTitle}>Favorites:</Text>
            <View style={styles.favoritesList}>
              {customer.favoriteItems.map((item, index) => (
                <View key={index} style={styles.favoriteItem}>
                  <MaterialIcons name="restaurant" size={16} color="#FF6B6B" />
                  <Text style={styles.favoriteText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Loyalty Badge */}
      {customer.ordersThisWeek >= 5 && (
        <View style={styles.badge}>
          <MaterialIcons name="star" size={24} color="#FFD700" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 15,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    width: '45%',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  favoritesContainer: {
    width: '100%',
    marginTop: 10,
  },
  favoritesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  favoritesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    margin: 5,
  },
  favoriteText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#555',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default CustomerCard;