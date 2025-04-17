import { StyleSheet, View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useContext, useState, useCallback, useEffect } from 'react';
import { DataContext } from '@/contexts/DataContext';
import Header from '@/components/Header';
import EntryCard from '@/components/ui/EntryCard';
import { Entry } from '@/types';

const ITEMS_PER_PAGE = Number(process.env.EXPO_PUBLIC_ITEMS_PER_PAGE) || 10;

export default function FullPaid() {
  const { loading, error, fetchFilteredEntries } = useContext(DataContext);
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [localEntries, setLocalEntries] = useState<Entry[]>([]);

  const loadEntries = useCallback(async (pageNum: number, refresh: boolean = false) => {
    try {
      setLoadingMore(!refresh);
      const result = await fetchFilteredEntries('full_paid', pageNum, ITEMS_PER_PAGE);
      
      if (refresh) {
        setLocalEntries(result.entries);
      } else {
        setLocalEntries(prev => [...prev, ...result.entries]);
      }
      
      setHasMore(result.total > pageNum * ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Error loading entries:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchFilteredEntries]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await loadEntries(1, true);
    setRefreshing(false);
  }, [loadEntries]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadEntries(nextPage);
    }
  }, [loadingMore, hasMore, page, loadEntries]);

  useEffect(() => {
    loadEntries(1, true);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Completed Entries" showAddButton={false} />
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isEndReached) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {localEntries.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No completed entries found</Text>
            <Text style={styles.emptyStateSubtext}>
              Completed entries will appear here
            </Text>
          </View>
        ) : (
          <>
            {localEntries.map((entry) => (
              <EntryCard key={entry.$id} entry={entry} />
            ))}
            {loadingMore && (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color="#0066FF" />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  loadingMore: {
    padding: 16,
    alignItems: 'center',
  },
});