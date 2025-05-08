// import React, { useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
// import { styles } from './styles';
// import { Order, OrderStatus } from './types';

// interface AllOrdersScreenProps {
//     initialTab?: OrderStatus; // Make it optional with ?
//   }

// const mockOrders: Order[] = [
//   {
//     id: 'Order123',
//     customerName: 'Ousmane Maiga',
//     status: 'pending',
//     items: [
//       { product: 'KFC', variant: '3 pieces', quantity: 2 },
//       { product: 'KFC', variant: '4 pieces', quantity: 1 },
//     ],
//     createdAt: new Date(Date.now() - 120000), // 2 minutes ago
//   },
//   {
//     id: 'Order07',
//     customerName: 'Boubacar Maiga',
//     status: 'pending',
//     items: [
//       { product: 'KFC', variant: '3 pieces', quantity: 1 },
//       { product: 'KFC', variant: '6 pieces', quantity: 1 },
//     ],
//     createdAt: new Date(Date.now() - 300000), // 5 minutes ago
//   },
//   {
//     id: 'Order10',
//     customerName: 'Moussa Maiga',
//     status: 'in-progress',
//     items: [
//       { product: 'KFC', variant: '3 pieces', quantity: 1 },
//       { product: 'KFC', variant: '8 pieces', quantity: 1 },
//     ],
//     createdAt: new Date(Date.now() - 120000), // 2 minutes ago
//     notes: 'Extra sauce',
//   },
//   {
//     id: 'Order123',
//     customerName: 'Hama Sidibe',
//     status: 'ready',
//     items: [
//       { product: 'KFC', variant: '3 pieces', quantity: 3 },
//     ],
//     createdAt: new Date(Date.now() - 120000), // 2 minutes ago
//     notes: 'No extra fries',
//   },
// ];


// // Update the component declaration
// const KitchenScreen: React.FC<AllOrdersScreenProps> = ({ initialTab = 'all' }) => {
//     const [activeTab, setActiveTab] = useState<OrderStatus>('pending'); // Default to pending
//   const filteredOrders = activeTab === 'all' 
//     ? mockOrders 
//     : mockOrders.filter(order => order.status === activeTab);

//   const formatTime = (date: Date) => {
//     const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
//     return `${minutes} min ago`;
//   };

//   const getActionButton = (status: OrderStatus) => {
//     switch (status) {
//       case 'pending':
//         return 'Start Cooking';
//       case 'in-progress':
//         return 'Mark as Ready';
//       case 'ready':
//         return 'Send to delivery';
//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Kitchen</Text>
//       </View>

//       <View style={styles.statusTabs}>
//         <TouchableOpacity 
//           style={activeTab === 'all' ? styles.activeTab : styles.tab}
//           onPress={() => setActiveTab('all')}
//         >
//           <Text style={activeTab === 'all' ? styles.activeTabText : styles.tabText}>All Orders</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={activeTab === 'pending' ? styles.activeTab : styles.tab}
//           onPress={() => setActiveTab('pending')}
//         >
//           <Text style={activeTab === 'pending' ? styles.activeTabText : styles.tabText}>Pending</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={activeTab === 'in-progress' ? styles.activeTab : styles.tab}
//           onPress={() => setActiveTab('in-progress')}
//         >
//           <Text style={activeTab === 'in-progress' ? styles.activeTabText : styles.tabText}>In Progress</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={activeTab === 'ready' ? styles.activeTab : styles.tab}
//           onPress={() => setActiveTab('ready')}
//         >
//           <Text style={activeTab === 'ready' ? styles.activeTabText : styles.tabText}>Ready</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView>
//         {filteredOrders.map((order) => (
//           <View key={order.id} style={styles.orderCard}>
//             <View style={styles.orderHeader}>
//               <Text style={styles.orderId}>{order.id}</Text>
//               <Text style={styles.orderTime}>{formatTime(order.createdAt)}</Text>
//             </View>
//             <Text style={styles.customerName}>Name: {order.customerName}</Text>
            
//             {order.items.map((item, index) => (
//               <View key={index} style={styles.item}>
//                 <Text style={styles.itemQuantity}>{item.quantity}x</Text>
//                 <Text>{item.product} of {item.variant}</Text>
//               </View>
//             ))}

//             {order.notes && (
//               <Text style={styles.notes}>Notes: {order.notes}</Text>
//             )}

//             <View style={styles.divider} />

//             <TouchableOpacity style={styles.actionButton}>
//               <Text style={styles.actionButtonText}>{getActionButton(order.status)}</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// export default KitchenScreen;



import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Order, OrderStatus, statusColors } from './types';

interface AllOrdersScreenProps {
  initialTab?: OrderStatus;
}

const mockOrders: Order[] = [
  {
    id: 'Order123',
    customerName: 'Ousmane Maiga',
    status: 'pending',
    items: [
      { product: 'KFC', variant: '3 pieces', quantity: 2 },
      { product: 'KFC', variant: '4 pieces', quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 120000),
  },
  {
    id: 'Order07',
    customerName: 'Boubacar Maiga',
    status: 'pending',
    items: [
      { product: 'KFC', variant: '3 pieces', quantity: 1 },
      { product: 'KFC', variant: '6 pieces', quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 300000),
  },
  {
    id: 'Order10',
    customerName: 'Moussa Maiga',
    status: 'in-progress',
    items: [
      { product: 'KFC', variant: '3 pieces', quantity: 1 },
      { product: 'KFC', variant: '8 pieces', quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 120000),
    notes: 'Extra sauce',
  },
  {
    id: 'Order123',
    customerName: 'Hama Sidibe',
    status: 'ready',
    items: [
      { product: 'KFC', variant: '3 pieces', quantity: 3 },
    ],
    createdAt: new Date(Date.now() - 120000),
    notes: 'No extra fries',
  },
];

const KitchenScreen: React.FC<AllOrdersScreenProps> = ({ initialTab = 'all' }) => {
  const [activeTab, setActiveTab] = useState<OrderStatus>(initialTab);
  const filteredOrders = activeTab === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === activeTab);

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    return `${minutes} min ago`;
  };

  const getActionButton = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Start Cooking';
      case 'in-progress':
        return 'Mark as Ready';
      case 'ready':
        return 'Send to Delivery';
      default:
        return null;
    }
  };

  const getTabLabel = (tab: OrderStatus) => {
    switch (tab) {
      case 'all': return 'All Orders';
      case 'in-progress': return 'In Progress';
      default: return tab.charAt(0).toUpperCase() + tab.slice(1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Kitchen Orders</Text>
      </View>

      <View style={styles.statusTabs}>
        {(['all', 'pending', 'in-progress', 'ready'] as OrderStatus[]).map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[
              styles.tab, 
              activeTab === tab && {
                ...styles.activeTab,
                borderBottomColor: statusColors[tab]
              }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && {
                ...styles.activeTabText,
                color: statusColors[tab]
              }
            ]}>
              {getTabLabel(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <View key={`${order.id}-${order.createdAt.getTime()}`} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{order.id}</Text>
                <Text style={styles.orderTime}>{formatTime(order.createdAt)}</Text>
              </View>
              
              <Text style={styles.customerName}>{order.customerName}</Text>
              
              <View style={styles.itemsContainer}>
                {order.items.map((item, index) => (
                  <View key={`${item.product}-${index}`} style={styles.item}>
                    <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                    <Text style={styles.itemText}>
                      {item.product} ({item.variant})
                    </Text>
                  </View>
                ))}
              </View>

              {order.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{order.notes}</Text>
                </View>
              )}

              <View style={styles.divider} />

              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  { backgroundColor: statusColors[order.status] }
                ]}
                onPress={() => console.log(`Action for ${order.id}`)}
              >
                <Text style={styles.actionButtonText}>
                  {getActionButton(order.status)}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No {activeTab} orders</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default KitchenScreen;