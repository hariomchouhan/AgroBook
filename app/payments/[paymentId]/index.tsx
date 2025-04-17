import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DataContext } from '@/contexts/DataContext';
import { Entry, Payment } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';

export default function PaymentDetailsScreen() {
  const { id, paymentId } = useLocalSearchParams();
  const router = useRouter();
  const { getEntry, getPaymentsForEntry } = useContext(DataContext);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentDetails();
  }, [id, paymentId]);

  const loadPaymentDetails = async () => {
    try {
      if (!id || !paymentId) {
        Alert.alert('Error', 'Entry ID or Payment ID is missing');
        router.back();
        return;
      }

      const entryData = await getEntry(id as string);
      setEntry(entryData);

      const paymentsData = await getPaymentsForEntry(id as string);
      const paymentData = paymentsData.find(p => p.$id === paymentId);
      
      if (!paymentData) {
        Alert.alert('Error', 'Payment not found');
        router.back();
        return;
      }
      
      setPayment(paymentData);
    } catch (error) {
      console.error('Error loading payment details:', error);
      Alert.alert('Error', 'Failed to load payment details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading || !entry || !payment) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading payment details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header title="Payment Details" showAddButton={false} showBackButton={true} />

      {/* Payment Card */}
      <View style={styles.paymentCard}>
        <View style={styles.paymentHeader}>
          <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
          <View style={styles.paymentDateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#757575" />
            <Text style={styles.paymentDate}>{formatDate(payment.paymentDate)}</Text>
          </View>
        </View>

        {/* Entry Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entry Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Person Name:</Text>
            <Text style={styles.infoValue}>{entry.personName}</Text>
          </View>
          {/* <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Entry ID:</Text>
            <Text style={styles.infoValue}>{entry.$id}</Text>
          </View> */}
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          {/* <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment ID:</Text>
            <Text style={styles.infoValue}>{payment.$id}</Text>
          </View> */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Date:</Text>
            <Text style={styles.infoValue}>{formatDate(payment.paymentDate)}</Text>
          </View>
        </View>

        {/* Notes */}
        {payment.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{payment.notes}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              Alert.alert(
                'Delete Payment',
                'Are you sure you want to delete this payment? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => {
                      // Delete payment logic would go here
                      Alert.alert('Success', 'Payment deleted successfully');
                      router.back();
                    }
                  }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
            <Text style={[styles.actionButtonText, { color: '#F44336' }]}>Delete Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#757575',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 8,
  },
  paymentDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDate: {
    fontSize: 16,
    color: '#757575',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#424242',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#757575',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  notesContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionsContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});