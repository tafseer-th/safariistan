import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, RefreshControl, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, ChevronDown, Search, X } from "lucide-react-native";
import AppHeader, { FloatingWhatsApp } from "@/components/AppHeader";
import { EmptyBox, ErrorBox, Loader, PageHero, T } from "@/components/ui";
import { colors, fonts } from "@/lib/theme";
import { usePagedList } from "@/lib/api";

// Bottom sheet with a list of options — the mobile version of a <select>.
export function SelectSheet({ visible, title, options, value, onSelect, onClose }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <T weight="bold" style={{ fontSize: 17 }}>
            {title}
          </T>
          <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Close">
            <X size={22} color={colors.gray500} />
          </Pressable>
        </View>
        <FlatList
          data={options}
          keyExtractor={(o) => String(o.value)}
          style={{ maxHeight: 420 }}
          renderItem={({ item }) => {
            const active = String(item.value) === String(value);
            return (
              <Pressable
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
                style={({ pressed }) => [styles.option, pressed && { backgroundColor: colors.gray50 }]}
              >
                <T weight={active ? "semibold" : "regular"} style={{ color: active ? colors.green700 : colors.gray800, fontSize: 15 }}>
                  {item.label}
                </T>
                {active && <Check size={18} color={colors.green600} />}
              </Pressable>
            );
          }}
        />
      </View>
    </Modal>
  );
}

// Field that looks like the website's select box and opens a SelectSheet.
export function SelectField({ label, options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => String(o.value) === String(value));
  return (
    <View style={{ flex: 1 }}>
      {label ? <T weight="semibold" style={styles.label}>{label}</T> : null}
      <Pressable onPress={() => setOpen(true)} style={styles.select}>
        <T style={{ flex: 1, color: current && current.value !== "" ? colors.gray800 : colors.gray500, fontSize: 14 }} numberOfLines={1}>
          {current ? current.label : placeholder}
        </T>
        <ChevronDown size={16} color={colors.gray500} />
      </Pressable>
      <SelectSheet
        visible={open}
        title={label || placeholder}
        options={options}
        value={value}
        onSelect={onChange}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}

// Filter pill for the horizontal filter row; turns green when a filter is set.
function FilterChip({ filter, value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = filter.options.find((o) => String(o.value) === String(value));
  const active = value !== "" && value !== 0 && value != null;
  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={[styles.chip, active && styles.chipActive]}>
        <T weight="medium" style={{ fontSize: 13, color: active ? colors.white : colors.gray700 }} numberOfLines={1}>
          {active ? current?.label : filter.label}
        </T>
        <ChevronDown size={14} color={active ? colors.white : colors.gray500} />
      </Pressable>
      <SelectSheet
        visible={open}
        title={filter.label}
        options={filter.options}
        value={value}
        onSelect={(v) => onChange(filter.key, v)}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

/**
 * A full list page: header, green title band, search, filter pills, cards with
 * infinite scroll and pull-to-refresh.
 *
 * filters: [{ key, label, options: [{label, value}], toQuery?(value) -> object }]
 * initial: starting filter values (from route params, e.g. ?destination=hunza)
 */
export default function ListScreen({
  endpoint,
  hero,
  searchPlaceholder,
  filters,
  initial,
  noun,
  emptyText,
  renderCard,
}) {
  const blank = Object.fromEntries(filters.map((f) => [f.key, f.options[0].value]));
  const [values, setValues] = useState({ ...blank, ...initial.filters });
  const [searchInput, setSearchInput] = useState(initial.search || "");
  const [search, setSearch] = useState(initial.search || "");

  // Opening this tab again with new params (e.g. a destination from Home) resets the filters.
  const initialKey = JSON.stringify(initial);
  useEffect(() => {
    setValues({ ...blank, ...initial.filters });
    setSearchInput(initial.search || "");
    setSearch(initial.search || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey]);

  // Wait 0.4 s after typing before searching, like the website.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const query = { search };
  filters.forEach((f) => {
    const v = values[f.key];
    Object.assign(query, f.toQuery ? f.toQuery(v) : { [f.key]: v });
  });

  const list = usePagedList(endpoint, query);
  const anyFilter = search !== "" || filters.some((f) => String(values[f.key]) !== String(blank[f.key]));

  const reset = () => {
    setValues(blank);
    setSearchInput("");
    setSearch("");
  };

  const header = (
    <View>
      <PageHero {...hero} />
      <View style={styles.filterCard}>
        <View style={styles.searchBox}>
          <Search size={16} color={colors.gray400} />
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.gray400}
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => setSearch(searchInput.trim())}
          />
          {searchInput ? (
            <Pressable onPress={() => setSearchInput("")} hitSlop={10}>
              <X size={16} color={colors.gray400} />
            </Pressable>
          ) : null}
        </View>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(f) => f.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingTop: 12 }}
          renderItem={({ item }) => (
            <FilterChip filter={item} value={values[item.key]} onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))} />
          )}
        />
        <View style={styles.countRow}>
          <T style={{ color: colors.gray500, fontSize: 13 }}>
            {list.loading ? "Loading…" : `${list.count} ${noun}${list.count === 1 ? "" : "s"} found`}
          </T>
          {anyFilter && (
            <Pressable onPress={reset} hitSlop={8}>
              <T weight="semibold" style={{ color: colors.green700, fontSize: 13 }}>
                Reset filters
              </T>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <AppHeader />
      <FlatList
        data={list.loading || list.error ? [] : list.items}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={header}
        renderItem={({ item }) => <View style={styles.cardWrap}>{renderCard(item)}</View>}
        ListEmptyComponent={
          list.loading ? (
            <Loader />
          ) : list.error ? (
            <ErrorBox onRetry={list.retry} />
          ) : (
            <EmptyBox message={emptyText} />
          )
        }
        ListFooterComponent={
          list.loadingMore ? <ActivityIndicator color={colors.green600} style={{ marginVertical: 24 }} /> : <View style={{ height: 90 }} />
        }
        onEndReached={list.loadMore}
        onEndReachedThreshold={0.6}
        refreshControl={<RefreshControl refreshing={list.refreshing} onRefresh={list.refresh} colors={[colors.green600]} />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
      <FloatingWhatsApp />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  filterCard: {
    margin: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, paddingVertical: 11, fontSize: 14, color: colors.gray800, fontFamily: fonts.regular },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: 220,
  },
  chipActive: { backgroundColor: colors.green600, borderColor: colors.green600 },
  countRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  cardWrap: { paddingHorizontal: 16, paddingVertical: 10 },
  label: { fontSize: 12, color: colors.gray500, marginBottom: 5 },
  select: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.white,
    gap: 6,
  },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 8,
  },
  sheetHandle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: colors.gray300, marginTop: 10 },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
  },
});
