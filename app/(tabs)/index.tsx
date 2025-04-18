import React from "react";
import { DataContext } from "@/contexts/DataContext";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Entry } from "@/types";
import { useContext, useState, useCallback, useEffect } from "react";
import EntryCard from "@/components/ui/EntryCard";
import { FlashList } from "@shopify/flash-list";

type PaymentStatus = "all" | "partially_paid" | "not_paid";

const ITEMS_PER_PAGE = Number(process.env.EXPO_PUBLIC_ITEMS_PER_PAGE) || 10;

export default function HomeScreen() {
  const { loading, error, fetchFilteredEntries } = useContext(DataContext);
  const [selectedFilter, setSelectedFilter] = useState<PaymentStatus>("all");
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [localEntries, setLocalEntries] = useState<Entry[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Initial load
  useEffect(() => {
    const initialLoad = async () => {
      try {
        setIsInitialLoading(true);
        await loadEntries(1, true);
      } catch (err) {
        console.error("Error during initial load:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    initialLoad();
  }, [selectedFilter]);

  const loadEntries = useCallback(
    async (pageNum: number, refresh: boolean = false) => {
      try {
        setLoadingMore(!refresh);

        const result = await fetchFilteredEntries(
          selectedFilter,
          pageNum,
          ITEMS_PER_PAGE
        );

        if (refresh) {
          setLocalEntries(result.entries);
        } else {
          setLocalEntries((prev) => [...prev, ...result.entries]);
        }

        setHasMore(result.total > pageNum * ITEMS_PER_PAGE);
      } catch (err) {
        console.error("Error loading entries:", err);
        Alert.alert("Error", "Failed to load entries. Please try again.", [
          { text: "OK" },
        ]);
      } finally {
        setLoadingMore(false);
      }
    },
    [selectedFilter, fetchFilteredEntries]
  );

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

  const handleFilterChange = async (event: {
    nativeEvent: { selectedSegmentIndex: number };
  }) => {
    const filters: PaymentStatus[] = ["all", "partially_paid", "not_paid"];
    const newFilter = filters[event.nativeEvent.selectedSegmentIndex];
    setSelectedFilter(newFilter);
    setPage(1);
    setLocalEntries([]);
    await loadEntries(1, true);
  };

  return (
    <View style={styles.container}>
      <Header title="AgroBook" showAddButton={true} />

      <View style={styles.filterContainer}>
        <SegmentedControl
          values={["All", "Partially Paid", "Not Paid"]}
          selectedIndex={["all", "partially_paid", "not_paid"].indexOf(
            selectedFilter
          )}
          onChange={handleFilterChange}
          style={styles.segmentedControl}
          appearance="light"
        />
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
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;
            const paddingToBottom = 20;
            const isEndReached =
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom;

            if (isEndReached && !loadingMore && hasMore) {
              console.log("End of scroll reached, loading more...");
              loadMore();
            }
          }}
          scrollEventThrottle={16}
        >
          {localEntries.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-text-outline"
                size={48}
                color="#9E9E9E"
              />
              <Text style={styles.emptyStateText}>No entries found</Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedFilter === "all"
                  ? "Add your first entry to get started"
                  : `No ${selectedFilter.replace("_", " ")} entries found`}
              </Text>
            </View>
          ) : (
            <View style={{ marginBottom: 80 }}>
              <FlashList
                data={localEntries}
                renderItem={({ item }) => <EntryCard entry={item} />}
                estimatedItemSize={60}
              />
              {loadingMore && (
                <View style={styles.loadingMore}>
                  <ActivityIndicator size="small" color="#0066FF" />
                </View>
              )}
            </View>
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
  filterContainer: {
    padding: 16,
  },
  segmentedControl: {
    height: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  loadingMore: {
    padding: 16,
    alignItems: "center",
  },
});
