import withContainer from "@/components/withContainer";
import { Colors } from "@/constants/Colors";
import { IFoodItem } from "@/core/interfaces";
import { IScannerController } from "@/core/scanner/scanner.interface";
import { TYPES } from "@/core/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Container } from "inversify";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, // Added ActivityIndicator import
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const ITEM_LIMIT = 10; // Define item limit

function AllItems({ container }: { container: Container }) {
  const [allItems, setAllItems] = useState<IFoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm); // New state for debounced search term
  const [offset, setOffset] = useState<number>(0); // Added offset state
  const [loading, setLoading] = useState<boolean>(false); // Added loading state
  const [hasMore, setHasMore] = useState<boolean>(true); // Added hasMore state
  const router = useRouter();
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams(); // Get URL parameters

  useEffect(() => {
    if (params.q) {
      setSearchTerm(params.q as string);
    } else {
      setSearchTerm("");
    }
  }, [params.q]);

  const scannerController = container.get<IScannerController>(
    TYPES.IScannerController
  );

  // Debounce effect for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 200); // 500ms debounce delay (reverted)

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const loadData = async (newSearch: boolean = false) => {
    if (loading || (!hasMore && !newSearch)) return; // Prevent loading if already loading or no more items

    setLoading(true);
    try {
      const currentOffset = newSearch ? 0 : offset; // Reset offset for new search
      const data = await scannerController.searchFoodItems(
        debouncedSearchTerm, // Use debounced search term
        ITEM_LIMIT,
        currentOffset
      );
      if (newSearch) {
        setAllItems(data);
      } else {
        setAllItems((prevItems) => [...prevItems, ...data]);
      }
      setOffset(currentOffset + data.length); // Update offset
      setHasMore(data.length === ITEM_LIMIT); // Check if more items can be loaded
    } catch (error) {
      console.error("Error loading data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setAllItems([]); // Clear items on focus
      setOffset(0); // Reset offset
      setHasMore(true); // Reset hasMore
    }, [debouncedSearchTerm]) // Depend on debouncedSearchTerm
  );

  // Load data initially and when debouncedSearchTerm changes
  useFocusEffect(
    useCallback(() => {
      loadData(true);
    }, [debouncedSearchTerm])
  );

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadData();
    }
  };

  const renderItem = ({ item }: { item: IFoodItem }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        { borderBottomColor: Colors[colorScheme ?? "light"].tint },
      ]}
      onPress={() => router.push(`/scan/food/${item.id}`)}
    >
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text
          style={[
            styles.itemName,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.itemBrand,
            { color: Colors[colorScheme ?? "light"].icon },
          ]}
        >
          {item.brand}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={allItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      style={{
        flex: 1,
        backgroundColor: "#OOO",
      }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? (
          <View style={styles.loadingFooter}>
            <ActivityIndicator
              size="small"
              color={Colors[colorScheme ?? "light"].text}
            />
            <Text
              style={{
                color: Colors[colorScheme ?? "light"].text,
                marginLeft: 10,
              }}
            >
              Loading items...
            </Text>
          </View>
        ) : null
      }
    />
  );
}

export default withContainer(AllItems);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#3A3A3A",
    borderRadius: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  itemBrand: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    marginLeft: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 0, // Remove individual border
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  loadingFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
});
