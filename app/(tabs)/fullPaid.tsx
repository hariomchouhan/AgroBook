import { StyleSheet, View, Text, ScrollView, ActivityIndicator, RefreshControl, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState, useCallback, useEffect } from 'react';
import { DataContext } from '@/contexts/DataContext';
import Header from '@/components/Header';
import EntryCard from '@/components/ui/EntryCard';
import { Entry } from '@/types';
import { Ionicons } from '@expo/vector-icons';

const ITEMS_PER_PAGE = Number(process.env.EXPO_PUBLIC_ITEMS_PER_PAGE) || 10;

export default function FullPaid() {
  const { loading, error, fetchFilteredEntries } = useContext(DataContext);
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [localEntries, setLocalEntries] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    const initialLoad = async () => {
      try {
        setIsInitialLoading(true);
        await loadEntries(1, true);
      } catch (err) {
        console.error('Error during initial load:', err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    initialLoad();
  }, []);

  const loadEntries = useCallback(async (pageNum: number, refresh: boolean = false) => {
    try {
      console.log('Loading entries:', { pageNum, refresh, searchQuery: debouncedSearchQuery });
      setLoadingMore(!refresh);
      
      const result = await fetchFilteredEntries('full_paid', pageNum, ITEMS_PER_PAGE, debouncedSearchQuery);
      console.log('Entries loaded:', { 
        count: result.entries.length, 
        total: result.total,
        page: pageNum 
      });
      
      if (refresh) {
        setLocalEntries(result.entries);
      } else {
        setLocalEntries(prev => [...prev, ...result.entries]);
      }
      
      setHasMore(result.total > pageNum * ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Error loading entries:', err);
      Alert.alert(
        'Error',
        'Failed to load entries. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoadingMore(false);
    }
  }, [fetchFilteredEntries, debouncedSearchQuery]);

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

  // Reset page and reload entries when search query changes
  useEffect(() => {
    setPage(1);
    loadEntries(1, true);
  }, [debouncedSearchQuery]);

  return (
    <View style={styles.container}>
      <Header title="Completed Entries" showAddButton={false} />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by person name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      
      {isInitialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingText}>Loading entries...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const paddingToBottom = 20;
            const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
            
            if (isEndReached && !loadingMore && hasMore) {
              console.log('End of scroll reached, loading more...');
              loadMore();
            }
          }}
          scrollEventThrottle={16}
        >
          {localEntries.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No completed entries found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery ? 'No matches found. Try a different search term.' : 'Completed entries will appear here'}
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
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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