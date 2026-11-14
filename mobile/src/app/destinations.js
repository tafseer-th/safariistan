import { FlatList, RefreshControl, View } from "react-native";
import AppHeader, { FloatingWhatsApp } from "@/components/AppHeader";
import { DestinationCard } from "@/components/Cards";
import { EmptyBox, ErrorBox, Loader, PageHero } from "@/components/ui";
import { colors } from "@/lib/theme";
import { getJson, useFetch } from "@/lib/api";

export default function DestinationsScreen() {
  const state = useFetch(() => getJson("/api/destinations/"));

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppHeader back />
      <FlatList
        data={state.data || []}
        keyExtractor={(d) => String(d.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 8 }}>
            <PageHero
              title="Our"
              highlight="Destinations"
              text="The most beautiful places in Pakistan. Pick a destination to see its tours and sightseeing spots."
            />
          </View>
        }
        renderItem={({ item }) => <DestinationCard destination={item} height={200} style={{ flex: 1 }} />}
        ListEmptyComponent={
          state.loading ? (
            <Loader />
          ) : state.error ? (
            <ErrorBox message="Destinations could not be loaded. Please try again later." onRetry={state.reload} />
          ) : (
            <EmptyBox message="No destinations yet." />
          )
        }
        refreshControl={<RefreshControl refreshing={false} onRefresh={state.reload} colors={[colors.green600]} />}
      />
      <FloatingWhatsApp />
    </View>
  );
}
