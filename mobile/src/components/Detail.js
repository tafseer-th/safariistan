import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Check, X } from "lucide-react-native";
import AppHeader from "@/components/AppHeader";
import { Badge, EmptyBox, ErrorBox, Loader, T } from "@/components/ui";
import { colors } from "@/lib/theme";
import { formatPrice, getJson, useFetch } from "@/lib/api";
import { param } from "@/lib/data";

// Loads /api/<endpoint>/<slug>/ and renders children(item) inside a scrolling page.
export function DetailScreen({ endpoint, what, children }) {
  const slug = param(useLocalSearchParams().slug);
  const state = useFetch(() => getJson(`/api/${endpoint}/${slug}/`), [slug]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppHeader back />
      {state.loading ? (
        <Loader />
      ) : state.error?.status === 404 ? (
        <EmptyBox message={`This ${what} is no longer available.`} />
      ) : state.error ? (
        <ErrorBox message={`Could not load this ${what}. Check your internet connection.`} onRetry={state.reload} />
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={{ paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
            {children(state.data)}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

// Swipeable photos with a "2 / 5" counter.
export function Gallery({ photos, Fallback }) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const height = Math.round(width * 0.68);
  if (photos.length === 0) {
    return (
      <View style={[styles.galleryEmpty, { height }]}>
        <Fallback size={72} color={colors.green300} />
      </View>
    );
  }
  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        data={photos}
        keyExtractor={(src, i) => `${i}-${src}`}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={{ width, height, backgroundColor: colors.green50 }} contentFit="cover" transition={250} />
        )}
      />
      {photos.length > 1 && (
        <View style={styles.counter}>
          <T weight="semibold" style={{ color: colors.white, fontSize: 12 }}>
            {index + 1} / {photos.length}
          </T>
        </View>
      )}
    </View>
  );
}

// Badge, title, meta line and price — the top of every detail page.
export function TitleBlock({ badge, title, meta, priceLabel, price, original, discount }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
      {badge ? <Badge tone="green">{badge}</Badge> : null}
      <T weight="extrabold" style={styles.title}>
        {title}
      </T>
      {meta?.length ? (
        <View style={styles.metaRow}>
          {meta.filter(Boolean).map(({ Icon, text }) => (
            <View key={text} style={styles.meta}>
              <Icon size={15} color={colors.gray600} />
              <T style={{ color: colors.gray600 }}>{text}</T>
            </View>
          ))}
        </View>
      ) : null}
      {price != null && (
        <View style={styles.priceBox}>
          <T style={{ fontSize: 11, color: colors.gray400 }}>{priceLabel}</T>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <T weight="extrabold" style={{ fontSize: 28, color: colors.green700 }}>
              {formatPrice(price)}
            </T>
            {discount > 0 && (
              <T>
                <T style={{ color: colors.gray400, textDecorationLine: "line-through", fontSize: 13 }}>{formatPrice(original)}</T>{" "}
                <T weight="bold" style={{ color: colors.red500, fontSize: 13 }}>
                  {discount}% off
                </T>
              </T>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

export function Section({ title, children, style }) {
  return (
    <View style={[{ paddingHorizontal: 16, marginTop: 28 }, style]}>
      <T weight="bold" style={{ fontSize: 19 }}>
        {title}
      </T>
      <View style={{ marginTop: 12 }}>{children}</View>
    </View>
  );
}

export function Paragraph({ children }) {
  return <T style={{ color: colors.gray600, lineHeight: 23, fontSize: 14.5 }}>{children}</T>;
}

export function CheckList({ items, negative = false }) {
  return (
    <View style={{ gap: 9 }}>
      {items.map((item) => (
        <View key={item} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
          {negative ? (
            <X size={16} color={colors.red500} style={{ marginTop: 2 }} />
          ) : (
            <Check size={16} color={colors.green600} style={{ marginTop: 2 }} />
          )}
          <T style={{ flex: 1, color: colors.gray700, lineHeight: 20 }}>{item}</T>
        </View>
      ))}
    </View>
  );
}

export function FormSection({ children }) {
  return <View style={{ paddingHorizontal: 16, marginTop: 32 }}>{children}</View>;
}

export function photosOf(item) {
  return [...(item.image ? [item.image] : []), ...(item.images || []).map((i) => i.image)];
}

const styles = StyleSheet.create({
  galleryEmpty: { backgroundColor: colors.green50, alignItems: "center", justifyContent: "center" },
  counter: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  title: { fontSize: 26, lineHeight: 33, marginTop: 10 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", columnGap: 16, rowGap: 6, marginTop: 10 },
  meta: { flexDirection: "row", alignItems: "center", gap: 5 },
  priceBox: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.gray100 },
});
