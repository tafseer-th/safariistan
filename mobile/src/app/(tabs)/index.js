import { useState } from "react";
import { FlatList, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import { router } from "expo-router";
import {
  ArrowRight,
  BedDouble,
  Car,
  Compass,
  Hotel,
  Mail,
  MapPin,
  MessageCircle,
  Mountain,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react-native";
import AppHeader, { FloatingWhatsApp, Logo } from "@/components/AppHeader";
import { DestinationCard, HotelCard, TourCard } from "@/components/Cards";
import { ErrorBox, Loader, SectionHeading, T } from "@/components/ui";
import { colors, fonts, shadow } from "@/lib/theme";
import { API_URL, CONTACT_EMAIL, OFFICE_ADDRESS, WHATSAPP_NUMBER, getFeatured, getJson, prettyPhone, useFetch, whatsappUrl } from "@/lib/api";

const searchTabs = [
  { key: "tours", label: "Tours", Icon: Compass, placeholder: "Search destinations or packages" },
  { key: "hotels", label: "Hotels", Icon: Hotel, placeholder: "Search hotels or locations" },
  { key: "sightseeing", label: "Sightseeing", Icon: Mountain, placeholder: "Search places to visit" },
  { key: "rent-a-car", label: "Rent a car", Icon: Car, placeholder: "Search cars or routes" },
];

const popular = [
  { label: "Hunza", slug: "hunza" },
  { label: "Skardu", slug: "skardu" },
  { label: "Naran Kaghan", slug: "naran-kaghan" },
  { label: "Swat", slug: "swat-kalam" },
  { label: "Fairy Meadows", slug: "fairy-meadows" },
];

const trust = [
  { Icon: ShieldCheck, text: "Private transport" },
  { Icon: BedDouble, text: "Handpicked hotels" },
  { Icon: MessageCircle, text: "Quick quote on WhatsApp" },
];

function Hero() {
  const { height } = useWindowDimensions();
  const [tab, setTab] = useState("tours");
  const [query, setQuery] = useState("");
  const current = searchTabs.find((t) => t.key === tab);

  const player = useVideoPlayer(`${API_URL}/videos/hero-video.mp4`, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const search = () => {
    const q = query.trim();
    router.navigate({ pathname: `/${tab}`, params: q ? { search: q } : {} });
  };

  return (
    <View style={[styles.hero, { minHeight: Math.max(640, height - 120) }]}>
      {/* Poster shows until the video starts (or if it cannot load) */}
      <Image source={{ uri: `${API_URL}/videos/hero-poster.jpg` }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      <LinearGradient
        colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.25)", "rgba(0,0,0,0.65)"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.heroContent}>
        <View style={styles.pill}>
          <Sparkles size={13} color={colors.green300} />
          <T weight="semibold" style={styles.pillText}>
            YOUR PAKISTAN TRAVEL PARTNER
          </T>
        </View>

        <T weight="extrabold" style={styles.h1}>
          Discover the Beauty of{"\n"}
          <Text style={{ color: colors.green400 }}>Northern Pakistan</Text>
        </T>

        <Text style={styles.tagline}>Har safar Aik Nai Kahani</Text>

        <T style={styles.heroText}>Private tours, handpicked hotels and comfortable rides, all planned around you.</T>

        {/* Search card */}
        <View style={styles.searchCard}>
          <View style={styles.tabs}>
            {searchTabs.map(({ key, label, Icon }) => {
              const active = key === tab;
              return (
                <Pressable key={key} onPress={() => setTab(key)} style={[styles.tab, active && styles.tabActive]}>
                  <Icon size={18} color={active ? colors.white : colors.gray600} />
                  <T weight="semibold" style={{ fontSize: 11, color: active ? colors.white : colors.gray600 }} numberOfLines={1}>
                    {label}
                  </T>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.searchBar}>
            <Search size={18} color={colors.gray400} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={current.placeholder}
              placeholderTextColor={colors.gray400}
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={search}
            />
            <Pressable onPress={search} style={({ pressed }) => [styles.searchBtn, pressed && { backgroundColor: colors.green700 }]}>
              <T weight="semibold" style={{ color: colors.white, fontSize: 13 }}>
                Search
              </T>
            </Pressable>
          </View>
        </View>

        <View style={styles.popularRow}>
          <T style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>Popular:</T>
          {popular.map((p) => (
            <Pressable
              key={p.slug}
              onPress={() => router.navigate({ pathname: "/tours", params: { destination: p.slug } })}
              style={({ pressed }) => [styles.popularChip, pressed && { backgroundColor: colors.green600 }]}
            >
              <T style={{ color: colors.white, fontSize: 13 }}>{p.label}</T>
            </Pressable>
          ))}
        </View>

        <View style={styles.trustRow}>
          {trust.map(({ Icon, text }) => (
            <View key={text} style={styles.trustItem}>
              <Icon size={16} color={colors.green400} />
              <T weight="medium" style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>
                {text}
              </T>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// Horizontal card carousel for a home section.
function Carousel({ state, renderCard, what }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(300, width * 0.78);
  if (state.loading) return <Loader />;
  if (state.error) return <ErrorBox message={`${what} could not be loaded right now.`} onRetry={state.reload} />;
  const items = state.data?.results?.slice(0, 8) || [];
  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={(i) => String(i.id)}
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardWidth + 14}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, gap: 14 }}
      renderItem={({ item }) => renderCard(item, cardWidth)}
    />
  );
}

function Destinations() {
  const state = useFetch(async () => {
    let list = await getJson("/api/destinations/?is_popular=true");
    if (list.length === 0) list = await getJson("/api/destinations/");
    return [...list].sort((a, b) => b.tour_count + b.place_count - (a.tour_count + a.place_count)).slice(0, 7);
  });
  if (state.loading) return <Loader />;
  if (state.error) return <ErrorBox message="Destinations could not be loaded right now." onRetry={state.reload} />;
  const [first, ...rest] = state.data;
  if (!first) return null;
  return (
    <View style={styles.mosaic}>
      <DestinationCard destination={first} large height={270} />
      <View style={styles.mosaicGrid}>
        {rest.map((d) => (
          <DestinationCard key={d.id} destination={d} height={190} style={styles.mosaicItem} />
        ))}
      </View>
    </View>
  );
}

function Footer() {
  const items = [
    { Icon: MessageCircle, text: `${prettyPhone(WHATSAPP_NUMBER)} · WhatsApp`, onPress: () => Linking.openURL(whatsappUrl()) },
    CONTACT_EMAIL && { Icon: Mail, text: CONTACT_EMAIL, onPress: () => Linking.openURL(`mailto:${CONTACT_EMAIL}`) },
    OFFICE_ADDRESS && { Icon: MapPin, text: OFFICE_ADDRESS },
  ].filter(Boolean);
  return (
    <View style={styles.footer}>
      <Logo dark />
      <Text style={styles.footerTagline}>Har safar aik nai kahani</Text>
      <T style={styles.footerText}>
        Private and family tours across northern Pakistan, with hotels, transport and sightseeing arranged for you.
      </T>
      <T weight="bold" style={styles.footerHeading}>
        CONTACT US
      </T>
      {items.map(({ Icon, text, onPress }) => (
        <Pressable key={text} onPress={onPress} disabled={!onPress} style={styles.footerItem}>
          <Icon size={16} color={colors.green400} />
          <T style={{ color: colors.gray300, fontSize: 13, flexShrink: 1 }}>{text}</T>
        </Pressable>
      ))}
      <Pressable onPress={() => router.push("/destinations")} style={styles.footerItem}>
        <MapPin size={16} color={colors.green400} />
        <T style={{ color: colors.gray300, fontSize: 13 }}>All destinations</T>
      </Pressable>
      <T style={styles.copyright}>© Safaristan. All rights reserved. Made in Pakistan 🇵🇰</T>
    </View>
  );
}

export default function HomeScreen() {
  const tours = useFetch(() => getFeatured("/api/tours/"));
  const hotels = useFetch(() => getFeatured("/api/hotels/"));

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppHeader />
      <ScrollView keyboardShouldPersistTaps="handled">
        <Hero />

        <View style={styles.section}>
          <SectionHeading
            eyebrow="Handpicked for you"
            title="Featured"
            highlight="tour packages"
            text="Our most loved trips to the north, with hotels, transport and a local guide included."
            linkLabel="All tours"
            onPress={() => router.navigate("/tours")}
          />
          <Carousel state={tours} what="Tours" renderCard={(t, w) => <TourCard tour={t} width={w} />} />
        </View>

        <View style={[styles.section, { paddingTop: 8 }]}>
          <SectionHeading
            eyebrow="Where to next?"
            title="Explore"
            highlight="destinations"
            text="From the lakes of Hunza to the deserts of Skardu, pick a place and see its tours and sights."
            linkLabel="All"
            onPress={() => router.push("/destinations")}
          />
          <Destinations />
        </View>

        <View style={[styles.section, { backgroundColor: "rgba(240,253,244,0.6)" }]}>
          <SectionHeading
            eyebrow="Stay in comfort"
            title="Popular"
            highlight="hotels"
            text="Trusted hotels and resorts in Hunza, Skardu, Naran, Murree and more, at the best rates."
            linkLabel="All hotels"
            onPress={() => router.navigate("/hotels")}
          />
          <Carousel state={hotels} what="Hotels" renderCard={(h, w) => <HotelCard hotel={h} width={w} />} />
        </View>

        {/* Make My Trip call to action */}
        <View style={styles.ctaBand}>
          <T weight="extrabold" style={{ color: colors.white, fontSize: 24, lineHeight: 32 }}>
            Can't find the right package?
          </T>
          <T style={{ color: "rgba(255,255,255,0.85)", marginTop: 6, lineHeight: 21 }}>
            Tell us your plan and we will design a private tour around it.
          </T>
          <Pressable onPress={() => router.push("/make-my-trip")} style={styles.ctaButton}>
            <T weight="semibold" style={{ color: colors.green700 }}>
              Make My Trip
            </T>
            <ArrowRight size={16} color={colors.green700} />
          </Pressable>
        </View>

        <Footer />
      </ScrollView>
      <FloatingWhatsApp />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { justifyContent: "center", backgroundColor: colors.green900, overflow: "hidden" },
  heroContent: { paddingHorizontal: 16, paddingTop: 40, paddingBottom: 48, alignItems: "center" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  pillText: { color: colors.white, fontSize: 10, letterSpacing: 2 },
  h1: {
    marginTop: 22,
    color: colors.white,
    fontSize: 31,
    lineHeight: 38,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 4 },
  },
  tagline: {
    marginTop: 16,
    fontFamily: fonts.display,
    fontSize: 27,
    color: colors.green300,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowRadius: 10,
  },
  heroText: { marginTop: 14, color: "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: 22, textAlign: "center" },
  searchCard: {
    alignSelf: "stretch",
    marginTop: 28,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 10,
    ...shadow.lg,
  },
  tabs: { flexDirection: "row", gap: 6 },
  tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3, borderRadius: 16, paddingVertical: 10 },
  tabActive: { backgroundColor: colors.green600, ...shadow.sm },
  searchBar: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
    borderRadius: 16,
    padding: 6,
    paddingLeft: 12,
  },
  searchInput: { flex: 1, minWidth: 0, fontSize: 13, color: colors.gray800, fontFamily: fonts.regular, paddingVertical: 8 },
  searchBtn: { backgroundColor: colors.green600, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 11 },
  popularRow: { marginTop: 20, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 8 },
  popularChip: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  trustRow: { marginTop: 22, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", columnGap: 18, rowGap: 10 },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  section: { paddingTop: 40, paddingBottom: 12 },
  mosaic: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 28, gap: 12 },
  mosaicGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
  mosaicItem: { width: "48.3%" },
  ctaBand: { margin: 16, marginTop: 32, borderRadius: 24, backgroundColor: colors.green700, padding: 24 },
  ctaButton: {
    marginTop: 18,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  footer: { backgroundColor: colors.gray950, paddingHorizontal: 20, paddingTop: 36, paddingBottom: 110, marginTop: 24 },
  footerTagline: { fontFamily: fonts.display, color: colors.green400, fontSize: 19, marginTop: 14 },
  footerText: { color: colors.gray400, fontSize: 13, lineHeight: 20, marginTop: 8 },
  footerHeading: { color: colors.white, fontSize: 12, letterSpacing: 1.2, marginTop: 26, marginBottom: 6 },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 7 },
  copyright: { color: colors.gray500, fontSize: 12, marginTop: 26, textAlign: "center" },
});
