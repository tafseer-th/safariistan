import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowRight,
  CalendarDays,
  Car,
  Clock,
  Cog,
  Compass,
  Hotel as HotelIcon,
  MapPin,
  Mountain,
  Snowflake,
  UserCheck,
  Users,
} from "lucide-react-native";
import { Badge, T } from "@/components/ui";
import { colors, shadow } from "@/lib/theme";
import { formatPrice } from "@/lib/api";

function Photo({ uri, height, Fallback }) {
  return (
    <View style={{ height, backgroundColor: colors.green50 }}>
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
      ) : (
        <View style={styles.fallback}>
          <Fallback size={56} color={colors.green300} />
        </View>
      )}
    </View>
  );
}

function CardShell({ onPress, width, children }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, width && { width }, pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}
    >
      {children}
    </Pressable>
  );
}

function PriceRow({ label, price, original, hasDiscount }) {
  return (
    <View style={styles.priceRow}>
      <View>
        <T style={styles.priceLabel}>{label}</T>
        <T weight="extrabold" style={styles.price}>
          {formatPrice(price)}
        </T>
      </View>
      {hasDiscount && <T style={styles.strike}>{formatPrice(original)}</T>}
    </View>
  );
}

function Meta({ icon: Icon, children, green }) {
  return (
    <View style={styles.meta}>
      <Icon size={14} color={green ? colors.green600 : colors.gray500} />
      <T style={styles.metaText} numberOfLines={1}>
        {children}
      </T>
    </View>
  );
}

export function TourCard({ tour, width }) {
  const hasDiscount = tour.discount_percent > 0;
  return (
    <CardShell width={width} onPress={() => router.push(`/tours/${tour.slug}`)}>
      <View>
        <Photo uri={tour.image} height={190} Fallback={Compass} />
        {hasDiscount && <Badge tone="red" style={styles.topLeft}>{`${tour.discount_percent}% off`}</Badge>}
        <Badge style={styles.bottomLeft}>{tour.category_display}</Badge>
      </View>
      <View style={styles.body}>
        <T weight="bold" style={[styles.title, { minHeight: 44 }]} numberOfLines={2}>
          {tour.title}
        </T>
        <View style={styles.metaRow}>
          <Meta icon={Clock}>{tour.duration_label}</Meta>
          <Meta icon={MapPin}>From {tour.departure_city_display}</Meta>
        </View>
        <PriceRow label="Per person" price={tour.discounted_price} original={tour.price_per_person} hasDiscount={hasDiscount} />
      </View>
    </CardShell>
  );
}

export function HotelCard({ hotel, width }) {
  const hasDiscount = hotel.discount_percent > 0;
  return (
    <CardShell width={width} onPress={() => router.push(`/hotels/${hotel.slug}`)}>
      <View>
        <Photo uri={hotel.image} height={190} Fallback={HotelIcon} />
        {hasDiscount && <Badge tone="red" style={styles.topLeft}>{`${hotel.discount_percent}% off`}</Badge>}
        <Badge style={styles.bottomLeft}>{hotel.category_display}</Badge>
      </View>
      <View style={styles.body}>
        <T weight="bold" style={styles.title} numberOfLines={1}>
          {hotel.name}
        </T>
        <View style={styles.metaRow}>
          <Meta icon={MapPin}>{hotel.location?.name}</Meta>
          <Meta icon={HotelIcon}>{hotel.hotel_type_display}</Meta>
        </View>
        <PriceRow label="Per night from" price={hotel.discounted_price} original={hotel.price_from} hasDiscount={hasDiscount} />
      </View>
    </CardShell>
  );
}

export function PlaceCard({ place, width }) {
  return (
    <CardShell width={width} onPress={() => router.push(`/sightseeing/${place.slug}`)}>
      <View>
        <Photo uri={place.image} height={190} Fallback={Mountain} />
        <Badge style={styles.bottomLeft} icon={MapPin}>
          {place.destination?.name}
        </Badge>
      </View>
      <View style={styles.body}>
        <T weight="bold" style={styles.title} numberOfLines={1}>
          {place.name}
        </T>
        <T style={styles.desc} numberOfLines={2}>
          {place.short_description}
        </T>
        {place.best_time ? (
          <View style={[styles.priceRow, { justifyContent: "flex-start" }]}>
            <Meta icon={CalendarDays} green>
              Best time: {place.best_time}
            </Meta>
          </View>
        ) : null}
      </View>
    </CardShell>
  );
}

export function driverLabel(option) {
  return option === "self_drive" ? "Self drive" : option === "both" ? "Driver / Self" : "With driver";
}

export function VehicleCard({ vehicle, width }) {
  const hasDiscount = vehicle.discount_percent > 0;
  return (
    <CardShell width={width} onPress={() => router.push(`/rent-a-car/${vehicle.slug}`)}>
      <View>
        <Photo uri={vehicle.image} height={175} Fallback={Car} />
        {hasDiscount && <Badge tone="red" style={styles.topLeft}>{`${vehicle.discount_percent}% off`}</Badge>}
        <Badge style={styles.bottomLeft}>{vehicle.vehicle_type_display}</Badge>
      </View>
      <View style={styles.body}>
        <T weight="bold" style={styles.title} numberOfLines={1}>
          {vehicle.name}
        </T>
        <View style={styles.specGrid}>
          <View style={styles.spec}><Meta icon={Users} green>{vehicle.seats} seats</Meta></View>
          <View style={styles.spec}><Meta icon={Cog} green>{vehicle.transmission_display}</Meta></View>
          <View style={styles.spec}><Meta icon={Snowflake} green>{vehicle.has_ac ? "AC" : "No AC"}</Meta></View>
          <View style={styles.spec}><Meta icon={UserCheck} green>{driverLabel(vehicle.driver_option)}</Meta></View>
        </View>
        <PriceRow label="Per day" price={vehicle.discounted_price} original={vehicle.price_per_day} hasDiscount={hasDiscount} />
      </View>
    </CardShell>
  );
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

// Photo tile for a destination: tap opens its tours; "Places" opens its sightseeing.
export function DestinationCard({ destination: d, height = 210, large = false, style }) {
  const compact = !large; // half-width tiles: tighter padding so both buttons fit
  const counts = [d.tour_count > 0 && plural(d.tour_count, "tour"), d.place_count > 0 && plural(d.place_count, "place")]
    .filter(Boolean)
    .join(" · ");
  const openTours = () => router.navigate({ pathname: "/tours", params: { destination: d.slug } });
  return (
    <Pressable onPress={openTours} style={[styles.dest, { height }, style]}>
      {d.image ? (
        <Image source={{ uri: d.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
      ) : (
        <LinearGradient colors={[colors.green700, colors.green900]} style={[StyleSheet.absoluteFill, styles.fallback]}>
          <MapPin size={large ? 96 : 64} color="rgba(34,197,94,0.4)" />
        </LinearGradient>
      )}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.75)"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.destBody, compact && { padding: 12 }]}>
        <T weight="extrabold" style={{ color: colors.white, fontSize: large ? 28 : 17, lineHeight: large ? 36 : 22 }} numberOfLines={2}>
          {d.name}
        </T>
        {counts ? <T style={styles.destCounts}>{counts}</T> : null}
        <View style={styles.destButtons}>
          <Pressable onPress={openTours} style={[styles.destPrimary, compact && styles.destCompactBtn]}>
            <T weight="semibold" style={{ fontSize: 12, color: colors.green700 }}>
              Tours
            </T>
            <ArrowRight size={13} color={colors.green700} />
          </Pressable>
          <Pressable
            onPress={() => router.navigate({ pathname: "/sightseeing", params: { destination: d.slug } })}
            style={[styles.destSecondary, compact && styles.destCompactBtn]}
          >
            <T weight="semibold" style={{ fontSize: 12, color: colors.white }}>
              Places
            </T>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    overflow: "hidden",
    ...shadow.sm,
  },
  fallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  topLeft: { position: "absolute", top: 12, left: 12 },
  bottomLeft: { position: "absolute", bottom: 12, left: 12 },
  body: { padding: 16 },
  title: { fontSize: 16, lineHeight: 22 },
  desc: { marginTop: 4, color: colors.gray500, fontSize: 13, lineHeight: 19, minHeight: 38 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", columnGap: 16, rowGap: 4, marginTop: 8 },
  meta: { flexDirection: "row", alignItems: "center", gap: 5, flexShrink: 1 },
  metaText: { color: colors.gray500, fontSize: 13 },
  specGrid: { flexDirection: "row", flexWrap: "wrap", rowGap: 8, marginTop: 12 },
  spec: { width: "50%" },
  priceRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceLabel: { fontSize: 11, color: colors.gray400 },
  price: { fontSize: 18, color: colors.green700 },
  strike: { fontSize: 13, color: colors.gray400, textDecorationLine: "line-through" },
  dest: { borderRadius: 16, overflow: "hidden", backgroundColor: colors.green900, ...shadow.sm },
  destBody: { position: "absolute", left: 0, right: 0, bottom: 0, padding: 16 },
  destCounts: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 },
  destButtons: { flexDirection: "row", gap: 8, marginTop: 10 },
  destPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  destCompactBtn: { paddingHorizontal: 11 },
  destSecondary: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
});
